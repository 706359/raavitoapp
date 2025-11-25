import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    brand: {
      // Primary brand colors
      orange: '#f97316', // Main brand orange
      green: '#10b981', // Success/positive actions
      dark: '#111827', // Dark text
      light: '#fcf8ec', // Light background
      gray: '#9CA3AF', // Neutral gray
      softGray: '#EAEAEA', // Soft gray for borders

      // Additional brand colors
      orangeDark: '#ea580c', // Darker orange for gradients
      orangeLight: '#fb923c', // Lighter orange
      greenDark: '#059669', // Darker green
      greenLight: '#34d399', // Lighter green
      red: '#ef4444', // Error/danger
      redLight: '#fee2e2', // Light red background
      yellow: '#fbbf24', // Warning
      blue: '#3b82f6', // Info
      purple: '#8b5cf6', // Accent purple

      // Status colors
      success: '#10b981',
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
      delivered: '#10b981',
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
          opacity: 0.5,
          bg: 'coolGray.300',
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
            bg: 'brand.orange',
            _text: {
              color: 'white',
            },
          },
        },
      },
      defaultProps: {
        size: 'md',
        alignSelf: 'center',
        width: '60%',
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
          borderColor: 'brand.orange',
        },
      },
      defaultProps: {
        variant: 'outline',
        borderColor: 'brand.softGray',
        placeholderTextColor: 'brand.gray',
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
  },

  // Spacing scale
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
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
  },
});

export default theme;
