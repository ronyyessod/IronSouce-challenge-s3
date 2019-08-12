const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 8080;

// bring in routes
const filesRoutes = require("./routes/files");

// middleware
app.use(morgan("dev"));
app.use("/", filesRoutes);

app.listen(port, () => {
    console.log(`A Node JS app is listening on port: ${port}`)
});