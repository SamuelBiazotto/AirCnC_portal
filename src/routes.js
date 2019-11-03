import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom"

import Login from "./pages/login/index";
import Dashboard from "./pages/dashboard/index";
import New from "./pages/new/index";

export default function Routes() {
   return (
      <BrowserRouter>
         <Switch>
            <Route path="/" exact component={Login}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/new" component={New}/>
         </Switch>
      </BrowserRouter>
   )
}