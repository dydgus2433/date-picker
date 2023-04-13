class DatePicker {
  monthData = [
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
  #calendarDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };
  selectedDate = {
    data: "",
    date: 0,
    month: 0,
    year: 0,
  };

  datePickerEl;
  dateInputEl;
  calendarEl;
  calendarMonthEl;
  monthContentEl;
  nextBtnEl;
  prevBtnEl;
  calendarDatesEl;
  constructor() {
    this.initCalendarDate();
    this.initSelectedDate();
    this.assignElement();
    this.setDateInput();
    this.addEvent();
  }
  initSelectedDate() {
    this.selectedDate = { ...this.#calendarDate };
  }
  setDateInput() {
    this.dateInputEl.textContent = this.formatDate(this.selectedDate.data);
    this.dateInputEl.dataset.value = this.selectedDate.data;
  }
  initCalendarDate() {
    console.log("initCalendarDate");
    const data = new Date();
    const date = data.getDate();
    const month = data.getMonth();
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    console.log("assignElement");
    this.datePickerEl = document.getElementById("date-picker");
    this.dateInputEl = this.datePickerEl.querySelector("#date-input");
    this.calendarEl = this.datePickerEl.querySelector("#calendar");
    this.calendarMonthEl = this.calendarEl.querySelector("#month");
    this.monthContentEl = this.calendarMonthEl.querySelector("#content");
    this.nextBtnEl = this.calendarMonthEl.querySelector("#next");
    this.prevBtnEl = this.calendarMonthEl.querySelector("#prev");
    this.calendarDatesEl = this.calendarEl.querySelector("#dates");
  }

  addEvent() {
    console.log("test");
    this.dateInputEl.addEventListener("click", this.toggleCalendar.bind(this));
    this.nextBtnEl.addEventListener("click", this.moveToNextMonth.bind(this));
    this.prevBtnEl.addEventListener("click", this.moveToPrevMonth.bind(this));
    this.calendarDatesEl.addEventListener(
      "click",
      this.onClickSelectDate.bind(this)
    );
  }

  onClickSelectDate(event) {
    const eventTarget = event.target;
    if (eventTarget.dataset.date) {
      // 'data-date'
      this.calendarDatesEl
        .querySelector(".selected")
        ?.classList.remove("selected");
      eventTarget.classList.add("selected");
      this.selectedDate = {
        data: new Date(
          this.#calendarDate.year,
          this.#calendarDate.month,
          eventTarget.dataset.date
        ),
        year: this.#calendarDate.year,
        month: this.#calendarDate.month,
        date: eventTarget.dataset.date,
      };
      this.setDateInput();
      this.calendarEl.classList.remove("active");
    }
  }

  formatDate(dateData) {
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }

    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }

    let year = dateData.getFullYear();
    return `${year}/${month}/${date}`;
  }

  moveToNextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month > 11) {
      this.#calendarDate.month = 0;
      this.#calendarDate.year++;
    }
    this.updateMonth();
    this.updateDates();
  }
  moveToPrevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }
  toggleCalendar() {
    // 활성화된 날짜화면 active
    if (this.calendarEl.classList.contains("active")) {
      this.#calendarDate = { ...this.selectedDate };
    }

    this.calendarEl.classList.toggle("active");
    this.updateMonth();
    this.updateDates();
  }
  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    } ${this.#calendarDate.date}`;
  }

  updateDates() {
    this.calendarDatesEl.innerHTML = "";
    const numberOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0
    ).getDate();
    const fragment = new DocumentFragment();
    for (let i = 0; i < numberOfDates; i++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");
      dateEl.textContent = i + 1;
      dateEl.dataset.date = i + 1;
      fragment.appendChild(dateEl);
    }
    const day = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month,
      1
    ).getDay();
    fragment.firstChild.style.gridColumnStart = day + 1;
    this.calendarDatesEl.appendChild(fragment);
    this.colorSaturday(day);
    this.colorSunday(day);
    this.markToday();
    this.markSelectedDate();
  }
  markSelectedDate() {
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month == this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${this.selectedDate.date}']`)
        .classList.add("selected");
    }
  }

  colorSaturday(day) {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${7 - day})`
    );
    saturdayEls.forEach((obj) => {
      obj.style.color = "blue";
    });
  }
  colorSunday(day) {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${(8 - day) % 7})`
    );
    sundayEls.forEach((obj) => {
      obj.style.color = "red";
    });
  }
  markToday() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      this.calendarDatesEl
        .querySelector(`[data-date='${today}']`)
        .classList.add("today");
    }
  }
}

new DatePicker();
