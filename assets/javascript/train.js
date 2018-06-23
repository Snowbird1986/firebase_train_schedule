$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyAWuD5v2YHFiILLw451AqIwwCWAc9LK7Ag",
        authDomain: "train-project-330b1.firebaseapp.com",
        databaseURL: "https://train-project-330b1.firebaseio.com",
        projectId: "train-project-330b1",
        storageBucket: "train-project-330b1.appspot.com",
        messagingSenderId: "857624317506"
      };
      firebase.initializeApp(config);
    var database = firebase.database();
    moment().format();
    console.log(moment().format());
    console.log(moment());
    console.log(moment().hours());
    console.log(moment().minutes());

    

    var names = [];
    var destinations = [];
    var firstArrivals = [];
    var frequencies = [];
    var nextArrivals = [];
    var minsAway = []
    

    updateNextAndMinAway()
    function renderTrains() {
        
        database.ref().on("value", function(snapshot) {
        $("#addTrains").empty();
        for (var i = 0; i < snapshot.val().names.length; i++) {

            // Then dynamicaly generates buttons for each movie in the array
            // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
            
            var row = $("<div>").addClass("row").addClass("trains-view") 
            var a = $("<div>").addClass("col-md-4").attr("id", "trainNameDiv").text(snapshot.val().names[i]);;
            var b = $("<div>").addClass("col-md-2").attr("id", "destinationDiv").text(snapshot.val().destinations[i]);
            var c = $("<div>").addClass("col-md-2").attr("id", "frequencyDiv").text(snapshot.val().frequencies[i]);
            var d = $("<div>").addClass("col-md-2").attr("id", "nextArrivalDiv").text(snapshot.val().nextArrivals[i]);
            var e = $("<div>").addClass("col-md-2").attr("id", "minAwayDiv").text(snapshot.val().minsAway[i]);


            var train = row.append(a).append(b).append(c).append(d).append(e)
            // Added the button to the buttons-view div
            $("#addTrains").append(train);
        }}, function(errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        };

    $("#run-search").on("click", function(event) {
        // Don't refresh the page!
        event.preventDefault();
        var name = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var firstArrival = $("#first-time").val().trim();
        var frequency = $("#frequency").val().trim();
        var minutes = moment(firstArrival).minutes();
        var hours = moment(firstArrival).hours();
        var nextArrival = firstArrival;
        var minAway = 0


      
        if(moment().hours()>hours){
            var hourOverlap = Math.floor((parseFloat(minutes)+parseFloat(frequency))/60)
            nextArrival = moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")=="23:59" ? firstArrival: moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")
            // nextArrival = (parseFloat(hours)+parseFloat(hourOverlap))+":"+((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap)))
            // console.log(moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm"))
            hours = moment(nextArrival).hours()
            minutes = moment(nextArrival).minutes()
        }
        else if(moment().hours()==hours && moment().minutes()>=minutes){
            var hourOverlap = Math.floor((parseFloat(minutes)+parseFloat(frequency))/60)
            nextArrival = moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")=="23:59" ? firstArrival: moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")
            // nextArrival = (parseFloat(hours)+parseFloat(hourOverlap))+":"+((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap)))
            // console.log(moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm"))
            hours = moment(nextArrival).hours()
            minutes = moment(nextArrival).minutes()
        }
        if(moment().hours()<hours){
            minAway = ((hours-moment().hours())*60)+(minutes - moment().minutes())
        }
        else if(moment().hours()==hours && moment().minutes()<minutes){
            minAway = (minutes - moment().minutes())
        }

        names.push(name)
        destinations.push(destination)
        firstArrivals.push(firstArrival)
        frequencies.push(frequency)
        nextArrivals.push(nextArrival)
        minsAway.push(minAway)
        
        
        
        database.ref().set({
            names: names,
            destinations: destinations,
            firstArrivals: firstArrivals,
            frequencies: frequencies,
            nextArrivals: nextArrivals,
            minsAway: minsAway,
            });
            renderTrains()
            $("#train-name").val("");
            $("#destination").val("");
            $("#first-time").val("");
            $("#frequency").val("");
        });
    $("#clear-all").on("click", function(event) {
        // Don't refresh the page!
        event.preventDefault();
        names = [];
        destinations = [];
        firstArrivals = [];
        frequencies = [];
        nextArrivals = [];
        minsAway = [];
        database.ref().set({
            names: names,
            destinations: destinations,
            firstArrivals: firstArrivals,
            frequencies: frequencies,
            nextArrivals: nextArrivals,
            minsAway: minsAway,
            });
        renderTrains()
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-time").val("");
        $("#frequency").val("");
    });
    refreshInterval = setInterval(updateNextAndMinAway,60000);
    function updateNextAndMinAway (){
        database.ref().on("value", function(snapshot) {
            if (snapshot.child("names").exists()){
                names = [];
                destinations = [];
                firstArrivals = [];
                frequencies = [];
                minsAway = []
                nextArrivals = [];
                for (var j = 0; j < snapshot.val().names.length; j++) {
                    var minutes = snapshot.val().nextArrivals[j].substring(3, );
                    var hours = snapshot.val().nextArrivals[j].substring(0, 2);
                    var frequency = snapshot.val().frequencies[j]
                    var nextArrival = snapshot.val().nextArrivals[j]
                    minAway= ((moment().hours()-hours+24)*60)+(minutes - moment().minutes())
                    
                    if(moment().hours()>hours){
                        var hourOverlap = Math.floor((parseFloat(minutes)+parseFloat(frequency))/60)
                        nextArrival = moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")=="23:59" ? firstArrival[j]: moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")
                        // nextArrival = (parseFloat(hours)+parseFloat(hourOverlap))+":"+((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap)))
                        // console.log(moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm"))
                        hours = moment(nextArrival).hours()
                        minutes = moment(nextArrival).minutes()
                      }
                      else if(moment().hours()==hours && moment().minutes()>=minutes){
                        var hourOverlap = Math.floor((parseFloat(minutes)+parseFloat(frequency))/60)
                        nextArrival = moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")=="23:59" ? firstArrival: moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm")
                        // nextArrival = (parseFloat(hours)+parseFloat(hourOverlap))+":"+((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap)))
                        // console.log(moment().hours(parseFloat(hours)+parseFloat(hourOverlap)).minutes((parseFloat(minutes)+parseFloat(frequency))-(60*parseFloat(hourOverlap))).format("HH:mm"))
                        hours = moment(nextArrival).hours()
                        minutes = moment(nextArrival).minutes()
                      }
                      if(moment().hours()<hours){
                        minAway = ((hours-moment().hours())*60)+(minutes - moment().minutes())
                      }
                      else if(moment().hours()==hours && moment().minutes()<minutes){
                        minAway = (minutes - moment().minutes())
                      }

                    names.push(snapshot.val().names[j])
                    destinations.push(snapshot.val().destinations[j])
                    firstArrivals.push(snapshot.val().firstArrivals[j])
                    frequencies.push(snapshot.val().frequencies[j])
                    nextArrivals.push(nextArrival)
                    minsAway.push(minAway)
                    }
                database.ref().set({
                    names: names,
                    destinations: destinations,
                    firstArrivals: firstArrivals,
                    frequencies: frequencies,
                    nextArrivals: nextArrivals,
                    minsAway: minsAway,
                    });
                renderTrains()
            }
        });
    }
});