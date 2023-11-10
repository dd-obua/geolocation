'use strict';

navigator.geolocation &&
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([51.5, -0.09])
        .addTo(map) 
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();
    },
    () => {
      console.log('Could not get your current position.');
    }
  );
