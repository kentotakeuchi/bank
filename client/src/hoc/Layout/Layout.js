import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

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
                drawerToggleClicked={this.sideDrawerToggleHandler}
                isAuth={this.props.isAuth}
                onLogout={this.props.onLogout}/>
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

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuth
    };
};

export default connect(mapStateToProps)(Layout);