$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.parallax').parallax();
  $('select').formSelect();
  $('.datepicker').datepicker();
  $('.modal').modal();

  $(function () {
    $(".btn-floating").on('click', function () {

      console.log("Click registered.");
      $(".btn-floating").hide();
      $("#temp-card").hide();
      $("#events-section").css("opacity", "0.3");
      var selectedCard = $(this).closest('.card').clone(true);
      $("#selected-column").append(selectedCard);

    })

  })

  // Add smooth scrolling to all links
  $("#try-now").on('click', function (event) {

    console.log("Pressed 'Let's Go!'");
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 400, function () {

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  $(function () {
    $("#go-search").on('click', function () {

      var startPoint = $('#start').find(":selected").attr("data-inegi");
      var endPoint = $('#end').find(":selected").attr("data-inegi");
      console.log(startPoint);
      console.log(endPoint);
      routes(startPoint, endPoint);

    });




  })

  // $('.datepicker').pickadate({
  //   selectMonths: true, // Creates a dropdown to control month
  //   selectYears: 15 // Creates a dropdown of 15 years to control year
  // });

  //$('.datepicker').pickadate({
  // selectMonths: true,
  // selectYears: 15,
  // format: 'dd/mm/yyyy',
  //setDefaultDate: true,
  //defaultDate: '05/05/2017',

  //document.addEventListener('DOMContentLoaded', function() {
  //  var elems = document.querySelectorAll('.modal');
  //  var instances = M.Modal.init(elems, options);
  // });


});

// $(".datepicker").pickadate({
//   closeOnSelect: true,
//   format: "dd/mm/yyyy"