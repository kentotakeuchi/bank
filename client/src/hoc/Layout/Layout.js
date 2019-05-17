import React, { Component, Fragment } from 'react';

import Header from '../../components/Header/Header';
// import SideDrawer from '../../components/Header/SideDrawer/SideDrawer';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            console.log(`prevState`, prevState);

            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        console.log(`this.props`, this.props);

        return (
            <Fragment>
                <Header
                drawerToggleClicked={this.sideDrawerToggleHandler}/>
                {/* <SideDrawer
                open={this.state.showSideDrawer}
                closed={this.sideDrawerClosedHandler}/> */}
                <main>
                    {this.props.children}
                </main>
            </Fragment>
        );
    }
};

export default Layout;