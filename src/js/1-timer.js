import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const datePicker = document.querySelector("#datetime-picker");

const startButton = document.querySelector("[data-start]");
startButton.disabled = true;

const dayss = document.querySelector("[data-days]");
const hourss = document.querySelector("[data-hours]");
const minutess = document.querySelector("[data-minutes]");
const secondss = document.querySelector("[data-seconds]");

let userSelectedDate = null;
let interval = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startButton.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startButton.disabled = false;
      }
    },
};
flatpickr(datePicker, options);

startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;
  startButton.disabled = true;
  datePicker.disabled = true;
    interval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = userSelectedDate - currentTime;
        if (timeLeft <= 0) {
            clearInterval(interval);
            updateTimerUI(0, 0, 0, 0);
            datePicker.disabled = false;
            startButton.disabled = true;
            return;
        } else {
            const { days, hours, minutes, seconds } = convertMs(timeLeft);
            updateTimerUI(days, hours, minutes, seconds);
        }
    }, 1000);
});
  

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerUI(days, hours, minutes, seconds) {
  dayss.textContent = addLeadingZero(days);
  hourss.textContent = addLeadingZero(hours);
  minutess.textContent = addLeadingZero(minutes);
  secondss.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}