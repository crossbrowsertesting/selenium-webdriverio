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
        browserName: 'firefox',
        browserVersion: 90,
        'cbt:options': {
            'name': 'WDIO Selenium Test Example',
            'build': '1.1',
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