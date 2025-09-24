import { themeQuartz } from "ag-grid-community";

// to use myTheme in an application, pass it to the theme grid option
export const theme = themeQuartz.withParams({
  accentColor: "#9B5EF1",
  backgroundColor: "#2E026D",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  fontFamily: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Oxygen-Sans",
    "Ubuntu",
    "Cantarell",
    "Helvetica Neue",
    "sans-serif",
  ],
  foregroundColor: "#FFFFFF",
  headerFontSize: 14,
});
