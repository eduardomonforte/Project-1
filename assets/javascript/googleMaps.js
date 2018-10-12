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

var responseSize = (3).toString()
var apiKey = "8qqzR9xAATp2Wyh7mCELVegociPYsEVT"

var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&countryCode=MX&size=" + responseSize + "&sort=date,asc"

function start() {

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    console.log(response);

    var defaultEvents = response._embedded.events

    console.log(defaultEvents);

    $("#event1image").attr("src", defaultEvents[0].images[0].url);
    $("#event1title").text(defaultEvents[0].name);
    $("#event1description").text(defaultEvents[0].info)

    $("#event2image").attr("src", defaultEvents[1].images[0].url);
    $("#event2title").text(defaultEvents[1].name);
    $("#event2description").text(defaultEvents[1].info)

    $("#event3image").attr("src", defaultEvents[2].images[0].url);
    $("#event3title").text(defaultEvents[2].name);
    $("#event3description").text(defaultEvents[2].info)

    for (i = 0; i < defaultEvents.length; i++) {

        defaultEventsLatitude = parseFloat(defaultEvents[i]._embedded.venues[0].location.latitude);
        eventsLatitude.push(defaultEventsLatitude);
        defaultEventsLongitude = parseFloat(defaultEvents[i]._embedded.venues[0].location.longitude);
        eventsLongitude.push(defaultEventsLongitude);

    }

    initMap();

});

};

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
            proj: "GRS80",

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
            proj: "GRS80",

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
        lng: -102.5528,
    };

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

    // The map, centered at Mexico
    var map = new google.maps.Map(
        document.getElementById('map'), {
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
    var map = new google.maps.Map(
        document.getElementById('map'), {
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