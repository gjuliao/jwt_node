const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

//validation of user inputs
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    fname: Joi.string().min(3).required(),
    lname: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
})

const loginSchema = Joi.object({
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
});

// Function to check if email already exists
async function isEmailTaken(email) {
    return await User.findOne({ email: email });
}

router.post("/register", async(req, res) => {

    try {

        const { error } = await registerSchema.validateAsync(req.body);

        // getting error if exists with object deconstruction

        if(error){
            return res.status(400).json({ error: error.details[0].message });
        } 

         // Check if the email already exists
         const emailExist = await isEmailTaken(req.body.email);
         if (emailExist) {
             return res.status(400).json({ error: 'Email already exists' });
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

        const savedUser = await user.save();
        res.status(200).json({ message: "User created", user: savedUser });

    }

    catch (error){
        // res.status(500).json({error: error.message })
        res.status(500).send(error)
    }
});

router.post("/login", async(req, res) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Incorrect Email');

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid password');

    try {
        // validate user info

        const { error } = await loginSchema.validateAsync(req.body);

        if (error) return res.status(400).send(error.details[0].message);
        else {
            const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET);
            res.header("auth-token", token).send(token);
        }
    } catch (error) {
        res.status(500).send(error);
    }

});

module.exports = router;