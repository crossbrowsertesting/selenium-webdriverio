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