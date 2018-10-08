// Initialize and add the map
function initMap() {
    // The location of Mexico
    var mexico = {
        lat: 23.368116,
        lng: -102.268791
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