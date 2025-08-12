const nodeMailer = require('nodemailer');

const transport = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, //true for port 465, false for others
    requireTLS:true,
    auth: {
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD
    }
})

const sendMail = async (email, subject, body) => {
    try{

        var mailData = {
            from: `"No Reply" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html:body
        }
        // await transport.sendMail(mailData, (error) => {
        //     if(error){
        //         console.log('error message from send mail '+ error.message);
        //     }
        //     else{
        //         console.log('Mail sent from sendMail ', info.messageId);
        //     }
            
        // });

        const info = await transport.sendMail(mailData);
        console.log(`Mail sent: ${info.messageId}`);

        
    }
    catch(error){
        console.error("Error sending email:", error.message);
        throw error;
    }
}

module.exports = {sendMail};