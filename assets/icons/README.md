# Icons

Custom SVG icons for FitTracker app.

## Default: Expo Vector Icons

The app uses `@expo/vector-icons` by default, which includes:
- **Ionicons** - iOS-style icons
- **MaterialIcons** - Android Material Design icons
- **FontAwesome** - Popular icon set
- And many more...

No custom SVG files needed for MVP.

## Custom SVG Icons (Optional)

If you need custom icons:

1. Export SVG files from Figma/design tool
2. Place them here
3. Use `react-native-svg` to render:

```typescript
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';

const iconSvg = Asset.fromModule(require('./icons/custom-icon.svg'));
<SvgXml xml={iconSvg} width={24} height={24} />
```

Or use a library like `react-native-svg-transformer` for easier imports.

## Icon Guidelines

- Use 24x24px as base size (scale with `width`/`height` props)
- Keep SVGs optimized (use SVGO)
- Use single color with `currentColor` for themeable icons
- Maintain consistent stroke width across icons

## Icon Resources

- [Ionicons](https://ionic.io/ionicons) - Free, MIT license
- [Heroicons](https://heroicons.com/) - Free, MIT license
- [Lucide](https://lucide.dev/) - Free, ISC license
- [Feather Icons](https://feathericons.com/) - Free, MIT license

