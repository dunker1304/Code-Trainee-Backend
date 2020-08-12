/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function (req, res) {
    let x = await User.find({ id: 5 }).populate("roles", { id : 3});

    return res.json(x);
  },
  find: async function (req, res) {
    for (let i = 0; i < 10; i++) {
      await ProgramLanguage.create({
        name: "language " + i,
        code: "" + i,
      });
    }
    return res.json("");
  },
};
