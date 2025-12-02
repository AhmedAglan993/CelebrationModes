export enum Occasion {
  Birthday = "Birthday",
  Anniversary = "Anniversary",
  Graduation = "Graduation",
  Engagement = "Engagement",
  Other = "Other"
}

// Changed to string to allow dynamic addition of themes from config
export type ThemeId = string;

export interface Theme {
  id: ThemeId;
  name: string;
  previewUrl: string;
  bgUrl: string;
  overlayColor: string;
}

export interface CelebrationData {
  guestName: string;
  occasion: Occasion;
  message: string;
  themeId: ThemeId;
}
