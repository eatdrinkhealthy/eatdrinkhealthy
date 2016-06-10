/* eslint new-cap: 0 */
/* global browser */
/* global expect */

const actions = require("./actions");

const baseUrl = "http://localhost:3000";

function steps() {
  //Given functions

  this.Given(/^I am on the homepage$/, () => {
    browser.url(baseUrl);
  });

  this.Given(/^I am authenticated$/, () => {
    browser.url(baseUrl);
    actions.toggleSidebar();
    const loginButton = "span.sign-in-text-facebook";
    if (browser.isExisting(loginButton)) {
      browser.click(loginButton);
    } else {
      // close the menu again - no login needed.
      actions.toggleSidebar();
    }
  });

  // When functions

  this.When(/^I sign in$/, () => {
    browser.waitForExist("span.sign-in-text-facebook", 5000);
    browser.click("span.sign-in-text-facebook");
  });

  this.When(/^I am signed out$/, () => {
    browser.execute("Meteor.logout()");
  });

  this.When(/^I click the menu$/, () => {
    browser.waitForExist(".burger", 1500);
    browser.click(".burger");
  });

  this.When(/^the menu is fully expanded$/, () => {
    browser.element(".map-container--open-left");
  });

  this.When(/^I see the facebook button$/, () => {
    browser.waitForVisible("span.sign-in-text-facebook", 5000);
  });

  this.When(/^I create a new list called "([^"]*)"$/, (listName) => {
    actions.toggleSidebar();
    actions.clickElement(".lists__create");
    actions.setTargetToValue(".lists__new-list>input", listName);
    actions.clickElement(".lists__new-list>button");
  });

  this.When(/^I delete the list "([^"]*)"$/, (listName) => {
    // Note that this test assumes the existence of a list with the name listName.

    actions.toggleSidebar();

    // click the list by finding the index of its name
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    const i = listNames.indexOf(listName) + 2;
    browser.element(`.lists-item:nth-child(${i})`).click(".lists-item__title");

    actions.clickElement(".list__edit");
    actions.clickElement(".list__delete");
    browser.alertAccept();
  });


  // Then functions

  this.Then(/^I see a map$/, () => {
    browser.waitForExist(".map");
  });

  this.Then(/^I see a sign in button$/, () => {
    browser.waitForExist("span.sign-in-text-facebook");
    expect(browser.getText("span.sign-in-text-facebook")).toEqual("Sign in with Facebook");
  });

  this.Then(/^I see my name in the profile section$/, () => {
    browser.waitForExist(".profile__name");
    expect(browser.getText(".profile__name")).toEqual("Frodo Baggins");
  });

  this.Then(/^I see a list of lists$/, () => {
    browser.waitForExist(".lists__title");
    expect(browser.getText(".lists__title")).toEqual("MY LISTS");
  });

  this.Then(/^The last item of the list of lists will be "([^"]*)"$/, (expectedName) => {
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    const result = listNames[listNames.length - 1];
    expect(result).toEqual(expectedName);
  });

  this.Then(/^There will not be a list called "([^"]*)"$/, function (name) {
    actions.toggleSidebar();
    browser.waitForExist(".lists");
    const listNames = browser.getText(".lists-item__title");
    expect(listNames.indexOf(name)).toEqual(-1);
  });

  // allow placeholders that don't return errors.
  this.Then(/^a test needs to be written$/, () => {
    // always pending
    pending();
  });
}

module.exports = steps;
