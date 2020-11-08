//the structure of this code borrowed from:
//https://www.educative.io/edpresso/how-to-use-chartjs-to-create-charts-in-react
import React from 'react';
import { Pie} from 'react-chartjs-2';
import 'chartjs-plugin-colorschemes';

function EmployeeReportChart ({data, username}) {
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