const express = require('express');
const cors = require('cors');
const app = express();
connectDB=require('./config/ConnectionDB');

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));

app.use(require('./routes/authRoutes'));
app.use(require('./routes/uploadRoutes'));
app.use(require('./routes/conversationRoutes'));
connectDB();
module.exports = app;
