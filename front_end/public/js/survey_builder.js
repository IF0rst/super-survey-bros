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
    }

    #buildMultipleChoiceAnswer(newField) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Multiple Choices:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required/>
                <div class="options">
                    <input type="text" placeholder="Option 1" required />
                    <input type="text" placeholder="Option 2" required />
                </div>
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? '<button class=\"add-option\">Add Option</button>' : ""}
            `;
    }

    #buildBooleanAnswer(newField) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Boolean Question:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required />
                <select>
                    <option>True</option>
                    <option>False</option>
                </select>
            `;
    }

    #buildTextAnswer(newField) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Text Question:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required />
                <textarea placeholder="User response"></textarea>
            `;
    }

    #buildSliderAnswer(newField) {
        newField.innerHTML = `
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Slider Question:</label>" : ""}
                <input type="text" class="question-text" placeholder="Enter question" required />
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Min:</label>" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<input type=\"number\" class=\"slider-min\" value=\"1\" min=\"1\" required />" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<label>Max:</label>" : ""}
                ${this.#type === SURVEY_INIT_TYPE.BUILD ? "<input type=\"number\" class=\"slider-max\" value=\"10\" min=\"1\" required />" : ""}
                <label class="min-label">1</label>
                <input type="range" class="slider" min="1" max="10" />
                <label class="max-label">10</label>
            `;
    }

    addQuestion(type) {
        let newField = document.createElement("div");
        newField.classList.add("survey-question");

        switch (type) {
            case "Multiple-choice answer":
                this.#buildMultipleChoiceAnswer(newField);
                break
            case "Boolean answer":
                this.#buildBooleanAnswer(newField);
                break;
            case "Text answer":
                this.#buildTextAnswer(newField);
                break;
            case "Slider answer":
                this.#buildSliderAnswer(newField);
                break;
        }

        this.#parent.appendChild(newField);
        this.#count++
    }

    toJSON() {

    }
}

export {SurveyBuilder, SURVEY_INIT_TYPE}