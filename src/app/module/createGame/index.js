const createGame = ({ uid, docId, currentTime }) => {
  return {
    gameId: docId,
    created: currentTime,
    players: [uid],
    finished: false,
  };
};

export default createGame;
