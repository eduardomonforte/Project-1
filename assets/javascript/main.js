// Initialize Firebase
var config = {
  apiKey: "AIzaSyAnPqkMczUMOzd77nUc-UquvnE5RiRew9Q",
  authDomain: "cbc-project-1.firebaseapp.com",
  databaseURL: "https://cbc-project-1.firebaseio.com",
  projectId: "cbc-project-1",
  storageBucket: "",
  messagingSenderId: "9954661068"
};
firebase.initializeApp(config);

// INEGI Variables
var city = "";
var startTrip = 0;
var endTrip = 0;

// Coordinate Arrays, to be populated by the Ticketmaster Discovery API
var eventsLatitude = [];
var eventsLongitude = [];

// TICKETMASTER DISCOVERY API

var responseSize = (20).toString();
var apiKey = "8qqzR9xAATp2Wyh7mCELVegociPYsEVT";

var queryURL =
  "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" +
  apiKey +
  "&countryCode=MX&size=" +
  responseSize +
  "&sort=date,asc";

function start() {
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var defaultEvents = [];
    var tempEvent = response._embedded.events;

    for (let i = 0; i < tempEvent.length; i++) {
      if (
        tempEvent[i]._embedded.venues[0].location !== undefined &&
        tempEvent[i].info !== undefined
      ) {
        defaultEvents.push(tempEvent[i]);
      }
    }

    console.log(defaultEvents);

    $("#event1image").attr("src", defaultEvents[0].images[0].url);
    $(".event1title").text(defaultEvents[0].name);
    $("#event1description").text(defaultEvents[0].info);
    $(".event1venue").text(
      defaultEvents[0]._embedded.venues[0].name +
      " - " +
      defaultEvents[0]._embedded.venues[0].city.name +
      ", " +
      defaultEvents[0]._embedded.venues[0].country.name
    );
    $(".event1price").text(
      "Ticket price (min): $" + defaultEvents[0].priceRanges[0].min + " MXN"
    );

    $("#event2image").attr("src", defaultEvents[1].images[0].url);
    $(".event2title").text(defaultEvents[1].name);
    $("#event2description").text(defaultEvents[1].info);
    $(".event2venue").text(
      defaultEvents[1]._embedded.venues[0].name +
      " - " +
      defaultEvents[1]._embedded.venues[0].city.name +
      ", " +
      defaultEvents[1]._embedded.venues[0].country.name
    );
    $(".event2price").text(
      "Ticket price (min): $" + defaultEvents[1].priceRanges[0].min + " MXN"
    );

    $("#event3image").attr("src", defaultEvents[2].images[0].url);
    $(".event3title").text(defaultEvents[2].name);
    $("#event3description").text(defaultEvents[2].info);
    $(".event3venue").text(
      defaultEvents[2]._embedded.venues[0].name +
      " - " +
      defaultEvents[2]._embedded.venues[0].city.name +
      ", " +
      defaultEvents[2]._embedded.venues[0].country.name
    );
    $(".event3price").text(
      "Ticket price (min): $" + defaultEvents[2].priceRanges[0].min + " MXN"
    );

    for (let i = 0; i < defaultEvents.length; i++) {
      defaultEventsLatitude = parseFloat(
        defaultEvents[i]._embedded.venues[0].location.latitude
      );
      eventsLatitude.push(defaultEventsLatitude);
      defaultEventsLongitude = parseFloat(
        defaultEvents[i]._embedded.venues[0].location.longitude
      );
      eventsLongitude.push(defaultEventsLongitude);
    }

    initMap();
  });
}

// Function to determine the place and INEGI code for the routing function
function journeyStart(city) {
  $.ajax({
    url: "http://gaia.inegi.org.mx/sakbe_v3.1/buscadestino",
    method: "POST",
    data: {
      buscar: city,
      proj: "GRS80",
      type: "json",
      num: 5,
      key: "rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG"
    }
  }).done(function (response) {
    console.log(response);
  });
}

// Function to determine the complete route, km, toll cost, etc.
function routes(startTrip, endTrip) {
  $.ajax({
    url: "http://gaia.inegi.org.mx/sakbe_v3.1/cuota",
    method: "POST",
    data: {
      key: "rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG",
      dest_i: startTrip,
      dest_f: endTrip,
      // id_i: 1,
      // source_i: 254,
      // target_i: 255,
      // id_f: 775167,
      // source_f: 250771,
      // target_f: 687808,
      v: 1,
      type: "json",
      proj: "GRS80"
    }
  }).done(function (response) {
    console.log(response);
  });
}

// Function to determine fuel costs
function fuel() {
  $.ajax({
    url: "http://gaia.inegi.org.mx/sakbe_v3.1/combustible",
    method: "POST",
    data: {
      key: "rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG",
      type: "json",
      proj: "GRS80"
    }
  }).done(function (response) {
    console.log(response);
  });
}

// Function to initialize and add the map
function initMap() {
  // The location of the center of Mexico
  var mexico = {
    lat: 23.6345,
    lng: -102.5528
  };

  // The three default event markers, empty by default.

  var event1location = {
    lat: eventsLatitude[0],
    lng: eventsLongitude[0],
    title: "Event 1"
  };

  var event2location = {
    lat: eventsLatitude[1],
    lng: eventsLongitude[1],
    title: "Event 2"
  };

  var event3location = {
    lat: eventsLatitude[2],
    lng: eventsLongitude[2],
    title: "Event 3"
  };

  // The map, centered at Mexico
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: mexico
  });

  // Marker for Event 1
  var markerEvent1 = new google.maps.Marker({
    position: event1location,
    map: map
  });

  // Marker for Event 2
  var markerEvent2 = new google.maps.Marker({
    position: event2location,
    map: map
  });

  // Marker for Event 3
  var markerEvent3 = new google.maps.Marker({
    position: event3location,
    map: map
  });
}

function displayRoute() {
  // The location of Mexico
  var mexico = {
    lat: 19.3390515900001,
    lng: -99.06427109

    //23.368116,
    //-102.268791
  };

  var mexico2 = {
    lat: 20.3390515900001,
    lng: -102.06427109

    //23.368116,
    //-102.268791
  };
  // The map, centered at Mexico
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: mexico
  });
  // The marker, positioned at Mexico
  var marker = new google.maps.Marker({
    position: mexico,
    map: map
  });

  var marker2 = new google.maps.Marker({
    position: mexico2,
    map: map
  });
}

// function hotels() {
//   $.ajax({
//     url: "https://dev.allmyles.com/v2.0/hotels",
//     method: "POST",
//     headers: {
//       "async": true,
//       "crossDomain": true,
//       "X-Auth-Token": "4bc1353d-2727",
//       "Content-Type": "application/json",
//     },
//     processData: false,
//     data: "{\n  \"cityCode\": \"MEX\",\n  \"rooms\": [\n    {\n      \"ADT\": 1\n    }\n  ],\n  \"arrivalDate\": \"2018-11-22\",\n  \"leaveDate\": \"2018-11-23\",\n  \"nationality\": \"MX\"\n}\n",

//   }).done(function (response) {
//     console.log(response);
//   });
// }

//Hotel Variables
var arrivalDate = "";
var leaveDate = "";
var hotelsObject = {};
var hotelLatitude = 0;
var hotelLogitude = 0;
var hotelName = "";
var hotelRate = 0;

function hotels(city, arrivalDate, leaveDate) {
  $.ajax({
    async: true,
    crossDomain: true,
    url: "https://serene-falls-67906.herokuapp.com/",
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "postman-token": "6844a236-b0ca-65b7-5031-35bfdf0b6702"
    },
    "processData": false,
    "data": "{\n\t\"cityCode\": \"" + city + "\",\n\t\"arrivalDate\": \"" + arrivalDate + "\",\n\t\"leaveDate\": \"" + leaveDate + "\"\n}"

  }).done(function (response) {
    console.log(response);
    for (var i = 0; i < response.hotelResultSet.length; i++) {
      hotelName = response.hotelResultSet[i].hotel_name;
      hotelRate = response.hotelResultSet[i].min_rate.amount * 0.067;
      var finalRate = hotelRate.toFixed(2);

      var hotel = $("<a>")
        .attr("class", "collection-item")
        .attr("id", i)
        .attr("href", "#")
        .text(hotelName + " $" + finalRate);

      // Creating an image tag
      var pricetag = $("<span>")
        .attr("class", "new badge")
        .attr("data-badge-caption", " ")
        .text("$" + finalRate);

      //$("#").append(pricetag);
      $(".collection").append(hotel);

    };
    console.log(hotelsObject);
  });
}