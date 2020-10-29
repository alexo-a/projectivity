import logo from "../../assets/images/Projectivity.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserClock, faTasks, faChartPie } from '@fortawesome/free-solid-svg-icons'

function Nav() { 
    return (
        <header className="navBar">
            <a href="#" className="flex align-center"><img src={logo} alt="Projectivity Logo"/><h1 className="show-md-up">Projectivity</h1></a>
            <nav>
                <ul className="flex align-center">
                    <li><FontAwesomeIcon icon={faUserClock} className="navIcon" /><span className="show-sm-up">Timesheet</span></li>
                    <li><FontAwesomeIcon icon={faTasks} className="navIcon" /><span className="show-sm-up">Projects</span></li>
                    <li><FontAwesomeIcon icon={faChartPie} className="navIcon" /><span className="show-sm-up">Reports</span></li>
                </ul>    
            </nav>            
        </header>
    );
};

export default Nav;

