import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

const FullButton = ({ children, handleClick, ...rest }) => (
  <Button
    variant="contained"
    color="secondary"
    fullWidth
    onClick={handleClick}
    {...rest}
  >
    {children}
  </Button>
);

FullButton.propTypes = {
  children: PropTypes.string,
  handleClick: PropTypes.func,
};

export default FullButton;
