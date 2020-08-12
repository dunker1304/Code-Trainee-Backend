const passport = require('passport');
module.exports = async function(req, res, next) {
  passport.authenticate('jwt', async function (err, user, message) {

   if(err) 
    return res.send({
     success: false,
     message : 'Something wrong happend!'
   })

   if(!user) {
     return res.status(401).json({
       success : false,
       message : 'Unauthorized',
       code : 401
     })
   }
   req.user = user
   next()
  })(req, res, next);
};
