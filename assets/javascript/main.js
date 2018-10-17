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
var responseInegi = {};
var eventCost = 0;
var hotelCost1 = 0;

// MOMENT.JS TEST

//var inputDate = ""
//var inputFormat = "MMM DD, YYYY"
//var convertedDate = moment(inputDate, inputFormat);
//console.log(moment(convertedDate).format("YYYY/MM/DD"));

// VALUES STORING

var ticketmasterDate = ""
var stateCode = "DF"

$("#go-search").on("click", function () {
  var startLocation = $("#start").val();
  console.log(startLocation);
  var endLocation = $("#end").val();
  console.log(endLocation);
  var inputDate = $("#travel-date").val();
  console.log(inputDate);
  var inputFormat = "MMM DD, YYYY";
  var convertedDate = moment(inputDate, inputFormat);
  var tempTicketmasterDate = moment(convertedDate).format("YYYY-MM-DD");
  console.log(tempTicketmasterDate);
  ticketmasterDate = tempTicketmasterDate;
  var formattedDate = tempTicketmasterDate.replace(/-/g, '/');
  console.log(formattedDate);
  var peopleTraveling = $("#people-traveling").val();
  console.log(peopleTraveling);
  var hotelLocation = $('#end').find(":selected").attr("id");
  console.log(hotelLocation);
  var hotelSearch = "'" + hotelLocation + "'";
  console.log(hotelSearch);
  searchTicketmaster();
  hotels("MEX", "2018-11-13", "2018-11-14");
});

function searchTicketmaster() {
  var responseSize = (20).toString();
  var apiKey = "8qqzR9xAATp2Wyh7mCELVegociPYsEVT";

  var queryURL2 =
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" +
    apiKey +
    "&countryCode=MX&size=" +
    responseSize +
    "&sort=date,asc" +
    "&startDateTime=" +
    ticketmasterDate +
    "T00:00:00Z" +
  "&stateCode=" +
  stateCode;

    console.log(queryURL2);

  $.ajax({
    url: queryURL2,
    method: "GET"
  }).then(function (response2) {
    let defaultEvents = [];
    let tempEvent = response2._embedded.events;
    console.log(tempEvent)

    for (let i = 0; i < tempEvent.length; i++) {
      if (
        tempEvent[i]._embedded.venues[0].location !== undefined &&
        tempEvent[i].info !== undefined
      ) {
        defaultEvents.push(tempEvent[i]);
      }
    }
    console.log(defaultEvents);
  })

}

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

var titleEvent1 = ""
var titleEvent2 = ""
var titleEvent3 = ""

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
    titleEvent1 = defaultEvents[0].name;
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
    titleEvent2 = defaultEvents[1].name;
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
    titleEvent3 = defaultEvents[2].name;
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

    eventCost = defaultEvents[0].priceRanges[0].min;

    initMap();
  });
}

// Function to determine the place and INEGI code for the routing function
function journeyStart(city) {
  $.ajax({
    url: "https://pacific-wave-84052.herokuapp.com/buscadestino",
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
    url: "https://pacific-wave-84052.herokuapp.com/cuota",
    method: "POST",
    data: {
      key: "rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG",
      startTrip: startTrip,
      endTrip: endTrip,
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
    responseInegi = response;
    console.log(responseInegi);
  });
}

// Function to determine fuel costs
function fuel() {
  $.ajax({
    url: "https://pacific-wave-84052.herokuapp.com/combustible",
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


  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  // The location of the center of Mexico
  var mexico = {
    lat: 23.6345,
    lng: -102.5528,
  };

  // The map, centered at Mexico
  var map = new google.maps.Map(
    document.getElementById('map'), {
      zoom: 5,
      center: mexico
    });

  directionsDisplay.setMap(map);

  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);

  // The three default event markers, empty by default.

  var event1location = {
    lat: eventsLatitude[0],
    lng: eventsLongitude[0],
    title: "Event 1",
  };

  var event2location = {
    lat: eventsLatitude[1],
    lng: eventsLongitude[1],
    title: "Event 2",
  };

  var event3location = {
    lat: eventsLatitude[2],
    lng: eventsLongitude[2],
    title: "Event 3",
  };

  // Marker for Event 1
  var markerEvent1 = new google.maps.Marker({
    position: event1location,
    map: map
  });

  var contentString1 = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h6 id="firstHeading" class="firstHeading">' + titleEvent1 + '</h6>'

  var infowindow1 = new google.maps.InfoWindow({
    content: contentString1
  });

  markerEvent1.addListener('click', function () {
    infowindow1.open(map, markerEvent1);
  });

  // Marker for Event 2
  var markerEvent2 = new google.maps.Marker({
    position: event2location,
    map: map
  });

  var contentString2 = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h6 id="firstHeading" class="firstHeading">' + titleEvent2 + '</h6>'

  var infowindow2 = new google.maps.InfoWindow({
    content: contentString2
  });

  markerEvent2.addListener('click', function () {
    infowindow2.open(map, markerEvent2);
  });

  // Marker for Event 3
  var markerEvent3 = new google.maps.Marker({
    position: event3location,
    map: map
  });

  var contentString3 = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h6 id="firstHeading" class="firstHeading">' + titleEvent3 + '</h6>'

  var infowindow3 = new google.maps.InfoWindow({
    content: contentString3
  });

  markerEvent3.addListener('click', function () {
    infowindow3.open(map, markerEvent3);
  });

}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: 'DRIVING'
  }, function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

}

// function displayRoute() {
//   // The location of Mexico
//   var mexico = {
//     lat: 19.3390515900001,
//     lng: -99.06427109

//     //23.368116,
//     //-102.268791
//   };

//   var mexico2 = {
//     lat: 20.3390515900001,
//     lng: -102.06427109

//     //23.368116,
//     //-102.268791
//   };
//   // The map, centered at Mexico
//   var map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 5,
//     center: mexico
//   });
//   // The marker, positioned at Mexico
//   var marker = new google.maps.Marker({
//     position: mexico,
//     map: map
//   });

//   var marker2 = new google.maps.Marker({
//     position: mexico2,
//     map: map
//   });
// }

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
        .attr("id", "hotel")
        .attr("href", "#1")
        .attr("data", finalRate)
        .text(hotelName + " $" + finalRate);

      // Creating an image tag
      var pricetag = $("<span>")
        .attr("class", "new badge")
        .attr("data-badge-caption", " ")
        .attr("data", finalRate)
        .text("$" + finalRate);

      //$("#").append(pricetag);
      $("#hotelsArea").append(hotel);

    };
    console.log(hotelsObject);
    hotelCost1 = response.hotelResultSet[0].min_rate.amount * 0.067;
  });
}





$(document).on("click", "#hotel", function () {

  var casetas = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "caseta")
    .attr("href", "#1")
    .text("Toll Costs: " + "$" + responseInegi.data.costo_caseta);

  $("#finalArea").append(casetas);

  // var kilometros = $("<a>")
  //   .attr("class", "collection-item")
  //   .attr("id", "kilometros")
  //   .attr("href", "#1")
  //   .text("Kilómetros Totales: " + responseInegi.data.long_km);

  // $("#finalArea").append(kilometros);

  var kmpl = 10.54356;
  var costoCombustible = 19.65;
  var dato = responseInegi.data.long_km / kmpl * costoCombustible;
  var datoFinal = dato.toFixed(2);

  var combustible = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "combustible")
    .attr("href", "#1")
    .text("Fuel Cost: " + "$" + datoFinal);

  $("#finalArea").append(combustible);

  var amountOfPeople = $('#people-traveling').find(":selected").attr("value");

  peopleEvent = eventCost * amountOfPeople;

  var totalevent = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "costoevento")
    .attr("href", "#1")
    .text("Ticket Cost: " + "$" + peopleEvent);

  $("#finalArea").append(totalevent);

  var hotel2 = hotelCost1.toFixed(2);
  console.log(hotel2);

  var selecthotel = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "costohoteles")
    .attr("href", "#1")
    .text("Hotel Cost: " + "$" + hotel2);

  $("#finalArea").append(selecthotel);

  var costodetodo = parseInt(responseInegi.data.costo_caseta, 10) + parseInt(datoFinal, 10) + parseInt(peopleEvent, 10) + parseInt(hotel2, 10);
  console.log(costodetodo);

  var totalCost = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "costohoteles")
    .attr("href", "#1")
    .text("Total Cost: " + "$" + costodetodo);

  $("#finalArea").append(totalCost);

  var convert = costodetodo.toString();
  var revert = parseInt(convert, 10);

  var personExpense = (revert / amountOfPeople).toFixed(2);

  var personCost = $("<a>")
    .attr("class", "collection-item")
    .attr("id", "costohoteles")
    .attr("href", "#1")
    .text("Cost per Person: " + "$" + personExpense);

  $("#finalArea").append(personCost);

});