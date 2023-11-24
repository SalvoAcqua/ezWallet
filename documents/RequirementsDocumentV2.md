# Requirements Document - future EZWallet

Date: 

Version: V2 - description of EZWallet in FUTURE form (as proposed by the team)

| Version number | Change |
| -------------- |:------ |
| V2.0           |        |

# Contents

- [Requirements Document - future EZWallet](#requirements-document---future-ezwallet)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
    - [Table of access rights](#table-of-access-rights)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, UC1: Registration Account](#use-case-1-uc1-registration-account)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
    - [Use case 2, UC2: Login](#use-case-2-uc2-login)
      - [Scenario 2.1](#scenario-21)
      - [Scenario 2.2](#scenario-22)
    - [Use case 3, UC3: Logout](#use-case-3-uc3-logout)
      - [Scenario 3.1](#scenario-31)
    - [Use case 4, UC4: Recover Password](#use-case-4-uc4-recover-password)
      - [Scenario 4.1](#scenario-41)
      - [Scenario 4.2](#scenario-42)
    - [Use case 5, UC5: Create Category](#use-case-5-uc5-create-category)
      - [Scenario 5.1](#scenario-51)
    - [Use case 6, UC6: Get Categories](#use-case-6-uc6-get-categories)
      - [Scenario 6.1](#scenario-61)
    - [Use case 7, UC7: Delete Category](#use-case-7-uc7-delete-category)
      - [Scenario 7.1](#scenario-71)
    - [Use case 8, UC8: Create Transaction](#use-case-8-uc8-create-transaction)
      - [Scenario 8.1](#scenario-81)
    - [Use case 9, UC9: Get Transactions](#use-case-9-uc9-get-transactions)
      - [Scenario 9.1](#scenario-91)
    - [Use case 10, UC10: Delete Transaction](#use-case-10-uc10-delete-transaction)
      - [Scenario 10.1](#scenario-101)
    - [Use case 11, UC11: Get Labels](#use-case-11-uc11-get-labels)
      - [Scenario 11.1](#scenario-111)
    - [Use case 12, UC12: Get All Users](#use-case-12-uc12-get-all-users)
      - [Scenario 12.1](#scenario-121)
    - [Use case 13, UC13: Get user by username](#use-case-13-uc13-get-user-by-username)
      - [Scenario 13.1](#scenario-131)
    - [Use case 14, UC14: Delete User](#use-case-14-uc14-delete-user)
      - [Scenario 14.1](#scenario-141)
      - [Scenario 14.2](#scenario-142)
      - [Scenario 14.3](#scenario-143)
    - [Use case 15, UC15: Change User Password](#use-case-15-uc15-change-user-password)
      - [Scenario 15.1](#scenario-151)
    - [Use case 16, UC16: Create Group](#use-case-16-uc16-create-group)
      - [Scenario 16.1](#scenario-161)
    - [Use case 17, UC17: Get all Groups](#use-case-17-uc17-get-all-groups)
      - [Scenario 17.1](#scenario-171)
    - [Use case 18, UC18: Get groups enrolled by a specific user](#use-case-18-uc18-get-groups-enrolled-by-a-specific-user)
      - [Scenario 18.1](#scenario-181)
    - [Use case 19, UC19: Delete Group](#use-case-19-uc19-delete-group)
      - [Scenario 19.1](#scenario-191)
    - [Use case 20, UC20: Delete member](#use-case-20-uc20-delete-member)
      - [Scenario 20.1](#scenario-201)
    - [Use case 21, UC21: Exit Group](#use-case-21-uc21-exit-group)
      - [Scenario 21.1](#scenario-211)
      - [Scenario 21.2](#scenario-212)
        - [Use case 22, UC22: Promote a member to GroupManager](#use-case-22-uc22-promote-a-member-to-groupmanager)
      - [Scenario 22.1](#scenario-221)
    - [Use case 23, UC23: Modify monthly budget](#use-case-23-uc23-modify-monthly-budget)
      - [Scenario 23.1](#scenario-231)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

EZWallet (read EaSy Wallet) is a software application designed to help individuals and families keep track of their expenses. Users can enter and categorize their expenses, allowing them to quickly see where their money is going. EZWallet is a powerful tool for those looking to take control of their finances and make informed decisions about their spending.

The access to the application is free, but users must watch ads. 

EzWallet is supported currently just by browser application, accessible via PC.

# Stakeholders

| Stakeholder name | Description                                                                              |
| ---------------- |:----------------------------------------------------------------------------------------:|
| StandardUser     | Uses EzWallet to manage transactions, categories and set monthly budget                  |
| GroupManager     | Manages a group, transactions and categories                                             |
| Admin            | Manages the application, can administrate existing groups and users                      |
| GoogleAds        | EzWallet hosts advertisements which pay off the application which can be accessed freely |

# Context Diagram and interfaces

## Context Diagram

![](2023-04-23-16-12-07.png)

## Interfaces

| Actor        | Logical Interface     | Physical Interface            |
| ------------ |:---------------------:| -----------------------------:|
| StandardUser | Web GUI               | Screen, keyboard, mouse on PC |
| GroupManager | Web GUI               | Screen, keyboard, mouse on PC |
| Admin        | Web GUI               | Screen, keyboard, mouse on PC |
| GoogleAds    | Google Ad Manager API | Internet link                 |

# Stories and personas

Few personas are described in the following paragraph covering the Standard User profile.

- Persona 1 : student, male , 24 yo
  
  - Story: Student in Erasmus, need to <u>save </u> money, he cannot spend more than what the european scolarship gives him.

- Persona 2: lawyer, female, married, with children, 40 yo
  
  - Story: Need to <u>track </u> all expenses and bank investments, organising them by different member of the <u>family</u>.

- Persona 3: young professional, female, 30 yo
  
  - Story: Going on holiday with friends, wants to keep track of all <u>group expenses </u>in order to split the account at the end of the journey.

- Persona 4: finance broker, male, 45 yo
  
  - Story: Need to have an intuitive GUI to <u>display clearly</u> the various <u>investments</u> that he makes daily.

# Functional and non functional requirements

## Functional Requirements

| ID    | Description                                       |
|:----- |:-------------------------------------------------:|
| FR1   | Authorization and authentication                  |
| FR1.1 | Registration account                              |
| FR1.2 | Login                                             |
| FR1.3 | Logout                                            |
| FR1.4 | Refresh Token                                     |
| FR1.5 | Recover Password                                  |
| FR2   | Handle categories                                 |
| FR2.1 | Create category                                   |
| FR2.2 | Get categories                                    |
| FR2.3 | Delete category                                   |
| FR3   | Handle transactions                               |
| FR3.1 | Create transaction                                |
| FR3.2 | Get transactions                                  |
| FR3.3 | Delete transaction                                |
| FR4   | Get labels                                        |
| FR5   | Handle users                                      |
| FR5.1 | Get all Users                                     |
| FR5.2 | Get user by username                              |
| FR5.3 | Delete user                                       |
| FR5.4 | Change user password                              |
| FR6   | Handle groups                                     |
| FR6.1 | Create Group of users                             |
| FR6.2 | Get all groups                                    |
| FR6.3 | Get groups enrolled by a specific user            |
| FR6.4 | Delete group                                      |
| FR6.5 | Delete member of a group                          |
| FR6.6 | Exit group                                        |
| FR6.7 | Promote a member to GroupManager                  |
| FR6.8 | Split expenses equally between members of a group |
| FR7   | Handle monthly budget. Set or modify              |
| FR8   | Manage advertisements                             |
| FR8.1 | Show advertisements                               |
| FR8.2 | Receive and Update advertisements                 |

#### Table of access rights

|         | StandardUser            | GroupManager            | Admin | GoogleAds |
| ------- | ----------------------- | ----------------------- | ----- | --------- |
| FR1.ALL | yes                     | yes                     | yes   | no        |
| FR2.ALL | yes                     | yes                     | yes   | no        |
| FR3.ALL | yes                     | yes                     | yes   | no        |
| FR4     | yes                     | yes                     | yes   | no        |
| FR5.1   | no                      | no                      | yes   | no        |
| FR5.2   | yes (user x for user x) | yes (user x for user x) | yes   | no        |
| FR5.3   | yes(user x for user x)  | yes(user x for user x)  | yes   | no        |
| FR5.4   | yes(user x for user x)  | yes(user x for user x)  | yes   | no        |
| FR6.1   | yes                     | yes                     | yes   | no        |
| FR6.2   | no                      | no                      | yes   | no        |
| FR6.3   | yes(user x for user x)  | yes(user x for user x)  | yes   | no        |
| FR6.4   | no                      | yes                     | yes   | no        |
| FR6.5   | no                      | yes                     | yes   | no        |
| FR6.6   | yes                     | yes                     | yes   | no        |
| FR6.7   | no                      | yes                     | yes   | no        |
| FR7     | yes                     | yes                     | yes   | no        |
| FR8.ALL | no                      | no                      | no    | yes       |

## Non Functional Requirements

| ID   | Type (efficiency, reliability, ..) | Description                                                                                   | Refers to |
| ---- |:----------------------------------:|:---------------------------------------------------------------------------------------------:| ---------:|
| NFR1 | Usability                          | No training time should be necessary for people who have used computers for at least 5 months | ALL FR    |
| NFR2 | Efficiency                         | All operations should be performed in less than 500ms                                         | ALL FR    |
| NFR3 | Availability                       | Max server downtime 5H/year                                                                   | ALL FR    |
| NFR4 | Portability                        | Application should be accessible by Google chrome, Mozilla Firefox and Safari browsers        | ALL FR    |
| NFR5 | Privacy                            | All user's data should be of his property only (GDPR)                                         | ALL FR    |

# Use case diagram and use cases

## Use case diagram

![](2023-04-28-15-04-11.png)

### Use case 1, UC1: Registration Account

| Actors Involved  | StandardUser                                                                                                                        |
| ---------------- |:-----------------------------------------------------------------------------------------------------------------------------------:|
| Precondition     |                                                                                                                                     |
| Post condition   | User is registered                                                                                                                  |
| Nominal Scenario | User creates an account with an email that system has never registered before                                                       |
| Variants         |                                                                                                                                     |
| Exceptions       | User, trying to create an account, uses an email that already exists or inserts a passaword that doesn't match the required pattern |

##### Scenario 1.1

| Scenario 1.1   | Successful Registration                                                                                                                                        |
| -------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                                                                                |
| Post condition | User U is registered                                                                                                                                           |
| Step#          | Description                                                                                                                                                    |
| 1              | User U starts the Registration procedure by selecting the item "Register here" in the "Login" screen                                                           |
| 2              | System shows up the "Sign Up" screen where U can enter all the required data                                                                                   |
| 3              | U fills form and goes ahead to submit                                                                                                                          |
| 4              | System, interacting with DB, checks the correctness of fields and whether an account with the same email already exists. In that case it creates a new account |
| 5              | System shows up the "Login" screen and a message to communicate the creation of the account                                                                    |

##### Scenario 1.2

| Scenario 1.2   | Rejected Registration                                                                                |
| -------------- |:----------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                      |
| Post condition | User U doesn't complete the registration                                                             |
| Step#          | Description                                                                                          |
| 1              | User U starts the Registration procedure by selecting the item "Register here" in the "Login" screen |
| 2              | System shows up the "Sign Up" screen where U can enter all the required data                         |
| 3              | U fills form and goes ahead to submit                                                                |
| 4              | System, interacting with DB, checks the correctness and shows up the "Login" screen                  |
| 5              | If an account with the same email already exists, it shows up an error message                       |

### Use case 2, UC2: Login

| Actors Involved  | StandardUser                          |
| ---------------- |:-------------------------------------:|
| Precondition     | User is not authenticated             |
| Post condition   | User is authenticated                 |
| Nominal Scenario | User uses right credentials to log in |
| Variants         |                                       |
| Exceptions       | User uses wrong credentials           |

##### Scenario 2.1

| Scenario 2.1   | Successful Login                                                                                                         |
| -------------- |:------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U is not authenticated                                                                                              |
| Post condition | User U is authenticated                                                                                                  |
| Step#          | Description                                                                                                              |
| 1              | User U starts the Login procedure by filling the form in the "Login" screen                                              |
| 2              | U goes ahead to submit                                                                                                   |
| 3              | System, interacting with DB, checks credentials and, if they are correct, allows U to proceed showing up the "Home Page" |

##### Scenario 2.2

| Scenario 2.2   | Rejected Login                                                                                    |
| -------------- |:-------------------------------------------------------------------------------------------------:|
| Precondition   | User U is not authenticated                                                                       |
| Post condition | User U is still not authenticated                                                                 |
| Step#          | Description                                                                                       |
| 1              | User U starts the Login procedure by filling the form in the "Login" screen                       |
| 2              | U goes ahead to submit                                                                            |
| 3              | System, interacting with DB, checks credentials and, if they are wrong, shows up an error message |

### Use case 3, UC3: Logout

| Actors Involved  | StandardUser              |
| ---------------- |:-------------------------:|
| Precondition     | User is authenticated     |
| Post condition   | User is not authenticated |
| Nominal Scenario | User logs out             |
| Variants         |                           |
| Exceptions       |                           |

##### Scenario 3.1

| Scenario 3.1   | Logout                                                                     |
| -------------- |:--------------------------------------------------------------------------:|
| Precondition   | User U is authenticated                                                    |
| Post condition | User U is not authenticated                                                |
| Step#          | Description                                                                |
| 1              | User U starts the Logout procedure by selecting the item "Logout"          |
| 2              | System shows up a message asking user whether he is sure to log out or not |
| 3              | If U selects "Yes", System logs the user out and shows the "Login" screen  |

### Use case 4, UC4: Recover Password

| Actors Involved  | Standard User                                                                                                                                      |
| ---------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition     | User is not authenticated                                                                                                                          |
| Post condition   | User is authenticated                                                                                                                              |
| Nominal Scenario | User recovers password populating fields with rights values                                                                                        |
| Variants         |                                                                                                                                                    |
| Exceptions       | User, trying to recover the password, uses wrong credentials for username and email or inserts a passaword that doesn't match the required pattern |

##### Scenario 4.1

| Scenario 4.1   | Successful Recover Password                                                                                    |
| -------------- |:--------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U is not authenticated                                                                                    |
| Post condition | User U is authenticated                                                                                        |
| Step#          | Description                                                                                                    |
| 1              | User U starts the Recover Password procedure by selecting the item "Forgot the password" in the "Login" screen |
| 2              | System shows up a screen with a form that U has to complete inserting username and email                       |
| 3              | U fills the form and goes ahead to submit                                                                      |
| 4              | System, interacting with DB, checks the correctness and send an email to U                                     |
| 5              | U receives the email and, following the link, he is redirected to "Change Password" page                       |
| 6              | System shows up a form where U can enter the new password                                                      |
| 7              | U has to retype the new password                                                                               |
| 8              | System checks the correctness of the new password and finally it updates DB and shows up the "Home Page"       |

##### Scenario 4.2

| Scenario 4.2   | Rejected Recover Password                                                                                      |
| -------------- |:--------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U is not authenticated                                                                                    |
| Post condition | User U is still not authenticated                                                                              |
| Step#          | Description                                                                                                    |
| 1              | User U starts the Recover Password procedure by selecting the item "Forgot the password" in the "Login" screen |
| 2              | System shows up a screen with a form that U has to complete inserting username and email                       |
| 3              | U fills the form and goes ahead to submit                                                                      |
| 4              | System, interacting with DB, checks username and email and, if they are wrong, shows up an error message       |

### Use case 5, UC5: Create Category

| Actors Involved  | StandardUser                                       |
| ---------------- |:--------------------------------------------------:|
| Precondition     | System shows up the "Categories" screen            |
| Post condition   | A new category is inserted into DB                 |
| Nominal Scenario | User creates a new category populating its flields |
| Variants         |                                                    |
| Exceptions       |                                                    |

##### Scenario 5.1

| Scenario 5.1   | Create Categories                                                                          |
| -------------- |:------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Categories" screen                                                    |
| Post condition | A new category is inserted into DB                                                         |
| Step#          | Description                                                                                |
| 1              | User U selects the "Add category" item                                                     |
| 2              | System shows a form where U can enter type and color of the new category                   |
| 3              | U fills the form and goes ahead to submit                                                  |
| 4              | System stores data into DB and shows a message to communicate the result of this procedure |
| 5              | U closes the message                                                                       |
| 6              | System shows up the "Categories" screen                                                    |

### Use case 6, UC6: Get Categories

| Actors Involved  | StandardUser                       |
| ---------------- |:----------------------------------:|
| Precondition     | User must be logged in             |
| Post condition   | The "Categories" screen is showed  |
| Nominal Scenario | System shows up all the categories |
| Variants         |                                    |
| Exceptions       |                                    |

##### Scenario 6.1

| Scenario 6.1   | Get Categories                                                                                         |
| -------------- |:------------------------------------------------------------------------------------------------------:|
| Precondition   | User U must be logged in                                                                               |
| Post condition | The "Categories" screen is showed                                                                      |
| Step#          | Description                                                                                            |
| 1              | User U selects the "Categories" item                                                                   |
| 2              | System, interacting with DB, retrieves all the categories and shows them into the "Categories " screen |

### Use case 7, UC7: Delete Category

| Actors Involved  | StandardUser                                              |
| ---------------- |:---------------------------------------------------------:|
| Precondition     | System shows up the "Categories" screen                   |
| Post condition   | The selected category is no longer present in the DB      |
| Nominal Scenario | User deletes a category and all the relative transactions |
| Variants         |                                                           |
| Exceptions       |                                                           |

##### Scenario 7.1

| Scenario 7.1   | Delete Category                                                                                                                                               |
| -------------- |:-------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Categories" screen                                                                                                                       |
| Post condition | The selected category is no longer present in the DB                                                                                                          |
| Step#          | Description                                                                                                                                                   |
| 1              | User U selects the category C that he wants to delete                                                                                                         |
| 2              | System shows a menu that allows U to modify or delete C                                                                                                       |
| 3              | U selects the "Delete category" item                                                                                                                          |
| 4              | System shows up a message asking U whether he is sure to delete C and all the associated transactions or not                                                  |
| 5              | If U selects "Yes", System deletes C from DB. Then it deletes all the associated transactions and shows a message to communicate the result of this procedure |
| 6              | U closes the message                                                                                                                                          |
| 7              | System shows up the "Categories" screen                                                                                                                       |

### Use case 8, UC8: Create Transaction

| Actors Involved  | StandardUser                                          |
| ---------------- |:-----------------------------------------------------:|
| Precondition     | System shows up the "Transactions" screen             |
| Post condition   | A new transaction is inserted into DB                 |
| Nominal Scenario | User creates a new transaction populating its flields |
| Variants         |                                                       |
| Exceptions       |                                                       |

##### Scenario 8.1

| Scenario 8.1   | Create Transaction                                                                                                                          |
| -------------- |:-------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Transactions" screen                                                                                                   |
| Post condition | A new transaction is inserted into DB                                                                                                       |
| Step#          | Description                                                                                                                                 |
| 1              | User U selects the "Add a Transaction" item in the "indvidual" mode or "Group X" mode                                                       |
| 2              | System shows a form where U can enter name, type, amount and date of the new transaction                                                    |
| 3              | U fills the form and goes ahead to submit                                                                                                   |
| 4              | System stores data in the DB (adding some extra-information about the mode) and shows a message to communicate the result of this procedure |
| 5              | U closes the message                                                                                                                        |
| 6              | System shows up the "Transactions" screen                                                                                                   |

### Use case 9, UC9: Get Transactions

| Actors Involved  | StandardUser                         |
| ---------------- |:------------------------------------:|
| Precondition     | User must be logged in               |
| Post condition   | The "Transactions" screen is showed  |
| Nominal Scenario | System shows up all the transactions |
| Variants         |                                      |
| Exceptions       |                                      |

##### Scenario 9.1

| Scenario 9.1   | Get Transactions                                                                                                                                                             |
| -------------- |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U must be logged in                                                                                                                                                     |
| Post condition | The "Transactions" screen is showed                                                                                                                                          |
| Step#          | Description                                                                                                                                                                  |
| 1              | User U selects the "Transactions" item                                                                                                                                       |
| 2              | System, interacting with DB, retrieves all the transactions of U (and also all the transactions of groups where U is enrolled) and shows them into the "Transactions" screen |

### Use case 10, UC10: Delete Transaction

| Actors Involved  | StandardUser                                            |
| ---------------- |:-------------------------------------------------------:|
| Precondition     | System shows up the "Transactions" screen               |
| Post condition   | The selected transaction is no longer present in the DB |
| Nominal Scenario | User deletes a transaction                              |
| Variants         |                                                         |
| Exceptions       |                                                         |

##### Scenario 10.1

| Scenario 10.1  | Delete Transaction                                                                                           |
| -------------- |:------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Transactions" screen                                                                    |
| Post condition | The selected transaction is no longer present in the DB                                                      |
| Step#          | Description                                                                                                  |
| 1              | User U selects the "Delete transaction" item relative to the transaction T that he wants to delete           |
| 2              | System shows up a message asking U whether he is sure to delete the transaction T or not                     |
| 3              | If U selects "Yes", System deletes T from DB and shows a message to communicate the result of this procedure |
| 4              | U closes the message                                                                                         |
| 5              | System shows up the "Transactions" screen                                                                    |

### Use case 11, UC11: Get Labels

| Actors Involved  | StandardUser                        |
| ---------------- |:-----------------------------------:|
| Precondition     | User must be logged in              |
| Post condition   | The "Transactions" screen is showed |
| Nominal Scenario | System shows up all the labels      |
| Variants         |                                     |
| Exceptions       |                                     |

##### Scenario 11.1

| Scenario 11.1  | Get Labels                                                                                                                    |
| -------------- |:-----------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U must be logged in                                                                                                      |
| Post condition | The "Transactions" screen is showed                                                                                           |
| Step#          | Description                                                                                                                   |
| 1              | User U selects the "Transactions" item                                                                                        |
| 2              | System, interacting with DB, retrieves all the transactions with relative color and shows them into the "Transactions" screen |

### Use case 12, UC12: Get All Users

| Actors Involved  | Admin                         |
| ---------------- |:-----------------------------:|
| Precondition     |                               |
| Post condition   | The "Users" screen is showed  |
| Nominal Scenario | System shows up all the users |
| Variants         |                               |
| Exceptions       |                               |

##### Scenario 12.1

| Scenario 12.1  | Get All Users                                                                                                |
| -------------- |:------------------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                              |
| Post condition | The "Users" screen is showed                                                                                 |
| Step#          | Description                                                                                                  |
| 1              | Admin A selects the "Users" item                                                                             |
| 2              | System, interacting with DB, retrieves all the users and their groups and shows them into the "Users" screen |

### Use case 13, UC13: Get user by username

| Actors Involved  | StandardUser                                       |
| ---------------- |:--------------------------------------------------:|
| Precondition     | User must be logged in                             |
| Post condition   | User data are showed                               |
| Nominal Scenario | System shows up all the information about the User |
| Variants         |                                                    |
| Exceptions       |                                                    |

##### Scenario 13.1

| Scenario 13.1  | Get user by username                                                                                                                                                  |
| -------------- |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U must be logged in                                                                                                                                              |
| Post condition | User data are showed                                                                                                                                                  |
| Step#          | Description                                                                                                                                                           |
| 1              | Every time that "Home Page" has to be displayed (after login or through the "Home" item), System retrieves all the user information and shows them in the "Home page" |

### Use case 14, UC14: Delete User

| Actors Involved  | StandardUser                                                                                                                                                                  |
| ---------------- |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition     | User is authenticated                                                                                                                                                         |
| Post condition   | User doesn't exist anymore in the DB                                                                                                                                          |
| Nominal Scenario | User deletes his own account                                                                                                                                                  |
| Variants         | If User is a GroupManager for one of his groups, the system checks whether there are other GroupManager for those group. Furthermore, Admin can delete account of other users |
| Exceptions       |                                                                                                                                                                               |

##### Scenario 14.1

| Scenario 14.1  | Delete User by Standard User                                                      |
| -------------- |:---------------------------------------------------------------------------------:|
| Precondition   | User U is authenticated                                                           |
| Post condition | User U doesn't exist anymore in the DB                                            |
| Step#          | Description                                                                       |
| 1              | User U selects the item "Delete Account"                                          |
| 2              | System shows up a message asking user whether he is sure to delete or not         |
| 3              | If U selects "Yes", System checks whether U is GroupManager for one of his groups |
| 4              | If U is not a GroupManager, System updates DB removing the account of U           |
| 5              | System shows up the "Login" screen                                                |

##### Scenario 14.2

| Scenario 14.2  | Delete User by Group Manager                                                                                                                       |
| -------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U is authenticated                                                                                                                            |
| Post condition | User U doesn't exist anymore in the DB                                                                                                             |
| Step#          | Description                                                                                                                                        |
| 1              | User U selects the item "Delete Account"                                                                                                           |
| 2              | System shows up a message asking user whether he is sure to delete or not                                                                          |
| 3              | If U selects "Yes", System checks whether U is GroupManager for one of his groups                                                                  |
| 4              | If U is a GroupManager in one (or more) of his groups, System retrieves members and chooses one of them (for each group) promoting to GroupManager |
| 5              | System updates DB removing the account of U                                                                                                        |
| 6              | System shows up the "Login" screen                                                                                                                 |

##### Scenario 14.3

| Scenario 14.3  | Delete User by Admin                                                                                         |
| -------------- |:------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Users" screen                                                                           |
| Post condition | User U doesn't exist anymore in the DB                                                                       |
| Step#          | Description                                                                                                  |
| 1              | Admin A selects the "Delete user" item relative to the user U that he wants to delete                        |
| 2              | System shows up a message asking A whether he is sure to delete the user U or not                            |
| 3              | If A selects "Yes", System deletes U from DB and shows a message to communicate the result of this procedure |
| 4              | Admin A closes the message                                                                                   |
| 5              | System shows up the "Users" screen                                                                           |

### Use case 15, UC15: Change User Password

| Actors Involved  | StandardUser                        |
| ---------------- |:-----------------------------------:|
| Precondition     |                                     |
| Post condition   | The new password is saved in the DB |
| Nominal Scenario | User updates his password           |
| Variants         |                                     |
| Exceptions       |                                     |

##### Scenario 15.1

| Scenario 15.1  | Change User Password                                                                                      |
| -------------- |:---------------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                           |
| Post condition | The new password is saved in the DB                                                                       |
| Step#          | Description                                                                                               |
| 1              | User U selects the item "Change Password"                                                                 |
| 2              | System shows up a screen with a form that user has to complete inserting the old Password and the new one |
| 3              | U fills the form and goes ahead to submit                                                                 |
| 4              | System checks whether the old password is right and verifies the correctness of the new one               |
| 5              | If no errors occur, System updates DB saving the new password                                             |

### Use case 16, UC16: Create Group

| Actors Involved  | StandardUser                                        |
| ---------------- |:---------------------------------------------------:|
| Precondition     | System shows up the "Groups" screen                 |
| Post condition   | A new group is inserted into DB                     |
| Nominal Scenario | User creates a new group populating it with members |
| Variants         |                                                     |
| Exceptions       |                                                     |

##### Scenario 16.1

| Scenario 16.1  | Create Group                                                                                                                             |
| -------------- |:----------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                                                                                      |
| Post condition | A new group is inserted into DB                                                                                                          |
| Step#          | Description                                                                                                                              |
| 1              | User U selects the "Create a new group" item                                                                                             |
| 2              | System shows a form where U can enter the name of the group and the usernames of members that will belongs to that group as StandardUser |
| 3              | U fills the form and goes ahead to submit                                                                                                |
| 3              | System checks if all the usernames specified are present in the DB                                                                       |
| 4              | If usernames exist, System updates DB and shows a message to communicate the result of this procedure                                    |
| 5              | U closes the message                                                                                                                     |
| 6              | System shows up the "Groups" screen                                                                                                      |

### Use case 17, UC17: Get all Groups

| Actors Involved  | Admin                             |
| ---------------- |:---------------------------------:|
| Precondition     |                                   |
| Post condition   | The "All Groups" screen is showed |
| Nominal Scenario | System shows up all the groups    |
| Variants         |                                   |
| Exceptions       |                                   |

##### Scenario 17.1

| Scenario 17.1  | Get all Groups                                                                                    |
| -------------- |:-------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                   |
| Post condition | The "All Groups" screen is showed                                                                 |
| Step#          | Description                                                                                       |
| 1              | Admin A selects the "All Groups" item                                                             |
| 2              | System, interacting with DB, retrieves all the groups and shows them into the "All Groups" screen |

### Use case 18, UC18: Get groups enrolled by a specific user

| Actors Involved  | StandardUser                                    |
| ---------------- |:-----------------------------------------------:|
| Precondition     |                                                 |
| Post condition   | The "Groups" screen is showed                   |
| Nominal Scenario | System shows up all the groups enrolled by User |
| Variants         |                                                 |
| Exceptions       |                                                 |

##### Scenario 18.1

| Scenario 18.1  | Get groups enrolled by a specific user                                                                      |
| -------------- |:-----------------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                             |
| Post condition | The "Groups" screen is showed                                                                               |
| Step#          | Description                                                                                                 |
| 1              | User U selects the "My Groups" item                                                                         |
| 2              | System, interacting with DB, retrieves all the groups enrolled by U and shows them into the "Groups" screen |

### Use case 19, UC19: Delete Group

| Actors Involved  | GroupManager                                      |
| ---------------- |:-------------------------------------------------:|
| Precondition     | System shows up the "Groups" screen               |
| Post condition   | The selected group is no longer present in the DB |
| Nominal Scenario | GroupManager deletes a group                      |
| Variants         |                                                   |
| Exceptions       |                                                   |

##### Scenario 19.1

| Scenario 19.1  | Delete Group                                                                                                  |
| -------------- |:-------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                                                           |
| Post condition | The selected group is no longer present in the DB                                                             |
| Step#          | Description                                                                                                   |
| 1              | GroupManager GM selects the "Delete Group" item relative to the group G that he wants to delete               |
| 2              | System shows up a message asking GM whether he is sure to delete the group G or not                           |
| 3              | If GM selects "Yes", System deletes G from DB and shows a message to communicate the result of this procedure |
| 4              | GM closes the message                                                                                         |
| 5              | System shows up the "Groups" screen                                                                           |

### Use case 20, UC20: Delete member

| Actors Involved  | GroupManager                                                   |
| ---------------- |:--------------------------------------------------------------:|
| Precondition     | System shows up the "Groups" screen                            |
| Post condition   | The selected member is no longer present in the selected group |
| Nominal Scenario | GroupManager deletes a member of a group                       |
| Variants         |                                                                |
| Exceptions       |                                                                |

##### Scenario 20.1

| Scenario 20.1  | Delete member                                                                                                      |
| -------------- |:------------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                                                                |
| Post condition | The selected member is no longer present in the selected group                                                     |
| Step#          | Description                                                                                                        |
| 1              | GroupManager GM selects the group G                                                                                |
| 2              | System shows up all the member belonging to G                                                                      |
| 3              | GM selects the "Delete member" item relative to the member M that he wants to expel                                |
| 4              | System shows up a message asking GM whether he is sure to expel the member M or not                                |
| 5              | If GM selects "Yes", System updates DB expelling M and shows a message to communicate the result of this procedure |
| 6              | GM closes the message                                                                                              |
| 7              | System shows up the "Groups" screen                                                                                |

### Use case 21, UC21: Exit Group

| Actors Involved  | StandardUser                                                                                                      |
| ---------------- |:-----------------------------------------------------------------------------------------------------------------:|
| Precondition     | System shows up the "Groups" screen                                                                               |
| Post condition   | User is not a member of that group anymore                                                                        |
| Nominal Scenario | User exits that group                                                                                             |
| Variants         | If User is a GroupManager for that groups, the system checks whether there are other GroupManager for those group |
| Exceptions       |                                                                                                                   |

##### Scenario 21.1

| Scenario 21.1  | Exit Group by StandardUser                                                       |
| -------------- |:--------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                              |
| Post condition | User is not a member of the group anymore                                        |
| Step#          | Description                                                                      |
| 1              | User U selects the "Exit" item relative to the group G that he wants to leave    |
| 2              | System shows up a message asking U whether he is sure to exit the group G or not |
| 3              | If U selects "Yes", System checks whether U is GroupManager for G                |
| 4              | If U is not a GroupManager, System updates DB removing him from the group        |
| 5              | System shows up the "Groups" screen                                              |

##### Scenario 21.2

| Scenario 21.2  | Exit Group by GroupManager                                                                         |
| -------------- |:--------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                                                |
| Post condition | User is not a member of the group anymore                                                          |
| Step#          | Description                                                                                        |
| 1              | User U selects the "Exit" item relative to the group G that he wants to leave                      |
| 2              | System shows up a message asking U whether he is sure to exit the group G or not                   |
| 3              | If U selects "Yes", System checks whether U is GroupManager for G                                  |
| 4              | If U is a GroupManager, System retrieves members and chooses one of them promoting to GroupManager |
| 5              | System updates DB removing him from G                                                              |
| 6              | System shows up the "Groups" screen                                                                |

#### Use case 22, UC22: Promote a member to GroupManager

| Actors Involved  | GroupManager                                               |
| ---------------- |:----------------------------------------------------------:|
| Precondition     | System shows up the "Groups" screen                        |
| Post condition   | The selected member is GroupManager for the selected group |
| Nominal Scenario | GroupManager promotes a member of a group to GroupManager  |
| Variants         |                                                            |
| Exceptions       |                                                            |

##### Scenario 22.1

| Scenario 22.1  | Promote a member to GroupManager                                                                                                                                     |
| -------------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Groups" screen                                                                                                                                  |
| Post condition | The selected member is GroupManager for the selected group                                                                                                           |
| Step#          | Description                                                                                                                                                          |
| 1              | GroupManager GM selects the group G                                                                                                                                  |
| 2              | System shows up all the member belonging to G                                                                                                                        |
| 3              | GM selects the "Promote" item relative to the member M that he wants to promote (The "Promote" item is available only for members that are not already GroupManager) |
| 4              | System shows up a message asking GM whether he is sure to promote the member M or not                                                                                |
| 5              | If GM selects "Yes", System updates DB promoting M to GroupManager and shows a message to communicate the result of this procedure                                   |
| 6              | GM closes the message                                                                                                                                                |
| 7              | System shows up the "Group" screen                                                                                                                                   |

### Use case 23, UC23: Modify monthly budget

| Actors Involved  | StandardUser                    |
| ---------------- |:-------------------------------:|
| Precondition     | System shows up the "Home Page" |
| Post condition   | New Monthly budget is setted    |
| Nominal Scenario | User modify his Monthly budget  |
| Variants         |                                 |
| Exceptions       |                                 |

##### Scenario 23.1

| Scenario 23.1  | Modify monthly budget                                           |
| -------------- |:---------------------------------------------------------------:|
| Precondition   | System shows up the "Home Page"                                 |
| Post condition | New Monthly budget is setted                                    |
| Step#          | Description                                                     |
| 1              | User U selects the "Modify budget" item                         |
| 2              | System shows up a field where U can enter a new value of budget |
| 3              | U fills the field and goes ahead to submit                      |
| 4              | System updates DB storing the new value of Monthly budget       |

# Glossary

![](2023-04-27-18-38-23.png)

The attribute role of "Belonging" can assume the following values: GroupManager, StandardUser.

The attribute idGroup of "Transaction" can represent the id of the corresponding group or if null it means that the transaction is individual.

# System Design

![](System_Design_-_V2.jpg)

# Deployment Diagram

![](Deployment_-_V2.jpg)
