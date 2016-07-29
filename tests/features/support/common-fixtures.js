/* global server Lists addSampleLists */

const fixtures = {};

fixtures.common = {
  resetLists: userId => {
    server.execute(id => {
      // Lists is exposed via imports/testing/
      Lists.remove({ id });
      return addSampleLists(id);
    }, userId);
  },
};

module.exports = fixtures;
