import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, Image, ListRenderItemInfo, Pressable, RefreshControl, SafeAreaView, StyleSheet, View } from 'react-native';
import Text from '../components/Text';
import { useAppSelector } from '../app/hooks';
import { RootDrawerNavigator } from '../navigation/Drawer';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { HandleContext } from '../context/HandleContext';
import { Loading } from '../components/Loading';
import { Icon, IconMenu } from '../components/IconButton';
import Color from 'color';
import RNFS from 'react-native-fs';
import Portal from '../components/Portal/Portal';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { stylesApp } from '../App';
import { MIMETypes } from '../types/types';
import Share from 'react-native-share';
import { AlertContext } from '../components/Alert/AlertContext';

interface Props extends DrawerScreenProps<RootDrawerNavigator, 'DownloadScreen'> { }

export const DownloadScreen = ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selected, setSelected] = useState<RNFS.ReadDirItem>();
    const [files, setFiles] = useState<Array<RNFS.ReadDirItem>>();
    const { theme: { colors, roundness }, isAccessStorage } = useAppSelector(state => state.app);
    const { handleError, directory } = useContext(HandleContext);
    const { notification } = useContext(AlertContext);
    const focus = navigation.isFocused();

    const Read = async () => {
        try {
            setIsLoading(true);
            const readed = await RNFS.readDir(directory);
            setFiles(readed.reverse());
        } catch (error) {
            handleError(String(error))
        }
        finally {
            setIsLoading(false);
        }
    }

    const share = useCallback(async () => {
        if (selected) {
            try {
                const mime: MIMETypes = (selected.name.includes('.pdf')) ? MIMETypes.pdf : (selected.name.includes('.xlsx')) ? MIMETypes.xlsx : MIMETypes.desc;
                if (mime === MIMETypes.desc) { throw 'Error, formato de archivo no se puedo compartir' };

                let base64Data = await RNFS.readFile(selected.path, 'base64');
                base64Data = `data:${mime};base64,` + base64Data;
                await Share.open({
                    url: base64Data
                })
            } catch (error) { notification({ type: 'info', title: 'Información', text: `${error}` }) }
        }
    }, [selected]);


    const Item = ({ index, item, separators }: ListRenderItemInfo<RNFS.ReadDirItem>) => {
        const path = (item.name.split('.')[1] === 'pdf') ? require('../assets/pdf.png') : require('../assets/xls.png');
        const size: number = 35;
        return (
            <Pressable
                style={{ marginVertical: 5, flexDirection: 'row', width: '100%', height: 50, alignItems: 'center' }}
                android_ripple={{ color: Color(colors.primary).fade(.9).toString() }}
                onPress={() => item.isFile() && setSelected(item)}
            >
                {
                    item.isFile() && <Image
                        source={path}
                        style={[
                            {
                                width: size,
                                height: size,
                                resizeMode: 'contain',
                            }
                        ]}
                    />
                }
                <Text variant='labelMedium' style={{ flex: 1, paddingHorizontal: 5 }}>{item.name}</Text>
            </Pressable>
        );
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Descargas',
            headerRight(props) {
                return (
                    <View style={{ marginHorizontal: 10 }}>
                        <IconMenu
                            menu={[
                                // {
                                //     text: 'Seleccionar varios',
                                //     icon: 'checkbox',
                                //     onPress() {

                                //     },
                                //     contentStyle: { ...styles.btnMenu }
                                // },
                                {
                                    text: 'Actualizar',
                                    icon: 'refresh',
                                    onPress() {
                                        isAccessStorage && Read();
                                    },
                                    contentStyle: { ...styles.btnMenu }
                                },
                            ]}
                        />
                    </View>
                )
            },
        })
    }, [navigation]);

    useEffect(() => {
        isAccessStorage && Read();
    }, [focus]);

    // uses

    return (
        <View style={{ flex: 1, padding: 5 }}>
            <Loading refresh={isLoading} />
            <Text variant='labelMedium'>{directory}</Text>
            <FlatList
                data={files}
                ItemSeparatorComponent={() => <View style={[{ backgroundColor: colors.border, height: StyleSheet.hairlineWidth, }]} />}
                renderItem={Item}
                keyExtractor={(_item, index) => `file-${index}`}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={Read} />}
            />
            <Portal>
                {
                    selected &&
                    <SafeAreaView style={{ flex: 1, backgroundColor: Color(colors.primary).fade(.9).toString(), justifyContent: 'center', alignItems: 'center' }} >
                        <Pressable style={{ width: '100%', height: '100%' }} onPress={() => setSelected(undefined)} />
                        <Animated.View entering={FadeInDown} exiting={FadeOutDown} style={[stylesApp.shadow, { shadowColor: colors.primary }, { backgroundColor: colors.background, position: 'absolute', padding: 15, borderRadius: roundness * 2, width: '80%' }]}>
                            <Text variant='titleSmall' style={{ marginBottom: 10 }}>{selected.name}</Text>
                            <Pressable onPress={async () => {
                                try {
                                    await RNFS.unlink(selected.path);
                                    notification({ type: 'success', title: 'Archivo eliminado', subtitle: selected.name });
                                    setSelected(undefined);
                                    Read();

                                } catch (error) { handleError(String(error)) }
                            }} android_ripple={{ color: Color(colors.primary).fade(.9).toString() }} style={{ marginBottom: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                                    <Text style={{ marginHorizontal: 10 }} variant='titleMedium'>Eliminar</Text>
                                    <Icon name='trash' />
                                </View>
                            </Pressable>
                            <Pressable onPress={share} android_ripple={{ color: Color(colors.primary).fade(.9).toString() }} style={{ marginBottom: 5 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }}>
                                    <Text style={{ marginHorizontal: 10 }} variant='titleMedium'>Compartir</Text>
                                    <Icon name='share-social' />
                                </View>
                            </Pressable>

                        </Animated.View>
                    </SafeAreaView>
                }
            </Portal>
        </View >
    )
};

const styles = StyleSheet.create({
    btnMenu: {
        alignItems: 'flex-start',
        marginVertical: 5
    }
});