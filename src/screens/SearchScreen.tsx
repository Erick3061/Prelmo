import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { rootStackScreen } from '../navigation/Stack';
import { ListAccountScreen } from './ListAccountScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AccountsSelectedScreen } from './AccountsSelectedScreen';
import { ListGroupScreen } from './ListGroupScreen';

export interface Props extends NativeStackScreenProps<rootStackScreen, 'Search'> { };
export const SearchScreen = (props: Props) => {
    if (props.route.params.type === 'Groups') {
        return (
            <ListGroupScreen {...props} />
        )
    } else {
        if (props.route.params.type === 'Accounts') {
            const Tab = createMaterialTopTabNavigator();

            return (
                <Tab.Navigator>
                    <Tab.Screen name="todas">
                        {() => <ListAccountScreen {...props} />}
                    </Tab.Screen>
                    <Tab.Screen name="Seleccionadas" component={AccountsSelectedScreen} />
                </Tab.Navigator>
            )
        } else {
            return (
                <ListAccountScreen {...props} />
            )
        }
    }
}