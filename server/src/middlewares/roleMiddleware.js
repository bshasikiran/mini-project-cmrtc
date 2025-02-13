const adminRoleMiddleware = (req, res, next) => {
    const {role} = req.user;
    if(role !== "admin"){
        return res.status(401).json({message: "Unauthorized"});
    }
    next();
}

const userRoleMiddleware = (req, res, next) => {
    const {role} = req.user;
    if(role !== "user"){
        return res.status(401).json({message: "Unauthorized"});
    }
    next();
}

module.exports = {adminRoleMiddleware, userRoleMiddleware};