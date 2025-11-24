// Stub component for compatibility
import { Text, TextProps } from 'react-native';

export function ThemedText({ style, type, ...props }: TextProps & { type?: string }) {
  return <Text style={style} {...props} />;
}

