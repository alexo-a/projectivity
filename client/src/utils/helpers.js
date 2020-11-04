import moment from "moment";


export function getCurrentWeekInfo() {
    const weekNumber=moment().week();
    const weekStartDate=moment().startOf("week").format("Do MMMM YYYY")

    return {weekStartDate, weekNumber}
}