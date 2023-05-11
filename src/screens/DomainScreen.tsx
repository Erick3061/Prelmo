import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { style } from './LogInScreen';
import { Icon, IconButton } from '../components/IconButton';
import Text from '../components/Text';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Input } from '../components/Input/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { useAppSelector } from '../app/hooks';
import { rootStackScreen } from '../navigation/Stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { HandleContext } from '../context/HandleContext';
import { Loading } from '../components/Loading';

interface Props extends NativeStackScreenProps<rootStackScreen, 'DomainScreen'> { };

export const DomainScreen = ({ navigation, route }: Props) => {
    const { theme: { dark: isDark, colors } } = useAppSelector(store => store.app);
    const { control, handleSubmit, reset, setValue, setError } = useForm<{ domain: string }>({ defaultValues: { domain: '', } });
    const { updateDomain, domain } = useContext(HandleContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<{ domain: string }> = async ({ domain }) => {
        setIsLoading(true);
        await axios.get(`https://${domain}`)
            .then(response => {
                reset();
                updateDomain(response.request['responseURL']);
                navigation.replace('LogInScreen');
            })
            .catch(async err => {
                try {
                    const response = await axios.get(`http://${domain}`);
                    reset();
                    updateDomain(response.request['responseURL']);
                    navigation.replace('LogInScreen');
                } catch (error) {
                    setError('domain', { message: `${error}`, type: "validate" });
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            headerLeft({ canGoBack, label, tintColor }) {
                return (
                    <>
                        {canGoBack && <IconButton name={(Platform.OS === 'ios') ? 'chevron-back-outline' : 'arrow-back-outline'} onPress={() => navigation.goBack()} style={{ marginRight: 10 }} iconsize={30} />}
                        <Image
                            source={require('../assets/prelmo2.png')}
                            style={[
                                isDark && { tintColor: colors.onSurface },
                                {
                                    height: 30,
                                    width: 90,
                                    resizeMode: 'contain',
                                    alignSelf: 'flex-start',
                                }
                            ]}
                        />
                    </>
                )
            },
        })
    }, [navigation])

    useEffect(() => {
        setValue('domain', domain.replace('https://', '').replace('http://', '').replace('/', ''));
    }, []);


    return (
        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={{ flex: 1 }}>
            <Loading refresh={isLoading} />
            <KeyboardAvoidingView style={[{ flex: 1 }]}
                enabled
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    style={[
                        style.container,
                        {
                            alignItems: 'center',
                            backgroundColor: colors.background,
                            padding: 15
                        }
                    ]}
                >
                    <Icon name='code-working' iconsize={45} />
                    <Text style={{ marginVertical: 15 }} variant='titleLarge'>¡Bienvenido!</Text>
                    <Text style={{ textAlign: 'center', marginHorizontal: 10, color: colors.outline }}>Para empezar a utilizar esta aplicación, proporcione la dirección del servidor de su central de alarmas</Text>
                    <Input
                        formInputs={control._defaultValues}
                        control={control}
                        name={'domain'}
                        iconLeft='server'
                        placeholder='exammple.domain.com'
                        keyboardType='url'
                        rules={{
                            required: { value: true, message: 'Campo requerido' },
                        }}
                        label='Dirección del Servidor'
                        onSubmitEditing={handleSubmit(onSubmit)}
                        returnKeyType='done'
                        autoCapitalize='none'
                    />
                    <Button
                        text='OK'
                        mode='contained'
                        onPress={handleSubmit(onSubmit)}
                        contentStyle={{ marginVertical: 15 }}
                        disabled={isLoading}
                    />
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    )

}