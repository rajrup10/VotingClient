import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

export default function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-rose-600">
      <div className="header">
        <Link to="/">
          <i className="fab fa-hive" /> Admin
        </Link>
      </div>
      <ul
        className="navbar-links"
        style={{ transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <Link to="/Verification" activeClassName="nav-active">
            Verification
          </Link>
        </li>
        <li>
          <Link to="/AddCandidate" activeClassName="nav-active">
            Add Candidate
          </Link>
        </li>
        <li>
          <Link to="/Registration" activeClassName="nav-active">
            <i className="far fa-registered" /> Registration
          </Link>
        </li>
        <li>
          <Link to="/Voting" activeClassName="nav-active">
            <i className="fas fa-vote-yea" /> Voting
          </Link>
        </li>
        <li>
          <Link to="/Results" activeClassName="nav-active">
            <i className="fas fa-poll-h" /> Results
          </Link>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
