import React, { useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { withNavigation } from "components/navigation";
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Divider,
} from "@material-ui/core";
import { auth, cloudFunctions } from "firebaseUtils";
import { LANDING, PLAY_GAME } from "constants/routes";
import { SimpleDialog, CenterBox } from "components";

const JoinGame = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { search } = useLocation();
  const history = useHistory();
  const gameId = new URLSearchParams(search).get("gameId");

  const handleClose = () => setShowDialog(false);

  const handleJoin = () => {
    const { uid } = auth.currentUser;

    cloudFunctions
      .joinGame({ gameId, playerId: uid })
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
  };

  if (!gameId) {
    return <Redirect to={LANDING} />;
  }

  return (
    <Container>
      <CenterBox height="calc(100vh - 64px)">
        <Box width="100%" display="flex" justifyContent="center">
          <Card>
            <CardContent>
              <Typography variant="h4">Hi there</Typography>
              <Divider />
              <Box p={4}>
                <Typography>
                  You&apos;ve been invited to join a game!
                </Typography>
              </Box>
            </CardContent>
            <CardActions align="center">
              <Button
                size="large"
                color="secondary"
                variant="contained"
                onClick={handleJoin}
                fullWidth
              >
                join game
              </Button>
            </CardActions>
          </Card>
        </Box>
      </CenterBox>
      <SimpleDialog title="Uh oh" open={showDialog} onClose={handleClose}>
        <Typography>Game does not exist</Typography>
        <Button color="primary" onClick={handleClose}>
          Close
        </Button>
      </SimpleDialog>
    </Container>
  );
};

export default withNavigation(JoinGame);
