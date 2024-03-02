import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const[open,setOpen]=useState(false);
  return (
    <nav className='bg-rose-700'>
      <Link to="/" className="header">
        <i className="fab fa-hive"></i> Home
      </Link>
      <ul
        className="navbar-links"
        style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
      >
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
  )
}

export default Navbar