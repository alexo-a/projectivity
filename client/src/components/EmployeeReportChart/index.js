//the structure of this code borrowed from:
//https://www.educative.io/edpresso/how-to-use-chartjs-to-create-charts-in-react
import React from 'react';
import { Pie} from 'react-chartjs-2';
//import * as d3schemeBlues from "d3-scale-chromatic";
//import * as d3scaleOrdinal from "d3-scale-chromatic";
//import { schemeBlues, scaleOrdinal} from 'd3-scale-chromatic';
import 'chartjs-plugin-colorschemes';
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

function EmployeeReportChart ({data, username}) {
    //console.log(scaleOrdinal(schemeBlues[data.labels.length]))
    /*data.datasets[0].backgroundColor = [
        '#B21F00',
        '#C9DE00',
        '#2FDE00',
        '#00A6B4',
        '#6800B4'
    ]*/
    //var scheme = `brewer.PuOr${data.labels.length}`
    var scheme = "office.Apothecary6"
    return (
        
        <div>
            <Pie
                data={data}
                options={{
                    segmentShowStroke: false,
                    borderColor: "#003350",
                    backgroundColor: "rgba(255,0,0,.5",
                    borderWidth: 10,
                    title: {
                        display: true,
                        text: `${username}'s Workweek`,
                        fontSize: 20
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    plugins: {
                        colorschemes: {
                            scheme: scheme
                        }
                    }
                }}
            />
        </div>
    );
}

export default EmployeeReportChart;