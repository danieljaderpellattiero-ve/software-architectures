/**
 *
 * This middleware is used to verify the JWT token of the user.
 * It runs before the patient profile update/delete endpoints.
 *
 */

import jwt, { JwtPayload } from 'jsonwebtoken'

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header('Authorization').replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!)
    if (req.params.email === (decode as JwtPayload).email) {
      next() // If the token is valid, and the email in the token matches the email in the URL (request parameter), the request is allowed to proceed.
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export default verifyToken
