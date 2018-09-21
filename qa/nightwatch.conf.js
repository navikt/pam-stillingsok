const seleniumServer = require('selenium-server-standalone-jar');
require('nightwatch-cucumber')({
    cucumberArgs: [
        '--require-module', 'babel-core/register',
        '--require', 'features/step_definitions',
        '--format', 'node_modules/cucumber-pretty',
        '--format', 'json:reports/cucumber.json',
        'features'
    ]
});
module.exports = {
    "output_folder": "./reports",
    "page_objects_path" : "./pages",
    "selenium": {
        "start_process": true,
        "server_path": seleniumServer.path,
        "host": "127.0.0.1",
        "port": 4444, // standard selenium port
    },
    "test_workers" : {
        "enabled" : true,
        "workers" : "auto" // number of cores used. "auto" means the same number as cores in the cpu
    },
    "test_settings": {
        "default": {
            "launch_url" : "http://localhost:8080",
            "screenshots" : {
                "enabled" : true,
                "on_failure" : true,
                "on_error" : true,
                "path" : "./screenshots"
            },
            "globals" : {
                "waitForConditionTimeout" : 5000, // sometimes internet is slow so wait.
                "environment" : "local"
            },
            "desiredCapabilities": {
                "browserName": "chrome"
            },
            "cli_args": {
                "webdriver.chrome.driver" : "./node_modules/chromedriver/lib/chromedriver/chromedriver.exe"
            },
        },
        "linux-local": {
            "cli_args": {
                "webdriver.chrome.driver" : "./node_modules/chromedriver/lib/chromedriver/chromedriver"
            }
        },
        "t1": {
            "launch_url" : "https://stillingsok-q.nav.no",
            "globals" : {
                "environment" : "t1"
            },
            "chromeOptions" : {
                "args" : ["--ignore-certificate-errors"]
            }
        },
        "linux-t1": {
            "launch_url" : "https://stillingsok-q.nav.no",
            "globals" : {
                "environment" : "t1"
            },
            "chromeOptions" : {
                "args" : ["--ignore-certificate-errors"]
            },
            "cli_args": {
                "webdriver.chrome.driver" : "./node_modules/chromedriver/lib/chromedriver/chromedriver"
            }
        },
        "jenkins": {
            "launch_url" : "https://stillingsok-q.nav.no",
            "globals" : {
                "environment" : "t1"
            },
            "desiredCapabilities": {
                "browserName": "chrome",
                "javascriptEnabled": true,
                "chromeOptions" : {
                    "args" : ["--headless", "--disable-gpu", "--ignore-certificate-errors"]
                }
            },
            "cli_args": {
                "webdriver.chrome.driver" : "./node_modules/chromedriver/lib/chromedriver/chromedriver"
            }
        }
    }
};
