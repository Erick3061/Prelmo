import React from 'react';
import { Pressable, View } from 'react-native';
import { useAppSelector } from '../app/hooks';
import { PropsCheckBox } from '../interfaces/interfaces';
import { IconButton } from './IconButton';
import Color from 'color';
import Text from './Text';

export const CheckBox = ({ color, disabled, uncheckedColor, text, onPress, isChecked }: PropsCheckBox) => {
    const { theme: { colors } } = useAppSelector(state => state.app);

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: Color(colors.primary).fade(.9).toString() }}
            style={{ marginVertical: 5 }}
        >
            {
                ({ pressed }) => (
                    <View style={[
                        { height: 50, flexDirection: 'row', alignItems: 'center' },
                        pressed && { backgroundColor: Color(colors.primary).fade(.9).toString() },
                    ]}>
                        <IconButton
                            style={{ marginHorizontal: 5 }}
                            name={(isChecked === 'checked') ? 'checkbox' : 'stop-outline'}
                            onPress={onPress}
                        />
                        <Text>{text}</Text>
                    </View>
                )
            }
        </Pressable>
    )
}