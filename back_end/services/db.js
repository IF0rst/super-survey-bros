const {MongoClient, ObjectId} = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = "super-survey-bros";

const client = new MongoClient(url);
let db;

async function attemptConnect() {
    try {
        await client.connect();
        db = client.db(dbName);

        console.log("[*] DB connected.");
    } catch (e) {
        console.error("[!!!] COULD NOT CONNECT TO DB.");
    }
}

async function create_survey(json){
    try {
        const forms = await db.collection("Forms");
        const result = await forms.insertOne({
            model: json,
            answers: [],
        });
        return {success: true}
    }catch (err){
        return {error : "An error occured"}
    }
}

async function get_surveys() {
    try {
        const forms = await db.collection("Forms");
        const surveys = await forms.find({}, { projection: { model: 1, _id: 1 } }).toArray();
        return surveys.map(survey => ({ model: survey.model, id: survey._id }));
    } catch (err) {
        return { error: "An error occurred" };
    }
}

async function delete_survey(id){
     try {
        const forms = await db.collection("Forms");
        forms.deleteOne( {"_id" : new ObjectId(id) })
        return {success: true}
    } catch (err) {
        return { error: "An error occurred" };
    }
}

module.exports = {
    attemptConnect,
    create_survey,
    get_surveys,
    delete_survey,
}