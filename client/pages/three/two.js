'use strict'

import React from 'react'

import { Cookies } from 'components/Helpers';


import {Header, Footer} from 'components/Layouts';


import { Alert } from 'react-bootstrap';



class Two extends React.Component {
  constructor(props) {
    super(props);
    this.state = {numbers: []}
  }

  componentDidMount() {

    let token = ""

    fetch(API + '/api/injson')
      .then(res => res.json())
      .then(numbers => this.setState({ numbers }))

    fetch(API + '/api/set_token')
      .then(res => res.json())
      .then(token => Cookies.SetToken(token))
      .then(
        console.log("token")
      )
      .then(
        token = Cookies.GetToken()
      )
      .then(



        fetch(API + '/api/get_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

          },
          body: JSON.stringify({
            token: token,
          })
        })
      )
  }

  render() {

    let token = Helpers.GetToken()

    function NumberList(props) {
      const numbers = props.numbers;
      const listItems = numbers.map((number) =>
        <li key={number.toString()}>
          {number}
        </li>
      );
      return (
        <ul>{listItems}</ul>
      );
    }

    //const numbers = [1, 2, 3, 4, 5];
    return (
      <div className="page_two">

        <Header pageName="Three -> Two" />


        <h1>Users</h1>
        <NumberList numbers={this.state.numbers} />,
        <div>token: {token}</div>

        Alert
        <Alert bsStyle="warning">
          <strong>Holy guacamole!</strong> Best check yo self, you're not looking too good.
        </Alert>

        <Footer />
      </div>
    );
  }
}

export default Two
