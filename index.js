const express = require("express");
const upload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

// function to make directory if it doesnt exist
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, {
    recursive: true,
  });
}

const app = express();

app.use(upload());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dfw_ost-pic.html");
});

app.post("/", (req, res) => {
  if (req.files) {
    console.log(req.files);
    let file = req.files.file;
    let filename = file.name;
    let type = file.mimetype;
    console.log(filename);

    console.log(type);
    let time = new Date().getTime();
    console.log(time);
    filename = time + filename;
    console.log(filename);

    file.mv(path.join(__dirname, "uploads", filename), (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("File Uploaded");
        app.use("/uploads", express.static(path.join(__dirname, "static"))); // static folder

        //joining path of directory
        const directoryPath = path.join(__dirname, "uploads");
        //passsing directoryPath and callback function
        fs.readdir(directoryPath, function (err, files) {
          //handling error
          if (err) {
            return console.log("Unable to scan directory: " + err);
          }
          //listing all files using forEach
          files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            app.get(`/file-${file}`, (req, res) => {
                res.sendFile(path.join(__dirname, "uploads", file));
              });
          });
        });
      }
    });
  }
});

// file.mimetype

app.listen(5000);
