/**
 * TestController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  get: async function(req, res) {
     let user = {
       'displayName' : 'anhoang',
       'username' :'anhoang1201',
       'email':'kieuquynh1201@gmail.com',
       'DOB':'1998-01-12',
       'password' : '123456789',
       'phone' : '0972079516',

     }

     let a = await User.find({'id': '5ecdd4bab936051fdcf33a1b'});
    return res.json({ get: a });
  },
  post: async function(req, res) {
    await console.log(req.body)
    return res.json({ post: 'true' });
  }

};

