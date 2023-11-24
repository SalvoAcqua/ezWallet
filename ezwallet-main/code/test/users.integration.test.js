import request from 'supertest';
import { app } from '../app';
import { User, Group } from '../models/User.js';
import { transactions, categories } from '../models/model';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


/**
 * Necessary setup in order to create a new database for testing purposes before starting the execution of test cases.
 * Each test suite has its own database in order to avoid different tests accessing the same database at the same time and expecting different data.
 */
dotenv.config();
beforeAll(async () => {
  const dbName = "testingDatabaseUsers";
  const url = `${process.env.MONGO_URI}/${dbName}`;

  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

});

beforeEach(async () => {
  await categories.deleteMany({})
  await transactions.deleteMany({})
  await User.deleteMany({})
  await Group.deleteMany({})
})

/**
 * After all test cases have been executed the database is deleted.
 * This is done so that subsequent executions of the test suite start with an empty database.
 */
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

const tester2AccessTokenValid = jwt.sign({
  email: "tester2@test.com",
  username: "tester2",
  role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

describe("getUsers", () => {
  /**
   * Database is cleared before each test case, in order to allow insertion of data tailored for each specific test case.
   */
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test("Admin: should retrieve list of all users", async ()=> {

    await User.insertMany([{
      username: "admin",
      email: "admin@email.com",
      password: "admin",
      refreshToken: adminAccessTokenValid,
      role: "Admin"
  }])
    
    const response = await request(app)
        .get("/api/users")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)    
    expect(response.body.data).toHaveLength(1)

  })

  test("User: should retrieve list of all users", async ()=> {

    await User.insertMany([{
      email: "tester@test.com",
      username: "tester",
      role: "Regular",
      password : "tester",
      refreshToken : testerAccessTokenValid
  }])
    
    const response = await request(app)
        .get("/api/users")
        .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)    

  })

})

describe("getUser", () => { 

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test("Admin access to other user, retrieve data ", async ()=> {

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
    
    const response = await request(app)
        .get("/api/users/tester")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)    
    expect(response.body.data).toHaveProperty("email", "tester@test.com")

  })

  test("User access to him, retrieve data ", async ()=> {

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
    
    const response = await request(app)
        .get("/api/users/tester")
        .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(200)    
    expect(response.body.data).toHaveProperty("email", "tester@test.com")

  })

  test("User access to other user, error ", async ()=> {

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
    
    const response = await request(app)
        .get("/api/users/admin")
        .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(401)    

  })

  test("Admin access to unknown, error ", async ()=> {

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
    
    const response = await request(app)
        .get("/api/users/test")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request

    expect(response.status).toBe(400)    

  })

})

describe("createGroup", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test("Admin create a group whitout him, succeed", async ()=> {

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
    
    const response = await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com"] })
    expect(response.status).toBe(200)    
    expect(response.body.data).toHaveProperty("group", {name : 'group1', members :[{email : "tester@test.com"},{email : "admin@email.com"}]})
    

  })

  test("Admin create a group alone, error", async ()=> {

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
    
    const response = await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : [] })
    expect(response.status).toBe(400)    
    

  })

  test("Admin create two groups , error", async ()=> {

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
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com","admin@email.com"] })

        const response = await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group2", memberEmails : ["tester@test.com"] })
      
    expect(response.status).toBe(400)    
  
  })

  test("Admin create a group whitout name, error", async ()=> {

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
    
    const response = await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({memberEmails : ["tester@test.com"] })
    expect(response.status).toBe(400)    
    

  })

  test("Admin not authenticated, error", async ()=> {

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
    
    const response = await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${"AA"}; refreshToken=${"AA"}`) //Setting cookies in the request
        .send({memberEmails : ["tester@test.com"] })
    expect(response.status).toBe(401)    
    

  })

})

describe("getGroups", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
  })
  test("Admin : list of group", async ()=> {

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
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com"] })

    const response =  await request(app)
    .get("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(200) 
    expect(response.body.data).toHaveLength(1)
  })

  test("Admin : list of group empty", async ()=> {

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
    .get("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(200) 
    expect(response.body.data).toHaveLength(0)
  })

  test("User : error", async ()=> {

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
    await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : [] })


    const response =  await request(app)
    .get("/api/groups")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(401) 
  })
})

describe("getGroup", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("Admin acces to a group : retrieve data ", async ()=> {

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
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com"] })

    const response =  await request(app)
    .get("/api/groups/group1")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(200) 
    expect(response.body.data.group.name).toBe("group1")
  })

  test("Admin acces to a group unknown : erro", async ()=> {

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
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com"] })

    const response =  await request(app)
    .get("/api/groups/group2")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(400) 
  })
  
  test("user acces to his group : retrieve data ", async ()=> {

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
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester@test.com"] })

    const response =  await request(app)
    .get("/api/groups/group1")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(200) 
    expect(response.body.data.group.name).toBe("group1")
  })

  test("user acces to an other group : error ", async ()=> {

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
},{
  email: "tester2@test.com",
  username: "tester2",
  role: "Regular",
  password : "tester",
  refreshToken : tester2AccessTokenValid
}])
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester2@test.com"] })

    const response =  await request(app)
    .get("/api/groups/group1")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
      
    expect(response.status).toBe(401) 
  })
  

})

describe("addToGroup", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
  })

  test("Admin add a userEmail in his group, retrieve the data", async ()=> {

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
},{
  email: "tester2@test.com",
  username: "tester2",
  role: "Regular",
  password : "tester",
  refreshToken : tester2AccessTokenValid
}])
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester2@test.com"] })

    const response =  await request(app)
    .patch("/api/groups/group1/insert")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["tester@test.com"]})

    expect(response.status).toBe(200)
    expect(response.body.data.group.members).toHaveLength(3) 
  })

  test("Admin add a userEmail already present in his group, error", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["tester@test.com"] })
    const response =  await request(app)
    .patch("/api/groups/group1/insert")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["tester@test.com"]})

    expect(response.status).toBe(400)
  })

  test("Admin add a userEmail unknown in his group, error", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["tester@test.com"] })
    const response =  await request(app)
    .patch("/api/groups/group1/insert")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["unknown@test.com"]})

    expect(response.status).toBe(400)
  })

  test("User add a userEmail already present in his group, error", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["tester@test.com"] })
    const response =  await request(app)
    .patch("/api/groups/group1/add")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["tester@test.com"]})

    expect(response.status).toBe(400)
  })

  test("User add a userEmail in his group, succeed", async ()=> {

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
},{
  email: "tester2@test.com",
  username: "tester2",
  role: "Regular",
  password : "tester",
  refreshToken : tester2AccessTokenValid
}])
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester2@test.com"] })
    const response =  await request(app)
    .patch("/api/groups/group1/add")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["admin@email.com"]})

    expect(response.status).toBe(200)
    expect(response.body.data.group.members).toHaveLength(3) 

  })

})

describe("removeFromGroup", () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
    await transactions.deleteMany({})
  })

  test("Admin delete a userEmail in his group, succeed", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["tester@test.com"] })

    const response =  await request(app)
    .patch("/api/groups/group1/pull")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["tester@test.com"]})

    expect(response.status).toBe(200)
    expect(response.body.data.group.members).toHaveLength(1) 
  })

  test("User delete a userEmail in his group, succeed", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["admin@email.com"] })

    const response =  await request(app)
    .patch("/api/groups/group1/remove")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["admin@email.com"]})

    expect(response.status).toBe(200)
    expect(response.body.data.group.members).toHaveLength(1) 
  })

  test("User delete a userEmail unknown, error", async ()=> {

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
    
    const test = await request(app)
    .post("/api/groups")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1", memberEmails : ["admin@email.com"] })

    const response =  await request(app)
    .patch("/api/groups/group1/remove")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["aaaa@email.com"]})

    expect(response.status).toBe(400)
  })

  test("User delete a userEmail not in his group, error", async ()=> {

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
},{
  email: "tester2@test.com",
  username: "tester2",
  role: "Regular",
  password : "tester",
  refreshToken : tester2AccessTokenValid
}])
    
    await request(app)
        .post("/api/groups")
        .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
        .send({name : "group1", memberEmails : ["tester2@test.com"] })

    const response =  await request(app)
    .patch("/api/groups/group1/remove")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({emails : ["admin@email.com"]})

    expect(response.status).toBe(401)
  })

  

}) 

describe("deleteUser", () => { 
  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
    await transactions.deleteMany({})
  })

  
  test("Admin delete a user not in a group, without transactions, succeed", async ()=> {

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
    .delete("/api/users")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({email : "tester@test.com"})

    expect(response.status).toBe(200)
    expect(response.body.data.deletedFromGroup).toBe(false) 
    expect(response.body.data.deletedTransactions).toBe(0) 
  })

  test("Admin delete a user in a group, without transactions, succeed", async ()=> {

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
    

const test = await request(app)
.post("/api/groups")
.set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
.send({name : "group1", memberEmails : ["tester@test.com"] })


    const response =  await request(app)
    .delete("/api/users")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({email : "tester@test.com"})

    expect(response.status).toBe(200)
    expect(response.body.data.deletedFromGroup).toBe(true) 
    expect(response.body.data.deletedTransactions).toBe(0) 
  })
  
  test("Admin delete a user not in a group, transactions, succeed", async ()=> {

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

    await categories.create({ type: "food", color: "red" })
    await transactions.insertMany([{
      username: "tester",
      type: "food",
      amount: 20
    }, {
      username: "tester",
      type: "food",
      amount: 100
    }])

    const response =  await request(app)
    .delete("/api/users")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({email : "tester@test.com"})

    expect(response.status).toBe(200)
    expect(response.body.data.deletedFromGroup).toBe(false) 
    expect(response.body.data.deletedTransactions).toBe(2) 
  })

  test("User delete a admin not in a group, without transactions, error", async ()=> {

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
    .delete("/api/users")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({email : "tester@test.com"})

    expect(response.status).toBe(401)
 
  })

  test("Admin delete a user unknown, error", async ()=> {

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
    .delete("/api/users")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({email : "tr@test.com"})

    expect(response.status).toBe(400)

  })

})

describe("deleteGroup", () => { 

  beforeEach(async () => {
    await User.deleteMany({})
    await Group.deleteMany({})
    await transactions.deleteMany({})
  })

  test("Admin delete a  group, succeed", async ()=> {

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
    

const test = await request(app)
.post("/api/groups")
.set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
.send({name : "group1", memberEmails : ["tester@test.com"] })


    const response =  await request(app)
    .delete("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1"})

    expect(response.status).toBe(200)

  })

  test("Admin delete a  group unknows, succeed", async ()=> {

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
    

const test = await request(app)
.post("/api/groups")
.set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
.send({name : "group1", memberEmails : ["tester@test.com"] })


    const response =  await request(app)
    .delete("/api/groups")
    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group"})

    expect(response.status).toBe(400)

  })

  test("User delete a  group, error", async ()=> {

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
    

const test = await request(app)
.post("/api/groups")
.set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
.send({name : "group1", memberEmails : ["tester@test.com"] })


    const response =  await request(app)
    .delete("/api/groups")
    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
    .send({name : "group1"})

    expect(response.status).toBe(401)

  })

})
