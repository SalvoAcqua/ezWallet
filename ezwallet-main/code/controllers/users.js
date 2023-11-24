import e from "express";
import jwt from 'jsonwebtoken';
import { Group, User } from "../models/User.js";
import { transactions } from "../models/model.js";
import { validateEmail, verifyAuth } from "./utils.js";

/**
 * Return all the users
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `email` and `role`
  - Optional behavior:
    - empty array is returned if there are no users
 */
export const getUsers = async (req, res) => {
  try {
    const AdminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (AdminAutho.flag) {
      const users = await User.find();
      let filter = users.map(v => Object.assign({}, { username: v.username, email: v.email, role: v.role }))
      res.status(200).json({ data: filter, refreshedTokenMessage: res.locals.refreshedTokenMessage });
    } else {
      res.status(401).json({ error: AdminAutho.cause });
    }
  } catch (error) {
    res.status(500).json({ error: error.error })
  }
}

/**
 * Return information of a specific user
  - Request Body Content: None
  - Response `data` Content: An object having attributes `username`, `email` and `role`.
  - Optional behavior:
    - error 401 is returned if the user is not found in the system
 */
export const getUser = async (req, res) => {
  try {
    const AdminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (AdminAutho.flag) {
      const username = req.params.username;
      const user = await User.findOne({ username: username });

      if (!user)
        return res.status(400).json({ error: "User not found" });
      
      res.status(200).json({ data: { username: user.username, email: user.email, role: user.role }, refreshedTokenMessage: res.locals.refreshedTokenMessage });
    } else {
      const UserAutho = verifyAuth(req, res, { authType: "User", username: req.params.username });
      if (UserAutho.flag) {
        const username = req.params.username;
        const user = await User.findOne({ username: username });

        if (!user)
          return res.status(400).json({ error: "User not found" });
        
        return res.status(200).json({ data: { username: user.username, email: user.email, role: user.role }, refreshedTokenMessage: res.locals.refreshedTokenMessage });
      } else {
        return res.status(401).json({ error: UserAutho.cause });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.error })
  }
}

/**
 * Create a new group
  - Request Body Content: An object having a string attribute for the `name` of the group and an array that lists all the `memberEmails`
  - Response `data` Content: An object having an attribute `group` (this object must have a string attribute for the `name`
    of the created group and an array for the `members` of the group), an array that lists the `alreadyInGroup` members
    (members whose email is already present in a group) and an array that lists the `membersNotFound` (members whose email
    +does not appear in the system)
  - UPDATE : the Creator of the group have to be included in the group even if he is not written in the list.
  - Optional behavior:
    - error 401 is returned if there is already an existing group with the same name
    - error 401 is returned if all the `memberEmails` either do not exist or are already in a group
 */
export const createGroup = async (req, res) => {
  try { 
    const simpleAutho = verifyAuth(req, res, { authType: "Simple" }); 
    if (simpleAutho.flag) { 
      
      if (!req.body.hasOwnProperty("name")||!req.body.hasOwnProperty("memberEmails")) 
        return res.status(400).json({ error: "req.body does not contain all the necessary attributes"}); 
        
      let {name, memberEmails} = req.body;

      if (typeof name !== "string") 
        return res.status(400).json({ error: "req.body.name is not a string"});

      name = name.trim();
  
      if (!Array.isArray(memberEmails)) 
        return res.status(400).json({ error: "req.body.memberEmails is not an array"}); 
      
      if (memberEmails.length===0) 
        return res.status(400).json({ error: "req.body.memberEmails is an empty array"}); 

      if (name==="") 
        return res.status(400).json({error: "req.body.name is an empty string"}); 
        
      const groupExist = await Group.findOne({name: name}); 
  
      if (groupExist) 
        return res.status(400).json({error: name + " already exists as a group name"}); 
    
      
      let uniqueArray = memberEmails.filter((value, index, self) => { 
        return self.indexOf(value) === index; 
      }).map(e => {
        if (typeof e !== "string") 
          return res.status(400).json({ error: "One of the emails in the array is not a string"});

        return e.trim();
      })
      let membersNotFound = []; 
      let alreadyInGroup = []; 
      let members = [];
      const cookie = req.cookies; 
      const decodedRefreshToken = await jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY);
      const myEmail = decodedRefreshToken.email;
      if (!uniqueArray.includes(myEmail)) 
        uniqueArray.push(myEmail); 
      
      for (const email of uniqueArray) {
        if (email==="") 
          return res.status(400).json({error: "One of the email in the array is an empty string"}); 
        
        if (!validateEmail(email))
          return res.status(400).json({error: email + " is not a valid email format"}); 
        
        const memberFound = await User.findOne({ email: email });
        if (!memberFound && email!==myEmail) 
          membersNotFound.push(email); 
        else if (!memberFound && email===myEmail) 
          return res.status(400).json({error: "The user who calls the API is not in the database"}); 
        else {
          const result = await Group.findOne({"members.email": email}); 
          if (result && email!==myEmail)
            alreadyInGroup.push(email); 
          else if (result && email===myEmail)
            return res.status(400).json({error: "The user who calls the API is already in another group"}); 
          else 
            members.push({email: email, user: memberFound._id});
        } 
      }
      
      if(members.length===1)
        return res.status(400).json({error : "You cannot create a group with only one member"});
  
      if(membersNotFound.length + alreadyInGroup.length === uniqueArray.length-1)
        return res.status(400).json({error: "All the provided emails represent users that do not exist in the database or are already in another group"}); 
      
      const new_group =  new Group({ name, members });
      
      // new_group.save()
      //   .then(data => {
      //     let filter = members.map(v => Object.assign({}, { email: v.email }))
      //     return res.status(200).json({data: {group: {name : name, members : filter}, membersNotFound: membersNotFound, alreadyInGroup: alreadyInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})
      //   }).catch(err => { throw err })
        await new_group.save()
        let filter = members.map(v => Object.assign({}, { email: v.email }))
        return res.status(200).json({data: {group: {name : name, members : filter}, membersNotFound: membersNotFound, alreadyInGroup: alreadyInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})
     
    } else {
      res.status(401).json({ error: simpleAutho.cause})
    }
  } catch (err) { 
    res.status(500).json({err: err.error}); 
  } 
}



/**
 * Return all the groups
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having a string attribute for the `name` of the group
    and an array for the `members` of the group
  - Optional behavior:
    - empty array is returned if there are no groups
 */
export const getGroups = async (req, res) => {
  try {
    const AdminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (AdminAutho.flag) {
      const groups = await Group.find();
      const eachgroup = groups.map((group) => {
        return { name: group.name, members: group.members.map((m) => {return {email: m.email}}) };
      });

      res.status(200).json({ data: eachgroup, refreshedTokenMessage: res.locals.refreshedTokenMessage });
    } else {
      res.status(401).json({ error: AdminAutho.cause });
    }
  } catch (error) {
    return res.status(500).json({ error: error.error });
  }
}

/**
 * Return information of a specific group
  - Request Body Content: None
  - Response `data` Content: An object having a string attribute for the `name` of the group and an array for the 
    `members` of the group
  - Optional behavior:
    - error 401 is returned if the group does not exist
 */
export const getGroup = async (req, res) => {
  try {
    const groupName = req.params.name;

    const AdminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (AdminAutho.flag) {

      const group = await Group.findOne({ name: groupName });

      if (!group)
        return res.status(400).json({ error: "This group does not exist" });
      
      const groupinfo = {group :{ name: group.name, members: group.members.map((m) => {return {email: m.email}}) }};
      res.status(200).json({ data: groupinfo, refreshedTokenMessage: res.locals.refreshedTokenMessage });
    } else {
        const group = await Group.findOne({ name: groupName });
        
        if (!group)
          return res.status(400).json({ error: "This group does not exist" });
        
        let groupemails = [];
        for (let i = 0; i < group.members.length; i++) {
          groupemails.push(group.members[i].email);
        }

        const GroupAutho = verifyAuth(req, res, { authType: "Group", emails: groupemails });
        if (GroupAutho.flag) {        
          const groupinfo = { group: { name: group.name, members: group.members.map((m) => {return {email: m.email}}) } };
          res.status(200).json({ data: groupinfo, refreshedTokenMessage: res.locals.refreshedTokenMessage });
        } else {
          res.status(401).json({ error: GroupAutho.cause });
        }
    }
  } catch (error) {
    res.status(500).json({ error: error.error })
  }
}

/**
 * Add new members to a group
  - Request Body Content: An array of strings containing the emails of the members to add to the group
  - Response `data` Content: An object having an attribute `group` (this object must have a string attribute for the `name` of the
    created group and an array for the `members` of the group, this array must include the new members as well as the old ones), 
    an array that lists the `alreadyInGroup` members (members whose email is already present in a group) and an array that lists 
    the `membersNotFound` (members whose email does not appear in the system)
  - Optional behavior:
    - error 401 is returned if the group does not exist
    - error 401 is returned if all the `memberEmails` either do not exist or are already in a group
 */
export const addToGroup = async (req, res) => {
  try {
    const groupName = req.params.name;

    //Distinction between route accessed by Admins or Regular users for functions that can be called by both
    //and different behaviors and access rights
    if (req.url.endsWith("/insert")) {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {

          if (!req.body.hasOwnProperty("emails")) 
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

          if (!Array.isArray(req.body.emails))
            return res.status(400).json({ error: "req.body.emails is not an array"});

          if (req.body.emails.length===0)
            return res.status(400).json({ error: "req.body.emails is an empty array"});

          const groupExist = await Group.findOne({ name: groupName });
          
          if (!groupExist)
            return res.status(400).json({ error: "This group does not exist" });

          let uniqueArray = req.body.emails.filter((value, index, self) => { 
            return self.indexOf(value) === index; 
          }).map(e => {
            if (typeof e !== "string") 
              return res.status(400).json({ error: "One of the emails in the array is not a string"});

            return e.trim();
          }); 
          let membersNotFound = []; 
          let alreadyInGroup = []; 
          let members = [];
          
          for (const email of uniqueArray) {
            if (email==="") 
              return res.status(400).json({error: "One of the email in the array is an empty string"}); 
            
            if (!validateEmail(email))
              return res.status(400).json({error: email + " is not a valid email format"}); 
            
            const memberFound = await User.findOne({ email: email });
            if (!memberFound) 
              membersNotFound.push(email); 
            else {
              const result = await Group.findOne({"members.email": email}); 
              if (result)
                alreadyInGroup.push(email); 
              else 
                members.push({email: email, user: memberFound._id});
            } 
          }
      
          if(membersNotFound.length + alreadyInGroup.length === uniqueArray.length)
            return res.status(400).json({error: "All the provided emails represent users that do not exist in the database or are already in another group"}); 
          
          const newGroup = await Group.findOneAndUpdate({name: groupName}, { $push: { members: { $each: members } } }, { returnOriginal: false })
          let filter = newGroup.members.map(v => Object.assign({}, { email: v.email }))
          return res.status(200).json({data: {group: {name : groupName, members : filter}, membersNotFound: membersNotFound, alreadyInGroup: alreadyInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})

        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } else {
        const group = await Group.findOne({ name: groupName });
          
        if (!group)
          return res.status(400).json({ error: "This group does not exist" });
        
        let groupemails = [];
        for (let i = 0; i < group.members.length; i++) {
          groupemails.push(group.members[i].email);
        }

        const GroupAutho = verifyAuth(req, res, { authType: "Group", emails: groupemails });
        if (GroupAutho.flag) {
            
          if (!req.body.hasOwnProperty("emails")) 
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

          if (!Array.isArray(req.body.emails))
            return res.status(400).json({ error: "req.body.emails is not an array"});

          if (req.body.emails.length===0)
            return res.status(400).json({ error: "req.body.emails is an empty array"});

          let uniqueArray = req.body.emails.filter((value, index, self) => { 
            return self.indexOf(value) === index; 
          }).map(e => {
            if (typeof e !== "string") 
              return res.status(400).json({ error: "One of the emails in the array is not a string"});

            return e.trim();
          }); 
          let membersNotFound = []; 
          let alreadyInGroup = []; 
          let members = [];
          
          for (const email of uniqueArray) {
            if (email==="") 
              return res.status(400).json({error: "One of the email in the array is an empty string"}); 
            
            if (!validateEmail(email))
              return res.status(400).json({error: email + " is not a valid email format"}); 
            
            const memberFound = await User.findOne({ email: email });
            if (!memberFound) 
              membersNotFound.push(email); 
            else {
              const result = await Group.findOne({"members.email": email}); 
              if (result)
                alreadyInGroup.push(email); 
              else 
                members.push({email: email, user: memberFound._id});
            } 
          }
      
          if(membersNotFound.length + alreadyInGroup.length === uniqueArray.length)
            return res.status(400).json({error: "All the provided emails represent users that do not exist in the database or are already in another group"}); 
          
          // Group.findOneAndUpdate({name: groupName}, { $push: { members: { $each: members } } }, { returnOriginal: false })
          //   .then(newGroup => {
          //     let filter = newGroup.members.map(v => Object.assign({}, { email: v.email }))
          //     return res.status(200).json({data: {group: {name : groupName, members : filter}, membersNotFound: membersNotFound, alreadyInGroup: alreadyInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})})
          //   .catch(err => { throw err })
            const newGroup = await Group.findOneAndUpdate({name: groupName}, { $push: { members: { $each: members } } }, { returnOriginal: false })
            let filter = newGroup.members.map(v => Object.assign({}, { email: v.email }))
            return res.status(200).json({data: {group: {name : groupName, members : filter}, membersNotFound: membersNotFound, alreadyInGroup: alreadyInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})

        } else {
            res.status(401).json({ error: GroupAutho.cause})
        }
    }
  } catch (error) {
      res.status(500).json({error: error.message})
  }
}


/**
 * Remove members from a group
  - Request Body Content: An object having an attribute `group` (this object must have a string attribute for the `name` of the
    created group and an array for the `members` of the group, this array must include only the remaining members),
    an array that lists the `notInGroup` members (members whose email is not in the group) and an array that lists 
    the `membersNotFound` (members whose email does not appear in the system)
  - Optional behavior:
    - error 401 is returned if the group does not exist
    - error 401 is returned if all the `memberEmails` either do not exist or are not in the group
 */
export const removeFromGroup = async (req, res) => {
  try {
    const groupName = req.params.name;

    //Distinction between route accessed by Admins or Regular users for functions that can be called by both
    //and different behaviors and access rights
    if (req.url.endsWith("/pull")) {
        const adminAuth = verifyAuth(req, res, { authType: "Admin" });
        if (adminAuth.flag) {

          if (!req.body.hasOwnProperty("emails")) 
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

          if (!Array.isArray(req.body.emails))
            return res.status(400).json({ error: "req.body.emails is not an array"});

          if (req.body.emails.length===0)
            return res.status(400).json({ error: "req.body.emails is an empty array"});

          const groupExist = await Group.findOne({ name: groupName });
          
          if (!groupExist)
            return res.status(400).json({ error: "This group does not exist" });
          
          if (groupExist.members.length===1)
            return res.status(400).json({ error: "You cannot remove any user from a group containing only one member" });
          
          let uniqueArray = req.body.emails.filter((value, index, self) => { 
            return self.indexOf(value) === index; 
          }).map(e => {
            if (typeof e !== "string") 
              return res.status(400).json({ error: "One of the emails in the array is not a string"});

            return e.trim();
          }); 
          let membersNotFound = []; 
          let notInGroup = []; 
          let membersToRemove = [];
          
          for (const email of uniqueArray) {
            if (email==="") 
              return res.status(400).json({error: "One of the email in the array is an empty string"}); 
            
            if (!validateEmail(email))
              return res.status(400).json({error: email + " is not a valid email format"}); 
            
            const memberFound = await User.findOne({ email: email });
            if (!memberFound) 
              membersNotFound.push(email); 
            else {
              const result = await Group.findOne({ name: groupName, members: { $elemMatch: { email: email } } }); 
              if (!result)
                notInGroup.push(email); 
              else 
                membersToRemove.push(email);
            }
          }
      
          if(membersNotFound.length + notInGroup.length === uniqueArray.length)
            return res.status(400).json({error: "All the provided emails represent users that do not exist in the database or do not belong to the group"});
          
          if (membersToRemove.length===groupExist.members.length)
            membersToRemove.shift();

            const newGroup = await Group.findOneAndUpdate({name: groupName}, { $pull: { members: { email: { $in: membersToRemove } } } }, { returnOriginal: false })
          let filter = newGroup.members.map(v => Object.assign({}, { email: v.email }))
          return res.status(200).json({data: {group: {name : groupName, members : filter}, membersNotFound: membersNotFound, notInGroup: notInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})
        
        } else {
            res.status(401).json({ error: adminAuth.cause})
        }
    } else {
        const group = await Group.findOne({ name: groupName });
          
        if (!group)
          return res.status(400).json({ error: "This group does not exist" });
        
        let groupemails = [];
        for (let i = 0; i < group.members.length; i++) {
          groupemails.push(group.members[i].email);
        }

        const GroupAutho = verifyAuth(req, res, { authType: "Group", emails: groupemails });
        if (GroupAutho.flag) {
            
          if (!req.body.hasOwnProperty("emails")) 
            return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

          if (!Array.isArray(req.body.emails))
            return res.status(400).json({ error: "req.body.emails is not an array"});

          if (req.body.emails.length===0)
            return res.status(400).json({ error: "req.body.emails is an empty array"});
          
          if (group.members.length===1)
            return res.status(400).json({ error: "You cannot remove any user from a group containing only one member" });
          
          let uniqueArray = req.body.emails.filter((value, index, self) => { 
            return self.indexOf(value) === index; 
          }).map(e => {
            if (typeof e !== "string") 
              return res.status(400).json({ error: "One of the emails in the array is not a string"});

            return e.trim();
          }); 
          let membersNotFound = []; 
          let notInGroup = []; 
          let membersToRemove = [];
          
          for (const email of uniqueArray) {
            if (email==="") 
              return res.status(400).json({error: "One of the email in the array is an empty string"}); 
            
            if (!validateEmail(email))
              return res.status(400).json({error: email + " is not a valid email format"}); 
            
            const memberFound = await User.findOne({ email: email });
            if (!memberFound) 
              membersNotFound.push(email); 
            else {
              const result = await Group.findOne({ name: groupName, members: { $elemMatch: { email: email } } }); 
              if (!result)
                notInGroup.push(email); 
              else 
                membersToRemove.push(email);
            }
          }
      
          if(membersNotFound.length + notInGroup.length === uniqueArray.length)
            return res.status(400).json({error: "All the provided emails represent users that do not exist in the database or do not belong to the group"}); 
          
          if (membersToRemove.length===group.members.length)
            membersToRemove.shift();

          const newGroup = await Group.findOneAndUpdate({name: groupName}, { $pull: { members: { email: { $in: membersToRemove } } } }, { returnOriginal: false })
          let filter = newGroup.members.map(v => Object.assign({}, { email: v.email }))
          return res.status(200).json({data: {group: {name : groupName, members : filter}, membersNotFound: membersNotFound, notInGroup: notInGroup}, refreshedTokenMessage: res.locals.refreshedTokenMessage})

        } else {
            res.status(401).json({ error: GroupAutho.cause})
        }
    }
  } catch (error) {
      res.status(500).json({error: error.message})
  }
}



/**
 * Delete a user
  - Request Parameters: None
  - Request Body Content: A string equal to the `email` of the user to be deleted
  - Response `data` Content: An object having an attribute that lists the number of `deletedTransactions` and a boolean attribute that
    specifies whether the user was also `deletedFromGroup` or not.
  - Optional behavior:
    - error 401 is returned if the user does not exist 
 */
export const deleteUser = async (req, res) => {  
  try {
    const adminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (adminAutho.flag ) {

      if (!req.body.hasOwnProperty("email"))
        return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});
      
      let email = req.body.email;

      if (typeof email !== "string") 
          return res.status(400).json({ error: "req.body.email is not a string"});

      email = email.trim();

      if (email==="")
        return res.status(400).json({ error: "req.body.email is an empty string"});
      
      if(!validateEmail(email))
        return res.status(400).json({ error: "Format email incorrect" });
      
      const userExist = await User.findOne({ email: email });
      if (!userExist)
        return res.status(400).json({ error: "User " + email + " does not exist" });
      
      if (userExist.role === "Admin")
        return res.status(400).json({ error: "Can not delete an Admin" });
      
      const userTransactions = await transactions.deleteMany({ username: userExist.username });
      
      let deletedFromGroup = false;

      const userGroup = await Group.findOne({"members.email": email});
      if (userGroup) {
        deletedFromGroup = true;
        if (userGroup.members.length===1)
          await Group.deleteOne({name: userGroup.name});
        else {
          const membersUpdated = userGroup.members.filter(objEmail => objEmail.email!==email);
          await Group.updateOne({name: userGroup.name}, {$set: {members: membersUpdated}});
        }
      }
      
      await User.deleteOne({ email: email });
      res.status(200).json({data : {deletedTransactions: userTransactions.deletedCount, deletedFromGroup: deletedFromGroup},refreshedTokenMessage : res.locals.refreshedTokenMessage});
    } else {
      res.status(401).json({ error: adminAutho.cause})
    }
  } catch (err) {
    res.status(500).json({error: err.error})
  }
}
  

/**
 * Delete a group
  - Request Body Content: A string equal to the `name` of the group to be deleted
  - Response `data` Content: A error confirming successful deletion
  - Optional behavior:
    - error 401 is returned if the group does not exist
 */
export const deleteGroup = async (req, res) => {
  try{
    const adminAutho = verifyAuth(req, res, { authType: "Admin" });
    if (adminAutho.flag){

      if (!req.body.hasOwnProperty("name"))
        return res.status(400).json({ error: "req.body does not contain all the necessary attributes"});

      let name = req.body.name;

      if (typeof name !== "string") 
          return res.status(400).json({ error: "req.body.name is not a string"});

      name = name.trim();
      
      if (name==="")
        return res.status(400).json({ error: "req.body.name is an empty string"});
      
      const groupExist = await Group.findOne({ name: name });
      if (!groupExist)
        return res.status(400).json({ error: "Group " + name + " does not exist" });
      
      await Group.deleteOne({ name: name });
      return res.status(200).json({data: {message: "Group deleted successfully"}, refreshedTokenMessage: res.locals.refreshedTokenMessage});
    } else {
      res.status(401).json({ error: adminAutho.cause})
    }
  } catch (err) {
    res.status(500).json(err.error)
  }
}
