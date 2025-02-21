const SURVEY_INIT_TYPE = {
    BUILD: 0, ANSWER: 1,
}

class SurveyBuilder {
    #parent;
    #type;
    #count = 0;

    constructor(parent, type) {
        this.#parent = parent;
        this.#type = type;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            this.#parent.contentEditable = false;
        }
    }

    #addOption(newField, value = "") {
        const optionDiv = newField.querySelector(".options");
        const newOption = document.createElement("input");

        newOption.type = "text";
        newOption.placeholder = "New option";
        newOption.value = value;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            newOption.readOnly = true;
            newOption.onclick = function () {
                Array.from(optionDiv.querySelectorAll(".selected")).forEach(d=>{
                    d.classList.remove("selected");
                })
                newOption.classList.add("selected");
            }
        }
        optionDiv.appendChild(newOption);
    }

    #buildMultipleChoiceAnswer(newField, data) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Multiple-choice answer:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required/>
                <div class="options">
                </div>
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? '<button class=\"add-option\">Add Option</button>' : ""}
            `;

        if (this.#type === SURVEY_INIT_TYPE.BUILD) {
            newField.querySelector(".add-option").addEventListener("click", (event) => {
                event.preventDefault();
                this.#addOption(newField);
            });
        }

        if (data) {
            newField.querySelector(".question-text").value = data.text;
            data.options.forEach(d => {
                this.#addOption(newField, d);
            })
        }
    }

    #buildBooleanAnswer(newField, data) {
        newField.innerHTML = `
        ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Boolean answer:</label>" : ""}
        <input type="text" class="question-text" placeholder="Enter question" required />
        <select>
            <option value="true">True</option>
            <option value="false">False</option>
        </select>
    `;

        if (data) {
            newField.querySelector(".question-text").value = data.text;
        }
    }

    #buildTextAnswer(newField, data) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Text answer:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required />
                <textarea placeholder="User response"></textarea>
            `;

        if (data) {
            newField.querySelector(".question-text").value = data.text;
        }
    }

    #buildSliderAnswer(newField, data) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Slider answer:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required />
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Min:</label>" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<input type=\"number\" class=\"slider-min\" value=\"1\" min=\"1\" required />" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Max:</label>" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<input type=\"number\" class=\"slider-max\" value=\"10\" min=\"1\" required />" : ""}
                <label class="min-label">1</label>
                <input type="range" class="slider" min="1" max="10" />
                <label class="max-label">10</label>
            `;

        const slider = newField.querySelector(".slider");
        const minLabel = newField.querySelector(".min-label");
        const maxLabel = newField.querySelector(".max-label");

        if (this.#type === SURVEY_INIT_TYPE.BUILD) {
            const minInput = newField.querySelector(".slider-min");
            const maxInput = newField.querySelector(".slider-max");

            minInput.addEventListener("input", () => {
                slider.min = minInput.value;
                minLabel.textContent = minInput.value;
            });

            maxInput.addEventListener("input", () => {
                slider.max = maxInput.value;
                maxLabel.textContent = maxInput.value;
            });
        }

        if (data) {
            slider.max = data.max;
            slider.min = data.min;

            minLabel.textContent = data.min;
            maxLabel.textContent = data.max;

            newField.querySelector(".question-text").value = data.text;
        }
    }

    addQuestion(type, data) {
        let newField = document.createElement("div");

        newField.classList.add("survey-question");
        newField.id = `question-${this.#count}`
        newField.dataset.type = type;

        this.#parent.appendChild(newField);
        this.#count++

        switch (type) {
            case "Multiple-choice answer":
                this.#buildMultipleChoiceAnswer(newField, data);
                break
            case "Boolean answer":
                this.#buildBooleanAnswer(newField, data);
                break;
            case "Text answer":
                this.#buildTextAnswer(newField, data);
                break;
            case "Slider answer":
                this.#buildSliderAnswer(newField, data);
                break;
        }

        newField.querySelector(".question-text").readOnly = true;
    }

    toModelJSON(title, description) {
        if (!this.#type === SURVEY_INIT_TYPE.BUILD) {
            throw new Error("Must be in build mode!")
        }

        const questions = document.querySelectorAll(".survey-question");

        let surveyData = {
            title: title, description: description, questions: []
        };

        questions.forEach(question => {
            let questionText = question.querySelector(".question-text").value;
            let questionType = question.querySelector("label").textContent.replaceAll(":", "");
            let questionData = {text: questionText, type: questionType};

            if (questionType.includes("Multiple-choice answer")) {
                questionData.options = Array.from(question.querySelectorAll(".options input")).map(input => input.value);
            } else if (questionType.includes("Slider")) {
                questionData.min = question.querySelector(".slider-min").value;
                questionData.max = question.querySelector(".slider-max").value;
            }

            surveyData.questions.push(questionData);
        });

        return surveyData;
    }

    toAnswerJSON() {
        if (this.#type !== SURVEY_INIT_TYPE.ANSWER) {
            throw new Error("Must be in answer mode!");
        }

        const questions = document.querySelectorAll(".survey-question");
        let answersData = [];

        questions.forEach(question => {
            let questionText = question.querySelector(".question-text").value;
            let questionType = question.dataset.type;
            let answerData = {};

            switch (questionType) {
                case "Multiple-choice answer":
                    answerData.answer = question.querySelector(".options > .selected")?.value || "";
                    break;
                case "Boolean answer":
                    answerData.answer = question.querySelector("select").value;
                    break;
                case "Text answer":
                    answerData.answer = question.querySelector("textarea").value;
                    break;
                case "Slider answer":
                    answerData.answer = question.querySelector(".slider").value;
                    break;
                default:
                    answerData.answer = null;
            }

            answersData.push(answerData);
        });

        return answersData;
    }
}

export {SurveyBuilder, SURVEY_INIT_TYPE}