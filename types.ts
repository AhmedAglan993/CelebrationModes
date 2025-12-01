export enum Occasion {
  Birthday = "Birthday",
  Anniversary = "Anniversary",
  Graduation = "Graduation",
  Engagement = "Engagement",
  Other = "Other"
}

export type ThemeId = 'elegant-dark' | 'golden-lights' | 'colorful-balloons' | 'pink-flowers' | 'neon-party';

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
