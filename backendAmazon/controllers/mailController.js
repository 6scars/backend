import {Resend} from 'resend';
import dotenv from 'dotenv'
dotenv.config();
const resend = new Resend(process.env.resend_API_KEY)

const sendEmail = async () =>{
    try{

    
            const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'gwiuzdpu@o2.pl',
            subject: 'hello world',
            html: '<p>Congrats on sending your <strong> first email</strong>!</p>'
        })
        console.log('have Sended')
        console.log(result)
        return ({succes: true, result})
    }catch(err){
        return{ success: false, error: error.message || error}
    }
}

export default sendEmail;
