// Initialize and add the map
function initMap() {
    // The location of Mexico
    var mexico = {
        lat: 19.3390515900001,
        lng: -99.06427109

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
}

initMap();

var config = {
    apiKey: "AIzaSyAnPqkMczUMOzd77nUc-UquvnE5RiRew9Q",
    authDomain: "cbc-project-1.firebaseapp.com",
    databaseURL: "https://cbc-project-1.firebaseio.com",
    projectId: "cbc-project-1",
    storageBucket: "",
    messagingSenderId: "9954661068"
};
firebase.initializeApp(config);


function prueba() {
    $.ajax({
        url: "http://gaia.inegi.org.mx/sakbe_v3.1/libre",
        method: "POST",
        data: {
            key: "rZMkTZuI-ugbU-t1Y5-zCHg-0ZOETYT3r0HG",
            id_i: 1,
            source_i: 254,
            target_i: 255,
            id_f: 775167,
            source_f: 250771,
            target_f: 687808,
            v: 1,
            type: "json",
            proj: "GRS80",

        }

    }).done(function (response) {
        console.log(response.data.geojson);

    });
}