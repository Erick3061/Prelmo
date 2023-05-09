import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolate,
    WithSpringConfig,
    interpolate,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Icon } from './IconButton';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Text from './Text';
import { updateTheme } from '../features/appSlice';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';

const springConfig = (velocity?: number): WithSpringConfig => {
    'worklet';
    return {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        velocity,
    };
};

export default function ChangeThemeSlide() {
    const { theme: { colors, dark } } = useAppSelector(state => state.app);
    const AppDispatch = useAppDispatch();
    const x = useSharedValue(0);
    const width1 = useSharedValue(0);
    const width2 = useSharedValue(0);

    // const eventHandler = useAnimatedGestureHandler({
    // onStart: (props) => {
    //     // ctx.startX = x.value;
    //     x.value = props.translationX
    // },
    // onActive: (event, ctx) => {
    //     x.value = Math.max(
    //         0,
    //         // Math.min(event.translationX + ctx.startX, width1.value),
    //     );
    // },
    // onEnd: (event, ctx) => {
    //     if (event.velocityX > 20)
    //         x.value = withSpring(width1.value, springConfig(event.velocityX));
    //     else if (event.velocityX < -20)
    //         x.value = withSpring(0, springConfig(event.velocityX));
    //     else if (x.value > width1.value / 2)
    //         x.value = withSpring(width1.value, springConfig(event.velocityX));
    //     else x.value = withSpring(0, springConfig(event.velocityX));
    // },
    // });

    const _style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: x.value }],
            width: interpolate(
                x.value,
                [0, width1.value],
                [width1.value, width2.value],
                {
                    extrapolateLeft: Extrapolate.CLAMP,
                    extrapolateRight: Extrapolate.CLAMP,
                },
            ),
        };
    });

    const moveBackStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: -x.value }],
        };
    });

    const toggle = (toLeft: boolean) => {
        if (toLeft) x.value = withSpring(0, springConfig());
        else x.value = withSpring(width1.value, springConfig());
        (toLeft) ? AppDispatch(updateTheme(CombinedDarkTheme)) : AppDispatch(updateTheme(CombinedLightTheme));
    };

    useEffect(() => {
        if (dark) {
            AppDispatch(updateTheme(CombinedDarkTheme));
            toggle(true);
        } else {
            AppDispatch(updateTheme(CombinedLightTheme));
            toggle(false);
        }
    }, []);


    return (
        <Animated.View style={[styles.rowContainer, { backgroundColor: colors.primaryContainer }]}>
            <View style={styles.rowSubContainer}>
                <TouchableOpacity
                    onPress={() => toggle(true)}
                    activeOpacity={1}>
                    <View style={[styles.action]} onLayout={e => (width1.value = e.nativeEvent.layout.width)}>
                        <Icon iconsize={20} name='moon-outline' color={colors.primary} />
                        <Text>Oscuro</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => toggle(false)}
                    activeOpacity={1}>
                    <View style={[styles.action]} onLayout={e => (width2.value = e.nativeEvent.layout.width)}>
                        <Icon iconsize={20} name='sunny-outline' color={colors.primary} />
                        <Text>Claro</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <PanGestureHandler onGestureEvent={eventHandler}> */}
            <Animated.View style={[styles.moveBar, _style, { backgroundColor: colors.background }]}>
                <Animated.View style={[styles.rowSubContainer, styles.absPos, moveBackStyle]}>
                    <View style={[styles.action]} >
                        <Icon iconsize={20} name='moon-outline' color={colors.onSurface} />
                        <Text variant='titleSmall' >Oscuro</Text>
                    </View>
                    <View style={[styles.action]} >
                        <Icon iconsize={20} name='sunny-outline' color={colors.onSurface} />
                        <Text variant='titleSmall' >Claro</Text>
                    </View>
                </Animated.View>
            </Animated.View>
            {/* </PanGestureHandler> */}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    rowContainer: {
        borderRadius: 50,
        overflow: 'hidden',
        padding: 5,
        justifyContent: 'center',
    },
    rowSubContainer: {
        flexDirection: 'row',
    },
    moveBar: {
        height: '100%',
        borderRadius: 50,
        position: 'absolute',
        overflow: 'hidden',
        marginHorizontal: 5
    },
    absPos: {
        position: 'absolute',
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
});