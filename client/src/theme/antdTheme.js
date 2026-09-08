import { theme } from "antd";

export const nightlifeAntdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#C9A36A",
    colorInfo: "#C9A36A",
    colorLink: "#C9A36A",
    colorError: "#c45c5c",
    colorBgBase: "#07080A",
    colorBgContainer: "#12151C",
    colorBgElevated: "#12151C",
    colorBgLayout: "#07080A",
    colorText: "#F4F1EA",
    colorTextSecondary: "#9AA0AB",
    colorTextTertiary: "#9AA0AB",
    colorBorder: "rgba(255, 255, 255, 0.08)",
    colorBorderSecondary: "rgba(255, 255, 255, 0.08)",
    colorPrimaryText: "#07080A",
    borderRadius: 2,
    fontFamily: "'DM Sans', sans-serif",
    controlHeight: 40,
  },
  components: {
    Button: {
      primaryColor: "#07080A",
      borderRadius: 2,
      fontWeight: 500,
      controlHeight: 40,
    },
    Modal: {
      contentBg: "#12151C",
      headerBg: "#12151C",
      footerBg: "#12151C",
      titleColor: "#F4F1EA",
      titleFontName: "'Cormorant Garamond', serif",
    },
    Input: {
      colorBgContainer: "#0C0E12",
      activeBorderColor: "#C9A36A",
      hoverBorderColor: "rgba(201, 163, 106, 0.45)",
    },
    DatePicker: {
      colorBgContainer: "#0C0E12",
    },
    Card: {
      colorBgContainer: "#12151C",
    },
    Collapse: {
      colorBgContainer: "#12151C",
      headerBg: "#12151C",
    },
    Select: {
      colorBgContainer: "#0C0E12",
    },
  },
};
