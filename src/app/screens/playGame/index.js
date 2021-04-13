import React, { useState, useEffect } from "react";
import { useLocation, Redirect, Link } from "react-router-dom";
import Qrcode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
  faTimesCircle,
  faUserPlus,
  faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Box,
  Container,
  Grid,
  Typography,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import { db, auth, cloudFunctions } from "firebaseUtils";
import { ROCK, PAPER, SCISSOR, getWinText } from "module/rockPaperScissors";
import useStyles from "./style";
import { LANDING, JOIN_GAME, GAME_LIST } from "constants/routes";
import { CenterBox, FullButton, SimpleDialog, Navigation } from "components";

const displayWinText = (state) => {
  if (state.finished && !state.isDraw) {
    return getWinText[state.winningWeapon];
  }
  return null;
};

const displayGameStatus = (state, uid) => {
  const { finished, isDraw, winners } = state;
  if (!finished || !uid) return "Waiting for other players...";

  const didPlayerWin = winners.includes(uid) ? "You won!" : "You lost!";
  const message = isDraw ? "It's a draw!" : didPlayerWin;
  return message;
};

const PlayGame = () => {
  const [state, setState] = useState({});
  const [hideControls, setHideControls] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState({ display: false, message: "" });
  const [weapon, setWeapon] = useState("");
  const classes = useStyles({ weapon });
  const [redirectUrl, setRedirect] = useState(null);
  const location = useLocation();
  const gameId = new URLSearchParams(location.search).get("gameId");
  const shareGameUrl = `${window.location.origin}${JOIN_GAME}?gameId=${gameId}`;
  const uid = auth && auth.currentUser && auth.currentUser.uid;

  if (!gameId) {
    return <Redirect to={LANDING} />;
  }

  useEffect(() => {
    const subscribe = db
      .collection("games")
      .doc(gameId)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            const {
              finished,
              isDraw,
              winners,
              players,
              winningWeapon,
              restarted,
            } = snapshot.data();

            const isPlayerPresent = players.includes(auth.currentUser.uid);
            if (!isPlayerPresent) {
              setRedirect(`${JOIN_GAME}?gameId=${gameId}`);
            }
            if (restarted) {
              setWeapon("");
            }
            setState({ finished, isDraw, winners, winningWeapon, players });
          } else {
            setHideControls(true);
            setShowToast({ display: true, message: "Game not found" });
          }
        },
        (error) => console.log(error)
      );
    return subscribe;
  }, []);

  const handleLeaveGame = () => {
    const { uid } = auth.currentUser;

    cloudFunctions
      .leaveGame({ gameId, playerId: uid })
      .then((response) => response.data)
      .then((message) => console.log(message))
      .catch(console.log);
  };

  const handleConfirm = () => {
    const { uid } = auth.currentUser;
    const player = {
      gameId: gameId,
      player: uid,
      weapon: weapon,
    };

    cloudFunctions
      .commitMove(player)
      .then((response) => response.data)
      .then((message) => {
        if (message.warning) {
          setShowToast({ display: true, message: message.message });
          setWeapon(message.move);
        }
      })
      .catch(console.error);
  };

  const handleRestartGame = () => {
    cloudFunctions
      .newGame({ gameId })
      .then((response) => response.data)
      .then((message) =>
        setShowToast({ display: true, message: message.message })
      )
      .catch((error) => console.log(error, "error"));
  };

  const hideToast = () => setShowToast({ message: "", display: false });

  const renderMoves = () => {
    if (state.finished) return null;

    return (
      <Grid container>
        <Grid item xs={4}>
          <Button onClick={() => setWeapon(ROCK)}>
            <FontAwesomeIcon icon={faHandRock} className={classes.rock} />
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => setWeapon(PAPER)}>
            <FontAwesomeIcon icon={faHandPaper} className={classes.paper} />
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={() => setWeapon(SCISSOR)}>
            <FontAwesomeIcon
              icon={faHandScissors}
              rotation={90}
              className={classes.scissor}
            />
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderButtons = () => {
    return state.finished ? (
      <React.Fragment>
        <Box mb={2}>
          <FullButton handleClick={handleRestartGame}>restart game</FullButton>
        </Box>
        <FullButton handleClick={handleLeaveGame}>leave game</FullButton>
      </React.Fragment>
    ) : (
      <FullButton handleClick={handleConfirm} disabled={weapon === ""}>
        Choose
      </FullButton>
    );
  };

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <React.Fragment>
      <Navigation>
        <Box>
          <IconButton onClick={() => setShowDialog(true)}>
            <FontAwesomeIcon icon={faUserPlus} className={classes.navIcon} />
          </IconButton>
          <IconButton>
            <Link to={GAME_LIST} className={classes.link}>
              <FontAwesomeIcon icon={faListAlt} className={classes.navIcon} />
            </Link>
          </IconButton>
        </Box>
      </Navigation>
      <Container>
        <Box height="70vh - 64px">
          <CenterBox m={4} minHeight="5rem">
            <Typography className={classes.feedback}>
              GameID: {gameId}
            </Typography>
            {state.players && (
              <Typography className={classes.feedback}>
                Players in room: {state.players.length}
              </Typography>
            )}
          </CenterBox>
          <CenterBox margin={4} minHeight="30vh">
            <Typography variant="h3" className={classes.feedback} gutterBottom>
              {displayGameStatus(state, uid)}
            </Typography>
            <Typography className={classes.feedback}>
              {displayWinText(state)}
            </Typography>
          </CenterBox>
          <Box m={4}>{hideControls ? null : renderMoves()}</Box>
        </Box>
        <CenterBox>
          <Box width="70%" maxWidth="450px">
            {hideControls ? null : renderButtons()}
          </Box>
        </CenterBox>
        <SimpleDialog
          title="Invite Players With Link"
          open={showDialog}
          onClose={() => setShowDialog(false)}
        >
          <Box m={2}>
            <Qrcode value={shareGameUrl} />
          </Box>
          <Typography gutterBottom>{shareGameUrl}</Typography>
        </SimpleDialog>
        <Snackbar
          open={showToast.display}
          message={showToast.message}
          autoHideDuration={6000}
          onClose={hideToast}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={hideToast}
              >
                <FontAwesomeIcon icon={faTimesCircle} />
              </IconButton>
            </React.Fragment>
          }
        />
      </Container>
    </React.Fragment>
  );
};

export default PlayGame;
