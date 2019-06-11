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
