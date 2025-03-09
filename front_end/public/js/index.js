document.addEventListener("DOMContentLoaded", initSurveyList);

async function http_request(src, type, body = {}) {
    const response = await fetch(src, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(body),
    });

    return await response.json();
}

async function initSurveyList() {
    const data = await http_request("/create_survey","POST",{action: "get_surveys"})

    data.forEach(d=>{
        addSurvey(d.model.name,d.model.description,d.id);
    })
}

function addSurvey(name, description,id) {
    const surveyHolder = document.querySelector(".survey-wrapper > ul");
    const newSurvey = document.createElement("div");
    surveyHolder.appendChild(newSurvey);

    newSurvey.innerHTML = `
                    <li class="survey">
                    <div class="survey-info">
                        <p> >> ${name}</p>
                        <i>${description}</i>
                    </div>
                    <div class="survey-btns">
                        <a href="/answer_survey?id=${id}"><button>Answer</button></a>
                        <button>View answers</button>
                        <button class="del">Delete</button>
                    </div>
                </li>`

    newSurvey.querySelector(".survey-btns > .del").onclick = async () => {
        await http_request("/create_survey", "POST", {action: "delete_survey", id: id})
        location.reload()
    }
}