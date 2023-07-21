const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const coachingBtn = document.querySelector(".btn-coaching");
const eventsContainer = document.querySelector(".calendar-setup-timeslot");
const calendarDays = document.querySelectorAll(".checkbox-wrapper_day-setup");
const setupDaysWrapper = document.querySelector(".calendar-setup-days-wrapper");
const calendarTimes = document.querySelectorAll(".checkbox-timer");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
);

const eventsArr = []; // fill with time slots open
const weekSlotsArr = [];
const selectedSlot = [];
let timeSelected;
let minSetVal = 0;
let slotDay = new Date().getDay();

calendarDays.forEach((day) => {
    day.addEventListener("click", () => openPage(day));
});
calendarTimes.forEach((timeslot) => {
    timeslot.addEventListener("click", () => setTimeSlot(timeslot));
});

const availability = (i) => {
    const found = weekSlotsArr[i - 1].includes("a");
    return found;
};

function initCalendar(setTodayAsActive = true) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    toggleDisable(coachingBtn, true);
    date.innerHTML = `${year}.${months[month]}`;

    let days = [];
    let dayCount = 0;
    let weekCount = 0;
    let greyOut = "";
    const availabilityClass = "available";
    const todayDate = new Date();
    const currentYear = todayDate.getFullYear();
    const currentMonth = todayDate.getMonth();
    const currentDay = todayDate.getDate();

    for (let x = day; x > 0; x--) {
        dayCount++;
        const prevDay = new Date(year, month, prevDays - x + 1);
        greyOut = prevDay.getTime() < todayDate.getTime() ? "passed" : "";
        days.push(
            `<div day="${dayCount}" class="calendar_item day grey-out prev-date ${greyOut}">${
                prevDays - x + 1
            }</div>`
        );
        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days.push(weekCount >= 6 ? "</div>" : `<div class="calendar_row">`);
        }
    }

    for (let i = 1; i <= lastDate; i++) {
        dayCount++;
        greyOut = availability(dayCount) ? availabilityClass : "";
        let event = false;
        eventsArr.forEach((eventObj) => {
            const { day, month: eventMonth, year: eventYear } = eventObj;
            if (day === i && eventMonth === month + 1 && eventYear === year) {
                const dateNow = new Date();
                if (
                    dateNow.getFullYear() <= year &&
                    dateNow.getMonth() <= month &&
                    dateNow.getDate() <= i
                ) {
                    event = true;
                }
            }
        });

        if (
            i === currentDay &&
            year === currentYear &&
            month === currentMonth
        ) {
            activeDay = i;
            openPageDay(today.getDay() + 1);
            if (event && setTodayAsActive) {
                localStorage.setItem("timeSelectedYear", year);
                localStorage.setItem("timeSelectedMonth", month);
                localStorage.setItem("timeSelectedDate", i);
                days.push(
                    `<div day="${dayCount}" class="calendar_item day today active event ${greyOut}">${i}</div>`
                );
            } else if (setTodayAsActive) {
                localStorage.setItem("timeSelectedYear", year);
                localStorage.setItem("timeSelectedMonth", month);
                localStorage.setItem("timeSelectedDate", i);
                days.push(
                    `<div day="${dayCount}" class="calendar_item day today active ${greyOut}">${i}</div>`
                );
            } else if (event) {
                days.push(
                    `<div day="${dayCount}" class="calendar_item day today event ${greyOut}">${i}</div>`
                );
            } else {
                days.push(
                    `<div day="${dayCount}" class="calendar_item day today ${greyOut}">${i}</div>`
                );
            }
        } else if (event) {
            days.push(
                `<div day="${dayCount}" class="calendar_item day event ${greyOut}">${i}</div>`
            );
        } else {
            days.push(
                `<div day="${dayCount}" class="calendar_item day ${greyOut}">${i}</div>`
            );
        }

        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days.push(weekCount >= 6 ? "</div>" : `<div class="calendar_row">`);
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        dayCount++;
        const nextDay = new Date(year, month + 1, j);
        greyOut = nextDay.getTime() < todayDate.getTime() ? "passed" : "";
        days.push(
            `<div day="${dayCount}" class="calendar_item day grey-out next-date ${greyOut}">${j}</div>`
        );
        if (dayCount >= 7) {
            weekCount++;
            dayCount = 0;
            days.push(weekCount >= 6 ? "</div>" : `<div class="calendar_row">`);
        }
    }

    while (weekCount < 6) {
        weekCount++;
        const extraDays = Array.from({ length: 7 }, (_, d) => {
            dayCount++;
            return `<div day="${dayCount}" class="calendar_item day grey-out next-date">${
                nextDays + 1 + d
            }</div>`;
        }).join("");
        days.push(extraDays);
        days.push(weekCount >= 6 ? "</div>" : `<div class="calendar_row">`);
    }

    daysContainer.innerHTML = days.join("");
    addListener();
}

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

function addListener() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);
            days.forEach((day) => {
                day.classList.remove("active");
            });

            if (e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                            localStorage.setItem("timeSelectedYear", year);
                            localStorage.setItem("timeSelectedMonth", month);
                            localStorage.setItem(
                                "timeSelectedDate",
                                day.innerText
                            );
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                            localStorage.setItem("timeSelectedYear", year);
                            localStorage.setItem("timeSelectedMonth", month);
                            localStorage.setItem(
                                "timeSelectedDate",
                                day.innerText
                            );
                        }
                    });
                }, 100);
            } else {
                e.target.classList.add("active");
                localStorage.setItem("timeSelectedYear", year);
                localStorage.setItem("timeSelectedMonth", month);
                localStorage.setItem("timeSelectedDate", day.innerText);
            }
            openPage(e.target);
        });
    });
}

function todayBtn() {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
}

function updateEvents(day) {
    slotDay = day;
    let events = "";
    switch (minSetVal) {
        case "1":
            events = generateEvents(day, 30);
            break;
        case "2":
            events = generateEvents(day, 60);
            break;
        case "3":
            events = generateEvents(day, 90);
            break;
        case "4":
            events = generateEvents(day, 120);
            break;
        default:
            events = generateEvents(day, 60);
            break;
    }

    if (events === "") {
        events = `<div class="no-event">
      <h3>No Availability</h3>
    </div>`;
    }

    eventsContainer.innerHTML = events;
}

function generateEvents(day, interval) {
    let events = "";
    let j = 0;
    const numSlots = 240 / interval; // 4 slots for 240 minutes (1 day)

    for (let i = 0; i < numSlots; i++) {
        if (j !== 0) {
            j--;
            continue;
        }

        let min = "00";
        const checked = "";
        const hour = Math.ceil((i + 1) / 2);
        const jValue = i % 2;

        if (jValue === 1) {
            if (interval === 30) min = "30";
            else continue;
        }

        const slotTimeHour = hour > 12 ? hour % 12 : hour;
        const timeFormatter = hour >= 12 && hour < 24 ? "PM" : "AM";
        const slotTime = `${slotTimeHour}:${min} ${timeFormatter}`;

        let endTime;
        if (jValue === 1) {
            if (interval === 30)
                endTime = `${slotTimeHour + 1 > 12 ? 1 : slotTimeHour + 1}:00 ${
                    hour + 1 >= 12 && hour + 1 < 24 ? "PM" : "AM"
                }`;
        } else {
            endTime = `${slotTimeHour + 1 > 12 ? 1 : slotTimeHour + 1}:00 ${
                hour + 1 >= 12 && hour + 1 < 24 ? "PM" : "AM"
            }`;
        }

        if (weekSlotsArr[day - 1][i] === "s") {
            j = interval / 30;
            events += `<div class="w-checkbox checkbox-wrapper">
        <div onclick="dateCheck('${day - 1}', '${i}', '${
                i + interval / 30
            }', this)"
        id="${i}"
        name="${slotTime}"
        value="${i}"
        class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
            <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
        </div>
      </div>`;
        } else if (weekSlotsArr[day - 1][i] !== "n") {
            events += `<div class="w-checkbox checkbox-wrapper">
        <div onclick="dateCheck('${day - 1}', '${i}', '${
                i + interval / 30
            }', this)"
        id="${i}"
        name="${slotTime}"
        value="${i}"
        class="w-checkbox-input w-checkbox-input--inputType-custom checkbox-6 ${checked}">
            <div class="checkbox-label-7 w-form-label">${slotTime} - ${endTime}</div>
        </div>
      </div>`;
        }
    }
    return events;
}

function dateCheck(day, i, end, e) {
    try {
        if (e !== timeSelected) {
            timeSelected.classList.remove("w--redirected-checked");
        }
    } catch {}
    timeSelected = e;

    if (e.classList.contains("w--redirected-checked")) {
        e.classList.remove("w--redirected-checked");
        selectedSlot[0] = null;
        selectedSlot[1] = null;

        localStorage.removeItem("timeSelectedDay");
        localStorage.removeItem("timeSelectedTime");
    } else {
        e.classList.add("w--redirected-checked");
        selectedSlot[0] = day;
        selectedSlot[1] = i;

        localStorage.setItem("timeSelectedDay", day);
        localStorage.setItem("timeSelectedTime", i);
    }

    if (localStorage.getItem("timeSelectedDay") !== null) {
        toggleDisable(coachingBtn, false);
    } else {
        toggleDisable(coachingBtn, true);
    }
}

function toggleDisable(e, value) {
    if (value) {
        e.classList.add("disabled");
        e.style.pointerEvents = "none";
    } else {
        e.classList.remove("disabled");
        e.style.pointerEvents = "auto";
    }
}

function openPage(element) {
    const dayVal = element.getAttribute("day");
    updateEvents(dayVal);
}

function openPageDay(num) {
    updateEvents(num);
}

function setTimeSlot(element) {
    const timeSlot = element.getAttribute("timeslot");
    minSet(timeSlot);
}

function setTimeSlotTime(num) {
    minSet(num);
}

// Select date event listener is commented out
