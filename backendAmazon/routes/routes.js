//FILES SETUP
import express from 'express';
const router = express.Router();
import path from 'path';
import { fileURLToPath } from 'url';
//FILES REQUIREMENTS
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/registerController.js';
import orderController from '../controllers/orderController.js';
import viewController from '../controllers/viewController.js';
import cartController from '../controllers/cartController.js';
import utils from '../controllers/utilsControllers/utilsControllers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//MAIN
// router.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../../amazon-clone/public','amazon.html'));
// })
// router.get('/loginRegister',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../../amazon-clone/public','loginRegister.html'));
// })
// router.get('/checkout',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../../amazon-clone/public','checkout.html'));
// })

// router.get('/orders',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../../amazon-clone/public','orders.html'));
// })

// router.get('/placeYourOrder',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../../../amazon-clone/public','placeYourOrder.html'));
// })





//ROUTES
router.post('/login', loginController.loginUsser);
router.post('/register',registerController.validation, registerController.registerUser, cartController.createCart );
router.post('/send-order',utils.authenticateToken, orderController.sendOrder);
router.post('/sendOrderAnonymous',orderController.sendOrderAnonim);
router.get('/takeUserOrders',utils.authenticateToken, orderController.takeUserOrders)
router.get('/userData',utils.authenticateToken, utils.takingUserData, viewController.userData);
router.get('/veryfication-token',utils.authenticateToken, viewController.verifyToken);

//for cart
router.post('/send-product-to-cart',utils.authenticateToken, cartController.addToCart);
router.get('/userDataCart',utils.authenticateToken, cartController.readFromCart, cartController.createCart);
router.post('/removeProdItemCart', utils.authenticateToken, cartController.removeFromCart);
router.post('/changeDeliveryOption', utils.authenticateToken, cartController.changeDeliveryOption);
router.post('/changeQuantityInCart', utils.authenticateToken, cartController.changeQuantityInCart);

export default router;



