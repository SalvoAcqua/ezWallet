
import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
const bcrypt = require("bcryptjs")
import { categories, transactions } from '../models/model';
import {register, registerAdmin, login, logout} from '../controllers/auth';
import { validateEmail } from '../controllers/utils';


jest.mock("bcryptjs")
jest.mock('../models/User.js');
jest.mock('../controllers/utils');

beforeEach(() => {
  User.find.mockClear()
  User.findOne.mockClear()
})

describe('register', () => { 
    test("Register with username and email unique, succeed ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)

        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        jest.spyOn(User, "create").mockResolvedValueOnce( { username : 'test3', email : 'test3@example', password : '1234'})
    
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(200)
      })
      test("Register with username missing , error ", async () => {
   
        const mockReq = {
          body : {  email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username and email existing, erro ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)

        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username : 'test3', email : 'test3@example', password : '1234'})
    
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username unique and email multiple, error ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username unique and email multiple, error ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

   

      test("Register with email incorrect ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test3example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(false)
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with name empty,error ", async () => {
   
        const mockReq = {
          body : { username : '', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

});

describe("registerAdmin", () => { 
    test("Register with username and email unique, succeed ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)

        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        jest.spyOn(User, "create").mockResolvedValueOnce( { username : 'test3', email : 'test3@example', password : '1234', role : 'Admin' })
    
        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(200)
      })

      test("Register with username unique and email multiple, error ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)

        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    
        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })
      test("Register with username multiple and email unique, error ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })

        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username missing, error ", async () => {
   
        const mockReq = {
          body : { email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
    
        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username empty and email correct, error ", async () => {
   
        const mockReq = {
          body : { username : '', email : 'test1@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
       
        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with username multiple and email unique, error ", async () => {
   
        const mockReq = {
          body : { username : 'test1', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    
        await registerAdmin(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with email incorrect ", async () => {
   
        const mockReq = {
          body : { username : 'test3', email : 'test3example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(false)
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })

      test("Register with name empty, error ", async () => {
   
        const mockReq = {
          body : { username : '', email : 'test3@example', password : '1234'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        await register(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)
      })
})

describe('login', () => { 
    //Work until //SAVE REFRESH TO DB
    test("login with userEmail known and password correct, succeed ", async () => {
   
        const mockReq = {
          body : {email : 'test3@example', password : '1234'},
          cookies : {accesToken : '11'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username : 'test3', email : 'test3@example', password : '1234', role : 'Admin', refreshToken : 'aa'})
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true)
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("aa")
        jest.spyOn(jwt, "sign").mockResolvedValueOnce("bb")
      

        await login(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({data :{ accessToken : "aa", refreshToken : "bb"}})

      })
      test("login with userEmail unknown and password wrong, error ", async () => {
   
        const mockReq = {
          body : {email : 'test3@example', password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)

        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
        await login(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)

      })

      test("login with userEmail missing, error ", async () => {
   
        const mockReq = {
          body : {password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        await login(mockReq, mockRes)
       

        expect(mockRes.status).toHaveBeenCalledWith(400)

      })
      test("login with userEmail empty, error ", async () => {
   
        const mockReq = {
          body : {email : '', password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        await login(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)

      })

      test("login with userEmail unknown and password wrong, error ", async () => {
   
        const mockReq = {
          body : {email : 'test3@example', password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

        await login(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(400)

      })

      test("login with userEmail known and password wrong, error ", async () => {
   
        const mockReq = {
          body : {email : 'test3@example', password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(true)
        jest.spyOn(User, "findOne").mockResolvedValueOnce({ username : 'test3', email : 'test3@example', password : '1234', role : 'Admin', refreshToken : "aa"})
        jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false)

        await login(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)

      })

      
      test("login with userEmail incorrect, error ", async () => {
   
        const mockReq = {
          body : {email : 'test3example', password : '1234'},
          cookies : {accesToken : "11"}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }
        validateEmail.mockReturnValueOnce(false)
      
        await login(mockReq, mockRes)
    
        expect(mockRes.status).toHaveBeenCalledWith(400)

      })

});

describe('logout', () => { 
  // Problem with user.save()
  test("logout with refreshToken correct, succeed ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : '11'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }
    
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username : 'test3', email : 'test3@example', password : '1234', role : 'Admin', refreshToken : 'aa'})
   
    await logout(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data :{ message: "User logged out"}})

  })

  test("logout with refreshToken empty, error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : ''}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }

    
    await logout(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)

  })

  test("logout with refreToken unknown, error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : '11'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    }

    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

    await logout(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)

  })

});
