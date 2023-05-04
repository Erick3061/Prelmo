import React, { useEffect, useRef, useState } from 'react'
import { Pressable, PressableProps, View, StyleProp, ViewStyle, Modal, SafeAreaView } from 'react-native';
import IconVI from 'react-native-vector-icons/Ionicons';
import Color from 'color';
import { useAppSelector } from '../app/hooks';
import { Props as ButtonProps } from './Button';
import { Orientation } from '../interfaces/interfaces';
import { Platform } from 'react-native';
import { Button } from './Button';
import { stylesApp } from '../App';
import Animated, { FadeInUp, LightSpeedInRight, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

interface Props extends PressableProps {
    name: string;
    iconsize?: number;
    color?: string;
}

export const IconButton = React.forwardRef<View, Props>(
    (props: Props, ref) => {
        const { name, iconsize, color, disabled } = props;
        const { theme: { colors, dark } } = useAppSelector(state => state.app);
        const iconProps = { color, name };
        const size: number = 25;
        const iconColor: string = dark ? colors.primary : Color(colors.primary).darken(.3).toString();
        const rotation = useSharedValue(0);

        const animatedStyle = useAnimatedStyle(() => {
            return {
                transform: [{ rotateZ: `${rotation.value}deg` }],
            };
        });

        const start = () => {
            rotation.value = withSequence(
                withTiming(-10, { duration: 50 }),
                withRepeat(withTiming(10, { duration: 100 }), 6, true),
                withTiming(0, { duration: 50 })
            );
        }

        const scale = useSharedValue(1);

        const animatedStyleIcon = useAnimatedStyle(() => {
            return {
                transform: [{ scale: scale.value }],
            };
        });


        useEffect(() => {
            start();
        }, []);

        useEffect(() => {
            start();
        }, [name]);

        return (
            <Animated.View style={[animatedStyleIcon]}>
                <Pressable
                    {...props}
                    ref={ref}
                    onPressIn={(press) => {
                        props.onPressIn && props.onPressIn(press);
                        scale.value = withSequence(
                            withTiming(1.095, { duration: 10 }),
                        );
                    }}
                    onPressOut={(press) => {
                        props.onPressOut && props.onPressOut(press);
                        scale.value = withSequence(
                            withTiming(1, { duration: 10 }),
                        );
                    }}
                >
                    {
                        ({ pressed }) =>
                            <Animated.View style={[
                                {
                                    width: (iconsize ?? size) + 5,
                                    height: (iconsize ?? size) + 5,
                                    borderRadius: (iconsize ?? size) * 2,
                                    backgroundColor: pressed ? Color(iconProps.color ?? colors.primary).fade(.8).toString() : undefined,
                                    justifyContent: 'center', alignItems: 'center'
                                },
                                animatedStyle
                            ]}>
                                <IconVI {...iconProps} size={iconsize ?? size} color={disabled ? colors.surfaceDisabled : iconProps.color ?? iconColor} />
                            </Animated.View>
                    }
                </Pressable >
            </Animated.View>
        )
    }
);

interface PropsIcon {
    name: string;
    iconsize?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

export const Icon = React.forwardRef<View, PropsIcon>(
    (props: Props, ref) => {
        const { name, iconsize, color, disabled, style } = props;
        const stl = style as StyleProp<ViewStyle>;
        const { theme: { colors, dark } } = useAppSelector(state => state.app);
        const iconProps = { color, name };
        const size: number = 25;
        const iconColor: string = dark ? colors.primary : Color(colors.primary).darken(.3).toString();

        return (

            <View ref={ref} style={[
                {
                    width: (iconsize ?? size) + 5,
                    height: (iconsize ?? size) + 5,
                    borderRadius: (iconsize ?? size) * 2,
                    justifyContent: 'center', alignItems: 'center'
                },
                stl
            ]}>
                <IconVI {...iconProps} size={iconsize ?? size} color={disabled ? colors.surfaceDisabled : iconProps.color ?? iconColor} />
            </View>
        )
    }
);
interface IconPropsMenu {
    menu?: Array<ButtonProps>;
    disabled?: boolean;
    iconsize?: number;
}

export const IconMenu = React.forwardRef<Modal, IconPropsMenu>(
    ({ disabled, menu, iconsize }: IconPropsMenu, ref) => {
        const { theme: { colors, dark, roundness }, insets, orientation, screenWidth, screenHeight } = useAppSelector(state => state.app);

        const [open, setOpen] = useState<boolean>(false);
        const [iconMeasure, seticonMeasure] = useState<{
            x: number;
            y: number;
            width: number;
            height: number;
        }>({ x: 0, y: 0, width: 0, height: 0 });
        const size: number = 25;


        const icon = useRef<View>(null);

        const radius: number = roundness * 3;
        const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;


        const updateSizes = () => {
            if (icon.current) {
                icon.current.measureInWindow((x, y, width, height) => {
                    seticonMeasure({ x, y, height, width });
                });
            }
        }

        useEffect(() => {
            setOpen(false);
            updateSizes();
        }, [orientation]);

        useEffect(() => {
            updateSizes();
        }, [])


        return (
            <>
                <IconButton
                    ref={icon}
                    iconsize={iconsize ?? size}
                    disabled={disabled}
                    name={open ? 'ellipsis-horizontal-circle-outline' : 'ellipsis-vertical-circle-outline'}
                    color={colors.primary}
                    onPress={() => {
                        setOpen(true);
                        updateSizes();
                    }}
                />
                {
                    iconMeasure &&
                    <Modal ref={ref} visible={open} animationType='fade' hardwareAccelerated transparent supportedOrientations={['landscape', 'portrait']} >
                        <SafeAreaView style={{ flex: 1, backgroundColor: Color(colors.backdrop).fade(.3).toString() }}>
                            <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
                            <Animated.View entering={LightSpeedInRight} style={[
                                {
                                    position: 'absolute',
                                    top: iconMeasure.y,
                                    right: (orientation === Orientation.landscape ? screenHeight : screenWidth) - (iconMeasure.x + iconMeasure.width),
                                    backgroundColor: backgroundColor, padding: 10,
                                },
                                stylesApp.shadow, { shadowColor: colors.primary, borderRadius: radius, shadowRadius: radius, elevation: 5 }
                            ]}>
                                {
                                    menu?.map((op, idx) => {
                                        return (
                                            <Animated.View entering={FadeInUp.delay(100 + ((idx + 1) * 20))} key={idx + 1}>
                                                <Button {...op}
                                                    onPress={(props) => {
                                                        op.onPress && op.onPress(props);
                                                        setOpen(!open);
                                                    }}
                                                    variantText='labelMedium'
                                                />
                                                {Platform.OS === 'ios' && idx < menu.length - 1 && <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: Color(colors.background).fade(.2).toString(), backgroundColor: colors.onSurface }} />}
                                            </Animated.View>
                                        )
                                    })
                                }
                            </Animated.View>
                        </SafeAreaView>
                    </Modal>
                }
            </>
        )
    });