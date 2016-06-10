const actions = {
  toggleSidebar() {
    browser.waitForExist(".toggle-sidebar", 1500);
    browser.click(".toggle-sidebar");
    browser.pause(300); //wait for animation
  },
  clickElement(selector) {
    browser.waitForExist(selector);
    browser.click(selector);
  },
  setTargetToValue(selector, value) {
    browser.waitForExist(selector);
    browser.setValue(selector, value);
  },
};


module.exports = actions;
