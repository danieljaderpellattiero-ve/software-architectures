import jwt from 'jsonwebtoken';
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (req.params.email === decode.email) {
            next();
        }
        else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
export default verifyToken;
