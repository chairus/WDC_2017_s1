var express = require('express');
var router = express.Router();

/* GET welcome page. */
router.get("/", function(req, res) {
    res.render("welcome");
});

router.get("/homepage.html?:emailAndPass", function(req, res) {
    res.render("homepage");
});

router.get("/create.html", function(req, res) {
    res.render("create");
});

router.get("/welcome.html", function(req, res) {
    res.redirect("/");
});

router.get("/:page", function(req, res) {
    var page = req.params.page;
    res.render("error", {page:page});
});

module.exports = router;
