import React, { Fragment } from 'react';

import classes from './SideDrawer.module.scss';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = ( props ) => {
    console.log(`props`, props);

    let attachedClasses = [classes.SideDrawer, classes.Close];
    // open={this.state.showSideDrawer}
    if (props.open) {
        attachedClasses = [classes.SideDrawer, classes.Open];
    }
    return (
        <Fragment>
            <Backdrop
            show={props.open}
            clicked={props.closed}/>

            <div
            className={attachedClasses.join(' ')}
            onClick={props.closed}>
                <NavigationItems />
            </div>
        </Fragment>
    );
};

export default sideDrawer;