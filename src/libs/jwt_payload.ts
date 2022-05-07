export default interface JwtPayload {
    id: number;
    email: string;
    fullName: string;
    type: string;
    iat: number;
    exp: number;
}
