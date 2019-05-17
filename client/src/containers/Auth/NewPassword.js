import React, { Component } from 'react';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { required, length } from '../util/validators';
import Auth from './Auth';

class NewPassword extends Component {
  state = {
    newPasswordForm: {
      password: {
        value: '',
        valid: false,
        touched: false,
        validators: [required, length({ min: 5 })]
      },
      formIsValid: false
    }
  };

  inputChangeHandler = (input, value) => {
    this.setState(prevState => {
      let isValid = true;
      for (const validator of prevState.newPasswordForm[input].validators) {
        isValid = isValid && validator(value);
      }
      const updatedForm = {
        ...prevState.newPasswordForm,
        [input]: {
          ...prevState.newPasswordForm[input],
          valid: isValid,
          value: value
        }
      };
      let formIsValid = true;
      for (const inputName in updatedForm) {
        formIsValid = formIsValid && updatedForm[inputName].valid;
      }
      return {
        newPasswordForm: updatedForm,
        formIsValid: formIsValid
      };
    });
  };

  inputBlurHandler = input => {
    this.setState(prevState => {
      return {
        newPasswordForm: {
          ...prevState.newPasswordForm,
          [input]: {
            ...prevState.newPasswordForm[input],
            touched: true
          }
        }
      };
    });
  };

  render() {
    console.log(`this.props`, this.props);

    return (
      <Auth>
        <form
          onSubmit={e =>
            this.props.onResetPassword(e, {
              password: this.state.newPasswordForm.password.value,
              passwordToken: this.props.match.params.token
            })
          }
        >
          <Input
            id="password"
            label="Password"
            type="password"
            control="input"
            onChange={this.inputChangeHandler}
            onBlur={this.inputBlurHandler.bind(this, 'password')}
            value={this.state.newPasswordForm['password'].value}
            valid={this.state.newPasswordForm['password'].valid}
            touched={this.state.newPasswordForm['password'].touched}
          />
          <Button design="raised" type="submit" loading={this.props.loading}>
            Update Password
          </Button>
        </form>
      </Auth>
    );
  }
}

export default NewPassword;
