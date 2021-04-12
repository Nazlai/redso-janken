import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Typography, Box, Container } from "@material-ui/core";
import { auth, cloudFunctions } from "firebaseUtils";
import { PLAY_GAME, GAME_LIST } from "constants/routes";
import useStyles from "./style";

const Landing = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleCreateGame = () => {
    const { uid } = auth.currentUser;

    cloudFunctions
      .createGame({ playerId: uid })
      .then((response) => response.data)
      .then((data) => {
        const { gameId } = data;
        const location = {
          pathname: PLAY_GAME,
          search: `gameId=${gameId}`,
        };
        history.push(location);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container>
      <Box
        height="50vh"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Typography variant="h1" className={classes.title}>
          Janken
        </Typography>
        <Box p={2}>
          <Typography className={classes.text}>
            Play rock paper scissors
          </Typography>
          <Typography className={classes.text}>with your friends!</Typography>
        </Box>
      </Box>
      <Box
        height="50vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box p={1} width="70%">
          <Button
            size="large"
            color="secondary"
            variant="contained"
            onClick={handleCreateGame}
            fullWidth
          >
            new game
          </Button>
        </Box>
        <Box p={1} width="70%">
          <Link to={GAME_LIST} className={classes.link}>
            <Button
              size="large"
              color="secondary"
              variant="contained"
              fullWidth
            >
              view games
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Landing;
