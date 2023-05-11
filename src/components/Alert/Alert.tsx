import React, { useContext, useEffect } from 'react';
import Animated, { BounceIn, BounceOut, FadeIn, FadeOut, LightSpeedInRight, SlideOutRight, StretchInX, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertContext } from './AlertContext';
import { useAppSelector } from '../../app/hooks';
import { stylesApp } from '../../App';
import { Icon, IconButton } from '../IconButton';
import Text from '../Text';
import Color from 'color';
import Portal from '../Portal/Portal';
import { PanGestureHandler } from 'react-native-gesture-handler';

export const Alert = () => {
    const { show, type, contentModal, clear, closeAlert, closeNot, autoClose, timeOut, updateAutoClose } = useContext(AlertContext);
    const { theme: { colors, dark, roundness } } = useAppSelector(state => state.app);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;

    const animationEnd = FadeOut.delay(500).withCallback((finished: boolean) => {
        'worklet';
        if (finished) {
            runOnJS(closeAlert)()
        }
    });
    const x = useSharedValue(0);

    const del = () => {
        console.log('dele');

    }

    const eventHandler = useAnimatedGestureHandler({
        onStart: (props) => { },
        onActive: ({ translationX, translationY }) => {
            x.value = translationX;
        },
    });

    const _style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: x.value }]
        }
    });

    useEffect(() => {
        if (contentModal && type === 'notification' && autoClose) {
            const close = setTimeout(() => {
                closeNot();
            }, timeOut);
            return () => {
                clearTimeout(close);
            }
        }
    }, [contentModal, type, autoClose, timeOut]);


    switch (type) {
        case 'modal':
            return (
                <Portal>
                    {
                        contentModal &&
                        <Animated.View
                            entering={FadeIn}
                            exiting={animationEnd}
                            style={{ flex: 1, backgroundColor: colors.backdrop }}
                        >
                            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Pressable style={{ width: '100%', height: '100%' }} onPress={clear} />
                                <Animated.View
                                    entering={BounceIn.duration(500)}
                                    exiting={BounceOut.duration(500)}
                                    style={[
                                        stylesApp.shadow, { shadowColor: colors.primary, elevation: 5, borderRadius: roundness * 3 },
                                        { backgroundColor, width: 290, height: 290, position: 'absolute', padding: 10 }
                                    ]}
                                >
                                    <View style={{ flex: 1, marginVertical: 1, justifyContent: 'space-around' }}>
                                        {contentModal.icon &&
                                            <Animated.View style={{ alignSelf: 'center' }} entering={StretchInX.delay(200)}>
                                                <Icon name={
                                                    contentModal.type === 'info' ? 'information-circle-outline'
                                                        : contentModal.type === 'warning' ? 'alert-circle-outline'
                                                            : contentModal.type === 'success' ? 'check-circle-outline'
                                                                : contentModal.type === 'error' ? 'close-circle-outline'
                                                                    : 'help-circle-outline'
                                                }
                                                    color={
                                                        contentModal.type === 'info' ? colors.info
                                                            : contentModal.type === 'warning' ? colors.warning
                                                                : contentModal.type === 'success' ? colors.success
                                                                    : contentModal.type === 'error' ? colors.danger
                                                                        : colors.question
                                                    }
                                                    iconsize={65}
                                                />
                                            </Animated.View>
                                        }
                                        {contentModal.title && <Text style={{ textAlign: 'center' }} variant='titleLarge'>{contentModal.title}</Text>}
                                        {contentModal.subtitle && <Text style={{ textAlign: 'center' }} variant='titleMedium'>{contentModal.subtitle}</Text>}
                                        {
                                            contentModal.customContent ??
                                            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 10 }}>
                                                <Text variant='titleMedium' style={{ textAlign: 'center' }}>{contentModal.text}</Text>
                                            </ScrollView>
                                        }
                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            {contentModal.btnQuestion}
                                        </View>
                                    </View>
                                </Animated.View>
                            </SafeAreaView>
                        </Animated.View>
                    }
                </Portal>
            );
        case 'notification':

            return (
                <Portal>
                    {
                        (show && contentModal) &&
                        <SafeAreaView style={{ flex: 1, alignItems: 'center' }} pointerEvents='box-none'>
                            <PanGestureHandler
                                onGestureEvent={eventHandler}
                                onEnded={() => {
                                    closeNot();
                                }}
                            >
                                <Animated.View entering={LightSpeedInRight}
                                    exiting={SlideOutRight}
                                    style={[
                                        styles.containerNot,
                                        stylesApp.shadow,
                                        { backgroundColor, borderRadius: roundness * 2, borderLeftWidth: 4, borderColor: (contentModal.type === 'error') ? colors.error : (contentModal.type === 'info') ? colors.info : (contentModal.type === 'question') ? colors.question : (contentModal.type === 'success') ? colors.success : colors.warning },
                                        _style
                                    ]}
                                >
                                    <Pressable
                                        onPressIn={() => {
                                            updateAutoClose(false);
                                            x.value = 0;
                                        }}
                                    >
                                        <View style={{ paddingRight: 35, minHeight: 40, justifyContent: 'center' }}>
                                            {contentModal.title && <Text variant='titleMedium'>{contentModal.title}</Text>}
                                            {contentModal.subtitle && <Text variant='titleSmall'>{contentModal.subtitle}</Text>}
                                            {contentModal.text && <Text variant='labelSmall'>{contentModal.text}</Text>}
                                        </View>
                                        {contentModal.btnQuestion && contentModal.btnQuestion}
                                        <IconButton name='close' style={{ position: 'absolute', right: 5, top: 5 }} onPress={closeNot} />
                                    </Pressable>
                                </Animated.View>
                            </PanGestureHandler>
                        </SafeAreaView>
                    }
                </Portal>
            )
        default: return <></>;
    }
}

const styles = StyleSheet.create({
    containerNot: {
        width: '95%',
        top: 10,
        padding: 10
    },
});
