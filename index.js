const express = require('express');
const upload = require('express-fileupload');

const app = express();

app.use(upload());

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/dfw_ost-pic.html');
});

app.post('/', (req,res) =>{
    if(req.files){
        console.log(req.files);
        let file = req.files.file;
        let filename = file.name;
        let type = file.mimetype;
        console.log(filename);
        console.log(type);

        file.mv('./uploads/' + filename, function (err){
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