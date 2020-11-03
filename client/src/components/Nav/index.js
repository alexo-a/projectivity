import React, { useState } from 'react';
import logo from "../../assets/images/Projectivity.png";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserClock, faTasks, faChartPie, faUserCircle, faChevronDown, faUserCog, faDoorOpen, faHouseUser
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_MY_PROJECTS } from '../../utils/queries';

function Nav() {
    const logout = event => {
        event.preventDefault();
        Auth.logout();
    };

    const [locationState, setLocationState] = useState({ home: false, timesheet: false, projects: false, reports: false });

    const { loading, data } = useQuery(QUERY_MY_PROJECTS);

    const projects = data?.myProjects || {};

    if (loading) {
        return (
            <></>
        )
    }

    return (
        <header className="navContainer">
            <div className="navBar">
                <a href="/" className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img show-sm-up"/><h1 className="logo-title show-lg-up">Projectivity</h1></a>
                <nav>
                    <ul className="flex align-center">
                        <Link to="/" onClick><li><FontAwesomeIcon icon={faHouseUser} className="navIcon" /><span className="show-md-up">Dashboard</span></li></Link>
                        <Link to="/timesheet"><li>
                                    <FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-md-up">Timesheet</span>
                        </li></Link>
                        <Link to="/projects"><li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-md-up">Projects</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                                <div className="dropdownContainer">
                                    <div className="dropdownModal">
                                    <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.administrator.map(project => ( 
                                            <div className="dropdownTitleGroup" key={project._id}>
                                                <p className="dropdownItemTitle">{project.title}</p><strong>administrator</strong> 
                                            </div>                                                                                 
                                        ))}
                                        </div>
                                        <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.manager.map(project => (
                                            <div className="dropdownTitleGroup">
                                                <p className="dropdownItemTitle">{project.title}</p><strong>manager</strong> 
                                            </div>                                                                                     
                                        ))}
                                        </div>
                                        <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.employee.map(project => (
                                            <div className="dropdownTitleGroup">
                                                <p className="dropdownItemTitle">{project.title}</p>{ project === projects.employee[0] && <strong>employee</strong>} 
                                            </div>                                                                                    
                                        ))}
                                        </div>                                       
                                    </div>
                                </div>
                        </li></Link>
                        <Link to="/reports"><li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-md-up">Reports</span>
                                    <div className="dropdownContainer">
                                        <div className="dropdownModal">
                                            <div className="dropdownGroup">
                                            {projects && 
                                            projects.manager.map(project => (
                                                <div className="dropdownTitleGroup">
                                                    <p className="dropdownItemTitle">{project.title}</p> 
                                                </div>                                                                                     
                                            ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                        </li></Link>
                    </ul>    
                </nav>  
            </div> 
                    
            <div className="navBar">
                <div className="userNavGroup">
                    <FontAwesomeIcon icon={faUserCircle} className="userIcon" /><FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                    <div className="dropdownContainer right">
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

