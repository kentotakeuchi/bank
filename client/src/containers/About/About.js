import React, { Component } from 'react';

import classes from './About.module.scss';

class About extends Component {
  render() {
    return (
      <article className={classes.About}>
        <h1>bank</h1>
        <p>
          BANK is an application like flash card to consolidate your knowledge
          you would like to memorize. you are able to store anything you would
          like to learn and review them at random anytime, anywhere.
          <br />
        </p>
        <br />
        <p>
          Tips: If you are an iOS user, it's good to have iOS home screen icon
          for this app. Since the icon has been prepared, you are able to use
          the app like iOS app.
          <br />
          Open Safari browser > Click Action(Share) icon > Click Add to Home
          Screen > Save
        </p>
      </article>
    );
  }
}

export default About;
