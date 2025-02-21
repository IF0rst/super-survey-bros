import {SurveyBuilder, SURVEY_INIT_TYPE} from "/public/js/survey_builder.js";

document.addEventListener("DOMContentLoaded", initSurveyCreator);

async function http_request(src, type, body = {}) {
    const response = await fetch(src, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(body),
    });

    return await response.json();
}

function initSurveyCreator() {
    const form = document.getElementById("answers");
    const addButton = document.getElementById("add-stuff-btn");
    const selectInput = document.getElementById("stuff-to-add");
    const createSurveyButton = document.getElementById("create-survey");

    const builder = new SurveyBuilder(form,SURVEY_INIT_TYPE.BUILD);

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        builder.addQuestion(selectInput.value);
    });

    createSurveyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const surveyData = builder.toModelJSON(document.querySelector("[name='title']").textContent,document.querySelector("[name='description']").textContent)
        console.log(surveyData);
        http_request("/create_survey","POST", {action : "create_survey", model : surveyData})
    });
}