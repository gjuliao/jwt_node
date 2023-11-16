const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('..models/User');

//validation of user inputs
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
})

router.post("/register", async(req, res) => {
    // checking if user email is already registered
    const emailExist = await User.findOne({email: req.body.email});

    if (emailExist) {
        res.status(400).send('Email already exists');
        return;
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // adding user

    const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        // validate user input

        const { error } = await registerSchema.validateAsync(req.body);

        // getting error if exists with object deconstruction

        if(error){
            res.status(400).send(error.details[0].message);
            return;
        } else {

            // add user
            const saveUser = await user.save();
            res.status(200).send("user created")
        }
    }

    catch (error){
        res.status(500).send(error);
    }
});

module.exports = router;