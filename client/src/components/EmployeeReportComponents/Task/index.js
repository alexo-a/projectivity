import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
//TODO get task info


function EmployeeReportTask(task){
    return (
    <Row>
        <Col xs={8}>
            {task.title}
        </Col>
        <Col xs={4} className="text-center my-auto">
            {task.hours}
        </Col>
    </Row>
)

}

export default EmployeeReportTask;