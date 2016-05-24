FlowRouter.route("/", {
  action: function() {
    BlazeLayout.render("layout", {
      yield: "home"
    });
  }
});
