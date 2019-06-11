const request = require('request');
const assert = require('assert')

describe("Login form", function(){
    this.timeout(5 * 1000 * 60);
    
    it('should have the right title', () => {
    	browser.url("http://crossbrowsertesting.github.io/login-form.html");

    	//Enter the username
    	let username = browser.$("#username");
        username.click()
        username.setValue("username");

        //Enter the password
        let password = browser.$("#password");
        password.click()
        password.setValue("password");

        // Click "Login"
        browser.$("div.form-actions>button").click();

        let title = browser.getTitle();
        try {
            //Check title
            assert.deepEqual(title, "Login Form - CrossBrowserTesting.com");
        } catch(e) {
            //Set score and throw exception so WebDriverIO detects it
            setScore("fail");
            throw(e);
        }
        setScore("pass");  	 
    });
});

//Helper to set the score
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
