const jwt = require('jsonwebtoken');
const userModel = require('../../models/user.models');

// token verification middleware: decodes JWT and attaches user document to req.user
const tokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"]?.split(' ')[1];
    // require header in the form: "Bearer <token>"
    if (!authHeader) {
        return res.status(401).json({ 
            status: 401, 
            message: 'ไม่ได้รับอนุญาต - ขาดหรือไม่ถูกต้อง header',
            data: null
        });
    }
    const token = authHeader
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '1234');
        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                status: 401, 
                message: 'User not found', 
                data: null 
            });
        }
        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ status: 401, 
            message: 'Invalid token',
            data: null
        });
    }
};

// role requirement factory: returns middleware that checks req.user.role
const requireRole = (roles = []) => {
    if (!Array.isArray(roles)) roles = [roles];
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: 403, 
                message: 'Not authorized as role',
                data: null
            });
        }
        next();
    };
};

module.exports = tokenMiddleware;
module.exports.requireRole = requireRole;
