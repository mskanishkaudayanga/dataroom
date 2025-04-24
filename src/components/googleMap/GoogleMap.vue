<template>

  <div id="map" v-show="lat !== 0 || lng !== 0"></div>
  <div class="no-found" v-if="lat === 0 || lng === 0">
    Keine Karte gefunden.
  </div>

</template>

<script>
import { Loader } from '@googlemaps/js-api-loader';

export default {
  name: "GoogleMap",
  props: {
    lat: Number,
    lng: Number
  },
  methods: {
    initMap() {
      const loader = new Loader({
        apiKey: "AIzaSyCSXEj1GJ0d3gdT9ahhFU9Qq2OUIDXAkp8",
        version: "weekly",
        libraries: ["places"]
      });

      const mapOptions = {
        zoom: 12,
        center: {
          lat: this.lat,
          lng: this.lng
        },
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      };

      loader
          .load()
          .then((google) => {
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            new google.maps.Marker({
              position: mapOptions.center,
              map,
            });
          })
          .catch(e => {
            console.log(e);
          });
    }
  },
  mounted() {
    this.initMap();
  },
  updated() {
    this.initMap();
  }
}
</script>

<style scoped>

#map {
  height: 100%;
  width: 100%;
}

</style>
