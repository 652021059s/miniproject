'use strict';

const express = require('express');
const crypto = require('crypto');
const wrRoute = express.Router();
const connection = require('../db');

wrRoute.post('/users', function (req, res, next) {
    const { name_admin, tel_admin, username_admin, email_admin, password_admin } = req.body;

    if (!password_admin) {
        return res.status(400).send('Password is required');
    }

    let mypass;
    try {
        mypass = crypto.createHash('md5').update(password_admin).digest('hex');
    } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).send('Error hashing password');
    }

    connection.execute(`
        INSERT INTO admin_tbl 
        (name_admin, tel_admin, username_admin, email_admin, password_admin) 
        VALUES (?, ?, ?, ?, ?);`,
        [
            name_admin,
            tel_admin,
            username_admin,
            email_admin,
            mypass
        ]
    ).then(() => {
        console.log('Insertion successful');
        res.status(200).send('User created successfully');
    }).catch((err) => {
        console.error('Error inserting user:', err);
        res.status(500).send('Error inserting user');
    });
});
// Get all users
wrRoute.get('/users', function (req, res, next) {
    connection.execute('SELECT * FROM admin_tbl;')
        .then((result) => {
            var users = result[0];
            res.json(users); // Send users as JSON response
        }).catch((err) => {
            console.error('Error fetching users:', err);
            res.status(500).send("Error fetching users.");
        });
});

// Handle 404 for undefined routes
wrRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = wrRoute;
