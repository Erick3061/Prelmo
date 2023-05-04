import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView } from 'react-native';
import { Orientation } from '../interfaces/interfaces';
import { Select } from '../components/select/Select';
import { useAppSelector } from '../app/hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { TypeReport } from '../types/types';
import { Button } from '../components/Button';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import Text from '../components/Text';
import TextInput from '../components/Input/TextInput';
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerNavigator } from '../navigation/Drawer';
import { getKeysAccount } from '../functions/functions';

type Stack = NativeStackScreenProps<rootStackScreen>;

type Accout = {
    name: string;
    report: string;
}

const reports: Array<{ name: string, value: TypeReport, msg: string }> = [
    { name: 'PROBLEMAS DE BATERIA', value: 'batery', msg: '' },
    { name: 'ESTADO DE SUCURSALES', value: 'state', msg: '' },
    { name: 'HORARIO DE APERTURAS Y CIERRES', value: 'apci-week', msg: '' },
];

type ResultAccountScreenProps = NativeStackNavigationProp<rootStackScreen, 'Drawer'>;

interface Props extends DrawerScreenProps<RootDrawerNavigator, 'SelectGroupsScreen'> { };

export const SelectGroupsScreen = ({ navigation, route }: Props) => {
    const stack = useNavigation<ResultAccountScreenProps>();
    const { theme: { colors, fonts, roundness }, orientation, groupsSelected } = useAppSelector(state => state.app);
    const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<Accout>({ defaultValues: { name: '', report: '' } });
    const [report, setReport] = useState<typeof reports>();
    const isFocus = useIsFocused();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Consulta por grupo'
        })
    }, [navigation]);

    const goToSearch = () => {
        stack.navigate('Search', { type: 'Groups' });
    }

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (groupsSelected.length > 0 && report && report?.length > 0) {
            stack.navigate('ResultAccountsScreen', {
                accounts: [{ name: groupsSelected[0].Nombre, code: groupsSelected[0].Codigo }],
                report: report[0].value,
                keys: getKeysAccount(report[0].value),
                typeAccount: groupsSelected[0].Tipo,
                nameGroup: groupsSelected[0].Nombre,
            });
        }
    };

    const _renderSelectGroup = useCallback(() => {
        return (
            <Controller
                control={control}
                rules={{ required: { message: 'Debe seleccionar un grupo', value: true } }}
                name='name'
                render={({ field: { value, onChange }, fieldState: { error } }) =>
                    <>
                        <TextInput
                            editable={false}
                            value={value}
                            label={'Seleccione una cuenta'}
                            placeholder={'Seleccione una cuenta'}
                            showSoftInputOnFocus={false}
                            iconRight={'chevron-down'}
                            onPress={goToSearch}
                            onRightPress={goToSearch}
                            containerStyle={{
                                borderRadius: roundness,
                                borderWidth: .2,
                                borderBottomWidth: .2,
                                borderBottomColor: colors.primary,
                                borderColor: colors.primary,
                                paddingLeft: 15,
                                marginVertical: 10,
                            }}
                            iconStyle={{ marginRight: 15 }}
                        />
                        {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                    </>
                }
            />
        )
    }, [control, colors]);

    const _renderSelectReport = useCallback(() => {
        if (reports) {
            return (
                <Controller
                    control={control}
                    rules={{ required: { message: 'Debe seleccionar un reporte', value: true } }}
                    name='report'
                    render={({ field: { value, onChange }, fieldState: { error } }) =>
                        <>
                            <Select
                                maxHeight={200}
                                animationType='fade'
                                valueField='value'
                                labelField='name'
                                value={value}
                                label='Seleccionar reporte'
                                itemsSelected={report ?? []}
                                data={reports}
                                onChange={(value) => {
                                    setReport(value);
                                    if (value.length > 0) {
                                        onChange(value[0].name);
                                    } else {
                                        onChange('')
                                    }
                                }}
                            />
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.error }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors]);

    useEffect(() => {
        if (groupsSelected.length > 0) {
            setValue('name', groupsSelected[0].Nombre);
        } else {
            setValue('name', '');
        }
    }, [groupsSelected, isFocus]);

    return (
        <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && {
                    width: '80%'
                }
            ]}>
                <ScrollView>
                    <Text variant='titleMedium' style={[{ textAlign: 'center' }]}>Recuerde que solo se puede consultar hasta 30 dias naturales</Text>
                    {
                        <KeyboardAvoidingView>
                            {_renderSelectGroup()}
                            {_renderSelectReport()}
                            <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                <Button
                                    text='CONSULTAR'
                                    style={{ marginVertical: 5 }}
                                    mode='contained'
                                    onPress={handleSubmit(onSubmit)}
                                    contentStyle={{ paddingVertical: 5 }}
                                />
                            </View>
                        </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
        </View >
    )
}