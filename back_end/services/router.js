const express = require("express");

const HTTP_HANDLER = (require.main.path + "/back_end/http_handlers");
const HTML_PAGES = (require.main.path + "/front_end/public")

const index_handler = require(HTTP_HANDLER + "/index_handler.js")

const ROUTES = {
  "/": [
        {
            method: "get",
            handler: index_handler.index_get,
        },
    ],
};

const FILE_SERVERS = {
    "/public" : (HTML_PAGES)
}

function init(expressInstance) {
    for (const [path, routeData] of Object.entries(ROUTES)) {
        for (const { method, handler } of routeData) {
            expressInstance[method](path, handler);
            console.log(`[+] Registered route "${path}" (Fun: '${handler.name}', Method: '${method.toUpperCase()}')`);
        }
    }

    for (const [path, directory] of Object.entries(FILE_SERVERS)) {
        expressInstance.use(path, express.static(directory));
        console.log(`[+] Registered file server "${path}"`);
    }
}

module.exports = {
    init
}