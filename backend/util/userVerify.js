const User = require('../Models/User.js');
const Session = require('../Models/Session.js');

const userVerify = async (req, res, next) => {
    if (!req.decodedToken) {
        return res.status(404).json({ error: 'missing token' });
    }

    const user = await User.findByPk(req.decodedToken.id);
    if (!user) {
        return res.status(404).json({ error: 'user not found' });
    }
    if(user.disabled === true){
        return res.status(401).json({ error: 'unauthorized user' });
    }
    const session = await Session.findOne({ where: { userId: user.id, token: req.auth } })
    if(!session){
        return res.status(401).json({ error: 'please login' });
    }
    if(session.validUntil < new Date()){
        return res.status(401).json({ error: 'expired session' });
    }

    req.user = user;

    next()
}

module.exports = userVerify;