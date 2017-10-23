'use strict'

import React from 'react'

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem
} from 'react-bootstrap';

class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    this.handleClick = this.handleClick.bind(this)

  }

  handleClick (event) {

    event.preventDefault()

    this.props.history.push(event.target.dataset.href);

  }

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#" data-href="/" onClick={this.handleClick}>Server Monitor</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem href="#" data-href="/monitor/list" onClick={this.handleClick}>Monitor</NavItem>
            <NavDropdown title="Users" id="nav-dropdown">
              <MenuItem href="#" data-href="/users/list" onClick={this.handleClick}>List</MenuItem>
              <MenuItem href="#" data-href="/users/create" onClick={this.handleClick}>Create</MenuItem>
              <MenuItem href="#" data-href="/users/read" onClick={this.handleClick}>Read</MenuItem>
              <MenuItem href="#" data-href="/users/update" onClick={this.handleClick}>Update</MenuItem>
              <MenuItem divider />
              <MenuItem href="#" data-href="/users/delete" onClick={this.handleClick}>Delete</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem href="#" data-href="/users/login" onClick={this.handleClick}>Log In</NavItem>
            <NavItem href="#" data-href="/users/logout" onClick={this.handleClick}>Log Out</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Navigation

/*
  render() {
    return (
        <Nav bsStyle="tabs" activeKey="1" onSelect={this.handleSelect}>
          <NavItem eventKey="1" href="/monitor">Monitor</NavItem>
          <NavDropdown eventKey="2" title="Users" id="nav-dropdown">
            <MenuItem eventKey="2.1">Create</MenuItem>
            <MenuItem eventKey="2.2">Read</MenuItem>
            <MenuItem eventKey="2.3">Update</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey="2.4">Delete</MenuItem>
          </NavDropdown>
          <NavItem eventKey="1" href="/users/login">Log In</NavItem>
          <NavItem eventKey="1" href="/users/logout">Log Out</NavItem>
        </Nav>

    )
  }
}


export default Navigation
*/
