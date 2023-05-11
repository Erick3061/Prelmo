import React, { useContext, useEffect } from 'react';
import { Platform, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { HandleContext } from '../context/HandleContext';
import Animated, { BounceIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props extends NativeStackScreenProps<rootStackScreen, 'SplashScreen'> { };

export const SplashScreen = ({ navigation }: Props) => {
    const { theme: { dark, colors }, status } = useAppSelector(state => state.app);
    const { domain, handleError, checkPermissios } = useContext(HandleContext);

    const start = () => setTimeout(async () => {
        (domain !== '')
            ? navigation.replace('LogInScreen')
            : navigation.replace('DomainScreen')
    }, 1000);

    const scale = useSharedValue(.95);

    const verifyPermissions = async () => {
        try {
            await checkPermissios();
            start();
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
