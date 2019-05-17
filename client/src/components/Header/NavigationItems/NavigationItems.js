import React from 'react';

// import classes from './NavigationItems.module.scss';
import NavigationItem from '../../util/NavigationItem';


// TODO: no auth & auth > dynamically render
const navigationItems = ( props ) => {
    console.log(`props`, props);

    return (
        <ul>
            <NavigationItem link="/" exact>login</NavigationItem>
            <NavigationItem link="/signup" exact>signup</NavigationItem>
        </ul>
    )
};

export default navigationItems;