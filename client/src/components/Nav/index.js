import React from 'react'
import logo from "../../assets/images/Projectivity.png";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faUserClock, faTasks, faGlobe, faChartPie, faUserCircle, faChevronDown, faUserCog, faDoorOpen, faHouseUser
} from '@fortawesome/free-solid-svg-icons'

function Nav() {
    const logout = event => {
        event.preventDefault();
        Auth.logout();
    };

    if (window.location.pathname === '/') {
        console.log('homepage')
    }
    
    return (
        <header className="navContainer">
            <div className="navBar">
                <a href="/" className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img show-sm-up"/><h1 className="logo-title show-md-up">Projectivity</h1></a>
                <nav>
                    <ul className="flex align-center">
                        <Link to="/"><li><FontAwesomeIcon icon={faHouseUser} className="navIcon" /><span className="show-sm-up">Dashboard</span></li></Link>
                        <Link to="/timesheet"><li>
                                    <FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-sm-up">Timesheet</span>
                        </li></Link>
                        <Link to="/groups">
                            <li>
                                <FontAwesomeIcon icon={faGlobe} className="navIcon" /><span className="show-sm-up"> Groups</span>
                            </li>
                        </Link>
                        <Link to="/projects"><li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-sm-up">Projects</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                        </li></Link>
                        <Link to="/reports"><li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-sm-up">Reports</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                        </li></Link>
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

