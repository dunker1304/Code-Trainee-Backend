/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function(req, res) {
    let x =  await User.find({id:5}).populate("roles")

    return res.json("abc");
  },
  find: async function(req, res) {
    let input = '<b onmouseover=alert("boo!")>click me!</b>';
    let result = purifier.purify(input);
    console.log(result)
    return res.json("abc");
  },
};
