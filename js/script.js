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

navigator.geolocation &&
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const map = L.map('map').setView([latitude, longitude], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', (event) => {});

      // map.on('click', (mapEvent) => {
      //   const { lat, lng } = mapEvent.latlng;

      //   L.marker([lat, lng])
      //     .addTo(map)
      //     .bindPopup(
      //       L.popup({
      //         maxWidth: 250,
      //         minWidth: 100,
      //         autoClose: false,
      //         closeOnClick: false,
      //         className: 'running-popup',
      //       })
      //     )
      //     .setPopupContent('Workout')
      //     .openPopup();
      // });
    },
    () => {
      console.log('There was an error.');
    }
  );
