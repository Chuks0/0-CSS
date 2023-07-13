//TODO
//only show up to 6m

const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    // todayBtn = document.querySelector(".today-btn"),
    eventsContainer = document.querySelector(".calendar-setup-timeslot"),
    calendarDays = document.querySelectorAll(".checkbox-wrapper_day-setup"),
    setup = document.querySelector(".calendar-setup-days"),
    setupDaysWraper = document.querySelector(".calendar-setup-days-wrapper"),
    calendarTimes = document.querySelectorAll(".checkbox-timer");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
];

setup.style.display = "none";
const eventsArr = []; // fill with time slots open
const weekSlotsArr = [];
let minSetVal = 0;
let slotDay = new Date().getDay();

calendarDays.forEach((day) => {
    day.addEventListener("click", () => openPage(day));
});
calendarTimes.forEach((timeslot) => {
    timeslot.addEventListener("click", () => setTimeSlot(timeslot));
});

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar(setTodayAsActive = true) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = year + "." + months[month];

    let days = `<div class="calendar_row">`;
    let dayCount = 0;
    let weekCount = 0;

    for (let x = day; x > 0; x--) {
        dayCount++;
        days += `<div day="${dayCount}" class="calendar_item day grey-out prev-date">${
            prevDays - x + 1
        }</div>`;
        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days +=
                weekCount >= 6 ? "</div>" : `</div><div class="calendar_row">`;
        }
    }

    for (let i = 1; i <= lastDate; i++) {
        dayCount++;
        //check if event is present on that day
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                let datenow = new Date();
                if (datenow.getFullYear() <= year)
                    if (datenow.getMonth() <= month)
                        if (datenow.getDate() <= i) event = true;
            }
        });

        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            console.log(today.getDay());
            console.log(dayCount);
            openPageDay(today.getDay());
            if (event) {
                days += setTodayAsActive
                    ? `<div day="${dayCount}" class="calendar_item day today active event">${i}</div>`
                    : `<div day="${dayCount}" class="calendar_item day today event">${i}</div>`;
            } else {
                days += setTodayAsActive
                    ? `<div day="${dayCount}" class="calendar_item day today active">${i}</div>`
                    : `<div day="${dayCount}" class="calendar_item day today">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div day="${dayCount}" class="calendar_item day event">${i}</div>`;
            } else {
                days += `<div day="${dayCount}" class="calendar_item day ">${i}</div>`;
            }
        }
        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days +=
                weekCount >= 6 ? "</div>" : `</div><div class="calendar_row">`;
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        dayCount++;
        days += `<div day="${dayCount}" class="calendar_item day grey-out next-date">${j}</div>`;
        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days +=
                weekCount >= 6 ? "</div>" : `</div><div class="calendar_row">`;
        }
    }
    while (weekCount < 6) {
        weekCount++;
        let extraDays = "";
        let i = nextDays + 1;
        for (let d = 0; d < 7; d++) {
            dayCount++;
            extraDays += `<div day="${dayCount}" class="calendar_item day grey-out next-date">${i}</div>`;
            i++;
        }
        days += extraDays;
        days += weekCount >= 6 ? "</div>" : `</div><div class="calendar_row">`;
    }
    daysContainer.innerHTML = days;
    addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar(false);
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar(false);
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //getActiveDay(e.target.innerHTML);
            //updateEvents(Number(e.target.innerHTML));
            activeDay = Number(e.target.innerHTML);
            //remove active
            days.forEach((day) => {
                day.classList.remove("active");
            });
            //if clicked prev-date or next-date switch to that month
            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                //add active to clicked day afte month is change
                setTimeout(() => {
                    //add active where no prev-date or next-date
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                //add active to clicked day afte month is changed
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
            }
            openPage(e.target);
        });
    });
}

// todayBtn.addEventListener("click", () => {
//     today = new Date();
//     month = today.getMonth();
//     year = today.getFullYear();
//     initCalendar();
// });

//function update events when a day is active
// 0-6 Mon-Sun
function updateEvents(day) {
    slotDay = day;

    let events = "";
    switch (minSetVal) {
        case "1":
            events = min30(day);
            break;
        case "2":
            events = min60(day);
            break;
        case "3":
            events = min90(day);
            break;
        case "4":
            events = min120(day);
            break;

        default:
            events = min60(day);
            break;
    }

    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            let date1 = new Date(`${event.month}/${event.day}/${event.year}`);
            let date2 = new Date();
            event.events.forEach((event) => {
                let available_bool = false;

                if (date1 > date2) {
                    available_bool = true;
                } else {
                    if (
                        !(date2.getMonth() > date1.getMonth()) &&
                        !(date2.getDay() > date1.getDay())
                    ) {
                        let timeArr = event.time.split(":");
                        let minArr = timeArr[1].split(" ");
                        let hourVal =
                            minArr[1] === "PM"
                                ? timeArr[0] != 12
                                    ? parseInt(timeArr[0]) + 12
                                    : timeArr[0]
                                : timeArr[0];
                        if (date2.getHours() < hourVal) {
                            available_bool = true;
                        } else if (
                            date2.getHours() == hourVal &&
                            date2.getMinutes() < minArr[0]
                        ) {
                            available_bool = true;
                        }
                    }
                }
                event.status = available_bool ? event.status : "expired";
                events += `<div class="calendar-time-slot">
            <div class="title">
              <i class="fas fa-circle ${event.status}"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
            <h3>No Availability</h3>
        </div>`;
    }

    eventsContainer.innerHTML = events;
}

function min30(day) {
    let events = "";
    for (let i = 0; i < 48; i++) {
        let min = "00";
        let checked = "";
        let j = i % 2;
        let hour = Math.ceil((i + 1) / 2);
        if (j == 1) {
            min = "30";
        }
        let slotTimeTime = hour > 12 ? hour % 12 : hour;
        let timeformatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        slotTimeTime = slotTimeTime == 0 ? 12 : slotTimeTime;
        let slotTime = slotTimeTime + ":" + min + " " + timeformatter;
        let endTime =
            j == 1
                ? (slotTimeTime + 1 > 12 ? 1 : slotTimeTime + 1) +
                  ":00" +
                  (hour + 1 >= 12 && hour + 1 < 24 ? "PM" : "AM")
                : slotTimeTime + ":30 " + timeformatter;
        if (weekSlotsArr[day - 1][i] === "s") {
            checked = "w--redirected-checked";
        }
        if (weekSlotsArr[day - 1][i] === "n") {
            continue;
        }
        events += `<div class="w-checkbox checkbox-wrapper">
            <div onclick="dateCheck('${day - 1}', '${i}','${i + 1}', this)"
            id="${i}"
            name="${slotTime}"
            value="${i}"
            class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
                <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
            </div>
        </div>
        `;
    }
    return events;
}
function min60(day) {
    let events = "";
    for (let i = 0; i < 48; i++) {
        let min = "00";
        let checked = "";
        let j = i % 2;
        let hour = Math.ceil((i + 1) / 2);
        if (j == 1) {
            continue;
        }
        let slotTimeTime = hour > 12 ? hour % 12 : hour;
        let timeformatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        slotTimeTime = slotTimeTime == 0 ? 12 : slotTimeTime;
        let slotTime = slotTimeTime + ":" + min + " " + timeformatter;
        let endTime =
            (slotTimeTime + 1 > 12 ? 1 : slotTimeTime + 1) +
            ":00" +
            (hour + 1 >= 12 && hour + 1 < 24 ? "PM" : "AM");
        if (weekSlotsArr[day - 1][i] === "s") {
            checked = "w--redirected-checked";
        }
        if (weekSlotsArr[day - 1][i] === "n") {
            continue;
        }
        events += `
        <div class="w-checkbox checkbox-wrapper">
            <div onclick="dateCheck('${day - 1}', '${i}','${i + 2}', this)"
            id="${i}"
            name="${slotTime}"
            value="${i}"
            class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
                <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
            </div>
        </div>
        `;
    }
    return events;
}
function min90(day) {
    let events = "";
    let k = 0;
    for (let i = 0; i < 48; i++) {
        if (k != 0) {
            k--;
            continue;
        }
        k = 2;
        let min = "00";
        let checked = "";
        let j = i % 2;
        let hour = Math.ceil((i + 1) / 2);
        if (j == 1) {
            min = "30";
        }
        let slotTimeTime = hour > 12 ? hour % 12 : hour;
        let timeformatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        slotTimeTime = slotTimeTime == 0 ? 12 : slotTimeTime;
        let slotTime = slotTimeTime + ":" + min + " " + timeformatter;
        let endTime =
            j == 1
                ? (slotTimeTime + 2 > 12 ? 2 : slotTimeTime + 2) +
                  ":00" +
                  (hour + 2 >= 12 && hour + 2 < 24 ? "PM" : "AM")
                : slotTimeTime + 1 + ":30 " + timeformatter;
        if (weekSlotsArr[day - 1][i] === "s") {
            checked = "w--redirected-checked";
        }
        if (weekSlotsArr[day - 1][i] === "n") {
            continue;
        }
        events += `
        <div class="w-checkbox checkbox-wrapper">
            <div onclick="dateCheck('${day - 1}', '${i}','${i + 1}', this)"
            id="${i}"
            name="${slotTime}"
            value="${i}"
            class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
                <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
            </div>
        </div>
        `;
    }
    return events;
}

function min120(day) {
    let events = "";
    let j = 0;
    for (let i = 0; i < 48; i++) {
        if (j != 0) {
            j--;
            continue;
        }
        j = 3;
        let min = "00";
        let checked = "";
        let hour = Math.ceil((i + 1) / 2);
        let slotTimeTime = hour > 12 ? hour % 12 : hour;
        let timeformatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        slotTimeTime = slotTimeTime == 0 ? 12 : slotTimeTime;
        let slotTime = slotTimeTime + ":" + min + " " + timeformatter;
        let endTime =
            (slotTimeTime + 2 > 12 ? 1 : slotTimeTime + 2) +
            ":00" +
            (hour + 2 >= 12 && hour + 2 < 24 ? "PM" : "AM");
        if (weekSlotsArr[day - 1][i] === "s") {
            checked = "w--redirected-checked";
        }
        if (weekSlotsArr[day - 1][i] === "n") {
            continue;
        }
        events += `
        <div class="w-checkbox checkbox-wrapper">
            <div onclick="dateCheck('${day - 1}', '${i}','${i + 4}', this)"
            id="${i}"
            name="${slotTime}"
            value="${i}"
            class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
                <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
            </div>
        </div>
        `;
    }
    return events;
}

function dateCheck(day, i, end, e) {
    for (let j = i; j < end; j++) {
        if (j === i)
            weekSlotsArr[day][j] = weekSlotsArr[day][j] === "s" ? "a" : "s";
        else weekSlotsArr[day][j] = "a";
    }

    if (e.classList.contains("w--redirected-checked"))
        e.classList.remove("w--redirected-checked");
    else e.classList.add("w--redirected-checked");

    //console.log(JSON.stringify(weekSlotsArr));
    //console.log(minSetVal);
}

function convertTime(time) {
    //convert time to 24 hour format
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

function openPage(element) {
    let dayVal = element.getAttribute("day");
    updateEvents(dayVal);
}

function openPageDay(num) {
    updateEvents(num);
}
function setTimeSlot(element) {
    let timeSlot = element.getAttribute("timeslot");
    minSet(timeSlot);
}
function setTimeSlotTime(num) {
    minSet(num);
}
// selectDate.addEventListener("change", (e) => {
//     updateEvents(e.target.value);
// });

function minSet(val) {
    minSetVal = val;
    updateEvents(slotDay);
}
