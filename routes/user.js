const express = require("express"); //import express => express.routerがが使えるようになる

const router = express.Router();

router.get("/user", (req, res) => {
  //todecide whether we have to update or create a new user.
  res.json({
    data: "hey you hit user API endpoint",
  });
});

//export
module.exports = router;
