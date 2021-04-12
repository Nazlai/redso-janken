import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { LANDING } from "constants/routes";
import useStyles from "./style";

const capitalize = (string) => {
  const firstLetter = string.slice(0, 1);
  const rest = string.slice(1);
  return firstLetter.toUpperCase().concat(rest.toLowerCase());
};

const Navigation = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const title = pathname.replace("/", "").split("-").map(capitalize).join(" ");

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar>
        <Link to={LANDING} className={classes.homeIcon}>
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <Typography>{title}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export const withNavigation = (Component) => {
  return function WrappedComponent(props) {
    return (
      <React.Fragment>
        <Navigation />
        <Component {...props} />
      </React.Fragment>
    );
  };
};

export default Navigation;
