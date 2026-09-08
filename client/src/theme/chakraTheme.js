import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Cormorant Garamond', serif`,
    body: `'DM Sans', sans-serif`,
  },
  colors: {
    nightlife: {
      bg: "#07080A",
      bgAlt: "#0C0E12",
      surface: "#12151C",
      text: "#F4F1EA",
      muted: "#9AA0AB",
      accent: "#C9A36A",
    },
  },
  styles: {
    global: {
      body: {
        bg: "transparent",
        color: "var(--nl-text)",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "2px",
        fontWeight: "500",
        letterSpacing: "0.04em",
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "var(--nl-surface)",
            borderColor: "var(--nl-border)",
            color: "var(--nl-text)",
            borderRadius: "2px",
            _placeholder: { color: "var(--nl-muted)" },
            _hover: { borderColor: "rgba(201, 163, 106, 0.45)" },
            _focus: {
              borderColor: "var(--nl-accent)",
              boxShadow: "0 0 0 1px var(--nl-accent)",
            },
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        color: "var(--nl-muted)",
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "var(--nl-surface)",
          color: "var(--nl-text)",
          border: "1px solid var(--nl-border)",
          borderRadius: "4px",
        },
        overlay: {
          bg: "rgba(7, 8, 10, 0.78)",
        },
      },
    },
  },
});

export default theme;
