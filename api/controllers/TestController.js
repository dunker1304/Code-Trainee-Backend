/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function(req, res) {
    await Question.addToCollection(1, "comments").members([1,2,3]);

    return res.json({});
  },
  find: async function(req, res) {
    var r = await Question.find({id: 1}).populate("comments");
    return res.json(r);
  },
};
