import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./globalComponents/NavBar";
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages";
import Footer from "./globalComponents/Footer";
import { DayForm, DayList } from "./pages";
import { getAuth, getToken } from "./services";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./reducers/userReducer";
import { initializeStations } from "./reducers/obsStationReducer";
import DayDetails from "./pages/dayList/DayDetails";


const App = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const userIsSet = Boolean(user.id);

  useEffect(() => {
    dispatch(initializeStations());
    if (userIsSet) return;
    getToken()
      .then(resp => resp.data)
      .then(tokenJson => getAuth(tokenJson.token, tokenJson.auth_token)
        .then(resp => resp.data)
        .then(res => dispatch(setUser(res)))
        .catch(() => console.error("user not set"))
      ).catch(() => console.error("token not set"));
  }, [dispatch, userIsSet]);

  console.log("user:", user);


  return (
    <CssBaseline>
      <div>
        <NavBar />
        <Switch>
          <Route path="/havainnointiform">
            <DayForm />
          </Route>
          <Route path="/havainnointilist">
            <DayList />
          </Route>
          <Route path="/paivatiedot/:day">
            <DayDetails />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
        <Footer />
      </div>
    </CssBaseline>
  );

};

export default App;
