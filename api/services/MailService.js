const nodemailer = require('nodemailer');
module.exports.sendWelcomeMail = function(obj) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kieuquynh1234@gmail.com',
      pass: 'kieuhoangan1201'
    }
  });

  var mailOptions = {
    from: 'kieuquynh1234@gmail.com',
    to: obj['email'],
    subject: obj['subject'],
    text: obj['content'],
    html: obj['html']
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

};
