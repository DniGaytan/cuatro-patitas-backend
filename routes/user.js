const userModel = require('../models/user');
const express = require('express');
const router = express.Router();
const jsonParser = require('body-parser').json();


router.post('/register', jsonParser, (req, res) => {
    if (_.includes(req.body, undefined) || _.includes(req.body, null)) {
        return res.json({
            message: 'Field should not be left blank',
            error: true,
        });
    }

    const { firstname, lastname, email, password, organization } = req.body;

    userModel.create({ firstname, lastname, email, password, organization }).then(registeredUser => {
        return res.json({
            error: false,
            registeredUser,
        });
    }).catch(e => {
        return res.status(500).json(
            {
                message: `Error in user registration: ${e}`,
                error: true,
            });
    });
});

router.get('/get/all', jsonParser, (req, res) => {
    userModel.find({}).then(users => {
        return res.json({
            error: false,
            users,
        })

    }).catch(e => {
        return res.status(500).json({
            message: `Error in getting users: ${e}`,
            error: true,
        });
    });
});

router.get('/get/:_id', jsonParser, (req, res) => {
    userModel.find({ _id }).then(user => {
        if (user == null) {
            return res.status(404).json({
                message: 'User not found',
                error: true,
            });
        }
        return res.json({
            error: false,
            user,
        });
    }).catch(e => {
        return res.status(500).json({
            message: `Error in getting user: ${e}`,
            error: true,
        });
    });
});

module.exports = router;