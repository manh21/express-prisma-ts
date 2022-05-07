import { Request } from 'express';

export default interface RRequest extends Request {
    user: any
}