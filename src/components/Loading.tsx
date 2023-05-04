import Color from 'color';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { stylesApp } from '../App';
import Animated, { Extrapolation, FadeIn, FadeOut, interpolate, SlideInUp, SlideOutUp, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, interpolateColor, withSpring } from 'react-native-reanimated';
import Text from './Text';

export const Loading = ({ loading, refresh, right }: { loading?: boolean, refresh?: boolean, right?: number }) => {
    const { theme: { colors, roundness, dark }, insets } = useAppSelector(state => state.app);

    // dark ? Color(colors.background).darken(.4).toString() : colors.background

    const offset = useSharedValue(0);
    const offset2 = useSharedValue(0);
    const translate: number = 20;
    const duration: number = 800;

    const Animate = () => {
        offset.value =
            withRepeat(
                withSequence(
                    withTiming(-translate, { duration }),
                    withTiming(translate, { duration }),
                )
                , 1000, true);
        offset2.value =
            withRepeat(
                withSequence(
                    withTiming(translate, { duration }),
                    withTiming(-translate, { duration }),
                )
                , 1000, true);
    }

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(offset.value) },
            ],
            backgroundColor: interpolateColor(offset.value, [-translate, 0, translate], [colors.danger, colors.danger, colors.primary])
        };
    });

    const animatedStyles2 = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: withSpring(offset2.value) },
                { scale: interpolate(offset2.value, [-translate, translate], [1.5, 1], { extrapolateRight: Extrapolation.CLAMP }) },
            ],
            opacity: interpolate(offset.value, [-translate, 0, translate], [.8, .5, .8], { extrapolateRight: Extrapolation.CLAMP }),
            backgroundColor: interpolateColor(offset.value, [-translate, 0, translate], [colors.primary, colors.primary, colors.danger])
        };
    });

    useEffect(() => {
        Animate();
    }, []);

    return (
        loading ?
            <Animated.View entering={FadeIn} exiting={FadeOut} collapsable style={[
                { backgroundColor: colors.background, position: 'absolute', zIndex: 10, top: 0, justifyContent: 'center', alignItems: 'center' },
                loading && { width: '100%', height: '100%' },
            ]}>
                <Animated.View
                    style={[
                        { width: 20, height: 20, backgroundColor: colors.primary, position: 'absolute', borderRadius: 10 },
                        animatedStyles
                    ]}
                />
                <Animated.View
                    style={[
                        { width: 20, height: 20, backgroundColor: 'red', position: 'absolute', borderRadius: 10 },
                        animatedStyles2,
                    ]}
                />
                {/* <Text>Cargando...</Text> */}
            </Animated.View>
            :
            refresh
                ?
                <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={[
                    {
                        alignSelf: 'center',
                        backgroundColor: dark ? Color(colors.background).darken(.4).toString() : colors.background,
                        position: 'absolute',
                        top: (insets && Platform.OS === 'ios') ? insets.top : 8,
                        padding: 7,
                        right,
                        borderRadius: 100
                    },
                    stylesApp.shadow, { shadowColor: colors.primary, elevation: 5 }
                ]}>
                    <ActivityIndicator color={colors.primary} size={25} />
                </Animated.View>
                :
                null
    )
}