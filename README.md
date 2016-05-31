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


### Useful links

 * [Trello Board](https://trello.com/b/iihSpSKj/eat-drink-healthy)
 * [Google Drive](https://drive.google.com/drive/folders/0B4JoTt-NyIq5X3k5YXpfQm1WNUk)
