import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@material-ui/core";
import { withNavigation } from "components/navigation";
import { db, auth, cloudFunctions } from "firebaseUtils";
import { PLAY_GAME } from "constants/routes";
import useStyles from "./style";

const GameList = () => {
  const classes = useStyles();
  const [list, setList] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const subscribe = db
      .collection("games")
      .get()
      .then((snapShot) => {
        const gameList = snapShot.docs.map((doc) => doc.data());
        setList(gameList);
      });
    return subscribe;
  }, []);

  const handleJoinGame = (gameId) => {
    const { uid } = auth.currentUser;

    cloudFunctions
      .joinGame({ gameId: gameId, playerId: uid })
      .then(() => {
        const location = {
          pathname: PLAY_GAME,
          search: `gameId=${gameId}`,
        };
        history.push(location);
      })
      .catch(console.log);
  };

  return (
    <Container>
      <Box
        minHeight="calc(100vh - 64px)"
        m={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {list.length ? (
          list.map((game) => {
            const { gameId, players, finished } = game;
            const gameStatus = finished ? "Finished" : "In progress";
            const playerCount = players.length;
            return (
              <Card key={gameId} className={classes.card}>
                <CardContent>
                  <Typography align="left">GameID: {gameId}</Typography>
                  <Typography align="left">
                    Game Status: {gameStatus}
                  </Typography>
                  <Typography align="left">
                    Current Players: {playerCount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    onClick={() => handleJoinGame(gameId)}
                  >
                    join
                  </Button>
                </CardActions>
              </Card>
            );
          })
        ) : (
          <Typography className={classes.text}>No current games</Typography>
        )}
      </Box>
    </Container>
  );
};

export default withNavigation(GameList);
