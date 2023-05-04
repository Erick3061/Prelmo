import React from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { Text } from 'react-native';
import { useAppSelector } from '../../app/hooks';
import TextInput, { PropsTI } from './TextInput';

interface Props<T> extends PropsTI {
    formInputs: T;
    name: keyof T;
    control: Control<any, any>;
    rules?: RegisterOptions;
}

export const Input = <T extends Object>(props: Props<T>) => {
    const { control, name, rules, onRef } = props;
    const { theme: { colors } } = useAppSelector(store => store.app);

    return (
        <Controller
            control={control}
            rules={{ ...rules }}
            name={String(name)}
            render={({ field: { value, onBlur, onChange }, fieldState: { error } }) => (
                <>
                    <TextInput
                        {...props}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onRef={onRef}
                        value={value}
                        containerStyle={{ marginVertical: 5 }}
                    />
                    {error && <Text style={{ color: colors.error }}>{error.message}</Text>}
                </>
            )
            }
        />
    )
}