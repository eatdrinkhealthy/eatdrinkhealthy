const actions = {
  toggleSidebar() {
    browser.waitForExist(".toggle-sidebar", 3000);
    browser.click(".toggle-sidebar");
    browser.pause(300); //wait for animation
  },
  toggleFilter() {
    browser.waitForExist(".toggle-filter", 3000);
    browser.click(".toggle-filter");
    browser.pause(300); //wait for animation
  },
  clickElement(selector) {
    browser.waitForExist(selector, 1500);
    browser.click(selector);
  },
  setTargetToValue(selector, value) {
    browser.waitForExist(selector);
    browser.setValue(selector, value);
  },
};


module.exports = actions;
