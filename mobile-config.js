/* global App */
App.info({
  id: "co.EatDrinkHealthy.EatDrinkHealthy",
  name: "Eat Drink Healthy",
  description: "TODO",
  author: "Steve Marsh",
  email: "sjm.atl@gmail.com",
  website: "https://eatdrinkhealthy.co",
  version: "0.0.1",
});

// Set up resources such as icons and launch screens.
App.icons({
  // iOS
  iphone: "public/icons/icon-57x57.png",
  iphone_2x: "public/icons/icon-120x120.png",
  iphone_3x: "public/icons/icon-180x180.png",
  ipad: "public/icons/icon-76x76.png",
  ipad_2x: "public/icons/icon-152x152.png",
  ipad_pro: "public/icons/icon-167x167.png",
  ios_spotlight: "public/icons/icon-40x40.png",
  ios_spotlight_2x: "public/icons/icon-80x80.png",
  ios_spotlight_3x: "public/icons/icon-120x120.png",
  ios_settings: "public/icons/icon-29x29.png",
  ios_settings_2x: "public/icons/icon-58x58.png",
  ios_settings_3x: "public/icons/icon-87x87.png",

  // Android
  // android_ldpi: "public/icons/icon-36.png",
  // android_mdpi: "public/icons/icon-48.png",
  // android_hdpi: "public/icons/icon-72.png",
  // android_xhdpi: "public/icons/icon-96.png",
});

App.launchScreens({
  // iOS
  iphone_2x: "public/splash/splash-640x960.png",
  iphone5: "public/splash/splash-640x1136.png",
  iphone6: "public/splash/splash-750x1334.png",
  iphone6p_portrait: "public/splash/splash-1242x2208.png",
  ipad_portrait: "public/splash/splash-768x1024.png",
  ipad_portrait_2x: "public/splash/splash-1536x2048.png",

  // Android
  // android_ldpi_portrait: "public/splash/splash-320x426.png",
  // android_mdpi_portrait: "public/splash/splash-320x470.png",
  // android_hdpi_portrait: "public/splash/splash-480x640.png",
  // android_xhdpi_portrait: "public/splash/splash-720x960.png",
});

// Set PhoneGap/Cordova preferences
App.setPreference("Orientation", "portrait");
App.setPreference("HideKeyboardFormAccessoryBar", true);
App.setPreference("StatusBarOverlaysWebView", "true");
App.setPreference("StatusBarStyle", "lightcontent");
