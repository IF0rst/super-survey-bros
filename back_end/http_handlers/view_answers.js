const PUBLIC = (require.main.path + "/front_end/public")
const db = require(require.main.path + "/back_end/services/db.js");

function view_answers_get(request, response) {
    const id = request.query.id;

    if (!id){
        response.json({"error": "Invalid survey id."})
    }else{
        response.render(PUBLIC+"/html/view_answers.html")
    }
}

module.exports = {
    view_answers_get
}