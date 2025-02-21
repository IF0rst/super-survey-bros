const express = require("express");

const HTTP_HANDLER = (require.main.path + "/back_end/http_handlers");
const HTML_PAGES = (require.main.path + "/front_end/public")

const index_handler = require(HTTP_HANDLER + "/index_handler.js");
const create_survey = require(HTTP_HANDLER + "/create_survey.js")
const answer_survey = require(HTTP_HANDLER + "/answer_survey.js")

const ROUTES = {
    "/": [{
        method: "get",
        handler: index_handler.index_get
    }],
    "/create_survey": [{
        method: "get",
        handler: create_survey.create_survey_get
    }, {
        method: "post",
        handler: create_survey.create_survey_post
    }],
    "/answer_survey" : [{
        method: "get",
        handler: answer_survey.answer_survey_get
    }]
};

const FILE_SERVERS = {
    "/public": (HTML_PAGES)
}

function init(expressInstance) {
    for (const [path, routeData] of Object.entries(ROUTES)) {
        for (const {method, handler} of routeData) {
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