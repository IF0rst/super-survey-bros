import {SurveyBuilder, SURVEY_INIT_TYPE} from "/public/js/survey_builder.js";

document.addEventListener("DOMContentLoaded", initSurveyAnswer);

async function http_request(src, type, body = {}) {
    const response = await fetch(src, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(body),
    });

    return await response.json();
}

async function initSurveyAnswer(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const form = document.getElementById("answers");
    const sendButton = document.querySelector("#send-answers")

    const data = await http_request("/create_survey","POST",{action: "survey_data",id: id})
    const builder = new SurveyBuilder(form,SURVEY_INIT_TYPE.ANSWER)

    updateTitleDescription(data.model.title,data.model.description)
    addFields(data.model.questions,builder)

    sendButton.addEventListener("click", (event) => {
        event.preventDefault()
        console.log(builder.toAnswerJSON())
    })
}

function addFields(fields,builder){
    fields.forEach(d=>{
        const question = builder.addQuestion(d.type,d)
    })
}

function updateTitleDescription(name,description){
    const titleDOM = document.querySelector(".survey-wrapper > u > h1")
    const descriptionDOM = document.querySelector(".survey-wrapper > h2")

    titleDOM.textContent = name;
    descriptionDOM.textContent = description;
}