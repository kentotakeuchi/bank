import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Asset.module.scss';
import * as actions from '../../store/actions/index';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { required, length } from '../util/validators';


class Asset extends Component {
    state = {
      assetForm: {
        japanese: {
          value: '',
          valid: false,
          touched: false,
          validators: [required, length({ min: 1 })]
        },
        english: {
          value: '',
          valid: false,
          touched: false,
          validators: [required, length({ min: 1 })]
        },
        formIsValid: false,
        assetLoading: false,
        error: null
      }
    };

    componentDidMount() {
        this.setState({ assetLoading: true });
        fetch(`${process.env.REACT_APP_URL}/api/asset/all`, {
            method: 'GET',
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
            this.setState({
                assetLoading: false
            });
        })
        .catch(error => {
            console.log(error.message);
            this.setState({
                assetLoading: false,
                error: error
            });
        });
    };

    inputChangeHandler = (input, value) => {
      this.setState(prevState => {
        let isValid = true;
        for (const validator of prevState.assetForm[input].validators) {
          isValid = isValid && validator(value);
        }
        const updatedForm = {
          ...prevState.assetForm,
          [input]: {
            ...prevState.assetForm[input],
            valid: isValid,
            value: value
          }
        };
        let formIsValid = true;
        for (const inputName in updatedForm) {
          formIsValid = formIsValid && updatedForm[inputName].valid;
        }
        return {
          assetForm: updatedForm,
          formIsValid: formIsValid
        };
      });
    };

    inputBlurHandler = input => {
      this.setState(prevState => {
        return {
          assetForm: {
            ...prevState.assetForm,
            [input]: {
              ...prevState.assetForm[input],
              touched: true
            }
          }
        };
      });
    };

    assetFormHandler = (e, input, assetId) => {
      console.log(`e.target`, e.target);

      e.preventDefault();
      this.setState({ assetLoading: true });
      fetch(`${process.env.REACT_APP_URL}/api/asset/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token
        },
        body: JSON.stringify({
          japanese: input.japanese,
          english: input.english
        })
      })
        .then(res => {
          if (res.status !== 201) {
              throw new Error('Creating a post failed!');
          }
          return res.json();
        })
        .then(resData => {
          console.log(`resData`, resData);
          this.clearFormHandler();
        })
        .catch(err => {
          console.log(err);
          this.setState({
            assetLoading: false,
            error: err
          });
        });
    };

    clearFormHandler = () => {
      this.setState(prevState => {
        const updatedForm = {
          ...prevState.assetForm,
          [`japanese`]: {
            ...prevState.assetForm[`japanese`],
            value: ``
          },
          [`english`]: {
            ...prevState.assetForm[`english`],
            value: ``
          }
        };
        return {
          assetForm: updatedForm,
          assetLoading: false
        };
      });
    };

    render() {
      console.log(`this.props`, this.props);

      const assetsEl = this.props.allAssets.map(asset => {
          return (
              <form key={asset._id}>
                <Input
                    id={asset._id}
                    label="JAPANESE"
                    type="japanese"
                    control="input"
                    onChange={this.inputChangeHandler}
                    // onChange={e => this.setState({ [asset.japanese]: e.target.value })}
                    onBlur={this.inputBlurHandler.bind(this, 'japanese')}
                    value={this.state.assetForm['japanese'].value}
                    valid={this.state.assetForm['japanese'].valid}
                    touched={this.state.assetForm['japanese'].touched}
                />
                <Input
                    id={asset._id}
                    label="ENGLISH"
                    type="english"
                    control="input"
                    onChange={this.inputChangeHandler}
                    onBlur={this.inputBlurHandler.bind(this, 'english')}
                    value={this.state.assetForm['english'].value}
                    valid={this.state.assetForm['english'].valid}
                    touched={this.state.assetForm['english'].touched}
                />
                <Button
                    design="raised"
                    type="button"
                    loading={this.state.assetLoading}
                    onClick={e => this.assetFormHandler(e, {
                        japanese: this.state.assetForm.japanese.value,
                        english: this.state.assetForm.english.value
                    },
                    asset._id)
                }>
                    edit
                </Button>
              </form>
          )
      })

      return (
          <div
            className={classes.Form}
            style={{marginBottom: `1rem`}}
          >
            { assetsEl }
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