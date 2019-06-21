import React, { Component } from 'react';

import classes from './About.module.scss';


class About extends Component {
    render() {
        return(
            <div className={classes.About}>
                <h1>bank</h1>
                <p>BANK is an application like flash card to consolidate your vocabulary in English. you can store phrases you wanted to say and review them at random whenever you have time.</p>
            </div>
        );
    }
}

export default About;
