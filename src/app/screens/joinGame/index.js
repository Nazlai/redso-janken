import React, { useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Container, Grid, Typography, Button } from "@material-ui/core";
import { db, auth } from "firebaseUtils";
import { LANDING, PLAY_GAME } from "constants/routes";
import { SimpleDialog } from "components/dialog";

const JoinGame = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { search } = useLocation();
  const history = useHistory();
  const gameId = new URLSearchParams(search).get("gameId");

  const handleClose = () => setShowDialog(false);

  const handleJoin = () => {
    const { uid } = auth.currentUser;

    const docRef = db.collection("games").doc(gameId);

    db.runTransaction((transaction) => {
      return transaction
        .get(docRef)
        .then((doc) => {
          if (!doc.exists) {
            throw "document does not exist";
          }
          const players = doc.data().players;
          const newPlayers = players.includes(uid)
            ? players
            : players.concat(uid);
          transaction.update(docRef, { players: newPlayers });
        })
        .then(() => {
          const location = {
            pathname: PLAY_GAME,
            search: `gameId=${gameId}`,
          };
          history.push(location);
        })
        .catch((error) => {
          console.log(error);
          setShowDialog(true);
        });
    });
  };

  if (!gameId) {
    return <Redirect to={LANDING} />;
  }

  return (
    <Container>
      <Grid container direction="column" alignItems="center" justify="center">
        <Button size="large" color="primary" onClick={handleJoin}>
          join game
        </Button>
      </Grid>
      <SimpleDialog title="Uh oh" open={showDialog} onClose={handleClose}>
        <p>game does not exist</p>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </SimpleDialog>
    </Container>
  );
};

export default JoinGame;
