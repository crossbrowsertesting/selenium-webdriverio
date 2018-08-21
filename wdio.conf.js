var cbt = require('cbt_tunnels');

//You can either manually enter your credentials here or use the commented lines after setting your credentials as environment variables
var username = 'YOUR_USERNAME_HERE';
var authkey = 'YOUR_AUTHKEY_HERE';
//var username = process.env.CBT_USERNAME;
//var authkey = process.env.CBT_AUTHKEY;

exports.config = {
    //CBT info to start webdriver with
    host: 'hub.crossbrowsertesting.com',
    port: 80,
    path: '',
    user: username,
    key: authkey,
    //Test file location
    specs: [
        './test/specs/*.js'
    ],
    exclude: [],
    maxInstances: 5,
    capabilities: [
        {
            'browserName': 'Chrome',
            'version': '68x64',
            'platform': 'Windows 10',
            'screenResolution': '1366x768'
        },
        {
            'browserName': 'Safari',
            'version': '11',
            'platform': 'Mac OSX 10.13',
            'screenResolution': '1366x768'
        },
        {
            'browserName': 'Safari',
            'deviceName': 'iPhone 7 Simulator',
            'platformVersion': '10.0',
            'platformName': 'iOS',
            'deviceOrientation': 'portrait'
        }
    ],
    sync: true,
    logLevel: 'verbose',
    coloredLogs: true,
    deprecationWarnings: true,
    bail: 0,
    screenshotPath: './errorShots/',
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    },
/*
    onPrepare: function (config, capabilities) {
        console.log("Connecting local...");
        return new Promise(function(resolve, reject){
            cbt.start({'username': username,'authkey': authkey},function(err){
                if(!err){
                    console.log('Successful local connection!');
                    resolve();
                }else{
                    console.log('Failed local connection: ' + err.toString());
                    reject(err);
                }
            });
        })
     },
    
    onComplete: function(exitCode, config, capabilities) {
        return new Promise(function(resolve, reject){
            cbt.stop(function(err){
                if(!err){
                    console.log('Local connection sucessfully closed');
                    resolve();
                }else{
                    console.log('Failed to close local connection: ' + err.toString());
                    reject(err);
                }
            });
        })
     }
*/
}