/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function(req, res) {
    let x =  await User.find({id:5}).populate("roles")

    return res.json(x );
  },
  find: async function(req, res) {
    var r = await Question.find({id: 1}).populate("comments");
    return res.json(r);
  },
};
