import React from 'react';
import logo from "../../assets/images/Projectivity.png";
import { Link } from "react-router-dom";
import Auth from "../../utils/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserClock, faTasks, faGlobe, faChartPie, faUserCircle, faChevronDown, faUserCog, faDoorOpen, faHouseUser, faUser
} from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_MY_PROJECTS } from '../../utils/queries';

function Nav() {
    const logout = event => {
        event.preventDefault();
        Auth.logout();
    };

    const { loading, data } = useQuery(QUERY_MY_PROJECTS);

    const projects = data?.myProjects || {};
    const me = data?.me || {};

    if (loading) {
        return (
            <></>
        )
    }

    return (
        <header className="navContainer">
            <div className="navBar">
                <a href="/" className="flex align-center"><img src={logo} alt="Projectivity Logo" className="logo-img show-sm-up"/><h1 className="logo-title show-xl-up">Projectivity</h1></a>
                <nav>
                    <ul className="flex align-center">
                        <Link to="/"><li><FontAwesomeIcon icon={faHouseUser} className="navIcon" /><span className="show-lg-up">Dashboard</span></li></Link>
                        <Link to="/timesheet"><li>
                                    <FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-lg-up">Timesheet</span>
                        </li></Link>
                        <Link to="/groups">
                            <li>
                                <FontAwesomeIcon icon={faGlobe} className="navIcon" /><span className="show-lg-up"> Groups</span>
                            </li>
                        </Link>
                        <Link to="/projects"><li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-lg-up">Projects</span>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                                <div className="dropdownContainer">
                                    <div className="dropdownModal">
                                    <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.administrator.map(project => ( 
                                            <Link to={`/projects/${project._id}/${me._id}`} key={project._id}>
                                                <div className="dropdownTitleGroup">
                                                    <p className="dropdownItemTitle">{project.title}</p>{ project === projects.administrator[0] && <strong>administrator</strong>}
                                                </div>
                                            </Link>                                                                                 
                                        ))}
                                        </div>
                                        <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.manager.map(project => (
                                            <Link to={`/projects/${project._id}/${me._id}`} key={project._id}>
                                                <div className="dropdownTitleGroup">
                                                    <p className="dropdownItemTitle">{project.title}</p>{ project === projects.manager[0] && <strong>manager</strong>}  
                                                </div>
                                            </Link>                                                                                       
                                        ))}
                                        </div>
                                        <div className="dropdownGroup"> 
                                        {projects && 
                                        projects.employee.map(project => (
                                            <Link to={`/projects/${project._id}/${me._id}`} key={project._id}>
                                                <div className="dropdownTitleGroup">
                                                    <p className="dropdownItemTitle">{project.title}</p>{ project === projects.employee[0] && <strong>employee</strong>} 
                                                </div>
                                            </Link>                                                                                     
                                        ))}
                                        </div>
                                    </div>
                                </div>
                        </li></Link>
                       <li className="navGroup">
                                <div className="flex align-center">
                                    <FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-lg-up">Reports</span>
                                    <div className="dropdownContainer">
                                        <div className="dropdownModal">
                                            <div className="dropdownGroup">
                                                <Link to="/reports">
                                                    <div className="dropdownTitleGroup userReportLink">
                                                        <FontAwesomeIcon icon={faUser} className="dropdownIcon"></FontAwesomeIcon><p className="dropdownItemTitle">&nbsp;&nbsp;&nbsp;{me.username}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="dropdownGroup">
                                            {projects && 
                                            projects.administrator.map(project => (
                                                <Link to={`/reports/${project._id}`} key={project._id}>
                                                    <div className="dropdownTitleGroup">
                                                        <p className="dropdownItemTitle">{project.title}</p> 
                                                    </div>
                                                </Link>                                                                                     
                                            ))}
                                            {projects && 
                                            projects.manager.map(project => (
                                                <Link to={`/reports/${project._id}`} key={project._id}>
                                                    <div className="dropdownTitleGroup">
                                                        <p className="dropdownItemTitle">{project.title}</p> 
                                                    </div>
                                                </Link>                                                                                     
                                            ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <FontAwesomeIcon icon={faChevronDown} className="navChevron" />
                        </li>
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

