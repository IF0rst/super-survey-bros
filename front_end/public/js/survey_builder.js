const SURVEY_INIT_TYPE = {
    BUILD: 0, ANSWER: 1,
}
class SurveyBuilder {
    #parent;
    #type;
    #count = 0;
    #questions = []

    constructor(parent, type) {
        this.#parent = parent;
        this.#type = type;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            this.#parent.contentEditable = false;
        }
    }

    #addMCA(element, data = {}, answer = "") {
        element.innerHTML = `
            <input type="text" placeholder="Question name" value="${data.name}">
            <div></div>
            <button>Add choice</button>
        `;

        let responses = [];
        const responseHolder = element.querySelector("div");

        const addResponse = (name = "") => {
            const newResponse = document.createElement("div");
            const responseId = responses.length;

            newResponse.innerHTML = `
                <input type="text" placeholder="Response name" value="${name}">
                <button>Remove</button>
            `;

            if (this.#type === SURVEY_INIT_TYPE.BUILD) {
                newResponse.querySelector("input").addEventListener("input", (event) => {
                    event.preventDefault();
                    responses[responseId] = event.target.value;
                    element.setAttribute("q-data", JSON.stringify(responses));
                });

                newResponse.querySelector("button").addEventListener("click", (event) => {
                    newResponse.remove();
                    event.preventDefault();
                    delete responses[responseId];
                    element.setAttribute("q-data", JSON.stringify(responses));
                });

                responses.push(`Response ${responseId}`);
                element.setAttribute("q-data", JSON.stringify(responses));
            } else {
                newResponse.querySelector("input").addEventListener("click", (event) => {
                    event.preventDefault();
                    element.setAttribute("q-answer", newResponse.querySelector("input").value);
                });
                newResponse.querySelector("button").remove();
            }

            responseHolder.appendChild(newResponse);
        };

        if (this.#type === SURVEY_INIT_TYPE.BUILD) {
            element.querySelector("button").addEventListener("click", (event) => {
                event.preventDefault();
                addResponse();
            });
        } else {
            element.querySelector("button").remove();
            try {
                JSON.parse(data.data).forEach(d => {
                    if (d !== null) {
                        addResponse(d);
                    }
                });
            } catch (e) {
                console.warn(`No responses available on MCA ${data.name}`)
            }
            // Set the answer if available
            if (answer) {
                element.setAttribute("q-answer", answer);
            }
        }
    }

    #addBA(element, data = {}, answer = "") {
        element.innerHTML = `
            <input type="text" placeholder="Question name" value="${data.name}">
            <select>
                <option>True</option>
                <option>False</option>    
            </select>
        `;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            const selectElement = element.querySelector("select");
            selectElement.addEventListener("change", (event) => {
                element.setAttribute("q-answer", event.target.value);
            });

            if (answer) {
                selectElement.value = answer;
            }
        }
    }

    #addTA(element, data = {}, answer = "") {
        element.innerHTML = `
            <input type="text" placeholder="Question name" value="${data.name}">
            <textarea placeholder="Answer">${answer}</textarea>
        `;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            const textarea = element.querySelector("textarea");
            textarea.addEventListener("input", (event) => {
                element.setAttribute("q-answer", event.target.value);
            });

            // Set the answer if provided
            if (answer) {
                textarea.value = answer;
            }
        }
    }

    #addSA(element, data = {}, answer = "") {
        element.innerHTML = `
            <input type="text" placeholder="Question name" value="${data.name}">
            <div>
                <label>1</label>
                <input type="range" min="1" max="5">
                <label>5</label>
            </div>
        `;

        if (this.#type === SURVEY_INIT_TYPE.ANSWER) {
            const rangeInput = element.querySelector("input[type=range]");
            rangeInput.addEventListener("input", (event) => {
                element.setAttribute("q-answer", event.target.value);
            });

            // Set the answer if provided
            if (answer) {
                rangeInput.value = answer;
            }
        }
    }

    addQuestion(questionType, data = { name: "" }, answer = "") {
        const element = document.createElement("div");

        element.setAttribute("q-type", questionType);
        element.setAttribute("q-name", data.name);
        element.setAttribute("q-answer", "None");
        element.setAttribute("q-data", "None");

        switch (questionType) {
            case "mca":
                this.#addMCA(element, data, answer);
                break;
            case "ba":
                this.#addBA(element, data, answer);
                break;
            case "ta":
                this.#addTA(element, data, answer);
                break;
            case "sa":
                this.#addSA(element, data, answer);
                break;
        }

        element.querySelector("input[type=text]").addEventListener("input", (event) => {
            element.setAttribute("q-name", event.target.value);
        });

        this.#parent.appendChild(element);
    }

    export(name, description) {
        if (this.#type === SURVEY_INIT_TYPE.BUILD) {
            const data = { questions: [] };
            data.questions = Array.from(this.#parent.children).map(el => ({
                type: el.getAttribute("q-type"),
                name: el.getAttribute("q-name"),
                data: el.getAttribute("q-data"),
            }));
            data.name = name;
            data.description = description;
            return data;
        } else {
            const data = Array.from(this.#parent.children).map(el => ({
                name: el.getAttribute("q-name"),
                answer: el.getAttribute("q-answer"),
            }));
            return data;
        }
    }
}

export { SurveyBuilder, SURVEY_INIT_TYPE };
