const express = require('express');
const { resolve } = require('path');
const multer = require("multer");
const Workers = require('./modules/WorkersDB.js').Workers;

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(resolve(__dirname, 'dist')));

const storage = multer.memoryStorage()
const upload = multer({ 
    storage: storage,
    limits: {
        fieldSize: 4 * 2 ** 10
    }
});


app.get('/workers', (request, response) => {
    Workers.getList((error, data) => {
        if (error)
            console.log(error.message);
        response.send(data);
    });
});

app.get('/worker-photo/:id', (request, response) => {
    Workers.getImage(request.params.id, (error, row) => {
        if (error)
            console.log(error.message);
        response.send(row.photo);
    });
});

app.post('/new-worker', upload.single('photo'), (request, response) => {
    if (!request.body)
        return response.sendStatus(404);
    
    request.body['remoute-work'] = request.body['remoute-work'] ? true : false;
    request.body['photo'] = request.file ? request.file.buffer : null;

    Workers.create(request.body, function(error) {
        if (error)
            console.log(error.message);
        
        response.json(this.lastID)
    });
});

app.delete('/delete-worker/:id', (request, response) => {
    Workers.delete(request.params.id, (error) => {
        if (error)
            console.log(error.message);

        response.sendStatus(200)
    });
    
});

app.put('/edit-worker/:id', upload.single('photo'), (request, response) => {
    if (!request.body) {
        return response.sendStatus(400);
    }
     
    request.body['remoute-work'] = request.body['remoute-work'] ? true : false;

    // console.log(request.body);
    if (request.file) {
        Workers.editPhoto(request.params.id,  request.file.buffer, error => {
            if (error)
                console.log(error.message);
        })
    }

    
    Workers.edit(request.params.id, request.body, error => {
        if (error) {
            response.sendStatus(400);
        }
    })

    response.sendStatus(200);
});




app.listen(PORT);