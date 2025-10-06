import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    brand: {
      orange: "#b95a01ff",
      green: "#04b230ff",
      dark: "#1A1A1A",
      light: "#F5F5F5",
      gray: "#a1a1a1ff",
    },
  },
  fontConfig: {
    Roboto: {
      400: { normal: "Roboto-Regular" },
      600: { normal: "Roboto-SemiBold" },
      700: { normal: "Roboto-Bold" },
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
        shadow: 6, // deeper shadow for 3D effect
        _text: {
          fontFamily: "Poppins",
          fontWeight: "600",
          fontSize: "md",
          color: "white",
        },
        _pressed: {
          transform: [{ scale: 0.97 }], // press-in effect
          shadow: 2, // reduced shadow when pressed
        },
      },
      defaultProps: {
        size: "md",
        alignSelf: "center", // keep it centered
        w: "60%", // smaller width (60% of container)
        bg: "brand.orange",
        _pressed: {
          bg: "brand.green",
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
      variants: {
        caption: {
          fontSize: "xs",
          color: "coolGray.500",
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
