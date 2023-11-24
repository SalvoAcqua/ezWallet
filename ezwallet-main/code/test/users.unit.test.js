
import request from 'supertest';
import { app } from '../app';
import { Group, User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import {getUsers, getUser, createGroup, getGroups, getGroup, addToGroup, removeFromGroup, deleteGroup , deleteUser}  from '../controllers/users.js';
import { transactions } from '../models/model';
import { verifyAuth, validateEmail } from '../controllers/utils';

/**
 * In order to correctly mock the calls to external modules it is necessary to mock them using the following line.
 * Without this operation, it is not possible to replace the actual implementation of the external functions with the one
 * needed for the test cases.
 * `jest.mock()` must be called for every external module that is called in the functions under test.
 */
jest.mock("../models/User.js")
jest.mock('../controllers/utils');



/**
 * Defines code to be executed before each test case is launched
 * In this case the mock implementation of `User.find()` is cleared, allowing the definition of a new mock implementation.
 * Not doing this `mockClear()` means that test cases may use a mock implementation intended for other test cases.
 */
beforeEach(() => {
  User.find.mockClear()
  User.findOne.mockClear()
  Group.find.mockClear()
  Group.findOne.mockClear()
  verifyAuth.mockClear()
  validateEmail.mockClear()
});

describe("getUsers", () => {
  test("Admin: should return empty list if there are no users", async () => {
    const mockReq = {
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {refreshedTokenMessage : "aa"}
    }


    
    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(User, "find").mockResolvedValueOnce([])
    await getUsers(mockReq, mockRes)
    expect(User.find).toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data: [], refreshedTokenMessage: "aa" })
  })

  test("User access empty list :  should return an Error", async () => {
   
    const mockReq = {
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    verifyAuth.mockReturnValueOnce({flag: false})
    await getUsers(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  test("Admin: should retrieve list of all users", async () => {
    const mockReq = {
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: true})
    const retrievedUsers = [{ username: 'test1', email: 'test1@example.com', role: 'Regular' }, { username: 'test2', email: 'test2@example.com', role: 'Admin' }]
    jest.spyOn(User, "find").mockResolvedValueOnce(retrievedUsers)
    await getUsers(mockReq, mockRes)
    expect(User.find).toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data: retrievedUsers, refreshedTokenMessage: "aa" })
  })

})
describe("getUser", () => { 
  test("User access to other user, error ", async () => {
   
    const mockReq = {
      params: {username: 'test1'},
      cookie: {accessToken: '111', refreshToken: '555'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    verifyAuth.mockReturnValueOnce({flag: false})
    verifyAuth.mockReturnValueOnce({flag: false})


    await getUser(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })
  

  test("Admin access to other user, retrieve data ", async () => {
   
    const mockReq = {
      params: {username: 'test1'},
      cookies: {accessToken: '111', refreshToken: '555'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: true})

    const retrievedUsers = { username: 'test2', email: 'test1@example.com', role: 'Regular' }
    jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUsers)
    await getUser(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data: retrievedUsers, refreshedTokenMessage: "aa" })
  })

  test("User access to him, retrieve data ", async () => {
   
    const mockReq = {
      params: {username: 'test1'},
      cookie: {accessToken: '111', refreshToken: '555'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: false})
    verifyAuth.mockReturnValueOnce({flag: true})

    const retrievedUsers = { username: 'test1', email: 'test1@example.com', role: 'Regular' }
    jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUsers)
    await getUser(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data: retrievedUsers, refreshedTokenMessage: "aa" })
  })

   test("User access to him, retrieve data ", async () => {
   
    const mockReq = {
      params: {username: 'test1'},
      cookie: {accessToken: '111', refreshToken: '555'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: false})
    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
    await getUser(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin access to unknown user, error ", async () => {
   
    const mockReq = {
      params: {username: 'test1'},
      cookie: {accessToken: '111', refreshToken: '555'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    verifyAuth.mockReturnValueOnce({flag: true})
    const retrievedUsers = null
    jest.spyOn(User, "findOne").mockResolvedValueOnce(retrievedUsers)
    await getUser(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

})

describe("createGroup", () => {

  test("User create a group without name, error ", async () => {
   
    const mockReq = {
      body : {
       name : '',
       memberEmails :['test1@example.com']
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   }

   
    verifyAuth.mockReturnValueOnce({flag: true})
    await createGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User create a group with memberEmail incorrect, error ", async () => {
   
    const mockReq = {
      body : {
       name : '',
       memberEmails :"&&"
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   }

   
    verifyAuth.mockReturnValueOnce({flag: true})
    await createGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })


 

  test("User  create a group without all the attributes,error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
      body : {
       memberEmails :[""]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
     locals: {refreshedTokenMessage : "aa"}

   }
   verifyAuth.mockReturnValueOnce({flag: true})

 

    await createGroup(mockReq, mockRes)

  
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User (yet in a group) create a group without userEmail, error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
      body : {
       name : 'group1',
       memberEmails :[]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   }

    verifyAuth.mockReturnValueOnce({flag: true})
  
    await createGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User create a group with unknown userEmail, succeed ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
        body : {
       name : 'group1',
       memberEmails :["test2@example.com","test1@example.com"]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
     locals: {refreshedTokenMessage : "aa"}

   }

    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    jest.spyOn(jwt,"verify").mockResolvedValueOnce({email: 'test1@example.com' })
    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: "test1@example.com", role: 'Regular', _id: "123" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

    
    await createGroup(mockReq, mockRes)

    

    
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User create a group with  userEmail incorrect, erro ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
        body : {
       name : 'group1',
       memberEmails :["",""]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
     locals: {refreshedTokenMessage : "aa"}

   }

    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    jest.spyOn(jwt,"verify").mockResolvedValueOnce({email: 'test1@example.com' })
    
    await createGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

 

  test("User create a group with a userEmail already in a group and unknown, retrieve the data ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
      body : {
       name : 'group1',
       memberEmails :["test1@example.com","test2@example.com","test3@example.com","test4@example.com"]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
     locals: {refreshedTokenMessage : "aa"}

   }

    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    jest.spyOn(jwt,"verify").mockResolvedValueOnce({email: 'test1@example.com' })
    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular', _id : "123" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular', _id : "123" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test3', email: 'test3@example.com', role: 'Regular', _id : "123" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "123" },{email : "test2@example.com", user : "123" }]})
    
    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

    Group.prototype.save = jest.fn().mockResolvedValueOnce({
      name : "group1",
      members : [{email : "aaa", user : "133"}]
    }) 

    await createGroup(mockReq, mockRes)
    
    
   
    const result ={
      data: {group: {name : 'group1', members :[{email : "test1@example.com"},{email : "test2@example.com"}]},
      alreadyInGroup: ['test3@example.com'],
      membersNotFound: ['test4@example.com']},
      refreshedTokenMessage : "aa"
    }

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(result)
  })


  


  test("User create a group with the same name than an other, error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
      body : {
       name : 'group1',
       memberEmails :["test1@example.com"]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   }

    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : { username: 'test1', email: 'test1@example.com', role: 'Regular' }}]})
    await createGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User create a group with incorrect email, error ", async () => {
   
    const mockReq = {
      cookies : {refreshToken : "AAA"},
      body : {
       name : 'group1',
       memberEmails :["test1@example.com"]
   }
 }
   
   const mockRes = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(),
   }

    verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    jest.spyOn(jwt,"verify").mockResolvedValueOnce({email: 'test1@example.com' })
    validateEmail.mockReturnValueOnce(false)
    await createGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })


 })

 

describe("getGroups", () => {
  
  test("Admin: should return empty list if there are no groups", async () => {
    const mockReq = {
      cookies: {accessToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}
    }

    verifyAuth.mockReturnValueOnce({flag: true})
    const user = { username: 'test1', email: 'test1@example.com', role: 'Admin' }
    
    jest.spyOn(Group, "find").mockResolvedValueOnce([])
    await getGroups(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : [], refreshedTokenMessage : "aa"})
  })

  test("User access empty list :  should return an Error", async () => {
   
    const mockReq = {
      cookies: {accessToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: false})
   
    await getGroups(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  test("Admin: should retrieve list of all groups", async () => {
    const mockReq = {
      cookies: {accessToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }

    verifyAuth.mockReturnValueOnce({flag: true})

    const retrievedGroups = [{ name : 'group1', members:[{email:'test1@example.com', user:"1234"},{email:'test2@example.com', user:"123"}]}]
    jest.spyOn(Group, "find").mockResolvedValueOnce(retrievedGroups)
    await getGroups(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    const results = [{ name : 'group1', members:[{email:'test1@example.com'},{email:'test2@example.com'}]}]
    
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

 })

describe("getGroup", () => { 

  test("User access to other group, error ", async () => {
   
    const mockReq = {
      params :{ name : 'group2'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    
    verifyAuth.mockReturnValueOnce({flag: false})
    const user = { username: 'test3', email: 'test3@example.com', role: 'Regular' }
    const retrievedGroups = {name: 'group2', members: [{ username: 'test1', email: 'test1@example.com', role: 'Regular' }, { username: 'test2', email: 'test2@example.com', role: 'Admin' }]}
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(retrievedGroups)
    verifyAuth.mockReturnValueOnce({flag: false})

    await getGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  test("User access to group with empty name, error ", async () => {
   
    const mockReq = {
      params :{ name : ''},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    
    verifyAuth.mockReturnValueOnce({flag: false})
    
    await getGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin access to group with empty name, error ", async () => {
   
    const mockReq = {
      params :{ name : ''},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    
    verifyAuth.mockReturnValueOnce({flag: true})
    
    await getGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin access to other group, retrieve data ", async () => {
   
    const mockReq = {
      params :{ name : 'group1'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }

    verifyAuth.mockReturnValueOnce({flag: true})
    
    const retrievedGroups = {name: 'group1', members: [{email : 'test1@example.com', user : "123"},{email : 'test2@example.com', user : "124"}]}
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(retrievedGroups)
    await getGroup(mockReq, mockRes)
    const results = {group:{ name : 'group1', members:[{email:'test1@example.com'},{email:'test2@example.com'}]}}

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("User access to his group, retrieve data ", async () => {
   
    const mockReq = {
      params :{ name : 'group1'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: false})
    const retrievedGroups = {name: 'group1', members: [{email : 'test1@example.com', user : "123"},{email : 'test2@example.com', user : "124"}]}
    const user = { username: 'test1', email: 'test1@example.com', role: 'Regular' }
  
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(retrievedGroups)
    verifyAuth.mockReturnValueOnce({flag: true})


    await getGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(200)
    const results = {group :{ name : 'group1', members:[{email:'test1@example.com'},{email:'test2@example.com'}]}}

    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })  

  test("Admin access to unknown group, error ", async () => {
   
    const mockReq = {
      params :{ name : 'group1'},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    verifyAuth.mockReturnValueOnce({flag: true})
    const user = { username: 'test2', email: 'test2@example.com', role: 'Admin' }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    await getGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

})

describe("addToGroup", () => {
  test("User add a user in a group without name, error ", async () => {
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : '' },
      body : {emails : ['test2@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    
    await addToGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })
  
  test("User add nobody in his group, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : []},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123"}]})
    verifyAuth.mockReturnValueOnce({flag: true})
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin : format email incorrect, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {emails : ""},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    verifyAuth.mockReturnValueOnce({flag: true})
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User : format email incorrect, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : ""},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123"}]})
    verifyAuth.mockReturnValueOnce({flag: true})
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User :  email missing, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {name : ""},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123"}]})
    verifyAuth.mockReturnValueOnce({flag: true})
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User add an unknown userEmail in his group, error ", async () => {
   
     
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : ['test3@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123" }]})
    verifyAuth.mockReturnValueOnce({flag: true})

    validateEmail.mockReturnValueOnce(true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("User add a userEmail in his group, retrieve the data ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : ['test2@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
   
    

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123" }]})
    verifyAuth.mockReturnValueOnce({flag: true})
    validateEmail.mockReturnValueOnce(true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular', _id : "134" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com" },{email : "test2@example.com" }]})
    await addToGroup(mockReq, mockRes)
    const results ={
      group: {name : 'group2', members : [{ email: 'test1@example.com'}, { email: 'test2@example.com'}]},
      alreadyInGroup: [],
      membersNotFound: []
    }

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("User add multiple userEmails in his group, retrieve the data ", async () => {
      
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : ['test2@example.com','test1@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123"}]})
    verifyAuth.mockReturnValueOnce({flag: true})
  
    
    validateEmail.mockReturnValueOnce(true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular', _id :"134"})
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members : [{ email: 'test1@example.com', user : "123"}, { email: 'test2@example.com', user :"134" }]})
    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com" },{email : "test2@example.com" }]})

    await addToGroup(mockReq, mockRes)
    const results ={
      group: {name : 'group2', members : [{ email: 'test1@example.com'}, { email: 'test2@example.com'}]},
      alreadyInGroup: ['test1@example.com'],
      membersNotFound: []
    }

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("User add useEmails already in his group, in his group, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group2' },
      body : {emails : ['test1@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : "123" }]})
    verifyAuth.mockReturnValueOnce({flag: true})
  
    
    validateEmail.mockReturnValueOnce(true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members : [{ email: 'test1@example.com', user : "123"}]})
    await addToGroup(mockReq, mockRes)
    

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

 




  test("User add useEmail in an other group, error ", async () => {

    const mockReq = {
     
      url: '/groups/:name/add',
      params :{ name : 'group1' },
      body : {emails : ['test1@example.com']},
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : { username: 'test3', email: 'test3@example.com', role: 'Regular' }}]},{name : 'group1', members :[{email : "test1@example.com", user : { username: 'test1', email: 'test1@example.com', role: 'Regular' }}]})
    verifyAuth.mockReturnValueOnce({flag: false})
  
    
    
   await addToGroup(mockReq, mockRes)
    

    expect(mockRes.status).toHaveBeenCalledWith(401)

  })

  test("Admin add an incorrect userEmail in his group, error ", async () => {
   
     
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {emails : ['test3@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : { username: 'test1', email: 'test1@example.com', role: 'Regular' }}]})
    validateEmail.mockReturnValueOnce(false)

    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add an incorrect userEmail in his group, error ", async () => {
   
     
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
    

    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add a list of email empty in his group, error ", async () => {
   
     
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {emails : []},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  

    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add an incorrect userEmail in his group, error ", async () => {
   
     
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {emails : ['']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test1@example.com", user : { username: 'test1', email: 'test1@example.com', role: 'Regular' }}]})

    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add a userEmail unknown, error  ", async () => {
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group3' },
      body : {emails : ['test1@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
  
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group3', members :[{email : "test3@example.com", user : "333"}]})
    validateEmail.mockReturnValueOnce(true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
   await addToGroup(mockReq, mockRes)
    


    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add a userEmail in an other group, retrieve the data ", async () => {
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group3' },
      body : {emails : ['test1@example.com', 'test2@example.com','test5@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
  
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group3', members :[{email : "test3@example.com", user : "333"}]})
    validateEmail.mockReturnValueOnce(true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular', _id: "123" })
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test5', email: 'test5@example.com', role: 'Regular', _id : "444" })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test5@example.com", user : "444" }]})
    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group3', members :[{email : "test3@example.com" },{email : "test1@example.com" }]})

   await addToGroup(mockReq, mockRes)
   
   const results ={
    group: {name : 'group3', members : [{ email: 'test3@example.com'}, { email: 'test1@example.com'}]},
    alreadyInGroup: ['test5@example.com'],
    membersNotFound: ['test2@example.com']
  }

  expect(mockRes.status).toHaveBeenCalledWith(200)
  expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
})

  test("Admin add nobody in his group, error ", async () => {
   
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : 'group2' },
      body : {emails :[]},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  
      
    await addToGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin add a user in a group without name, error ", async () => {
    const mockReq = {
     
      url: '/groups/:name/insert',
      params :{ name : '' },
      body : {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
   
    verifyAuth.mockReturnValueOnce({flag: true})  

    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    await addToGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

})
describe("removeFromGroup", () => { 

  

  test("user remove a userEmail unknown from his group, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
       params:{name : 'group1'},
       body: {emails : ['test3@example.com']},
       cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }


    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  



    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
 
    await removeFromGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user remove a userEmail not in the group from his group, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',

      params:{name : 'group1'},
      body: {emails : ['test3@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test3', email: 'test3@example.com', role: 'Regular' })
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)





    await removeFromGroup(mockReq, mockRes)
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user remove a userEmail  from his group, retrieve data ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  



    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" }]})

    await removeFromGroup(mockReq, mockRes)

  
    const results ={
      group: {name : 'group1', members : [{ email: 'test1@example.com'}]},
      notInGroup: [],
      membersNotFound: []
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("user remove a userEmail  from his group,empty email, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['','test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

   
   
    await removeFromGroup(mockReq, mockRes)

  
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user remove a userEmail  from his group,email invalid, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['rree','test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  



    validateEmail.mockReturnValueOnce( false)

   
    await removeFromGroup(mockReq, mockRes)

  
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  
  
   test("user remove a userEmail unknow, not in the group and known,  from his group, error  ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com','test3@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test4@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)


    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)

   

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" },{email : "test4@example.com"}]})

    await removeFromGroup(mockReq, mockRes)

  
    expect(mockRes.status).toHaveBeenCalledWith(400)

  })



  

  test("user remove a userEmail  from an other group, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: false})  

    
    
    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  test("user incorrect body, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {email : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    
    
    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user incorrect email format, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : 'test2@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    
    
    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user incorrect emails epmty, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : []},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    
    
    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user incorrect group, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group2', members :[{email : "test3@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  

    
    
    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })



  test("user remove a userEmail  from a group unknown, error", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    



    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  
  


  test("user remove too much useremail in  his group, retrieve data ", async () => {
   
    const mockReq = {
      url: '/groups/:name/remove',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com','test1@example.com' ]},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
    verifyAuth.mockReturnValueOnce({flag: true})  



    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" }]})

    await removeFromGroup(mockReq, mockRes)

  
    const results ={
      group: {name : 'group1', members : [{ email: 'test1@example.com'}]},
      notInGroup: [],
      membersNotFound: []
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })



  test("Admin remove a userEmail unknown from a group, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
       body: {emails : ['test3@example.com']},
       cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: true})  
    
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)

    
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test3', email: 'test3@example.com', role: 'Regular' })
     jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

     await removeFromGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin : incorrect body, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
       body: {eee : ['test3@example.com']},
       cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: true})  
    
    
     await removeFromGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin : incorrect format email, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
       body: {emails : 'test3@.com'},
       cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: true})  
    
    
     await removeFromGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin : incorrect email empty, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
       body: {emails : []},
       cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: true})  
    
    
     await removeFromGroup(mockReq, mockRes)
    
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })


  test("Admin remove a userEmail  from a group, retrieve data ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: true})  

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" }]})

    await removeFromGroup(mockReq, mockRes)

  
    const results ={
      group: {name : 'group1', members : [{ email: 'test1@example.com'}]},
      notInGroup: [],
      membersNotFound: []
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })
  


  test("Admin remove a userEmail unknow, not in the group and known,  from his group, error  ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com','test3@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: true})  


    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test4@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    validateEmail.mockReturnValueOnce( true)
    jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)


    



    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" },{email : "test4@example.com"}]})

    await removeFromGroup(mockReq, mockRes)

  
 
    expect(mockRes.status).toHaveBeenCalledWith(400)
  })
  
  test("Admin remove his username  from his group, alone, error ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
   verifyAuth.mockReturnValueOnce({flag: true})  

  jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"}]})

    

    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin remove a userEmail  from a group unknown, error", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com']},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
    verifyAuth.mockReturnValueOnce({flag: true})  

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)

    await removeFromGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin remove too much useremail in  his group, retrieve data ", async () => {
   
    const mockReq = {
      url: '/groups/:name/pull',
      params:{name : 'group1'},
      body: {emails : ['test2@example.com','test1@example.com' ]},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true})  


    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test2', email: 'test2@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    validateEmail.mockReturnValueOnce( true)

    jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})

    Group.findOneAndUpdate = jest.fn().mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com" }]})

    await removeFromGroup(mockReq, mockRes)

  
    const results ={
      group: {name : 'group1', members : [{ email: 'test1@example.com'}]},
      notInGroup: [],
      membersNotFound: []
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })


})

describe("deleteGroup", () => { 

  test("user delete his group, error ", async () => {
   
    const mockReq = {
     body:{name: 'group1'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    verifyAuth.mockReturnValueOnce({flag: false})
    await deleteGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(401)
  })

  test("Admin delete his group, succeed ", async () => {
   
    const mockReq = {
      body:{name: 'group1'}
     }
     const mockRes = {
       status: jest.fn().mockReturnThis(),
       json: jest.fn(),
       locals : {refreshedTokenMessage : "aa"}
     }
 
     verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"}]})
    await deleteGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({ data: {message: "Group deleted successfully"}, refreshedTokenMessage: "aa"})

  })

  test("Admin delete a group unknown, error ", async () => {
   
    const mockReq = {
      body:{name: 'group1'}
     }
     const mockRes = {
       status: jest.fn().mockReturnThis(),
       json: jest.fn(),
     }
 
     verifyAuth.mockReturnValueOnce({flag: true})

    jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
    await deleteGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin delete a group with name empty, error ", async () => {
   
    const mockReq = {
      body:{name: ''}
     }
     const mockRes = {
       status: jest.fn().mockReturnThis(),
       json: jest.fn(),
     }
 
     verifyAuth.mockReturnValueOnce({flag: true})

    await deleteGroup(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

})

describe("deleteUser", () => { 

  test("Admin delete a user unknown, error ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test3@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     validateEmail.mockReturnValueOnce( true)
     jest.spyOn(User, "findOne").mockResolvedValueOnce(undefined)
     await deleteUser(mockReq, mockRes)

   

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin delete an incorrect email, error ", async () => {
   
      
    const mockReq = {
      params:{name : 'group1'},
      body: {email : ''},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     await deleteUser(mockReq, mockRes)

   

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("Admin delete a user alone in a group, retrieve data ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test1@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     validateEmail.mockReturnValueOnce( true)
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
     jest.spyOn(transactions, "deleteMany").mockResolvedValueOnce({deletedCount : 0})
     jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"}]})
     await deleteUser(mockReq, mockRes)

     const results ={
      deletedTransactions: 0,
      deletedFromGroup: true
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })





  test("Admin delete a user not alone in a group, retrieve data ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test1@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     validateEmail.mockReturnValueOnce( true)
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
     jest.spyOn(transactions, "deleteMany").mockResolvedValueOnce({deletedCount : 1})
     jest.spyOn(Group, "findOne").mockResolvedValueOnce({name : 'group1', members :[{email : "test1@example.com", user : "333"},{email : "test2@example.com", user : "333"}]})
     await deleteUser(mockReq, mockRes)

     const results ={
      deletedTransactions: 1,
      deletedFromGroup: true
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("Admin delete a user not in a group, retrieve data ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test1@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     validateEmail.mockReturnValueOnce( true)
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Regular' })
     jest.spyOn(transactions, "deleteMany").mockResolvedValueOnce({deletedCount : 0})
     jest.spyOn(Group, "findOne").mockResolvedValueOnce(undefined)
     await deleteUser(mockReq, mockRes)

     const results ={
      deletedTransactions: 0,
      deletedFromGroup: false
    }
  
    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith({data : results, refreshedTokenMessage : "aa"})
  })

  test("Admin delete an other admin, error ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test1@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: true}) 
     validateEmail.mockReturnValueOnce( true)
     jest.spyOn(User, "findOne").mockResolvedValueOnce({ username: 'test1', email: 'test1@example.com', role: 'Admin' })
  
     await deleteUser(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(400)
  })

  test("user delete a user, error ", async () => {
   
    const mockReq = {
      params:{name : 'group1'},
      body: {email : 'test1@example.com'},
      cookies: {refreshToken: '111'}
    }
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals : {refreshedTokenMessage : "aa"}

    }
     verifyAuth.mockReturnValueOnce({flag: false}) 
     
     await deleteUser(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(401)
  })
  

})