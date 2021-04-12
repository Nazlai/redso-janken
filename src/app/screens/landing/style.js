import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Lobster",
    color: "#f8f8ff",
  },
  text: {
    color: "#f8f8ff",
  },
  link: {
    textDecoration: "none",
    color: theme.palette.background.paper,
  },
}));

export default useStyles;
