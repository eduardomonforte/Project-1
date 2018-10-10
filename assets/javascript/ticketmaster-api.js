console.log("Linked to Ticketmaster.");

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

        console.log(defaultEvents[0].images[0].url)

    });

});