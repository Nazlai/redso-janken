import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { auth, cloudFunctions } from "firebaseUtils";
import { PLAY_GAME } from "constants/routes";
import style from "./landing.module";
import { GAME_LIST } from "constants/routes";

// FIXME
// extract firebase method

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
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      className={style.container}
    >
      <div className={style.title}>Janken</div>
      <div className={style.btnContainer}>
        <Button color="primary" variant="contained" onClick={handleCreateGame}>
          new game
        </Button>
        <Button color="primary" variant="contained" onClick={routeToGameList}>
          view games
        </Button>
      </div>
    </Grid>
  );
};

export default Landing;
