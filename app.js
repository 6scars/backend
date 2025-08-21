import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import Products from './backendAmazon/models/modelProduct.js';
import cors from 'cors';
import path from 'path';
import amazonRouter from './backendAmazon/routes/routes.js';
import portfolioRouter from './backendPortfolio/routes.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*-----------------------------------------------------------------------------------------------------------------------------*/
const app = express();
const dbURL = process.env.dbURL;
const PORT = process.env.PORT;

if(!dbURL){
    console.error('lack of dbURL in .env file');
    process.exit(1);
}

app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());


//amazon
app.use('/amazon', express.static(path.join(__dirname,'..','amazon-clone/public')));
app.use('/amazon', amazonRouter );


//portfolio
app.use('/', express.static(path.join(__dirname, '..','portfolio','dist')));
app.use('/',portfolioRouter);

//fallback
// app.get(['/portfolio', '/portfolio/:path(.*)'], (req, res) => {
//   res.sendFile(path.join(__dirname, 'portfolio/dist', 'index.html'));
// });





mongoose.connect(dbURL,{useNewUrlParser: true, useUnifiedTopology: true}).then((result)=>{
    app.listen(PORT,()=>{
        console.log(`server is working on ${PORT}`);
    });
}).catch((err)=>{
    console.log(`app listening error: ${err}`);
})



/*-----------------------------------------------------------------------------------------------------------------------------*/

sendProducts();




/* takes from database and send to frontend*/
function sendProducts(){
    app.get('/products',(req,res)=>{
        Products.find().then((result)=>{
            res.json(result);
        }).catch((err)=>{
            console.log('err');
        })
    })

}

