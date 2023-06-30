const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    //eventDay = document.querySelector(".event-day"),
    //eventDay = document.querySelector(".calendar-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".calendar-slots-wrapper"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    //selectDate = document.querySelector(".today-date"),
    calendarDays = document.querySelectorAll(".calendar-day"),
    calendarTimes = document.querySelectorAll(".calendar-time-slot-terms"),
    addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const eventsArr = []; // fill with time slots open
let weekSlotsArr = setWeekSlotArr();
let minSetVal = 2;
let slotDay = new Date().getDay();
getEvents();

console.log(weekSlotsArr);
calendarDays.forEach((day) => {
    day.addEventListener("click", openPage(day));
});
calendarTimes.forEach((timeslot) => {
    timeslot.addEventListener("click", setTimeSlot(timeslot));
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
    const todayDate = document.getElementById(day);

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
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
            //getActiveDay(i);
            openPage(today.getDay());
            if (event) {
                days += setTodayAsActive
                    ? `<div class="day today active event">${i}</div>`
                    : `<div class="day today event">${i}</div>`;
            } else {
                days += setTodayAsActive
                    ? `<div class="day today active">${i}</div>`
                    : `<div class="day today">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day ">${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
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
        });
    });
}

todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
});

dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
        dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (dateInput.value.length === 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
    console.log("here");
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
/*function getActiveDay(date) {
    const day = new Date(year, month, date);
    console.log(day);
    const dayName = day.toString().split(" ")[0];
    console.log(dayName);
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}*/

function setWeekSlotArr() {
    let results = [];
    for (let i = 0; i < 7; i++) {
        results[i] = ger48(i);
    }
    return results;
}
function ger48(i) {
    let sub = [];
    for (let j = 0; j < 48; j++) {
        sub[j] =
            localStorage.getItem(`weekSlotsArr${i}${j}`) != null
                ? // ? localStorage.getItem(`weekSlotsArr${i}${j}`)
                  "false"
                : "false";
    }
    return sub;
}

//function update events when a day is active
// 0-6 Mon-Sun
function updateEvents(day) {
    weekSlotsArr = setWeekSlotArr();

    let events = "";
    switch (minSetVal) {
        case 1:
            events = min30(day);
            break;
        case 2:
            events = min60(day);
            break;
        case 3:
            events = min60(day);
            break;
        case 4:
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
    // console.log(date);
    eventsContainer.innerHTML = events;
    saveEvents();
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
        if (weekSlotsArr[day - 1][i] === "true") {
            checked = "active";
        }
        events += `
        <div class="calendar-time-slot ${checked}" onclick="dateCheck('${
            day - 1
        }', '${i}','${i + 1}', this)"
      type="checkbox"
      id="${i}"
      name="${slotTime}"
      value="${i}">
      <div>${slotTime}</div>
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
        if (weekSlotsArr[day - 1][i] === "true") {
            checked = "active";
        }
        events += `
        <div class="calendar-time-slot ${checked}" onclick="dateCheck('${
            day - 1
        }', '${i}','${i + 2}', this)"
      type="checkbox"
      id="${i}"
      name="${slotTime}"
      value="${i}">
      <div>${slotTime}</div>
      </div>
        `;
    }
    return events;
}

function min120(day) {
    let events = "";
    let j = 0;
    for (let i = 0; i < 48; i++) {
        let min = "00";
        let checked = "";
        let hour = Math.ceil((i + 1) / 2);
        if (j != 0) {
            j--;
            continue;
        }
        j = 3;
        let slotTimeTime = hour > 12 ? hour % 12 : hour;
        let timeformatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        slotTimeTime = slotTimeTime == 0 ? 12 : slotTimeTime;
        let slotTime = slotTimeTime + ":" + min + " " + timeformatter;
        if (weekSlotsArr[day - 1][i] === "true") {
            checked = "active";
        }
        events += `
        <div class="calendar-time-slot ${checked}" onclick="dateCheck('${
            day - 1
        }', '${i}','${i + 4}', this)"
      type="checkbox"
      id="${i}"
      name="${slotTime}"
      value="${i}">
      <div>${slotTime}</div>
      </div>
        `;
    }
    return events;
}

function dateCheck(day, i, end, e) {
    for (let j = i; j < end; j++) {
        if (j === i) weekSlotsArr[day][j] = e.checked;
        else weekSlotsArr[day][j] = false;
        localStorage.setItem(`weekSlotsArr${day}${j}`, weekSlotsArr[day][j]);
    }
}

//function to add event
/*addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});*/

/*addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});*/

/*document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});*/

//allow 50 chars in eventtitle
//addEventTitle.addEventListener("input", (e) => {
//    addEventTitle.value = addEventTitle.value.slice(0, 60);
//});

function defineProperty() {
    var osccred = document.createElement("div");
    osccred.innerHTML =
        "A Project By <a href='https://www.youtube.com/channel/UCiUtBDVaSmMGKxg1HYeK-BQ' target=_blank>Open Source Coding</a>";
    osccred.style.position = "absolute";
    osccred.style.bottom = "0";
    osccred.style.right = "0";
    osccred.style.fontSize = "10px";
    osccred.style.color = "#ccc";
    osccred.style.fontFamily = "sans-serif";
    osccred.style.padding = "5px";
    osccred.style.background = "#fff";
    osccred.style.borderTopLeftRadius = "5px";
    osccred.style.borderBottomRightRadius = "5px";
    osccred.style.boxShadow = "0 0 5px #ccc";
    document.body.appendChild(osccred);
}

//defineProperty();

//allow only time in eventtime from and to
/*addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});

addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});*/

//function to add event to eventsArr
/*addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Please fill all the fields");
        return;
    }

    //check correct time format 24 hour
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Invalid Time Format");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    //check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((event) => {
                if (event.title === eventTitle) {
                    eventExist = true;
                }
            });
        }
    });
    if (eventExist) {
        alert("Event already added");
        return;
    }
    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
        status: "available",
    };
    console.log(newEvent);
    console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    //updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});*/

//function to delete event when clicked on event
/*eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        //if client book the time
        if (confirm("Are you sure you want to delete this event?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title === eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    //if no events left in a day then remove that day from eventsArr
                    if (event.events.length === 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        //remove event class from day
                        const activeDayEl =
                            document.querySelector(".day.active");
                        if (activeDayEl.classList.contains("event")) {
                            activeDayEl.classList.remove("event");
                        }
                    }
                }
            });
            //updateEvents(activeDay);
        }
    }
});*/

//function to save events in local storage
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
    //check if events are already saved in local storage then return event else nothing
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
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
    //selectDate.value = day;
    calendarDays.forEach((day) => {
        if (day === element) {
            day.classList.add("active");
        } else {
            day.classList.remove("active");
        }
    });
    console.log(element);
    let dayVal = element.getAttribute("day");
    updateEvents(dayVal);
}
function setTimeSlot(element) {
    //selectDate.value = day;
    calendarTimes.forEach((timeSlot) => {
        if (timeSlot === element) {
            timeSlot.classList.add("active");
        } else {
            timeSlot.classList.remove("active");
        }
    });
    console.log(element);
    let timeSlot = element.getAttribute("timeslot");
    minSet(timeSlot);
}
// selectDate.addEventListener("change", (e) => {
//     updateEvents(e.target.value);
// });

function minSet(val) {
    minSetVal = val;
    updateEvents(slotDay);
}
