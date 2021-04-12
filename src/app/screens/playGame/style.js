import { makeStyles } from "@material-ui/core/styles";
import { ROCK, PAPER, SCISSOR } from "module/rockPaperScissors";

const iconStyle = {
  fontSize: "3.5rem",
};

const useStyles = makeStyles((theme) => {
  const { secondary } = theme.palette;
  const iconColors = (type) => (props) =>
    props.weapon === type ? secondary.main : secondary.contrastText;
  return {
    rock: {
      ...iconStyle,
      color: iconColors(ROCK),
    },
    paper: {
      ...iconStyle,
      color: iconColors(PAPER),
    },
    scissor: {
      ...iconStyle,
      color: iconColors(SCISSOR),
    },
    text: {
      fontSize: "1.5rem",
    },
    feedback: {
      color: theme.palette.background.paper,
    },
  };
});

export default useStyles;
