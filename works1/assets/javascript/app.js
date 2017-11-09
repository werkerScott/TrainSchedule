



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




// // DATA EVENT LISTENER
// database.ref().on("value", function(snapshot) {

//   var sv = snapshot.val();
//   console.log(sv);

//   // this passes all values in the row to a function that updates the display
//   for (var key in sv) {
//       addRow(sv.key.dbTrain,sv.key.dbDestination,sv.key.dbFrequency,sv.key.dbNext, sv.key.dbMinutes)
//   } 
//   // If any errors are experienced, log them to console.
// }, function(errorObject) {
//     console.log("The read failed: " + errorObject.code);
// });




// DATA EVENT LISTENER
database.ref().on("child_added", function(childSnapshot) {
var sv = childSnapshot.val();
console.log("childAdded");
addRow(sv.dbTrain, sv.dbDestination, sv.dbFrequency, sv.dbArrivalFirst, sv.dbCurrentTime);

  // If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// FORM EVENT SUBMISSION LISTENER
$('#submit').on('click', function(){
    event.preventDefault();
    
    var train = $('#display_trainName').val();
    var destination = $('#display_trainDestination').val();
    var arrivalFirst = $('#display_trainArrival').val();
    var frequency = $('#display_trainFrequency').val();

    // Add moment calculation
    // current time minus first arrival time divided by frequency. 
    // Remainder is minutes away = sv.dbMinutes
    // Current time + minutes away (sv.dbMinutes) = arrival, sv.dbNext

// Write to the database

sv.dbTrain, sv.dbDestination, sv.dbFrequency, sv.dbNext, sv.dbMinutes
    database.ref().push({
      dbTrain: train,
      dbDestination: destination,
      // dbFrequency: frequency,
      // dbArrivalFirst: arrivalFirst,
      dbCurrentTime: firebase.database.ServerValue.TIMESTAMP
    });
// 
});




var addRow = function(dateAdded, name, role, start, rate) {
    //calculate months worked
    // var monthsWorked = (dateAdded - start);

    var monthsWorked = moment(dateAdded).diff(start, "months");
    console.log(monthsWorked);

    //calculate total paid
    var billed = (parseInt(rate) * parseInt(monthsWorked));
    
    var row = $('<tr>');
    row.append('<td>' + name         + '</td>');
    row.append('<td>' + role         + '</td>');
    row.append('<td>' + start        + '</td>');
    row.append('<td>' + monthsWorked + '</td>');
    row.append('<td>' + rate         + '</td>');
    row.append('<td>' + billed       + '</td>');
    $('.table tbody').append(row);
}


});

