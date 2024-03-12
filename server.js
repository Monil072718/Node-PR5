const express = require('express')
const app = express()
const ejs =  require('ejs')
const mongoose = require('mongoose')
const fs =  require('fs')


// Connect Mongodb

const { connectDb } = require('./database/bookdatabase')
const MovieSchema = require('./MovieSchema/Schema')

connectDb();
app.set('view engines' , 'ejs')

app.use(express.static('upload'));

const multer = require('multer')

// Store Data 

const storage = multer.diskStorage({
    destination: (req , file , cb) =>{
        return cb ( nulll, './uplaod');
    },
    filename: (req , file , cb)=>{
        return cb ( null , Date.now() + file.originalname);
    }
});

var upload = multer ({storage:storage}).single('file')

app.get('/' , async (req , res ) =>{
    const movie= await MovieSchema.find({});
    res.render('pages/index', {movie:movie});

});

app.get('/add', (req , res ) => {
    res.render('pages/add');
});

app.post('/add', async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Error uploading file.");
        }
        if (req.file) {
            var details = {
                title: req.body.title,
                description: req.body.description,
                release_year: req.body.release_year,
                genre: req.body.genre,
                rating: req.body.rating,
                image: req.file.filename
            };
            try {
                const movie = new MovieSchema(details);
                const result = await movie.save();
                res.redirect('/');
            } catch (error) {
                console.error(error);
                res.status(500).send("Error saving movie details.");
            }
        } else {
            res.status(400).send("No file uploaded.");
        }
    });
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    var result = await MovieSchema.findOne({ _id: id });
    res.render('pages/edit', { movie: result });
});

app.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    upload(req, res, async function () {
        if (req.file) {
            var details = {
                title: req.body.title,
                description: req.body.description,
                release_year: req.body.release_year,
                genre: req.body.genre,
                rating: req.body.rating,
                image: req.file.filename
            };
            const movie = await MovieSchema.updateOne({ _id: id }, details);
            res.redirect('/');
        } else {

        }
    });
});

app.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    var image = await MovieSchema.findOne({ _id: id });
    var result = await MovieSchema.deleteOne({ _id: id });
    if (result.acknowledged) {
        fs.unlink(`upload/${image.image}`, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('success....');
        });

        res.redirect('/');
    }
});

app.listen(8000, () => {
    console.log('Listening on port 8000');
});
