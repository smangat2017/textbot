import twilio from 'twilio'


export async function handleTwilioResponse (messageBody) {
  return new Promise((resolve, reject) => {
    const fromNum = messageBody.From
    const body = messageBody.Body.trim().toLowerCase().replace(/[\W]/g,'')
    const zipcode = messageBody.FromZip.trim().toLowerCase()
    resolve(true)
  })
  //Pull user state
  //Switch statements based on status
  //New User (subscribe) - Hi! My name is Beebs. I'm a chatbot that'll send you a good morning text and cute gif every day. What is your name?
  //EnterName - Proces Name and update User value. Response: Wonderful ___. I currently have your zip code (for weather updates). Is this correct?
  //EnterZipcode - Amazing, lookout for a text tomorrow morning.
  //Else (send gif response)
  // if( body === 'subscribe' ) {
  //   if(profiles.indexOf(fromNum) !== -1) {
  //     resp.message('You already subscribed!')
  //   } else {
  //     resp.message('Thank you, you are now subscribed. Reply "STOP" to stop receiving updates.')
  //     firebase.usersRef.push({number: fromNum, zipcode: zipcode})
  //   }
  //   res.send(resp.toString())
  // } else {
  //   messages.generateGifResponse(body).then(function(twiml){
  //     res.send(twiml.toString())
  //   })
  // }

}

export default exports
