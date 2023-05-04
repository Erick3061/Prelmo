import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { Props } from './SearchScreen';
import { IconButton } from '../components/IconButton';
import { useAppSelector, useAppDispatch, useMyAccounts, useDebouncedValue } from '../app/hooks';
import { stylesApp } from '../App';
import Color from 'color';
import TextInput from '../components/Input/TextInput';
import { Loading } from '../components/Loading';
import { Account } from '../interfaces/interfaces';
import { ReciclerData } from '../components/ReciclerData';
import { updateAccounts } from '../features/appSlice';
import { HandleContext } from '../context/HandleContext';

export const ListAccountScreen = ({ navigation, route: { params: { type } } }: Props) => {
    const { insets, theme: { colors, roundness, dark }, accountsSelected } = useAppSelector(state => state.app);
    const { isLoading, data, refetch, isFetching, error } = useMyAccounts();
    const dispatch = useAppDispatch();
    const { handleError } = useContext(HandleContext);
    const [textQueryValue, setTextQueryValue] = useState<string>('');
    const debaucedValue = useDebouncedValue(textQueryValue, 300);
    const [filter, setFilter] = useState<Array<Account>>([]);
    const backgroundColor: string = dark ? Color(colors.background).darken(.4).toString() : colors.background;

    useEffect(() => {
        if (error) handleError(String(error));
    }, [error]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: ({ canGoBack, label, tintColor }) => {
                return (
                    <IconButton name='home' />
                )
            },
            header: (({ back, navigation, options }) => {
                return (
                    <View style={[
                        {
                            width: '100%',
                            backgroundColor: backgroundColor,
                            flexDirection: type === 'Accounts' ? 'row-reverse' : 'row',
                            alignItems: 'flex-end',
                            paddingTop: Platform.OS === 'ios' ? insets ? insets.top - 10 : 0 : 0
                        },
                        stylesApp.shadow,
                        {
                            elevation: 5,
                            shadowColor: colors.primary,
                            paddingBottom: 6,
                        }
                    ]}>
                        <IconButton
                            iconsize={30}
                            style={{ paddingHorizontal: 10, marginBottom: 2 }}
                            onPress={() => navigation.goBack()}
                            name={type === 'Accounts' ? 'checkmark-circle-outline' : Platform.OS === 'android' ? 'arrow-back-outline' : 'chevron-back-outline'}
                        />
                        <TextInput
                            iconLeft='search'
                            placeholder={'Buscar cuenta'}
                            containerStyle={[
                                {
                                    flex: 1,
                                    borderRadius: roundness * 4,
                                    borderWidth: .2,
                                    borderBottomWidth: .2,
                                    borderBottomColor: colors.primary,
                                    borderColor: colors.primary,
                                    marginTop: 6,
                                    height: 40,
                                    marginRight: 15,
                                },
                                type === 'Accounts' && {
                                    marginRight: 0,
                                    marginLeft: 15,
                                }
                            ]}
                            iconStyle={{
                                marginTop: 6
                            }}
                            inputStyle={{
                                marginTop: 6
                            }}
                            onChangeText={setTextQueryValue}
                        />
                    </View>
                )
            }
            ),
        });
    }, [navigation, colors]);

    useEffect(() => {
        if (data) {
            setFilter(data.accounts);
        }
    }, [data])

    useEffect(() => {
        if (data) {
            setFilter(() => data.accounts.filter(f => String(f['Nombre']).toLowerCase().includes(debaucedValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))));
        }
    }, [debaucedValue]);

    useEffect(() => {
        if (textQueryValue.length === 0 && data) {
            setFilter(data.accounts);
        }
    }, [textQueryValue]);

    const update = (item: Account) => {
        if (type === 'Account') {
            dispatch(updateAccounts([item]));
            navigation.goBack();
        } else {
            const exist = accountsSelected.find(f => f.CodigoCte === item.CodigoCte);
            if (exist) {
                dispatch(updateAccounts(accountsSelected.filter(f => f.CodigoCte !== item.CodigoCte)));
            } else {
                dispatch(updateAccounts([...accountsSelected, item]));
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Loading loading={isLoading} />
            <ReciclerData
                data={type === 'Accounts' ? filter.filter(f => (accountsSelected.find(b => b.CodigoCte === f.CodigoCte)) === undefined) : filter}
                labelField='Nombre'
                valueField='CodigoCte'
                loading={isFetching}
                onChange={update}
                selected={accountsSelected}
                onRefresh={() => refetch()}
            />
        </View>
    )
}
