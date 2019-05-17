import React from 'react';

import classes from './Auth.module.scss';

const auth = props => <section className={classes.AuthForm}>{props.children}</section>;

export default auth;
