import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';
import { setUser } from '../features/appSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { HandleContext } from '../context/HandleContext';
import { useMutation } from '@tanstack/react-query';
import { CheckAuth } from '../api/Api';
import Animated, { BounceIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props extends NativeStackScreenProps<rootStackScreen, 'SplashScreen'> { };

export const SplashScreen = ({ navigation }: Props) => {
    const { theme: { dark, colors } } = useAppSelector(state => state.app);
    const { handleError } = useContext(HandleContext);
    const appDispatch = useAppDispatch();

    const { mutate } = useMutation(['CheckAuth'], CheckAuth, {
        onSuccess: data => appDispatch(setUser(data)),
        onError: err => {
            handleError(String(err));
            start({ time: 0 });
        }
    })

    const toast = (error: string) => {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error,
            onHide: () => start({ time: 0 }),
        });
    }

    const start = ({ time }: { time?: number }) => setTimeout(async () => {
        navigation.replace('LogInScreen')
    }, time ?? 1500);

    const scale = useSharedValue(.8);

    useEffect(() => {
        scale.value = withRepeat(
            withTiming(1, { duration: 370 }),
            10000,
            true,);

        EncryptedStorage.getItem('token').then(async token => {
            if (!token) {
                start({});
            } else {
                mutate();
            }
        }).catch(error => toast(String(error)));
    }, []);


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Image entering={BounceIn}
                style={[
                    { width: 150, height: 150 },
                    dark && { tintColor: colors.onSurface },
                    animatedStyle
                ]}
                source={require('../assets/logo4.png')}
            />
        </View>
    )
}
