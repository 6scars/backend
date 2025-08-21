import Cart from '../models/modelCart.js'
import jwt from 'jsonwebtoken';

const createCart = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('createCart for', userId);

    const newCart = new Cart({
      userId,
      cartItems: []
    });

    await newCart.save();

    return res.json({
        message:'register succesfully, wait for redirect',
        redirect:'/'
    });

  } catch (err) {
    console.log(err);
    returnres.status(500).json({ message: 'Error creating cart' });
  }
};

const addToCart = async (req,res)=>{
    try{
        const { productId,quantity, deliveryOptionId} = req.body;
        const userId = req.userId;
        const userCart = await Cart.findOne({userId});
        


        if(!userCart){
            const newCart = new Cart({
                userId,
                cartItems: [{ productId, quantity, deliveryOptionId}]
            });
            await newCart.save();
            return res.status(201).json({message:'Cart created and item added'});
        }
        const existing = userCart.cartItems.find(item => item.productId === productId);

        if(existing){
            
            existing.quantity += quantity;
        }else{
            userCart.cartItems.push({ productId,quantity, deliveryOptionId});
        }

        
        await userCart.save();
        res.status(200).json({message:'Product added to cart'});

    }catch(err){
        console.log(`adding to cart error${err}`);
    }
}

const readFromCart = async (req, res, next) => {
  try {
    console.log('readFromCart');
    const userId = req.userId;

    const userCart = await Cart.findOne({ userId });

    if (!userCart) {
      req.userId = userId;
      return next();
    }

    return res.json(userCart);

  } catch (err) {
    return res.status(401).json({
      message: 'Can\'t find such a user or userId doesn\'t match'
    });
  }
};

const removeFromCart = async (req,res)=>{
    try{

        const userId = req.userId;
        const userCart = await Cart.findOneAndUpdate(
            {userId: userId},
            {$pull: {
                cartItems:{
                    productId: req.body.productId
                    }
                }
            },
            {new: true}
        )
        res.status(200).json({message:'updated', userCart: userCart});

    }catch(err){
        console.log('removeFromCart',err);
        return res.status(400).json({message:'cant update the cart'})
    }

}

const changeDeliveryOption = async (req,res)=>{
    try{
        const userId = req.userId;
        const productId = req.body.productId;
        const userCart = await Cart.findOneAndUpdate({
                userId: userId,
                'cartItems.productId': productId
            },{
                $set: {
                    'cartItems.$.deliveryOptionId': req.body.deliveryOptionId}
            },{
                new:true
            }
        )

        if(!userCart){
            return res.status(400).json({message:'Can\'t find such user or product in cart'})
        }
        return res.status(200).json({message:'have changed delivery option', userCart})
    }catch(e){
        return res.status(500).json({message: 'server changeDeliveryOptioon error,',e})
    }
}

const changeQuantityInCart = async (req,res)=>{
    try{
        const userId = req.userId;
        const productId = req.body.productId;
        const newQuant = req.body.quantity;
        
        const userCart = await Cart.findOneAndUpdate(
            {
                userId: userId,
                'cartItems.productId': productId
            },
            {
                $set:
                {
                    'cartItems.$.quantity': newQuant
                }
            },
            {
                new:true
            }
        )
        if(!userCart){
            return res.status(400).json({message:'Can\'t find such user or product in cart'})
        }
        return res.status(200).json({message:'changing done', userCart});
    }catch(e){
        return res.status(500).json({message:'server error changingQuantityInCart:',e});    
    }
    

    
}

const deleteCart = async(userId, session)=>{
    await Cart.deleteOne({userId},{session})
}

const cartController = {
    addToCart,
    createCart,
    readFromCart,
    removeFromCart,
    changeDeliveryOption,
    changeQuantityInCart,
    deleteCart
};

export default cartController;