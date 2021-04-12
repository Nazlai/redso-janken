import { createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#26a69a",
      contrastText: "#f8f8ff",
    },
    secondary: {
      main: orange[500],
      contrastText: "#f8f8ff",
    },
    background: {
      default: "#26a69a",
    },
  },
});

export default theme;
