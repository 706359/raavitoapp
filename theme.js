// theme.js
import { extendTheme } from "native-base";

const theme = extendTheme({
  colors: {
    brand: {
      orange: "#FF7A00",
      // green: "#0F8C2E",
      green: "rgba(7, 192, 53, 1)",
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
        rounded: "full", // ✅ pill-like rounded style
        shadow: 3, // ✅ subtle shadow like in the screenshot
        _text: {
          fontFamily: "Poppins",
          fontWeight: "600",
          fontSize: "md",
        },
      },
      defaultProps: {
        bg: {
          linearGradient: {
            colors: ["brand.green", "brand.orange"], // ✅ Raavito gradient
            start: [0, 0],
            end: [1, 0],
          },
        },
        _pressed: {
          opacity: 0.85, // ✅ pressed effect
        },
      },
    },
  },
});

export default theme;
