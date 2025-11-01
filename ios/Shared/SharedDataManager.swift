/**
 * SharedDataManager - Read/write streak/activity to UserDefaults (App Group)
 * 
 * This class provides a bridge between the React Native app and iOS Widget
 * using an App Group shared container.
 */

import Foundation

class SharedDataManager {
    static let shared = SharedDataManager()
    
    // App Group identifier (must match in entitlements)
    private let appGroupIdentifier = "group.com.fittracker.app"
    
    // UserDefaults keys
    private let widgetDataKey = "widgetData"
    
    private var userDefaults: UserDefaults? {
        return UserDefaults(suiteName: appGroupIdentifier)
    }
    
    private init() {}
    
    // MARK: - Write Data (called from React Native)
    
    /// Save widget data to App Group
    /// Called from React Native via native module
    func saveWidgetData(_ data: WidgetData) {
        guard let defaults = userDefaults else {
            print("Error: Could not access App Group UserDefaults")
            return
        }
        
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        
        do {
            let encoded = try encoder.encode(data)
            defaults.set(encoded, forKey: widgetDataKey)
            defaults.synchronize()
            
            // Trigger widget reload
            WidgetCenter.shared.reloadAllTimelines()
            
            print("Widget data saved successfully")
        } catch {
            print("Error encoding widget data: \(error)")
        }
    }
    
    // MARK: - Read Data (called from Widget)
    
    /// Load widget data from App Group
    /// Called from Widget Timeline Provider
    func loadWidgetData() -> WidgetData {
        guard let defaults = userDefaults else {
            print("Error: Could not access App Group UserDefaults")
            return WidgetData.empty
        }
        
        guard let data = defaults.data(forKey: widgetDataKey) else {
            print("No widget data found")
            return WidgetData.empty
        }
        
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        
        do {
            let decoded = try decoder.decode(WidgetData.self, from: data)
            return decoded
        } catch {
            print("Error decoding widget data: \(error)")
            return WidgetData.empty
        }
    }
    
    // MARK: - Clear Data
    
    func clearWidgetData() {
        userDefaults?.removeObject(forKey: widgetDataKey)
        userDefaults?.synchronize()
    }
}

