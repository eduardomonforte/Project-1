$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.parallax').parallax();
  $('select').formSelect();
  //$('.datepicker').datepicker();

  $('.datepicker').datepicker({
    selectMonths: true,
    selectYears: 15,
    format: 'dd/mm/yyyy',
    setDefaultDate: '05/05/2017',

  });
  // $(".datepicker").pickadate({
  //   closeOnSelect: true,
  //   format: "dd/mm/yyyy"

});