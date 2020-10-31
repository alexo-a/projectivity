import React from 'react'
import logo from "../../assets/images/Projectivity.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserClock, faTasks, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";

function Nav() { 
    return (
        <header className="navBar">
            <a href="/" className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img"/><h1 className="logo-title show-md-up">Projectivity</h1></a>
            <nav>
                <ul className="flex align-center">
                    <Link to="/"><li><FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-sm-up">Timesheet</span></li></Link>
                    <Link to="/projects"><li><FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-sm-up">Projects</span></li></Link>
                    <Link to="/reports"><li><FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-sm-up">Reports</span></li></Link>
                </ul>    
            </nav>            
        </header>
    );
};

export default Nav;

