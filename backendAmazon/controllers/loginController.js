import jwt from  'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../models/modelUser.js';
import sendEmail from './mailController.js';
const JWT_SECRET = process.env.JWT_SECRET;

const loginUsser = async (req,res)=>{
        try{
        const user = await Users.findOne({
            email: req.body.email,
        });
        if(!user)
            return res.status(401).json({message:'User not found'})


        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        
        if(!passwordMatch){
            return res.status(401).json({message: 'Ivalid email or password, try again'})
        }else if(passwordMatch){
            const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'});
            sendEmail();
            res.json({token, message:'Logedin succesfully, wait for redirect to the page'});
            
        }

    }catch(err){
        console.error('server error', err);
        res.status(500).json({message: 'server error'});
    }
    
}


const loginController = {
    loginUsser
}

export default loginController ;

