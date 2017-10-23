'use strict'

import React from 'react'

import Immutable from 'immutable'

import { Loading } from 'components/Partials';

import { Header, Footer } from 'components/Layouts';

import { Grid, Row, Col, FormGroup, FormControl, HelpBlock, Button } from 'react-bootstrap'

import Store from 'actions/Store';
import UserActions from 'actions/users/UserActions';

class Login extends React.Component {

  constructor () {
    super();

    UserActions.initUser(
      {
        form: {
          formLabel: 'Login User',
          submitLabel: 'Login'
        },
        result: ''
      }
    )

    this.state = Store.getState()

    this.handleChange = this.handleChange.bind(this)

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)

  }

  componentWillMount () {

    if(this.props.location.state){
      UserActions.initUser(
        {
          result: this.props.location.state.result
        }
      )

      this.state = Store.getState()
    }

  }

  componentDidMount () {

    Store.addChangeListener(this.handleChange)
  }

  componentWillUnmount() {

    Store.removeChangeListener(this.handleChange)

   }

  handleChange () {
    this.setState(Store.getState())
  }

  onSubmit(event){

    event.preventDefault()

    this.state = Store.getState()

    UserActions.loginUser(this.state, this.props.history)

  }

  onChange(event){

    UserActions.updateUserInput(event.target.name, event.target.value)

  }

  render() {

    /*
    if (!this.state.loaded) {
      return (
        <Loading />
      )
    }
    */

    return (
      <div className="user-create">

        <Header history={this.props.history} />

        <Grid>

          <Row className="show-grid">
            <Col xs={6} xsOffset={1}>

              <div className="form-header">{this.state.form.formLabel}</div>

              <form onSubmit={this.onSubmit}>
                <FormGroup>

                  <FormControl
                    name="username"
                    type="text"
                    placeholder="Email"
                    onChange={this.onChange}
                  />

                  <FormControl
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}
                  />

                </FormGroup>

                <FormGroup>

                  <Button type="submit">{this.state.form.submitLabel}</Button>

                  <HelpBlock>{this.state.result}</HelpBlock>
                </FormGroup>
              </form>

            </Col>
          </Row>

        </Grid>

        <Footer />

      </div>
    )
  }
}

export default Login
