import moment from "moment";
import 'chartjs-plugin-colorschemes';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export function formatTimeSpan(timeSpan) {
    if (timeSpan >= 0) {
        let minutes = timeSpan % 60;
        return Math.floor(timeSpan / 60) + ":" + ((minutes < 10) ? "0" : "") + minutes;
    } else {
        return "N/A";
    }
}

export function getCurrentWeekInfo() {
    const weekNumber = moment().week();
    const weekStartDate = moment().startOf("week").format("DD MMMM YYYY")
    const weekStartLegible = moment().startOf("week").format("Do MMMM YYYY")
    return { weekStartDate, weekNumber, weekStartLegible }
}

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open('Projectivity', 1);
        let db, tx, store;

        request.onupgradeneeded = function (e) {
            const db = request.result;
            db.createObjectStore('dashboard', { keyPath: '_id' });
        };

        request.onerror = function (e) {
            console.log('There was an error');
        };

        request.onsuccess = function (e) {
            db = request.result;
            tx = db.transaction(storeName, 'readwrite');
            store = tx.objectStore(storeName);

            db.onerror = function (e) {
                console.log('error', e);
            };

            switch (method) {
                case 'put':
                    store.put(object);
                    resolve(object);
                    break;
                case 'get':
                    const all = store.getAll();
                    all.onsuccess = function () {
                        resolve(all.result);
                    };
                    break;
                case 'delete':
                    store.delete(object._id);
                    break;
                default:
                    console.log('No valid method');
                    break;
            }

            tx.oncomplete = function () {
                db.close();
            };
        };
    });
}

const logo = "data:image/png;base64,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"

const stylesObj = {
    h1: {
        fontSize: 28,
        bold: true
    },
    h2: {
        fontSize: 22,
        bold: true
    },
    h3: {
        fontSize: 18,
        bold: true
    },
    subheader: {
        fontSize: 15,
        bold: true
    },
    quote: {
        italics: true
    },
    small: {
        fontSize: 8
    }
}

//returns the header data, used in the pdf generator functions
function getHeader() {
    return {
        layout: "noBorders",
        table: {
            headerRows: 1,
            widths: ["10%", "90%"],
            body: [[
                { //projectivity logo
                    image: logo,
                    height: 20,
                    width: 20,
                    alignment: "right",
                },
                {
                    text: "Projectivity",
                    style: "h3",
                    margin: [0, 0, 0, 0],
                    alignment: "left"
                }
            ]]
        }
    }
}

export function createProjectReportPDF(compiledInfo, title) {
    //this function uses the compiled data from the Project Report and makes the guts of a pdf (using pdfmake) that we then open in a new tab.  pdfmake is a little tricky with some of the formatting: to center the content on the page, I had to make the table have 6 columns, with the two outermost being invisible/empty.

    function generateBody(taskArray) {
        let results = [
            [
                { text: "", border: [false, false, false, false] },
                { text: 'Task', bold: true, fontSize: 14, },
                { text: 'Status', bold: true, alignment: "center", border: [false, false, false, true], fontSize: 14, },
                {
                    layout: "noBorders",
                    table: {
                        headerRows: 1,
                        widths: ["75%", "25%"],
                        body: [[
                            { text: 'Employee Name', bold: true, alignment: "center", fontSize: 14, },
                            { text: 'Hours', bold: true, alignment: "center", fontSize: 14, }
                        ]]
                    }
                },
                { text: "", border: [false, false, false, false] },
            ]
        ]
        //generate pdf contents based on available data
        for (let i = 0; i < taskArray.length; i++) {
            let task = taskArray[i]
            let subTableBody = task.users.map(user => {
                return [
                    { text: user.username, alignment: "center", margin: [0, 0, 4, 0] },
                    { text: user.duration.toFixed(2), alignment: "center", margin: [6, 0, 0, 0] }
                ]
            })
            subTableBody.push(["", { text: task.totalTime.toFixed(2), alignment: "center", border: [false, true, false, false], margin: [4, 0, 0, 0] }])
            results.push(
                [
                    { text: "", border: [false, false, false, false] },
                    task.taskTitle,
                    { text: task.status, alignment: "center" },
                    {
                        layout: {
                            defaultBorder: false,
                        },
                        table: {
                            headerRows: 0,
                            widths: ["75%", "25%"],
                            body: subTableBody
                        }
                    },
                    { text: "", border: [false, false, false, false] },
                ]
            )
        }
        return results;
    }

    //contents of entire pdf document
    let docDefinition = {
        content: [
            getHeader(),
            {
                margin: [0, 15, 0, 0],
                alignment: "center",
                text: `${title}`,
                style: "h1"
            },
            {
                alignment: "center",
                margin: [0, 10],
                text: "Project Progress Report",
                style: "h2"
            },
            {
                alignment: "center",
                text: `As of ${moment().format("Do MMMM YYYY")}`,
                style: "h3"
            },
            {
                margin: [0, 25],
                alignment: "center",
                layout: "lightHorizontalLines",
                table: {
                    headerRows: 1,
                    widths: ["8%", "20%", "14%", "50%", "8%"],
                    body: generateBody(compiledInfo),
                },
            },
        ],
        styles: stylesObj
    }
    pdfMake.createPdf(docDefinition).download(`${title.replace(/ /g, "-")}_${moment().format("MMDDYYYY")}.pdf`);
}

export function createEmployeeReportPDF(compiledInfo, username) {
    //this function uses the compiled data from the Employee Report and makes the guts of a pdf (using pdfmake) that we then open in a new tab (or download, as we will in production).  
    function generateBody(projectsArray) {
        let results = [
            [
                { text: "", border: [false, false, false, false] },
                { text: 'Project Name', bold: true, fontSize: 14, margin: [0, 3], alignment: "left" },
                {
                    layout: {
                        defaultBorder: false,
                    },
                    table: {
                        headerRows: 0,
                        widths: ["75%", "25%"],
                        body: [[
                            { text: 'Task Description', bold: true, alignment: "left", fontSize: 14 },
                            { text: 'Hours', bold: true, alignment: "center", fontSize: 14 },
                        ]]
                    }
                },
                { text: "", border: [false, false, false, false] },
            ]
        ]
        for (let x = 0; x < projectsArray.length; x++) {
            let project = projectsArray[x];
            let subTableBody = project.tasks.map(task => {
                return [
                    { text: task.taskTitle, alignment: "left" },
                    { text: task.duration.toFixed(2), alignment: "center" }
                ]
            })
            results.push(
                [
                    { text: "", border: [false, false, false, false] },
                    { text: project.projectTitle, margin: [0, 3], alignment: "left" },
                    {
                        layout: {
                            defaultBorder: false,
                        },
                        table: {
                            headerRows: 0,
                            widths: ["75%", "25%"],
                            body: subTableBody
                        }
                    },
                    { text: "", border: [false, false, false, false] },
                ]
            )
        }
        return results;
        //return the body of the pdf 
    }

    let docDefinition = {
        content: [
            getHeader(),
            {
                margin: [0, 15, 0, 0],
                alignment: "center",
                text: `Weekly Progress Report for ${username}`,
                style: "h1"
            },
            {
                alignment: "center",
                text: `Week of ${getCurrentWeekInfo().weekStartLegible}`,
                style: "h3"
            },
            {
                margin: [0, 25],
                alignment: "center",
                layout: "lightHorizontalLines",
                table: {
                    headerRows: 1,
                    widths: ["15%", "30%", "40%", "15%"],
                    body: generateBody(compiledInfo.compilation),
                },
            },
            {
                layout: "noBorders",
                table: {
                    widths: ["10%", "80%", "10%"],
                    body: [[
                        { text: "" },
                        {
                            image: document.getElementsByTagName('canvas')[0].toDataURL(),
                            height: 175,
                            width: 340,
                            alignment: "center"
                        },
                        { text: "" }
                    ]]
                }
            }
        ],
        styles: stylesObj
    }
    pdfMake.createPdf(docDefinition).download(`Report-${username.replace(" ", "-")}_${moment().format("MMDDYYYY")}.pdf`);
}