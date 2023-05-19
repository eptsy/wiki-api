const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wikipi");

const Article = mongoose.model("Article", {
  title: String,
  content: String,
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app
  .route("/articles")
  .get((req, res) => {
    Article.find({})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);
    const article1 = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article1.save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("successfully added");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({})
      .then((data) => {
        console.log(data, "—deleted");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });

app
  .route("/articles/:result")
  .get((req, res) => {
    let result = req.params.result;
    Article.findOne({ title: result })
      .then((data) => {
        if (data != null) {
          res.send(data);
          console.log(result, "— found");
        } else {
          res.send("— not found");
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .put((req, res) => {
    // change whole document
    let result = req.params.result;
    Article.updateOne(
      { title: result },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { overwriteDiscriminatorKey: true }
    ).then((data) => {
      res.send("—updated successfully");
      console.log("—updated successfully");
    });
  })
  .patch((req, res) => {
    let result = req.params.result;
    Article.updateOne(
      {
        title: result,
      },
      { $set: req.body }
    )
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  })
  .delete((req, res) => {
    let result = req.params.result;
    Article.deleteOne({ title: result })
      .then((data) => {
        res.send("— deleted successfully");
        console.log(data, "— deleted successfully");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });

app.listen(3000, () => {
  console.log("listening to 3000");
});
