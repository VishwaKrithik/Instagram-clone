import jwt from "jsonwebtoken";
import { promisify } from 'util';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            })
        }
        try {
            const verifyAsync = promisify(jwt.verify);
            const decode = await verifyAsync(token, process.env.SECRET_KEY);
            if (!decode) {
                return res.status(401).json({
                    message: "Invalid",
                    success: false
                })
            }
            req.id = decode.userId;
            next();
        } catch (error) {
            return res.status(400).json({
                message: "Token expired",
                success: false
            })
        }
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;