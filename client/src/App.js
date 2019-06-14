// third party
import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// scss
import classes from './App.module.scss';

// store
import * as actions from './store/actions/index';

// hoc
import Layout from './hoc/Layout/Layout';

// auth
import ResetPage from './containers/Auth/Reset';
import NewPasswordPage from './containers/Auth/NewPassword';
import SignupPage from './containers/Auth/Signup';
import LoginPage from './containers/Auth/Login';

// main
import Home from './containers/Home/Home';
import Add from './containers/Add/Add';
import Asset from './containers/Asset/Asset';


class App extends Component {
  state = {
    showBackdrop: false,
    showMobileNav: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      this.logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    this.props.onIsAuth();
    this.setState({ token: token, userId: userId });
    this.setAutoLogout(remainingMilliseconds);
  };

  mobileNavHandler = isOpen => {
    this.setState({ showMobileNav: isOpen, showBackdrop: isOpen });
  };

  backdropClickHandler = () => {
    this.setState({ showBackdrop: false, showMobileNav: false, error: null });
  };

  logoutHandler = () => {
    this.props.onIsNotAuth();
    this.setState({ token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    this.props.history.replace('/');
  };

  loginHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${process.env.REACT_APP_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.email,
        password: authData.password
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed.');
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Could not authenticate you!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.props.onIsAuth();
        this.setState({
          token: resData.token,
          authLoading: false,
          userId: resData.userId
        });
        localStorage.setItem('token', resData.token);
        localStorage.setItem('userId', resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem('expiryDate', expiryDate.toISOString());
        this.setAutoLogout(remainingMilliseconds);
      })
      .catch(err => {
        console.log(err);
        this.props.onIsNotAuth();
        this.setState({
          authLoading: false,
          error: err
        });
      });
  };

  signupHandler = (event, authData) => {
    event.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${process.env.REACT_APP_URL}/api/auth/signup`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.signupForm.email.value,
        password: authData.signupForm.password.value,
        name: authData.signupForm.name.value
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (res.status !== 200 && res.status !== 201) {
          console.log('Error!');
          throw new Error('Creating a user failed!');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.props.onIsNotAuth();
        this.setState({ authLoading: false });
        this.props.history.replace('/');
      })
      .catch(err => {
        console.log(err);
        this.props.onIsNotAuth();
        this.setState({
          authLoading: false,
          error: err
        });
      });
  };

  setAutoLogout = milliseconds => {
    setTimeout(() => {
      this.logoutHandler();
    }, milliseconds);
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  resetHandler = (e, authData) => {
    e.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${process.env.REACT_APP_URL}/api/auth/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: authData.email
      })
    }).then(res => {
      console.log(`res`, res);
      if (res.status === 404) {
        throw new Error('User not found.');
      }
      if (res.status !== 200) {
        console.log('Error!');
        throw new Error('Could not send an email');
      }
      return res.json();
    }).then(resData => {
      alert(resData.message);
      this.setState({ authLoading: false });
      this.props.history.replace('/');
    }).catch(err => {
      alert(err);
      this.setState({
        authLoading: false,
        error: err
      });
    });
  };

  newPasswordHandler = (e, authData) => {
    e.preventDefault();
    this.setState({ authLoading: true });
    fetch(`${process.env.REACT_APP_URL}/api/auth/new-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: authData.password,
        passwordToken: authData.passwordToken
      })
    }).then(res => {
      console.log(`res`, res);
      if (res.status !== 200) {
        console.log('Error!');
        throw new Error('Could not update your password.');
      }
      return res.json();
    }).then(resData => {
      alert(resData.message);
      this.setState({ authLoading: false });
      this.props.history.replace('/');
    }).catch(err => {
      alert(err);
      this.setState({
        authLoading: false,
        error: err
      });
    });
  }

  render() {

    let routes;
    // no auth
    if (!this.props.isAuth) {
      routes = (
        <Switch>
          <Route
            path="/reset"
            exact
            render={props => (
              <ResetPage
                {...props}
                onReset={this.resetHandler}
                loading={this.state.authLoading}
              />
            )}
          />
          <Route
            path="/reset/:token"
            exact
            render={props => (
              <NewPasswordPage
                {...props}
                onResetPassword={this.newPasswordHandler}
                loading={this.state.authLoading}
              />
            )}
          />
          <Route
            path="/signup"
            exact
            render={props => (
              <SignupPage
                {...props}
                onSignup={this.signupHandler}
                loading={this.state.authLoading}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={props => (
              <LoginPage
                {...props}
                onLogin={this.loginHandler}
                loading={this.state.authLoading}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      );
    }

    // auth
    if (this.props.isAuth) {
      routes = (
        <Switch>
          {/* <Route path="/asset" exact component={Asset}/> */}
          <Route
            path="/asset"
            exact
            render={props => (
              <Asset
                {...props}
                token={this.state.token}
              />
            )}
          />
          <Route
            path="/add"
            exact
            render={props => (
              <Add
                {...props}
                token={this.state.token}
              />
            )}
          />
          <Route
            path="/"
            exact
            render={props => (
              <Home
                {...props}
                token={this.state.token}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      );
    }

    return (
      <div className={classes.App}>
        <Layout onLogout={this.logoutHandler}>
          {routes}
        </Layout>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
      isAuth: state.auth.isAuth
  };
}

const mapDispatchToProps = dispatch => {
  return {
      onIsAuth: () => dispatch( actions.isAuthHandler() ),
      onIsNotAuth: () => dispatch( actions.isNotAuthHandler() )
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( withRouter( App ) );
