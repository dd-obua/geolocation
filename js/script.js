'use strict';

const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const form = select('.form');
const containerWorkouts = select('.workouts');
const inputType = select('.form__input--type');
const inputDistance = select('.form__input--distance');
const inputDuration = select('.form__input--duration');
const inputCadence = select('.form__input--cadence');
const inputElevation = select('.form__input--elevation');

let map, mapEvent;

class App {
  constructor() {}

  _getPosition() {
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(this._loadMap, () => {
        console.log('There was an error.');
      });
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Handle click events on the map
    this._showForm();
  }

  _showForm() {
    map.on('click', (event) => {
      mapEvent = event;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }

  _toggleElevationField() {}

  _createNewWorkout() {}
}

const app = new App();
app._getPosition();

// Display markers
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
      })
    )
    .setPopupContent('Workout')
    .openPopup();

  // Clear input fields
  inputDistance.value = '';
  inputDuration.value = '';
  inputCadence.value = '';
  inputElevation.value = '';
});

// Toggle cadence and elevation gain
inputType.addEventListener('change', () => {
  inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
});
