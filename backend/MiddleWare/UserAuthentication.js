import jwt from 'jsonwebtoken'
const Userauthentication = (customMessage)=>{
    return (req,res,next)=>{
        try {
           const authHeader = req.headers.authorization; 

           if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success:false,message:customMessage})
           }
           const checkToken = authHeader.split(' ')[1];
           
           if (!checkToken) {
            return res.status(401).json({
              success: false,
              message: customMessage || 'Token is missing after Bearer keyword',
            });
          }
           const decode_token = jwt.verify(checkToken,process.env.JWT_SECRET_kEY);
           req.body.userId=decode_token.id;
           next()
        } 
        catch (error) {
            console.log(error);
            return res.json({success:false,message:error})
        }
    }
}

export default Userauthentication;