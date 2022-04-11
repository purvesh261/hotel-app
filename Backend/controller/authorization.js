const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
    const userData = { id: user._id, email: user.email, admin: user.admin };
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'1h'});
    return { _id: user._id, email: user.email, admin: user.admin, accessToken: accessToken };
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

exports.isAdmin = (req, res, next) => {
    if(req.user.admin)
    {
        next();
    }
    else
    {
        return res.sendStatus(403);
    }
}

  
