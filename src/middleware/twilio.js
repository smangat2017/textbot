import express from 'express'
import response from './response'

const router = express.Router()

//Dummy endpoint to make sure server is working
router.get('/', (req,res) => {
  response.dbExists().then((resp) => {
    res.json(resp)
  }).catch((err) => {
    res.json(err)
  })
})

router.post('/api', (req,res,next) => {
  response.handleTwilioResponse(req.body).then((resp) => {
    res.send(resp)
  }).catch((err) => {
    res.json(err)
  })

})

response.scheduleMorningTextToAllUsers()

export default router
