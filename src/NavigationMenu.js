import { faHistory, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

const NavigationMenu = () => {
    return (
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
    );
};

export default NavigationMenu;
