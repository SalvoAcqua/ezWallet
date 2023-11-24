import request from 'supertest';
import { app } from '../app';
import {getCategories, createCategory, updateCategory , deleteCategory, createTransaction, getAllTransactions,
        getTransactionsByUser, getTransactionsByUserByCategory, getTransactionsByGroup, getTransactionsByGroupByCategory,
        deleteTransaction, deleteTransactions}  from '../controllers/controller.js';
import { categories, transactions } from '../models/model';
import { Group, User } from "../models/User";
import { handleDateFilterParams, handleAmountFilterParams, verifyAuth } from "../controllers/utils";


jest.mock('../models/model');
jest.mock('../models/User');
jest.mock('../controllers/utils')



beforeEach(() => {
    //jest.clearAllMocks()
    jest.restoreAllMocks()
})

jest.mock('../controllers/utils.js', () => ({
    verifyAuth: jest.fn(),
    handleAmountFilterParams: jest.fn(),
    handleDateFilterParams: jest.fn()
}))


describe("createCategory", () => { 

    test.only('200 Succesful creation of category', async () => {
        const mockReq = {
            
            body: {
                type: "shopping",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        const categoriesMock = {
            type: "shopping",
            color: "Red"
        };


        categories.prototype.save = jest.fn().mockResolvedValueOnce(categoriesMock)
        await createCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                type: "shopping",
                color: "Red"
                },
            refreshedTokenMessage: "111"}
            )

    })

    test.only('400 error: request body does not contain all the necessary attributes', async () => {
        const mockReq = {
            
            body: {
               
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
      
        await createCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)


    })

    test.only('400 error: at least one of the parameters in the request body is an empty string', async () => {
        const mockReq = {
            
            body: {
                type: "",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
       
        await createCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)


    })
    test.only('400 error: the type of category passed in the request body represents an already existing category in the database', async () => {
        const mockReq = {
            
            body: {
                type: "shopping",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
      
        const categoriesMock = {
            type: "shopping",
            color: "Red"
        };
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(categoriesMock)

        await createCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)


    })

    test.only('401 error: called by an authenticated user who is not an admin', async () => {
        const mockReq = {
            
            body: {
                type: "shopping",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
      

        await createCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)


    })


     
})

describe("updateCategory", () => { 

    test.only("Successful: Admin authenticated, correct request, returns a message for confirmation and the number of updated transactions", async () => {
        const mockReq = {
            params: { type: "food" },
            body: {
                type: "shopping",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/food" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
            type: "food",
            color: "red"
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        //old category req.params
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)
    
        //new category should not already exist
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        const updatedMockCategory = {
            modifiedCount: 1
        }

        jest.spyOn(categories, "updateOne").mockResolvedValueOnce(updatedMockCategory)
        
        const updatedMockTransactions = {
            modifiedCount: 2
        }
      
        jest.spyOn(transactions, "updateMany").mockResolvedValueOnce(updatedMockTransactions)

        
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
      
    })

    test.only("Returns a 401 error if called by a user who is not an Admin", async () => {
        const mockReq = {
            params: { type: "food" },
            body: {
                type: "food",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/food" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
            type: "food",
            color: "red"
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Not authorized" })

        
        
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
      
    })
 

    test.only("Error: Admin authenticated, but request body does not contain all the necessary attributes", async () => {
        const mockReq = {
            params: { type: "food" },
            body: {
                
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/food" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
           
            color: "red"
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

       
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test.only("Error: Admin authenticated, but at least one of the parameters in the request body is an empty string", async () => {
        const mockReq = {
            params: { type: "food" },
            body: {
                type:"",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/food" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
            type: "",
            color: ""
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test.only("Error: Admin authenticated,but the type of category passed as a route parameter does not represent a category in the database", async () => {
        const mockReq = {
            params: { type: "test" },
            body: {
                type:"food",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/null" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
            type: "",
            color: ""
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        //old category req.params doesnt exist
     
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)
       
        //new category should not already exist
       
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        const updatedMockCategory = {
            modifiedCount: 1
        }

        jest.spyOn(categories, "updateOne").mockResolvedValueOnce(0)
        
        const updatedMockTransactions = {
            modifiedCount: 2
        }
      
        jest.spyOn(transactions, "updateMany").mockResolvedValueOnce(0)

        
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test.only("Error: Admin authenticated, but the type of category passed in the request body as the new type represents an already existing category in the database", async () => {
        const mockReq = {
            params: { type: "food" },
            body: {
                type: "shopping",
                color: "red"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/categories/food" //for functions that have different behavior depending on the route, this parameter must also be present
            //it is not required if the function does not allow different urls
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                //The name can also be message, what matters is consistency with the one used in the code
                refreshedTokenMessage: "111"
            }
        }

        //passed with req params
        const mockCategory = {
            type: "shopping",
            color: "red"
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        //old category req.params
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)
    
        //new category already exist
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({ type: "charity",  color: "red"  })
        
        await updateCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
      
    })
   
})

describe.only("deleteCategory", () => {
    test('400 error if the request body does not contain all the necessary attributes', async () => {

        const mockReq = {
            params: {type: 'test1'},
            body : {},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        

        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test('401 error called by an authenticated user who is not an admin', async () => {

        const mockReq = {
            params: {type: 'test1'},
            body : {},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Not authorized" })
       
        

        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(401)
    });

    test('400 error if the request body does not contain an array', async () => {

        const mockReq = {
            params: {type: 'test1'},
            body : {types: ""},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
       
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });
    test('400 error if the request body does  contain an empty array', async () => {

        const mockReq = {
            params: {type: 'test1'},
            body : {types: []},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
     
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test('Admin authenticated, 400 error there is only one category in the database', async () => {

        const mockReq = {
            body: {types: ["health","food"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const mockCategory2 ={
            type: "food",
            color: "red"
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(1)

      

        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });
    test('Admin authenticated, 400 error there are 0 categories in the database', async () => {

        const mockReq = {
            body: {types: ["health","food"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const mockCategory2 ={
            type: "food",
            color: "red"
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(0)

      

        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test('400 error, one of the types in the array is an empty string', async () => {

        const mockReq = {
            body: {types: ["","food"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const mockCategory2 ={
            type: "food",
            color: "red"
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(3)

        
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test('400 error at least one of the types in the array does not represent a category in the database', async () => {

        const mockReq = {
            body: {types: ["health","food"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const mockCategory2 ={
            type: "food",
            color: "red"
        }

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(3)

        jest.spyOn(categories, "findOne").mockResolvedValueOnce(false)
        
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(400)
    });

    test('200 Successful deletion, attribute message and count N>T', async () => {

        const mockReq = {
            body: {types: ["health"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const firstCategory ={
            type: "food",
            color: "blue"
        }
             
        
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(3)

        jest.spyOn(categories, "findOne").mockResolvedValueOnce(mockCategory)
        
        jest.spyOn(categories, "deleteMany").mockResolvedValueOnce(true)
       
        const findMock = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnValue([firstCategory])
        });
                
        jest.spyOn(categories, 'find').mockImplementation(findMock);

        
        jest.spyOn(categories, "deleteMany").mockResolvedValueOnce(true)

        const updateManyMock = jest.fn().mockResolvedValue({modifiedCount: 1});
        jest.spyOn(transactions, 'updateMany').mockImplementation(updateManyMock);
        
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(200)

    });

    test('200 Successful deletion, attribute message and count N=T', async () => {

        const mockReq = {
            body: {types: ["health","food"]},
            cookie: {accessToken: '111', refreshToken: '555'},
        }
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        const mockCategory ={
            type: "health",
            color: "red"
        }
        const firstCategory ={
            type: "food",
            color: "blue"
        }
             
        
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
       
        jest.spyOn(categories, "countDocuments").mockResolvedValueOnce(2)

        jest.spyOn(categories, "findOne").mockResolvedValue(mockCategory)
        
        
       
        const findMock = jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnValue([firstCategory])
        });
                
        jest.spyOn(categories, 'find').mockImplementation(findMock);

        //jest.spyOn(categories, "deleteMany").mockResolvedValueOnce(true)

        jest.spyOn(categories, "deleteMany").mockResolvedValueOnce(true)

        const updateManyMock = jest.fn().mockResolvedValue({modifiedCount: 1});
        jest.spyOn(transactions, 'updateMany').mockImplementation(updateManyMock);
        
        await deleteCategory(mockReq,mockRes)
        
        expect(mockRes.status).toHaveBeenCalledWith(200)

    });











})

describe("getCategories", () => { 

    test.only("user get category, no category yet, retrieve data ", async () => {
        
        const mockReq = {
            cookies: {accessToken: '111'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: {refreshedTokenMessage :"zz"}
        }
        verifyAuth.mockReturnValueOnce({flag: true})

        const retrievedCategories = []
        jest.spyOn(categories, "find").mockResolvedValueOnce(retrievedCategories)
    
        await getCategories(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({data : retrievedCategories, refreshedTokenMessage: "zz" })
      })

      test.only("user get category, many categories, retrieve data ", async () => {
   
        const mockReq = {
            cookies: {accessToken: '111', refreshToken: '555'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: {refreshedTokenMessage :"zz"}
        }
        verifyAuth.mockReturnValueOnce({flag: true})

        const retrievedCategories = [{type: 'card', color: 'green'},{type : 'journey', color : 'blue'}]
        jest.spyOn(categories, "find").mockResolvedValue(retrievedCategories)
        
        await getCategories(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({data : retrievedCategories, refreshedTokenMessage: "zz" })
      })

      test.only("Error authentification ", async () => {
   
        const mockReq = {
            cookies: {accessToken: '111', refreshToken: '555'}
        }
        const mockRes = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          locals: {refreshedTokenMessage :"zz"}
        }
        verifyAuth.mockReturnValueOnce({flag: false})

        
        await getCategories(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
      })
    
})

describe("createTransaction", () => { 
    test.only("200 Successful: User authenticated, correct request", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        

        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        

         
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food", date: "2023-05-19T10:00:00"  })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                username: "Mario",
                type: "food",
                amount: 100,
                date: "2023-05-19T10:00:00"
                },
            refreshedTokenMessage: "111"}
            )
      
    })
    test.only("400 error: the request body does not contain all the necessary attributes", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
              
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
               
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
              
    })


    test.only("400 error: at least one of the parameters in the request body is an empty string", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type:"",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
               
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
              
    })

    test.only("400 error: the type of category passed in the request body does not represent a category in the database", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
      
    })

    test.only("400 error: the username passed in the request body is not equal to the one passed as a route parameter", async () => {
        const mockReq = {
            params: { username: "John" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/John/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food" })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
      
    })

    test.only("400 error:  the username passed in the request body does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(null)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food" })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
    })

    test.only("400 error: the username passed as a route parameter does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(null)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food" })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
    })

    test.only("400 error: the amount passed in the request body cannot be parsed as a floating value", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: "f"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food" })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
    })

    test.only("401 error: called by an authenticated user who is not the same user as the one in the route parameter", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUser)
        jest.spyOn(categories, "findOne").mockResolvedValueOnce({type:"food",color:"red"})

        
        transactions.prototype.save = jest.fn().mockResolvedValueOnce({username : "Mario", amount:100, type: "food" })
        
        await createTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
       
    })

})

describe("getAllTransactions", () => { 
    test.only('200 succesful operation, admin authenticated', async () => {

        const mockReq = {
            
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
             
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'John', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Jane', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;

        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        await getAllTransactions(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'John', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Jane', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
            refreshedTokenMessage: "111"}
            )
    });

    test.only('401 called by an authenticated user who is not an admin', async () => {

        const mockReq = {
            
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }

      

        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })

        await getAllTransactions(mockReq, mockRes)

        expect(mockRes.status).toHaveBeenCalledWith(401)
    });
})

describe("getTransactionsByUser", () => { 
    test.only("200 Successful: User route, return array of obj", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        handleAmountFilterParams.mockReturnValueOnce({amount : {$lte: 5000}})
        handleDateFilterParams.mockReturnValueOnce({date: {$lte: "2033-04-21T23:59:59.999Z"}})
               
        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByUser(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
      
    })

    test.only("200 Successful: Admin route, return array of obj", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        handleAmountFilterParams.mockReturnValueOnce({amount : {$lte: 5000}})
        handleDateFilterParams.mockReturnValueOnce({date: {$lte: "2033-04-21T23:59:59.999Z"}})
               
        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByUser(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
      
    })


    test.only("400 error: the username passed as a route parameter does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(null)
        
        
        await getTransactionsByUser(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
    
    })

    test.only("401 error: Admin route, called by an authenticated user who is not an admin", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
       
        
        
        await getTransactionsByUser(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
    
    })

    test.only("401 error: User route, authenticated user who is not the same user as the one in the route", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
       
        
        
        await getTransactionsByUser(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
    
    })


})

describe("getTransactionsByUserByCategory", () => { 
    test.only("200 Successful: User route, return array of obj", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(retrievedCategory)

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'food', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'food', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'food',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'food', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
      
    })

    test.only("200 Successful: Admin route, return array of obj", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(retrievedCategory)

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'food', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'food', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'food',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'food', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
      
    })

    test.only("400 error: the username passed as a user route parameter does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(retrievedCategory)

        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
               
    
    })
    test.only("400 error: the username passed as a user route parameter does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(retrievedCategory)

        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
               
    
    })

    test.only("400 error: the category passed as a route parameter does not represent a category in the database", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
               
    })
    test.only("400 error: the category passed as a route parameter does not represent a category in the database", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedCategory ={ type: "food", color:"red" }
        jest.spyOn(categories, "findOne").mockResolvedValueOnce(null)

        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
               
    })

    test.only("401 error: called by an authenticated user who is not the same user as the one in the user route", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
       
        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
               
    })
    test.only("401 error: called by an authenticated user who is not an admin in an admin route", async () => {
        const mockReq = {
            params: { username: "Mario",
                    category: "food" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/users/Mario/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
       
        
        await getTransactionsByUserByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
               
    })


    

})

describe("getTransactionsByGroup", () => { 
    test.only("200 Successful: User route, return array of obj", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
    })

    test.only("200 Successful: Admin route, return array of obj", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
    })

    test.only("400 errror: group name passed as a route parameter does not represent a group in the database", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
        
    })
    test.only("400 errror: group name passed as a route parameter does not represent a group in the database", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
        
    })
    test.only("401 error: user route called by an authenticated user who is not part of the group", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "NON Authorized" })

    
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
                
    })
    test.only("401 error: admin route called by an authenticated user who is not an admin", async () => {
        const mockReq = {
            params: { name: "Family" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "NON Authorized" })

    
        
        await getTransactionsByGroup(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
                
    })
})

describe("getTransactionsByGroupByCategory", () => { 
    test.only("200 Successful: User route, return array of obj", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
    })

    test.only("200 Successful: Admin route, return array of obj", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
         
            data: [
                { username: 'Mario', amount: 100, type: 'Category A',  color: 'Red' , date: '2023-05-19T10:00:00' },
                { username: 'Mario', amount: 200, type: 'Category B', color: 'Blue' , date: '2023-05-19T10:00:00' }
            ],
             refreshedTokenMessage: "111"}
        )
        
    })

    test.only("400 errror: group name passed as a route parameter does not represent a group in the database", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
        
    })

    test.only("400 errror: group name passed as a route parameter does not represent a group in the database", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(null)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
        
    })

    test.only("400 errror: category passed as a route parameter does not represent a category in the database", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(null)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
        
    })
    test.only("400 errror: category passed as a route parameter does not represent a category in the database", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(null)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        const aggregateMock = jest.fn().mockResolvedValue([
            { _id: 1, username: 'Mario', amount: 100, type: 'Category A', categories_info: { color: 'Red' }, date: '2023-05-19T10:00:00' },
            { _id: 2, username: 'Mario', amount: 200, type: 'Category B', categories_info: { color: 'Blue' }, date: '2023-05-19T10:00:00' }
          ]);
          transactions.aggregate = aggregateMock;
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
        
    })

    test.only("401 error: user route called by an authenticated user who is not part of the group", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/groups/Family/transactions/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "non Authorized" })

        
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
       
        
    })

    test.only("401 error: admin route called by an authenticated user who is not an admin", async () => {
        const mockReq = {
            params: { name: "Family" , 
                    category: "Category A" },
            body: {
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/transactions/groups/Family/category/food" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
          
        const retrievedGroup = {name : 'Family', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "666"}]}
        
        Group.findOne = jest.fn().mockResolvedValueOnce(retrievedGroup)
        
        const mockCategory = {
            type: "Category A",
            color: "red"
        }
        categories.findOne = jest.fn().mockResolvedValueOnce(mockCategory)

        const user1= { username: '333', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValue(user1)
       
         
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "non Authorized" })

        
        
        await getTransactionsByGroupByCategory(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
       
        
    })

})

describe.only("deleteTransaction", () => { 
    test.only("200 Successful: User authenticated, correct request, response data correct", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                _id: "6hjkohgfc8nvu786"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedTrans = {
            username: "Mario",
            type: "food",
            amount: 100
            }
        jest.spyOn(transactions, "findById").mockResolvedValueOnce(retrievedTrans)
        
        jest.spyOn(transactions, "deleteOne").mockResolvedValueOnce(true)
        
        await deleteTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                message:"Transaction deleted"
                },
            refreshedTokenMessage: "111"}
            )
      
    })

    test.only("400 error: User authenticated, _id is empty string", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                _id: ""
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedTrans = {
            username: "Mario",
            type: "food",
            amount: 100
            }
        jest.spyOn(transactions, "findById").mockResolvedValueOnce(retrievedTrans)
        
        jest.spyOn(transactions, "deleteOne").mockResolvedValueOnce(true)
        
        await deleteTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
         
    })

    test.only("400 error: User authenticated, the request body does not contain all the necessary attributes", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
      
        
        await deleteTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
      
    })

    test.only("400 error: User authenticated, the `_id` in the request body does not represent a transaction in the databas", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                _id: "6hjkohgfc8nvu786"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(retrievedUser)
        
        const retrievedTrans = {
            username: "Mario",
            type: "food",
            amount: 100
            }
        jest.spyOn(transactions, "findById").mockResolvedValueOnce(null)
        
        jest.spyOn(transactions, "deleteOne").mockResolvedValueOnce(true)
        
        await deleteTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
      
    })
    test.only("400 error: the username passed as a route parameter does not represent a user in the database", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                _id: "6hjkohgfc8nvu786"
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })
        
        const retrievedUser = { username: 'Mario', email: 'test1@example.com', role: 'User' }
        User.findOne = jest.fn().mockResolvedValueOnce(null)
        
        await deleteTransaction(mockReq,mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
        
      
    })
    test.only("401 error: called by an authenticated user who is not the same user as the one in the route parameter", async () => {
        const mockReq = {
            params: { username: "Mario" },
            body: {
                username: "Mario",
                type: "food",
                amount: 100
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })
        
       
        await deleteTransaction(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
       
    })
})

describe("deleteTransactions", () => { 
    test.only("200 Successful: Admin authenticated, correct request, response data correct", async () => {
        const mockReq = {
           
            body: {
                _ids: ["6hjkohgfc8nvu786", "3hjkohgfc8nvu786"]
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        const retrievedTrans = {
            username: "Mario",
            type: "food",
            amount: 100
            }
        
        transactions.findOne = jest.fn().mockResolvedValue(retrievedTrans)
            
        
        jest.spyOn(transactions, "deleteMany").mockResolvedValueOnce(true)
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(200)
        expect(mockRes.json).toHaveBeenCalledWith({
            data: {
                message:"Transactions deleted"
                },
            refreshedTokenMessage: "111"}
            )
      
    })

    test.only("400 error: request body does not contain all the necessary attributes", async () => {
        const mockReq = {
           
            body: {
               
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
      
    })

    test.only("400 error: at least one of the ids in the array is an empty string", async () => {
        const mockReq = {
           
            body: {
                _ids: ["6hjkohgfc8nvu786", ""]
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
      
    })

     

    test.only("400 error: req body ids in the array is not an array", async () => {
        const mockReq = {
           
            body: {
                _ids: "6hjkohgfc8nvu786" 
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
       
      
    })

    test.only("400 error: at least one of the ids in the array does not represent a transaction in the database", async () => {
        const mockReq = {
           
            body: {
                _ids: ["6hjkohgfc8nvu786", "3hjkohgfc8nvu786"]
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: true, cause: "Authorized" })

        
        const retrievedTrans = {
            username: "Mario",
            type: "food",
            amount: 100
            }
        
        transactions.findOne = jest.fn().mockResolvedValue(null)
            
        
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(400)
         
      
    })

    test.only("401 error: called by an authenticated user who is not an admin", async () => {
        const mockReq = {
           
            body: {
                _ids: ["6hjkohgfc8nvu786", "3hjkohgfc8nvu786"]
            },
            cookies: { accessToken: "adminAccessTokenValid", refreshToken: "adminRefreshTokenValid" },
            url: "/api/users/Mario/transactions" 
        }
      
        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {
                
                refreshedTokenMessage: "111"
            }
        }
      
        verifyAuth.mockReturnValueOnce({ flag: false, cause: "Authorized" })

      
        
        await deleteTransactions(mockReq, mockRes)
     
        expect(mockRes.status).toHaveBeenCalledWith(401)
         
      
    })

})
