const fixtures = {};

fixtures.common = {
  resetLists: function (userId) {
    server.execute(function (userId) {
      // Lists is exposed via imports/testing/
      Lists.remove({ userId });
      return addSampleLists(userId);
    }, userId);
  },
};

module.exports = fixtures;
