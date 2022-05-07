"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seed_controller_1 = require("../controllers/seed.controller");
const reset_controller_1 = require("../controllers/reset.controller");
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.send('ok');
});
/* GET home page. */
router.get('/', function (_req, res) {
    res.send({ status: 200 });
});
router.get('/seed', seed_controller_1.seedController);
router.get('/reset', reset_controller_1.resetController);
exports.default = router;
//# sourceMappingURL=default.route.js.map