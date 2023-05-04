import React from 'react';
import { StyleProp, View, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { Key } from '../../interfaces/interfaces';
import Text from '../Text';

type PropsRow = {
    data: Array<string | Array<string>>;
    tamCol?: Array<{ size: number, center?: boolean }>;
    style?: StyleProp<ViewStyle>;
    styleLabel?: StyleProp<TextStyle>;
}

export const Row = ({ data, style, styleLabel, tamCol }: PropsRow) => {
    return (
        <View style={[styles.containerRow, style]}>
            {data.map((col, idx) => {
                const width: number | undefined = (tamCol && tamCol[idx]) ? tamCol[idx].size : undefined;
                const center: boolean | undefined = (tamCol && tamCol[idx]) ? tamCol[idx].center : undefined;
                if (Array.isArray(col)) return (
                    <View key={col.toString() + idx} style={[styles.textHeader, { flexDirection: 'row' }]}>
                        {col.map((c, cidx) => <Text variant='labelSmall' key={c + cidx} style={[{ marginHorizontal: 1, width: width ? (width / col.length) - 2 : undefined, textAlign: center ? 'center' : 'left' }, styleLabel]}>{c}</Text>)}
                    </View>
                )
                return (<Text variant='labelSmall' style={[styles.textHeader, { width, textAlign: center ? 'center' : 'left' }, styleLabel]} key={col.toString() + idx}>{col.toString()}</Text>)
            })}
        </View>
    )
}

type Props<T> = {
    data: T;
    titles: Array<Key<T>>;
    style?: StyleProp<ViewStyle>;
    styleLabel?: StyleProp<TextStyle>;
    indice?: number;
}

export const TableRow = <T extends Object>({ data, titles, style, styleLabel, indice }: Props<T>) => {
    return (
        <View style={[style, { flexDirection: 'row', alignItems: 'center' }]}>
            {indice && <Text style={[{ margin: 2, textAlign: 'center', width: 30 }, styleLabel]} variant='labelSmall'>{`${indice}`}</Text>}
            {titles.map((col, idx) => <Text style={[{ margin: 2, textAlign: col.center ? 'center' : 'left', width: col.size }, styleLabel]} variant='labelSmall' key={'Col' + idx}>{`${Array.isArray(col.key) ? col.key.map((tc, idx) => data[tc]).join('') : data[col.key]}`}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    containerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textHeader: {
        margin: 2,
    },
});