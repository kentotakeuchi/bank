import React from 'react';

import classes from './DrawerToggle.module.scss';

const drawerToggle = (props) => {
    console.log(`props`, props);

    return (
        // drawerToggleClicked={this.sideDrawerToggleHandler}
        // clicked={props.drawerToggleClicked}
        <div className={classes.DrawerToggle} onClick={props.clicked}></div>
    );
};

export default drawerToggle;