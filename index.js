import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import { PORT } from './config'
import twilio from './middleware/twilio'

const app = express()


app.set('port', PORT);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/twilio', twilio)


app.listen(app.get('port'), function() {
  console.log('Server listening on port ' + PORT);
});
