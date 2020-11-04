import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Project } from '../../../../../server/models'
import EmployeeReportTask from "../Task"

function EmployeeReportProject(project) {
    const {
        title,
        tasks
    }=project

    return (

        <Row className="py-2 border-bottom border-dark">
            <Col xs={3} className="my-auto">
                {title}
            </Col>
            <Col xs={9}>
                {tasks.map(task => (
                    <EmployeeReportTask 
                        task={task}
                    />
                ))}
                
            </Col>
        </Row>  
        )
}

export default EmployeeReportProject;