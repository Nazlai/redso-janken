const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getWinner } = require("./util");

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const printError = (errorName, error) => {
  console.log(`---${errorName} error start---`);
  console.log(error);
  console.log(`---${errorName} error end---`);
  return;
};

exports.checkWinner = functions.firestore
  .document("games/{gameId}/moves/{playerId}")
  .onCreate(async (snapshot, context) => {
    const { gameId } = context.params;
    const gameRef = firestore.doc(`games/${gameId}`);

    const gameData = await gameRef.get();
    const moveSnapshot = await firestore
      .collection("games")
      .doc(gameId)
      .collection("moves")
      .get();
    const moves = moveSnapshot.docs.map((doc) => doc.data());
    const totalPlayers = gameData.data().players.length;

    if (totalPlayers === moves.length && totalPlayers > 1) {
      const { winners, isDraw, winningWeapon } = getWinner(moves);
      return gameRef.update({
        finished: true,
        winners: winners,
        isDraw: isDraw,
        winningWeapon: winningWeapon,
        restarted: false,
      });
    }
    return null;
  });

// adds player submitted move to moves subcollection
// if player is not present
exports.commitMove = functions.https.onCall(async (data) => {
  const { gameId, player } = data;
  const movesRef = firestore
    .collection("games")
    .doc(gameId)
    .collection("moves");
  const docRef = firestore.doc(`games/${gameId}/moves/${player}`);

  try {
    const doc = await firestore.doc(`games/${gameId}`).get();
    if (!doc.exists) {
      throw "Game not found";
    } else {
      const moveSnapshot = await movesRef.where("player", "==", player).get();
      const isPlayerInCollection = moveSnapshot.size === 1;
      if (isPlayerInCollection) {
        const [move] = moveSnapshot.docs.map((doc) => doc.data());
        return {
          message: "You've already submitted a move",
          warning: true,
          move: move.weapon,
        };
      } else {
        await docRef.set({
          ...data,
          created: admin.firestore.FieldValue.serverTimestamp(),
        });
        return {
          message: "Move set",
        };
      }
    }
  } catch (error) {
    printError("commit move", error);
    throw new functions.https.HttpsError("not-found", error);
  }
});

// resets game status and clears moves subcollection
exports.newGame = functions.https.onCall(async (data) => {
  const { gameId } = data;
  const subDocRef = firestore
    .collection("games")
    .doc(gameId)
    .collection("moves");
  const gameRef = firestore.doc(`games/${gameId}`);
  try {
    const subDocSnapshot = await subDocRef.get();
    await Promise.all(subDocSnapshot.docs.map((doc) => doc.ref.delete()));
    await gameRef.update({
      finished: false,
      winners: [],
      isDraw: false,
      winningWeapon: "",
      restarted: true,
    });
    return {
      message: "Game reset",
    };
  } catch (error) {
    printError("new game", error);
    return error;
  }
});

// removes player from game
exports.leaveGame = functions.https.onCall(async (data) => {
  const { gameId, playerId } = data;
  const gameRef = firestore.doc(`games/${gameId}`);

  try {
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(gameRef);
      if (!doc.exists) throw "game not found";
      const { players } = doc.data();
      const newPlayers = players.filter((player) => player !== playerId);
      transaction.update(gameRef, { players: newPlayers });
    });
    return { message: "You left the game" };
  } catch (error) {
    printError("leave game", error);
    return error;
  }
});

// create new game document in games collection
exports.createGame = functions.https.onCall(async (data) => {
  const { playerId } = data;
  const gameRef = firestore.collection("games").doc();

  try {
    await gameRef.set({
      gameId: gameRef.id,
      created: admin.firestore.FieldValue.serverTimestamp(),
      players: [playerId],
      finished: false,
    });
    return {
      message: "Game created",
      gameId: gameRef.id,
    };
  } catch (error) {
    printError("create game", error);
    return error;
  }
});

// adds player to game document
exports.joinGame = functions.https.onCall(async (data) => {
  const { gameId, playerId } = data;
  const gameRef = firestore.collection("games").doc(gameId);

  try {
    await firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(gameRef);
      if (!doc.exists) throw "game not found";
      const players = doc.data().players;
      const newPlayers = players.includes(playerId)
        ? players
        : players.concat(playerId);
      transaction.update(gameRef, { players: newPlayers });
    });
    return { message: "Joined game" };
  } catch (error) {
    printError("join game", error);
    throw new functions.https.HttpsError("not-found", error);
  }
});
