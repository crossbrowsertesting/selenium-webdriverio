# Getting Started with WebDriverIO and CrossBrowserTesting

* [Starting from Scratch](#starting-from-scratch)
  * [Simple Test](#simple-test)
  * [Test with Mocha](#test-with-mocha)
* [Converting Existing Test Suites](#converting-existing-test-suites)
* [Using the Local Connection](#using-the-local-connection)

Want a powerful and easy to use command line tool for running Selenium-JS tests? Like to shy away from asynchronous commands and race conditions? [WebDriverIO](http://webdriver.io/) might be the option for you. WebDriverIO provides language-bindings for the powerful browser-driving tool [Selenium](http://www.seleniumhq.org/docs/). Its test runner allows you to write your tests in a synchronous way so that you're not constantly in the world of asynchronous coding. Luckily WebDriverIO integrates easily with the CrossBrowserTesting platform, so you can perform tests on a wide variety of OS/Device/Browser combinations, all from one test. Let's walk through getting WebDriverIO tests running with CrossBrowserTesting.

## Starting from Scratch

You can configure WebDriverIO to use many different testing frameworks, such as [Chai](http://chaijs.com/) or [Mocha](https://mochajs.org/), and you can [read more on that here](http://webdriver.io/guide/getstarted/configuration.html). For our purposes, we'll start by writing a simple test, then give an example of how to utilize WebDriverIO with Mocha.

### Simple Test

First, create a folder for your test. From inside that folder, run the following commands (the `npm init` command will prompt for information about your project; if you are unsure, it is fine to leave those fields blank):

```
npm init
npm install webdriverio --save-dev
npm install request
```
`npm init` starts your project, `npm install webdriverio --save-dev` installs WebDriverIO into your project, and `npm install request` installs the request module.

Next, copy this script and save it as `wdio_test.js`. make sure to enter your username and authkey in the indicated places.

```javascript
var webdriverio = require('webdriverio');
var request = require('request');

var username = 'you@yourdomain.com';      // the email address associated with your account
var authkey = 'yourauthkey';          // can be found on the "Manage Account" page of our app
var options = {
  desiredCapabilities: {
    name: 'Selenium Test Example',
    build: '1.0',
    platform: "Win10",          // Gets latest version by default
    browserName: 'firefox',     // To specify version, add version: "desired version" (ex: version: "51")
    record_video: 'true',
    record_network: 'true'
  },
  host: "hub.crossbrowsertesting.com",
  port: 80,
  user: username,
  key: authkey      
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
```

As you can probably make out from our test, we visit Google, then output the title we see. If the title is correct (hopefully Google hasn't changed names on us), then we'll set the score to pass.

To run this test, simply execute the following command:
`node wdio_test.js`

### Test with Mocha

The process of using WebDriverIO with other frameworks will vary slightly with each framework. Several frameworks are supported with the configuration tool, which can be started up with the command `./node_modules/.bin/wdio config`. This will give a series of prompts and create a configuration file with the information you provide. We'll be manually creating our configuration file for this example.

First, you will need to install Mocha, the WebDriverIO/Mocha adapter, and Chai:

`npm install -g mocha`
`npm install wdio-mocha-framework --save-dev`
`npm install chai`

You'll also need to install all the modules from the basic example:

```
npm init
npm install webdriverio --save-dev
npm install request
```
Next, you'll need to make a configuration file. We're going to manually make one in this guide, but if you'd like to use WebDriverIO's configuration tool, you can run it with `./node_modules/.bin/wdio config`.

Save the following code as "wdio.conf.js" in the root directory of your project:

```javascript
exports.config = {
    runner: 'local',
   
    hostname: 'hub.crossbrowsertesting.com',
    port: 80,
   
    services: ['crossbrowsertesting'],
    user: process.env.CBT_USERNAME,
    key: process.env.CBT_AUTHKEY,
    cbtTunnel: false, //set to true if a local connection is needed
    
    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [
        // 'path/to/excluded/files'
    ],
 
    maxInstances: 10,
    
    capabilities: [{
        maxInstances: 5,
        
        platform: 'Windows',
        browserName: 'firefox',
        record_video: 'true'
    }],
  
    logLevel: 'info',
    
    bail: 0,
    
    baseUrl: 'http://localhost',
    
    waitforTimeout: 10000,

    connectionRetryTimeout: 90000,
    
    connectionRetryCount: 3,

    framework: 'mocha',

    reporters: ['spec'],
    
  
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    } 
}
```

All that's left to do now is add your tests! The directory we specified in the config file is `/test/specs`, so place your tests there. Here is the sample test we'll use:

```javascript
var webdriver = require('selenium-webdriver');
var request = require('request');
var assert = require('chai').assert;

describe("Login form", function(){
    this.timeout(5 * 1000 * 60);
    
    setScore("pass"); //We set a pass here so that if there are no failures, the test is a pass in CBT

    // This function runs before each "it" block below
    // Here, it resets the driver back to the correct page.
    // This is also where we would reset cookies and other browser data we don't want to 
    // persist between test blocks
    beforeEach("starting driver", function setupWebdriver(done){
        browser.url("http://crossbrowsertesting.github.io/login-form.html");
    });

    // Each "it" block describes one test scenario
    // The first argument is documentation for the test
    it("rejects bad login credentials", function(done){
        // Enter username
        var username = browser.element("#username");
        username.click()
        username.keys("username");

        // Enter password
        var password = browser.element("#password");
        password.click()
        password.keys("password");

        // Click "Login"
        browser.element("div.form-actions>button").click()

        // Check that the login was rejected
        browser.waitForVisible(".alert", 5000);
        let text = browser.element(".alert").getText();
        //We enclose this in a try/catch so we can set the score
        try {
            assert.deepEqual( text,  "Username or password is incorrect" );
        } catch(e) {
            //Set score and throw exception so WebDriverIO detects it
            setScore("fail");
            throw(e);
        }
    });

    it("has the correct page title", function(done){
        let title = browser.getTitle();
        try {
            //Check title
            assert.deepEqual(title, "Login Form - CrossBrowserTesting.com");
        } catch(e) {
            //Set score and throw exception so WebDriverIO detects it
            setScore("fail");
            throw(e);
        }
        setScore("pass"); //test has passed if this point is reached
    });
});

//Helper to set the score for us
function setScore(score) {

    var result = { error: false, message: null }

    if (browser.sessionId){
        
        request({
            method: 'PUT',
            uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + browser.sessionId,
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
        .auth(process.env.CBT_USERNAME, process.env.CBT_AUTHKEY);
    }
    else{
        result.error = true;
        result.message = 'Session Id was not defined';
    }
}
```


## Converting Existing Test Suites

If you're already a WebDriverIO user, you can quickly change your current tests by making the following changes to your webdriver configuration:

Before:

```javascript
var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    }
};
```

Now:

```javascript
var options = {
  desiredCapabilities: {
    name: 'Selenium Test Example',
    build: '1.0',
    platform: "Win10",          // Gets latest version by default
    browserName: 'firefox',     // To specify version, add version: "desired version"
    record_video: True,
    record_network: True
  },
  host: "hub.crossbrowsertesting.com",
  port: 80,
  user: 'you@yourdomain.com',		// the email address associated with your CBT account
  key: 'yourauthkey'      					// find this under the "Manage Account page of our app"
}

var client = webdriverio.remote(options);
```

As you can see, we're now pointing the test at our hub rather than a local driver instance. 

## Using the Local Connection

If you would like to test behind your firewall or access non-public sites, you can use our local connection tool through our WebdriverIO service. Simply install our service by running the command:

```bash
npm install --save-dev @wdio/crossbrowsertesting-service
```

Then add the following to your wdio.conf.js file :

```js
export.config = {
  // ...
  services: ['crossbrowsertesting'],
  cbtTunnel: true,
  // ...
};
```
