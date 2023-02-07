require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const app = express()

app.use(express.json())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const os = require('os')
os.hostname = () => 'BRUNO-PC'

const router = express.Router()
const usuarioService = require('./usuario/usuario.service')
const Joi = require('joi')
const validateRequest = require('./_middleware/validate-request')
const cors = require('cors')
const errorHandler = require('./_middleware/error-handler')
app.use(cors())
app.use(errorHandler)

app.route('/')
    .get((req, res) => {
        res.render('home')
    });

app.route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post((req, res, next) => {
        usuarioService.verifyUser(req.body.email, req.body.senha)
            .then((a) => {
                res.redirect('/secrets')
            })
            .catch(next)
    });

app.route('/register')
    .get((req, res) => {
        res.render('register')
    })
    .post((req, res, next) => {
        usuarioService.create(req.body.email, req.body.senha)
            .then((teste) => {
                res.redirect('/secrets')
            })
            .catch(next)
    });

app.route('/logout')
    .get((req, res) => {
        res.render('logout')
    })
    .post((req, res) => {
        res.redirect('logout')
    });

app.route('/secrets')
    .get((req, res) => {
        res.render('secrets')
    })

app.route('/submit')
    .get((req, res) => {
        res.render('submit')
    })
    .post((req, res) => {
        res.redirect('submit')
    });

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;
app.listen(port, function () {
    console.log("Server started on port " + port);
});

function verifySchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        senha: Joi.string().required()
    });
    validateRequest(req, next, schema);
}
