import React, { Component } from 'react';

import classes from './Home.module.scss';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import { required, length } from '../util/validators';


class Home extends Component {
    state = {
        editForm: {
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
          error: null,
          assetId: '',
        },
        showCheckButton: false,
        showEnglish: false,
        showEditButton: false,
        isDisabled: true
    };

    inputChangeHandler = (input, value) => {
        this.setState(prevState => {
          let isValid = true;
          for (const validator of prevState.editForm[input].validators) {
            isValid = isValid && validator(value);
          }
          const updatedForm = {
            ...prevState.editForm,
            [input]: {
              ...prevState.editForm[input],
              valid: isValid,
              value: value
            }
          };
          let formIsValid = true;
          for (const inputName in updatedForm) {
            formIsValid = formIsValid && updatedForm[inputName].valid;
          }
          return {
            editForm: updatedForm,
            formIsValid: formIsValid
          };
        });
    };

    inputBlurHandler = input => {
        this.setState(prevState => {
            return {
                editForm: {
                    ...prevState.editForm,
                    [input]: {
                    ...prevState.editForm[input],
                    touched: true
                    }
                }
            };
        });
    };

    editFormHandler = (event, input) => {
        console.log(`input.assetId`, input.assetId);
        console.log(`input`, input);

        event.preventDefault();
        this.setState({ addLoading: true });
        fetch(`${process.env.REACT_APP_URL}/api/asset/${input.assetId}`, {
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
            if (res.status !== 200) {
                throw new Error('Updating a post failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(`resData`, resData);
            this.clearFormHandler();
            this.setState({
                addLoading: false,
                showEnglish: false,
                showEditButton: false,
                isDisabled: true
            });
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
            ...prevState.editForm,
            [`japanese`]: {
                ...prevState.editForm[`japanese`],
                value: ``
            },
            [`english`]: {
                ...prevState.editForm[`english`],
                value: ``
            }
            };
            return {
            editForm: updatedForm,
            addLoading: false
            };
        });
    };

    getRandomAssetHandler = (event) => {
        event.preventDefault();
        this.setState({ addLoading: true });
        fetch(`${process.env.REACT_APP_URL}/api/asset/random-one`, {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.props.token
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Fetching a asset failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(`resData`, resData);
            this.setState(prevState => {
                const updatedForm = {
                    ...prevState.editForm,
                    [`japanese`]: {
                      ...prevState.editForm[`japanese`],
                      value: resData.randomAsset.japanese
                    },
                    [`english`]: {
                      ...prevState.editForm[`english`],
                      value: resData.randomAsset.english
                    },
                    assetId: resData.randomAsset._id
                };
                return {
                    editForm: updatedForm,
                    addLoading: false
                };
            });
            this.setState(prevState => {
                return {
                    showCheckButton: true,
                    showEnglish: false,
                    showEditButton: false,
                    isDisabled: true
                }
            });
        })
        .catch(err => {
            console.log(err);
            this.setState({
                addLoading: false,
                error: err
            });
        });
    };

    render() {
        return(
            <form
                onSubmit={e => this.editFormHandler(e, {
                    japanese: this.state.editForm.japanese.value,
                    english: this.state.editForm.english.value,
                    assetId: this.state.editForm.assetId
                    })
                }
                className={classes.Form}
                style={{marginBottom: `1rem`}}
                >
                <Input
                    id="japanese"
                    label="JAPANESE"
                    type="japanese"
                    control="textarea"
                    rows="10"
                    onChange={this.inputChangeHandler}
                    onBlur={this.inputBlurHandler.bind(this, 'japanese')}
                    value={this.state.editForm['japanese'].value}
                    valid={this.state.editForm['japanese'].valid}
                    touched={this.state.editForm['japanese'].touched}
                    isDisabled={this.state.isDisabled}
                />
                {this.state.showEnglish ? <Input
                    id="english"
                    label="ENGLISH"
                    type="english"
                    control="textarea"
                    rows="10"
                    onChange={this.inputChangeHandler}
                    onBlur={this.inputBlurHandler.bind(this, 'english')}
                    value={this.state.editForm['english'].value}
                    valid={this.state.editForm['english'].valid}
                    touched={this.state.editForm['english'].touched}
                /> : null}
                <Button
                    design="raised"
                    type="submit"
                    loading={this.state.addLoading}
                    onClick={this.getRandomAssetHandler}>
                        GET
                </Button>
                {this.state.showCheckButton ? <Button
                    design="raised"
                    // type="submit"
                    // loading={this.state.addLoading}
                    onClick={() => this.setState({
                            showEnglish: true,
                            showCheckButton: false,
                            showEditButton: true,
                            isDisabled: false
                        })
                    }>
                        CHECK
                </Button> : null}
                {this.state.showEditButton ? <Button
                    design="raised"
                    type="submit"
                    loading={this.state.addLoading}>
                        EDIT
                </Button> : null}
            </form>
        );
    }
};

export default Home;