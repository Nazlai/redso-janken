import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import PropTypes from "prop-types";

export const SimpleDialog = ({ title, children, open, onClose }) => {
  return (
    <Dialog aria-labelledby="simple-dialog-title" open={open} onClose={onClose}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

SimpleDialog.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
