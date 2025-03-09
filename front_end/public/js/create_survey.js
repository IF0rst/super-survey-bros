import {SURVEY_INIT_TYPE, SurveyBuilder} from "/public/js/survey_builder.js";

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

    const builder = new SurveyBuilder(form, SURVEY_INIT_TYPE.BUILD);

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        const selectedOption = selectInput.options[selectInput.selectedIndex];
        const qType = selectedOption.getAttribute("q-type");
        builder.addQuestion(qType);
    });

    createSurveyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const surveyData = builder.export(document.querySelector("[name='title']").textContent, document.querySelector("[name='description']").textContent)
        http_request("/create_survey", "POST", {action: "create_survey", model: surveyData})
    });
}