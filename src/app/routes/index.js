import React from "react";
import { Route, Switch } from "react-router-dom";
import * as ROUTES from "constants/routes";
import { Landing, GameList, JoinGame, PlayGame } from "screens";

const Routes = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.LANDING}>
        <Landing />
      </Route>
      <Route path={ROUTES.GAME_LIST}>
        <GameList />
      </Route>
      <Route path={ROUTES.JOIN_GAME}>
        <JoinGame />
      </Route>
      <Route path={ROUTES.PLAY_GAME}>
        <PlayGame />
      </Route>
    </Switch>
  );
};

export default Routes;
