import React, { useState, useEffect } from "react";
import { useLocation, Redirect } from "react-router-dom";
import Qrcode from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandRock,
  faHandPaper,
  faHandScissors,
  faTimesCircle,
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
import { withNavigation } from "components/navigation";
import { db, auth, cloudFunctions } from "firebaseUtils";
import { ROCK, PAPER, SCISSOR, getWinText } from "module/rockPaperScissors";
import useStyles from "./style";
import { LANDING, JOIN_GAME } from "constants/routes";
import { SimpleDialog } from "components/dialog";
import PropTypes from "prop-types";

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

const PlayGameButton = ({ children, handleClick, ...rest }) => (
  <Button
    variant="contained"
    color="secondary"
    fullWidth
    onClick={handleClick}
    {...rest}
  >
    {children}
  </Button>
);

PlayGameButton.propTypes = {
  children: PropTypes.string,
  handleClick: PropTypes.func,
};

const PlayGame = () => {
  const [state, setState] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showToast, setShowToast] = useState({ display: false, message: "" });
  const [weapon, setWeapon] = useState("");
  const classes = useStyles({ weapon });
  const [redirectUrl, setRedirect] = useState(null);
  const location = useLocation();
  const gameId = new URLSearchParams(location.search).get("gameId");
  const shareGameUrl = `${window.location.origin}${JOIN_GAME}?gameId=${gameId}`;
  const uid = auth && auth.currentUser && auth.currentUser.uid;

  useEffect(() => {
    const subscribe = db
      .collection("games")
      .doc(gameId)
      .onSnapshot((snapshot) => {
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
        setState({ finished, isDraw, winners, winningWeapon, players });
        if (restarted) {
          setWeapon("");
        }
      });
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

  if (!gameId) {
    return <Redirect to={LANDING} />;
  }

  if (redirectUrl) {
    return <Redirect to={redirectUrl} />;
  }

  return (
    <Container>
      <Box height="calc(70vh - 64px)">
        <Box p={2}>
          <Button
            color="secondary"
            className={classes.text}
            onClick={() => setShowDialog(true)}
          >
            invite other players
          </Button>
        </Box>
        <Box
          p={2}
          minHeight={200}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h3" className={classes.feedback} gutterBottom>
            {displayGameStatus(state, uid)}
          </Typography>
          <Typography className={classes.feedback}>
            {displayWinText(state)}
          </Typography>
          {state.players ? (
            <Typography className={classes.feedback}>
              Players in room: {state.players.length}
            </Typography>
          ) : null}
        </Box>
        {state.finished ? null : (
          <Box p={2}>
            <Grid container>
              <Grid item xs={4}>
                <Button onClick={() => setWeapon(ROCK)}>
                  <FontAwesomeIcon icon={faHandRock} className={classes.rock} />
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button onClick={() => setWeapon(PAPER)}>
                  <FontAwesomeIcon
                    icon={faHandPaper}
                    className={classes.paper}
                  />
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
          </Box>
        )}
      </Box>
      <Box
        height="30vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box width="70%">
          {state.finished ? (
            <React.Fragment>
              <Box mb={2}>
                <PlayGameButton handleClick={handleRestartGame}>
                  restart game
                </PlayGameButton>
              </Box>
              <PlayGameButton handleClick={handleLeaveGame}>
                leave game
              </PlayGameButton>
            </React.Fragment>
          ) : (
            <PlayGameButton
              handleClick={handleConfirm}
              disabled={weapon === ""}
            >
              Choose
            </PlayGameButton>
          )}
        </Box>
      </Box>
      <SimpleDialog
        title="Invite Players With Link"
        open={showDialog}
        onClose={() => setShowDialog(false)}
      >
        <Box m={2}>
          <Qrcode value={shareGameUrl} />
        </Box>
        <Box>
          <Typography gutterBottom>{shareGameUrl}</Typography>
        </Box>
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
  );
};

export default withNavigation(PlayGame);
