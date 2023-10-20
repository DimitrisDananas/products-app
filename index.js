const express = require("express");

const mongoose = require("mongoose");
const app = express();
const port = 3000;

const cors = require('cors') // για να δηλωνω ποιες διευθυνσεις επιτρεπονται
const user = require('./routes/user.routes');
const product = require('./routes/product.routes');
const userProduct = require('./routes/user-product.routes')

app.use(express.json());
app.use(express.urlencoded({extended: false}))

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(
        () => { console.log("Connection with database established")},
        err => {console.log("Failed to connect with database", err)}
    );


app.use(cors({
    origin:"*" // Το "*" σημαινει οτι επιτρεπει ολες τις διευθυνσεις
    // origin: ["http://www.example.com", "http://localhost:8001"]
}))

app.use('/', express.static('files'));

app.use('/api/users', user);
// app.use('/api/product', product)
app.use('/api/user-product', userProduct);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument.options))

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});