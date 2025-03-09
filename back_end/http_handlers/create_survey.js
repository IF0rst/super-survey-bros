const PUBLIC = (require.main.path + "/front_end/public")
const db = require(require.main.path + "/back_end/services/db.js");

function create_survey_get(request,response){
    response.render(PUBLIC+"/html/create_survey.html")
}

async function create_survey_post(request,response){
    const data = request.body;

    switch (data.action){
        case "create_survey":
            response.json(await db.create_survey(data.model));
            break;
        case "get_surveys":
            response.json(await db.get_surveys())
            break;
        case "delete_survey":
            response.json(await db.delete_survey(data.id))
            break;
        case "survey_data":
            response.json(await db.survey_data(data.id))
            break;
        case "answer_survey":
            response.json(await db.answer_survey(data.id,data.data))
            break;
        case "survey_data_answers":
            response.json(await db.survey_data_answers(data.id))
            break;
    }
}

module.exports = {
    create_survey_get,
    create_survey_post
}