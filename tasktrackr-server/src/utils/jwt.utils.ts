import jwt, { JwtPayload } from 'jsonwebtoken';

interface ITokenPayload extends JwtPayload {
    userId: string;
}

export function verifyToken(token: string): ITokenPayload | null {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as ITokenPayload;

        return {
            userId: decoded.id
        }
    } catch (error) {
        return null;
    }
}