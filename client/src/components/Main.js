import React from "react";
import { Switch, Route } from "react-router-dom";
import Form from "./Form";

import Applications from "./Applications";

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Form} />
      <Route exact path="/applications" component={Applications} />
    </Switch>
  </main>
);

export default Main;
