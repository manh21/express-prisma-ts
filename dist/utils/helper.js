"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFilename = exports.generateSlug = exports.parseBool = exports.removeNull = void 0;
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
const removeNull = (obj) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};
exports.removeNull = removeNull;
function parseBool(val) {
    if (typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes') || val === 1) {
        return true;
    }
    else if (typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no') || val === 0) {
        return false;
    }
    return false;
}
exports.parseBool = parseBool;
const generateSlug = (title) => {
    return (0, slugify_1.default)(`${title} ${(0, nanoid_1.nanoid)(12)}`);
};
exports.generateSlug = generateSlug;
const parseFilename = (str = '') => {
    const basename = path_1.default.basename(str);
    const firstDot = basename.indexOf('.');
    const lastDot = basename.lastIndexOf('.');
    const extname = path_1.default.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');
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
exports.parseFilename = parseFilename;
//# sourceMappingURL=helper.js.map