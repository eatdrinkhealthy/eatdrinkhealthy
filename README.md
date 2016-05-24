# eatdrinkhealthy

### Setting up the app

When you first clone the repo, follow these steps:

* Set up miraclegrow
 * `git submodule init`
 * `git submodule update`
* `cp settings.json.example settings.json`
* `meteor --settings settings.json`

### Signing in with Facebook from iOS build

You must run your app explicitly pointing to a server. The easiest way to do this, is to point to staging. You can also serve your app locally via ngrok

* via Staging
 * `meteor run ios-device --mobile-server https://eatdrinkhealthy-staging.meteorapp.com/ --settings settings.json`
* via Localhost
 * download ngrok (https://ngrok.com/download)
 * run ngrok `./ngrok http 3000`
 * `meteor run ios-device --mobile-server https://c518d338.ngrok.io --settings settings.json` (use https)

### Useful links

 * [Trello Board](https://trello.com/b/iihSpSKj/eat-drink-healthy)
 * [Google Drive](https://drive.google.com/drive/folders/0B4JoTt-NyIq5X3k5YXpfQm1WNUk)
