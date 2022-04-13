const User = require('../model/users.model')
require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { generateAccessToken } = require('./authorization.js')
const {OAuth2Client} = require('google-auth-library');
const error500msg = "Something went wrong! Try again.";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.authenticate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
      return res.status(400).send("Invalid email");
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found");
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const responseData = generateAccessToken(user);
                res.json(responseData);
            }
            else {
                res.status(400).send("Wrong password");
            }
        })
        .catch(err => {
            return res.status(500).send(error500msg);
        });
}

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
      return res.status(400).send("Validation error");
    }

    try
    {
        const userExists = await User.findOne({email: req.body.email})
        if(userExists)
        {
            return res.status(400).send("User with this email already exists");
        }
        const newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.password, 10);
        const user = await User.create(newUser)
        user.save();
        const sendData = generateAccessToken(user);
        res.json(sendData);
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send(error500msg);
    }
}

const generateRandomPassword = () => {
    var passwordLength = Math.floor(Math.random() * 5) + 8;
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~`! @#$%^&*()_-+={[}]|\\:;\"'<,>.?/";
    var password = "";
    for(var i=0, n = charset.length; i < passwordLength; i++)
    {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return bcrypt.hashSync(password, 10);
}

exports.googleLogin = async (req, res) => {
    const {tokenId} = req.body;
    //  verify token with Google oauth client
    googleClient.verifyIdToken({ idToken: tokenId, audience:process.env.GOOGLE_CLIENT_ID})
        .then(async (response) => {
            console.log(response, "RESPONSE");
            const { name, email } = response.payload;
            try {
                var user = await User.findOne({email})
                // if user exists in database generate access token else add user in database
                if(user)
                {
                    var sendData = generateAccessToken(user);
                    return res.send(sendData);
                }
                // set name and password
                var password = generateRandomPassword();
                var newUser = new User({ name, email, password , admin:false});
                var data = await newUser.save();
                var sendData = generateAccessToken(data);
                res.send(sendData);
            }
            catch(err)
            {
                return res.status(500).send(error500msg)
            }
        })
        .catch(err => {
            return res.status(500).send(error500msg)
        })
}