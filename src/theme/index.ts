import { Colors } from '../constants/colors';

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    round: 999, // For pill shapes
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.text,
    },
    subheader: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.text,
    },
    body: {
        fontSize: 16,
        color: Colors.text,
    },
    caption: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
  } as const,
};
