
const Clarifai = require ('clarifai');
const app = new Clarifai.App({
    apiKey: '87d7d86932164452ba3e9df2f4a9e6d4'
});

const imageurlAPI = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    }).catch(err => {
        res.status(400).json(" API failed!!");
    })
}
module.exports = {
    imageurlAPI
}