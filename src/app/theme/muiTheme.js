import { createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#26a69a",
    },
    textPrimary: "#f8f8ff",
    secondary: orange,
  },
});

export default theme;
