import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, AppBar, Toolbar, Typography } from "@material-ui/core";
import { LANDING } from "constants/routes";
import useStyles from "./style";

const Logo = ({ classStyle }) => (
  <Typography className={classStyle}>Janken</Typography>
);

Logo.propTypes = {
  classStyle: PropTypes.string,
};

const Navigation = ({ children, ...rest }) => {
  const classes = useStyles();

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          {...rest}
        >
          <Link to={LANDING} className={classes.homeIcon}>
            <Logo classStyle={classes.logo} />
          </Link>
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navigation.propTypes = {
  children: PropTypes.node,
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
