import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.scss';


const navigationItem = ( props ) => {
    const styles = [props.style, classes.NavigationItem];

    return (
        <li className={styles.join(' ')}>
            <NavLink
                to={props.link}
                exact={props.exact}
                activeClassName={classes.active}
                >{props.children}</NavLink>
        </li>
    )
};

export default navigationItem;