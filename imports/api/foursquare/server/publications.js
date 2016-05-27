// import { HTTP } from "meteor/http";
import { Meteor } from "meteor/meteor";

Meteor.publish("getPlaces", function (lat, lng, filter) {
  // var self = this;

  // var subHandle = Places.find(filter || {}).observeChanges({
  //   added: function (id, fields) {
  //     self.added("testdata", id, fields);
  //   }
  // });

  // self.ready();

  // self.onStop(function () {
  //   subHandle.stop();
  // });



  // loop over results from GET
    this.added("places", "1", {thing: "1", thang: "2"});



  this.ready();

  // return Places;


});

// HTTP.call("GET", "https://api.foursquare.com/v2/venues/search",
//   {data: {some: "json", stuff: 1}},
//   function (error, result) {
//     if (!error) {
//       Session.set("twizzled", true);
//     }
//   });

// https://api.foursquare.com/v2/venues/search
//   ?client_id=1N0C5KTWP05QQRKEKHPNVOI4IKAXCJDRFNZDY0QKHBFABA30
//   &client_secret=U1B0UHK22EW5PMKKZIK0AF1LPN32B4M35S4N41HXCH4WTRFW
//   &v=20130815
//   &ll=40.7,-74
//   &query=sushi
