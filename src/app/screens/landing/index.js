import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { db, auth } from "firebaseUtils";
import createGame from "module/createGame";
import { PLAY_GAME } from "constants/routes";
import style from "./landing.module";
import { GAME_LIST } from "constants/routes";

// FIXME
// extract firebase method

const Landing = () => {
  const history = useHistory();

  const handleCreateGame = () => {
    const { uid } = auth.currentUser;
    const newDocRef = db.collection("games").doc();
    const { id: docId } = newDocRef;
    const currentTime = new Date().toISOString();

    newDocRef
      .set(createGame({ uid, docId, currentTime }))
      .then(() => {
        const location = {
          pathname: PLAY_GAME,
          search: `gameId=${docId}`,
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
