$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.parallax').parallax();
  $('select').formSelect();
  $('.datepicker').datepicker();

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

  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();
  });

});
// $(".datepicker").pickadate({
//   closeOnSelect: true,
//   format: "dd/mm/yyyy"