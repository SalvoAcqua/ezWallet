# Requirements Document - current EZWallet

Date: 14.04.23

Version: V1.0

| Version number | Change |
| -------------- |:------ |
| V1.0           |        |

# Contents

- [Requirements Document - current EZWallet](#requirements-document---current-ezwallet)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
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
    - [Use case 4, UC4: Create Categories](#use-case-4-uc4-create-categories)
        - [Scenario 4.1](#scenario-41)
    - [Use case 5, UC5: Get Categories](#use-case-5-uc5-get-categories)
        - [Scenario 5.1](#scenario-51)
    - [Use case 6, UC6: Create Transaction](#use-case-6-uc6-create-transaction)
        - [Scenario 6.1](#scenario-61)
    - [Use case 7, UC7: Get Transactions](#use-case-7-uc7-get-transactions)
        - [Scenario 7.1](#scenario-71)
    - [Use case 8, UC8: Delete Transaction](#use-case-8-uc8-delete-transaction)
        - [Scenario 8.1](#scenario-81)
    - [Use case 9, UC9: Get Labels](#use-case-9-uc9-get-labels)
        - [Scenario 9.1](#scenario-91)
    - [Use case 10, UC10: Get All Users](#use-case-10-uc10-get-all-users)
        - [Scenario 10.1](#scenario-101)
    - [Use case 11, UC11: Get user by username](#use-case-11-uc11-get-user-by-username)
        - [Scenario 11.1](#scenario-111)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)
  - [Advisable fixes](#advisable-fixes)

# Informal description

EZWallet (read EaSy Wallet) is a software application designed to help individuals and families keep track of their expenses. Users can enter and categorize their expenses, allowing them to quickly see where their money is going. EZWallet is a powerful tool for those looking to take control of their finances and make informed decisions about their spending.

# Stakeholders

| Stakeholder name | Description                                         |
| ---------------- |:---------------------------------------------------:|
| StandardUser     | manages transaction, categories and see other users |

# Context Diagram and interfaces

## Context Diagram

![](2023-04-23-15-21-56.png)

## Interfaces

| Actor        | Logical Interface | Physical Interface            |
| ------------ |:-----------------:| -----------------------------:|
| StandardUser | Web GUI           | Screen, keyboard, mouse on PC |

# Stories and personas

Few personas are described in the following paragraph covering the Standard User profile.

- Persona 1 : student, male , 24 yo
  
  - Story: Student in Erasmus, need to <u>save </u>money, he cannot spend more than what the european scolarship gives him. 

- Persona 2: lawyer, female, married, with children, 40 yo
  
  - Story: Need to <u>track </u>all expenses and bank investments, organising them by different member of the family. 

- Persona 3: young professional, female, 30 yo
  
  - Story: Going on holiday with friends, wants to keep track of all group expenses in order to split the account at the end of the journey.

- Persona 4: finance broker, male, 45 yo
  
  - Story: Need to have an intuitive GUI to <u>display clearly</u> the various <u>investments</u> that he makes daily.

# Functional and non functional requirements

## Functional Requirements

| ID    | Description                      |
|:----- |:--------------------------------:|
| FR1   | Authorization and authentication |
| FR1.1 | Registration account             |
| FR1.2 | Login                            |
| FR1.3 | Logout                           |
| FR1.4 | Refresh Token                    |
| FR2   | Handle categories                |
| FR2.1 | Create categories                |
| FR2.2 | Get categories                   |
| FR3   | Handle transactions              |
| FR3.1 | Create transaction               |
| FR3.2 | Get transactions                 |
| FR3.3 | Delete transaction               |
| FR4   | Get labels                       |
| FR5   | Handle users                     |
| FR5.1 | Get all Users                    |
| FR5.2 | Get user by username             |

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

![](2023-04-27-14-57-46.png)

### Use case 1, UC1: Registration Account

| Actors Involved  | StandardUser                                                                  |
| ---------------- |:-----------------------------------------------------------------------------:|
| Precondition     |                                                                               |
| Post condition   | User is registered                                                            |
| Nominal Scenario | User creates an account with an email that system has never registered before |
| Variants         |                                                                               |
| Exceptions       | User, trying to create an account, uses an email that already exists          |

##### Scenario 1.1

| Scenario 1.1   | Successful Registration                                                                                                  |
| -------------- |:------------------------------------------------------------------------------------------------------------------------:|
| Precondition   |                                                                                                                          |
| Post condition | User U is registered                                                                                                     |
| Step#          | Description                                                                                                              |
| 1              | User U starts the Registration procedure by selecting the item "Register here" in the "Login" screen                     |
| 2              | System shows up the "Sign Up" screen where U can enter all the required data                                             |
| 3              | U fills form and goes ahead to submit                                                                                    |
| 4              | System, interacting with DB, checks whether an account with the same email already exists and possibly creates a new one |
| 5              | System shows up the "Login" screen and a message to communicate the creation of the account                              |

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

| Scenario 2.1   | Successful Login                                                                                                            |
| -------------- |:---------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U is not authenticated                                                                                                 |
| Post condition | User U is authenticated                                                                                                     |
| Step#          | Description                                                                                                                 |
| 1              | User U starts the Login procedure by filling the form in the "Login" screen                                                 |
| 2              | U goes ahead to submit                                                                                                      |
| 3              | System, interacting with DB, checks credentials and, if they are correct, allows user to proceed showing up the "Home Page" |

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
| 3              | If U selects "Yes", System logs the user out and shows the "Login screen"  |

### Use case 4, UC4: Create Categories

| Actors Involved  | StandardUser                                       |
| ---------------- |:--------------------------------------------------:|
| Precondition     | System shows up the "Categories" screen            |
| Post condition   | A new category is inserted into DB                 |
| Nominal Scenario | User creates a new category populating its flields |
| Variants         |                                                    |
| Exceptions       |                                                    |

##### Scenario 4.1

| Scenario 4.1   | Create Categories                                                                          |
| -------------- |:------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Categories" screen                                                    |
| Post condition | A new category is inserted into DB                                                         |
| Step#          | Description                                                                                |
| 1              | User U selects the "Add category" item                                                     |
| 2              | System shows a form where U can enter type and color of the new category                   |
| 3              | U fills the form and go ahead to submit                                                    |
| 4              | System stores data into DB and shows a message to communicate the result of this procedure |
| 5              | U close the message                                                                        |
| 6              | System shows up the "Categories" screen                                                    |

### Use case 5, UC5: Get Categories

| Actors Involved  | StandardUser                       |
| ---------------- |:----------------------------------:|
| Precondition     | Standard user must be logged in    |
| Post condition   | The "Categories" screen is showed  |
| Nominal Scenario | System shows up all the categories |
| Variants         |                                    |
| Exceptions       |                                    |

##### Scenario 5.1

| Scenario 5.1   | Get Categories                                                                                         |
| -------------- |:------------------------------------------------------------------------------------------------------:|
| Precondition   | Standard user must be logged in                                                                        |
| Post condition | The "Categories" screen is showed                                                                      |
| Step#          | Description                                                                                            |
| 1              | User U selects the "Categories" item                                                                   |
| 2              | System, interacting with DB, retrieves all the categories and shows them into the "Categories " screen |

### Use case 6, UC6: Create Transaction

| Actors Involved  | StandardUser                                          |
| ---------------- |:-----------------------------------------------------:|
| Precondition     | System shows up the "Transactions" screen             |
| Post condition   | A new transaction is inserted into DB                 |
| Nominal Scenario | User creates a new transaction populating its flields |
| Variants         |                                                       |
| Exceptions       |                                                       |

##### Scenario 6.1

| Scenario 6.1   | Create Transaction                                                                           |
| -------------- |:--------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Transactions" screen                                                    |
| Post condition | A new transaction is inserted into DB                                                        |
| Step#          | Description                                                                                  |
| 1              | User U selects the "Add a Transaction" item                                                  |
| 2              | System shows a form where U can enter name, type, amount and date of the new transaction     |
| 3              | U fills the form and go ahead to submit                                                      |
| 4              | System stores data in the DB and shows a message to communicate the result of this procedure |
| 5              | U closes the message                                                                         |
| 6              | System shows up the "Transactions" screen                                                    |

### Use case 7, UC7: Get Transactions

| Actors Involved  | StandardUser                         |
| ---------------- |:------------------------------------:|
| Precondition     | Standard user must be logged in      |
| Post condition   | The "Transactions" screen is showed  |
| Nominal Scenario | System shows up all the transactions |
| Variants         |                                      |
| Exceptions       |                                      |

##### Scenario 7.1

| Scenario 7.1   | Get Transactions                                                                                          |
| -------------- |:---------------------------------------------------------------------------------------------------------:|
| Precondition   | Standard user must be logged in                                                                           |
| Post condition | The "Transactions" screen is showed                                                                       |
| Step#          | Description                                                                                               |
| 1              | User U selects the "Transactions" item                                                                    |
| 2              | System, interacting with DB, retrieves all the transactions and shows them into the "Transactions" screen |

### Use case 8, UC8: Delete Transaction

| Actors Involved  | StandardUser                                            |
| ---------------- |:-------------------------------------------------------:|
| Precondition     | System shows up the "Transactions" screen               |
| Post condition   | The selected transaction is no longer present in the DB |
| Nominal Scenario | User deletes a transaction                              |
| Variants         |                                                         |
| Exceptions       |                                                         |

##### Scenario 8.1

| Scenario 8.1   | Delete Transaction                                                                                           |
| -------------- |:------------------------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Transactions" screen                                                                    |
| Post condition | The selected transaction is no longer present in the DB                                                      |
| Step#          | Description                                                                                                  |
| 1              | User U selects the "Delete transaction" item relative to the transaction T that he wants to delete           |
| 2              | System shows up a message asking U whether he is sure to delete the transaction T or not                     |
| 3              | If U selects "Yes", System deletes T from DB and shows a message to communicate the result of this procedure |
| 4              | U closes the message                                                                                         |
| 5              | System shows up the "Transactions" screen                                                                    |

### Use case 9, UC9: Get Labels

| Actors Involved  | StandardUser                        |
| ---------------- |:-----------------------------------:|
| Precondition     | Standard user must be logged in     |
| Post condition   | The "Transactions" screen is showed |
| Nominal Scenario | System shows up all the labels      |
| Variants         |                                     |
| Exceptions       |                                     |

##### Scenario 9.1

| Scenario 9.1   | Get Labels                                                                                                                    |
| -------------- |:-----------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | Standard user must be logged in                                                                                               |
| Post condition | The "Transactions" screen is showed                                                                                           |
| Step#          | Description                                                                                                                   |
| 1              | User U selects the "Transactions" item                                                                                        |
| 2              | System, interacting with DB, retrieves all the transactions with relative color and shows them into the "Transactions" screen |

### Use case 10, UC10: Get All Users

| Actors Involved  | StandardUser                    |
| ---------------- |:-------------------------------:|
| Precondition     | Standard user must be logged in |
| Post condition   | The "Users" screen is showed    |
| Nominal Scenario | System shows up all the users   |
| Variants         |                                 |
| Exceptions       |                                 |

##### Scenario 10.1

| Scenario 10.1  | Get All Users                                                                               |
| -------------- |:-------------------------------------------------------------------------------------------:|
| Precondition   | System shows up the "Home Page" screen                                                      |
| Post condition | The "Users" screen is showed                                                                |
| Step#          | Description                                                                                 |
| 1              | User U selects the "Users" item                                                             |
| 2              | System, interacting with DB, retrieves all the users and shows them into the "Users" screen |

### Use case 11, UC11: Get user by username

| Actors Involved  | StandardUser                                       |
| ---------------- |:--------------------------------------------------:|
| Precondition     | User logged in                                     |
| Post condition   | User data are showed                               |
| Nominal Scenario | System shows up all the information about the User |
| Variants         |                                                    |
| Exceptions       |                                                    |

##### Scenario 11.1

| Scenario 11.1  | Get user by username                                                                                                                                                  |
| -------------- |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| Precondition   | User U must be logged in                                                                                                                                              |
| Post condition | User data are showed                                                                                                                                                  |
| Step#          | Description                                                                                                                                                           |
| 1              | Every time that "Home Page" has to be displayed (after login or through the "Home" item), System retrieves all the user information and shows them in the "Home page" |

# Glossary

![](2023-04-27-18-36-56.png)

# System Design

![](System_Design_-_V1.jpg)

# Deployment Diagram

![](2023-04-27-16-10-41.png)

## Advisable fixes

1. Implement rights control. In this version everyone can access to private data, with the function getAllUsers().

2. Fix transactions, categories and labels such that only the creator user can see them and not all the users.

3. GetLabels is a redundant function, the same aim can be achieved with a single query inside getTransactions().
