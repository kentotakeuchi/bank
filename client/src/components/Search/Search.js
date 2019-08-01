import React, { Component } from 'react';

import classes from './Search.module.scss';

class Search extends Component {
  state = { term: '' };

  onInputChange = e => {
    this.setState({ term: e.target.value });
  };

  onFormSubmit = e => {
    e.preventDefault();
    this.props.onFormSubmit(this.state.term);
  };

  render() {
    console.log(`this.state`, this.state);

    return (
      <div className={classes.Search}>
        <form onSubmit={this.onFormSubmit}>
          <input className={classes.Input} onChange={this.onInputChange} />
        </form>
      </div>
    );
  }
}

export default Search;
