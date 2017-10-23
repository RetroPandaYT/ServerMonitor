'use strict'

import React from 'react'

import Immutable from 'immutable'

import { Loading } from 'components/Partials';

import { Header, Footer } from 'components/Layouts';

import { Grid, Row, Col, FormGroup, FormControl, HelpBlock, Button, Checkbox } from 'react-bootstrap'

import Store from 'actions/Store';
import UserActions from 'actions/users/UserActions';

class Update extends React.Component {

  constructor () {

    super();

    //get user id from url
    let parts  = location.href.split('/')
    let id = parts[parts.length - 1]

    UserActions.initUser(
      {
        result: '',
        form: {
          formLabel: 'Update User',
          submitLabel: 'Update',
          id: id
        }
      }
    )

    UserActions.loadUser(id)

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

    UserActions.updateUser(this.state)

  }

  onChange(event){

    let value = event.target.value

    if(event.target.type == 'checkbox'){

      this.state = Store.getState()

      if(this.state.form[event.target.name] == 1){

        value = 0

      }

    }

    UserActions.updateUserInput(event.target.name, value)

  }

  render() {

    /*
    if (!this.state.loaded) {
      return (
        <Loading />
      )
    }
    */

    //can't set default values until values retrieved from database, this makes sure they are rendered ahead of time
    if (!this.state.form.username)
      return null;

    console.log('is')
    console.log(this.state.form.is_receiving)

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
                    defaultValue={this.state.form.username}
                  />

                  <FormControl
                    name="sms"
                    type="text"
                    placeholder="SMS"
                    onChange={this.onChange}
                    defaultValue={this.state.form.sms}
                  />

                  <FormControl
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={this.onChange}

                  />

                  <Checkbox
                    name="is_receiving"
                    value="1"
                    defaultChecked={this.state.form.is_receiving}
                    onChange={this.onChange}
                  >
                    Receive notifications
                  </Checkbox>

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
    );
  }
}

export default Update
