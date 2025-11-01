/**
 * Monetization Service - RevenueCat integration and Stripe checkout
 */

import type { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform, NativeModules } from 'react-native';
import { supabase } from './supabase';

const RC_API_KEY_IOS = Constants.expoConfig?.extra?.revenueCatApiKeyIOS || '';
const RC_API_KEY_ANDROID = Constants.expoConfig?.extra?.revenueCatApiKeyAndroid || '';

type PurchasesModule = typeof import('react-native-purchases').default;

let purchasesModule: PurchasesModule | null | undefined;

const moduleUnavailableMessage =
  'RevenueCat native module is unavailable. This feature requires a development build or standalone app.';

const loadPurchasesModule = (): PurchasesModule | null => {
  if (purchasesModule !== undefined) {
    return purchasesModule;
  }

  if (Constants.appOwnership === 'expo') {
    console.warn(`${moduleUnavailableMessage} (Expo Go detected)`);
    purchasesModule = null;
    return purchasesModule;
  }

  if (!('RNPurchases' in NativeModules)) {
    console.warn(moduleUnavailableMessage);
    purchasesModule = null;
    return purchasesModule;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const moduleExports = require('react-native-purchases');
    purchasesModule = (moduleExports?.default ?? moduleExports) as PurchasesModule;
  } catch (error) {
    console.warn(moduleUnavailableMessage, error);
    purchasesModule = null;
  }

  return purchasesModule || null;
};

// Initialize RevenueCat
export const initializePurchases = async (userId: string) => {
  const apiKey = Platform.select({
    ios: RC_API_KEY_IOS,
    android: RC_API_KEY_ANDROID,
  });

  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return;
  }

  try {
    await Purchases.configure({ apiKey, appUserID: userId });
    console.log('RevenueCat initialized for user:', userId);
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
};

// Get current customer info
export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return null;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return null;
  }
};

// Check if user has pro entitlement
export const checkProEntitlement = async (): Promise<boolean> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['pro'] !== undefined;
  } catch (error) {
    console.error('Failed to check pro entitlement:', error);
    return false;
  }
};

// Get available offerings
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
};

// Start Stripe Checkout session (US-only web checkout)
export const startCheckout = async (plan: 'monthly' | 'annual'): Promise<void> => {
  try {
    // Call Supabase Edge Function to create Stripe Checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { plan },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.url) {
      throw new Error('No checkout URL returned');
    }

    // Open Stripe Checkout in browser
    const result = await WebBrowser.openBrowserAsync(data.url);

    if (result.type === 'cancel') {
      console.log('User cancelled checkout');
    }

    // After checkout completes, refresh customer info
    // The webhook will update the database, and we pull from RevenueCat
    await refreshCustomerInfo();
  } catch (error) {
    console.error('Failed to start checkout:', error);
    throw error;
  }
};

// Refresh customer info from RevenueCat
export const refreshCustomerInfo = async (): Promise<CustomerInfo | null> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return null;
  }

  try {
    // Force a sync with RevenueCat servers
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('Failed to refresh customer info:', error);
    return null;
  }
};

// Restore purchases (for users who reinstall or switch devices)
export const restorePurchases = async (): Promise<CustomerInfo | null> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return null;
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return null;
  }
};

// Sign out (clear RevenueCat user ID)
export const signOutPurchases = async (): Promise<void> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return;
  }

  try {
    await Purchases.logOut();
    console.log('RevenueCat user logged out');
  } catch (error) {
    console.error('Failed to log out from RevenueCat:', error);
  }
};

// Get pricing for display (from RevenueCat)
export const getPricingInfo = async (): Promise<{
  monthly: string | null;
  annual: string | null;
} | null> => {
  const Purchases = loadPurchasesModule();

  if (!Purchases) {
    return null;
  }

  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) return null;

    const monthly = offerings.current.monthly?.product.priceString || null;
    const annual = offerings.current.annual?.product.priceString || null;

    return { monthly, annual };
  } catch (error) {
    console.error('Failed to get pricing info:', error);
    return null;
  }
};

