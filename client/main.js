import "../imports/startup/client";

Places = new Mongo.Collection("places");

Meteor.subscribe("getPlaces", lat, lng, filter);
