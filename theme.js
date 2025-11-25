import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    brand: {
      // Primary brand colors - Matching logo colors
      orange: '#f57506', // Main brand orange (from logo)
      green: '#366d59', // Brand green (from logo)
      dark: '#111827', // Dark text
      light: '#fcf8ec', // Light background
      gray: '#9CA3AF', // Neutral gray
      softGray: '#EAEAEA', // Soft gray for borders

      // Additional brand colors - Matching logo palette
      orangeDark: '#d55623', // Deep orange (from logo)
      orangeLight: '#fb923c', // Lighter orange for gradients
      greenDark: '#166b41', // Dark green (from logo)
      greenLight: '#4a9d7a', // Lighter green for gradients
      red: '#ef4444', // Error/danger
      redLight: '#fee2e2', // Light red background
      yellow: '#fbbf24', // Warning
      blue: '#3b82f6', // Info
      purple: '#8b5cf6', // Accent purple

      // Status colors
      success: '#366d59', // Using brand green
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',

      // Subscription plan colors
      trial: '#00c6ff',
      weekly: '#00c6ff',
      halfMonth: '#ff9966',
      fullMonth: '#4776E6',
      premium: '#12c2e9',
    },

    // Delivery status colors
    delivery: {
      scheduled: '#3b82f6',
      preparing: '#f59e0b',
      outForDelivery: '#8b5cf6',
      delivered: '#366d59', // Using brand green
      skipped: '#6b7280',
      cancelled: '#ef4444',
    },
  },

  fontConfig: {
    Poppins: {
      400: { normal: 'Poppins-Regular' },
      500: { normal: 'Poppins-Medium' },
      600: { normal: 'Poppins-SemiBold' },
      700: { normal: 'Poppins-Bold' },
    },
    OpenSans: {
      400: { normal: 'OpenSans-Regular' },
      600: { normal: 'OpenSans-SemiBold' },
      700: { normal: 'OpenSans-Bold' },
    },
    Inter: {
      400: { normal: 'Inter-Regular' },
      500: { normal: 'Inter-Medium' },
      600: { normal: 'Inter-SemiBold' },
      700: { normal: 'Inter-Bold' },
    },
  },

  fonts: {
    heading: 'Poppins',
    body: 'OpenSans',
    mono: 'Inter',
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        shadow: 4,
        paddingVertical: 14,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
        _text: {
          fontFamily: 'Poppins',
          fontWeight: '600',
          fontSize: 'md',
          color: 'white',
          letterSpacing: 0.4,
        },
        _pressed: {
          opacity: 0.9,
          transform: [{ scale: 0.97 }],
        },
        _disabled: {
          opacity: 0.6,
          bg: 'brand.softGray',
          _text: {
            color: 'brand.gray',
          },
        },
      },
      variants: {
        solid: {
          bg: 'brand.orange',
          _pressed: {
            bg: 'brand.orangeDark',
          },
          _text: {
            color: 'white',
          },
        },
        success: {
          bg: 'brand.green',
          _pressed: {
            bg: 'brand.greenDark',
          },
          _text: {
            color: 'white',
          },
        },
        danger: {
          bg: 'brand.red',
          _pressed: {
            bg: 'brand.error',
          },
          _text: {
            color: 'white',
          },
        },
        outline: {
          borderWidth: 2,
          borderColor: 'brand.orange',
          bg: 'transparent',
          _text: {
            color: 'brand.orange',
          },
          _pressed: {
            bg: 'brand.orangeLight',
            _text: {
              color: 'white',
            },
          },
        },
        ghost: {
          bg: 'transparent',
          _text: {
            color: 'brand.orange',
          },
          _pressed: {
            bg: 'brand.orangeLight',
            opacity: 0.1,
          },
        },
      },
      sizes: {
        sm: {
          paddingVertical: 10,
          paddingHorizontal: 16,
          _text: {
            fontSize: 'sm',
          },
        },
        md: {
          paddingVertical: 14,
          paddingHorizontal: 24,
          _text: {
            fontSize: 'md',
          },
        },
        lg: {
          paddingVertical: 16,
          paddingHorizontal: 32,
          _text: {
            fontSize: 'lg',
          },
        },
      },
      defaultProps: {
        size: 'md',
        variant: 'solid',
        bg: 'brand.orange',
      },
    },

    Input: {
      baseStyle: {
        borderRadius: 'lg',
        fontFamily: 'OpenSans',
        fontSize: 'md',
        color: 'brand.dark',
        borderWidth: 1,
        borderColor: 'brand.softGray',
        backgroundColor: 'white',
        paddingHorizontal: 14,
        paddingVertical: 12,
        _focus: {
          borderColor: 'brand.orange',
          backgroundColor: 'white',
          borderWidth: 2,
        },
        _invalid: {
          borderColor: 'brand.red',
          borderWidth: 2,
        },
        _hover: {
          borderColor: 'brand.orangeLight',
        },
        _disabled: {
          opacity: 0.6,
          backgroundColor: 'coolGray.100',
        },
      },
      defaultProps: {
        variant: 'outline',
        borderColor: 'brand.softGray',
        placeholderTextColor: 'brand.gray',
        backgroundColor: 'white',
      },
    },

    TextArea: {
      baseStyle: {
        borderRadius: 'lg',
        fontFamily: 'OpenSans',
        fontSize: 'md',
        color: 'brand.dark',
        borderWidth: 1,
        borderColor: 'brand.softGray',
        backgroundColor: 'white',
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 100,
        _focus: {
          borderColor: 'brand.orange',
          backgroundColor: 'white',
          borderWidth: 2,
        },
        _invalid: {
          borderColor: 'brand.red',
          borderWidth: 2,
        },
        _hover: {
          borderColor: 'brand.orangeLight',
        },
      },
      defaultProps: {
        variant: 'outline',
        borderColor: 'brand.softGray',
        placeholderTextColor: 'brand.gray',
        backgroundColor: 'white',
      },
    },

    Select: {
      baseStyle: {
        borderRadius: 'lg',
        fontFamily: 'OpenSans',
        fontSize: 'md',
        color: 'brand.dark',
        borderWidth: 1,
        borderColor: 'brand.softGray',
        backgroundColor: 'white',
        paddingHorizontal: 14,
        paddingVertical: 12,
        _focus: {
          borderColor: 'brand.orange',
          borderWidth: 2,
        },
        _invalid: {
          borderColor: 'brand.red',
          borderWidth: 2,
        },
      },
      defaultProps: {
        variant: 'outline',
        borderColor: 'brand.softGray',
        backgroundColor: 'white',
      },
    },

    Checkbox: {
      baseStyle: {
        borderColor: 'brand.orange',
        _checked: {
          bg: 'brand.orange',
          borderColor: 'brand.orange',
          _icon: {
            color: 'white',
          },
        },
        _pressed: {
          opacity: 0.8,
        },
      },
    },

    Switch: {
      baseStyle: {
        onTrackColor: 'brand.orange',
        offTrackColor: 'coolGray.300',
        onThumbColor: 'white',
        offThumbColor: 'white',
        _pressed: {
          opacity: 0.8,
        },
      },
    },

    IconButton: {
      baseStyle: {
        borderRadius: 'full',
        _pressed: {
          opacity: 0.7,
          transform: [{ scale: 0.95 }],
        },
        _disabled: {
          opacity: 0.4,
        },
      },
      variants: {
        solid: {
          bg: 'brand.orange',
          _icon: {
            color: 'white',
          },
        },
        outline: {
          borderWidth: 1,
          borderColor: 'brand.orange',
          bg: 'transparent',
          _icon: {
            color: 'brand.orange',
          },
        },
        ghost: {
          bg: 'transparent',
          _icon: {
            color: 'brand.orange',
          },
        },
      },
      sizes: {
        sm: {
          p: 2,
          _icon: {
            size: 4,
          },
        },
        md: {
          p: 3,
          _icon: {
            size: 5,
          },
        },
        lg: {
          p: 4,
          _icon: {
            size: 6,
          },
        },
      },
      defaultProps: {
        variant: 'solid',
        size: 'md',
      },
    },

    Pressable: {
      baseStyle: {
        _pressed: {
          opacity: 0.7,
        },
      },
    },

    Spinner: {
      baseStyle: {
        color: 'brand.orange',
      },
      sizes: {
        sm: {
          size: 'sm',
        },
        md: {
          size: 'md',
        },
        lg: {
          size: 'lg',
        },
      },
      defaultProps: {
        size: 'md',
        color: 'brand.orange',
      },
    },

    Progress: {
      baseStyle: {
        borderRadius: 'full',
        bg: 'coolGray.200',
        _filledTrack: {
          bg: 'brand.orange',
          borderRadius: 'full',
        },
      },
      defaultProps: {
        colorScheme: 'orange',
      },
    },

    Divider: {
      baseStyle: {
        bg: 'brand.softGray',
        thickness: 1,
      },
      defaultProps: {
        orientation: 'horizontal',
      },
    },

    Link: {
      baseStyle: {
        _text: {
          color: 'brand.orange',
          fontFamily: 'OpenSans',
          fontWeight: '600',
          fontSize: 'sm',
          textDecorationLine: 'none',
        },
        _pressed: {
          _text: {
            color: 'brand.orangeDark',
            opacity: 0.8,
          },
        },
      },
    },

    Text: {
      baseStyle: {
        color: 'brand.dark',
        fontFamily: 'OpenSans',
      },
      variants: {
        caption: {
          fontSize: 'xs',
          color: 'coolGray.500',
          letterSpacing: 0.2,
        },
        label: {
          fontSize: 'sm',
          fontWeight: '600',
          color: 'brand.orange',
        },
        body: {
          fontSize: 'md',
          color: 'brand.dark',
        },
        subtitle: {
          fontSize: 'sm',
          color: 'coolGray.600',
        },
        error: {
          fontSize: 'sm',
          color: 'brand.red',
        },
        success: {
          fontSize: 'sm',
          color: 'brand.green',
        },
      },
      sizes: {
        xs: {
          fontSize: 'xs',
        },
        sm: {
          fontSize: 'sm',
        },
        md: {
          fontSize: 'md',
        },
        lg: {
          fontSize: 'lg',
        },
        xl: {
          fontSize: 'xl',
        },
      },
    },

    Heading: {
      baseStyle: {
        fontFamily: 'Poppins',
        fontWeight: '700',
        color: 'brand.dark',
        letterSpacing: 0.3,
      },
    },

    Card: {
      baseStyle: {
        borderRadius: 'xl',
        shadow: 3,
        bg: 'white',
        p: 4,
        borderWidth: 1,
        borderColor: 'brand.softGray',
      },
      variants: {
        elevated: {
          shadow: 6,
          elevation: 8,
        },
        outlined: {
          shadow: 0,
          borderWidth: 2,
          borderColor: 'brand.orange',
        },
        flat: {
          shadow: 0,
          borderWidth: 0,
        },
      },
    },

    Box: {
      baseStyle: {
        // Base box styles
      },
      variants: {
        card: {
          borderRadius: 'xl',
          bg: 'white',
          p: 4,
          shadow: 3,
          borderWidth: 1,
          borderColor: 'brand.softGray',
        },
        container: {
          bg: 'white',
          borderRadius: 'lg',
          p: 4,
        },
      },
    },

    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
      },
      variants: {
        solid: {
          bg: 'brand.orange',
          _text: {
            color: 'white',
            fontWeight: '600',
          },
        },
        success: {
          bg: 'brand.green',
          _text: {
            color: 'white',
            fontWeight: '600',
          },
        },
        warning: {
          bg: 'brand.warning',
          _text: {
            color: 'white',
            fontWeight: '600',
          },
        },
        error: {
          bg: 'brand.red',
          _text: {
            color: 'white',
            fontWeight: '600',
          },
        },
      },
    },

    Alert: {
      baseStyle: {
        borderRadius: 'lg',
        borderWidth: 1,
        p: 4,
      },
      variants: {
        success: {
          bg: 'green.50',
          borderColor: 'brand.green',
          _text: {
            color: 'brand.greenDark',
          },
        },
        error: {
          bg: 'red.50',
          borderColor: 'brand.red',
          _text: {
            color: 'brand.error',
          },
        },
        warning: {
          bg: 'yellow.50',
          borderColor: 'brand.warning',
          _text: {
            color: 'brand.warning',
          },
        },
        info: {
          bg: 'blue.50',
          borderColor: 'brand.info',
          _text: {
            color: 'brand.info',
          },
        },
      },
    },

    Modal: {
      baseStyle: {
        _backdrop: {
          bg: 'black',
          opacity: 0.5,
        },
      },
      defaultProps: {
        size: 'lg',
        closeOnOverlayClick: true,
      },
    },

    ModalContent: {
      baseStyle: {
        borderRadius: 'xl',
        bg: 'white',
        p: 6,
      },
    },

    ModalHeader: {
      baseStyle: {
        borderBottomWidth: 1,
        borderColor: 'brand.softGray',
        pb: 4,
        mb: 4,
      },
    },

    ModalFooter: {
      baseStyle: {
        borderTopWidth: 1,
        borderColor: 'brand.softGray',
        pt: 4,
        mt: 4,
      },
    },

    FormControl: {
      baseStyle: {
        width: '100%',
      },
    },

    FormControlLabel: {
      baseStyle: {
        _text: {
          fontSize: 'sm',
          fontWeight: '600',
          color: 'brand.dark',
          mb: 1,
        },
      },
    },

    FormControlHelperText: {
      baseStyle: {
        _text: {
          fontSize: 'xs',
          color: 'coolGray.500',
          mt: 1,
        },
      },
    },

    FormControlErrorMessage: {
      baseStyle: {
        _text: {
          fontSize: 'xs',
          color: 'brand.red',
          mt: 1,
        },
      },
    },

    Avatar: {
      baseStyle: {
        bg: 'brand.orange',
      },
      sizes: {
        xs: {
          size: 'xs',
        },
        sm: {
          size: 'sm',
        },
        md: {
          size: 'md',
        },
        lg: {
          size: 'lg',
        },
        xl: {
          size: 'xl',
        },
      },
    },

    Skeleton: {
      baseStyle: {
        bg: 'coolGray.200',
        borderRadius: 'md',
      },
      defaultProps: {
        startColor: 'coolGray.200',
        endColor: 'coolGray.100',
      },
    },

    SkeletonText: {
      baseStyle: {
        bg: 'coolGray.200',
        borderRadius: 'sm',
      },
    },
  },

  // Spacing scale
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  // Border radius scale
  radii: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },

  // Shadows
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
    brand: {
      shadowColor: '#f57506', // Using brand orange
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  // Typography scale
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Font weights
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    '2xl': 36,
    '3xl': 40,
  },
});

export default theme;
