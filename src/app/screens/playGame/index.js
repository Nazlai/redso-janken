import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";
import { db, auth, cloudFnApi } from "firebaseUtils";
import { ROCK, PAPER, SCISSOR } from "module/rockPaperScissors";
import style from "./playGame.module";
import { LANDING, JOIN_GAME } from "constants/routes";

// FIXME
// extract firebase methods
// if user is not present in game send him to join
const Icon = ({ children, className }) => (
  <span className={className}>{children}</span>
);

const Draw = () => <p>draw</p>;
const DisplayWinner = ({ winners, playerId }) => {
  const message = winners.includes(playerId) ? "you win" : "you lost";
  return <p>{message}</p>;
};

const Result = ({ isDraw, ...rest }) => {
  const Element = isDraw ? Draw : DisplayWinner;
  return <Element {...rest} />;
};

const Game = (props) => {
  const [state, setState] = useState({});
  const [weapon, setWeapon] = useState("");
  const [redirectUrl, setRedirect] = useState(null);
  const location = useLocation();
  const gameId = new URLSearchParams(location.search).get("gameId");

  useEffect(() => {
    const subscribe = db
      .collection("games")
      .doc(gameId)
      .onSnapshot((snapshot) => {
        const { finished, isDraw, winners, players } = snapshot.data();
        const isPlayerPresent = players.includes(auth.currentUser.uid);
        if (!isPlayerPresent) {
          setRedirect(`${JOIN_GAME}?gameId=${gameId}`);
        }
        setState({ finished, isDraw, winners });
      });
    return subscribe;
  }, []);

  const leaveGame = () => {
    const cloudFn = cloudFnApi.leaveGame();
    const { uid } = auth.currentUser;

    cloudFn({ gameId, playerId: uid })
      .then((message) => console.log(message))
      .catch(console.log);
  };

  // FIXME
  // what if user picked a weapon but refreshed browser and picked again?
  const handleConfirm = () => {
    const { uid } = auth.currentUser;
    const player = {
      gameId: gameId,
      player: uid,
      weapon: weapon,
    };
    const cloudFn = cloudFnApi.commitMove();

    cloudFn(player)
      .then((data) => console.log(data, "call"))
      .catch(console.error);
  };

  const newGame = () => {
    const cloudFn = cloudFnApi.newGame();

    cloudFn({ gameId })
      .then(console.log)
      .catch((error) => console.log(error, "error"));
  };

  if (!gameId) {
    return <Redirect to={LANDING} />;
  }

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <div>
      {state.finished ? (
        <Result {...state} playerId={auth.currentUser.uid} />
      ) : null}
      <div className={style.container}>
        <Icon className={weapon === ROCK ? style.active : style.icon}>
          <FontAwesomeIcon icon={faHandRock} onClick={() => setWeapon(ROCK)} />
        </Icon>
        <Icon className={weapon === PAPER ? style.active : style.icon}>
          <FontAwesomeIcon
            icon={faHandPaper}
            onClick={() => setWeapon(PAPER)}
          />
        </Icon>
        <Icon className={weapon === SCISSOR ? style.active : style.icon}>
          <FontAwesomeIcon
            icon={faHandScissors}
            rotation={90}
            onClick={() => setWeapon(SCISSOR)}
          />
        </Icon>
      </div>
      <button type="button" onClick={handleConfirm} disabled={weapon === ""}>
        Confirm
      </button>
      {state.finished ? (
        <button type="button" onClick={newGame}>
          new game
        </button>
      ) : null}
      <button type="button" onClick={leaveGame}>
        leave game
      </button>
    </div>
  );
};

export default Game;
