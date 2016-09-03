import twilio from 'twilio'
import postgres from '../db/postgres'
import messages from './messages'
import schedule from 'node-schedule'

export async function dbExists () {
  return await postgres.postgresdbExists()
}

export async function handleTwilioResponse (messageBody) {
  const fromNum = messageBody.From
  const body = messageBody.Body.trim().toLowerCase().replace(/[\W]/g,'')
  const zipcode = messageBody.FromZip.trim().toLowerCase()
  const user = await postgres.getUser({phone: fromNum})
  if (user.length > 0 ){
    if (user[0].status == "NAME"){
      await postgres.updateUserName({phone: fromNum, name: body})
      await postgres.updateUserStatus({phone: fromNum, status: "ACTIVATED"})
      var twiml = new twilio.TwimlResponse()
      twiml.message(`Wonderful ${body}! Lookout for a text tomorrow morning ☺️`)
      return twiml.toString()
    } else {
      const twiml = await messages.generateGifResponse(body)
      console.log(twiml)
      return twiml
    }
  } else {
     postgres.createUser({phone: fromNum, zipcode: zipcode, status: "NAME"})
     var twiml = new twilio.TwimlResponse()
     twiml.message("Hey, welcome to our chatbot. We'll be sending you a good morning text and cute gif every day. What is your name?")
     return twiml.toString()
  }
}

function sendMorningTextToAllUsers () {
  postgres.getAllUsers().then((users)=> {
    for (const user of users) {
      messages.sendMorningMessage(user.zipcode,"cute puppies",user.name,user.phone)
    }
  })
}

export async function scheduleMorningTextToAllUsers () {
  schedule.scheduleJob('00 30 15 * * 0-6',function(){
    sendMorningTextToAllUsers()
  })
}

export default exports
