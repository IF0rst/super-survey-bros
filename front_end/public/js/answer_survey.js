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

    const data = await http_request("/create_survey","POST",{action: "survey_data",id: id})
    updateTitleDescription(data.model.title,data.model.description)
}

function updateTitleDescription(name,description){
    const titleDOM = document.querySelector(".survey-wrapper > u > h1")
    const descriptionDOM = document.querySelector(".survey-wrapper > h2")

    titleDOM.textContent = name;
    descriptionDOM.textContent = description;
}