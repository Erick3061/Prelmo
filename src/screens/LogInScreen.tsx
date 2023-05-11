import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, StyleSheet, View, TextInput as NativeTextInput, TouchableWithoutFeedback, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '../components/Input/Input';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Loading } from '../components/Loading';
import { useMutation } from '@tanstack/react-query';
import { setUser, updateFE, updateSaved } from '../features/appSlice';
import { SocialNetworks } from '../components/SocialNetworks';
import { Button } from '../components/Button';
import Text from '../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { Keyboard } from 'react-native';
import { HandleContext } from '../context/HandleContext';
import { AlertContext } from '../components/Alert/AlertContext';
import Animated, { BounceIn, FadeInDown } from 'react-native-reanimated';
import TextInput from '../components/Input/TextInput';
import { AxiosError, AxiosResponse } from 'axios';
import { CheckBox } from '../components/CheckBox';
import * as Keychain from 'react-native-keychain';
import { IconButton } from '../components/IconButton';
import keychain from 'react-native-keychain';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Service } from '../types/types';

type InputsLogIn = {
    email: string,
    password: string,
}

interface Props extends NativeStackScreenProps<rootStackScreen, 'LogInScreen'> { };
export const LogInScreen = ({ navigation, route }: Props) => {
    const { theme: { dark: isDark, colors }, firstEntry, isCompatible, saved, insets } = useAppSelector(store => store.app);
    const dispatchApp = useAppDispatch();
    const { control, handleSubmit, reset, setValue, getValues } = useForm<InputsLogIn>({ defaultValues: { email: '', password: '' } });
    const { handleError, domain, LogIn } = useContext(HandleContext);
    const { notification } = useContext(AlertContext);
    const [getted, setGetted] = useState<InputsLogIn>();
    const [isChanged, setIsChanged] = useState<boolean>(false);

    const { isLoading, mutate } = useMutation(['LogIn'], LogIn, {
        retry: 0,
        onError: async err => {
            const Error: AxiosError = err as AxiosError;
            const Response: AxiosResponse = Error.response as AxiosResponse;
            handleError(String(Response.data.message));
        },
        onSuccess: async data => {
            if (isCompatible) {
                if (saved === 'saveBiometry') {
                    await save(getValues('email'), getValues('password'), true);
                }
                if (saved === 'save') {
                    await save(getValues('email'), getValues('password'), false);
                }
            } else {
                if (saved === 'save') {
                    await save(getValues('email'), getValues('password'), false);
                }
            }
            reset();
            dispatchApp(updateFE(false));
            if (data.termsAndConditions) dispatchApp(setUser(data));
            else navigation.navigate('TCAP', { user: data });
        },
    });

    const onSubmit: SubmitHandler<InputsLogIn> = async (data) => {
        mutate(data);
    };

    const nextInput = useRef<NativeTextInput>(null);

    const askSave = () => {
        Alert.alert('Alerta', '¿Realmente quieres Recordar la contraseña?', [
            {
                text: 'cancelar'
            },
            { text: 'ok', onPress: () => dispatchApp(updateSaved('save')) }
        ], {
            cancelable: true
        });
    }

    const check = () => {
        if (isCompatible) {
            Alert.alert('Activar lector de biometría', '¿Desea activar el inicio de sesión con lectores biométricos? \n\nSiempre se puede cambiar esto en los ajustes de la aplicación', [
                { text: 'no', onPress: () => askSave() },
                {
                    text: 'si', onPress: async () => {
                        dispatchApp(updateSaved('saveBiometry'));
                    }
                }
            ], { cancelable: true })
        }
        else {
            askSave()
        }
    }

    const deleteCheck = async () => {
        try {
            await Keychain.resetGenericPassword({ service: Service['Keychain-Saved'] });
            await Keychain.resetGenericPassword({ service: Service['Keychain-Saved-Biometry'] });
            await EncryptedStorage.removeItem(Service['Encrypted-Saved']);
            dispatchApp(updateSaved(null));
            setGetted(undefined);
            reset();
        } catch (error) { handleError(`${error}`) }
    }

    const save = async (user: string, password: string, isBiometry: boolean) => {
        try {
            saved && await EncryptedStorage.setItem(Service['Encrypted-Saved'], saved);
            if (isBiometry) {
                if (!getted) {
                    await Keychain.setGenericPassword(user, password, {
                        service: Service['Keychain-Saved']
                    });
                    await Keychain.setGenericPassword(user, password, {
                        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                        service: Service['Keychain-Saved-Biometry']
                    });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            } else {
                if (!getted) {
                    await Keychain.setGenericPassword(user, password, {
                        service: Service['Keychain-Saved']
                    });
                } else {//TODO : Verificar este paso  para la actualizacón de los datos

                }
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }

    const useBiometricos = async () => {
        try {
            const data = await keychain.getGenericPassword({ service: Service['Keychain-Saved-Biometry'] });
            if (data) onSubmit({ email: data.username, password: data.password });
        } catch (error) {
            notification({
                type: 'warning',
                text: `${error}`
            });
        }
    }

    const setValues = async () => {
        try {
            const data = await keychain.getGenericPassword({ service: Service['Keychain-Saved'] });
            switch (saved) {
                case 'save':
                    if (data) {
                        setGetted({ email: data.username, password: data.password });
                        setValue('email', data.username);
                        if (firstEntry) onSubmit({ email: data.username, password: data.password });
                    }
                    break;
                case 'saveBiometry':
                    if (data) {
                        setGetted({ email: data.username, password: data.password });
                        setValue('email', data.username);
                        if (firstEntry) useBiometricos();
                    }
                    break;
            }
        } catch (error) {
            handleError(`${error}`);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: '',
            headerLeft: (({ canGoBack, label, tintColor }) =>
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
            ),
        });
    }, [navigation, isDark, insets])

    useEffect(() => {
        const state = navigation.getState();
        const routes = state.routes;

        navigation.reset({
            ...state,
            routes: routes.slice(0),
            index: 0
        });
        setValues();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Animated.View
                entering={FadeInDown.delay(350).duration(400)}
                style={[style.container, { backgroundColor: colors.background }]}
            >
                <Loading refresh={(isLoading)} />
                <View style={{ justifyContent: 'center' }}>
                    <View>
                        <ScrollView>
                            <Text style={{ textAlign: 'center', marginVertical: 5 }} variant='titleLarge'>Bienvenido</Text>
                            <Text style={{ textAlign: 'center', color: colors.outline, marginVertical: 5 }} variant='titleSmall'>Ingrese sus datos para iniciar sesión</Text>
                            <KeyboardAvoidingView style={[{ paddingVertical: 5, flex: 1 }]}
                                enabled
                                behavior={Platform.OS === "ios" ? "padding" : undefined}
                            >
                                <TextInput
                                    iconLeft='server'
                                    placeholder='exammple.domain.com'
                                    label='Dirección del Servidor'
                                    value={domain.replace('https://', '').replace('http://', '').replace('/', '')}
                                    editable={(domain === '') ? true : false}
                                    containerStyle={{ marginVertical: 5 }}
                                    action={<Button
                                        mode='text'
                                        text='cambiar'
                                        variantText='labelSmall'
                                        labelStyle={{ textTransform: 'capitalize', fontWeight: 'bold' }}
                                        onPress={(() => navigation.navigate('DomainScreen'))}
                                    />}
                                />
                                <Input
                                    editable={(!isLoading)}
                                    formInputs={control._defaultValues}
                                    control={control}
                                    name={'email'}
                                    iconLeft='mail'
                                    placeholder='ejemplo@correo.com'
                                    keyboardType='email-address'
                                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                                    label='Correo'
                                    returnKeyType='next'
                                    onSubmitEditing={() => {
                                        nextInput.current?.focus();
                                    }}
                                    autoCapitalize='none'
                                />
                                <Input
                                    editable={(!isLoading)}
                                    onRef={(nextInput) => { nextInput = nextInput }}
                                    formInputs={control._defaultValues}
                                    control={control}
                                    name={'password'}
                                    iconLeft='lock-closed'
                                    keyboardType='default'
                                    secureTextEntry
                                    placeholder='**********'
                                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                                    label='Contraseña'
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    returnKeyType='next'
                                    autoCapitalize='none'
                                    onChange={async ({ nativeEvent: { text } }) => {
                                        if ((isCompatible && saved === 'saveBiometry' && getted) && text !== '') {
                                            setIsChanged(true);
                                        }
                                        if ((isCompatible && saved === 'saveBiometry' && getted) && text === '') {
                                            setIsChanged(false);
                                        }
                                    }}
                                />
                                <CheckBox
                                    text='Recordar contraseña'
                                    isChecked={(saved !== null) ? 'checked' : 'unchecked'}
                                    onPress={() => (saved === null) ? check() : deleteCheck()}
                                />
                            </KeyboardAvoidingView>
                            {
                                (isCompatible && saved === 'saveBiometry' && getted && !isChanged)
                                    ?
                                    <View style={{ alignItems: 'center' }}>
                                        <Animated.View entering={BounceIn} >
                                            <IconButton name='finger-print-outline' iconsize={35} onPress={async () => useBiometricos()} />
                                        </Animated.View>
                                        <Text variant='labelSmall' style={{ marginTop: 10 }}>Iniciar sesión con fuerte biométrica</Text>
                                    </View>
                                    :
                                    <Button
                                        text='Iniciar Sesión'
                                        mode='contained'
                                        onPress={handleSubmit(onSubmit)}
                                        loading={(isLoading)}
                                        disabled={(isLoading)}
                                        labelStyle={{ paddingVertical: 5, paddingHorizontal: 20 }}
                                        contentStyle={{ marginBottom: 15 }}
                                    />
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 5 }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('PdfScreen', { name: 'Registro', url: `${domain}/docs/REGISTRO-PLATAFORMA.pdf` })}
                        disabled={isLoading} >
                        <Text variant='titleSmall' style={[{ textAlign: 'center', marginVertical: 10 }]}>Regístrate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Alert.alert('Alerta', 'Contacta a tu titular para recuperar tu contraseña', [], { cancelable: true })}
                        disabled={isLoading} >
                        <Text variant='titleSmall' style={[{ textAlign: 'center', marginVertical: 10 }]} >Olvidé mi contraseña</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => navigation.navigate('TCAP')} disabled={isLoading} >
                    <Text variant='titleSmall' style={{ textAlign: 'center' }}>Términos y condiciones y aviso de privacidad</Text>
                </TouchableOpacity>

                <View style={{ marginVertical: 10 }}>
                    <SocialNetworks />
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 15,
        paddingHorizontal: '10%',

    }
});