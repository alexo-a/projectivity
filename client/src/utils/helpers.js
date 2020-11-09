import moment from "moment";

export function formatTimeSpan(timeSpan) {
    if (timeSpan >= 0) {
        let minutes = timeSpan % 60;
        return Math.floor(timeSpan / 60) + ":" + ((minutes < 10) ? "0" : "") + minutes;
    } else {
        return "N/A";
    }
}

export function getCurrentWeekInfo() {
    const weekNumber=moment().week();
    const weekStartDate=moment().startOf("week").format("D MMMM YYYY")

    return {weekStartDate, weekNumber}
}