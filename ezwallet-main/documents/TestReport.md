# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

   ![](DependenciesGraph.png)

# Integration approach

    We decided to realise an incremental integration in order to detect as soon as possible the defects. As all the structure and definitions were already created, the top-down approach was possible.
    
    All along the test part, we followed the sequence :
    - STEP 1 : Unit test of each function without using the API
    - STEP 2 : Integration test of each function, alone, testing the API
    - STEP 3 : Integration test of multiples function, with the API

# Tests

  

| Test case name                                                                                                                                          | Object(s) tested                  | Test level  | Technique used         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- | ---------------------- |
|                                                                                                                                                         |                                   |             |                        |
| Token both valid and belong to the requested user                                                                                                       | verifyAuth                        | Unit        | WB, statement coverage |
| Undefined tokens                                                                                                                                        | verifyAuth                        | Unit        | WB, statement coverage |
| Access token expired and refresh token belonging to the requested user                                                                                  | verifyAuth                        | Unit        | WB, statement coverage |
| Access token and refresh token are both invalid                                                                                                         | verifyAuth                        | Unit        | WB, statement coverage |
| Token both valid and belong to the requested admin                                                                                                      | verifyAuth                        | Unit        | WB, statement coverage |
| Uncomplete access token                                                                                                                                 | verifyAuth                        | Unit        | WB, statement coverage |
| Uncomplete refresh token                                                                                                                                | verifyAuth                        | Unit        | WB, statement coverage |
| Mismatched accessTokenUser and refreshTokenUser                                                                                                         | verifyAuth                        | Unit        | WB, statement coverage |
| Tokens are both valid and simple authentication is required                                                                                             | verifyAuth                        | Unit        | WB, statement coverage |
| Tokens are both valid, Mismatched (accessTokenUser or refreshTokenUser) and Username and user authentication is required                                | verifyAuth                        | Unit        | WB, statement coverage |
| Tokens are both valid, but One (or both) of tokens doesn't have Admin role when performing Admin auth                                                   | verifyAuth                        | Unit        | WB, statement coverage |
| Tokens are both valid, but the user doesn't belong to the group                                                                                         | verifyAuth                        | Unit        | WB, statement coverage |
| Both tokens have an email that belongs to the requested group                                                                                           | verifyAuth                        | Unit        | WB, statement coverage |
| Invalid authorization required                                                                                                                          | verifyAuth                        | Unit        | WB, statement coverage |
| Access token expired and refresh token belonging to the requested user, simple authentication required                                                  | verifyAuth                        | Unit        | WB, statement coverage |
| Admin authentication required, Access token expired and refresh token  belonging to an Admin                                                            | verifyAuth                        | Unit        | WB, statement coverage |
| Admin authentication required, Access token expired and refresh token not belonging to an Admin                                                         | verifyAuth                        | Unit        | WB, statement coverage |
| User authentication required, Access token expired and refresh token not belonging to same User                                                         | verifyAuth                        | Unit        | WB, statement coverage |
| Group authentication required, Access token expired and refresh token belonging to a user in the group                                                  | verifyAuth                        | Unit        | WB, statement coverage |
| Group authentication required, Access token expired and refresh token not belonging to a user in the group                                              | verifyAuth                        | Unit        | WB, statement coverage |
| Access token expired and refresh token belonging to the requested user, not defined authentication required                                             | verifyAuth                        | Unit        |         WB, statement coverage                |
| Access token and refresh token expired                                                                                                                  | verifyAuth                        | Unit        | WB, statement coverage |
| Query has min parameter and min is not a numerical value                                                                                                | handleAmountFilterParams          | Unit        | WB, statement coverage |
| Query has max parameter and max is not a numerical value                                                                                                | handleAmountFilterParams          | Unit        | WB, statement coverage |
| Defined numerical min in query                                                                                                                          | handleAmountFilterParams          | Unit        | WB, statement coverage |
| Defined numericalmax in query                                                                                                                           | handleAmountFilterParams          | Unit        | WB, statement coverage |
| Defined numerical max and min in query                                                                                                                  | handleAmountFilterParams          | Unit        | WB, statement coverage |
| Date is present in the query parameter together with at least one of from or upTo                                                                       | handleDateFilterParams            |       Unit      | WB, statement coverage |
| Query has upTo, Returns an object with a property "date" having as value an object with property "$lte"                                                 | handleDateFilterParams            | Unit        | WB, statement coverage |
| Query has from, Returns an object with a property "date" having as value an object with property "$gte                                                  | handleDateFilterParams            | Unit        | WB, statement coverage |
| Query has from and upTo, Returns an object with a property "date" having as value an object with properties "$gte" and "$lte"                           | handleDateFilterParams            | Unit        | WB, statement coverage |
| Admin: should return empty list if there are no users                                                                                                   | getUsers                          | Unit        | WB, statement coverage |
| User access empty list :  should return an Error                                                                                                        | getUsers                          | Unit        | WB, statement coverage |
| Admin: should retrieve list of all users                                                                                                                | getUsers                          | Unit        | WB, statement coverage |
| User access to other user, error                                                                                                                        | getUser                           | Unit        | WB, statement coverage |
| Admin access to other user, retrieve data                                                                                                               | getUser                           | Unit        | WB, statement coverage |
| User access to him, retrieve data                                                                                                                       | getUser                           | Unit        | WB, statement coverage |
| Admin access to unknown user, error                                                                                                                     | getUser                           | Unit        | WB, statement coverage |
| User create a group without name, error                                                                                                                 | createGroup                       | Unit        | WB, statement coverage |
| User (not yet in a group) create a group without userEmail, succeed                                                                                     | createGroup                       | Unit        | WB, statement coverage |
| User (not yet in a group) create a group with empty userEmail, error                                                                                    | createGroup                       | Unit        | WB, statement coverage |
| User  create a group without all the attributes,error                                                                                                   | createGroup                       | Unit        | WB, statement coverage |
| User (yet in a group) create a group without userEmail, error                                                                                           | createGroup                       | Unit        | WB, statement coverage |
| User create a group with unknown userEmail, succeed                                                                                                     | createGroup                       | Unit        | WB, statement coverage |
| User create a group with a userEmail already in a group and unknown, retrieve the data                                                                  | createGroup                       | Unit        | WB, statement coverage |
| User create a group with the same name than an other, error                                                                                             | createGroup                       | Unit        | WB, statement coverage |
| User create a group with incorrect email, error                                                                                                         | createGroup                       | Unit        | WB, statement coverage |
| Admin: should return empty list if there are no groups                                                                                                  | getGroups                         | Unit        | WB, statement coverage |
| User access empty list :  should return an Error                                                                                                        | getGroups                         | Unit        | WB, statement coverage |
| Admin: should retrieve list of all groups                                                                                                               | getGroups                         | Unit        | WB, statement coverage |
| User access to other group, error                                                                                                                       | getGroup                          | Unit        | WB, statement coverage |
| User access to group with empty name, error                                                                                                             | getGroup                          | Unit        |                        |
| Admin access to group with empty name, error                                                                                                            | getGroup                          | Unit        | WB, statement coverage |
| Admin access to other group, retrieve data                                                                                                              | getGroup                          | Unit        | WB, statement coverage |
| User access to his group, retrieve data                                                                                                                 | getGroup                          | Unit        | WB, statement coverage |
| Admin access to unknown group, error                                                                                                                    | getGroup                          | Unit        | WB, statement coverage |
| User add a user in a group without name, error                                                                                                          | addToGroup                        | Unit        | WB, statement coverage |
| User add nobody in his group, error                                                                                                                     | addToGroup                        | Unit        | WB, statement coverage |
| User add an unknown userEmail in his group, error                                                                                                       | addToGroup                        | Unit        | WB, statement coverage |
| User add a userEmail in his group, retrieve the data                                                                                                    | addToGroup                        | Unit        | WB, statement coverage |
| User add multiple userEmails in his group, retrieve the data                                                                                            | addToGroup                        | Unit        | WB, statement coverage |
| User add useEmails already in his group, in his group, error                                                                                            | addToGroup                        | Unit        | WB, statement coverage |
| User add useEmail in an other group, error                                                                                                              | addToGroup                        | Unit        | WB, statement coverage |
| Admin add an unknown userEmail in his group, error                                                                                                      | addToGroup                        | Unit        | WB, statement coverage |
| Admin add a userEmail unknown, error                                                                                                                    | addToGroup                        | Unit        | WB, statement coverage |
| Admin add a userEmail in an other group, retrieve the data                                                                                              | addToGroup                        | Unit        | WB, statement coverage |
| Admin add nobody in his group, error                                                                                                                    | addToGroup                        | Unit        | WB, statement coverage |
| Admin add a user in a group without name, error                                                                                                         | addToGroup                        | Unit        | WB, statement coverage |
| user remove a userEmail from his group without name, error                                                                                              | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail unknown from his group, error                                                                                                   | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail not in the group from his group, error                                                                                          | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail  from his group, retrieve data                                                                                                  | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail unknow, not in the group and known,  from his group, retrieve data                                                              | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail  from an other group, error                                                                                                     | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail  from a group unknown, error                                                                                                    | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove a userEmail  from a group empty, error                                                                                                      | removeFromGroup                   | Unit        | WB, statement coverage |
| user remove too much useremail in  his group, retrieve data                                                                                             | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove a userEmail from his group without name, error                                                                                             | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove a userEmail unknown from a group, error                                                                                                    | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove a userEmail  from a group, retrieve data                                                                                                   | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove a userEmail unknow, not in the group and known,  from his group, retrieve data                                                             | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin his username  from his group, alone, error                                                                                                        | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove a userEmail  from a group unknown, error                                                                                                   | removeFromGroup                   | Unit        | WB, statement coverage |
| Admin remove too much useremail in  his group, retrieve data                                                                                            | removeFromGroup                   | Unit        | WB, statement coverage |
| user delete his group, error                                                                                                                            | deleteGroup                       | Unit        | WB, statement coverage |
| Admin delete his group, succeed                                                                                                                         | deleteGroup                       | Unit        | WB, statement coverage |
| Admin delete a group unknown, error                                                                                                                     | deleteGroup                       | Unit        | WB, statement coverage |
| Admin delete a group with name empty, error                                                                                                             | deleteGroup                       | Unit        | WB, statement coverage |
| Admin delete a user unknown, error                                                                                                                      | deleteUser                        | Unit        | WB, statement coverage |
| Admin delete an incorrect email, error                                                                                                                  | deleteUser                        | Unit        | WB, statement coverage |
| Admin delete a user alone in a group, retrieve data                                                                                                     | deleteUser                        | Unit        | WB, statement coverage |
| Register with username and email unique, succeed                                                                                                        | register                          | Unit        | WB, statement coverage |
| Register with username unique and email multiple, error                                                                                                 | register                          | Unit        | WB, statement coverage |
| Register with username multiple and email unique, error                                                                                                 | register                          | Unit        | WB, statement coverage |
| Register with email incorrect                                                                                                                           | register                          | Unit        | WB, statement coverage |
| Register with name empty,error                                                                                                                          | register                          | Unit        | WB, statement coverage |
| Register with username and email unique, succeed                                                                                                        | registerAdmin                     | Unit        | WB, statement coverage |
| Register with username unique and email multiple, error                                                                                                 | registerAdmin                     | Unit        | WB, statement coverage |
| Register with username multiple and email unique, error                                                                                                 | registerAdmin                     | Unit        | WB, statement coverage |
| Register with email incorrect                                                                                                                           | registerAdmin                     | Unit        | WB, statement coverage |
| Register with name empty, error                                                                                                                         | registerAdmin                     | Unit        | WB, statement coverage |
| login with userEmail known and password correct, succeed                                                                                                | login                             | Unit        | WB, statement coverage |
| login with userEmail unknown and password wrong, error                                                                                                  | login                             | Unit        | WB, statement coverage |
| login with userEmail known and password wrong, error                                                                                                    | login                             | Unit        | WB, statement coverage |
| logout with refreshToken correct, succeed                                                                                                               | logout                            | Unit        | WB, statement coverage |
| logout with refreshToken empty, error                                                                                                                   | logout                            | Unit        | WB, statement coverage |
| logout with refreToken unknown, error                                                                                                                   | logout                            | Unit        | WB, statement coverage |
| 400 error if the request body does  contain an empty array                                                                                              | deleteCategory                    | Unit        | WB, statement coverage |
| 400 error if the request body does not contain an array                                                                                                 | deleteCategory                    | Unit        | WB, statement coverage |
| 400 error if the request body does not contain all the necessary attributes                                                                             | deleteCategory                    | Unit        | WB, statement coverage |
| Admin authenticated, successful deletion 200 with data response                                                                                         | deleteCategory                    | Unit        | WB, statement coverage |
| 400 error, one of the types in the array is an empty string                                                                                             | deleteCategory                    | Unit        | WB, statement coverage |
| 400 error, at least one of the types in the array does not represent a category in the database                                                         | deleteCategory                    | Unit        | WB, statement coverage |
| 401 error, called by an authenticated user who is not an admin                                                                                          | deleteCategory                    | Unit        | WB, statement coverage |
| 200 Successful deletion, attribute message and count                                                                                                    | deleteCategory                    | Unit        | WB, statement coverage |
| Successful: Admin authenticated, correct request, returns a message for confirmation and the number of updated transactions                             | updateCategory                    | Unit        | WB, statement coverage |
| Returns a 401 error if called by a user who is not an Admin"                                                                                            | updateCategory                    | Unit        | WB, statement coverage |
| Error: Admin authenticated, but request body does not contain all the necessary attributes                                                              | updateCategory                    | Unit        | WB, statement coverage |
| Error: Admin authenticated, but at least one of the parameters in the request body is an empty string                                                   | updateCategory                    | Unit        | WB, statement coverage |
| Error: Admin authenticated, but the type of category passed in the request body as the new type represents an already existing category in the database | updateCategory                    | Unit        | WB, statement coverage |
| Error: Admin authenticated,but the type of category passed as a route parameter does not represent a category in the database                           | updateCategory                    | Unit        | WB, statement coverage |
| 200 Succesful creation of category                                                                                                                      | createCategory                    | Unit        | WB, statement coverage |
| 400 error: request body does not contain all the necessary attributes                                                                                   | createCategory                    | Unit        | WB, statement coverage |
| 400 error: at least one of the parameters in the request body is an empty string                                                                        | createCategory                    | Unit        | WB, statement coverage |
| 401 error: called by an authenticated user who is not an admin                                                                                          | createCategory                    | Unit        | WB                     |
| 200 Successful: User authenticated, correct request                                                                                                     | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: the request body does not contain all the necessary attributes                                                                               | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: at least one of the parameters in the request body is an empty string                                                                        | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: the type of category passed in the request body does not represent a category in the database                                                | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: the username passed in the request body is not equal to the one passed as a route parameter                                                  | createTransaction                 | Unit        | WB, statement coverage |
| 400 error:  the username passed in the request body does not represent a user in the database                                                           | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | createTransaction                 | Unit        | WB, statement coverage |
| 400 error: the amount passed in the request body cannot be parsed as a floating value                                                                   | createTransaction                 | Unit        |         WB, statement coverage                |
| 200 succesful operation, admin authenticated                                                                                                            | getAllTransactions                | Unit        | WB, statement coverage |
| 401 called by an authenticated user who is not an admin                                                                                                 | getAllTransactions                | Unit        | WB, statement coverage |
| 200 Successful: User authenticated, correct request, response data correct                                                                              | deleteTransaction                 | Unit        | WB, statement coverage |
| 400 error: User authenticated, the `_id` in the request body does not represent a transaction in the databas                                            | deleteTransaction                 | Unit        | WB, statement coverage |
| 400 error: User authenticated, the request body does not contain all the necessary attributes                                                           | deleteTransaction                 | Unit        | WB, statement coverage |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | deleteTransaction                 | Unit        | WB, statement coverage |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | deleteTransaction                 | Unit        | WB, statement coverage |
| 200 Successful: Admin authenticated, correct request, response data correct                                                                             | deleteTransactions                | Unit        | WB, statement coverage |
| 400 error: request body does not contain all the necessary attributes                                                                                   | deleteTransactions                | Unit        | WB, statement coverage |
| 400 error: at least one of the ids in the array is an empty string                                                                                      | deleteTransactions                | Unit        | WB, statement coverage |
| 400 error: at least one of the ids in the array does not represent a transaction in the database                                                        | deleteTransactions                | Unit        | WB, statement coverage |
| 401 error: called by an authenticated user who is not an admin                                                                                          | deleteTransactions                | Unit        | WB, statement coverage |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByUser             | Unit        | WB, statement coverage |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByUser             | Unit        | WB, statement coverage |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | getTransactionsByUser             | Unit        | WB, statement coverage |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | getTransactionsByUser             | Unit        | WB, statement coverage |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | getTransactionsByUser             | Unit        | WB, statement coverage |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 400 error: the category passed as a route parameter does not represent a category in the database                                                       | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 401 error: called by an authenticated user who is not the same user as the one in the user route                                                        | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 401 error: called by an authenticated user who is not an admin in an admin route                                                                        | getTransactionsByUserByCategories | Unit        | WB, statement coverage |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByGroup            | Unit        | WB, statement coverage |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByGroup            | Unit        | WB, statement coverage |
| 400 errror: group name passed as a route parameter does not represent a group in the database                                                           | getTransactionsByGroup            | Unit        | WB, statement coverage |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | getTransactionsByGroup            | Unit        | WB, statement coverage |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | getTransactionsByGroup            | Unit        | WB, statement coverage |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| 400 errror: group name passed as a route parameter does not represent a group in the database                                                           | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| 400 errror: category passed as a route parameter does not represent a category in the database                                                          | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | getTransactionsByGroupByCategory  | Unit        | WB, statement coverage |
| Admin: should retrieve list of all users                                                                                                                | getUsers                          | Integration | BB, boundaries         |
| User: should retrieve list of all users                                                                                                                 | getUsers                          | Integration | BB, boundaries         |
| Admin access to other user, retrieve data                                                                                                               | getUsers                          | Integration | BB, boundaries         |
| User access to him, retrieve data                                                                                                                       | getUser                           | Integration | BB, boundaries         |
| User access to other user, error                                                                                                                        | getUser                           | Integration | BB, boundaries         |
| Admin access to unknown, error                                                                                                                          | getUser                           | Integration | BB, boundaries         |
| Admin create a group whitout him, succeed                                                                                                               | createGroup                       | Integration | BB, boundaries         |
| Admin create a group alone, error                                                                                                                       | createGroup                       | Integration | BB, boundaries         |
| Admin create two groups , error                                                                                                                         | createGroup                       | Integration | BB, boundaries         |
| Admin create a group whitout name, error                                                                                                                | createGroup                       | Integration | BB, boundaries         |
| Admin not authenticated, error                                                                                                                          | createGroup                       | Integration | BB, boundaries         |
| Admin : list of group                                                                                                                                   | getGroups                         | Integration | BB, boundaries         |
| Admin : list of group empty                                                                                                                             | getGroups                         | Integration | BB, boundaries         |
| User : error                                                                                                                                            | getGroups                         | Integration | BB, boundaries         |
| Admin acces to a group : retrieve data                                                                                                                  | getGroup                          | Integration | BB, boundaries         |
| Admin acces to a group unknown : erro                                                                                                                   | getGroup                          | Integration | BB, boundaries         |
| user acces to his group : retrieve data                                                                                                                 | getGroup                          | Integration | BB, boundaries         |
| user acces to an other group : error                                                                                                                    | getGroup                          | Integration | BB, boundaries         |
| Admin add a userEmail in his group, retrieve the data                                                                                                   | addToGroup                        | Integration | BB, boundaries         |
| Admin add a userEmail already present in his group, error                                                                                               | addToGroup                        | Integration | BB, boundaries         |
| Admin add a userEmail unknown in his group, error                                                                                                       | addToGroup                        | Integration | BB, boundaries         |
| User add a userEmail already present in his group, error                                                                                                | addToGroup                        | Integration | BB, boundaries         |
| User add a userEmail in his group, succeed                                                                                                              | addToGroup                        | Integration | BB, boundaries         |
| Admin delete a userEmail in his group, succeed                                                                                                          | removeFromGroup                   | Integration | BB, boundaries         |
| User delete a userEmail in his group, succeed                                                                                                           | removeFromGroup                   | Integration | BB, boundaries         |
| User delete a userEmail unknown, error                                                                                                                  | removeFromGroup                   | Integration | BB, boundaries         |
| User delete a userEmail not in his group, error                                                                                                         | removeFromGroup                   | Integration | BB, boundaries         |
| Admin delete a user not in a group, without transactions, succeed                                                                                       | deleteUser                        | Integration | BB, boundaries         |
| Admin delete a user in a group, without transactions, succeed                                                                                           | deleteUser                        | Integration | BB, boundaries         |
| Admin delete a user not in a group, transactions, succeed                                                                                               | deleteUser                        | Integration | BB, boundaries         |
| User delete a admin not in a group, without transactions, error                                                                                         | deleteUser                        | Integration | BB, boundaries         |
| Admin delete a user unknown, error                                                                                                                      | deleteUser                        | Integration | BB, boundaries         |
| Admin delete a  group, succeed                                                                                                                          | deleteGroup                       | Integration | BB, boundaries         |
| Admin delete a  group unknows, succeed                                                                                                                  | deleteGroup                       | Integration | BB, boundaries         |
| User delete a  group, error                                                                                                                             | deleteGroup                       | Integration | BB, boundaries         |
| Register, succeed                                                                                                                                       | register                          | Integration | BB, boundaries         |
| Register with username empty, error                                                                                                                     | register                          | Integration | BB, boundaries         |
| Register, succeed                                                                                                                                       | registerAdmin                     | Integration | BB, boundaries         |
| Register with username empty, error                                                                                                                     | registerAdmin                     | Integration | BB, boundaries         |
| logging, error                                                                                                                                          | login                             | Integration | BB, boundaries         |
| logout, succeed                                                                                                                                         | logout                            | Integration | BB, boundaries         |
| 200 succesful creation of category                                                                                                                      | createCategory                    | Integration | BB, boundaries         |
| error 400: the type of category passed in the request body represents an already existing category in the database                                      | createCategory                    | Integration | BB, boundaries         |
| error 401: called by an authenticated user who is not an admin                                                                                          | createCategory                    | Integration | BB, boundaries         |
| 200 succesful: Returns a message for confirmation and the number of updated transactions                                                                | updateCategory                    | Integration | BB, boundaries         |
| 400 error: the type of the new category is the same as one that exists already and that category is not the requested one                               | updateCategory                    | Integration | BB, boundaries         |
| 400 error: the request body does not contain all the necessary parameters                                                                               | updateCategory                    | Integration | BB, boundaries         |
| 401 error: called by a user who is not an Admin                                                                                                         | updateCategory                    | Integration | BB, boundaries         |
| 200 Successful deletion, attribute message and count                                                                                                    | deleteCategory                    | Integration | BB, boundaries         |
| 401 error called by an authenticated user who is not an admin                                                                                           | deleteCategory                    | Integration | BB, boundaries         |
| 200 user authenticated, succesful get categories                                                                                                        | getCategories                     | Integration | BB, boundaries         |
| 401 error: user not authenticated                                                                                                                       | getCategories                     | Integration | BB, boundaries         |
| 200 Successful: User authenticated, correct request                                                                                                     | createTransaction                 | Integration | BB, boundaries         |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | createTransaction                 | Integration | BB, boundaries         |
| 200 succesful operation, admin authenticated                                                                                                            | getAllTransactions                | Integration | BB, boundaries         |
| 401 called by an authenticated user who is not an admin                                                                                                 | getAllTransactions                | Integration | BB, boundaries         |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByUser             | Integration | BB, boundaries         |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByUser             | Integration | BB, boundaries         |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | getTransactionsByUser             | Integration | BB, boundaries         |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | getTransactionsByUser             | Integration | BB, boundaries         |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByUserByCategory   | Integration | BB, boundaries         |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByUserByCategory   | Integration | BB, boundaries         |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | getTransactionsByUserByCategory   | Integration | BB, boundaries         |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | getTransactionsByUserByCategory   | Integration | BB, boundaries         |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByGroup            | Integration | BB, boundaries         |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByGroup            | Integration | BB, boundaries         |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | getTransactionsByGroup            | Integration | BB, boundaries         |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | getTransactionsByGroup            | Integration | BB, boundaries         |
| 200 Successful: User route, return array of obj                                                                                                         | getTransactionsByGroupByCategory  | Integration | BB, boundaries         |
| 200 Successful: Admin route, return array of obj                                                                                                        | getTransactionsByGroupByCategory  | Integration | BB, boundaries         |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | getTransactionsByGroupByCategory  | Integration | BB, boundaries         |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | getTransactionsByGroupByCategory  | Integration | BB, boundaries         |
| 200 Successful: User authenticated, correct request                                                                                                     | deleteTransaction                 | Integration | BB, boundaries         |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | deleteTransaction                 | Integration | BB, boundaries         |
| 200 Successful: Admin authenticated, correct request                                                                                                    | deleteTransactions                | Integration | BB, boundaries         |
| 401 error: called by an authenticated user who is not an admin                                                                                          | deleteTransactions                | Integration | BB, boundaries         |
| Tokens are both valid and belong to the requested user                                                                                                  | verifyAuth                        | Integration | BB, boundaries         |
| Undefined tokens                                                                                                                                        | verifyAuth                        | Integration | BB, boundaries         |
| Access token expired and refresh token belonging to the requested user                                                                                  | verifyAuth                        | Integration | BB, boundaries         |
| Access token expired and refresh token belonging to the requested admin                                                                                 | verifyAuth                        | Integration | BB, boundaries         |

# Coverage

## Coverage of FR

 

| Tests                                                                                                                                                   | Functional Requirement covered |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Admin: should return empty list if there are no users                                                                                                   | FR15                           |
| User access empty list :  should return an Error                                                                                                        | FR15                           |
| Admin: should retrieve list of all users                                                                                                                | FR15                           |
| User access to other user, error                                                                                                                        | FR16                           |
| Admin access to other user, retrieve data                                                                                                               | FR16                           |
| User access to him, retrieve data                                                                                                                       | FR16                           |
| Admin access to unknown user, error                                                                                                                     | FR16                           |
| User create a group without name, error                                                                                                                 | FR21                           |
| User (not yet in a group) create a group without userEmail, succeed                                                                                     | FR21                           |
| User (not yet in a group) create a group with empty userEmail, error                                                                                    | FR21                           |
| User  create a group without all the attributes,error                                                                                                   | FR21                           |
| User (yet in a group) create a group without userEmail, error                                                                                           | FR21                           |
| User create a group with unknown userEmail, succeed                                                                                                     | FR21                           |
| User create a group with a userEmail already in a group and unknown, retrieve the data                                                                  | FR21                           |
| User create a group with the same name than an other, error                                                                                             | FR21                           |
| User create a group with incorrect email, error                                                                                                         | FR21                           |
| Admin: should return empty list if there are no groups                                                                                                  | FR22                           |
| User access empty list :  should return an Error                                                                                                        | FR22                           |
| Admin: should retrieve list of all groups                                                                                                               | FR22                           |
| User access to other group, error                                                                                                                       | FR23                           |
| User access to group with empty name, error                                                                                                             | FR23                           |
| Admin access to group with empty name, error                                                                                                            | FR23                           |
| Admin access to other group, retrieve data                                                                                                              | FR23                           |
| User access to his group, retrieve data                                                                                                                 | FR23                           |
| Admin access to unknown group, error                                                                                                                    | FR23                           |
| User add a user in a group without name, error                                                                                                          | FR24                           |
| User add nobody in his group, error                                                                                                                     | FR24                           |
| User add an unknown userEmail in his group, error                                                                                                       | FR24                           |
| User add a userEmail in his group, retrieve the data                                                                                                    | FR24                           |
| User add multiple userEmails in his group, retrieve the data                                                                                            | FR24                           |
| User add useEmails already in his group, in his group, error                                                                                            | FR24                           |
| User add useEmail in an other group, error                                                                                                              | FR24                           |
| Admin add an unknown userEmail in his group, error                                                                                                      | FR24                           |
| Admin add a userEmail unknown, error                                                                                                                    | FR24                           |
| Admin add a userEmail in an other group, retrieve the data                                                                                              | FR24                           |
| Admin add nobody in his group, error                                                                                                                    | FR24                           |
| Admin add a user in a group without name, error                                                                                                         | FR24                           |
| user remove a userEmail from his group without name, error                                                                                              | FR26                           |
| user remove a userEmail unknown from his group, error                                                                                                   | FR26                           |
| user remove a userEmail not in the group from his group, error                                                                                          | FR26                           |
| user remove a userEmail  from his group, retrieve data                                                                                                  | FR26                           |
| user remove a userEmail unknow, not in the group and known,  from his group, retrieve data                                                              | FR26                           |
| user remove a userEmail  from an other group, error                                                                                                     | FR26                           |
| user remove a userEmail  from a group unknown, error                                                                                                    | FR26                           |
| user remove a userEmail  from a group empty, error                                                                                                      | FR26                           |
| user remove too much useremail in  his group, retrieve data                                                                                             | FR26                           |
| Admin remove a userEmail from his group without name, error                                                                                             | FR26                           |
| Admin remove a userEmail unknown from a group, error                                                                                                    | FR26                           |
| Admin remove a userEmail  from a group, retrieve data                                                                                                   | FR26                           |
| Admin remove a userEmail unknow, not in the group and known,  from his group, retrieve data                                                             | FR26                           |
| Admin his username  from his group, alone, error                                                                                                        | FR26                           |
| Admin remove a userEmail  from a group unknown, error                                                                                                   | FR26                           |
| Admin remove too much useremail in  his group, retrieve data                                                                                            | FR26                           |
| user delete his group, error                                                                                                                            | FR28                           |
| Admin delete his group, succeed                                                                                                                         | FR28                           |
| Admin delete a group unknown, error                                                                                                                     | FR28                           |
| Admin delete a group with name empty, error                                                                                                             | FR28                           |
| Admin delete a user unknown, error                                                                                                                      | FR17                           |
| Admin delete an incorrect email, error                                                                                                                  | FR17                           |
| Admin delete a user alone in a group, retrieve data                                                                                                     | FR17                           |
| Register with username and email unique, succeed                                                                                                        | FR11                           |
| Register with username unique and email multiple, error                                                                                                 | FR11                           |
| Register with username multiple and email unique, error                                                                                                 | FR11                           |
| Register with email incorrect                                                                                                                           | FR11                           |
| Register with name empty,error                                                                                                                          | FR11                           |
| Register with username and email unique, succeed                                                                                                        | FR14                           |
| Register with username unique and email multiple, error                                                                                                 | FR14                           |
| Register with username multiple and email unique, error                                                                                                 | FR14                           |
| Register with email incorrect                                                                                                                           | FR14                           |
| Register with name empty, error                                                                                                                         | FR14                           |
| login with userEmail known and password correct, succeed                                                                                                | FR12                           |
| login with userEmail unknown and password wrong, error                                                                                                  | FR12                           |
| login with userEmail known and password wrong, error                                                                                                    | FR12                           |
| logout with refreshToken correct, succeed                                                                                                               | FR12                           |
| logout with refreshToken empty, error                                                                                                                   | FR12                           |
| logout with refreToken unknown, error                                                                                                                   | FR12                           |
| 400 error if the request body does  contain an empty array                                                                                              | FR43                           |
| 400 error if the request body does not contain an array                                                                                                 | FR43                           |
| 400 error if the request body does not contain all the necessary attributes                                                                             | FR43                           |
| Admin authenticated, successful deletion 200 with data response                                                                                         | FR43                           |
| 400 error, one of the types in the array is an empty string                                                                                             | FR43                           |
| 400 error, at least one of the types in the array does not represent a category in the database                                                         | FR43                           |
| 401 error, called by an authenticated user who is not an admin                                                                                          | FR43                           |
| 200 Successful deletion, attribute message and count                                                                                                    | FR43                           |
| Successful: Admin authenticated, correct request, returns a message for confirmation and the number of updated transactions                             | FR42                           |
| Returns a 401 error if called by a user who is not an Admin"                                                                                            | FR42                           |
| Error: Admin authenticated, but request body does not contain all the necessary attributes                                                              | FR42                           |
| Error: Admin authenticated, but at least one of the parameters in the request body is an empty string                                                   | FR42                           |
| Error: Admin authenticated, but the type of category passed in the request body as the new type represents an already existing category in the database | FR42                           |
| Error: Admin authenticated,but the type of category passed as a route parameter does not represent a category in the database                           | FR42                           |
| 200 Succesful creation of category                                                                                                                      | FR41                           |
| 400 error: request body does not contain all the necessary attributes                                                                                   | FR41                           |
| 400 error: at least one of the parameters in the request body is an empty string                                                                        | FR41                           |
| 401 error: called by an authenticated user who is not an admin                                                                                          | FR41                           |
| 200 Successful: User authenticated, correct request                                                                                                     | FR31                           |
| 400 error: the request body does not contain all the necessary attributes                                                                               | FR31                           |
| 400 error: at least one of the parameters in the request body is an empty string                                                                        | FR31                           |
| 400 error: the type of category passed in the request body does not represent a category in the database                                                | FR31                           |
| 400 error: the username passed in the request body is not equal to the one passed as a route parameter                                                  | FR31                           |
| 400 error:  the username passed in the request body does not represent a user in the database                                                           | FR31                           |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | FR31                           |
| 400 error: the amount passed in the request body cannot be parsed as a floating value                                                                   | FR31                           |
| 200 succesful operation, admin authenticated                                                                                                            | FR31                           |
| 401 called by an authenticated user who is not an admin                                                                                                 | FR31                           |
| 200 Successful: User authenticated, correct request, response data correct                                                                              | FR37                           |
| 400 error: User authenticated, the `_id` in the request body does not represent a transaction in the databas                                            | FR37                           |
| 400 error: User authenticated, the request body does not contain all the necessary attributes                                                           | FR37                           |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | FR37                           |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | FR37                           |
| 200 Successful: Admin authenticated, correct request, response data correct                                                                             | FR38                           |
| 400 error: request body does not contain all the necessary attributes                                                                                   | FR38                           |
| 400 error: at least one of the ids in the array is an empty string                                                                                      | FR38                           |
| 400 error: at least one of the ids in the array does not represent a transaction in the database                                                        | FR38                           |
| 401 error: called by an authenticated user who is not an admin                                                                                          | FR38                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR33                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR33                           |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | FR33                           |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | FR33                           |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | FR33                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR34                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR34                           |
| 400 error: the username passed as a route parameter does not represent a user in the database                                                           | FR34                           |
| 400 error: the category passed as a route parameter does not represent a category in the database                                                       | FR34                           |
| 401 error: called by an authenticated user who is not the same user as the one in the user route                                                        | FR34                           |
| 401 error: called by an authenticated user who is not an admin in an admin route                                                                        | FR34                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR35                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR35                           |
| 400 errror: group name passed as a route parameter does not represent a group in the database                                                           | FR35                           |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | FR35                           |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | FR35                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR36                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR36                           |
| 400 errror: group name passed as a route parameter does not represent a group in the database                                                           | FR36                           |
| 400 errror: category passed as a route parameter does not represent a category in the database                                                          | FR36                           |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | FR36                           |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | FR36                           |
| Admin: should retrieve list of all users                                                                                                                | FR15                           |
| User: should retrieve list of all users                                                                                                                 | FR15                           |
| Admin access to other user, retrieve data                                                                                                               | FR15                           |
| User access to him, retrieve data                                                                                                                       | FR16                           |
| User access to other user, error                                                                                                                        | FR16                           |
| Admin access to unknown, error                                                                                                                          | FR16                           |
| Admin create a group whitout him, succeed                                                                                                               | FR21                           |
| Admin create a group alone, error                                                                                                                       | FR21                           |
| Admin create two groups , error                                                                                                                         | FR21                           |
| Admin create a group whitout name, error                                                                                                                | FR21                           |
| Admin not authenticated, error                                                                                                                          | FR21                           |
| Admin : list of group                                                                                                                                   | FR22                           |
| Admin : list of group empty                                                                                                                             | FR22                           |
| User : error                                                                                                                                            | FR22                           |
| Admin acces to a group : retrieve data                                                                                                                  | FR23                           |
| Admin acces to a group unknown : erro                                                                                                                   | FR23                           |
| user acces to his group : retrieve data                                                                                                                 | FR23                           |
| user acces to an other group : error                                                                                                                    | FR23                           |
| Admin add a userEmail in his group, retrieve the data                                                                                                   | FR24                           |
| Admin add a userEmail already present in his group, error                                                                                               | FR24                           |
| Admin add a userEmail unknown in his group, error                                                                                                       | FR24                           |
| User add a userEmail already present in his group, error                                                                                                | FR24                           |
| User add a userEmail in his group, succeed                                                                                                              | FR24                           |
| Admin delete a userEmail in his group, succeed                                                                                                          | FR25                           |
| User delete a userEmail in his group, succeed                                                                                                           | FR25                           |
| User delete a userEmail unknown, error                                                                                                                  | FR25                           |
| User delete a userEmail not in his group, error                                                                                                         | FR25                           |
| Admin delete a user not in a group, without transactions, succeed                                                                                       | FR16                           |
| Admin delete a user in a group, without transactions, succeed                                                                                           | FR16                           |
| Admin delete a user not in a group, transactions, succeed                                                                                               | FR16                           |
| User delete a admin not in a group, without transactions, error                                                                                         | FR16                           |
| Admin delete a user unknown, error                                                                                                                      | FR16                           |
| Admin delete a  group, succeed                                                                                                                          | FR28                           |
| Admin delete a  group unknows, succeed                                                                                                                  | FR28                           |
| User delete a  group, error                                                                                                                             | FR28                           |
| Register, succeed                                                                                                                                       | FR11                           |
| Register with username empty, error                                                                                                                     | FR11                           |
| Register, succeed                                                                                                                                       | FR14                           |
| Register with username empty, error                                                                                                                     | FR14                           |
| logging, error                                                                                                                                          | FR12                           |
| logout, succeed                                                                                                                                         | FR13                           |
| 200 succesful creation of category                                                                                                                      | FR41                           |
| error 400: the type of category passed in the request body represents an already existing category in the database                                      | FR41                           |
| error 401: called by an authenticated user who is not an admin                                                                                          | FR41                           |
| 200 succesful: Returns a message for confirmation and the number of updated transactions                                                                | FR42                           |
| 400 error: the type of the new category is the same as one that exists already and that category is not the requested one                               | FR42                           |
| 400 error: the request body does not contain all the necessary parameters                                                                               | FR42                           |
| 401 error: called by a user who is not an Admin                                                                                                         | FR42                           |
| 200 Successful deletion, attribute message and count                                                                                                    | FR43                           |
| 401 error called by an authenticated user who is not an admin                                                                                           | FR43                           |
| 200 user authenticated, succesful get categories                                                                                                        | FR44                           |
| 401 error: user not authenticated                                                                                                                       | FR44                           |
| 200 Successful: User authenticated, correct request                                                                                                     | FR32                           |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | FR32                           |
| 200 succesful operation, admin authenticated                                                                                                            | FR33                           |
| 401 called by an authenticated user who is not an admin                                                                                                 | FR34                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR35                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR35                           |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | FR35                           |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | FR35                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR34                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR34                           |
| 401 error: Admin route, called by an authenticated user who is not an admin                                                                             | FR34                           |
| 401 error: User route, authenticated user who is not the same user as the one in the route                                                              | FR34                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR35                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR35                           |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | FR35                           |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | FR35                           |
| 200 Successful: User route, return array of obj                                                                                                         | FR36                           |
| 200 Successful: Admin route, return array of obj                                                                                                        | FR36                           |
| 401 error: user route called by an authenticated user who is not part of the group                                                                      | FR36                           |
| 401 error: admin route called by an authenticated user who is not an admin                                                                              | FR36                           |
| 200 Successful: User authenticated, correct request                                                                                                     | FR37                           |
| 401 error: called by an authenticated user who is not the same user as the one in the route parameter                                                   | FR37                           |
| 200 Successful: Admin authenticated, correct request                                                                                                    | FR38                           |
| 401 error: called by an authenticated user who is not an admin                                                                                          | FR38                           |

## Coverage white box

 
   ![](jest-coverage.png)