import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { rootStackScreen } from '../navigation/Stack';
import { useAppSelector } from '../app/hooks';
import { Orientation, Key, Events } from '../interfaces/interfaces';
import { Row, TableRow } from '../components/table/Row';
import { ListRenderItemInfo } from 'react-native';
import Text from '../components/Text';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Props extends NativeStackScreenProps<rootStackScreen, 'TableScreen'> { };
export const TableScreen = ({ navigation, route: { params: { events, keys, name, address, report } } }: Props) => {
    const { orientation, theme: { colors, fonts } } = useAppSelector(state => state.app);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: report,
            headerTitleStyle: { ...fonts.titleLarge }
        });
    }, [navigation])

    const renderItem = useCallback(({ index, item, separators }: ListRenderItemInfo<Events>) => {
        return (
            <Animated.View entering={FadeIn}>
                <TableRow
                    data={item}
                    titles={keys as Key<Events>[]}
                    style={{ borderBottomColor: colors.backdrop, borderBottomWidth: 1 }}
                />
            </Animated.View>
        )
    }, [])

    return (
        <View style={[
            {
                flex: 1,
                backgroundColor: colors.background,
                alignSelf: 'center',
                margin: 10,
            },
            orientation === Orientation.landscape && { width: '95%', alignSelf: 'center' }
        ]}>
            <Text variant='titleMedium'>{name}</Text>
            <Text variant='titleSmall'>{address}</Text>
            <ScrollView horizontal={true}>
                <View>
                    <Row styleLabel={[fonts.titleMedium]} data={keys.map(({ label }) => label)} tamCol={keys.map(({ size, center }) => { return { size: size ?? 0, center } })} />
                    <FlatList
                        data={events}
                        renderItem={renderItem}
                        keyExtractor={(_, idx) => `${idx}`}
                        ListEmptyComponent={<Text style={[fonts.titleMedium, { textAlign: 'center' }]}>Sin eventos</Text>}
                    />
                </View>
            </ScrollView>
        </View>
    )
}
