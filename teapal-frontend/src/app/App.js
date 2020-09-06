import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import './App.less';

import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

import Loading from './Loading';
import Loadable from 'react-loadable';
//import Search from './search/Search';

export const Context = React.createContext();
export const PRE = "/feature/api"

function App() {

  const [ locale, setLocale ] = React.useState(zhCN)

  const changeLocale = (key) => {
    switch(key){
      case 'en':
        setLocale( enUS );
        break;
      case 'ch':
        setLocale( zhCN );
        break;
      default:
        setLocale( enUS );
    }
  };

  // changeLocale('ch')

  /*const Home = Loadable({
    loader: () => import('./home/Home'),
    loading: Loading,
  });

  const Qwall = Loadable({
    loader: () => import('./qwall/Qwall'),
    loading: Loading,
  });

  const Handbook = Loadable({
    loader: () => import('./handbook/Handbook'),
    loading: Loading,
  });*/

  const Login = Loadable({
    loader: () => import('./login/Login'),
    loading: Loading,
  });

  /*const Profile = Loadable({
    loader: () => import('./profile/Profile'),
    loading: Loading,
  });*/

  const Teapal = Loadable({
    loader: () => import('./teapal/Teapal'),
    loading: Loading,
  });

  return (
    <Context.Provider value={{ locale, changeLocale }}>
      <ConfigProvider locale={locale} >
        <Router >
          <Switch>
            {/* <Route path="/qwall">
              <Qwall />
            </Route>
            <Route path="/handbook">
              <Handbook />
            </Route>
            <Route path="/profile/:user_name">
              <Profile />
            </Route> */}
            <Route path="/login">
              <Login />
            </Route>
            {/* <Route path="/search/:model/:search_value">
              <Search />
            </Route> */}
            <Route path="/teapal">
              <Teapal/>
            </Route>

            <Route exact path="/">
              <Redirect to="/teapal" />
            </Route>
            {/* <Route path="/">
              <Home/>
            </Route> */}
          </Switch>
        </Router>
      </ConfigProvider>
    </Context.Provider>
  );
}

export default App;
