# Getting Started with WebDriverIO and CrossBrowserTesting

* [Simple Test with Mocha](#test-with-mocha)
* [Converting Existing Test Suites](#converting-existing-test-suites)
* [Using the Local Connection](#using-the-local-connection)

Want a powerful and easy to use command line tool for running Selenium-JS tests? Like to shy away from asynchronous
commands and race conditions? [WebDriverIO](http://webdriver.io/) might be the option for you. WebDriverIO provides
language-bindings for the powerful browser-driving tool [Selenium](http://www.seleniumhq.org/docs/). Its test runner
allows you to write your tests in a synchronous way so that you're not constantly in the world of asynchronous coding.
Luckily WebDriverIO integrates easily with the CrossBrowserTesting platform, so you can perform tests on a wide variety
of OS/Device/Browser combinations, all from one test. Let's walk through getting WebDriverIO tests running with
CrossBrowserTesting.

## Install and run app locally

#### Clone a repo

```https://github.com/crossbrowsertesting/selenium-webdriverio.git```

#### Install the node modules

```npm install```

#### Add a username and auth key

Replace **process.env.CBT_USERNAME** and **process.env.CBT_AUTHKEY** with your username (CBT email) and secret auth
key (find this under the "Manage Account")

#### Run the test

```wdio or ./node_modules/.bin/wdio```

## OR

## Starting from Scratch

You can configure WebDriverIO to use many different testing frameworks, such as [Chai](http://chaijs.com/)
or [Mocha](https://mochajs.org/), and you can [read more on that here](https://webdriver.io/docs/gettingstarted). For
our purposes, we'll start by writing a simple test using WebDriverIO with Mocha.

### Simple Test

First, create a folder for your test. From inside that folder, run the following commands (the `npm init` command will
prompt for information about your project; if you are unsure, it is fine to leave those fields blank):

```
npm init -y
npm install --save-dev @wdio/cli
npm install --save-dev @wdio/local-runner
npm install --save-dev @wdio/spec-reporter
npm install --save-dev request
```
`npm init -y` starts your project, `npm install --save-dev @wdio/cli` installs WebDriverIO into your project, `npm install --save-dev @wdio/local-runner` allows local running of tests, `npm install --save-dev @wdio/spec-reporter` formats test output in spec style and `npm install --save-dev request` installs the request module.

### Test with Mocha

The process of using WebDriverIO with other frameworks will vary slightly with each framework. Several frameworks are supported with the configuration tool, which can be started up with the command `./node_modules/.bin/wdio config`. This will give a series of prompts and create a configuration file with the information you provide. We'll be manually creating our configuration file for this example.

First, you will need to install the WebDriverIO/Mocha adapter and the CBT WDIO service:

```bash
npm install --save-dev @wdio/mocha-framework
npm install --save-dev @wdio/crossbrowsertesting-service
```

Next, you'll need to make a configuration file. We're going to manually make one in this guide, but if you'd like to use WebDriverIO's configuration tool, you can run it with `./node_modules/.bin/wdio config`.

Save the following code as "wdio.conf.js" in the root directory of your project:

```javascript
exports.config = {
    runner: 'local',

    hostname: 'hub.crossbrowsertesting.com',
    port: 80,
    path: '/wd/hub',

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
        platformName: 'Windows 10',
        browserName: 'chrome',
        browserVersion: 93,
        'cbt:options': {
            'name': 'WDIO Selenium Test Example',
            'screenResolution': '1366x768',
            'record_video': 'true',
            'record_network': 'false',
        }
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

All that's left to do now is add your tests! The directory we specified in the config file is `/test/specs`, so place your tests there. Here is the sample test we'll use saved in a file named login.js:

```javascript
const request = require('request');
const assert = require('assert');

describe("Login form", function () {
    //this.timeout(5 * 1000 * 60);

    it('should have the right title', async () => {
        await browser.url("https://crossbrowsertesting.github.io/login-form.html")

        //Enter the username
        let username = browser.$("#username");
        await username.click();
        await username.setValue("tester@crossbrowsertesting.com");

        //Enter the password
        let password = browser.$("#password");
        await password.click();
        await password.setValue("test123");

        // Click "Login"
        await browser.$("div.form-actions>button").click();

        // Get the title
        let title = await (browser.getTitle());
        try {
            //Check title
            assert.deepStrictEqual(title, "Login Form - CrossBrowserTesting.com");
        } catch (e) {
            //Set score and throw exception so WebDriverIO detects it
            setScore("fail");
            throw(e);
        }
        setScore("pass");
    });
});

//Helper to set the score
function setScore(score) {

    const result = {error: false, message: null};

    if (browser.sessionId) {

        request({
                method: 'PUT',
                uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + browser.sessionId,
                body: {'action': 'set_score', 'score': score},
                json: true
            },
            function (error, response, body) {
                if (error) {
                    result.error = true;
                    result.message = error;
                } else if (response.statusCode !== 200) {
                    result.error = true;
                    result.message = body;
                } else {
                    result.error = false;
                    result.message = 'success';
                }

            })
            .auth(process.env.CBT_USERNAME, process.env.CBT_AUTHKEY);
    } else {
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
exports.config = {
    runner: 'local',
    hostname: "hub.crossbrowsertesting.com",
    port: 80,
    path: '/wd/hub',
    user: 'you@yourdomain.com',		// the email address associated with your CBT account
    key: 'yourauthkey',      					// find this under the "Manage Account page of our app"
    capabilities: [{
        maxInstances: 5,
        platformName: 'Windows 10',
        browserName: 'chrome',
        browserVersion: 93,
        'cbt:options': {
            'name': 'WDIO Selenium Test Example',
            'build': '1.0',
            'screenResolution': '1366x768',
            'record_video': 'true',
            'record_network': 'false',
        }
    }],
}
```
Run your test using the command:

```
./node_modules/.bin/wdio
```
As you can see, we're now pointing the test at our hub rather than a local driver instance. 

## Using the Local Connection

If you would like to test behind your firewall or access non-public sites, you can use our local connection tool through our WebdriverIO service. Simply install our service by running the command:

```bash
npm install --save-dev @wdio/crossbrowsertesting-service
```

Then add the following to your wdio.conf.js file :

```js
exports.config = {
  // ...
  services: ['crossbrowsertesting'],
  cbtTunnel: true,
  // ...
};
```
