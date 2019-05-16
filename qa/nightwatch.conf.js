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

const selenium_port = process.env['RANDOM_SELENIUM_PORT'] ? process.env['RANDOM_SELENIUM_PORT'] : 4444;

module.exports = {
    "output_folder": "./reports",
    "page_objects_path" : "./pages",
    "custom_commands_path": "./commands",
    "selenium": {
        "start_process": true,
        "server_path": seleniumServer.path,
        "host": "127.0.0.1",
        "port": selenium_port
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
            "selenium_port": selenium_port,
            "selenium_host": "127.0.0.1",
            "globals" : {
                "waitForConditionTimeout" : 5000, // sometimes internet is slow so wait.
                "environment" : "local",
                loginCookie: {
                    domain: '',
                    secure: '',
                    value: '',
                    path: '',
                    httpOnly: '',
                    name: ''
                }
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
            "launch_url" : "https://arbeidsplassen-q.nav.no/stillinger",
            "globals" : {
                "environment" : "t1"
            },
            "chromeOptions" : {
                "args" : ["--ignore-certificate-errors"]
            }
        },
        "linux-t1": {
            "launch_url" : "https://arbeidsplassen-q.nav.no/stillinger",
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
            "launch_url" : "https://arbeidsplassen-q.nav.no/stillinger",
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
