var webdriverio = require('webdriverio');
var request = require('request');

var username = 'you@yourdomain.com';
var authkey = 'yourauthkey';
var options = {
  desiredCapabilities: {
    name: 'Selenium Test Example',
    build: '1.0',
    browser_api_name: "FF45",
    os_api_name: "Win10",
    browserName: 'firefox',
    record_video: 'true',
    record_network: 'true'
  },
  host: "hub.crossbrowsertesting.com",
  port: 80,
  user: username,
  key: authkey      // find this under the "Manage Account page of our app"
}

var sessionId;

//Call API to set the score
function setScore(score) {

    var result = { error: false, message: null }

    if (sessionId){
        
        request({
            method: 'PUT',
            uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + sessionId,
            body: {'action': 'set_score', 'score': score },
            json: true
        },
        function(error, response, body) {
            if (error) {
                result.error = true;
                result.message = error;
            }
            else if (response.statusCode !== 200){
                result.error = true;
                result.message = body;
            }
            else{
                result.error = false;
                result.message = 'success';
            }

        })
        .auth(username, authkey);
    }
    else{
        result.error = true;
        result.message = 'Session Id was not defined';
    }

}

// create your webdriverio.remote with your options as an argument
var client = webdriverio.remote(options);

client
    .init()
    .then(function() {
      sessionId = client.requestHandler.sessionID;
    })
    .url('http://www.google.com')
    .getTitle().then(function(title) {
        if (title === 'Google') {
          setScore('pass');
        } else {
          setScore('fail');
        }
    })
    .end();