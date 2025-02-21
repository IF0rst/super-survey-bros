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
    let questionCount = 0;

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        addQuestion(selectInput.value, form, questionCount);
        questionCount++;
    });

    createSurveyButton.addEventListener("click", (event) => {
        event.preventDefault();
        const surveyData = generateSurveyJSON();
        http_request("/create_survey","POST", {action : "create_survey", model : surveyData})
    });
}

function addQuestion(type, form, id) {
    let newField = document.createElement("div");
    newField.classList.add("survey-question");
    newField.id = `question-${id}`;

    switch (type) {
        case "Multiple-choice answer":
            newField.innerHTML = `
                <label>Multiple Choice:</label>
                <input type="text" class="question-text" placeholder="Enter question" required />
                <div class="options">
                    <input type="text" placeholder="Option 1" required />
                    <input type="text" placeholder="Option 2" required />
                </div>
                <button class="add-option">Add Option</button>
            `;
            addOptionHandler(newField);
            break;
        case "Boolean answer":
            newField.innerHTML = `
                <label>Boolean Question:</label>
                <input type="text" class="question-text" placeholder="Enter question" required />
                <select>
                    <option>True</option>
                    <option>False</option>
                </select>
            `;
            break;
        case "Text answer":
            newField.innerHTML = `
                <label>Text Question:</label>
                <input type="text" class="question-text" placeholder="Enter question" required />
                <textarea placeholder="User response"></textarea>
            `;
            break;
        case "Slider answer":
            newField.innerHTML = `
                <label>Slider Question:</label>
                <input type="text" class="question-text" placeholder="Enter question" required />
                <label>Min:</label>
                <input type="number" class="slider-min" value="1" min="1" required />
                <label>Max:</label>
                <input type="number" class="slider-max" value="10" min="1" required />
                <label class="min-label">1</label>
                <input type="range" class="slider" min="1" max="10" />
                <label class="max-label">10</label>
            `;
            updateSliderRange(newField);
            break;
    }
    form.appendChild(newField);
}

function addOptionHandler(field) {
    field.querySelector(".add-option").addEventListener("click", (event) => {
        event.preventDefault();
        const optionDiv = field.querySelector(".options");
        const newOption = document.createElement("input");
        newOption.type = "text";
        newOption.placeholder = "New option";
        optionDiv.appendChild(newOption);
    });
}

function updateSliderRange(field) {
    const minInput = field.querySelector(".slider-min");
    const maxInput = field.querySelector(".slider-max");
    const slider = field.querySelector(".slider");
    const minLabel = field.querySelector(".min-label");
    const maxLabel = field.querySelector(".max-label");

    minInput.addEventListener("input", () => {
        slider.min = minInput.value;
        minLabel.textContent = minInput.value;
    });

    maxInput.addEventListener("input", () => {
        slider.max = maxInput.value;
        maxLabel.textContent = maxInput.value;
    });
}

function generateSurveyJSON() {
    const surveyTitle = document.querySelector("[name='title']").textContent;
    const surveyDescription = document.querySelector("[name='description']").textContent;
    const questions = document.querySelectorAll(".survey-question");
    let surveyData = {
        title: surveyTitle,
        description: surveyDescription,
        questions: []
    };

    questions.forEach(question => {
        let questionText = question.querySelector(".question-text").value;
        let questionType = question.querySelector("label").textContent;
        let questionData = { text: questionText, type: questionType };

        if (questionType.includes("Multiple Choice")) {
            questionData.options = Array.from(question.querySelectorAll(".options input")).map(input => input.value);
        } else if (questionType.includes("Slider")) {
            questionData.min = question.querySelector(".slider-min").value;
            questionData.max = question.querySelector(".slider-max").value;
        }

        surveyData.questions.push(questionData);
    });

    return surveyData;
}
