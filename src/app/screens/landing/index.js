import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Typography, Box, Container } from "@material-ui/core";
import { auth, cloudFunctions } from "firebaseUtils";
import { PLAY_GAME, GAME_LIST } from "constants/routes";

const Landing = () => {
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

  const routeToGameList = () => {
    history.push(GAME_LIST);
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
        <Typography variant="h1">Janken</Typography>
        <Box p={2}>
          <Typography>Play rock paper scissors</Typography>
          <Typography>with your friends!</Typography>
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
          <Button
            size="large"
            color="secondary"
            variant="contained"
            onClick={routeToGameList}
            fullWidth
          >
            view games
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Landing;
