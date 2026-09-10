// src/theme/responsive.ts
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Base width used for design (e.g., 375 for iPhone 11)
const BASE_WIDTH = 375;

export const moderateScale = (size: number, factor: number = 0.5) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  return size + (scale * size - size) * factor;
};

export const verticalScale = (size: number) => {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const baseHeight = 667; // base height for iPhone 11
  const scale = SCREEN_HEIGHT / baseHeight;
  return size * scale;
};

export const scale = (size: number) => size * (SCREEN_WIDTH / BASE_WIDTH);
