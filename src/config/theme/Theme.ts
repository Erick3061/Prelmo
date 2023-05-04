import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme } from '@react-navigation/native';
import { ThemeBase } from '../../types/types';
import { typescale } from '../typescale';
import Color from 'color';

const whiteTheme: ThemeBase = {
  dark: false,
  roundness: 4,
  fonts: typescale,
  colors: {
    primary: "rgb(111,57,150)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(243, 218, 255)",
    onPrimaryContainer: "rgb(47, 0, 77)",
    secondary: "rgb(103, 90, 110)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(239, 220, 245)",
    onSecondaryContainer: "rgb(34, 23, 41)",
    tertiary: "rgb(129, 81, 84)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 218, 219)",
    onTertiaryContainer: "rgb(51, 16, 20)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "rgb(234, 223, 234)",
    onSurfaceVariant: "rgb(75, 69, 77)",
    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(205, 195, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(246, 239, 243)",
    inversePrimary: "rgb(226, 182, 255)",
    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    backdrop: "rgba(52, 46, 55, 0.4)",
    info: '#3fc3ee',
    danger: '#ff7782',
    warning: '#dfd32b',
    success: '#3acf9e',
    question: '#87adbd',
    test: '#2bcadf',
    other: '#977220'
  }
};

const darkTheme: ThemeBase = {
  dark: true,
  roundness: 4,
  fonts: typescale,
  colors: {
    primary: "rgb(226, 182, 255)",
    onPrimary: "rgb(74, 15, 113)",
    primaryContainer: "rgb(98, 44, 137)",
    onPrimaryContainer: "rgb(243, 218, 255)",
    secondary: "rgb(210, 193, 217)",
    onSecondary: "rgb(56, 44, 63)",
    secondaryContainer: "rgb(79, 66, 86)",
    onSecondaryContainer: "rgb(239, 220, 245)",
    tertiary: "rgb(244, 183, 186)",
    onTertiary: "rgb(76, 37, 40)",
    tertiaryContainer: "rgb(102, 59, 62)",
    onTertiaryContainer: "rgb(255, 218, 219)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(29, 27, 30)",
    onBackground: "rgb(231, 224, 229)",
    surface: "rgb(29, 27, 30)",
    onSurface: "rgb(231, 224, 229)",
    surfaceVariant: "rgb(75, 69, 77)",
    onSurfaceVariant: "rgb(205, 195, 206)",
    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(75, 69, 77)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 224, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(111,57,150)",
    surfaceDisabled: "rgba(231, 224, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 224, 229, 0.38)",
    backdrop: "rgba(52, 46, 55, 0.4)",
    info: '#3fc3ee',
    danger: '#ff7782',
    warning: '#dfd32b',
    success: '#3acf9e',
    question: '#87adbd',
    test: '#2bcadf',
    other: '#977220'
  }
};

const CombinedLightTheme: ThemeBase & Theme = {
  ...NavigationDefaultTheme,
  ...whiteTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...whiteTheme.colors,
    text: whiteTheme.colors.onSurface,
    border: whiteTheme.colors.primary,
    info: Color(whiteTheme.colors.info).darken(.3).toString(),
    danger: Color(whiteTheme.colors.danger).darken(.3).toString(),
    warning: Color(whiteTheme.colors.warning).darken(.3).toString(),
    success: Color(whiteTheme.colors.success).darken(.3).toString(),
    question: Color(whiteTheme.colors.question).darken(.3).toString(),
    test: Color(whiteTheme.colors.test).darken(.3).toString(),
    notification: whiteTheme.colors.primary,
  },
};

const CombinedDarkTheme: ThemeBase & Theme = {
  ...NavigationDarkTheme,
  ...darkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...darkTheme.colors,
    text: darkTheme.colors.onSurface,
    border: darkTheme.colors.primary,
    notification: darkTheme.colors.primary,
  },
};

export { CombinedDarkTheme, CombinedLightTheme };