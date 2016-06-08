/* eslint new-cap: 0 */
/* global browser */
/* global expect */

const baseUrl = "http://localhost:3000";

function steps() {
  this.When(/^I visit the homepage$/, () => {
    browser.url(baseUrl);
  });

  this.When(/^I sign in$/, () => {
    browser.waitForExist("span.sign-in-text-facebook", 5000);
    browser.click("span.sign-in-text-facebook");
  });

  this.When(/^I am signed out$/, () => {
    browser.execute("Meteor.logout()");
  });

  this.When(/^I click the menu$/, () => {
    browser.waitForExist(".burger");
    browser.click(".burger");
  });

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
}

module.exports = steps;
