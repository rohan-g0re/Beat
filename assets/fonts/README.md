# Fonts

Custom fonts for FitTracker app.

## System Fonts (Default)

By default, the app uses iOS/Android system fonts (San Francisco / Roboto).
No custom fonts are required for MVP.

## Custom Fonts (Optional)

If you want to use custom fonts:

1. Place font files here (`.ttf` or `.otf`)
2. Update `app.config.ts`:

```typescript
export default {
  // ...
  plugins: [
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Inter-Regular.ttf',
          './assets/fonts/Inter-Bold.ttf',
        ],
      },
    ],
  ],
};
```

3. Load fonts in your app:

```typescript
import * as Font from 'expo-font';

await Font.loadAsync({
  'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
  'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
});
```

## Recommended Fonts

- **Inter** - Modern, clean, excellent for fitness apps
- **SF Pro** (iOS system font) - No file needed, use 'System'
- **Roboto** (Android system font) - No file needed, use 'System'

## Font Licensing

Ensure any custom fonts you use are:
- Licensed for app distribution
- Properly attributed in your app
- Compliant with font license terms

