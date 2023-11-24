import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
const bcrypt = require("bcryptjs")
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

beforeAll(async () => {
  const dbName = "testingDatabaseAuth";
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
const adminAccessTokenValid = jwt.sign({
  email: "admin@email.com",
  //id: existingUser.id, The id field is not required in any check, so it can be omitted
  username: "admin",
  role: "Admin"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid = jwt.sign({
  email: "tester@test.com",
  username: "tester",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

describe('register', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test.only("Register, succeed", async ()=> {


    
    const response =  await request(app)
    .post("/api/register")
    .send({username : "test", email: "tester@test.com", password : "test"})

    expect(response.status).toBe(200)

  })

  test.only("Register with username empty, error", async ()=> {


    
    const response =  await request(app)
    .post("/api/register")
    .send({username : "", email: "tester@test.com", password : "test"})

    expect(response.status).toBe(400)

  })


  
});

describe("registerAdmin", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test.only("Register, succeed", async ()=> {


    
    const response =  await request(app)
    .post("/api/admin")
    .send({username : "test", email: "tester@test.com", password : "test"})

    expect(response.status).toBe(200)

  })

  test.only("Register with username empty, error", async ()=> {


    
    const response =  await request(app)
    .post("/api/admin")
    .send({username : "", email: "tester@test.com", password : "test"})

    expect(response.status).toBe(400)

  })


})

describe('login', () => { 
  beforeEach(async () => {
    await User.deleteMany({})
  })

    
  test.only("logging, error", async ()=> {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
  },{
    email: "tester@test.com",
    username: "tester",
    role: "Regular",
    password : "tester",
    refreshToken : testerAccessTokenValid
}])
    



    const response =  await request(app)
    .post("/api/login")
    .send({email : "tester@test.com", password : "teser" })

    expect(response.status).toBe(400)

  })
});

describe('logout', () => { 
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test.only("logout, succeed", async ()=> {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
  },{
    email: "tester@test.com",
    username: "tester",
    role: "Regular",
    password : "tester",
    refreshToken : testerAccessTokenValid
}])
    



    const response =  await request(app)
    .get("/api/logout")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    expect(response.status).toBe(200)

  })

  test.only("logout, succeed", async ()=> {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
  }])
    



    const response =  await request(app)
    .get("/api/logout")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    expect(response.status).toBe(400)

  })
});


