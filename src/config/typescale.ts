import { Platform } from "react-native";
import { Font, Typescale } from "../types/types";

const ref = {
    typeface: {
        brandRegular: Platform.select({
            ios: 'System',
            default: 'sans-serif',
        }),
        weightRegular: '400' as Font['fontWeight'],
        plainMedium: Platform.select({
            ios: 'System',
            default: 'sans-serif-medium',
        }),
        weightMedium: '500' as Font['fontWeight'],
    },
};

const regularType = {
    fontFamily: ref.typeface.brandRegular,
    letterSpacing: 0,
    fontWeight: ref.typeface.weightRegular,
};

const mediumType = {
    fontFamily: ref.typeface.plainMedium,
    letterSpacing: 0.15,
    fontWeight: ref.typeface.weightMedium,
};

export const typescale: Typescale = {
    displayLarge: {
        ...regularType,
        lineHeight: 64,
        fontSize: 57,
    },
    displayMedium: {
        ...regularType,
        lineHeight: 52,
        fontSize: 45,
    },
    displaySmall: {
        ...regularType,
        lineHeight: 44,
        fontSize: 36,
    },

    headlineLarge: {
        ...regularType,
        lineHeight: 40,
        fontSize: 32,
    },
    headlineMedium: {
        ...regularType,
        lineHeight: 36,
        fontSize: 28,
    },
    headlineSmall: {
        ...regularType,
        lineHeight: 32,
        fontSize: 24,
    },

    titleLarge: {
        ...regularType,
        lineHeight: 28,
        fontSize: 22,
        fontWeight: '700'
    },
    titleMedium: {
        ...mediumType,
        lineHeight: 24,
        fontSize: 16,
        fontWeight: '600'
    },
    titleSmall: {
        ...mediumType,
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
        fontWeight: '400'
    },

    labelLarge: {
        ...mediumType,
        letterSpacing: 0.1,
        lineHeight: 20,
        fontSize: 14,
    },
    labelMedium: {
        ...mediumType,
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 12,
    },
    labelSmall: {
        ...mediumType,
        letterSpacing: 0.5,
        lineHeight: 16,
        fontSize: 11,
    },

    bodyLarge: {
        ...mediumType,
        fontWeight: ref.typeface.weightRegular,
        fontFamily: ref.typeface.brandRegular,
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        ...mediumType,
        fontWeight: ref.typeface.weightRegular,
        fontFamily: ref.typeface.brandRegular,
        letterSpacing: 0.25,
        lineHeight: 20,
        fontSize: 14,
    },
    bodySmall: {
        ...mediumType,
        fontWeight: ref.typeface.weightRegular,
        fontFamily: ref.typeface.brandRegular,
        letterSpacing: 0.4,
        lineHeight: 16,
        fontSize: 12,
    },
    default: {
        ...mediumType,
        fontWeight: ref.typeface.weightRegular,
        fontFamily: ref.typeface.brandRegular,
        letterSpacing: 0.4,
    }
};

export const typeface = ref.typeface;