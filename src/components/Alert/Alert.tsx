import React, { useContext } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { BounceIn, BounceInDown, BounceInLeft, BounceInRight, BounceInUp, BounceOut, FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertContext } from './AlertContext';
import { useAppSelector } from '../../app/hooks';
import Color from 'color';
import Text from '../Text';
import { Icon } from '../IconButton';
import { stylesApp } from '../../App';

export const Alert = () => {
    const { show, type, contentModal, clear, closeAlert } = useContext(AlertContext);
    const { theme: { colors, dark, roundness } } = useAppSelector(state => state.app);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;


    const animationEnd = FadeOut.delay(500).withCallback((finished: boolean) => {
        'worklet';
        if (finished) {
            runOnJS(closeAlert)()
        }
    });

    switch (type) {
        case 'modal':
            return (
                <Modal visible={show} transparent supportedOrientations={['landscape', 'portrait']}>
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
                                    entering={BounceIn}
                                    exiting={BounceOut}
                                    style={[
                                        stylesApp.shadow, { shadowColor: colors.primary, elevation: 5, borderRadius: roundness * 3 },
                                        { backgroundColor, width: 290, height: 290, position: 'absolute', padding: 10 }
                                    ]}
                                >
                                    <View style={{ flex: 1, marginVertical: 1, justifyContent: 'space-around' }}>
                                        {contentModal.icon &&
                                            <Animated.View style={{ alignSelf: 'center' }} entering={BounceInUp.delay(100)}>
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
                                        <Animated.View style={{ flexDirection: 'row', justifyContent: 'flex-end' }} entering={BounceInRight.delay(100)}>
                                            {contentModal.btnQuestion}
                                        </Animated.View>
                                    </View>
                                </Animated.View>
                            </SafeAreaView>
                        </Animated.View>
                    }
                    {/* <SafeAreaView style={{ flex: 1, backgroundColor: colors.backdrop }}>
                        <Pressable style={{ width: '100%', height: '100%' }} onPress={() => { console.log('Close modal') }} />
                    </SafeAreaView> */}
                </Modal>
            );
        case 'notification':
            return (
                <Animated.View style={[styles.containerNot]}>

                </Animated.View>
            )

        default: return <></>;
    }
}

const styles = StyleSheet.create({
    containerNot: {

    }
});
