import { query } from 'express';
import { handleDateFilterParams, verifyAuth, handleAmountFilterParams, validateDate, validateEmail } from '../controllers/utils';
import jwt from 'jsonwebtoken';
const bcrypt = require("bcryptjs")

jest.mock("bcryptjs")
jest.mock("jsonwebtoken")
jest.mock("../models/User.js")
jest.mock("../models/model.js")

beforeEach(() => {
    jest.clearAllMocks()
})



describe("verifyAuth", () => { 
   
   
    test("Tokens are both valid and belong to the requested user", () => {
        
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

     
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        
        jwt.verify.mockReturnValue(decodedAccessToken)

        
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        
        expect(Object.values(response).includes(true)).toBe(true)
    })


    test("Tokens are both valid and belong to the requested Admin", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)

        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })
        
        expect(Object.values(response).includes(true)).toBe(true)
    })   

    test("Tokens are both valid and simple authentication is required", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}
        

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "Simple", username: "tester" })
 
        expect(Object.values(response).includes(true)).toBe(true)
    })

    test("Tokens are both valid, Mismatched accessTokenUser or refreshTokenUser and Username and user authentication is required", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}
        

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)
        
        const response = verifyAuth(req, res, { authType: "User", username: "test1" })
 
        expect(Object.values(response).includes(false)).toBe(true)
    })
    
    test("Tokens are both valid, but One (or both) of tokens doesn't have Admin role when performing Admin auth", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })
        
        expect(Object.values(response).includes(false)).toBe(true)
    })   

    test("Tokens are both valid, but the user doesn't belong to the group", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Group", username: "tester", emails: [ "tester1@test.com", "prova1@test.com"] })
        
        expect(Object.values(response).includes(false)).toBe(true)
    }) 

    test("Tokens are both valid and the user belong to the group", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Group", username: "tester", emails: [ "tester@test.com", "prova1@test.com"] })
        
        expect(Object.values(response).includes(true)).toBe(true)
    }) 
   
    test("Invalid authorization required", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
        
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        const response = verifyAuth(req, res, { authType: "Error", username: "tester", emails: [ "tester@test.com", "prova1@test.com"] })
        
        expect(Object.values(response).includes(false)).toBe(true)
    }) 

    test("Undefined tokens", () => {
        const req = { cookies: {} }
        const res = {}
        const response = verifyAuth(req, res, { authType: "Simple" })
        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    })

    test("Uncomplete access token", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        
        const decodedAccessToken = {
            email: "tester@test.com",
            role: "Admin"
        }
        

        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        //the test is made before the check on info parameter
        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })


        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    })

    test("Uncomplete refresh token", () => {
       
        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
       
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "tester@test.com",
            role: "Admin"
        }
        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        //the test is made before the check on info parameter
        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })


        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    })


    test("Mismatched accessTokenUser and refreshTokenUser", () => {

        const req = { cookies: { accessToken: "testerAccessTokenValid", refreshToken: "testerAccessTokenValid" } }
        const res = {}
        

        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
       
        jwt.verify.mockReturnValueOnce(decodedAccessToken)

        const decodedRefreshToken = {
            email: "test1@test.com",
            username: "test",
            role: "Admin"
        }
        

        jwt.verify.mockReturnValueOnce(decodedRefreshToken)

        //the test is made before the check on info parameter
        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })


        //The test is passed if the function returns an object with a false value, no matter its name
        expect(Object.values(response).includes(false)).toBe(true)
    })
    



    /**
     * The only situation where the response object is actually interacted with is the case where the access token must be refreshed
     */
    test("Access token expired and refresh token belonging to the requested user", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        //The first call to verify must fail due to the access token being expired, so we substitute its implementation this way
        //"Once" is needed in order to not have the second check cause a failing scenario 
        //The check inside verifyAuth depends on the error's name, so this name must be set explicitly
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
        //The second call to verify will return the "decoded" token with the parameters we want
        jwt.verify.mockReturnValue(decodedAccessToken)
        //The newly created access token should be a string, in this case we only care about the "sign" method returning a string
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The response must have a true value (valid refresh token and expired access token)
        expect(Object.values(response).includes(true)).toBe(true)
        expect(res.cookieArgs).toEqual({
            name: 'accessToken', //The cookie arguments must have the name set to "accessToken" (value updated)
            value: expect.any(String), //The actual value is unpredictable (jwt string), so it must exist
            options: { //The same options as during creation
                httpOnly: true,
                path: '/api',
                maxAge: 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
            },
        })
        //The response object must have a field that contains the message, with the name being either "message" or "refreshedTokenMessage"
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(true)
    })

    test("User authentication required, Access token expired and refresh token not belonging to same User", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "User", username: "tester1" })
       
        expect(Object.values(response).includes(false)).toBe(true)
        expect(res.cookieArgs).toBe(undefined)
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(false)
    })

    test("Access token expired and refresh token belonging to the requested user, simple authentication required", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Simple", username: "tester" })
       
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


    test("Access token expired and refresh token belonging to the requested user, not defined authentication required", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "error", username: "tester" })
       
        expect(Object.values(response).includes(false)).toBe(true)
        expect(res.cookieArgs).toBe(undefined)
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(false)
    })


    test("Group authentication required, Access token expired and refresh token belonging to a user in the group", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Group", username: "tester", emails: [ "tester@test.com", "prova1@test.com"] })
       
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

    test("Group authentication required, Access token expired and refresh token not belonging to a user in the group", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Regular"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Group", username: "tester", emails: [ "tester1@test.com", "prova1@test.com"] })
       
        expect(Object.values(response).includes(false)).toBe(true)
        expect(res.cookieArgs).toBe(undefined)
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(false)
    })


    test("Admin authentication required, Access token expired and refresh token not belonging to an Admin", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "User"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })
       
        expect(Object.values(response).includes(false)).toBe(true)
        expect(res.cookieArgs).toBe(undefined)
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(false)
    })

    test("Admin authentication required, Access token expired and refresh token belonging to an Admin", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenValid" } }
      
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
      
        const res = {
            cookie: cookieMock,
            locals: {},
        }
        
        jwt.verify.mockImplementationOnce((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
        const decodedAccessToken = {
            email: "tester@test.com",
            username: "tester",
            role: "Admin"
        }
       
        jwt.verify.mockReturnValue(decodedAccessToken)
       
        jwt.sign.mockReturnValue("refreshedAccessToken")
        const response = verifyAuth(req, res, { authType: "Admin", username: "tester" })
       
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


    test("Access token and refresh token are both invalid", () => {
        const req = { cookies: { accessToken: "invalidAccessToken", refreshToken: "invalidRefreshToken" } }
        const res = {}
        //The verify function throws an error any time it's called in this test, meaning that both tokens are invalid
        jwt.verify.mockImplementation((token, secret) => {
            const error = new Error('JsonWebTokenError')
            error.name = 'JsonWebTokenError'
            throw error
        })
        const response = verifyAuth(req, res, { authType: "Simple" })
        expect(Object.values(response).includes(false)).toBe(true)
    })

    test("Access token expired and refresh token expired", () => {
        const req = { cookies: { accessToken: "testerAccessTokenExpired", refreshToken: "testerAccessTokenExpired" } }
        //The inner working of the cookie function is as follows: the response object's cookieArgs object values are set
        const cookieMock = (name, value, options) => {
            res.cookieArgs = { name, value, options };
        }
        //In this case the response object must have a "cookie" function that sets the needed values, as well as a "locals" object where the message must be set 
        const res = {
            cookie: cookieMock,
            locals: {},
        }
       
        jwt.verify.mockImplementation((token, secret) => {
            const error = new Error('TokenExpiredError')
            error.name = 'TokenExpiredError'
            throw error
        })
       
    
        const response = verifyAuth(req, res, { authType: "User", username: "tester" })
        //The response must have a true value (valid refresh token and expired access token)
        expect(Object.values(response).includes(false)).toBe(true)
        expect(res.cookieArgs).toBe(undefined)
        
        const message = res.locals.refreshedTokenMessage ? true : res.locals.message ? true : false
        expect(message).toBe(false)
    })
   
})






describe("handleDateFilterParams", () => {
    /**
     * The same reasoning for verifyAuth applies here: the request object with the query parameters must be created
     */
    test(`Returns an object with a property "date" having as value an object with properties "$gte" and "$lte", with these properties both referring to the specified date, if only "date" is specified`, () => {
   
        const req = { query: { date: "2023-04-21" } }
        const res = handleDateFilterParams(req)
        const parsedData = new Date(req.query.date)
        parsedData.setHours(0,0,0,0)
        res.date.$gte.setHours(0,0,0,0)
        res.date.$lte.setHours(0,0,0,0)
        
        expect(res).toHaveProperty("date")
        expect(res.date).toHaveProperty("$gte")
        expect(res.date).toHaveProperty("$lte")
        expect(res.date.$gte.getTime()).toEqual(parsedData.getTime())
        expect(res.date.$lte.getTime()).toEqual(parsedData.getTime())
    
    })

    test(`Query has from and upTo, Returns an object with a property "date" having as value an object with properties "$gte" and "$lte"`, () => {
        const req = { query: { from: "2023-04-10", upTo:"2023-05-10" } }
     
        const res = handleDateFilterParams(req)
        
        expect(res).toHaveProperty("date")
        expect(res.date).toHaveProperty("$gte")
        expect(res.date).toHaveProperty("$lte")

        const parsedData = new Date(req.query.from)
        parsedData.setHours(0,0,0,0)
        
        
        const parsedData1 = new Date(req.query.upTo)
        parsedData1.setHours(0,0,0,0)
        res.date.$gte.setHours(0,0,0,0)
        res.date.$lte.setHours(0,0,0,0)
        
        
        expect(res.date.$gte.getTime()).toEqual(parsedData.getTime())
        expect(res.date.$lte.getTime()).toEqual(parsedData1.getTime())
    })
    test(`Query has from, Returns an object with a property "date" having as value an object with property "$gte"`, () => {
        const req = { query: { from: "2023-04-10" } }
     
        const res = handleDateFilterParams(req)
       
        expect(res).toHaveProperty("date")
        expect(res.date).toHaveProperty("$gte")
        
        const parsedData = new Date(req.query.from)
        parsedData.setHours(0,0,0,0)
        res.date.$gte.setHours(0,0,0,0)

        expect(res.date.$gte.getTime()).toEqual(parsedData.getTime())

       
    })
    test(`Query has upTo, Returns an object with a property "date" having as value an object with property "$lte"`, () => {
        const req = { query: { upTo: "2023-04-10" } }
     
        const res = handleDateFilterParams(req)
      
        expect(res).toHaveProperty("date")
        expect(res.date).toHaveProperty("$lte")
        
        const parsedData1 = new Date(req.query.upTo)
        parsedData1.setHours(0,0,0,0)
        res.date.$lte.setHours(0,0,0,0)

        expect(res.date.$lte.getTime()).toEqual(parsedData1.getTime())
       
    })


    /**
     * Testing the way the function handles errors
     */
    test(`Throws an error if at least one of the query parameters is not a date in the format "YYYY-MM-DD"`, () => {
        //The date is in the correct format but is not an actual date (there are only twelve months)
        const req1 = { query: { date: "2023-13-21" } }
        //The date is valid but is not in the correct formant
       
        const req2 = { query: { upTo: "21-03-2023" } }
        
        //The function is expected to throw an error when called with both request objects
        expect(() => handleDateFilterParams(req1)).toThrow()
        expect(() => handleDateFilterParams(req2)).toThrow()
    })

    test(`Throws an error if date is present in the query parameter together with at least one of from or upTo`, () => {

        const req1 = { query: { date: "2023-10-21",  upTo: "2024-02-02" } }
       
        expect(() => handleDateFilterParams(req1)).toThrow()
        
    })


})


describe("handleAmountFilterParams", () => { 
    test('Query has min parameter and min is not a numerical value', () => {
        const req1={ query: {min : "f2"}}
        expect(() => handleAmountFilterParams(req1)).toThrow()
    });
    test('Query has max parameter and max is not a numerical value', () => {
        const req1={ query: {max: "f3"}}
        const req2={ query: {min:2, max: "f3"}}
        expect(() => handleAmountFilterParams(req1)).toThrow()
        expect(() => handleAmountFilterParams(req2)).toThrow()   
    });
    

    test('Defined min', () => {
        const req = { query: { min: 2} }
       
        const res = handleAmountFilterParams(req)
        //The response object should be: {amount: {$gte: 10}
      
        expect(res).toHaveProperty("amount")
        expect(res.amount).toHaveProperty("$gte")
       
        expect(res.amount.$gte).toEqual(req.query.min)
        
    });
    test('Defined max', () => {
        const req = { query: { max: 20} }
       
        const res = handleAmountFilterParams(req)
        //The response object should be: {amount: {$lte: 50}
      
        expect(res).toHaveProperty("amount")
        expect(res.amount).toHaveProperty("$lte")
       
        expect(res.amount.$lte).toEqual(req.query.max)
    });
    test('Defined min and max', () => {
        const req = { query: {min:2, max: 20} }
       
        const res = handleAmountFilterParams(req)
        
      
        expect(res).toHaveProperty("amount")
        expect(res.amount).toHaveProperty("$lte")
        expect(res.amount).toHaveProperty("$gte")
        expect(res.amount.$lte).toEqual(req.query.max)
        expect(res.amount.$gte).toEqual(req.query.min)
    });
})

describe("validateEmail", () => { 
    test('uncorrect email', () => {

        const email = "test.com"
        
        expect(validateEmail(email)).toBe(null)
        
    });
})

describe("validateDate", () => {
    test('Not Valid date', () => {

        expect(validateDate("21-03-2023")).toBe(false)
        expect(validateDate(21032023)).toBe(false)

    });
})