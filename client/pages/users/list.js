'use strict'

import React from 'react'

import Immutable from 'immutable'

import { Loading, Modal } from 'components/Partials'

import { Header, Footer } from 'components/Layouts'

import { Grid, Row, Col, HelpBlock, Table, Button } from 'react-bootstrap'

import Store from 'actions/Store'
import UserActions from 'actions/users/UserActions'

class List extends React.Component {
  constructor () {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.openDeleteUserModal = this.openDeleteUserModal.bind(this);
    this.closeDeleteUserModal = this.closeDeleteUserModal.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    UserActions.initUser(
      {
        result: '',
        form: {
          formLabel: 'List Users'
        },
        users: [],
        modalOpen: false,
        deleteId: 0

      }
    )

    UserActions.loadUsers()

    this.state = Store.getState()

  }

  componentDidMount () {

    Store.addChangeListener(this.handleChange);

  }

  componentWillUnmount() {

    Store.removeChangeListener(this.handleChange)

   }

  handleChange () {
    this.setState(Store.getState())

  }

  handleClick (event) {

    event.preventDefault()

    this.props.history.push(event.target.dataset.href);

  }

  openDeleteUserModal (event) {

    event.preventDefault()

    const id = event.target.dataset.id

    this.state = Store.getState()

    UserActions.initUser(
      {
        modalOpen: !this.state.modalOpen,
        deleteId: id
      }
    )

  }

  closeDeleteUserModal () {

    this.state = Store.getState()

    UserActions.initUser(
      {
        modalOpen: !this.state.modalOpen,
        deleteId: 0
      }
    )

  }

  deleteUser (event) {

    event.preventDefault()

    const id = event.target.dataset.id

    this.state = Store.getState()

    UserActions.deleteUser(id, this.state)

    this.closeDeleteUserModal()

  }

  renderUsers () {

    let output = []

    const list = Immutable.fromJS(this.state.users)

    const TableRow = (props) => {

      const href = "/users/update/" + props.id

      return <tr><td><a href="#" data-href={href} onClick={this.handleClick}>{props.username}</a></td><td><Button bsSize="xsmall" bsStyle="danger" onClick={this.openDeleteUserModal} data-id={props.id}>del</Button></td></tr>

    }

    let key = 0
    let username = ''

    list.map( (v, k) => {

      key = v.get("id")
      username = v.get("username")

      output.push(<TableRow username={username} id={key}  key={key}/>)

    })

    return output


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

      <div className="user-list">

        <Header history={this.props.history} />

        <Grid>

          <Row className="show-grid">
            <Col xs={6} xsOffset={1}>

              <div className="form-header">{this.state.form.formLabel}</div>

              <Table striped bordered condensed hover>
                <tbody>

                  {this.renderUsers()}

                </tbody>
              </Table>

              <HelpBlock>{this.state.result}</HelpBlock>

            </Col>
          </Row>

        </Grid>

        <Footer />

        <Modal show={this.state.modalOpen}
          onClose={this.closeDeleteUserModal}
          onAction={this.deleteUser}
          id={this.state.deleteId}
          actionLabel="Delete"
          modalHeading="Delete User"
        >
          Are you sure you want to delete this record?
        </Modal>

      </div>

    );
  }
}

export default List
