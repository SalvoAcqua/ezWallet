import { handleDateFilterParams, verifyAuth, handleAmountFilterParams } from '../controllers/utils';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Group } from '../models/User';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '../app';
import { categories } from '../models/model';
import { transactions } from '../models/model';

dotenv.config();

beforeAll(async () => {
    const dbName = "testingDatabaseController";
    const url = `${process.env.MONGO_URI}/${dbName}`;

    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});


beforeEach(async () => {
    await categories.deleteMany({})
    await transactions.deleteMany({})
    await User.deleteMany({})
    await Group.deleteMany({})
})

const adminAccessTokenValid = jwt.sign({
    email: "admin@email.com",
    
    username: "admin",
    role: "Admin"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const adminAccessTokenExpired = jwt.sign({
    email: "admin@email.com",
    
    username: "admin",
    role: "Admin"
}, process.env.ACCESS_KEY, { expiresIn: '0s' })

const testerAccessTokenValid = jwt.sign({
    email: "tester@test.com",
    username: "tester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })


const testerAccessTokenExpired = jwt.sign({
    email: "tester@test.com",
    username: "tester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '0s' })

const testerAccessTokenEmpty = jwt.sign({}, process.env.ACCESS_KEY, { expiresIn: "1y" })


describe("handleDateFilterParams", () => { 
    test('Dummy test, change it', () => {
        expect(true).toBe(true);
    });
})

describe("verifyAuth", () => { 
    test("Tokens are both valid and belong to the requested user", () => {
         
        const req = { cookies: { accessToken: testerAccessTokenValid, refreshToken: testerAccessTokenValid } }
        const res = {}
         
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        
        expect(Object.values(response).includes(true)).toBe(true)
    })
    
    test("Undefined tokens", () => {
        const req = { cookies: {} }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        
        expect(Object.values(response).includes(false)).toBe(true)
    })

    test("Access token expired and refresh token belonging to the requested user", () => {
        const req = { cookies: { accessToken: testerAccessTokenExpired, refreshToken: testerAccessTokenValid } }
        
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', 
            value: expect.any(String), 
            options: { 
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })

    test("Access token expired and refresh token belonging to the requested admin", () => {
        const req = { cookies: { accessToken: adminAccessTokenExpired, refreshToken: adminAccessTokenValid } }
        
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        const response = verifyAuth(req, res, { authType: "Admin", username: "admin" })
        
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', 
            value: expect.any(String), 
            options: { 
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })
})

describe("handleAmountFilterParams", () => { 
    test('Dummy test, change it', () => {  
        expect(true).toBe(true);  
    });
})
