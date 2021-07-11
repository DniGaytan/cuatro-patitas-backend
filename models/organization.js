const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({});

module.exports = mongoose.model('Organization', organizationSchema);