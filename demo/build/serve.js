"use strict"

const send = require("koa-send");

module.exports = function serve(path, opt) {
    return function(ctx, next) {
        const pathUrl = ctx.path
        if ((ctx.method == "HEAD" || ctx.method == "GET") && pathUrl.startsWith(path)) {
            let newOpt = null
            let newPath = null
            if (pathUrl === path) {
                if (!path.endsWith('/')) {
                    const newRoot = opt.root.slice(0, -(path.length))
                    newOpt = Object.assign({}, opt, { root: newRoot })
                    newPath = pathUrl
                }
            } else {
                newPath = pathUrl.slice(path.length)
            }
            return send(ctx, newPath || "/", newOpt || opt)
        }
        return next();
    }
};
