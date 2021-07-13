const jsonParser = require('body-parser').json();
const userModel = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWTTOKEN, JWTEXPIRATION } = require('../config');
const router = express.Router();

router.post('/register', jsonParser, (req, res) => {
    if (_.includes(req.body, undefined) || _.includes(req.body, null)) {
        return res.status(406).json({
            message: 'Field should not be left blank',
            error: true,
        });
    }

    const { firstname, lastname, email, password, organization} = req.body;

    //password hashing
    const passwordSalt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, passwordSalt);

    //Storing user into user collection
    userModel.create({ firstname, lastname, email, hashedPassword, organization }).then(registeredUser => {
        //generation a session
        res.session.hash = jwt.sign({
            data: registeredUser.id,
          }, JWTTOKEN, { expiresIn: JWTEXPIRATION }); 

        return res.status(201).json({
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

router.post('/login', jsonParser, (req, res) => {
    if (_.includes(req.body, undefined) || _.includes(req.body, null)) {
        return res.status(406).json({
            message: 'Field should not be left blank',
            error: true,
        });
    }

    jwt.verify(req.session.hash, JWTTOKEN).then(decoded => {
        if(decoded !== undefined){
            // session exists
            return res.status(400).json({
                message: 'Session exists',
                error: true,
            });
        }
    }).catch(e => {
        return res.status(500).json({
            message: `Something bad happend while decoding the session hash: ${e}`,
            error: true,
        });
    });
    
    const { email, password } = req.body;

    //retrieves user by email
    userModel.find({email}).then( user => {
        //validates password
        if(!bcrypt.compareSync(password, user.password)){
            //generation a session
            res.session.hash = jwt.sign({
                data: user.id,
            }, JWTTOKEN, { expiresIn: JWTEXPIRATION }); 
            return res.status(406).json({
                message: 'Wrong password',
                error: true,
            });
        }
    }).catch( e => {
        return res.status(500).json(
            {
                message: `Error in user login: ${e}`,
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