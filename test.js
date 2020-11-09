const moment =require("moment");
function getCurrentWeekInfo() {
    const weekNumber = moment().week();
    const weekStartDate = moment().startOf("week").format("D MMMM YYYY")

    return { weekStartDate, weekNumber }
}
console.log(getCurrentWeekInfo())