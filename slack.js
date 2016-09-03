var app = require('express')();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');

var twilioAccount = 'ACe6c305938a6748af7cb63601bcdd7ae0';
var twilioToken = '03151a9c2af51068dcb55f8ec7b3a275';
var slackToken = 'xoxp-17672742610-20527903750-20526908529-aba1265e6b';

var twilio = require('twilio')(twilioAccount, twilioToken);

var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var rtm = new RtmClient(slackToken);
var slack = new WebClient(slackToken);

// login to slack
rtm.start();

// setup routing
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.post('/api',function(req,res){
  console.log(req);
  number = req.body.from.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  message = req.body.message;
  channel = rtm.dataStore.getChannelByName(number);

  if (!channel) {
    // create new channel if one doesn't already exist
    slack.channels.create(number, function (err, result) {
      if (result.ok) {
        // fix me: race condition?
        channel = rtm.dataStore.getChannelByName(number);

        // invite everyone in general to the new channel
        var general = rtm.dataStore.getChannelByName('general');
        for (id in general.members) {
          channel.invite(general.members[id]);
        }

        // send to slack
        rtm.sendMessage(message, channel.id);
      } else {
        console.log('Failed to create channel #%s', number);
      }
    });
  } else if (channel.is_archived) {
    slack.channels.unarchive(channel.id, function (err, result) {
      if (result.ok) {
        console.log('Unarchived the channel');
        // join new channel
        slack.channels.join(number, function (err, result) {
          console.log('Joined the channel');
          // invite everyone in general to the new channel
          var general = slack.getChannelByName('general');
          for (id in general.members) {
            channel.invite(general.members[id]);
          }

          // send to slack
          rtm.sendMessage(message, channel.id);
        });
      } else {
        console.log('Failed to unarchive channel #%s', number);
      }
    });
  } else {
    // send to slack
    rtm.sendMessage(message, channel.id);
  }

  res.sendStatus(200);
});

rtm.on(RTM_EVENTS.RTM_CONNECTION_OPENED, function() {
    console.log("Connected to %s as %s", slack.team.name, slack.self.name);
});

rtm.on(RTM_EVENTS.MESSAGE, function(message) {
    channel = rtm.dataStore.getChannelById(message.channel);

    if (channel && message.type == 'message') {
      to = channel.name.split('-').join('');
      data = message.text;

      // send to twilioif it's a phone number
      if (to.match(/\d{10}/)) {
        twilio.messages.create({
          from: "+16502851553",
          to: to,
          body: data,
        }, function(err, message) {
            if (err) console.log(err);
        });
      }
    }
});
