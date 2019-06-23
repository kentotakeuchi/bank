import React, { Component } from 'react';

import classes from './Add.module.scss';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { required, length } from '../util/validators';


class Add extends Component {
  state = {
    addForm: {
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
      addLoading: false,
      error: null
    }
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.addForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.addForm,
        [input]: {
          ...prevState.addForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        addForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        addForm: {
          ...prevState.addForm,
          [input]: {
            ...prevState.addForm[input],
            touched: true
          }
        }
      };
    });
  };

  addFormHandler = (event, input) => {
    event.preventDefault();
    this.setState({ addLoading: true });
    fetch(`${process.env.REACT_APP_URL}/api/asset/add`, {
      method: 'POST',
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
          addLoading: false,
          error: err
        });
      });
  };

  clearFormHandler = () => {
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.addForm,
        [`japanese`]: {
          ...prevState.addForm[`japanese`],
          value: ``
        },
        [`english`]: {
          ...prevState.addForm[`english`],
          value: ``
        }
      };
      return {
        addForm: updatedForm,
        addLoading: false
      };
    });
  };

  render() {
    // console.log(`this.props`, this.props);

    return (
        <form
          onSubmit={e => this.addFormHandler(e, {
              japanese: this.state.addForm.japanese.value,
              english: this.state.addForm.english.value
            })
          }
          className={classes.Form}
          style={{marginBottom: `3rem`}}
        >
          <Input
            id="japanese"
            label="if"
            control="textarea"
            rows="10"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'japanese')}
            value={this.state.addForm['japanese'].value}
            valid={this.state.addForm['japanese'].valid}
            touched={this.state.addForm['japanese'].touched}
          />
          <Input
            id="english"
            label="then"
            control="textarea"
            rows="10"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'english')}
            value={this.state.addForm['english'].value}
            valid={this.state.addForm['english'].valid}
            touched={this.state.addForm['english'].touched}
          />
          <Button design="raised" type="submit" loading={this.state.addLoading}>
            ADD
          </Button>
        </form>
    );
  }
};

export default Add;
