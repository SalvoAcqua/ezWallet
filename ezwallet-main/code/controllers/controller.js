import { categories, transactions } from "../models/model.js";
import { Group, User } from "../models/User.js";
import { handleDateFilterParams, handleAmountFilterParams, verifyAuth } from "./utils.js";

/**
 * Create a new category
  - Request Body Content: An object having attributes `type` and `color`
  - Response `data` Content: An object having attributes `type` and `color`
 */
export const createCategory = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {
            
            if (!req.body.hasOwnProperty("type") || !req.body.hasOwnProperty("color"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            let { type, color } = req.body;

            if (typeof type !== "string" || typeof color !== "string") 
                return res.status(400).json({ error: "req.body.type or req.body.color is not a string"});

            type = type.trim();
            color = color.trim();

            if (type==="" || color==="")
                return res.status(400).json({ error: "req.body.type or req.body.color is an empty string"});

            const newCategory = await categories.findOne({ type: type });
            if (newCategory)
                return res.status(400).json({error: type + " already exists in the database"});

            const new_categories = new categories({ type, color });
            new_categories.save()
            .then(data => res.status(200).json({data: {type : data.type, color: data.color}, refreshedTokenMessage: res.locals.refreshedTokenMessage}))
            .catch(err => { throw err })
        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Edit a category's type or color
  - Request Body Content: An object having attributes `type` and `color` equal to the new values to assign to the category
  - Response `data` Content: An object with parameter `message` that confirms successful editing and a parameter `count` that is equal to the count of transactions whose category was changed with the new type
  - Optional behavior:
    - error 401 returned if the specified category does not exist
    - error 401 is returned if new parameters have invalid values
 */
export const updateCategory = async (req, res) => {

    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {

            if (!req.body.hasOwnProperty("type") || !req.body.hasOwnProperty("color"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            let { type, color } = req.body;

            if (typeof type !== "string" || typeof color !== "string") 
                return res.status(400).json({ error: "req.body.type or req.body.color is not a string"});

            type = type.trim();
            color = color.trim();

            if (type==="" || color==="")
                return res.status(400).json({ error: "req.body.type or req.body.color is an empty string"});
            
            const oldCategory = await categories.findOne({ type: req.params.type });
            if(!oldCategory)
                return res.status(400).json({ error : req.params.type + " does not exist" });
  
            const newCategory = await categories.findOne({ type: type });
            if (newCategory && type!==req.params.type)
                return res.status(400).json({error: type + " already exists in the database"});

            await categories.updateOne({type: req.params.type}, {$set: { type: type, color: color }});
            
            let result = undefined;
            if (type!==req.params.type) {
                result = await transactions.updateMany({type: req.params.type}, {$set: {type: type}});
            }
            res.status(200).json({data: {message : "Category edited successfully", count : result ? result.modifiedCount : 0}, refreshedTokenMessage: res.locals.refreshedTokenMessage});
           
        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Delete a category
  - Request Body Content: An array of strings that lists the `types` of the categories to be deleted
  - Response `data` Content: An object with parameter `message` that confirms successful deletion and a parameter `count` that is equal to the count of affected transactions (deleting a category sets all transactions with that category to have `investment` as their new category)
  - Optional behavior:
    - error 401 is returned if the specified category does not exist
 */
export const deleteCategory = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {

            if (!req.body.hasOwnProperty("types"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            if (!Array.isArray(req.body.types))
                return res.status(400).json({ error: "req.body.types is not an array"});

            if (req.body.types.length===0)
                return res.status(400).json({ error: "req.body.types is an empty array"});
            
            let uniqueArray = req.body.types.filter((value, index, self) => {
                return self.indexOf(value) === index;
            }).map(t => {
                if (typeof t !== "string") 
                    return res.status(400).json({ error: "One of the types in the array is not a string"});

                return t.trim();
            });
            let count = 0;
            let firstCategory = undefined;

            const nCategoriesDB = await categories.countDocuments({});
            if (nCategoriesDB===0)
                return res.status(400).json({error: "There are no categories in the database"});
            if (nCategoriesDB===1)
                return res.status(400).json({error: "There is only 1 category in the database"});

            for (const t of uniqueArray) {
                if (t==="")
                    return res.status(400).json({error: "One of the types in the array is an empty string"});

                const category = await categories.findOne({ type: t });
                if (!category)
                    return res.status(400).json({error: t + " does not represent a category in the database"});
            }

            if (nCategoriesDB>uniqueArray.length) {
                await categories.deleteMany({ type: uniqueArray });
                firstCategory = await categories
                        .find({ })
                        .sort({ createdAt: 1 })
                        .limit(1);
            } else {
                //nCategoriesDB==uniqueArray.length
                firstCategory = await categories
                        .find({ })
                        .sort({ createdAt: 1 })
                        .limit(1);
                
                uniqueArray = uniqueArray.filter((element) => element !== firstCategory[0].type);
                await categories.deleteMany({ type: uniqueArray });
            }

            for (const t of uniqueArray) {
                const result = await transactions.updateMany({type: t}, {$set: {type: firstCategory[0].type}});
                count += result.hasOwnProperty("modifiedCount") ? result.modifiedCount : 0;
            }

            res.status(200).json({data: {message : "Categories deleted", count :  count}, refreshedTokenMessage: res.locals.refreshedTokenMessage});

        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all the categories
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `type` and `color`
  - Optional behavior:
    - empty array is returned if there are no categories
 */
export const getCategories = async (req, res) => {
    try {
        const simpleAuth = verifyAuth(req, res, {authType: "Simple"});
        if (simpleAuth.flag){
            let data = await categories.find({})
    
            let filter = data.map(v => Object.assign({}, { type: v.type, color: v.color }))
    
            res.status(200).json({data :filter, refreshedTokenMessage : res.locals.refreshedTokenMessage});
        }
        else{
            res.status(401).json({ error: simpleAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    /* const authorized = verifyAuth(req, res);
    if (authorized){
        try {
            let data = await categories.find({})
    
            let filter = data.map(v => Object.assign({}, { type: v.type, color: v.color }))
    
            res.status(200).json(filter);
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
    else{
        return res.status(401).json({ message: "Unauthorized" })
    } */
}

/**
 * Create a new transaction made by a specific user
  - Request Body Content: An object having attributes `username`, `type` and `amount` and receives a 'username' in both its request body and as its request parameter
  - Response `data` Content: An object having attributes `username`, `type`, `amount` and `date`
  - Optional behavior:
    - error 401 is returned if the username or the type of category does not exist
    -the two must be equal to allow the creation, in case they are different then the method must return a 400 error
 */
export const createTransaction = async (req, res) => {
    try {
        const userAuth = verifyAuth(req, res, {authType: "User", username: req.params.username})
        if (userAuth.flag) {

            if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("amount") || !req.body.hasOwnProperty("type"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            let { username, amount, type } = req.body;

            if (typeof username !== "string" || typeof type !== "string") 
                return res.status(400).json({ error: "req.body.username or req.body.type is not a string"});

            username = username.trim();
            type = type.trim();

            if (typeof amount === "string") 
                amount = amount.trim();

            if (username==="" || amount==="" || type==="")
                return res.status(400).json({ error: "req.body.username or req.body.amount or req.body.type is an empty string"});

            let userExist = await User.findOne({username : req.params.username});
            if (!userExist)
                return res.status(400).json({ error: "The user " + req.params.username + " does not exist" });
            
            userExist = await User.findOne({username : username});
            if (!userExist)
                    return res.status(400).json({ error: "The user " + username + " does not exist" });

            if (req.params.username!==username)
                return res.status(400).json({ error: "Route and body username mismatch" })

            amount = parseFloat(amount);
            if (Number.isNaN(amount))
                return res.status(400).json({ error: "req.amount cannot be parsed as a floating value" })
            
            const typeExist = await categories.findOne({type : type});
            if (!typeExist)
                return res.status(400).json({ error: "Type of category does not exist" });
            
            const new_transactions = new transactions({ username, amount, type });
            new_transactions.save()
                .then(data => res.status(200).json({data: {username: data.username, type: data.type, amount: data.amount, date: data.date }, refreshedTokenMessage: res.locals.refreshedTokenMessage}))
                .catch(err => { throw err })
        } else {
            res.status(401).json({ error: userAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all transactions made by all users
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - empty array must be returned if there are no transactions
 */
export const getAllTransactions = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {
            /**
             * MongoDB equivalent to the query "SELECT * FROM transactions, categories WHERE transactions.type = categories.type"
             */
            transactions.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "type",
                        foreignField: "type",
                        as: "categories_info"
                    }
                },
                { $unwind: "$categories_info" }
            ]).then((result) => {
                let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
            }).catch(error => { throw (error) })
        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all transactions made by a specific user
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - error 401 is returned if the user does not exist
    - empty array is returned if there are no transactions made by the user
    - if there are query parameters and the function has been called by a Regular user then the returned transactions must be filtered according to the query parameters
 */
export const getTransactionsByUser = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights
        if (req.url.indexOf("/transactions/users/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" });
            if (adminAuth.flag) {

                const username = req.params.username;
                const userExist = await User.findOne({"username" : username});

                if (!userExist)
                    return res.status(400).json({ error: "The user " + username + " does not exist" });

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { username:  username }
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: adminAuth.cause})
            }
        } else {
            const userAuth = verifyAuth(req, res, {authType: "User", username: req.params.username})
            if (userAuth.flag) {

                const username = req.params.username;
                const userExist = await User.findOne({"username" : username});

                if (!userExist)
                    return res.status(400).json({ error: "The user " + username + " does not exist" });

                const dateFilter = handleDateFilterParams(req);
                const amountFilter = handleAmountFilterParams(req);

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { $and: [{username:  username},
                                        dateFilter,
                                        amountFilter]}
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: userAuth.cause})
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all transactions made by a specific user filtered by a specific category
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`, filtered so that `type` is the same for all objects
  - Optional behavior:
    - empty array is returned if there are no transactions made by the user with the specified category
    - error 401 is returned if the user or the category does not exist
 */
export const getTransactionsByUserByCategory = async (req, res) => {
    try {
        if (req.url.indexOf("/transactions/users/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" });
            if (adminAuth.flag) {

                const username = req.params.username;
                const type = req.params.category;
                const userExist = await User.findOne({username : username});
                const typeExist = await categories.findOne({type : type});

                if (!userExist)
                    return res.status(400).json({ error: "The user " + username + " does not exist" });
                if (!typeExist)
                    return res.status(400).json({ error: "The category with type " + type + " does not exist" });

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { $and: [{username:  username},{type: type}]}
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: adminAuth.cause})
            }
        } else {
            const userAuth = verifyAuth(req, res, {authType: "User", username: req.params.username})
            if (userAuth.flag) {

                const username = req.params.username;
                const type = req.params.category;
                const userExist = await User.findOne({username : username});
                const typeExist = await categories.findOne({type : type});

                if (!userExist)
                    return res.status(400).json({ error: "The user " + username + " does not exist" });
                if (!typeExist)
                    return res.status(400).json({ error: "The category with type " + type + " does not exist" });

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { $and: [{username:  username},{type: type}]}
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date}))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: userAuth.cause})
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all transactions made by members of a specific group
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`
  - Optional behavior:
    - error 401 is returned if the group does not exist
    - empty array must be returned if there are no transactions made by the group
 */
export const getTransactionsByGroup = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights

        const name = req.params.name;

        if (req.url.indexOf("/transactions/groups/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" });
            if (adminAuth.flag) {

                const groupExist = await Group.findOne({"name" : name});

                if (!groupExist)
                    return res.status(400).json({ error: "The group " + name + " does not exist" });

                let usernames = [];

                for (const emailObject of groupExist.members) {
                    const {username} = await User.findOne({email: emailObject.email},{username: 1, _id: 0})
                    usernames.push(username);
                }

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { username: { $in: usernames } }
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date}))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: adminAuth.cause})
            }
        } else {
            const groupExist = await Group.findOne({ name: name });
        
            if (!groupExist)
                return res.status(400).json({ error: "The group " + name + " does not exist" });
            
            let usernames = [];
            let emails = [];

            for (const emailObject of groupExist.members) {
                const {username} = await User.findOne({email: emailObject.email},{username: 1, _id: 0})
                usernames.push(username);
                emails.push(emailObject.email);
            }

            const GroupAutho = verifyAuth(req, res, { authType: "Group", emails: emails });
            if (GroupAutho.flag) {        
                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { username: { $in: usernames } }
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })
            } else {
                res.status(401).json({ error: GroupAutho.cause });
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Return all transactions made by members of a specific group filtered by a specific category
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `type`, `amount`, `date` and `color`, filtered so that `type` is the same for all objects.
  - Optional behavior:
    - error 401 is returned if the group or the category does not exist
    - empty array must be returned if there are no transactions made by the group with the specified category
 */
export const getTransactionsByGroupByCategory = async (req, res) => {
    try {
        //Distinction between route accessed by Admins or Regular users for functions that can be called by both
        //and different behaviors and access rights

        const name = req.params.name;
        const category = req.params.category;

        if (req.url.indexOf("/transactions/groups/") >= 0) {
            const adminAuth = verifyAuth(req, res, { authType: "Admin" });
            if (adminAuth.flag) {

                const groupExist = await Group.findOne({"name" : name});
                const categoryExist = await categories.findOne({"type": category});

                if (!groupExist)
                    return res.status(400).json({ error: "The group " + name + " does not exist" });

                if (!categoryExist)
                    return res.status(400).json({ error: "The category " + category + " does not exist" });
                
                let usernames = [];

                for (const emailObject of groupExist.members) {
                    const {username} = await User.findOne({email: emailObject.email},{username: 1, _id: 0})
                    usernames.push(username);
                }

                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { $and: [{ username: { $in: usernames } },{type: category}]}
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })

            } else {
                res.status(401).json({ error: adminAuth.cause})
            }
        } else {
            const groupExist = await Group.findOne({ name: name });
            const categoryExist = await categories.findOne({"type": category});
        
            if (!groupExist)
                return res.status(400).json({ error: "The group " + name + " does not exist" });
            
            if (!categoryExist)
                return res.status(400).json({ error: "The category " + category + " does not exist" });

            let usernames = [];
            let emails = [];

            for (const emailObject of groupExist.members) {
                const {username} = await User.findOne({email: emailObject.email},{username: 1, _id: 0})
                usernames.push(username);
                emails.push(emailObject.email);
            }

            const GroupAutho = verifyAuth(req, res, { authType: "Group", emails: emails });
            if (GroupAutho.flag) {        
                transactions.aggregate([
                    {
                        $lookup: {
                            from: "categories",
                            localField: "type",
                            foreignField: "type",
                            as: "categories_info"
                        }
                    },
                    { $unwind: "$categories_info" },
                    {
                        $match: { $and: [{ username: { $in: usernames } },{type: category}]}
                    }
                ]).then((result) => {
                    let data = result.map(v => Object.assign({}, { /*id: v._id,*/ username: v.username, amount: v.amount, type: v.type, color: v.categories_info.color, date: v.date }))
                    res.status(200).json({data: data, refreshedTokenMessage: res.locals.refreshedTokenMessage});
                }).catch(error => { throw (error) })
            } else {
                res.status(401).json({ error: GroupAutho.cause });
            }
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Delete a transaction made by a specific user
  - Request Body Content: The `_id` of the transaction to be deleted
  - Response `data` Content: A string indicating successful deletion of the transaction
  - Optional behavior:
    - error 401 is returned if the user or the transaction does not exist
 */
export const deleteTransaction = async (req, res) => {
    try {
        const userAuth = verifyAuth(req, res, {authType: "User", username: req.params.username})
        if (userAuth.flag) {
            if (!req.body.hasOwnProperty("_id"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            if (typeof req.body._id !== "string") 
                return res.status(400).json({ error: "req.body._id is not a string"});
            
            const id = req.body._id.trim();

            if (id==="")
                return res.status(400).json({ error: "req.body._id is an empty string"});
            
            const userExist = await User.findOne({username : req.params.username});
            if (!userExist)
                return res.status(400).json({ error: "The user " + req.params.username + " does not exist" });
            
            let data = await transactions.findById(id);
            if (!data)
                return res.status(400).json({ error: "This transaction does not exist" });

            if (data.username!==req.params.username)
                return res.status(400).json({ error: "The username in the route does not match the username of the transaction" });

            await transactions.deleteOne({ _id: id });
            return res.status(200).json({data: {message: "Transaction deleted"}, refreshedTokenMessage: res.locals.refreshedTokenMessage});
        } else {
            res.status(401).json({ error: userAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

/**
 * Delete multiple transactions identified by their ids
  - Request Body Content: An array of strings that lists the `_ids` of the transactions to be deleted
  - Response `data` Content: A message confirming successful deletion
  - Optional behavior:
    - error 401 is returned if at least one of the `_ids` does not have a corresponding transaction. Transactions that have an id are not deleted in this case
 */
export const deleteTransactions = async (req, res) => {
    try {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {
        
            if (!req.body.hasOwnProperty("_ids"))
                return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

            if (!Array.isArray(req.body._ids))
                return res.status(400).json({ error: "req.body._ids is not an array"});

            if (req.body._ids.length===0)
                return res.status(400).json({ error: "req.body._ids is an empty array"});
            
            const uniqueArray = req.body._ids.filter((value, index, self) => {
                return self.indexOf(value) === index;
            }).map(t => {
                if (typeof t !== "string") 
                    return res.status(400).json({ error: "One of the ids in the array is not a string"});
                
                return t.trim();
            }); 

            for (const transaction_id of uniqueArray) {
                if (transaction_id==="")
                    return res.status(400).json({error: "One of the ids in the array is an empty string"});

                let transaction = await transactions.findOne({ _id: transaction_id });

                if (!transaction)
                    return res.status(400).json({error: "The transaction " + transaction_id + " does not exist"});
            }

            await transactions.deleteMany({ _id: uniqueArray });
            res.status(200).json({data: {message : "Transactions deleted"}, refreshedTokenMessage: res.locals.refreshedTokenMessage});
        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
