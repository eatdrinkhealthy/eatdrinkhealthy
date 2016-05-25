import { BrowserPolicy } from "meteor/browser-policy-common";

BrowserPolicy.content.allowOriginForAll("https://maps.googleapis.com");
BrowserPolicy.content.allowOriginForAll("https://csi.gstatic.com");
BrowserPolicy.content.allowOriginForAll("https://maps.gstatic.com");
