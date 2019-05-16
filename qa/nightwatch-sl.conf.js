/* eslint-disable */
require('nightwatch-cucumber')({
    cucumberArgs: [
        '--require-module', 'babel-core/register',
        '--require', 'features/step_definitions',
        '--format', 'node_modules/cucumber-pretty',
        '--format', 'json:reports/cucumber.json',
        'features'
    ]
});

const selenium_port = process.env['RANDOM_SELENIUM_PORT'] ? process.env['RANDOM_SELENIUM_PORT'] : 4445;
const tunnel_name = process.env['BUILD_TAG'] ? process.env['BUILD_TAG'] : '${SAUCE_USERNAME}-pc';

module.exports = {
    output_folder: 'reports',
    page_objects_path: 'pages',
    custom_commands_path: 'commands',
    test_workers: {
        enabled: true,
        workers: 'auto' // number of cores used. "auto" means the same number as cores in the cpu
    },
    test_settings: {
        default: {
            launch_url: 'https://arbeidsplassen-q.nav.no/stillinger',
            selenium_port: selenium_port,
            username: '${SAUCE_USERNAME}',
            access_key: '${SAUCE_ACCESS_KEY}',
            screenshots: {
                enabled: true,
                on_failure: true,
                on_error: true,
                path: './screenshots'
            },
            persist_globals: true,
            globals: {
                waitForConditionTimeout: 5000, // sometimes internet is slow so wait.
                environment: 'q6',
                loginCookie: {
                    domain: '',
                    secure: '',
                    value: '',
                    path: '',
                    httpOnly: '',
                    name: ''
                }
            },
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'chrome',
                version: 'latest',
                tunnelIdentifier: tunnel_name
            }
        },
        'chrome_W7': {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'chrome',
                version: 'latest'
            }
        },
        edge: {
            desiredCapabilities: {
                browserName: 'MicrosoftEdge',
                version: 'latest'
            }
        },
        ie_W10: {
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'internet explorer'
            }
        },
        ie_W7: {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'internet explorer'
            }
        },
        firefox_W10: {
            desiredCapabilities: {
                platform: 'Windows 10',
                browserName: 'firefox',
                marionette: true,
            }
        },
        firefox_W7: {
            desiredCapabilities: {
                platform: 'Windows 7',
                browserName: 'firefox',
                marionette: true
            }
        },
        'chrome_OSX_10.14': {
            desiredCapabilities: {
                platform: 'OSX 10.14',
                browserName: 'chrome',
                version: 'latest'
            }
        },
        'chrome_OSX_10.13': {
            desiredCapabilities: {
                platform: 'OSX 10.13',
                browserName: 'chrome',
                version: 'latest'
            }
        },
        safari: {
            desiredCapabilities: {
                platform: 'OSX 10.14',
                browserName: 'safari'
            }
        },
        'safari_10.13': {
            desiredCapabilities: {
                platform: 'OSX 10.13',
                browserName: 'safari'
            }
        },
        'firefox_OSX_10.14': {
            desiredCapabilities: {
                platform: 'OSX 10.14',
                browserName: 'firefox',
                marionette: true
            }
        },
        'firefox_OSX_10.13': {
            desiredCapabilities: {
                platform: 'OSX 10.13',
                browserName: 'firefox',
                marionette: true
            }
        },
        iphone_x: {
            desiredCapabilities: {
                browserName: 'iPhone',
                deviceOrientation: 'portrait',
                deviceName: 'iPhone X',
                platform: 'OSX 10.14',
                version: 'latest'
            }
        },
        galaxy_s9_plus_fhd: {
            desiredCapabilities: {
                appiumVersion: '1.9.1',
                deviceName: 'Samsung Galaxy S9 Plus FHD GoogleAPI Emulator',
                deviceOrientation: 'portrait',
                browserName: 'chrome',
                platformVersion: '8.0',
                platformName: 'Android'
            }
        }
    }
};
