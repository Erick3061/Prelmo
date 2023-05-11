import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { IconButton } from '../components/IconButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from './Stack';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Pressable, PressableProps, StyleSheet, View, Platform } from 'react-native';
import Text from '../components/Text';
import Color from 'color';
import Icon from 'react-native-vector-icons/Ionicons';
import { logOut, updateTheme } from '../features/appSlice';
import { CombinedDarkTheme, CombinedLightTheme } from '../config/theme/Theme';
import { SelectAccountScreen } from '../screens/SelectAccountScreen';
import { Orientation } from '../interfaces/interfaces';
import { SelectGroupsScreen } from '../screens/SelectGroupsScreen';
import { SelectAccountsScreen } from '../screens/SelectAccountsScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DetailsInfoScreen } from '../screens/DetailsInfoScreen';
import { DownloadScreen } from '../screens/DownloadScreen';
import { HomeScreen } from '../screens/HomeScreen';

export type RootDrawerNavigator = {
    HomeScreen: undefined;
    SelectAccountScreen: undefined;
    SelectGroupsScreen: undefined;
    ChangePasswordScreen: undefined;
    DownloadScreen: undefined;
    DetailsInfoScreen: undefined;
    SelectAccountsScreen: undefined;
}
interface PropsItem extends PressableProps {
    icon?: string;
    label: string;
    active?: boolean;
}

const Menu = createDrawerNavigator<RootDrawerNavigator>();
interface Props extends NativeStackScreenProps<rootStackScreen, 'Drawer'> { };
export const Drawer = (props: Props) => {
    return (
        <Menu.Navigator
            drawerContent={props => <MenuContent {...props} />}
            screenOptions={({ navigation, route }) => ({
                headerLeft: ((props) => <IconButton style={{ paddingHorizontal: 10 }} name='menu-outline' onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />),
            })}
        >
            <Menu.Screen name="HomeScreen" options={{ title: 'Inicio' }} component={HomeScreen} />
            <Menu.Screen name="SelectAccountScreen" options={{ title: 'Individual' }} component={SelectAccountScreen} />
            <Menu.Screen name="DownloadScreen" options={{ title: 'Descargas' }} component={DownloadScreen} />
            <Menu.Screen name="SelectGroupsScreen" options={{ title: 'Grupal' }} component={SelectGroupsScreen} />
            <Menu.Screen name="SelectAccountsScreen" options={{ title: 'Avanzado' }} component={SelectAccountsScreen} />
            <Menu.Screen name="ChangePasswordScreen" options={{ title: 'Cambiar contraseña' }} component={ChangePasswordScreen} />
            <Menu.Screen name="DetailsInfoScreen" options={{ title: 'Detalles' }} component={DetailsInfoScreen} />
        </Menu.Navigator>
    )
}

const RenderItem = (props: PropsItem) => {
    const { icon, label, active } = props;
    const { theme: { colors } } = useAppSelector(state => state.app);
    const borderRadius: number = 100;
    const color: string = !active ? 'transparent' : colors.primaryContainer;
    const style = StyleSheet.create({
        container: {
            padding: 8,
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: color,
            marginVertical: 5,
            marginRight: 10,
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
        },
        icon: {
            marginLeft: 20,
            marginRight: 10,
        }
    });

    return (
        <Pressable {...props}>
            {({ pressed }) => {
                return (
                    <View style={[
                        style.container,
                        !active && pressed && {
                            backgroundColor: Color(colors.primaryContainer).fade(.8).toString()
                        }
                    ]}>
                        {icon && <Icon style={style.icon} name={icon} size={25} color={colors.outline} />}
                        <Text variant="labelMedium" style={{ color: colors.outline }}>{label}</Text>
                    </View>
                )
            }}
        </Pressable>
    )


}

const MenuContent = ({ navigation, state }: DrawerContentComponentProps) => {
    const { index, routeNames } = state;
    const { theme, User, orientation, insets } = useAppSelector(state => state.app);
    const { colors, fonts, roundness, dark } = theme;
    const dispatch = useAppDispatch();
    const iconSize: number = 20;
    const queryClient = useQueryClient();

    return (
        <View style={[
            { flex: 1 },
            Platform.OS === 'ios' && orientation === Orientation.portrait && { paddingTop: insets ? insets.top : 0 }
        ]}>
            <View style={{ padding: 10, paddingLeft: 0 }}>
                {
                    User &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10, width: '100%' }}>
                        <View style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                            <Text
                                variant="headlineSmall"
                                style={[
                                    {
                                        color: colors.background,
                                        textAlign: 'center'
                                    }]}
                            >{User.fullName.split(' ').map(el => el[0]).join('').slice(0, 1).toUpperCase()}</Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, flex: 1 }}>
                            <Text variant='titleMedium'>Hola, <Text variant="titleMedium" style={{ fontWeight: '700' }}>{User.fullName.split(' ').slice(0, 1)}</Text></Text>
                            <Text variant="titleSmall" style={{ color: colors.outline }}>{User.email}</Text>
                            <Text variant="titleSmall" style={{ color: colors.outline }}>{User.roles}</Text>
                        </View>
                    </View>
                }
            </View>
            <DrawerContentScrollView>
                <RenderItem
                    active={(routeNames[index] === 'HomeScreen') && true}
                    icon={`home${routeNames[index] === 'HomeScreen' ? '' : '-outline'}`}
                    label="Inicio"
                    onPress={() => navigation.navigate<keyof RootDrawerNavigator>("HomeScreen")}
                />

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 30 }}>Consultas</Text>
                    <RenderItem
                        active={routeNames[index] === 'SelectAccountScreen' && true}
                        icon={`document${routeNames[index] === 'SelectAccountScreen' ? '' : '-outline'}`}
                        label="Individual"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('SelectAccountScreen')}
                    />
                    <RenderItem
                        active={routeNames[index] === 'SelectGroupsScreen' && true}
                        icon={`documents${routeNames[index] === 'SelectGroupsScreen' ? '' : '-outline'}`}
                        label="Grupal"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('SelectGroupsScreen')}
                    />
                    <RenderItem
                        active={routeNames[index] === 'SelectAccountsScreen' && true}
                        icon={`document-text${routeNames[index] === 'SelectAccountsScreen' ? '' : '-outline'}`}
                        label="Avanzado"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('SelectAccountsScreen')}
                    />
                </View>

                <View style={{ paddingVertical: 5 }}>
                    <Text style={{ color: colors.primary, fontWeight: '600', marginLeft: 30 }}>Otros</Text>
                    <RenderItem
                        active={routeNames[index] === 'DownloadScreen' && true}
                        icon={`cloud-download${routeNames[index] === 'DownloadScreen' ? '' : '-outline'}`}
                        label="Descargas"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('DownloadScreen')}
                    />
                    <RenderItem
                        active={routeNames[index] === 'ChangePasswordScreen' && true}
                        icon={`lock-closed${routeNames[index] === 'ChangePasswordScreen' ? '' : '-outline'}`}
                        label="Cambiar contraseña"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('ChangePasswordScreen')}
                    />
                    <RenderItem
                        active={routeNames[index] === 'DetailsInfoScreen' && true}
                        icon={`help${routeNames[index] === 'DetailsInfoScreen' ? '' : '-outline'}`}
                        label="Acerca de Prelmo"
                        onPress={() => navigation.navigate<keyof RootDrawerNavigator>('DetailsInfoScreen')}
                    />
                </View>
                <View style={{ paddingVertical: 5 }}>
                    <View style={{ alignItems: 'center', marginVertical: 5, marginHorizontal: 10 }}>
                        <View style={[styles.containerST, { borderRadius: roundness * 3 }]}>
                            <Pressable
                                style={[styles.containerOpT, { borderRadius: roundness * 3, borderColor: colors.primary }, (!dark) && { backgroundColor: colors.primary }]}
                                onPress={() => dispatch(updateTheme(CombinedLightTheme))}
                            >
                                <Icon style={[styles.icon]} name="sunny-outline" size={iconSize} color={(!dark) ? colors.background : colors.onSurface} />
                                <Text style={[fonts.titleSmall, (!dark) && { color: colors.background }]}>Claro</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.containerOpT, { borderRadius: roundness * 3, borderColor: colors.primary }, (dark) && { backgroundColor: colors.primary }]}
                                onPress={() => dispatch(updateTheme(CombinedDarkTheme))}
                            >
                                <Icon style={[styles.icon]} name="moon-outline" size={iconSize} />
                                <Text style={[fonts.titleSmall, (dark) && { color: colors.background }]}>Oscuro</Text>
                            </Pressable>
                        </View>
                    </View>
                    <RenderItem icon="log-out-outline" label="Cerrar sesión" onPress={async () => {
                        try {
                            queryClient.clear();
                            dispatch(logOut());
                        } catch (error) { }
                    }} />
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    containerST: {
        flexDirection: 'row',
        paddingVertical: 5,
        width: '85%',
    },
    containerOpT: {
        flexDirection: 'row',
        marginHorizontal: 5,
        paddingVertical: 4,
        paddingHorizontal: 5,
        flex: 1,
        justifyContent: 'center',
        borderWidth: 1
    },
    icon: {
        marginRight: 5
    }
});