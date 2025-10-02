import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    brand: {
      orange: "#e57002ff",
      green: "#018923ff",
      dark: "#1A1A1A",
      light: "#F5F5F5",
      gray: "#E5E7EB",
    },
  },
  fontConfig: {
    Poppins: {
      400: { normal: "Poppins-Regular" },
      600: { normal: "Poppins-SemiBold" },
      700: { normal: "Poppins-Bold" },
    },
    OpenSans: {
      400: { normal: "OpenSans-Regular" },
      600: { normal: "OpenSans-SemiBold" },
    },
  },
  fonts: {
    heading: "Poppins",
    body: "OpenSans",
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "full",
        shadow: 3,
        _text: {
          fontFamily: "Poppins",
          fontWeight: "600",
          fontSize: "md",
          color: "white",
        },
      },
      defaultProps: {
        bg: {
          linearGradient: {
            colors: ["brand.green", "brand.orange"],
            start: [0, 0],
            end: [1, 0],
          },
        },
        _pressed: {
          opacity: 0.9,
        },
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
      },
    },
    Link: {
      baseStyle: {
        _text: {
          color: "brand.orange",
          fontFamily: "OpenSans",
          fontSize: "sm",
        },
      },
    },
    Text: {
      baseStyle: {
        color: "brand.dark",
        fontFamily: "OpenSans",
      },
    },
    Card: {
      baseStyle: {
        borderRadius: "lg",
        shadow: 2,
        bg: "white",
        p: 4,
      },
    },
  },
});

export default theme;
