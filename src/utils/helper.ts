import path from 'path';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
export const removeNull = (obj: object) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

export function parseBool(val: unknown): boolean {
    if (typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes') || val === 1) {
        return true;
    } else if (typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no') || val === 0) {
        return false;
    }

    return false;
}

export const generateSlug = (title: string) => {
    return slugify(`${title} ${nanoid(12)}`);
};

export const parseFilename = (str = '') => {

    const basename = path.basename(str);
    const firstDot = basename.indexOf('.');
    const lastDot = basename.lastIndexOf('.');
    const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');

    if (firstDot === lastDot) {
        return {
            name: basename.slice(0, firstDot),
            ext: extname
        };
    }

    return {
        name: basename.slice(0, firstDot),
        ext: basename.slice(firstDot, lastDot) + extname
    };
};