/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var moment = require("moment");

module.exports = {
  get: async function (req, res) {
    let x = await User.find({ id: 5 }).populate("roles", { id : 3});

    return res.json(x);
  },
  find: async function (req, res) {
    return res.json("");
  },
};
