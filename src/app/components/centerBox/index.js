import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

const CenterBox = ({ children, ...rest }) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    {...rest}
  >
    {children}
  </Box>
);

CenterBox.propTypes = {
  children: PropTypes.node,
};

export default CenterBox;
