import { Theme } from "./types";

/**
 * DEFAULT THEMES
 * These are always available.
 */
export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    previewUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop',
    overlayColor: 'bg-background-dark/90'
  },
  {
    id: 'golden-lights',
    name: 'Golden Lights',
    previewUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/60'
  },
  {
    id: 'colorful-balloons',
    name: 'Balloons',
    previewUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/40'
  },
  {
    id: 'pink-flowers',
    name: 'Floral',
    previewUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=2574&auto=format&fit=crop',
    overlayColor: 'bg-black/50'
  },
  {
    id: 'neon-party',
    name: 'Neon Party',
    previewUrl: 'https://images.unsplash.com/photo-1495058489687-00439542a781?q=80&w=400&auto=format&fit=crop',
    bgUrl: 'https://images.unsplash.com/photo-1495058489687-00439542a781?q=80&w=2670&auto=format&fit=crop',
    overlayColor: 'bg-indigo-950/80'
  }
];

/**
 * Scans for local images in the /backgrounds/ folder.
 * It looks for 1.jpg, 2.jpg, 3.jpg etc. 
 * Naming convention: Files must be named sequentially starting from 1.
 * Supported extensions: jpg, jpeg, png, webp.
 */
export const scanForLocalThemes = async (): Promise<Theme[]> => {
  const localThemes: Theme[] = [];
  let index = 1;
  const maxImages = 50;
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];

  console.log("Starting theme scan...");

  while (index <= maxImages) {
    let found = false;

    for (const ext of extensions) {
      // Use absolute path to ensure we scan from root, regardless of current route
      const imageUrl = `/backgrounds/${index}.${ext}`;

      try {
        // Use GET instead of HEAD to avoid 405 Method Not Allowed on some static servers
        const response = await fetch(imageUrl, { method: 'GET' });

        if (response.ok) {
          // IMPORTANT: Check content type to ensure we didn't get the index.html fallback
          const contentType = response.headers.get('content-type');
          console.log(`Checking ${imageUrl}: ${response.status}, content-type: ${contentType}`);
          if (contentType && contentType.startsWith('image/')) {
            console.log(`✓ Found custom theme: ${imageUrl}`);
            localThemes.push({
              id: `local-custom-${index}`,
              name: `Custom ${index}`,
              previewUrl: imageUrl,
              bgUrl: imageUrl,
              overlayColor: 'bg-black/40'
            });
            found = true;
            break; // Stop checking extensions for this index
          } else {
            console.log(`✗ ${imageUrl} is not an image (content-type: ${contentType})`);
          }
        }
      } catch (e) {
        // Continue to next extension
      }
    }

    if (!found) {
      // If we didn't find "1.jpg" (or other extensions), we assume the sequence ends.
      // We don't check for "2.jpg" if "1.jpg" is missing.
      break;
    }
    index++;
  }

  console.log(`Scan complete. Found ${localThemes.length} custom themes.`);
  return localThemes;
};

// Helper for looking up a theme from a provided list
export const getThemeFromList = (id: string, themeList: Theme[]): Theme => {
  return themeList.find(t => t.id === id) || themeList[0];
};