import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { View, KeyboardAvoidingView, Pressable } from 'react-native';
import { getKeys, modDate } from '../functions/functions';
import { formatDate, Orientation } from '../interfaces/interfaces';
import { Select } from '../components/select/Select';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from '../components/calendar/Calendar';
import { TypeReport } from '../types/types';
import { Button } from '../components/Button';
import Text from '../components/Text';
import TextInput from '../components/Input/TextInput';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { RootDrawerNavigator } from '../navigation/Drawer';
import { updateAccounts } from '../features/appSlice';

interface Accout {
    name: string;
    report: string;
    start: string;
    end: string;
}

const calendars = [
    { label: 'Fecha inicio', date: modDate({ days: -30 }).DATE },
    { label: 'Fecha final', date: modDate({}).DATE },
];

const reports: Array<{ name: string, value: Exclude<TypeReport, "batery" | "state" | "apci-week">, msg: string }> = [
    { name: 'APERTURA Y CIERRE', value: 'ap-ci', msg: 'Con este reporte podra consultar los horarios en los que se recibieron los eventos de apertura y cierre' },
    { name: 'EVENTO DE ALARMA', value: 'event-alarm', msg: 'Con este reporte podra ver los eventos de alarma, asi como los eventos generados por su sistema de alarma' },
];

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { Switch } from 'react-native';
import Color from 'color';
import { AlertContext } from '../components/Alert/AlertContext';

type ResultAccountScreenProps = NativeStackNavigationProp<rootStackScreen, 'Drawer'>;

interface Props extends DrawerScreenProps<RootDrawerNavigator, 'SelectAccountScreen'> { };

export const SelectAccountScreen = ({ navigation, route }: Props) => {
    const stack = useNavigation<ResultAccountScreenProps>();
    const { theme: { colors, fonts, roundness }, orientation, accountsSelected } = useAppSelector(state => state.app);
    const { control, handleSubmit, reset, setValue: setValueForm, formState } = useForm<Accout>({ defaultValues: { name: '', report: '' } });
    const [report, setReport] = useState<typeof reports>();
    const [dates, setDates] = useState<Array<{ name: string, date?: formatDate }>>();
    const [isSelected, setIsSelected] = useState(false);
    const isFocus = useIsFocused();
    const dispatch = useAppDispatch();
    const { notification } = useContext(AlertContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Consulta individual'
        })
    }, [navigation]);

    const goToSearch = () => {
        if (accountsSelected.length > 1) dispatch(updateAccounts(accountsSelected.slice(0, 1)));
        stack.navigate('Search', { type: 'Account' });
    }

    const onSubmit: SubmitHandler<Accout> = async (props) => {
        if (dates && accountsSelected.length > 0 && report) {
            const missingDates = dates.filter(s => s.date === undefined).map(name => name.name);
            if (missingDates?.length === 0) {
                const start = dates.find(f => f.name === 'Fecha inicio')?.date?.date.date ?? modDate({}).date.date;
                const end = dates.find(f => f.name === 'Fecha final')?.date?.date.date ?? modDate({}).date.date;
                stack.navigate('ResultAccountScreen', { account: accountsSelected[0], end, report: report[0].value, start, keys: getKeys(report[0].value), typeAccount: 1, filter: isSelected });
            } else {
                notification({
                    type: 'error',
                    title: 'Error al asignar Fechas',
                    text: `Fechas faltantes:\n${missingDates}`
                });
            }
        }
    };

    const _renderSelectAccount = useCallback(() => {
        return (
            <Controller
                control={control}
                rules={{ required: { message: 'Debe seleccionar una cuenta', value: true } }}
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
                        {error && <Text variant='titleSmall' style={[{ marginHorizontal: 15, color: colors.danger }]}>{error.message}</Text>}
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
                            {error && <Text style={[fonts.titleSmall, { marginLeft: 15, color: colors.danger }]}>{error.message}</Text>}
                        </>
                    }
                />
            )
        }
        return undefined;
    }, [control, report, setReport, reports, colors, orientation])

    useEffect(() => {
        if (accountsSelected.length > 0) {
            setValueForm('name', accountsSelected[0].Nombre);
        } else {
            setValueForm('name', '');
        }
    }, [accountsSelected, isFocus]);

    return (
        <View style={[{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }]}>
            <View style={[
                { width: '100%' },
                orientation === Orientation.landscape && {
                    width: '80%'
                }
            ]}>
                <ScrollView>
                    {
                        <KeyboardAvoidingView>
                            <Text variant='titleMedium' style={[{ textAlign: 'center' }]}>Seleccione el inicio y fin de la consulta;</Text>
                            <Text variant='titleMedium' style={[{ textAlign: 'center' }]}>Recuerde que solo se puede consultar hasta 30 dias naturales</Text>
                            {_renderSelectAccount()}
                            {_renderSelectReport()}
                            <Pressable
                                onPress={() => setIsSelected(!isSelected)}
                                android_ripple={{ color: Color(colors.primary).fade(.9).toString() }}
                            >
                                {
                                    ({ pressed }) => {
                                        return (
                                            <View style={[
                                                {
                                                    borderRadius: roundness,
                                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                                    paddingVertical: 10, paddingHorizontal: 5
                                                },
                                                pressed && { backgroundColor: Color(colors.primary).fade(.9).toString() },
                                            ]}>
                                                <Text variant='labelLarge'>Filtar eventos</Text>
                                                <Switch onChange={() => setIsSelected(!isSelected)} value={isSelected} thumbColor={colors.primary} trackColor={{ false: undefined, true: Color(colors.primary).fade(.8).toString() }} />
                                            </View>
                                        )
                                    }
                                }
                            </Pressable>
                            <View style={[
                                orientation === Orientation.landscape && {
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }
                            ]}>
                                <Calendar
                                    calendars={calendars}
                                    backgroundColor={colors.background}
                                    textColor={colors.text}
                                    colorOutline={colors.primary}
                                    limitDays={30}
                                    onChange={setDates}
                                    Textstyle={fonts.titleMedium}
                                />
                                <View style={{ padding: 10, alignItems: 'flex-end' }}>
                                    <Button
                                        text='CONSULTAR'
                                        style={{ marginVertical: 5 }}
                                        mode='contained'
                                        onPress={handleSubmit(onSubmit)}
                                        contentStyle={{ paddingVertical: 5 }}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    }
                </ScrollView>
            </View>
        </View >
    )
}