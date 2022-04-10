const User = require('../model/users.model')
require('dotenv').config();
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { generateAccessToken } = require('./authorization.js')
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

exports.getUsers = async (req, res) => {
    try{
        const users = await User.find()
        res.send(users);
    }
    catch{
        return res.sendStatus(500);
    }
}

exports.authenticate = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({error: "Invalid Input"});
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.json({"error": "User not found"});
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const responseData = generateAccessToken(user);
                res.json(responseData);
            }
            else {
                res.json({"error": "Invalid password"});
            }
        })
        .catch(err => {
            res.json({"error": err});
        });
}

exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try
    {
        const userExists = await User.findOne({email: req.body.email})
        if(userExists)
        {
            return res.json({"error":"User already exists"});
        }
        const newUser = req.body;
        newUser.password = bcrypt.hashSync(newUser.password, 10);
        const user = await User.create(newUser)
        user.save();
        const sendData = generateAccessToken(user);
        res.json(sendData);
    }
    catch
    {
        return res.sendStatus(500);
    }
}

exports.updateUser = (req, res) => {
    if(req.user.id === req.params.id || req.user.admin)
    {
        User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => {
            if(!user)
            {
                return res.json({"error":"User doesn't exist"})
            }
            res.send(user);
        })
        .catch(err => {
            res.json({'error': err});
        });
    }
    else
    {
        res.sendStatus(403);
    }
}

exports.deleteUser = (req, res) => {
    if(req.user.id === req.params.id || req.user.admin)
    {
        User.findByIdAndRemove(req.params.id)
        .then(user => {
            if(!user)
            {
                return res.json({"error":"User doesn't exist"})
            }
            res.send(user);
        })
        .catch(err => {
            res.json({'error': err});
        });
    }
    else
    {
        res.sendStatus(403);
    }
}

const generateRandomPassword = () => {
    return bcrypt.hashSync((Math.random() + 1).toString(36).substring(7), 10);
}

exports.googleLogin = (req, res) => {
    const {tokenId} = req.body;
    client.verifyIdToken({ idToken: tokenId, audience:process.env.GOOGLE_CLIENT_ID})
        .then(response => {
            const { email_verified, email } = response.payload;
            if(email_verified) {
                User.findOne({email})
                    .then(user => {
                        if(user)
                        {
                            const sendData = generateAccessToken(user);
                            res.send(sendData);
                        }
                        else
                        {
                            let password = generateRandomPassword()
                            let newUser = new User({ email, password , admin:false});
                            console.log(newUser)
                            newUser.save((err, data) => {
                                if (err)
                                {
                                    return res.sendStatus(400);
                                }
                                const sendData = generateAccessToken(data);
                                res.send(sendData);
                            });

                        }
                    })
                    .catch(err => {
                        return res.sendStatus(400)
                    })
            }
            else{
                res.sendStatus(400)
            }
        })
        .catch(err => {
            res.json({"error": err})
        })
}