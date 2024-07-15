'use strict';

const express = require('express');
const udRoute = express.Router();
const connection = require('../db');

udRoute.put('/users/:uid', function (req, res, next) {
    const { name_admin, tel_admin } = req.body;
    const { uid } = req.params;

    // Validate inputs
    if (!name_admin || !tel_admin) {
        console.error('Validation error: Name and telephone number are required.');
        return res.status(400).send("Name and telephone number are required.");
    }

    connection.execute(
        "UPDATE admin_tbl SET name_admin=?, tel_admin=? WHERE id_admin=?;", [name_admin, tel_admin, uid]
    ).then(() => {
        console.log(`User with ID ${uid} updated successfully`);
        res.status(200).send("Update Successfully.");
    }).catch((err) => {
        console.error('Error updating user:', err);
        res.status(500).send("Error updating user.");
    });
});

udRoute.delete('/users/:uid', function (req, res, next) {
    const { uid } = req.params;

    connection.execute(
        "DELETE FROM admin_tbl WHERE id_admin=?;",
        [uid]
    ).then(() => {
        console.log(`User with ID ${uid} deleted successfully`);
        res.status(200).send("Delete Successfully.");
    }).catch((err) => {
        console.error('Error deleting user:', err);
        res.status(500).send("Error deleting user.");
    });
});

udRoute.use('/', function (req, res, next) {
    res.sendStatus(404);
});

module.exports = udRoute;
