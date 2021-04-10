const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getWinner } = require("./util");

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

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
      const { winners, isDraw } = getWinner(moves);
      return gameRef.update({
        finished: true,
        winners: winners,
        isDraw: isDraw,
      });
    }
    return null;
  });

exports.commitMove = functions.https.onCall((data, context) => {
  const { gameId, player } = data;
  const movesRef = firestore
    .collection("games")
    .doc(gameId)
    .collection("moves");
  // FIXME return picked move for player
  return movesRef
    .where("player", "==", player)
    .get()
    .then((snapshot) => {
      if (snapshot.size === 1) {
        return { message: "already submitted move" };
      } else {
        return firestore
          .doc(`games/${gameId}/moves/${player}`)
          .set(data)
          .then(() => "move set");
      }
    });
});

exports.newGame = functions.https.onCall((data, context) => {
  const { gameId } = data;
  const subDocRef = firestore
    .collection("games")
    .doc(gameId)
    .collection("moves");
  const gameRef = firestore.doc(`games/${gameId}`);

  return subDocRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => doc.ref.delete());
    })
    .then(() => {
      gameRef.update({ finished: false, winners: [], isDraw: false });
    })
    .then(() => "game cleared")
    .catch((error) => error);
});

exports.leaveGame = functions.https.onCall((data, context) => {
  const { gameId, playerId } = data;
  const gameRef = firestore.doc(`games/${gameId}`);

  gameRef
    .get()
    .then((snapshot) => {
      const { players } = snapshot.data();
      const newPlayers = players.filter((player) => player !== playerId);
      gameRef.update({ players: newPlayers });
    })
    .then(() => "success")
    .catch((error) => error);
});
