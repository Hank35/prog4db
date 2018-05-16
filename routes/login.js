// Require modules
const express           = require('express');
const jwt               = require('jsonwebtoken');
const database          = require('../database');
const { validate }      = require('../models/login');
const mysql             = require('mysql');

// Get router
const router = express.Router();

// Login route
router.post('/', (req, res) => {

    // Getting client input
    let userClient = {
        email: req.body.email,
        password: req.body.password
    };

    // Validating client input
    const { error } = validate(userClient);
    if (error) return res.status(400).send(error.details[0].message);

    
    database.query(`SELECT * FROM user WHERE email = '${userClient.email}'`, (error, result, fields) => {
        if(error) return console.log(error);
        if (result.length > 1) {
            // Get user from server
            let userServer = {
                id: result[0].ID,
                email: result[0].email,
                password: result[0].password
            };
            // Log some information
            console.log('User from client:\n', userClient);
            console.log('Linked user from server:\n', userServer);
            // If password is correct
            if (userServer.password == userClient.password) {
                const token = jwt.sign({ userServer }, 'AardappeLKrokeT');
                const loginResult = {
                    email: userServer.email,
                    token: token
                };
                res.json(loginResult);
                // Log some information
                console.log('LoginResult:\n', loginResult);
            }
            // If password is not correct
            else {
                res.send('Password is incorrect');
            }
        }
        // If user not exists
        else {
            res.send('Not a valid user');
        }
    })
});


module.exports = router;