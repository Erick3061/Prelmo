import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextInputProps, TextInput as NativeTextInput, StyleSheet, Pressable, TouchableWithoutFeedback, LayoutRectangle, Animated, Easing, StyleProp, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import { IconButton } from '../IconButton';

export interface PropsTI extends TextInputProps {
    iconRight?: string;
    iconLeft?: string;
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onRef?: (input: React.RefObject<NativeTextInput>) => void;
    onPress?: ((event: GestureResponderEvent) => void) | null;
    onRightPress?: () => void;
}
export type Ref = NativeTextInput;


const TextInput: React.ForwardRefRenderFunction<Ref, PropsTI> = (props: PropsTI, ref) => {
    const { iconRight, iconLeft, secureTextEntry, label, containerStyle, inputStyle, iconStyle, onPress, onRightPress, onRef } = props;
    const { theme: { colors, fonts } } = useAppSelector(state => state.app);
    const sizeIcon: number = 26;
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [layoutInput, setLayoutInput] = useState<LayoutRectangle>();
    const [text, setText] = useState<string>();

    const input = useRef<any>(null);
    const translateYLabel = useRef(new Animated.Value(0)).current;
    const translateXLabel = useRef(new Animated.Value(0)).current;
    const FontSize = useRef(new Animated.Value(0)).current;

    React.useImperativeHandle(ref, () => ({ ...input.current }));

    const color: string = !isFocused ? colors.primary : Color(colors.primary).darken(.3).toString();

    const _renderIcon = useCallback((name?: string) => {
        if (name) {
            return (
                <IconButton
                    style={[styles.icon, !label && { marginTop: layoutInput?.y }, { marginRight: 0 }, iconStyle]}
                    name={name}
                    color={color}
                    onPress={(e) => {
                        if (onRightPress) {
                            onRightPress()
                        }
                        if (input.current) {
                            if (input.current.isFocused()) {
                                input.current.blur();
                            } else {
                                input.current.focus();
                            }
                        }
                    }}
                />
            );
        }
        return undefined;
    }, [iconRight, iconLeft, input, colors, isFocused, onRightPress, layoutInput, color, sizeIcon, label, iconStyle, styles]);

    const _renderLabel = useCallback(() => {
        if (label && layoutInput) {
            const { height, width, x, y } = layoutInput;
            return (
                <TouchableWithoutFeedback onPress={(e) => {
                    onPress && onPress(e)
                }}>
                    <Animated.Text
                        style={[
                            {
                                // backgroundColor: 'red',
                                position: 'absolute',
                                fontWeight: '600',
                                top: y,
                                left: label ? x + 10 : x,
                                fontSize: FontSize.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [fonts.bodyLarge.fontSize, fonts.bodySmall.fontSize]
                                }),
                                marginBottom: 0,
                                color: color,
                                transform: [
                                    {
                                        translateY: translateYLabel
                                    },
                                    {
                                        translateX: translateXLabel
                                    },
                                ]
                            },
                        ]}
                        onPress={() => {
                            if (input.current) {
                                if (input.current.isFocused()) {
                                    input.current.blur();
                                } else {
                                    input.current.focus();
                                }
                            }
                        }}
                    >{label}
                    </Animated.Text>
                </TouchableWithoutFeedback>
            )
        }
        return undefined;
    }, [label, layoutInput, translateYLabel, fonts, iconLeft, FontSize, colors, input, color, onPress]);

    const _renderIconPass = useCallback(() => {
        if (secureTextEntry && iconRight === undefined) {
            return (
                <IconButton
                    style={[styles.icon, iconStyle]}
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    color={color}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
            )
        }
        return undefined;
    }, [secureTextEntry, isPasswordVisible, color, sizeIcon, styles, iconStyle]);

    useEffect(() => {
        if (isFocused && input.current) {
            StartAnimate()
        } else {
            if (text === undefined || text === '') {
                if (!props.value) {
                    translateYLabel.setValue(0);
                    translateXLabel.setValue(0);
                    FontSize.setValue(0);
                }
                setText(props.value ?? undefined);
            }
        }
    }, [isFocused, input, props.value, text, FontSize, translateXLabel, translateYLabel]);

    useEffect(() => {
        if (props.value === '' || !props.value) {
            setText(undefined);
        } else {
            StartAnimate();
        }
    }, [props.value, setText])


    const StartAnimate = () => {
        Animated.parallel([
            Animated.timing(translateXLabel, {
                toValue: 0,
                duration: 0,
                easing: Easing.ease,
                useNativeDriver: false
            }),
            Animated.timing(translateYLabel, {
                toValue: -15,
                duration: 150,
                easing: Easing.ease,
                useNativeDriver: false
            }),
            Animated.timing(FontSize, {
                toValue: 1,
                duration: 0,
                useNativeDriver: false
            })
        ]).start();
    }


    return (
        <Pressable
            style={[
                styles.container,
                isFocused && { borderBottomWidth: 1.8 },
                { borderBottomColor: color },
                containerStyle,
                !label && { alignItems: 'flex-start' }
            ]}
            onPress={onPress}
        >
            {_renderIcon(iconLeft)}
            <NativeTextInput
                {...props}
                onLayout={({ nativeEvent }) => setLayoutInput(nativeEvent.layout)}
                ref={input}
                style={[styles.input, fonts.bodyLarge, { color: colors.onSurface }, inputStyle]}
                selectionColor={Color(colors.primary).fade(.8).toString()}
                onBlur={(e) => {
                    setIsFocused(false);
                    if (props.onBlur) props.onBlur(e)
                }}
                onFocus={(e) => {
                    setIsFocused(true);
                    if (props.onFocus) props.onFocus(e)
                }}
                onPressIn={(e) => onPress && onPress(e)}
                secureTextEntry={props.secureTextEntry && isPasswordVisible}
                placeholder={(!isFocused && label) ? undefined : props.placeholder}
                placeholderTextColor={colors.outlineVariant}
            />
            {_renderLabel()}
            {_renderIcon(iconRight)}
            {_renderIconPass()}
        </Pressable>
    )
}

export default React.forwardRef(TextInput);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        height: 50,
        position: 'relative',
        // backgroundColor: 'pink'
    },
    input: {
        flex: 1,
        padding: 0,
        paddingHorizontal: 10,
        marginTop: 10,
        // backgroundColor: 'blue'
    },
    icon: {
        marginHorizontal: 10
    }
});