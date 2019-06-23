import React, { Component } from 'react';

import classes from './About.module.scss';


class About extends Component {
    render() {
        return(
            <div className={classes.About}>
                <h1>bank</h1>
                <p>BANK is an application like flash card to consolidate your knowleadge you would like to memorize. you are able to store anything you would like to learn and review them at random anytime, anywhere.</p>
            </div>
        );
    }
}

export default About;
