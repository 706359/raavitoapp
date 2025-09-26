// theme.js
import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    brand: {
      orange: "#FF7A00",
      green: "#0F8C2E",
      dark: "#1A1A1A",
      light: "#F5F5F5",
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
        rounded: "lg",
      },
      defaultProps: {
        colorScheme: "orange",
      },
    },
    Input: {
      baseStyle: {
        rounded: "lg",
        bg: "gray.100",
      },
    },
  },
});

export default theme;
