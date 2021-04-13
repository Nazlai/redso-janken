import React from "react";
import { useHistory, Link } from "react-router-dom";
import { Typography, Box, Container } from "@material-ui/core";
import { auth, cloudFunctions } from "firebaseUtils";
import { PLAY_GAME, GAME_LIST } from "constants/routes";
import { FullButton, CenterBox } from "components";
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
      <CenterBox height="50vh">
        <Box p={1} width="70%" maxWidth="450px">
          <Box mb={2}>
            <FullButton size="large" onClick={handleCreateGame}>
              new game
            </FullButton>
          </Box>
          <Link to={GAME_LIST} className={classes.link}>
            <FullButton>view games</FullButton>
          </Link>
        </Box>
      </CenterBox>
    </Container>
  );
};

export default Landing;
