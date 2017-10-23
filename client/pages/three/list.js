'use strict'

import React from 'react'

import { Loading } from 'components/Partials'

import { Header, Footer } from 'components/Layouts'

import { Grid, Row, Col, Clearfix, Form, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'

import UserStores from 'actions/Store'
import UserActions from 'actions/users/UserActions'

class List extends React.Component {
  constructor () {
    super();
    this.state = UserStores.getState();
    this.handleChange = this.handleChange.bind(this);

  }

  componentDidMount () {
    UserStores.addChangeListener(this.handleChange);
    UserActions.loadUsers()

  }

  handleChange () {
    this.setState(UserStores.getState())
  }

  renderUsers () {

    const ListItem = (props) => {
      return <li>Key: { props.id } Value: { props.value }</li>;
    }

    let output = []

    this.state.users.map( (v, k) => {

      v.map( (v1, k1) => {

        output.push(<ListItem key={k1} id={k1} value={v1}/>)

      })

    })

    return output


  }

  render() {

    if (!this.state.loaded) {
      return (
        <Loading />
      )
    }

    return (
      <div className="user-list">

        <Header />


        <h1>User List something?</h1>

        <div>
          <ul>{this.renderUsers()}</ul>
        </div>

        <Footer />
      </div>
    );
  }
}

export default List
