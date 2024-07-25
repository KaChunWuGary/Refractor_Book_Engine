require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://garykachunwu:2zzrklrsvmDQdUzC@cluster0.nfmkh4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

module.exports = mongoose.connection;
