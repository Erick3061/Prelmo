import Color from 'color';
import React from 'react';
import { Linking, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { IconButton } from './IconButton';

export const SocialNetworks = () => {
    const { theme: { colors, dark } } = useAppSelector(state => state.app);
    const iconColor: string = dark ? colors.primary : Color(colors.primary).darken(.3).toString();
    return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 10 }}>
            <IconButton color={iconColor} name='browsers' onPress={() => Linking.openURL('https://pem-sa.com')} />
            <IconButton color={iconColor} name='logo-facebook' onPress={() => Linking.openURL('fb://page/557351134421255')
                .catch(() => Linking.openURL('https://www.facebook.com/PEMSA-Protecci%C3%B3n-Electr%C3%B3nica-Monterrey-SA-de-CV-557351134421255')
                    .catch(() => {
                        // dispatch(updateError({ open: true, msg: 'Error al abrir el enlace' }))
                    })
                )} />
            <IconButton color={iconColor} name='logo-twitter' onPress={() => Linking.openURL('https://twitter.com/pemsa_85')} />
            <IconButton color={iconColor} name='logo-instagram' onPress={() => Linking.openURL('https://instagram.com/pemsa_85/')} />
        </View>
    )
}
