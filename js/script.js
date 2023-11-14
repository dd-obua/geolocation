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

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    this._toggleElevationField();
    this._createNewWorkout();
  }

  _getPosition() {
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        console.log('There was an error.');
      });
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    console.log(this);
    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handle click events on the map
    this._showForm();
  }

  _showForm() {
    this.#map.on('click', (event) => {
      this.#mapEvent = event;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  }

  _toggleElevationField() {
    // Toggle cadence and elevation gain
    inputType.addEventListener('change', () => {
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    });
  }

  _createNewWorkout() {
    // Display markers
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const { lat, lng } = this.#mapEvent.latlng;

      L.marker([lat, lng])
        .addTo(this.#map)
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
  }
}

const app = new App();
