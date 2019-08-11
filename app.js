const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8080;

// bring in routes
const postRoutes = require("./routes/files");

// middleware
app.use(morgan("dev"));
app.use("/", postRoutes);

app.listen(port, () => {
    console.log(`A Node JS app is listening on port: ${port}`)
});

// exposes all routes from routes