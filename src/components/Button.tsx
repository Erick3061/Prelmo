import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../app/hooks';
import Color from 'color';
import { stylesApp } from '../App';
import Text from './Text';
import { TypescaleKey } from '../types/types';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

export interface Props extends PressableProps {
    text: string;
    icon?: string;
    isAfterIcon?: boolean;
    loading?: boolean;
    labelStyle?: StyleProp<TextStyle>;
    variantText?: keyof typeof TypescaleKey;
    contentStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    mode?: ButtonMode;
    uppercase?: boolean;
    disabled?: boolean;
    customButtonColor?: string;
    customTextColor?: string;
    borderRadiusBtn?: number;
    colorPressed?: string;
    colorTextPressed?: string;
}
export const Button = (props: Props) => {
    const { loading, labelStyle, contentStyle, mode = 'text', icon,
        text, uppercase = true, disabled, customButtonColor, customTextColor,
        borderRadiusBtn, colorPressed, colorTextPressed, variantText, containerStyle, isAfterIcon = false } = props;
    const { color: customLabelColor, fontSize: customLabelSize } = StyleSheet.flatten(labelStyle) || {};
    const iconSize = 18;
    const { theme: { colors, fonts, roundness, dark } } = useAppSelector(state => state.app);
    const isMode = React.useCallback((modeToCompare: ButtonMode) => { return mode === modeToCompare; }, [mode]);
    const borderRadius: number = borderRadiusBtn ?? roundness * 2.3;

    const getButtonBackgroundColor = ({ isMode, disabled, customButtonColor }: { customButtonColor?: string; disabled?: boolean; isMode: (modeToCompare: ButtonMode) => boolean; }) => {
        if (customButtonColor && !disabled) { return customButtonColor; }

        if (disabled) {
            if (isMode('outlined') || isMode('text')) { return 'transparent'; }
            return colors.surfaceDisabled;
        }

        if (isMode('contained')) { return colors.primary; }

        if (isMode('contained-tonal')) { return colors.secondaryContainer; }

        return 'transparent';
    };

    const getButtonTextColor = ({ isMode, disabled, customTextColor }: { customTextColor?: string; isMode: (modeToCompare: ButtonMode) => boolean; disabled?: boolean; }) => {
        if (customTextColor && !disabled) { return customTextColor; }

        if (disabled) { return colors.onSurfaceDisabled; }


        if (isMode('outlined') || isMode('text')) {
            return colors.primary;
        }

        if (isMode('contained')) {
            return colors.background;
        }

        if (isMode('contained-tonal')) {
            return colors.onSecondaryContainer;
        }

        return colors.primary;
    };

    const getButtonBorderColor = ({ isMode, disabled }: { isMode: (modeToCompare: ButtonMode) => boolean; disabled?: boolean }) => {
        if (disabled && isMode('outlined')) { return colors.surfaceDisabled; }

        if (isMode('outlined')) { return colors.outline; }

        return 'transparent';
    };

    const getButtonBorderWidth = ({ isMode }: Omit<{ isMode: (modeToCompare: ButtonMode) => boolean; }, 'disabled'>) => {
        if (isMode('outlined')) { return 1; }
        return 0;
    };

    const getButtonColors = ({ mode, customButtonColor, customTextColor, disabled, dark, }: {
        mode: ButtonMode;
        customButtonColor?: string;
        customTextColor?: string;
        disabled?: boolean;
        dark?: boolean;
    }) => {
        const isMode = (modeToCompare: ButtonMode) => { return mode === modeToCompare; };

        const backgroundColor = getButtonBackgroundColor({ isMode, disabled, customButtonColor });

        const textColor = getButtonTextColor({ isMode, disabled, customTextColor });

        const borderColor = getButtonBorderColor({ isMode, disabled });

        const borderWidth = getButtonBorderWidth({ isMode });

        return {
            backgroundColor,
            borderColor,
            textColor,
            borderWidth,
        };
    };


    const { backgroundColor, borderColor, textColor, borderWidth } =
        getButtonColors({
            customButtonColor,
            customTextColor,
            mode,
            disabled,
            dark,
        });

    const buttonStyle = { backgroundColor, borderColor, borderWidth, borderRadius };

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <Animated.View style={[animatedStyle]}>
            <Pressable
                {...props}
                style={({ pressed }) => [
                    styles.button,
                    buttonStyle,
                    isMode('elevated') && { ...stylesApp.shadow, shadowColor: colors.primary, backgroundColor: colors.background },
                    (pressed && !isMode('contained')) && { backgroundColor: colorPressed ?? Color(buttonStyle.backgroundColor).fade(.2).toString() },
                    (pressed && isMode('elevated')) && { backgroundColor: colorPressed ?? Color(colors.primaryContainer).toString() },
                    (pressed && (isMode('text') || isMode('outlined'))) && { backgroundColor: Color(buttonStyle.backgroundColor).alpha(.1).toString() },
                    contentStyle,
                ]}
                onPressIn={(press) => {
                    props.onPressIn && props.onPressIn(press);
                    scale.value = withSequence(
                        withTiming(.98, { duration: 10 }),
                    );
                }}
                onPressOut={(press) => {
                    props.onPressOut && props.onPressOut(press);
                    scale.value = withSequence(
                        withTiming(1, { duration: 10 }),
                    );
                }}
            >
                {({ pressed }) => (
                    <View style={[styles.content, containerStyle, isAfterIcon && { flexDirection: 'row-reverse' }]}>
                        {icon && !loading ? (
                            <View style={isAfterIcon ? styles.iconAfter : styles.icon}>
                                <Icon
                                    name={icon}
                                    size={customLabelSize ?? iconSize}
                                    color={typeof customLabelColor === 'string' ? customLabelColor : textColor}
                                />
                            </View>
                        ) : null}
                        {loading ? (
                            <ActivityIndicator
                                size={customLabelSize ?? iconSize}
                                color={typeof customLabelColor === 'string' ? customLabelColor : textColor}
                                style={[isAfterIcon ? styles.iconAfter : styles.icon]}
                            />
                        ) : null}
                        <Text
                            variant={variantText ?? 'labelLarge'}
                            style={[
                                styles.label,
                                (isMode('text') ? icon || loading ? styles.LabelTextAddons : styles.LabelText : styles.Label),
                                { color: textColor },
                                uppercase && styles.uppercaseLabel,
                                labelStyle,
                                { color: colorTextPressed ?? textColor }
                            ]}
                            numberOfLines={1}
                        >{text}</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    button: {
        minWidth: 64,
        borderStyle: 'solid',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginLeft: 12,
        marginRight: -4,
    },
    iconAfter: {
        marginRight: 12,
        marginLeft: -4,
    },
    label: {
        textAlign: 'center',
        marginVertical: 9,
        marginHorizontal: 16,
    },
    LabelTextAddons: {
        marginHorizontal: 16,
    },
    LabelText: {
        marginHorizontal: 12,
    },
    Label: {
        letterSpacing: 1,
    },
    uppercaseLabel: {
        textTransform: 'uppercase',
    },
});
