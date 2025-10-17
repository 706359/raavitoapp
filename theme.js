import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    brand: {
      orange: "#FF7A00",
      green: "#00A86B",
      dark: "#1A1A1A",
      light: "#F9F9F9",
      gray: "#A1A1A1",
      softGray: "#EAEAEA",
    },
  },

  fontConfig: {
    Poppins: {
      400: { normal: "Poppins-Regular" },
      500: { normal: "Poppins-Medium" },
      600: { normal: "Poppins-SemiBold" },
      700: { normal: "Poppins-Bold" },
    },
    OpenSans: {
      400: { normal: "OpenSans-Regular" },
      600: { normal: "OpenSans-SemiBold" },
      700: { normal: "OpenSans-Bold" },
    },
    Inter: {
      400: { normal: "Inter-Regular" },
      500: { normal: "Inter-Medium" },
      600: { normal: "Inter-SemiBold" },
      700: { normal: "Inter-Bold" },
    },
  },

  fonts: {
    heading: "Poppins",
    body: "OpenSans",
    mono: "Inter",
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        shadow: 4,
        _text: {
          fontFamily: "Poppins",
          fontWeight: "600",
          fontSize: "md",
          color: "white",
          letterSpacing: 0.4,
        },
        _pressed: {
          opacity: 0.9,
          bg: "brand.green",
          transform: [{ scale: 0.97 }],
        },
      },
      defaultProps: {
        size: "md",
        alignSelf: "center",
        width: "60%",
        bg: "brand.orange",
      },
    },

    Input: {
      baseStyle: {
        borderRadius: "full",
        fontFamily: "OpenSans",
        fontSize: "md",
        color: "brand.dark",
        _focus: {
          borderColor: "brand.orange",
          backgroundColor: "white",
        },
      },
      defaultProps: {
        variant: "outline",
        borderColor: "brand.gray",
        placeholderTextColor: "coolGray.500",
        backgroundColor: "white",
      },
    },

    Checkbox: {
      baseStyle: {
        borderColor: "brand.orange",
        _checked: {
          bg: "brand.orange",
          borderColor: "brand.orange",
        },
        _pressed: {
          bg: "brand.green",
          borderColor: "brand.green",
        },
      },
    },

    Link: {
      baseStyle: {
        _text: {
          color: "brand.orange",
          fontFamily: "OpenSans",
          fontWeight: "600",
          fontSize: "sm",
        },
        _pressed: {
          _text: { color: "brand.green" },
        },
      },
    },

    Text: {
      baseStyle: {
        color: "brand.dark",
        fontFamily: "OpenSans",
      },
      variants: {
        caption: {
          fontSize: "xs",
          color: "coolGray.500",
          letterSpacing: 0.2,
        },
        label: {
          fontSize: "sm",
          fontWeight: "600",
          color: "brand.orange",
        },
      },
    },

    Heading: {
      baseStyle: {
        fontFamily: "Poppins",
        fontWeight: "700",
        color: "brand.dark",
        letterSpacing: 0.3,
      },
    },

    Card: {
      baseStyle: {
        borderRadius: "xl",
        shadow: 3,
        bg: "white",
        p: 4,
      },
    },
  },
});

export default theme;
