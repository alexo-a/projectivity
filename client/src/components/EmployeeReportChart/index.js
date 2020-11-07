//the structure of this code borrowed from:
//https://www.educative.io/edpresso/how-to-use-chartjs-to-create-charts-in-react
import React from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import EmployeeReport from '../../pages/EmployeeReport';

const state = {
    labels: ['January', 'February', 'March',
        'April', 'May'],
    datasets: [
        {
            label: 'Rainfall',
            backgroundColor: [
                '#B21F00',
                '#C9DE00',
                '#2FDE00',
                '#00A6B4',
                '#6800B4'
            ],
            hoverBackgroundColor: [
                '#501800',
                '#4B5000',
                '#175000',
                '#003350',
                '#35014F'
            ],
            data: [65, 59, 80, 81, 56]
        }
    ]
}

function EmployeeReportChart ({data}) {
    return (
        <div>
            <Pie
                data={data}
                options={{
                    title: {
                        display: true,
                        text: 'Average Rainfall per month',
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }}
            />
        </div>
    );
}

export default EmployeeReportChart;