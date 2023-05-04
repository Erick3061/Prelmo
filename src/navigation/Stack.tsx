import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { LogInScreen } from '../screens/LogInScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { Drawer } from './Drawer';
import { TCAPScreen } from '../screens/TCAPScreen';
import { User, Account, Key, Events } from '../interfaces/interfaces';
import { SearchScreen } from '../screens/SearchScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DetailsInfoScreen } from '../screens/DetailsInfoScreen';
import { ResultAccountScreen } from '../screens/ResultAccountScreen';
import { TypeReport, typeAccount } from '../types/types';
import { ResultAccountsScreen } from '../screens/ResultAccountsScreen';
import { TableScreen } from '../screens/TableScreen';
import { PdfScreen } from '../screens/PdfScreen';
import { CheckAuth } from '../api/Api';
import { useQuery } from '@tanstack/react-query';
import { HandleContext } from '../context/HandleContext';
import { setUser } from '../features/appSlice';
import { Loading } from '../components/Loading';

export type rootStackScreen = {
    SplashScreen: undefined;
    LogInScreen: undefined;
    Drawer: undefined;
    Search: { type: 'Account' | 'Accounts' | 'Groups' };
    TCAP: { user: User } | undefined;
    ChangePasswordScreen: undefined;
    DetailsInfoScreen: undefined;
    ResultAccountScreen: {
        account: Account,
        start: string,
        end: string,
        report: Exclude<TypeReport, "batery" | "state" | "apci-week">,
        keys: Array<Key<Events>>,
        typeAccount: typeAccount,
        filter: boolean,
    };
    ResultAccountsScreen: {
        accounts: Array<{ name: string, code: number }>,
        nameGroup: string,
        start?: string,
        end?: string,
        report: TypeReport,
        keys: Array<Key<Events>> | Array<Key<Account>>,
        typeAccount: typeAccount
    };
    TableScreen: {
        events: Array<Events>;
        keys: Array<Key<Events>> | Array<Key<Account>>;
        name: string;
        report: string;
        address: string;
    }
    PdfScreen: {
        name: string;
        url: string;
    };
}

const Stack = createNativeStackNavigator<rootStackScreen>();


export const StackScreens = () => {
    const { status: isAuth, User } = useAppSelector((state) => state.app);
    const { handleError } = useContext(HandleContext);
    const dispath = useAppDispatch();

    const { isFetching } = useQuery(['checkAuth'], () => CheckAuth(), {
        retry: 0,
        refetchInterval: 300000,
        enabled: isAuth,
        onError: error => handleError(String(error)),
        onSuccess: (resp) => dispath(setUser(resp))
    });

    return (
        <>
            <Stack.Navigator initialRouteName='SplashScreen'>
                {
                    isAuth
                        ?
                        <Stack.Group key={"Private"}>
                            <Stack.Screen name='Drawer' component={Drawer} options={{ headerShown: false }} />
                            <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} />
                            <Stack.Screen name='DetailsInfoScreen' component={DetailsInfoScreen} />
                            <Stack.Screen name='ResultAccountScreen' component={ResultAccountScreen} />
                            <Stack.Screen name='ResultAccountsScreen' component={ResultAccountsScreen} />
                            <Stack.Screen name='Search' component={SearchScreen} options={{ animation: 'fade_from_bottom' }} />
                            <Stack.Screen name='TableScreen' component={TableScreen} />
                        </Stack.Group>
                        :
                        <Stack.Group screenOptions={{ headerShown: false }} key={"Public"}>
                            <Stack.Screen name='SplashScreen' component={SplashScreen} />
                            <Stack.Screen name='LogInScreen' component={LogInScreen} />
                        </Stack.Group>
                }
                <Stack.Group key={"AllState"}>
                    <Stack.Screen name='PdfScreen' component={PdfScreen} />
                </Stack.Group>
                <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
                    <Stack.Screen name="TCAP" options={{ headerShown: false, }} component={TCAPScreen} />
                </Stack.Group>
            </Stack.Navigator>
            <Loading refresh={isFetching} />
        </>
    )
}
