import React from 'react'
import { View } from 'react-native'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { ReciclerData } from '../components/ReciclerData';
import { updateAccounts } from '../features/appSlice';

export const AccountsSelectedScreen = () => {
    const { accountsSelected } = useAppSelector(state => state.app);
    const dispatch = useAppDispatch();
    return (
        <View style={{ flex: 1 }}>
            <ReciclerData
                data={accountsSelected}
                labelField='Nombre'
                valueField='CodigoCte'
                loading={false}
                selected={[]}
                onChange={(item) => dispatch(updateAccounts(accountsSelected.filter(f => f.CodigoCte !== item.CodigoCte)))}
            />
        </View>
    )
}
