import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native'
import { stylesApp } from '../App';
import { useAppSelector } from '../app/hooks';
import Donut from './Donut';
import Text from './Text';
import { Icon } from './IconButton';

interface Props {
    percentage?: number;
    max: number;
    icon?: {
        name: string;
        backgroundColor?: string;
        colorIcon?: string;
    }
    text: string;
    textLarge?: string;
    style?: StyleProp<ViewStyle>;
    amount?: number | string;
}
export const TargetPercentaje = ({ max, percentage, icon, text, textLarge, style, amount }: Props) => {
    const { theme: { colors, roundness, } } = useAppSelector(state => state.app);
    return (
        <View style={[stylesApp.shadow, {
            padding: 10,
            backgroundColor: colors.background, alignItems: 'center', margin: 5,
            shadowColor: icon ? icon.backgroundColor : colors.primary,
            borderRadius: roundness * 2, width: 140,
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon iconsize={20} name={icon ? icon.name : 'home'} color={icon ? icon.backgroundColor : undefined} />
                <Text variant='labelSmall' style={{ flex: 1, textAlign: 'center' }}>{text}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Donut radius={25} color={colors.primary} max={max} percentage={percentage ?? 0} strokeWidth={4} />
                <View style={{ marginHorizontal: 5, alignItems: 'center' }}>
                    <Text variant='labelSmall' style={[{ color: colors.text, fontWeight: 'bold' }]}>{text}</Text>
                    {amount && <Text variant='labelSmall' style={[{ color: colors.text, marginVertical: 2, fontWeight: '700' }]}>{amount}</Text>}
                </View>
            </View>
            <Text variant='labelSmall' style={{ textAlign: 'center' }}>{textLarge}</Text>
        </View>
    )
}
