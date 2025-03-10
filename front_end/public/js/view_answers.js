import {SurveyBuilder, SURVEY_INIT_TYPE} from "/public/js/survey_builder.js";

document.addEventListener("DOMContentLoaded", initSurveyAnswers);

async function http_request(src, type, body = {}) {
    const response = await fetch(src, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(body),
    });

    return await response.json();
}

async function initSurveyAnswers(){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const answerList = document.querySelector(".survey-answer-list");
    const form = document.querySelector(".answers");

    const data = await http_request("/create_survey","POST",{action: "survey_data",id: id})
    const answer_data = await http_request("/create_survey","POST",{action: "survey_data_answers",id: id})

    const builder = new SurveyBuilder(form,SURVEY_INIT_TYPE.ANSWER)

    updateTitle(data.model.name)
    populateAnswerlist(answerList,answer_data,data,builder)
}

function showAnswers(answer,data,builder){
    builder.clear()
    data.model.questions.forEach((el,i)=>{
        builder.addQuestion(el.type,data.model.questions[i],answer[i].answer)
    })
}

function populateAnswerlist(answerList,answer_data,data,builder){
    answer_data.answers.forEach((el,i) => {
        const newAnswer = document.createElement("div");
        newAnswer.innerHTML = `
            
            <h3>Answer #${i}</h3>
        `

        newAnswer.onclick = () =>{
            showAnswers(el,data,builder)
        }

        answerList.appendChild(newAnswer)
    })
}

function updateTitle(name){
    const titleDOM = document.querySelector(".survey-wrapper > u > h1")
    const descriptionDOM = document.querySelector(".survey-wrapper > h2")

    titleDOM.textContent = `${name}'s answers`;
}