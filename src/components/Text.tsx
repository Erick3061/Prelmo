import * as React from 'react';
import { Text as NativeText, TextStyle, StyleProp, StyleSheet } from 'react-native';
import { TypescaleKey } from '../types/types';
import { useAppSelector } from '../app/hooks';
import { typeface } from '../config/typescale';

export type Props = React.ComponentProps<typeof NativeText> & {
  variant?: keyof typeof TypescaleKey;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

const Text: React.ForwardRefRenderFunction<{}, Props> = ({ style, variant, ...rest }: Props, ref) => {
  const root = React.useRef<NativeText | null>(null);
  const { theme: { fonts, colors } } = useAppSelector(state => state.app);

  React.useImperativeHandle(ref, () => ({
    setNativeProps: (args: Object) => root.current?.setNativeProps(args),
  }));

  if (variant) {
    return (
      <NativeText
        ref={root}
        style={[fonts[variant], { color: colors.onSurface }, styles.text, style]}
        {...rest}
      />
    );
  } else {
    const { brandRegular, weightRegular } = typeface;
    const font = { fontFamily: brandRegular, fontWeight: weightRegular }
    const textStyle = { ...font, color: colors.onSurface };
    return (
      <NativeText
        {...rest}
        ref={root}
        style={[styles.text, textStyle, style]}
      />
    );
  }
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});

export default React.forwardRef(Text);
