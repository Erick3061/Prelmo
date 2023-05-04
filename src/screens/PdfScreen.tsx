import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { rootStackScreen } from '../navigation/Stack';
import Pdf from 'react-native-pdf';
import Toast from 'react-native-toast-message';

interface Props extends NativeStackScreenProps<rootStackScreen, 'PdfScreen'> { };
export const PdfScreen = ({ navigation, route: { params: { name, url } } }: Props) => {
    const { theme: { fonts } } = useAppSelector(state => state.app);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${name} Pemsa Monitoreo App`,
            headerTitleStyle: { ...fonts.titleLarge }
        });
    }, [navigation]);

    const source = { uri: url, cache: true };

    return (
        <View style={{ flex: 1 }}>
            <Pdf
                source={source}
                onLoadComplete={(numberOfPages, filePath) => { }}
                onError={(error) => Toast.show({ text1: 'Error', text2: String(error) })}
                style={{ flex: 1 }}
                trustAllCerts={false}
            />
        </View>
    )
}
