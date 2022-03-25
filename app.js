const express = require('express');


const mongoose = require('mongoose');


const app = express();


app.use(express.json());


const connect = () => {

    return mongoose.connect("mongodb://127.0.0.1:27017/blog1")
};


const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    labels: { type: String, required: true },
    author: { type: String, required: true },
    like: { type: Number, required: false, default: 0 },
    ispublish: { type: Boolean, required: false, default: false }

}, {
    versionKey: false,
    timestamps: true,
});

const Blog = mongoose.model("blog", blogSchema);


//adding a new blogs

app.post("/blogpost", async (req, res) => {

    try {

        const blog1 = await Blog.create(req.body);

        return res.status(201).send(blog1);
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });
    }

})


// getting all blog sort in decending order by likes;

app.get("/blogget", async (req, res) => {
    try {
        const blog1 = await Blog.find().sort({ like: -1 });

        return res.send({ blog1 })
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });
    }
})



// search blog by author and title;


app.get("/search", async (req, res) => {
    try {

        const authorName = req.query.author;
        const titleName = req.query.title;

        const blog1 = await Blog.find({ $or: [{ author: authorName }, { title: titleName }] });

        return res.status(201).send({ blog1 });

    } catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });
    }
});


// blog published

app.post("/blog/published/:id", async (req, res) => {
    try {

        const blog1 = await Blog.findByIdAndUpdate(req.params.id, { ispublish: true }, { new: true });

        return res.status(201).send({ blog1 })

    } catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });
    }
})


// get only one blog;

app.get("/blogone/:id", async (req, res) => {
    try {
        const blog1 = await Blog.findById(req.params.id).lean().exec();

        return res.status(201).send({ blog1 });
    }
    catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });
    }
});


// like a blog


app.post("/blog/like/:id", async (req, res) => {
    try {
        const blog1 = await Blog.findOneAndUpdate({ id: req.params.id }, { $inc: { like: 1 } }, { new: true });

        return res.status(201).send({ blog1 })
    } catch (err) {
        return res.status(500).json({ message: err.message, status: "failed" });

    }
})







app.listen(2000, async function () {
    await connect();

    console.log("listening on port 2000");
})