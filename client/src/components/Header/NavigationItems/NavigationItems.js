import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import classes from './NavigationItems.module.scss';
import NavigationItem from '../../util/NavigationItem';


// TODO: no auth & auth > dynamically render
const navigationItems = ( props ) => {
    console.log(`props`, props);

    let navItems;
    if (!props.isAuth) {
        navItems = (
            <Fragment>
                <NavigationItem link="/" exact>login</NavigationItem>
                <NavigationItem link="/signup" exact>signup</NavigationItem>
            </Fragment>
        );
    } else {
        navItems = (
            <Fragment>
                <NavigationItem link="/" exact>home</NavigationItem>
                <NavigationItem link="/add" exact>add</NavigationItem>
                <NavigationItem link="/asset" exact>asset</NavigationItem>
                <li key="logout">
                    <Link
                        onClick={props.onLogout}
                        to="/"
                        className={classes.Logout}>logout</Link>
                </li>
            </Fragment>
        );
    }

    return (
        <ul className={classes.NavigationItems}>
            { navItems }
        </ul>
    )
};

export default navigationItems;