



// INITIALIZE FIREBASE
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

// DATA EVENT LISTENER
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

// METHODS
app = {
  addRow: function(train, destination, frequency, arrivalNext, minutesAway) {
    var row = $('<tr>');
    row.append('<td>' + train        + '</td>');
    row.append('<td>' + destination  + '</td>');
    row.append('<td>' + frequency    + '</td>');
    row.append('<td>' + arrivalNext  + '</td>');
    row.append('<td>' + minutesAway  + '</td>');
    $('.table tbody').append(row);
  }

  clearFields: function() {
    $('#display_trainName').val("");
    $('#display_trainDestination').val("");
    $('#display_trainFrequency').val("");
    $('#display_trainArrival').val("");
  }
}


// FORM EVENT SUBMISSION LISTENER
// Grab data from the form, perform calculations, save to database
$('#submit').on('click', function(){
  event.preventDefault();
  
  var train = $('#display_trainName').val().trim();                 // form, database, page
  var destination = $('#display_trainDestination').val().trim();    // form, database, page
  var frequency = $('#display_trainFrequency').val().trim();        // form, database, page
  var arrivalFirst = $('#display_trainArrival').val().trim();       // form
  var arrivalFirst_converted;                                       // calculated
  var currentTime;                                                  // calculated
  var diffTime;                                                     // calculated
  var remainderTime;                                                // calculated
  var arrivalNext;                                                  // database, page 
  var minutesAway;                                                  // database, page
                           
  // PERFORM CALCULATIONS
  // First Time (pushed back 1 year to make sure it comes before current time)
  arrivalFirst_converted = moment(arrivalFirst, "hh:mm").subtract(1, "years");
  console.log(arrivalFirst_converted);

  // Current Time
  currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  diffTime = moment().diff(moment(arrivalFirst_converted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  remainderTime = diffTime % frequency;
  console.log(remainderTime);

  // Minute Until Train
  minutesAway = frequency - remainderTime;
  console.log("MINUTES TILL TRAIN: " + minutesAway);

  // Next Train
  arrivalNext = moment().add(minutesAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(arrivalNext).format("hh:mm"));
  console.log(arrivalNext);
  arrivalNext = moment(arrivalNext).format("hh:mm");

  // WRITE TO DATABASE
  database.ref().push({
    dbTrain: train,
    dbDestination: destination,
    dbFrequency: frequency,
    dbNextArrival: arrivalNext,
    dbMinutesAway: minutesAway
  });

  app.clearFields();
});



