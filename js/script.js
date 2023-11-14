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

class Workout {
  date = new Date();
  id = (Math.trunc(Math.random() * 10000000000) + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Run extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / 60 / this.distance;
    return this.pace;
  }
}

class Cycle extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._createNewWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
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

    const { lat, lng } = this.#mapEvent.latlng;

    const allNumbers = (...inputs) => {
      return inputs.every((input) => Number.isFinite(input));
    };
    const allPostives = (...inputs) => inputs.every((input) => input > 0);

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    let workout;

    // If workout is run, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        !allNumbers(distance, duration, cadence) ||
        !allPostives(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers.');

      // Create workout
      workout = new Run([lat, lng], distance, duration, cadence);
    }

    // If workout is cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      // Check if data is valid
      if (
        !allNumbers(distance, duration, elevation) ||
        !allPostives(distance, duration, elevation)
      )
        return alert('Inputs have to be positive numbers.');

      // Create workout
      workout = new Cycle([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on the list

    // Hide form and clear input fields
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();
