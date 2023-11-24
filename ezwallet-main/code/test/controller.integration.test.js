import request from 'supertest';
import { app } from '../app';
import { categories, transactions } from '../models/model';
import { User, Group } from '../models/User.js';
import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import { verifyAuth, handleDateFilterParams } from '../controllers/utils';



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
    //id: existingUser.id, The id field is not required in any check, so it can be omitted
    username: "admin",
    role: "Admin"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

const testerAccessTokenValid = jwt.sign({
    email: "tester@test.com",
    username: "tester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '1y' })

//These tokens can be used in order to test the specific authentication error scenarios inside verifyAuth (no need to have multiple authentication error tests for the same route)
const testerAccessTokenExpired = jwt.sign({
    email: "tester@test.com",
    username: "tester",
    role: "Regular"
}, process.env.ACCESS_KEY, { expiresIn: '0s' })
const testerAccessTokenEmpty = jwt.sign({}, process.env.ACCESS_KEY, { expiresIn: "1y" })



describe("createCategory", () => { 
    test('200 succesful creation of category', async () => {
        await categories.create({ type: "food", color: "red" })
        await User.insertMany([
            {
                username: "tester",
                email: "tester@test.com",
                password: "tester",
                refreshToken: testerAccessTokenValid
            }, {
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }
        ])
        const response = await request(app)
            .post("/api/categories") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({ type: "health", color: "red" })
        
        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("type")
        expect(response.body.data).toHaveProperty("color")
    });

    test('error 400: the type of category passed in the request body represents an already existing category in the database', async () => {
        await categories.create({ type: "food", color: "red" })
        await User.insertMany([
            {
                username: "tester",
                email: "tester@test.com",
                password: "tester",
                refreshToken: testerAccessTokenValid
            }, {
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }
        ])
        const response = await request(app)
            .post("/api/categories") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({ type: "food", color: "red" })
        
        expect(response.status).toBe(400)
      
    });

    test('error 401: called by an authenticated user who is not an admin ', async () => {
        await categories.create({ type: "food", color: "red" })
        await User.insertMany([
            {
                username: "tester",
                email: "tester@test.com",
                password: "tester",
                refreshToken: testerAccessTokenValid
            }, {
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }
        ])
        const response = await request(app)
            .post("/api/categories") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({ type: "health", color: "red" })
        
        expect(response.status).toBe(401)
       
    });



})

describe("updateCategory", () => { 
    
    test("200 succesful: Returns a message for confirmation and the number of updated transactions", async () => {
        await categories.create({ type: "food", color: "red" })
        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .patch("/api/categories/food") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({ type: "health", color: "red" })

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("message")
        expect(response.body.data).toHaveProperty("count", 2)
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("400 error: the type of the new category is the same as one that exists already and that category is not the requested one", (done) => {
        categories.insertMany([{
            type: "food",
            color: "red"
        }, {
            type: "health",
            color: "blue"
        }]).then(() => {
            User.create({
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }).then(() => {
                request(app)
                    .patch("/api/categories/food")
                    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
                    .send({ type: "health", color: "green" }) //The passed type is one that already exists and is not the same one in the route (we are not updating the color of a category but we are trying to change its type to be a duplicate => error scenario)
                    .then((response) => {
                        //The response status must signal a wrong request
                        expect(response.status).toBe(400)
                        //The response body must contain a field named either "error" or "message" (both names are accepted but at least one must be present)
                        const errorMessage = response.body.error ? true : response.body.message ? true : false
                        //The test passes if the response body contains at least one of the two fields
                        expect(errorMessage).toBe(true)
                        done()
                    })
            })
        })
    })

    test("400 error: the request body does not contain all the necessary parameters", (done) => {
        categories.create({
            type: "food",
            color: "red"
        }).then(() => {
            User.create({
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }).then(() => {
                request(app)
                    .patch("/api/categories/food")
                    .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`)
                    //The ".send()" block is missing, meaning that the request body will be empty
                    //Appending ".send({}) leads to the same scenario, so both options are equivalent"
                    .then((response) => {
                        expect(response.status).toBe(400)
                        const errorMessage = response.body.error ? true : response.body.message ? true : false
                        expect(errorMessage).toBe(true)
                        done()
                    })
            })
        })
    })

    test("401 error: called by a user who is not an Admin", (done) => {
        categories.create({
            type: "food",
            color: "red"
        }).then(() => {
            User.insertMany([{
                username: "tester",
                email: "tester@test.com",
                password: "tester",
                refreshToken: testerAccessTokenValid
            }, {
                username: "admin",
                email: "admin@email.com",
                password: "admin",
                refreshToken: adminAccessTokenValid,
                role: "Admin"
            }]).then(() => {
                request(app)
                    .patch("/api/categories/food")
                    //The cookies we set are those of a regular user, which will cause the verifyAuth check to fail
                    //Other combinations that can cause the authentication check to fail are also accepted:
                    //      - mismatched tokens: .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
                    //      - empty tokens: .set("Cookie", `accessToken=${testerAccessTokenEmpty}; refreshToken=${testerAccessTokenEmpty}`)
                    //      - expired tokens: .set("Cookie", `accessToken=${testerAccessTokenExpired}; refreshToken=${testerAccessTokenExpired}`)
                    //      - missing tokens: .set("Cookie", `accessToken=${}; refreshToken=${}`) (not calling ".set()" at all also works)
                    //Testing just one authentication failure case is enough, there is NO NEED to check all possible token combination for each function
                    .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`)
                    .send({ type: "food", color: "green" })
                    .then((response) => {
                        expect(response.status).toBe(401)
                        const errorMessage = response.body.error ? true : response.body.message ? true : false
                        expect(errorMessage).toBe(true)
                        done()
                    })
            })
        })
    })

})

describe("deleteCategory", () => { 
    test("200 Successful deletion, attribute message and count", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/categories") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({ types: ["food", "health"]  })

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("message")
        expect(response.body.data).toHaveProperty("count", 0)
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error called by an authenticated user who is not an admin", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/categories") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({ types: ["food", "health"]  })

        expect(response.status).toBe(401)
        
         
    })

})

describe("getCategories", () => { 
    test("200 user authenticated, succesful get categories ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/categories") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
             

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")

        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: user not authenticated ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/categories") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenExpired}; refreshToken=${testerAccessTokenExpired}`) //Setting cookies in the request
             

        expect(response.status).toBe(401)
       

        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("createTransaction", () => { 
    test("200 Successful: User authenticated, correct request", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .post("/api/users/tester/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({username: "tester", type: "food", amount: 300})
             

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("username")
        expect(response.body.data).toHaveProperty("type")
        expect(response.body.data).toHaveProperty("amount")
        expect(response.body.data).toHaveProperty("date")
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    

    test("401 error: called by an authenticated user who is not the same user as the one in the route parameter", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .post("/api/users/mario/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({username: "tester", type: "food", amount: 300})
             

        expect(response.status).toBe(401)
        
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("getAllTransactions", () => { 
    test('200 succesful operation, admin authenticated', async () => {
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({username: "tester", type: "food", amount: 300})
             

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("data")
        
       
    });
    test('401 called by an authenticated user who is not an admin', async () => {
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({username: "tester", type: "food", amount: 300})
             

        expect(response.status).toBe(401)
         
    });
})

describe("getTransactionsByUser", () => { 
    test("200 Successful: User route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/users/tester/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("200 Successful: Admin route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/users/tester") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: Admin route, called by an authenticated user who is not an admin ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/users/tester") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: User route, authenticated user who is not the same user as the one in the route", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/users/Mario/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("getTransactionsByUserByCategory", () => { 
    test("200 Successful: User route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/users/tester/transactions/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("200 Successful: Admin route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/users/tester/category/food") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: Admin route, called by an authenticated user who is not an admin  ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/users/tester/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: User route, authenticated user who is not the same user as the one in the route", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/users/mario/transactions/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

})

describe("getTransactionsByGroup", () => { 
    test("200 Successful: User route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
       
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/groups/Family/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("200 Successful: Admin route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/groups/Family") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: user route called by an authenticated user who is not part of the group ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        },{
            username: "b1",
            email: "b1@test.com",
            password: "123",
            refreshToken: testerAccessTokenValid
        }
    ])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'b1@test.com'},
                {email: 'admin@email.com'}
            ]
        })
       
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/groups/Family/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: admin route called by an authenticated user who is not an admin ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/groups/Family") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("getTransactionsByGroupByCategory", () => { 
    test("200 Successful: User route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
       
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/groups/Family/transactions/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("200 Successful: Admin route, return array of obj ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/groups/Family/category/food") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(200)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: user route called by an authenticated user who is not part of the group ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        },{
            username: "b1",
            email: "b1@test.com",
            password: "123",
            refreshToken: testerAccessTokenValid
        }
    ])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'b1@test.com'},
                {email: 'admin@email.com'}
            ]
        })
       
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/groups/Family/transactions/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: admin route called by an authenticated user who is not an admin ", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "tester",
            type: "food",
            amount: 100
        }])
        await Group.create({
            name: "Family",
            members: [
                {email: 'tester@test.com'},
                {email: 'admin@email.com'}
            ]
        })
        //The API request must be awaited as well
        const response = await request(app)
            .get("/api/transactions/groups/Family/category/food") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
                          

        expect(response.status).toBe(401)
     
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("deleteTransaction", () => { 
    test("200 Successful: User authenticated, correct request", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
       
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "admin",
            type: "food",
            amount: 100
        }])
        const trans_tbd= await transactions.findOne({username: "tester"})

        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/users/tester/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({_id: trans_tbd._id})
             

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("message")
         
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: called by an authenticated user who is not the same user as the one in the route parameter", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "admin",
            type: "food",
            amount: 100
        }])
        const trans_tbd= await transactions.findOne({username: "tester"})

        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/users/mario/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({_id : trans_tbd._id})
             

        expect(response.status).toBe(401)
        
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})

describe("deleteTransactions", () => { 
    test("200 Successful: Admin authenticated, correct request", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
       
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "admin",
            type: "food",
            amount: 100
        }])
        const trans_tbd= await transactions.findOne({username: "tester"})

        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/transactions") //Route to call
            .set("Cookie", `accessToken=${adminAccessTokenValid}; refreshToken=${adminAccessTokenValid}`) //Setting cookies in the request
            .send({_ids: [trans_tbd._id]})
             

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveProperty("message")
         
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })

    test("401 error: called by an authenticated user who is not an admin", async () => {
        
        await categories.insertMany([
            { type: "food", color: "red" },
            { type: "health", color: "red" }, 
           ])

        await User.insertMany([{
            username: "tester",
            email: "tester@test.com",
            password: "tester",
            refreshToken: testerAccessTokenValid
        }, {
            username: "admin",
            email: "admin@email.com",
            password: "admin",
            refreshToken: adminAccessTokenValid,
            role: "Admin"
        }])
        await transactions.insertMany([{
            username: "tester",
            type: "food",
            amount: 20
        }, {
            username: "admin",
            type: "food",
            amount: 100
        }])
        const trans_tbd= await transactions.findOne({username: "tester"})

        //The API request must be awaited as well
        const response = await request(app)
            .delete("/api/transactions") //Route to call
            .set("Cookie", `accessToken=${testerAccessTokenValid}; refreshToken=${testerAccessTokenValid}`) //Setting cookies in the request
            .send({_ids : [trans_tbd._id]})
             

        expect(response.status).toBe(401)
        
        //there is no "done" in this case to signal that the test has ended, as it ends automatically since it's not inside a "then" block
    })
})
