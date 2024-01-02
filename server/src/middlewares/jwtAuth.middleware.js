import  Jwt  from "jsonwebtoken";
import AppError from "../utils/error.util.js";

const isLoggedIn = async (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, Please login again", 401));
  }

  const userDetails = await Jwt.verify(token, process.env.JWT_SECRET);
  req.user = userDetails;

  next();
};

const authorizedRoles = (...roles) => async(req, res, next) => {
  const currentUserRole = req.user.role;
  
  if(!roles.includes(currentUserRole)){
    return next(new AppError('You Do not have permission to access this route',403 ))
  }


  next();
}


export { isLoggedIn, authorizedRoles };
