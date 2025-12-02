# PWA Setup Instructions

Your Celebration Board app is now configured as a Progressive Web App (PWA)! 🎉

## What's Been Done

✅ Added `vite-plugin-pwa` to the project
✅ Configured service worker for offline support
✅ Set up caching for fonts, images, and backgrounds
✅ Added PWA manifest with app metadata
✅ Created SVG icon template
✅ Added PWA meta tags to HTML

## Steps to Complete Setup

### 1. Install Dependencies

Run this command to install the PWA plugin:

```bash
npm install
```

### 2. Generate PNG Icons

The app needs two PNG icons (192x192 and 512x512). You have two options:

#### Option A: Use the Icon Generator (Easiest)

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/icon-generator.html`
3. Click the download buttons to save both icons
4. Save them as `icon-192.png` and `icon-512.png` in the `public` folder

#### Option B: Use an Online Tool

1. Open `public/icon.svg` in your browser
2. Use an online SVG to PNG converter like:
   - https://svgtopng.com/
   - https://cloudconvert.com/svg-to-png
3. Convert to 192x192 and 512x512 sizes
4. Save as `icon-192.png` and `icon-512.png` in the `public` folder

#### Option C: Create Your Own Icons

Replace `public/icon.svg` with your own design, then use Option A or B above.

### 3. Build and Test

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

### 4. Test PWA Installation

1. Open the preview URL in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install the app
4. The app should now work offline!

## PWA Features Enabled

### 📱 Installable
- Users can install the app on their devices
- Works on mobile (iOS/Android) and desktop

### 🔌 Offline Support
- Service worker caches essential files
- App works without internet connection
- Custom backgrounds are cached for 7 days
- Unsplash images cached for 30 days
- Fonts cached for 1 year

### ⚡ Auto-Update
- Service worker automatically updates when you deploy new versions
- Users get the latest version without manual refresh

### 🎨 Native Feel
- Standalone display mode (no browser UI)
- Custom theme color (#0f2123)
- Splash screen support
- Works in any orientation

## Caching Strategy

- **App Shell**: Cached on install (HTML, CSS, JS)
- **Google Fonts**: Cache-first, 1 year expiration
- **Unsplash Images**: Cache-first, 30 days expiration
- **Custom Backgrounds**: Cache-first, 7 days expiration
- **Firebase Data**: Network-first (always fresh when online)

## Testing Checklist

- [ ] Icons generated and placed in `public/` folder
- [ ] Dependencies installed (`npm install`)
- [ ] Production build successful (`npm run build`)
- [ ] Install prompt appears in browser
- [ ] App installs successfully
- [ ] App works offline after first load
- [ ] Service worker updates automatically

## Troubleshooting

### Icons Not Showing
- Make sure `icon-192.png` and `icon-512.png` exist in the `public` folder
- Clear browser cache and rebuild

### Install Prompt Not Appearing
- PWA install prompts only work on HTTPS or localhost
- Some browsers require user engagement before showing the prompt
- Check browser console for PWA errors

### Service Worker Not Updating
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Clear site data in browser DevTools
- Unregister old service workers in DevTools > Application > Service Workers

## Deployment Notes

When deploying to production:
1. Ensure your hosting supports HTTPS (required for PWA)
2. Configure proper cache headers
3. Test the install flow on multiple devices
4. Consider adding an install prompt UI for better discoverability

## Next Steps

Consider adding:
- Custom install prompt UI
- Update notification when new version is available
- Offline fallback page
- Background sync for Firebase updates
- Push notifications for celebration reminders

Enjoy your PWA! 🚀
