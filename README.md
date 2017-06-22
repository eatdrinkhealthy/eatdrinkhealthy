# Eat Drink Healthy
[![Build Status](https://semaphoreci.com/api/v1/projects/44343427-5133-4d87-bc99-a9cdb13f9b72/906512/shields_badge.svg)](https://semaphoreci.com/smarsh/eatdrinkhealthy)

### Setting up the app

When you first clone the repo, follow these steps:

* `npm install`
* `cp settings.json.example settings.json`
* `meteor --settings settings.json`

NOTE: as of Meteor 1.3, when installing the npm packages, __DO NOT__ use `meteor npm install`. A later version of node is needed (I believe > v4) for the chimp packages to be successfully installed.

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
Instructions on how to initially add the file to the project are [here](https://github.com/eatdrinkhealthy/eslint).

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

__NOTE:__ as of Meteor 1.3, when running chimp based tests, __DO NOT__ run npm via meteor, like `meteor npm run ee-test`. As this will run a version of node incompatible with chimp, and cause chimp to fail.

__NOTE:__ As of ~ June 2017, a chrome driver update requires chimp to be run using a node version greater than v4 and chimp version 49. Later versions of node / npm however, cause the unit tests to fail while on Meteor 1.3. Until Meteor for this project is updated to a later version, the unit and ee-test will need to be run separately, using different versions of node / npm. The unit tests need to be run with 0.x versions of node (one method to do so `meteor npm ...`).

* Unit tests can be run as part of the npm test script, so they will be included in the continuous integration process
* End to end tests, __should be run manually__ before each branch push to github, and __especially before merging to master__.

#### Mobile App Tests
We don't currently have mobile app-specific tests, though we could add them in
the future, Chimp supports [Appium](http://appium.io/).

#### Full Test Suite / Continuous Integration
To run the entire test suite (unit, integration, acceptance), run `npm test`.

This should be used in continuous integration to make sure all tests pass in order to complete the build and successfully deploy.

NOTE: __temporarily acceptance tests are being removed from this script.__ Once the project is brought up to a later version of meteor, and there are no node version conflicts with the application and chimp, the acceptance tests should be added back to test script.

To deploy the application to galaxy, both staging and production, a meteor (login) deployment token is used. The [deployment token](http://galaxy-guide.meteor.com/deploy-guide.html#deployment-token) expires after 90 days. A new deployment token can be generated by following the steps [here](http://galaxy-guide.meteor.com/commands.html#login-token). Once the new token is generated, the meteor-login.json configuration file on SemaphoreCI must be updated with that file.

### Foursquare API (Notes, Behaviours, Idiosyncrasies)
1. Businesses not showing up with no filter set, but do show up when filtered on their category: The api returns 50 businesses in a priority order. So if no search criteria is set, a butcher might shop not show up. But when filtering for butchers, will be in the top 50 and show up.

### Encryption & Export Compliance
If using any form of encryption, such as https, Apple requires the app to meet U.S. Export Compliance in order to sell the app via App Store.

1. Apply for export compliance documentation [DONE]
    1. [Apple info on submitting for app review and export compliance](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SubmittingTheApp.html)
    1. [helpful blog post](https://pupeno.com/2015/12/15/legally-submit-app-apples-app-store-uses-encryption-obtain-ern/)
1. Upload / Submit export compliance document via itunes connect [DONE]
    1. My Apps -> Features -> Encryption
    1. Once this is reviewed and accepted (was almost instantaneous), the document will be listed on this page along with a document reference **Key Value**


### Submitting to iTunes Connect for TestFlight and App Store Submission
Once the mobile app has been built, using the npm scripts build-staging or build-production, add the following settings to the project info.plist file.
```
in...
"build-folder"/ios/project/Eat Drink Healthy/Eat Drink Healthy-Info.plist

add or confirm exists...
<key>ITSAppUsesNonExemptEncryption</key><true/>
<key>ITSEncryptionExportComplianceCode</key><string>[export compliance Key Value]</string>
```

Complete the following steps using xcode...

1. Under Product -> Scheme -> Edit Scheme...
1. From the left column click `Archive`
1. confirm that `Release` is selected from the dropdown
1. Click close
1. On xcode application title bar, set target device to `Generic iOS device`
1. Go to 'General' settings (folder icon on menu bar, then Eat Dink Healthy in left pane, General tab in center pane)
    1. Select 'TARGETS'
    1. set 'Version' and 'Build' to desired values
    1. under Deployment Info, set 'Devices' to `iPhone`
        1. NOTE this setting seemed needed for production, but not for staging, as this indicated which screen shots were required for app review
    1. set 'Team' to associated development team
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
