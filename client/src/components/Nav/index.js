import React from 'react'
import logo from "../../assets/images/Projectivity.png";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faUserClock, faTasks, faChartPie, 
    faUserCircle, faChevronDown, faUserCog,
    faDoorOpen
} from '@fortawesome/free-solid-svg-icons'

function Nav() {
    const logout = event => {
        event.preventDefault();
        Auth.logout();
    };
    
    return (
        <header className="navContainer">
            <div className="navBar">
                <a href="/" className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img"/><h1 className="logo-title show-md-up">Projectivity</h1></a>
                <nav>
                    <ul className="flex align-center">
                        <Link to="/"><li><FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-sm-up">Timesheet</span></li></Link>
                        <Link to="/projects"><li><FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-sm-up">Projects</span></li></Link>
                        <Link to="/reports"><li><FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-sm-up">Reports</span></li></Link>
                    </ul>    
                </nav>  
            </div> 
                
            <div className="navBar">
                <div className="userNavGroup">
                    <FontAwesomeIcon icon={faUserCircle} className="userIcon" /><FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                    <div className="dropdownContainer">
                        <div className="dropdownModal">
                            <div className="dropdownItem"><FontAwesomeIcon icon={faUserCog} className="dropdownIcon" /><p className="dropdownItemTitle">User Settings</p></div>
                            <div className="dropdownItem" onClick={logout}><FontAwesomeIcon icon={faDoorOpen} className="dropdownIcon" /><p className="dropdownItemTitle">Log Out</p></div>
                        </div>
                    </div>
                </div>
            </div>         
        </header>
    );
};

export default Nav;

