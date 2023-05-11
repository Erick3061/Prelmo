import { Events } from "../interfaces/interfaces";

export type Saved = 'save' | 'saveBiometry' | null;
export type statusApp = 'checking' | 'unlogued' | 'logued';
export type TypeReport = 'ap-ci' | 'event-alarm' | 'batery' | 'state' | 'apci-week';
export type TypeReportDownload = 'ap-ci' | 'alarm' | 'batery' | 'state' | 'ap-ci-week';
export type typeAccount = number;
export type HeaderTableValues = Array<{ title: string, keys?: Array<keyof Events>, size?: number, center?: boolean }>;
export type statusCheckBox = 'checked' | 'unchecked';

export enum Service {
    'Keychain-Saved' = 'LogIn-Prelmo-Saved',
    'Keychain-Saved-Biometry' = 'LogIn-Prelmo-Saved-Biometry',
    'Encrypted-Domain' = 'Prelmo-Domain',
    'Encrypted-Saved' = 'Prelmo-Saved',
    'Encrypted-Token' = 'Prelmo-Token',
    'Encrypted-RefreshToken' = 'Prelmo-Refresh-Token',
}
export enum MIMETypes {
    'pdf' = 'application/pdf',
    'xlsx' = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'desc' = ''
}


export declare type Colors = {
    primary: string;
    primaryContainer: string;
    secondary: string;
    secondaryContainer: string;
    tertiary: string;
    tertiaryContainer: string;
    surface: string;
    surfaceVariant: string;
    surfaceDisabled: string;
    background: string;
    error: string;
    errorContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    onSecondary: string;
    onSecondaryContainer: string;
    onTertiary: string;
    onTertiaryContainer: string;
    onSurface: string;
    onSurfaceVariant: string;
    onSurfaceDisabled: string;
    onError: string;
    onErrorContainer: string;
    onBackground: string;
    outline: string;
    outlineVariant: string;
    inverseSurface: string;
    inverseOnSurface: string;
    inversePrimary: string;
    shadow: string;
    scrim: string;
    backdrop: string;
    info: string,
    danger: string,
    warning: string,
    success: string,
    question: string
    test: string;
    other: string;
};

export declare enum TypescaleKey {
    displayLarge = "displayLarge",
    displayMedium = "displayMedium",
    displaySmall = "displaySmall",
    headlineLarge = "headlineLarge",
    headlineMedium = "headlineMedium",
    headlineSmall = "headlineSmall",
    titleLarge = "titleLarge",
    titleMedium = "titleMedium",
    titleSmall = "titleSmall",
    labelLarge = "labelLarge",
    labelMedium = "labelMedium",
    labelSmall = "labelSmall",
    bodyLarge = "bodyLarge",
    bodyMedium = "bodyMedium",
    bodySmall = "bodySmall"
}

export declare type Font = {
    fontFamily: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
};

export declare type Type = {
    fontFamily: string;
    letterSpacing: number;
    fontWeight: Font['fontWeight'];
    lineHeight: number;
    fontSize: number;
};

export declare type Typescale = {
    [key in TypescaleKey]: Type;
} & {
    ['default']: Omit<Type, 'lineHeight' | 'fontSize'>;
};

export declare type ThemeBase = {
    dark: boolean;
    roundness: number;
    colors: Colors;
    fonts: Typescale;
};

export type filterEvents = "ALL" | "AP" | "CI" | "APCI" | "Alarm" | "Prue" | "Bat" | "otros";

export const AP = ["O", "OS", "US11"];
export const CI = ["C", "CS", "UR11"];
export const APCI = ["C", "CS", "O", "OS", "UR11", "US11"];
export const Alarm = ["A", "ACZ", "ASA", "ATR", "CPA", "FIRE", "GA", "P", "SAS", "SMOKE", "VE"];
export const Prue = ["AGT", "AT", "ATP", "AUT", "TST", "TST0", "TST1", "TST3", "TSTR", "TX0"];
export const Bat = ["BB"];
export const otros = ['1381', "24H", "ACR", "BPS", "CAS", "CN", "CTB", "ET*", "FC*", "FCA", "FT", "FT*", "IA*", "MED", "PA", "PAF", "PR", "PRB", "RAS", "REB", "RES", "RFC", "RON", "S99", "STL", "SUP", "TAM", "TB", "TEL", "TESE", "TESS", "TPL", "TRB"];