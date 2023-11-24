import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { verifyAuth, validateEmail } from './utils.js';

/**
 * Register a new user in the system
  - Request Body Content: An object having attributes `username`, `email` and `password`.  check on the email parameter
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email!
 */
export const register = async (req, res) => {
    try {
        if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password"))
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

        let { username, email, password } = req.body;

        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") 
            return res.status(400).json({ error: "req.body.username or req.body.email or req.body.password is not a string"});

        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (username === "" || email === "" || password === "")
            return res.status(400).json({ error: "req.body.username or req.body.email or req.body.password is an empty string" });
        
        if (!validateEmail(email))
            return res.status(400).json({ error: "invalid email" });
        
        const userExistByUsername = await User.findOne({ username: username });
        if (userExistByUsername)
            return res.status(400).json({ error: "req.body.username identifies an already existing user" });

        const userExistByEmail = await User.findOne({ email: email });
        if (userExistByEmail)
            return res.status(400).json({ error: "req.body.email identifies an already existing user" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({data: {message: "User added successfully"}})

    } catch (err) {
        res.status(500).json({error: err.message})
    }
};

/**
 * Register a new user in the system with an Admin role
  - Request Body Content: An object having attributes `username`, `email` and `password`. check on the email parameter
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email
 */
export const registerAdmin = async (req, res) => {
    try {
        if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password"))
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

        let { username, email, password } = req.body;

        if (typeof username !== "string" || typeof email !== "string" || typeof password !== "string") 
            return res.status(400).json({ error: "req.body.username or req.body.email or req.body.password is not a string"});

        username = username.trim();
        email = email.trim();
        password = password.trim();

        if (username === "" || email === "" || password === "")
            return res.status(400).json({ error: "req.body.username or req.body.email or req.body.password is an empty string" });

        if (!validateEmail(email))
            return res.status(400).json({ error: "invalid email" });

        const userExistByUsername = await User.findOne({ username: username });
        if (userExistByUsername)
            return res.status(400).json({ error: "req.body.username identifies an already existing user" });

        const userExistByEmail = await User.findOne({ email: email });
        if (userExistByEmail)
            return res.status(400).json({ error: "req.body.email identifies an already existing user" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "Admin"
        });

        return res.status(200).json({data: {message: "Admin added successfully"}})

    } catch (err) {
        res.status(500).json({error: err.message})
    }

}

/**
 * Perform login 
  - Request Body Content: An object having attributes `email` and `password`
  - Response `data` Content: An object with the created accessToken and refreshToken
  - Optional behavior:
    - error 400 is returned if the user does not exist
    - error 400 is returned if the supplied password does not match with the one in the database
 */
export const login = async (req, res) => {
    try {
        if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password"))
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});
    
        let { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") 
            return res.status(400).json({ error: "req.body.email or req.body.password is not a string"});

        email = email.trim();
        password = password.trim();

        if (email === "" || password === "")
            return res.status(400).json({ error: "req.body.email or req.body.password is an empty string" });

        if (!validateEmail(email))
            return res.status(400).json({ error: "invalid email" });

        const userExist = await User.findOne({ email: email })
        if (!userExist)
            return res.status(400).json({ error: "you need to register" })

        const match = await bcrypt.compare(password, userExist.password);
        if (!match)
            return res.status(400).json({ error: "Wrong credential" })
        
        //CREATE ACCESSTOKEN
        const accessToken = await jwt.sign({
            email: userExist.email,
            id: userExist.id,
            username: userExist.username,
            role: userExist.role
        }, process.env.ACCESS_KEY, { expiresIn: '1h' })
        
        //CREATE REFRESH TOKEN
        const refreshToken = await jwt.sign({
            email: userExist.email,
            id: userExist.id,
            username: userExist.username,
            role: userExist.role
        }, process.env.ACCESS_KEY, { expiresIn: '7d' })

        //SAVE REFRESH TOKEN TO DB
        await User.updateOne({email: email},{ $set: { refreshToken: refreshToken } });
        res.cookie("accessToken", accessToken, { httpOnly: true, domain: "localhost", path: "/api", maxAge: 60 * 60 * 1000, sameSite: "none", secure: true })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, domain: "localhost", path: '/api', maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        return res.status(200).json({ data: { accessToken: accessToken, refreshToken: refreshToken } })
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

/**
 * Perform logout
  - Auth type: Simple
  - Request Body Content: None
  - Response `data` Content: A message confirming successful logout
  - Optional behavior:
    - error 400 is returned if the user does not exist
 */
export const logout = async (req, res) => {
    try {
        if (!('refreshToken' in req.cookies))
            return res.status(400).json({ error: "The request does not have a refresh token in the cookies"});
        
        const refreshToken = req.cookies.refreshToken;

        const user = await User.findOne({ refreshToken: refreshToken })
        if (!user)
            return res.status(400).json({ error: "The refresh token in the request's cookies does not represent a user in the database" })

        await User.updateOne({email: user.email},{ $set: { refreshToken: null } })

        res.cookie("accessToken", "", { httpOnly: true, path: '/api', maxAge: 0, sameSite: 'none', secure: true })
        res.cookie('refreshToken', "", { httpOnly: true, path: '/api', maxAge: 0, sameSite: 'none', secure: true })
        return res.status(200).json({data: { message: "User logged out"}})
        
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
