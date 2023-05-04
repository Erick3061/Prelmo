import React, { useCallback, useEffect, useState } from 'react';
import { LayoutRectangle, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import Text from './Text';
import { useAppSelector } from '../app/hooks';
import { Orientation } from '../interfaces/interfaces';
import Color from 'color';
import Animated, { FadeIn, SlideInLeft, SlideOutRight } from 'react-native-reanimated';

interface Props<T> {
    data: Array<T>;
    selected: Array<T>;
    valueField: keyof T;
    labelField: keyof T;
    loading: boolean;
    height?: number;
    separator?: boolean;
    marginHorizontal?: number;
    onChange: (item: T) => void;
    onRefresh?: (() => void);
}

export const ReciclerData = <T extends Object>(props: Props<T>) => {
    const { data, labelField, valueField, height, separator,
        marginHorizontal, selected, onChange, loading = false, onRefresh } = props;
    const { theme: { colors, roundness }, orientation, screenWidth } = useAppSelector(state => state.app);
    const [layout, setLayout] = useState<LayoutRectangle>();
    const [dataProvider, setDataProvider] = useState<DataProvider>(new DataProvider((r1, r2) => r1 !== r2));

    const _onSelect = useCallback((item: T) => {
        onChange(item);
    }, [dataProvider, onChange]);

    const _layoutProvider = useCallback(() => {
        if (layout) {
            const { width } = layout;
            return new LayoutProvider(
                index => index,
                (_, dim) => {
                    dim.width = orientation === Orientation.landscape ? (width - (marginHorizontal ?? 0)) / 2 : width;
                    dim.height = height ?? 50;
                }
            );
        }
        return new LayoutProvider(
            index => index,
            (_, dim) => {
                dim.width = screenWidth;
                dim.height = height ?? 50;
            }
        );
    }, [dataProvider, screenWidth, orientation, layout, height, marginHorizontal]);

    const _renderRow = useCallback((type: string | number, data: any, index: number, extendedState?: object | undefined) => {
        const isSelected = selected.find(f => f[valueField] === data[valueField]);
        return (
            <Pressable
                onPress={() => _onSelect(data)}
                style={({ pressed }) => [
                    styles.item,
                    {
                        borderRadius: roundness * 2,
                        marginVertical: 2,
                        paddingHorizontal: 10,
                        borderBottomWidth: .3, borderColor: Color(colors.outline).fade(.5).toString()
                    },
                    isSelected && { backgroundColor: colors.primaryContainer },
                    pressed && { backgroundColor: Color(colors.primary).fade(.8).toString() }
                ]}
            >
                <Animated.View entering={SlideInLeft}>
                    <Text variant='labelMedium'>{data[labelField]}</Text>
                </Animated.View>
            </Pressable>
        )
    }, [dataProvider, colors, selected, _onSelect, roundness, labelField]);

    useEffect(() => {
        setDataProvider(dataProvider.cloneWithRows(data));
    }, [data])


    return (
        <View style={{ flex: 1 }} onLayout={({ nativeEvent: { layout } }) => setLayout(layout)}>
            {
                data.length === 0
                    ? <Text>Sin coincidencias</Text>
                    : <RecyclerListView
                        rowRenderer={_renderRow}
                        dataProvider={dataProvider}
                        canChangeSize={true}
                        layoutProvider={_layoutProvider()}
                        scrollViewProps={{
                            refreshControl: (
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={onRefresh}
                                />
                            )
                        }}
                    />
            }
        </View>
    )
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: 'center',
    },
});
