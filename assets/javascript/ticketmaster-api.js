console.log("Ready.");

$(document).ready(function() {

    console.log("Even more ready.")

    var responseSize = (3).toString()
    var apiKey = "8qqzR9xAATp2Wyh7mCELVegociPYsEVT"

    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&countryCode=MX&size=" + responseSize

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {

        console.log(response);

    });

});