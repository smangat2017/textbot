import twilio from 'twilio'
import giphy from 'giphy-api'
import request from 'request'
import Forecast from 'forecast'
import zipdict from '../zipcode-latlong.json'
import { TWILIOACCOUNTSID, TWILIOAUTHTOKEN, ZIPCODEJSON, FORECASTAPITOKEN, DEFAULTPUPPYGIF, TWILIONUMBER } from '../config'

const giphyclient = giphy()

const client = twilio(TWILIOACCOUNTSID, TWILIOAUTHTOKEN)

const forecast = new Forecast({
  service: 'forecast.io',
  key: FORECASTAPITOKEN,
  units: 'farenheit', // Only the first letter is parsed
  cache: true,      // Cache API requests?
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 30,
    seconds: 0
    }
})


export async function getGifUrl (keyword) {
    const res = await giphyclient.search({q: keyword, rating: 'pg', fmt: 'json'})
    const image_array = res['data']
    const random_image = image_array[Math.floor(Math.random() * image_array.length)]
    const image_url = random_image['images']['downsized_medium']['url']
    if(image_url){
      return image_url
    } else{
      return DEFAULTPUPPYGIF
    }
}

export function sendText (to,body,mediaurl) {
  client.messages.create({
    to : to,
    from : TWILIONUMBER,
    body : body,
    mediaUrl: mediaurl
  }, function(err,message){
    if(err) console.log(err)
    console.log(message.sid)
  })
}

export async function generateGifResponse (keyword){
    var twiml = new twilio.TwimlResponse()
    const image_url = await getGifUrl(keyword)
    twiml.message('', function(){
      this.media(image_url)
    })
    console.log(twiml.toString())
    return twiml.toString()
}

export async function generateWeatherResponse (zipcode){
  return new Promise(function(resolve,reject){
      forecast.get(zipdict[zipcode],function(err,weather){
        if(err) return console.log(err)
        resolve(weather['hourly']['summary'])
    })
  })
}

export function sendMorningMessage (zipcode,keyword ="cute puppies",name="there",phone){
  getGifUrl(keyword).then(function(media_url){
    generateWeatherResponse(zipcode).then(function(weather_summary){
      const goodmorning = "Good morning " + name + "!" + " The weather seems " + weather_summary.toLowerCase() + " Hope you have a great day! ❤️☺️"
      sendText(phone,goodmorning,media_url)
    })
  })
}

export default exports
