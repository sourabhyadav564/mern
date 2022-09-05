const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('../db/conn');
const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send('Hello');
});

//using promises
// router.post('/register', (req, res) => {

//     const { name, email, phone, password, cpassword } = req.body;

//     if (!name || !email || !phone || !password || !cpassword) {
//         return res.status(422).send('Missing fields');
//     }

//     User.findOne({ email: email }).then((userExists) => {
//         if (userExists) {
//             return res.status(422).send('Email already exists');
//         }

//         const user = new User({ name, email, phone, password, cpassword });
//         user.save().then(() => {
//             res.status(201).send('User created');
//         }).catch(err => {
//             res.status(500).json(err);
//         });
//     }).catch(err => {
//         res.status(500).json(err);
//     });

// });

//using async await
router.post('/register', async (req, res) => {

    const { name, email, phone, password, cpassword } = req.body;

    if (!name || !email || !phone || !password || !cpassword) {
        return res.status(422).send('Missing fields');
    }

    try {
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(422).send('Email already exists');
        }
        else if (password != cpassword) {
            return res.status(422).send('Passwords do not match');
        } else {
            const user = await new User({ name, email, phone, password, cpassword });
            const userRegister = await user.save();
            if (userRegister) { res.status(201).send('User created'); }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//login route

router.post('/signin', async (req, res) => {
    let token;
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).send('Invalid Credentials');
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();

            res.cookie("jwt-token", token, {
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(404).json({ error: "Invalid Credentials" })
            } else {
                res.status(200).json({ message: "Sigin Successfully" })

            }
        }
        else {
            res.status(400).json({ error: "Invalid Credentials" });

        }

    } catch (err) {
        console.log(err);
    }
})

module.exports = router;