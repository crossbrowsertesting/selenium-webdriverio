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