const passport = require('passport');
module.exports = async function(req, res, next) {
  passport.authenticate('jwt', async function (err, user, message) {

   if(err) 
    return res.send({
     success: false,
     message : 'Đã có lỗi xảy ra'
   })

   if(!user) {
     return res.status(403).json({
       success : false,
       message : 'Fail nhé'
     })
   }
   req.user = user
   next()
  })(req, res, next);
};
