import td from "testdouble";
import _ from "underscore";

/* eslint-env node, mocha */

describe("getFilteredFoursquarePlaces()", function () {
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
    glutenFree: "1",
    juiceBar: "2",
    saladPlace: "3",
    veganVegeRestaurant: "4",
  };

  let getFilteredFoursquarePlaces;

  beforeEach(function () {
    td.replace("meteor/meteor", { Meteor });
    td.replace("meteor/http", { HTTP });
    td.replace("meteor/ejson", { EJSON });
    td.replace("meteor/check", { check });
    td.replace("meteor/underscore", { _ });
    td.replace("../../imports/api/foursquare/server/foursquareApi.js", { getFoursquarePlaces });
    td.replace("../../imports/api/foursquare/categories.js", { categories });

    const publications = require("../../imports/api/foursquare/server/publications.js");
    getFilteredFoursquarePlaces = publications.getFilteredFoursquarePlaces;
  });

  afterEach(function () {
    td.reset();
  });

  it("should select all categories if provided no user chosen filters", function () {
    getFilteredFoursquarePlaces([], null, null, null);
    td.verify(getFoursquarePlaces("1", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("2", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("3", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("4", null, null, null), { times: 1 });
  });

  it("when passed one filter, it should select the corresponding category", function () {
    getFilteredFoursquarePlaces(["veganVegeRestaurant"], null, null, null);

    td.verify(getFoursquarePlaces("4", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("1", null, null, null), { times: 0 });
    td.verify(getFoursquarePlaces("2", null, null, null), { times: 0 });
    td.verify(getFoursquarePlaces("3", null, null, null), { times: 0 });
  });

  it("when passed three filters, it should select the three corresponding categories", function () {
    getFilteredFoursquarePlaces(["veganVegeRestaurant", "juiceBar", "glutenFree"],
      null, null, null);

    td.verify(getFoursquarePlaces("1", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("2", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("4", null, null, null), { times: 1 });
    td.verify(getFoursquarePlaces("3", null, null, null), { times: 0 });
  });
});
