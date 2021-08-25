const express = require('express');
const upload = require('express-fileupload');
const path = require('path');

const app = express();

app.use(upload());

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/dfw_ost-pic.html');
});

app.get('/image',(req,res) => {
    res.sendFile(__dirname + '/dfw_ost-pic2.html');
});

app.post('/', (req,res) =>{
    if(req.files){
        console.log(req.files);
        let file = req.files.file;
        let filename = file.name;
        let type = file.mimetype;
       // file.name = 'image.png';
        console.log(filename);
        console.log(type);

        filename = 'image.png';
        console.log(filename);

        // target_file.mv(path, callback)
        /*
        target_file.mv(path.join(__dirname, 'uploads', filename), (err) => {
            if (err) throw err;
            res.send('File Uploaded');
        })*/

        file.mv(path.join(__dirname, 'uploads', filename), (err) =>{
            if (err){
                res.send(err);
            } else{
                res.send('File Uploaded');
                
            }
        });
    }
})

// file.mimetype

app.listen(5000);
