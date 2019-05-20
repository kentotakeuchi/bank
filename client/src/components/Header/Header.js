import React from 'react';

import classes from './Header.module.scss';
import NavigationItems from './NavigationItems/NavigationItems';
import DrawerToggle from '../Header/SideDrawer/DrawerToggle/DrawerToggle';

const styles = [ `fas`, `fa-bars`, classes.MobileOnly ];


const header = ( props ) => {
    console.log(`props`, props);

        return (
            <header className={classes.Header}>
                <NavigationItems
                style={classes.DesktopOnly}
                isAuth={props.isAuth}
                onLogout={props.onLogout}/>

                <i className={styles.join(` `)}>
                    <DrawerToggle clicked={props.drawerToggleClicked} />
                </i>
            </header>
        );
};

export default header;