import moment from "moment";

export default DateHelper = {

    isDateToday(date) {
        let today = this.getCurrentDate();
        let tmpDate = moment(date, "YYYY-MM-DD");
        return today.isSame(tmpDate, 'd');
    },

    getTimezoneOffsetHour() {
        return this.getTimezoneOffsetMinutes() / 60;
    },

    getTimezoneOffsetMinutes() {
        return moment().utcOffset();
    },

    getDiffSeconds(startSeconds, endSeconds) {
        return endSeconds - startSeconds;
    },

    getTimeInSeconds() {
        return (new Date().getTime() / 1000);
    },

    getTimeInMilliSeconds() {
        return (new Date().getTime());
    },

    getCurrentDate() {
        return moment();
    },

    getPreviousDay(date = this.dateToYYYYMMDD()){

        return moment(date, "YYYY-MM-DD").add(-1, "days");
    },

    getNextDay (date = this.dateToYYYYMMDD()) {

        return moment(date, "YYYY-MM-DD").add(+1, "days");
    },

    getPreviousDayWithGivenNumber(date, amountDays){
        return moment(date, "YYYY-MM-DD").add(-amountDays, "days").format(`YYYY-MM-DD`);
    },

    getMonthName(date){
        let formatted_month = moment(date).format("LL").split(",");
        if (formatted_month) {
            return formatted_month[0];
        }
    },

    getDayName(date = null) {
        date = moment(date) || moment();
        return date.format("dddd");
    },

    dateToMMMMDDYYYY(date = moment()) {
        return moment(date).format("MMMM DD, YYYY");
    },

    dateToYYYYMMDD(date = moment(), seperator = "-", isUtc = false) {
        if (isUtc) {
            return moment.utc(date).format(`YYYY${seperator}MM${seperator}DD`);
        } else {
            return moment(date).format(`YYYY${seperator}MM${seperator}DD`);
        }
    },

    dateToDDMMYYYY(date = moment(), seperator = "-") {
        return moment(date).format(`DD${seperator}MM${seperator}YYYY`);
    },

    dateToddddMMMMDD(date = moment()) {
        return moment(date).format("dddd, MMMM DD");
    },

    dateToddddMMMMDDWithDateSuffix(date = moment()) {
        return moment(date).format("dddd, MMMM Do");
    },

    dateToddMMMMDDWithDateSuffix(date = moment()) {
        return moment(date).format("dd, MMMM Do");
    },

    dateTodddMMMDDWithDateSuffix(date = moment()) {
        return moment(date).format("ddd, MMM Do");
    },

    dateToMMMMDD(date = moment()) {
        return moment(date).format("MMMM DD");
    },

    dateToMMMDD(date = moment()) {
        return moment(date).format("MMM DD");
    },
    
    findTimeFromNow(date) {
        return moment.utc(date).fromNow();
    },

    toMoment(dateStr) {
        return moment(dateStr);
    },

    YYYYMMDDtoDate(date, seperator = "-", isUtc = false) {
        if (!date) {
            date = this.dateToYYYYMMDD();
        }

        if (isUtc) {
            return moment.utc(date, `YYYY${seperator}MM${seperator}DD`).toDate();
        } else {
            return moment(date, `YYYY${seperator}MM${seperator}DD`).toDate();
        }
    },

    YYYYMMDDtoMMDDYYYY(date, seperator = "-") {
        return moment(date, `YYYY-MM-DD`).format(`MM${seperator}DD${seperator}YYYY`);
    },

    YYYYMMDDtoMMMDD(date) {
        return moment(date, `YYYY-MM-DD`).format(`MMM DD`);
    },

    timestampToMMDDYY (date, seperator = "/") {
        return moment(date).format(`MM${seperator}DD${seperator}YY`)
    },

    getCurrentUtcTimestamp() {
        return moment().utc().format("x");
    },
    // birthDate format is YYYY-DD-MM
    calculateAge(birthDate) {
        let age = moment().diff(birthDate, 'years');
        return age;
    },

    getIsoWeekday(date = null) {

        if (date) {
            return moment(date, "YYYY-MM-DD").isoWeekday();
        }

        let aa = moment().isoWeekday();
        return aa;
    },

    getDateRangeByWeekNumber(date) {

        let beginDate = moment(date).isoWeekday(1);
        let formattedWeekDays = [];
        
        beginDate.startOf("week");

        for (var i = 0; i < 7; i++) {
            formattedWeekDays.push(beginDate.add(1, 'd').format("YYYY-MM-DD"));
        }

        return formattedWeekDays;
    },

    YYYYMMDDtoDDDMMMDD(dateStr) {
        return moment(dateStr, "YYYY-MM-DD").format("DDD, MMM DD")
    },

    getShortDateDay(dateStr) {
        return moment(dateStr, "YYY-MM-DD").format("MMM DD");
    },

    isTodayInMealScheduleTime() {

        let currentDate = this.dateToYYYYMMDD();
        let dateList = this.getDateRangeByWeekNumber(currentDate);
      
        var compareDate = moment();
        var startDate   = moment(dateList[0], "YYYY-MM-DD").add(5, "hours");
        var endDate     = moment(dateList[6], "YYYY-MM-DD").add(9, "hours");
        
        let result = moment().isBetween(startDate, endDate);

        return result;
    },

    YYYYMMDD2ddddMMMMDo (date) {
        return moment(date, "YYYY-MM-DD").format("dddd, MMMM Do");
    },

    isBelongingToCurrentWeek(selectedDay) {
        if (moment().isoWeek() == moment(selectedDay, "YYYY-MM-DD").isoWeek()) {
            return true;
        } else {
            return false;;
        }
    },

    getWeekNumber (selectedDay, seperator = "-") {
        if (seperator == "-") {
            return moment(selectedDay, "YYYY-MM-DD").isoWeek();
        } else {
            return moment(selectedDay).isoWeek();
        }
    },

    getWeekDayNumber (selectedDay, seperator = "-") {
        if (seperator == "-") {
            return moment(selectedDay, "YYYY-MM-DD").isoWeekday();
        } else {
            return moment(selectedDay).isoWeekday();
        }
    },

    getLastDayOfWeek (selectedDay) {
        return moment(selectedDay).endOf('isoweek');
    }
};
