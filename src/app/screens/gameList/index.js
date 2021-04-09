import React, { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { db } from "firebaseUtils";
import { JOIN_GAME } from "constants/routes";

// FIXME
// use card for created games
// extract firebase method

const GameList = () => {
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

  const routeJoinGame = (gameId) => {
    const location = {
      pathname: JOIN_GAME,
      search: `gameId=${gameId}`,
    };
    history.push(location);
  };

  return (
    <div>
      <Typography align="center" variant="h2">
        All Games
      </Typography>
      {list.length ? (
        list.map((game) => (
          <Fragment key={game.gameId}>
            <p onClick={() => routeJoinGame(game.gameId)}>{game.gameId}</p>
          </Fragment>
        ))
      ) : (
        <p>no current games</p>
      )}
    </div>
  );
};

export default GameList;
