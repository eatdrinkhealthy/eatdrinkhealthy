# eatdrinkhealthy

### Setting up the app

When you first clone the repo, follow these steps:

* `cp settings.json.example settings.json`
* `meteor --settings settings.json`

### Fake Facebook OAuth for testing

We use the [dropz:facebook-fake](https://github.com/workflow/meteor-facebook-fake) package,
and we add a fake Facebook service configuration, so in development mode you shouldn't
need to configure the OAuth provider or use a tunneling app like ngrok.

NOTE: there's a bug in Meteor 1.3.2.4 with this:
https://github.com/meteor/meteor/issues/5589#issuecomment-222549580

Workaround: If you do `meteor reset` you will need to run `meteor run ios-device ...` twice, it won't work the first time.

### Running on iOS simulator or device

`meteor run ios-device --mobile-server http://localhost:3000 --settings settings.json`

### Generating sample lists

If you want to have some pregenerated lists, simply do the following

* `meteor shell`
* `addSampleLists(<USER_ID>);` Where `USER_ID` is the id of the user you would like to generate lists for

### Development
#### eslint
An eslintrc file was directly added to this project. The rules in this file are based on AirBnB's style guide, as well are recommended by Meteor guide. Minor rule adjustments, specific to this project can be made in this project's copy of the file (this repo). These rules should be contiually followed.
Instructions on how to initially add the file to the project are [here](https://github.com/stevenjmarsh/eslint).

### Testing
In order to run unit and acceptance (end to end) tests, you must first run `npm install` to add supporting packages.

#### Unit Tests
'Fast' unit tests are running using Mocha, Chai, and Testdouble.  These are run based on Pete Corey's unit test setup. [Unit Testing With Meteor 1.3](http://blog.east5th.co/2015/12/21/unit-testing-with-meteor-1.3/)

To run these unit tests, you can run `npm run unit-test` or `npm run unit-test-watch`

#### Integration Tests (and heavy unit tests)
Integration and unit tests can be added using files named `*.test.js` and run with `meteor test`.

#### Acceptance Tests
Acceptance tests (written in [Cucumber](https://chimp.readme.io/docs/cucumberjs),
run with [Chimp](https://chimp.readme.io/)) run using a browser. All app functionality
currently works within a browser.

By default it uses Chrome (and starts a new separate instance). It's also
possible to use PhantomJS for a headless browser, but problems are harder to debug.

Most of the things we do in the Cucumber steps are done with Webdriver.io, see
the docs [here](http://webdriver.io/api.html).

Expectations are using [Jasmine](http://jasmine.github.io/2.3/introduction.html#section-Expectations).

1. Start the app
1. Run acceptance tests: `npm run ee-test`
1. Run Chimp in *watch* mode: `npm run ee-test-watch`

NOTE: as of Meteor 1.3, when running chimp based tests, DO NOT run npm via meteor, like 'meteor npm run ee-test'. As this will run a version of node incompatible with chimp, and cause chimp to fail.

#### Mobile App Tests
We don't currently have mobile app-specific tests, though we could add them in
the future, Chimp supports [Appium](http://appium.io/).

#### Full Test Suite / Continuous Integration
To run the entire test suite (unit, integration, acceptance), run `npm test`.

This should be used in continuous integration to make sure all tests pass in order to complete the build and successfully deploy.


### Foursquare API (Notes, Behaviours, Idiosyncrasies)
1. Businesses not showing up with no filter set, but do show up when filtered on their category: The api returns 50 businesses in a priority order. So if no search criteria is set, a butcher might shop not show up. But when filtering for butchers, will be in the top 50 and show up.


### Submitting to iTunes Connect for TestFlight and App Store Submission

1. Under Product -> Edit Scheme
1. From the left column click `Archive`
1. confirm that `Release` is selected from the dropdown
1. Click close
1. Set Target device to "Generic iOS device"
1. in main window, Select TARGETS, Deployment Info, set Devices dropdown box to iPhone
1. Under Product -> Archive
1. click validate, confirm it passes
1. Upload to App Store

[Uploading Your App to iTunes Connect](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/UploadingYourApptoiTunesConnect/UploadingYourApptoiTunesConnect.html#//apple_ref/doc/uid/TP40012582-CH36-SW2)

[Configure Your Xcode Project for Distribution](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html#//apple_ref/doc/uid/TP40012582-CH28-SW7)

##### GOTCHAS

1. Make sure `team` under the app `targets` is set


### Useful links

 * [Trello Board](https://trello.com/b/iihSpSKj/eat-drink-healthy)
 * [Google Drive](https://drive.google.com/drive/folders/0B4JoTt-NyIq5X3k5YXpfQm1WNUk)
