import React from 'react'
import { Link } from "react-router"

const Header = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="text-2xl font-bold text-gradient"><span>RESUMIND</span></Link>
      <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
    </nav>
  )
}

export default Header