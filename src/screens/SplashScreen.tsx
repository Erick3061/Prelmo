import React, { useContext, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { HandleContext } from '../context/HandleContext';
import Animated, { BounceIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { checkMultiple, requestMultiple } from 'react-native-permissions';
import { updaetAccessStorage } from '../features/appSlice';

interface Props extends NativeStackScreenProps<rootStackScreen, 'SplashScreen'> { };

export const SplashScreen = ({ navigation }: Props) => {
    const { theme: { dark, colors }, status } = useAppSelector(state => state.app);
    const AppDispatch = useAppDispatch();
    const { domain, handleError } = useContext(HandleContext);

    const start = () => setTimeout(async () => {
        (domain !== '')
            ? navigation.replace('LogInScreen')
            : navigation.replace('DomainScreen')
    }, 1000);

    const scale = useSharedValue(.95);

    const verifyPermissions = async () => {
        try {
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                if (Platform.OS === 'ios') {
                    // AppDispatch(updaetAccessStorage(true));
                    start();
                } else {
                    await checkMultiple([
                        'android.permission.READ_EXTERNAL_STORAGE',
                        'android.permission.WRITE_EXTERNAL_STORAGE'
                    ]);
                    start();

                    // if (Platform.constants.Version < 30) {

                    // const permissions = await checkMultiple(['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE']);
                    // if (permissions['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted' || permissions['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted') {
                    //     const { "android.permission.READ_EXTERNAL_STORAGE": read, "android.permission.WRITE_EXTERNAL_STORAGE": write } = await requestMultiple(['android.permission.READ_EXTERNAL_STORAGE', 'android.permission.WRITE_EXTERNAL_STORAGE']);
                    //     if (read === 'granted' && write === 'granted') {
                    //         AppDispatch(updaetAccessStorage(true));
                    //     }
                    //     start();
                    // } else {
                    //     AppDispatch(updaetAccessStorage(true));
                    //     start();
                    // }
                    // } else {
                    //     start();
                    // }
                }
            }
        } catch (error) { handleError(String(error)) }
    }

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1, { duration: 390 }),
            10000,
            true
        );
    }, []);

    useEffect(() => {
        if (status === 'unlogued') {
            verifyPermissions();
            // start();
        }
    }, [status, domain]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Image entering={BounceIn}
                style={[
                    { width: '50%', height: 150, resizeMode: 'contain' },
                    dark && { tintColor: colors.onSurface },
                    animatedStyle
                ]}
                source={require('../assets/prelmo2.png')}
            />
        </View>
    )
}
