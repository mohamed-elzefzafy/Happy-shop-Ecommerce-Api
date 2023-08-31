const nodeMailer = require("nodemailer");



const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transPorter = nodeMailer.createTransport({
    host : process.env.EMAIL_HOST,
    port : process.env.EMAIL_PORT  ,  // if secure false port = 587, if true port= 465
    secure : true,
    auth : {
      user : process.env.EMAIL_USER ,
      pass : process.env.EMAIL_PASSWORD
    }
  })
  // 2) Define email options (like from, to, subject, email content)
const emailOptions = {
  from : "happy-Shop app <mzef222@gmail.com>" , 
  to : options.email , 
  subject : options.subject , 
  text : options.message
  };
  // 3) Send email
 await   transPorter.sendMail(emailOptions)
}

module.exports = sendEmail;