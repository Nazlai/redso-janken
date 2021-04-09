import React from "react";
import { render } from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "theme/muiTheme";
import App from "./app";
import "normalize.css";
import "styles/app";

const root = document.getElementById("root");

render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  root
);
