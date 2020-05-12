/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: function(req, res) {
    return res.json({ get: 'true' });
  },
  post: function(req, res) {
    return res.json({ post: 'true' });
  }

};

