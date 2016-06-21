import { expect } from "chai";
import td from "testdouble";

import _ from "underscore";

describe("foursquare publication", function() {

  const MeteorDouble = {
    publish: () => {},
    settings: {
      foursquare: {
        client_id: null,
        client_secret: null,
      },
    },
  };

  const Meteor = td.object(MeteorDouble);// need settings
  const HTTP = td.object(["call"]);
  const EJSON = td.object(["parse"]);
  const check = td.function("check");
  const getFoursquarePlaces = td.function("getFoursquarePlaces");

  const categories = {
    glutenFree: "123",
    juiceBar: "456",
    saladPlace: "789",
    veganVegeRestaurant: "321",
  };

  let getFilteredFoursquarePlaces;

  before(function() {

    td.replace("meteor/meteor", { Meteor });
    td.replace("meteor/http", { HTTP });
    td.replace("meteor/ejson", { EJSON });
    td.replace("meteor/check", { check });
    td.replace("meteor/underscore", { _ });
    td.replace("../../imports/api/foursquare/server/foursquareApi.js", { getFoursquarePlaces });
    td.replace("../../imports/api/foursquare/categories.js", { categories });

    let publications = require("../../imports/api/foursquare/server/publications.js");
    getFilteredFoursquarePlaces = publications.getFilteredFoursquarePlaces;
  });

  after(function() {
    td.reset();
  });

  it("should return all categories if provided no user chosen filters", function() {
    getFilteredFoursquarePlaces([], null, null, null);

    td.verify(getFoursquarePlaces("123", null, null, null));
    td.verify(getFoursquarePlaces("456", null, null, null));
    td.verify(getFoursquarePlaces("789", null, null, null));
    td.verify(getFoursquarePlaces("321", null, null, null));
  });
});