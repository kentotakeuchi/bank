import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Asset.module.scss';
import * as actions from '../../store/actions/index';


class Asset extends Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
    };

    state = {
      assetLoading: false,
      currentPage: 1,
      assetsPerPage: 10
    };

    componentDidMount() {
        console.log(`componentDidMount`);
        fetch(`${process.env.REACT_APP_URL}/api/asset/all`, {
            method: 'POST',
            body: JSON.stringify({
              userId: localStorage.getItem(`userId`)
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Creating a post failed!');
            }
            return res.json();
        })
        .then(res => {
            console.log(`res`, res);
            this.props.onGetAll(res.assets);
        })
        .catch(error => {
            console.log(error.message);
        });
    };

    // pagination
    handleClick(e) {
      this.setState({
        currentPage: Number(e.target.id)
      });
    };

    // delete an asset user clicks
    deleteAssetHandler = assetId => {
      if (window.confirm('Are you sure you want to delete this item?')) {
        // this.setState({ assetLoading: true });
        fetch(`${process.env.REACT_APP_URL}/api/asset/` + assetId, {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + this.props.token
          }
        })
        .then(res => {
          if (res.status !== 200) {
            throw new Error('Deleting an asset failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(`resData`, resData);
          this.props.onGetAll(resData.assets);
          // this.setState({ assetLoading: false }); // rerender but not fire componentDidMount()
          // this.props.history.replace('./asset'); // rerender but not fire componentDidMount()
          // window.location.reload(); // not preferable
          // alert(resData.message);
        })
        .catch(err => {
          console.log(err);
          this.setState({ assetLoading: false });
          alert(err.message);
        });
      } else {
        console.log(`cancel`);
      }
    };

    render() {
      console.log(`render() this.props`, this.props);

      // pagination
      const currentPage = this.state.currentPage;
      const assetsPerPage = this.state.assetsPerPage;
      // Logic for displaying assets
      const indexOfLastAssets = currentPage * assetsPerPage;
      const indexOfFirstAssets = indexOfLastAssets - assetsPerPage;
      const currentAssets = this.props.allAssets.slice(indexOfFirstAssets, indexOfLastAssets);

      const assetsEl = currentAssets.map(asset => {
          let assetId = asset._id;
          console.log(`assetId`, assetId);

          return (
              <ul
              key={assetId}
              className={classes.Language}
              onClick={this.deleteAssetHandler.bind(this, assetId)}>
                <li>{asset.japanese}</li>
                <li>{asset.english}</li>
              </ul>
          );
      });

      // Logic for displaying page numbers
      const pageNumbers = [];
      for (let i = 1; i <= Math.ceil(this.props.allAssets.length / assetsPerPage); i++) {
        pageNumbers.push(i);
      }
      const pageNumbersEl = pageNumbers.map(number => {
          return (
            <li
              key={number}
              id={number}
              onClick={this.handleClick}
              className={this.state.currentPage === number ? classes.Active : ``}>{number}</li>
          );
      });

      return (
          <div className={classes.AssetContainer}>
            { assetsEl }
            <ul className={classes.PageNumbers}>{ pageNumbersEl }</ul>
          </div>
      );
    }
  };

  const mapStateToProps = state => {
    return {
        allAssets: state.asset.assets
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetAll: (res) => dispatch(actions.getAllAssetHandler(res))
    };
};

  export default connect(mapStateToProps, mapDispatchToProps)(Asset);