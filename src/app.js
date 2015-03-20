/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Ajax = require('ajax');


// Initialize a card face
var card = new UI.Card(
  {
    title:'Weather',
    subtitle:'Fetching...'
  }
);

// Display the card
card.show();

var cityName = 'Bangalore', 
    URL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName;
Ajax(
  {
    url:URL,
    type:'json'
  },
  function(data){
    //Success
    console.log('Successfully fetched data!');
    
    var location = data.name, 
        temperature = Math.round(data.main.temp - 273.15) + 'C',
        description = data.weather[0].description;
    description = description.charAt(0).toUpperCase() + description.substring(1);
    
    card.subtitle(location + ', ' + temperature);
    card.body(description);
    
    
  },
  function(error){
    console.log('Failed fetching weather data: ' + error);
  }
);

