const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", require("./src/routes/user.route"));
app.use("/task", require("./src/routes/task.route"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});