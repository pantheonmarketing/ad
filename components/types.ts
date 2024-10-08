export interface GeneratedAd {
  topText: string;
  bottomText: string;
  topFont: string;
  bottomFont: string;
  topFontSize: number;
  bottomFontSize: number;
  topTextColor: string;
  bottomTextColor: string;
  topTextCase: string;
  bottomTextCase: string;
  topTextAlignment: string;
  bottomTextAlignment: string;
  topTextOutline: boolean;
  bottomTextOutline: boolean;
  topAutoBreak: boolean;
  bottomAutoBreak: boolean;
  imageSize: number;
  imagePositionX: number;
  imagePositionY: number;
  backgroundOverlay: number;
  exportSize: { width: number; height: number };
  topPadding?: number;
  bottomPadding?: number;
  topCanvColor?: string;
  bottomCanvColor?: string;
  topCanvColorEnabled?: boolean;
  bottomCanvColorEnabled?: boolean;
  hideTextAreas?: boolean;
  [key: string]: string | number | boolean | { width: number; height: number } | undefined;
}