import { faHistory, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav, NavItem, NavLink, Navbar } from "reactstrap";

const NavigationMenu = ({ user, signoutHandler }) => {
    return (
        <Navbar>
            <Nav>
                <NavItem>
                    <NavLink active href="/">
                        <FontAwesomeIcon icon={faHome} /> Home
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="/old-movies">
                        <FontAwesomeIcon icon={faHistory} /> Watch History
                    </NavLink>
                </NavItem>
            </Nav>

            {user ? (
                <Nav className="ml-auto">
                    <NavItem>
                        <NavLink>{user.username}</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={signoutHandler}>Signout</NavLink>
                    </NavItem>
                </Nav>
            ) : (
                <Nav className="ml-auto">
                    <NavItem>
                        <NavLink href="/signup">Signup</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/signin">Signin</NavLink>
                    </NavItem>
                </Nav>
            )}
        </Navbar>
    );
};

export default NavigationMenu;
