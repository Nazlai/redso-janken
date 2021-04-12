import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: 3,
    minWidth: 300,
    width: "60%",
  },
  text: {
    color: theme.palette.background.paper,
  },
}));

export default useStyles;
