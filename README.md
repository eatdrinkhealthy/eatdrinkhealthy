# eatdrinkhealthy

### Setting up the app

When you first clone the repo, follow these steps:

* Set up miraclegrow
 * `git submodule init`
 * `git submodule update`
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

### Testing

Acceptance tests (written in [Cucumber](https://chimp.readme.io/docs/cucumberjs),
run with [Chimp](https://chimp.readme.io/)) run using a browser. All app functionality
currently works within a browser.

By default it uses Chrome (and starts a new separate instance). It's also
possible to use PhantomJS for a headless browser, but problems are harder to debug.

Most of the things we do in the Cucumber steps are done with Webdriver.io, see
the docs [here](http://webdriver.io/api.html).

Expectations are using [Jasmine](http://jasmine.github.io/2.3/introduction.html#section-Expectations).

We don't currently have mobile app-specific tests, though we could add them in
the future, Chimp supports [Appium](http://appium.io/).

1. Start the app
1. Run tests: `npm test`
1. Run Chimp in *watch* mode: `npm run test-watch`

Unit tests can be added using files named `*.test.js` and run with `meteor test`.

### Foursquare API (Notes, Behaviours, Idiosyncrasies)
1. Businesses not showing up with no filter set, but do show up when filtered on their category: The api returns 50 businesses in a priority order. So if no search criteria is set, a butcher might shop not show up. But when filtering for butchers, will be in the top 50 and show up.


### Submitting to iTunes Connect for TestFlight and App Store Submission

1. Under Product -> Edit Scheme
1. From the left column click `Archive`
1. confirm that `Release` is selected from the dropdown
1. Click close
1. Set Target device to "Generic iOS device"
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
