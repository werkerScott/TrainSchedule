// App Structure...
// ------ METHODS                        -------- 
// ------ INITIALIZE FIREBASE            -------- 
// ------ DATA EVENT LISTENER            --------
// ------ FORM EVENT SUBMISSION LISTENER -------- 



// ------ METHODS                        -------- 
app = {

  train:0,
  destination:0,
  frequency:0,
  arrivalFirst:0,
  remainderTime:0, 
  minutesAway:0,                                               
  arrivalNext:0,                                                 


  addRow: function(train, destination, frequency, arrivalNext, minutesAway) {
    var row = $('<tr>');
    row.append('<td>' + train        + '</td>');
    row.append('<td>' + destination  + '</td>');
    row.append('<td>' + frequency    + '</td>');
    row.append('<td>' + arrivalNext  + '</td>');
    row.append('<td>' + minutesAway  + '</td>');
    $('.table tbody').append(row);
  },


  clearFields: function() {
    $('#display_trainName').val("");
    $('#display_trainDestination').val("");
    $('#display_trainFrequency').val("");
    $('#display_trainArrival').val("");
  },


  conversions: function(frequency, arrivalFirst) {

    var arrivalFirst_converted = 0;
    var currentTime = 0;
    var diffTime = 0;
    var remainderTime = 0;
                                                   
    arrivalFirst_converted = moment(arrivalFirst, "hh:mm").subtract(1, "years");

    // Current Time
    currentTime = moment();

    // Difference between the times
    diffTime = moment().diff(moment(arrivalFirst_converted), "minutes");

    // Time apart (remainder)
    remainderTime = diffTime % frequency;

    // Minute Until Train
    this.minutesAway = frequency - remainderTime;

    // Next Train
    this.arrivalNext = moment().add(this.minutesAway, "minutes");
    this.arrivalNext = moment(this.arrivalNext).format("hh:mm");
  },


  pushtodatabase: function(train, destination, frequency, arrivalNext, minutesAway) {
    database.ref().push({
      dbTrain: train,
      dbDestination: destination,
      dbFrequency: frequency,
      dbNextArrival: arrivalNext,
      dbMinutesAway: minutesAway
    });

  this.clearFields(); 

  }

};





// ------ INITIALIZE FIREBASE            -------- 
var config = {
  apiKey: "AIzaSyB9h-o6Bt1nQ1ilc40LfgbfOX26VQwXWWw",
  authDomain: "trains-f69be.firebaseapp.com",
  databaseURL: "https://trains-f69be.firebaseio.com",
  projectId: "trains-f69be",
  storageBucket: "trains-f69be.appspot.com",
  messagingSenderId: "244223876770"
};

firebase.initializeApp(config);

// Make database referenceable variable
var database = firebase.database();





// ------ DATA EVENT LISTENER            --------
// Load data into the UI anytime a new child node is added
database.ref().on("child_added", function(childSnapshot) {
  var sv = childSnapshot.val();
  console.log("childAdded");
  // The form data was grabbed, calculations performed, saved to database, then database returns data to be displayed
  // Pass the key/values to the function
  app.addRow(sv.dbTrain, sv.dbDestination, sv.dbFrequency, sv.dbNextArrival, sv.dbMinutesAway);
  // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});





// ------ FORM EVENT SUBMISSION LISTENER -------- 
// Grab data from the form, perform calculations, save to database
$('#submit').on('click', function(){
  event.preventDefault();

  // grab data from form
  app.train = $('#display_trainName').val().trim();
  app.destination = $('#display_trainDestination').val().trim();
  app.frequency = $('#display_trainFrequency').val().trim();
  app.arrivalFirst = $('#display_trainArrival').val().trim();
 
  // pass data for conversion
  app.conversions(app.frequency, app.arrivalFirst);

  // pass data for writing to database
  app.pushtodatabase(app.train, app.destination, app.frequency, app.arrivalNext, app.minutesAway);
  
});



