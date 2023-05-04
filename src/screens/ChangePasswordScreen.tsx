import React, { useContext, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, View, TextInput as NativeTextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button } from '../components/Button';
import { Input } from '../components/Input/Input';
import { useAppSelector } from '../app/hooks';
import { HandleContext } from '../context/HandleContext';
import { Orientation, UpdateUserProps } from '../interfaces/interfaces';
import { useMutation } from '@tanstack/react-query';
import { UpdateUser } from '../api/Api';
import { Loading } from '../components/Loading';


type ChagePassword = {
    password: string;
    newPassword: string;
    confirmPassword: string;
}

export const ChangePasswordScreen = () => {
    const { control, handleSubmit, reset, setValue, setError } = useForm<ChagePassword>({ defaultValues: { password: '', confirmPassword: '', newPassword: '' } });
    const newPass = useRef<NativeTextInput>(null);
    const confPass = useRef<NativeTextInput>(null);
    const { handleError } = useContext(HandleContext);
    const { User, orientation } = useAppSelector(state => state.app);

    const { isLoading, mutate } = useMutation(['updateUser'], (props: UpdateUserProps) => UpdateUser(props), {
        onError: error => {
            if (String(error).includes('no coincide')) {
                setError('password', { message: String(error) }, { shouldFocus: false });
            }
            handleError(String(error))
        },
        onSuccess: (data) => Toast.show({ text1: 'Correcto', text2: 'Contraseña cambiada', type: 'success', autoHide: true, visibilityTime: 2000 })
    })

    const onSubmit: SubmitHandler<ChagePassword> = async ({ confirmPassword, newPassword, password }) => {
        if (newPassword !== confirmPassword) {
            setValue('confirmPassword', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
            setError('confirmPassword', { message: 'Contraseña no coincide' });
        } else {
            if (User) {
                const { id, fullName } = User;
                mutate({ id, fullName, lastPassword: password, password: confirmPassword });
            }
        }
    };

    return (
        <View style={[
            {
                flex: 1,
                justifyContent: 'center',
                padding: 10
            },
            orientation === Orientation.landscape && {
                width: '80%',
                alignSelf: 'center'
            }
        ]}>
            <Loading refresh={isLoading} />
            <KeyboardAvoidingView>
                <Input
                    formInputs={control._defaultValues}
                    control={control}
                    iconLeft='lock-closed-outline'
                    name={'password'}
                    keyboardType='default'
                    placeholder='**********'
                    rules={{ required: { value: true, message: 'Campo requerido' } }}
                    secureTextEntry
                    label='Contraseña'
                    onSubmitEditing={() => newPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    onRef={newPass => newPass = newPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'newPassword'}
                    iconLeft='lock-closed-outline'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'Minimo 6 caracteres' },

                    }}
                    secureTextEntry
                    label='Contraseña nueva'
                    onSubmitEditing={() => confPass.current?.focus()}
                    returnKeyType='next'
                />

                <Input
                    onRef={confPass => confPass = confPass}
                    formInputs={control._defaultValues}
                    control={control}
                    name={'confirmPassword'}
                    iconLeft='lock-closed-outline'
                    keyboardType='default'
                    placeholder='**********'
                    rules={{
                        required: { value: true, message: 'Campo requerido' },
                        minLength: { value: 6, message: 'Minimo 6 caracteres' },

                    }}
                    secureTextEntry
                    label='Confirma tu contraseña'
                    onSubmitEditing={handleSubmit(onSubmit)}
                    returnKeyType='done'
                />

                <View style={{ alignItems: 'flex-end', paddingVertical: 15 }}>
                    <Button
                        text='Cambiar contraseña'
                        icon={'swap-horizontal-outline'}
                        mode='contained'
                        loading={false}
                        onPress={handleSubmit(onSubmit)}
                        disabled={false}
                        labelStyle={{ textTransform: 'uppercase' }}
                        contentStyle={{ paddingVertical: 5 }}
                    />
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}
