import { BrowserPolicy } from "meteor/browser-policy-common";

// fonts
BrowserPolicy.content.allowOriginForAll("fonts.googleapis.com");
BrowserPolicy.content.allowOriginForAll("fonts.gstatic.com");

// analytics
BrowserPolicy.content.allowOriginForAll("www.google-analytics.com");
BrowserPolicy.content.allowOriginForAll("cdn.mxpnl.com");

BrowserPolicy.content.allowOriginForAll("https://maps.googleapis.com");
BrowserPolicy.content.allowOriginForAll("https://scontent.xx.fbcdn.net");
BrowserPolicy.content.allowOriginForAll("https://graph.facebook.com");
BrowserPolicy.content.allowOriginForAll("https://csi.gstatic.com");
BrowserPolicy.content.allowOriginForAll("https://maps.gstatic.com");
BrowserPolicy.content.allowImageOrigin("https://*.4sqi.net");
