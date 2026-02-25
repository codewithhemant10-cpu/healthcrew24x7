import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.js";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers; // make sure frontend sends "atoken"
    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    // Decode token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // decoded.id should be admin _id
    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    // pass admin info to next middleware
    req.admin = admin;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Not Authorized Login Again" });
  }
};

export default authAdmin;
