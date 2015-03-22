/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Ajax = require('ajax');
var Vector2 = require('vector2');

var splashWindow = new UI.Window();
var text = new UI.Text({
  position: new Vector2(0,0),
  size: new Vector2(144, 168),
  text: 'Downloading weather data...',
  font: 'GOTHIC_28_BOLD',
  color: 'black',
  textOverFlow: 'wrap',
  textAlign: 'center',
  backgroundColor: 'white'
});


splashWindow.add(text);
splashWindow.show();

var parseFeed = function(data){
  var items = [];
  for(var i=0; i < data.cnt; i++){
    var title = data.list[i].weather[0].main;
    title = title.charAt(0).toUpperCase() + title.substring(1);
    
    var time = data.list[i].dt_txt;
    time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);
    time = time.replace('-','/');
    
    items.push({title: title, subtitle: time});    
  }
  return items;
};



var cityName = 'Bangalore', 
    URL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName;
Ajax(
  {
    url:URL,
    type:'json'
  },
  function(data){
    //Success
    console.log('Successfully fetched data!');
    var menuItems = parseFeed(data,10);
    
    for(var i=0; i < menuItems.length; i++ ){
      console.log(menuItems[i].title + '|' + menuItems[i].subtitle);
    }

    var resultsMenu = new UI.Menu({
      sections:[{
        title: 'Current Forecast: ' + cityName,
        items: menuItems
      }]
    });
    resultsMenu.show();
    splashWindow.hide();
   
    // Add an action for SELECT
    resultsMenu.on('select', function(e) {
  
      // Get that forecast
      var forecast = data.list[e.itemIndex];
      
      // Assemble body string
      var content = data.list[e.itemIndex].weather[0].description;
      
      // Capitalize first letter
      content = content.charAt(0).toUpperCase() + content.substring(1);
      
      // Add temperature, pressure etc
      content += '\nTemperature: ' + Math.round(forecast.main.temp - 273.15) + '°C' +
        '\nPressure: ' + Math.round(forecast.main.pressure) + ' mbar' +
        '\nWind: ' + Math.round(forecast.wind.speed) + ' mph, ' + 
        Math.round(forecast.wind.deg) + '°';
      
       // Create the Card for detailed view
      var detailCard = new UI.Card({
        title:'Details',
        subtitle: e.item.subtitle,
        body: content
      });
      detailCard.show();
    });   
  },
  function(error){
    console.log('Failed fetching weather data: ' + error);
  }
);

