import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  homeIcon: {
    textDecoration: "none",
    marginRight: theme.spacing(2),
    color: theme.palette.background.paper,
  },
  logo: {
    fontFamily: "Lobster",
    fontSize: "2rem",
  },
}));

export default useStyles;
