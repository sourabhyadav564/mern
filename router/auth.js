const express = require('express');

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

        const user = await new User({ name, email, phone, password, cpassword });
        const userRegister = await user.save();
        if (userRegister) { res.status(201).send('User created'); }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;