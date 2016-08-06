var twilio = require('twilio')
var config = require('./config')
var giphy = require('giphy-api')()
var fs = require('fs')
var request = require('request');
var Promise = require('promise');
var schedule = require('node-schedule')
var Forecast = require('forecast')
var zipdict = require(config.ZIPCODEJSON)

var client = twilio(config.TWILIOACCOUNTSID, config.TWILIOAUTHTOKEN)

var forecast = new Forecast({
  service: 'forecast.io',
  key: config.FORECASTAPITOKEN,
  units: 'farenheit', // Only the first letter is parsed
  cache: true,      // Cache API requests?
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 30,
    seconds: 0
    }
});


var getGifUrl = function(keyword){
  return new Promise(function(fulfill,reject){
      giphy.search({q: keyword, rating: 'pg', fmt: 'json'}).then(function(res){
        var image_array = res['data']
        var random_image = image_array[Math.floor(Math.random() * image_array.length)];
        var image_url = random_image['images']['downsized_medium']['url']
        if(image_url){
          fulfill(image_url);
        }else{
          fulfill(config.DEFAULTPUPPYGIF);
        }
    });
  });
}

var sendText = function(to,body,mediaurl){
  client.messages.create({
    to : "5106763950",
    from : config.TWILIONUMBER,
    body : body,
    mediaUrl: mediaurl
  },function(err,message){
    if(err) console.log(err)
    console.log(message.sid)
  });
}

var generateGifResponse = function(keyword){
  return new Promise(function (fulfill,reject){
      var twiml = new twilio.TwimlResponse();
      getGifUrl(keyword).then(function(image_url){
        twiml.message('',function(){
          this.media(image_url);
        });
        fulfill(twiml.toString())
      })
  });
};

var generateWeatherResponse = function(zipcode){
  return new Promise(function(fulfill,reject){
      forecast.get(zipdict[zipcode],function(err,weather){
        if(err) return console.log(err)
        fulfill(weather['hourly']['summary'])
    });
  });
}

var generateMorningMessage = function(zipcode,keyword,name,number){
  var keyword = keyword || "cute puppies";
  var name = name || "there"
  getGifUrl(keyword).then(function(media_url){
    generateWeatherResponse(zipcode).then(function(weather_summary){
      var goodmorning = "Good morning " + name + "!" + " The weather seems " + weather_summary.toLowerCase() + " Hope you have a great day! :)";
      sendText(number,goodmorning,media_url);
    });
  });
};



module.exports = {
  generateGifResponse: generateGifResponse,
  generateWeatherResponse: generateWeatherResponse,
  generateMorningMessage: generateMorningMessage
}
