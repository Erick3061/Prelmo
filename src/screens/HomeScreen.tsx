import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { SocialNetworks } from '../components/SocialNetworks';
import Text from '../components/Text';
import { Orientation } from '../interfaces/interfaces';
import { AlertContext } from '../components/Alert/AlertContext';
import { Button } from '../components/Button';
import { HandleContext } from '../context/HandleContext';
import { Loading } from '../components/Loading';
import { MIMETypes } from '../types/types';
import Slide from '../components/ChangeThemeSlide';

export const HomeScreen = () => {
    const { theme: { fonts, colors, dark }, orientation } = useAppSelector(state => state.app);
    const { notification } = useContext(AlertContext);
    const { downloadReport, isDownloadDoc } = useContext(HandleContext);
    return (
        <View style={[
            { flex: 1, justifyContent: 'space-around' },
            orientation === Orientation.landscape && {
                flexDirection: 'row'
            }
        ]}>
            <Loading refresh={isDownloadDoc} />
            <View style={[
                { flex: 1, justifyContent: 'flex-end' },
                orientation === Orientation.landscape && {
                    justifyContent: 'center'
                }
            ]}>
                <Image
                    style={[
                        { resizeMode: 'contain', width: '70%', height: 100, alignSelf: 'center' },
                        dark && { tintColor: colors.onSurface }
                    ]}
                    source={require('../assets/prelmo.png')}
                />
            </View>
            <View style={[
                { flex: 1, justifyContent: 'center', alignItems: 'center' }
            ]}>
                <Text variant='titleLarge' style={[styles.text, { fontWeight: 'bold' }]}>central monitoreo 24hrs</Text>
                <Text variant='titleMedium' style={[styles.text, { fontWeight: 'bold' }]}>222 141 12 30</Text>
                <SocialNetworks />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        textTransform: 'uppercase',
        paddingVertical: 15,
    }
});