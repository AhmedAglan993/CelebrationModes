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
 * Supported extension: .jpg (simplifies scanning).
 */
export const scanForLocalThemes = async (): Promise<Theme[]> => {
  const localThemes: Theme[] = [];
  let index = 1;
  const maxImages = 50; // Limit to prevent infinite loops

  while (index <= maxImages) {
    const imageUrl = `backgrounds/${index}.jpg`;
    
    try {
      // We use HEAD method (or just fetch) to see if file exists
      const response = await fetch(imageUrl, { method: 'HEAD' });
      
      if (response.ok) {
        localThemes.push({
          id: `local-custom-${index}`,
          name: `Custom ${index}`,
          previewUrl: imageUrl,
          bgUrl: imageUrl,
          overlayColor: 'bg-black/40' // Default overlay for custom images
        });
      } else {
        // If 1.jpg exists but 2.jpg is missing, we stop scanning.
        // This requires files to be sequential.
        break;
      }
    } catch (e) {
      // Fetch error (network etc), break loop
      break;
    }
    index++;
  }
  
  return localThemes;
};

// Helper for looking up a theme from a provided list
export const getThemeFromList = (id: string, themeList: Theme[]): Theme => {
  return themeList.find(t => t.id === id) || themeList[0];
};