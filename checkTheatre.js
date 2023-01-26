const axios = require('axios');
const notifier = require('node-notifier');
const open = require('open');

// types of notification:
//1. Opens a new tab in your default browser
// 2. Gives you a notification (Tested only on windows)
const TO_OPEN_LINK = true;
const TO_NOTIFY = true;

const notify = () => {
  notifier.notify(
    {
      title: 'Tickets Available',
      message: '🥳 Yes Film available in Civil', // Absolute path (doesn't work on balloons)
      sound: true, // Only Notification Center or Windows Toasters
      wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {
      if (err) {
        console.log('Failed to create windows notification');
      }
    }
  );
};

const checkTheatre = () => {
  axios
    .get(
      'https://api.qfxcinemas.com/api/public/ShowInformation?eventId=7751&showDate=2022-07-08'
    )
    .then((res) => res.data)
    .then((result) => {
      if (result.data.showTheatres) {
        result.data.showTheatres.forEach((theatre) => {
          if (theatre.theatreName === 'QFX Civil Mall') {
            TO_OPEN_LINK &&
              open('https://www.qfxcinemas.com/show?eventId=7751');
            TO_NOTIFY && notify();
            console.log('🥳🥳🥳 Yes Film available in Civil');
          } else {
            console.log(
              'Available in ✅' + theatre.theatreName + ' but not in Civil❌'
            );
          }
        });
        console.log('---------------------');
      } else {
        console.log('❌ No shows for this date yet!');
      }
    })
    .catch((err) => console.error('API request failed!'));
};

module.exports = { notify };
