import React from 'react'
import { Link } from "react-router"

const Header = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="md:text-2xl font-bold text-gradient text-md"><span>RESUMIND</span></Link>
      <div className="btnGroup">
        <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
      </div>
    </nav>
  )
}

export default Header