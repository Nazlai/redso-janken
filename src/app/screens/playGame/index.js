import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
} from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "firebaseUtils";
import { getWinner, ROCK, PAPER, SCISSOR } from "module/rockPaperScissors";
import style from "./playGame.module";

// FIXME
// extract firebase methods

const Icon = ({ children, className }) => (
  <span className={className}>{children}</span>
);

const Result = ({ result }) => {
  if (!result.length) return null;

  const isDraw = result.length === 1 && result[0] === "draw";
  const text = isDraw
    ? "its a draw"
    : result.includes(auth.currentUser.uid)
    ? "you win"
    : "you lose";
  return <p>{text}</p>;
};

const Game = (props) => {
  const [weapon, setWeapon] = useState("");
  const [winner, setWinner] = useState([]);
  const [isJoin, setJoin] = useState(false);
  const location = useLocation();
  const gameId = new URLSearchParams(location.search).get("gameId");

  useEffect(() => {
    const update = db
      .collection("games")
      .doc(gameId)
      .onSnapshot((doc) => {
        console.log(doc.data(), auth.currentUser.uid);
        const { threads, players, newGame } = doc.data();
        const { result } = getWinner(threads);
        let join = players.includes(auth.currentUser.uid) ? true : false;
        setJoin(join);
        if (threads.length === players.length && players.length > 1) {
          setWinner(result);
        }
        if (newGame) {
          setWinner([]);
          setWeapon("");
        }
      });
    return () => update();
  }, []);

  const leaveGame = () => {
    const docRef = db.collection("games").doc(gameId);
    db.runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        if (!doc.exists) {
          throw "document does not exist";
        }
        const { uid } = auth.currentUser;
        const players = doc.data().players;
        const newPlayers = players.filter((i) => i !== uid);
        transaction.update(docRef, { players: newPlayers });
      });
    });
  };

  // FIXME
  // what if user picked a weapon but refreshed browser and picked again?
  const handleConfirm = () => {
    const { uid: userId } = auth.currentUser;
    const player = {
      player: userId,
      weapon,
    };
    const docRef = db.collection("games").doc(gameId);
    db.runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        if (!doc.exists) {
          throw "document does not exist!";
        }
        const threads = doc.data().threads;
        const newThread = [...threads, player];
        transaction.update(docRef, { threads: newThread, newGame: false });
      });
    })
      .then(() => console.log("transaction successful"))
      .catch((error) => console.log(error));
  };

  const newGame = () => {
    const docRef = db.collection("games").doc(gameId);
    db.runTransaction((transaction) => {
      return transaction.get(docRef).then((doc) => {
        if (!doc.exists) {
          throw "document does not exist";
        }
        transaction.update(docRef, { threads: [], newGame: true });
      });
    })
      .then(() => console.log("game cleared"))
      .catch(console.error);
  };

  return (
    <div>
      {isJoin && <Result result={winner} />}
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
      <button type="button" onClick={newGame}>
        new game
      </button>
      <button type="button" onClick={leaveGame}>
        leave game
      </button>
    </div>
  );
};

export default Game;
