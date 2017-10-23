'use strict'

import React from 'react'

import Immutable from 'immutable'

import { Loading, Modal, ResolveModal } from 'components/Partials'

import { Header, Footer } from 'components/Layouts'

import { Grid, Row, Col, HelpBlock, Table, Button, Pagination } from 'react-bootstrap'

import Store from 'actions/Store'
import Actions from 'actions/monitor/MonitorActions'

class List extends React.Component {
  constructor () {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.delete = this.delete.bind(this);

    this.openResolveModal = this.openResolveModal.bind(this);
    this.closeResolveModal = this.closeResolveModal.bind(this);
    this.resolve = this.resolve.bind(this);

    this.handlePage = this.handlePage.bind(this);

    Actions.init(
      {
        result: '',
        form: {
          formLabel: 'List Notices'
        },
        list: [],
        deleteModalOpen: false,
        deleteId: 0,
        resolveModalOpen: false,
        resolveId: 0,
        resolveText: 'resolve',
        resolved: 0,
        activePage: 1,
        pageCount: 1,

      }
    )

    Actions.list(1)

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

  openDeleteModal (event) {

    event.preventDefault()

    const id = event.target.dataset.id

    this.state = Store.getState()

    Actions.init(
      {
        deleteModalOpen: !this.state.deleteModalOpen,
        deleteId: id
      }
    )

  }

  closeDeleteModal () {

    this.state = Store.getState()

    Actions.init(
      {
        deleteModalOpen: !this.state.deleteModalOpen,
        deleteId: 0
      }
    )

  }

  delete (event) {

    event.preventDefault()

    const id = event.target.dataset.id

    this.state = Store.getState()

    console.log(id)

    Actions.delete(id, this.state)

    this.closeDeleteModal()

  }

  openResolveModal (event) {

    event.preventDefault()

    const id = event.target.dataset.id

    let resolveText = 'resolve'

    const resolved = event.target.dataset.resolved



    if(resolved){
      resolveText = 'unresolve'
    }

    this.state = Store.getState()

    Actions.init(
      {
        resolveModalOpen: !this.state.resolveModalOpen,
        resolveId: id,
        resolveText: resolveText,
        resolved: resolved
      }
    )

  }

  closeResolveModal () {

    this.state = Store.getState()

    Actions.init(
      {
        resolveModalOpen: !this.state.resolveModalOpen,
        resolveId: 0
      }
    )

  }

  resolve (event) {

    event.preventDefault()

    const id = event.target.dataset.id
    const resolved = event.target.dataset.resolved

    console.log(event.target.dataset)

    this.state = Store.getState()

    Actions.resolve(id, resolved, this.state)

    this.closeResolveModal()

  }

  handlePage (event) {

    Actions.list(event)

  }

  renderList () {

    let output = []

    const list = Immutable.fromJS(this.state.list)

    console.log('list')
    console.log(this.state.list)

    const TableRow = (props) => {

      let resolveStyle = 'primary'

      if(!props.isResolved){
        resolveStyle = 'success'
      }

      return <tr>
        <td>
          {props.server}
        </td>
        <td>
          {props.name}
        </td>
        <td>
          {props.msg}
        </td>
        <td>
          {props.sentCnt}
        </td>
        <td>
          {props.isResolved}
        </td>
        <td>
          <Button bsSize="xsmall" bsStyle={resolveStyle} onClick={this.openResolveModal} data-id={props.id} data-resolved={props.isResolved}>
            resolve
          </Button>
        </td>
        <td>
          <Button bsSize="xsmall" bsStyle="danger" onClick={this.openDeleteModal} data-id={props.id}>
            del
          </Button>
        </td>
      </tr>

    }

    let key = 0
    let name = ''
    let server = ''
    let msg = ''
    let is_resolved = 0
    let sent_cnt = 0

    list.map( (v, k) => {

      key = v.get("id")
      name = v.get("name")
      server = v.get("server")
      msg = v.get("msg")
      is_resolved = v.get("is_resolved")
      sent_cnt = v.get("sent_cnt")

      output.push(
        <TableRow
          key={key}
          id={key}
          name={name}
          server={server}
          msg={msg}
          isResolved={is_resolved}
          sentCnt={sent_cnt}

        />

    )

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
                <thead>
                  <tr>
                    <th>
                      Server
                    </th>
                    <th>
                      Name
                    </th>
                    <th>
                      Message
                    </th>
                    <th>
                      Sent Count
                    </th>
                    <th>
                      Resolved
                    </th>
                  </tr>
                </thead>
                <tbody>

                  {this.renderList()}

                </tbody>
              </Table>

              <HelpBlock>{this.state.result}</HelpBlock>

              <Pagination
                bsSize="small"
                items={this.state.pageCount}
                activePage={this.state.activePage}
                onSelect={this.handlePage} />

            </Col>
          </Row>

        </Grid>

        <Footer />

        <Modal show={this.state.deleteModalOpen}
          onClose={this.closeDeleteModal}
          onAction={this.delete}
          id={this.state.deleteId}
          actionLabel="Delete"
          modalHeading="Delete Monitor"
        >
          Are you sure you want to delete this notice?
        </Modal>

        <ResolveModal show={this.state.resolveModalOpen}
          onClose={this.closeResolveModal}
          onAction={this.resolve}
          id={this.state.resolveId}
          resolved={this.state.resolved}
          actionLabel={this.state.resolveText}
          modalHeading={this.state.resolveText + " Monitor"}
        >

          Are you sure you want to {this.state.resolveText} this notice?

        </ResolveModal>

      </div>

    );
  }
}

export default List
