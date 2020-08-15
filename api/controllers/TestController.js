/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var moment = require("moment");

module.exports = {
  get: async function (req, res) {
    let tags = await Tag.create({
      name: Math.random(),
    }).fetch();
    console.log(moment(new Date().toISOString()).format());
    return res.json({ ...tags });
  },
  find: async function (req, res) {
    return res.json("");
  },
};
