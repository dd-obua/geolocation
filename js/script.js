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
    form.addEventListener('submit', this._createNewWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _getPosition() {
    navigator.geolocation &&
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        console.log('There was an error.');
      });
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handle click events on the map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(event) {
    this.#mapEvent = event;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    // Toggle cadence and elevation gain
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _createNewWorkout(event) {
    event.preventDefault();

    // Display markers
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
  }
}

const app = new App();
