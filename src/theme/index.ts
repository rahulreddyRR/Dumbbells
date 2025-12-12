import { Colors } from '../constants/colors';

export const Theme = {
  colors: Colors,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.text,
    },
    body: {
      fontSize: 16,
      color: Colors.text,
    },
  } as const,
};
