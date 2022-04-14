const axios = require("axios");
const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler");
require("dotenv").config();
const { SAMIP_NUMBER, TWILIO_SID, TWILIO_AUTH_TOKEN } = process.env;

// Available APIS

const NOW_SHOWING = "https://api.qfxcinemas.com/api/public/NowShowing";
const COMING_SOON = "https://api.qfxcinemas.com/api/public/ComingSoon";

// Not used here, but might be handy someday
const DATE_AND_TIME =
  "https://api.qfxcinemas.com/api/public/ShowInformation?eventId=7631&showDate=2021-11-16";

//-------------------------------------------

// The movie you want to check tickets for:
// ! Use SMALL LETTERS in movies name
const MOVIE_NAME = "k.g.f";
const SCAN_INTERVAL = 120; // (in seconds)

// Phone Numbers to Notify
const numbers = [SAMIP_NUMBER];
let toCall = true;
let toSMS = true;

// creating Twilio Client
const client = require("twilio")(TWILIO_SID, TWILIO_AUTH_TOKEN);

const makeCall = () => {
  if (toCall) {
    console.log("Calling...");

    client.calls
      .create({
        url: "http://demo.twilio.com/docs/voice.xml",
        to: SAMIP_NUMBER,
        from: "+19033548195",
      })
      .then((call) => console.log(call.sid))
      .catch((err) => console.log(err));

    toCall = false;
  } else {
    console.log("Phone Calls are disabled. Check the 'toCall' variable!");
    return;
  }
};

const makeSMS = (message) => {
  if (toSMS) {
    console.log("Sending SMS...");

    client.messages
      .create({
        to: SAMIP_NUMBER,
        from: "+19033548195",
        body: message,
      })
      .then((msg) => {
        console.log(msg.sid);
        toSMS = false;
        console.log("SMS Sent");
      })
      .catch((err) => console.log(err));
  } else {
    console.log("SMS are disabled. Check the 'toSMS' variable!");
    return;
  }
};

const checkNowShowing = async () => {
  const { data: responseData } = await axios.get(NOW_SHOWING);
  const movieArray = responseData.data;
  for (let i = 0; i < movieArray.length; i++) {
    if (movieArray[i].name.toLowerCase().includes(MOVIE_NAME)) {
      console.log(
        "🎟️🎦 Yay! Your Movie '" +
          movieArray[i].name +
          "' is available & its Now Showing!"
      );
      console.log(
        `✅ Here is the Link: https://www.qfxcinemas.com/show?eventId=${movieArray[i].eventID}`
      );
      // TODO: Make a call or an SMS

      if (toSMS) {
        client.messages
          .create({
            to: SAMIP_NUMBER,
            from: "+19033548195",
            body: `Yay! Your Movie '${movieArray[i].name}' is available & its Now Showing!
            Here is the Link: https://www.qfxcinemas.com/show?eventId=${movieArray[i].eventID}`,
          })
          .then((msg) => {
            console.log(msg.sid);
            toSMS = false;
            console.log("SMS Sent");
          })
          .catch((err) => console.log(err));
      }
      if (toCall) {
        client.calls
          .create({
            url: "http://demo.twilio.com/docs/voice.xml",
            to: SAMIP_NUMBER,
            from: "+19033548195",
          })
          .then((call) => {
            console.log(call.sid);
          })
          .catch((err) => console.log(err));
      }
    }
  }
};

const checkComingSoon = async () => {
  const { data: responseData } = await axios.get(COMING_SOON);
  const movieArray = responseData.data;
  for (let i = 0; i < movieArray.length; i++) {
    if (movieArray[i].name.toLowerCase().includes(MOVIE_NAME)) {
      if (movieArray[i].hasBuyTicket) {
        console.log(
          "🎟️🔜 Yay! Tickets for '" +
            movieArray[i].name +
            "' is available & its Coming Soon!"
        );
        console.log(
          `✅ Here is the Link: https://www.qfxcinemas.com/show?eventId=${movieArray[i].id}`
        );
        // TODO: Make a call or an SMS
        if (toSMS) {
          client.messages
            .create({
              to: SAMIP_NUMBER,
              from: "+19033548195",
              body: `Yay! Tickets for '${movieArray[i].name}' is available & its Coming Soon.
              Here is the Link: https://www.qfxcinemas.com/show?eventId=${movieArray[i].id}`,
            })
            .then((msg) => {
              console.log(msg.sid);
              toSMS = false;
              console.log("SMS Sent");
            })
            .catch((err) => console.log(err));
        }
        if (toCall) {
          client.calls
            .create({
              url: "http://demo.twilio.com/docs/voice.xml",
              to: SAMIP_NUMBER,
              from: "+19033548195",
            })
            .then((call) => {
              console.log(call.sid);
            })
            .catch((err) => console.log(err));
        }

        // process.exit();
      } else {
        console.log(
          "❌🔜 Movie is coming soon but tickets are not available yet"
        );
      }
    }
  }
};

const checkTickets = async () => {
  await checkComingSoon();
  // await checkNowShowing();
};

setInterval(checkTickets, 150000);

// const scheduler = new ToadScheduler();

// const task = new Task("simple task", () => {
//   checkTickets();
// });
// const job = new SimpleIntervalJob({ seconds: SCAN_INTERVAL }, task);

// scheduler.addSimpleIntervalJob(job);
