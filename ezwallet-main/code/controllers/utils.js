import jwt from 'jsonwebtoken'

/**
 * Handle possible date filtering options in the query parameters for getTransactionsByUser when called by a Regular user.
 * @param req the request object that can contain query parameters
 * @returns an object that can be used for filtering MongoDB queries according to the `date` parameter.
 *  The returned object must handle all possible combination of date filtering parameters, including the case where none are present.
 *  Example: {date: {$gte: "2023-04-30T00:00:00.000Z"}} returns all transactions whose `date` parameter indicates a date from 30/04/2023 (included) onwards
 * @throws an error if the query parameters include `date` together with at least one of `from` or `upTo`
 */
export const handleDateFilterParams = (req) => {
    
    if(req.query.hasOwnProperty("date") && (req.query.hasOwnProperty("from") || req.query.hasOwnProperty("upTo")))
        throw new Error("date parameter cannot be present together with from or upTo parameter");

    if (req.query.hasOwnProperty("date")) {
        if (!validateDate(req.query.date))
            throw new Error("date parameter is not a string in the format YYYY-MM-DD");

        const parsedFrom = new Date(req.query.date);
        const parsedUpTo = new Date(req.query.date);

        if (isNaN(parsedFrom) || isNaN(parsedUpTo))
            throw new Error("date parameter is not a valid date");

        parsedFrom.setHours(0);
        parsedFrom.setMinutes(0);
        parsedFrom.setSeconds(0);
        parsedFrom.setMilliseconds(0);
        parsedUpTo.setHours(23);
        parsedUpTo.setMinutes(59);
        parsedUpTo.setSeconds(59);
        parsedUpTo.setMilliseconds(999);
        return { date: {$gte: parsedFrom, $lte: parsedUpTo} }
    } else if (req.query.hasOwnProperty("from") && req.query.hasOwnProperty("upTo")) {
        if (!validateDate(req.query.from))
            throw new Error("from parameter is not a string in the format YYYY-MM-DD");

        if (!validateDate(req.query.upTo))
            throw new Error("upTo parameter is not a string in the format YYYY-MM-DD");

        const parsedFrom = new Date(req.query.from);
        const parsedUpTo = new Date(req.query.upTo);

        if (isNaN(parsedFrom))
            throw new Error("from parameter is not a valid date");

        if (isNaN(parsedUpTo))
            throw new Error("upTo parameter is not a valid date");

        parsedFrom.setHours(0);
        parsedFrom.setMinutes(0);
        parsedFrom.setSeconds(0);
        parsedFrom.setMilliseconds(0);
        parsedUpTo.setHours(23);
        parsedUpTo.setMinutes(59);
        parsedUpTo.setSeconds(59);
        parsedUpTo.setMilliseconds(999);
        return { date: {$gte: parsedFrom, $lte: parsedUpTo} }
    } else if (req.query.hasOwnProperty("from")) {
        if (!validateDate(req.query.from))
            throw new Error("from parameter is not a string in the format YYYY-MM-DD");
        
        const parsedFrom = new Date(req.query.from);

        if (isNaN(parsedFrom))
            throw new Error("from parameter is not a valid date");

        parsedFrom.setHours(0);
        parsedFrom.setMinutes(0);
        parsedFrom.setSeconds(0);
        parsedFrom.setMilliseconds(0);
        return {date: {$gte: parsedFrom} };
    } else if (req.query.hasOwnProperty("upTo")) {
        if (!validateDate(req.query.upTo))
            throw new Error("upTo parameter is not a string in the format YYYY-MM-DD");

        const parsedUpTo = new Date(req.query.upTo);

        if (isNaN(parsedUpTo))
            throw new Error("upTo parameter is not a valid date");

        parsedUpTo.setHours(23);
        parsedUpTo.setMinutes(59);
        parsedUpTo.setSeconds(59);
        parsedUpTo.setMilliseconds(999);
        return {date: {$lte: parsedUpTo} };
    } else {
        return {};
    }

}

/**
 * Handle possible authentication modes depending on `authType`
 * @param req the request object that contains cookie information
 * @param res the result object of the request
 * @param info an object that specifies the `authType` and that contains additional information, depending on the value of `authType`
 *      Example: {authType: "Simple"}
 *      Additional criteria:
 *          - authType === "User":
 *              - either the accessToken or the refreshToken have a `username` different from the requested one => error 401
 *              - the accessToken is expired and the refreshToken has a `username` different from the requested one => error 401
 *              - both the accessToken and the refreshToken have a `username` equal to the requested one => success
 *              - the accessToken is expired and the refreshToken has a `username` equal to the requested one => success
 *          - authType === "Admin":
 *              - either the accessToken or the refreshToken have a `role` which is not Admin => error 401
 *              - the accessToken is expired and the refreshToken has a `role` which is not Admin => error 401
 *              - both the accessToken and the refreshToken have a `role` which is equal to Admin => success
 *              - the accessToken is expired and the refreshToken has a `role` which is equal to Admin => success
 *          - authType === "Group":
 *              - either the accessToken or the refreshToken have a `email` which is not in the requested group => error 401
 *              - the accessToken is expired and the refreshToken has a `email` which is not in the requested group => error 401
 *              - both the accessToken and the refreshToken have a `email` which is in the requested group => success
 *              - the accessToken is expired and the refreshToken has a `email` which is in the requested group => success
 * @returns true if the user satisfies all the conditions of the specified `authType` and false if at least one condition is not satisfied
 *  Refreshes the accessToken if it has expired and the refreshToken is still valid
 */
export const verifyAuth = (req, res, info) => {
    const cookie = req.cookies
    if (!cookie.accessToken || !cookie.refreshToken) {
        return { flag: false, cause: "Missing accessToken or refreshToken (or both)" };
    }
    try {
        const decodedAccessToken = jwt.verify(cookie.accessToken, process.env.ACCESS_KEY);
        const decodedRefreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY);
        if (!decodedAccessToken.username || !decodedAccessToken.email || !decodedAccessToken.role) {
            return { flag: false, cause: "Token is missing information" }
        }
        if (!decodedRefreshToken.username || !decodedRefreshToken.email || !decodedRefreshToken.role) {
            return { flag: false, cause: "Token is missing information" }
        }
        if (decodedAccessToken.username !== decodedRefreshToken.username || decodedAccessToken.email !== decodedRefreshToken.email || decodedAccessToken.role !== decodedRefreshToken.role) {
            return { flag: false, cause: "Mismatched users" };
        }
        switch (info.authType) {
            case "Simple":
                return { flag: true, cause: "Authorized (Simple authorization required)" };
            case "User":
                if (decodedRefreshToken.username !== info.username || decodedAccessToken.username !== info.username) {
                    return { flag: false, cause: "Mismatched accessTokenUser or refreshTokenUser and Username" };
                }
                if(decodedRefreshToken.username === info.username && decodedAccessToken.username === info.username) {
                    return { flag: true, cause: "Authorized (Both tokens are Ok)" };
                }
            case "Admin":
                if (decodedRefreshToken.role !== "Admin" || decodedAccessToken.role !== "Admin") {
                    return { flag: false, cause: "One (or both) of tokens doesn't have Admin role" };
                }
                if(decodedRefreshToken.role === "Admin" && decodedAccessToken.role === "Admin") {
                    return { flag: true, cause: "Authorized (Both tokens have Admin role)" };
                }
            case "Group":
                if (info.emails.every(memberEmail => decodedRefreshToken.email !== memberEmail || decodedAccessToken.email !== memberEmail)) {
                    return { flag: false, cause: "You don't belong to the requested group" };
                }
                if (info.emails.some(memberEmail => decodedRefreshToken.email === memberEmail && decodedAccessToken.email === memberEmail)) {
                    return { flag: true, cause: "Authorized (Both tokens have an email that belongs to the requested group)" };
                }
            default:
                return { flag: false, cause: "Strange authorization required" };
        }
        
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            try {
                const refreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY)
                const newAccessToken = jwt.sign({
                    username: refreshToken.username,
                    email: refreshToken.email,
                    id: refreshToken.id,
                    role: refreshToken.role
                }, process.env.ACCESS_KEY, { expiresIn: '1h' })

                switch (info.authType) {
                    case "Simple":
                        res.cookie('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                        res.locals.refreshedTokenMessage= 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'
                        return { flag: true, cause: "Authorized (AccessToken is expired but RefreshToken is Ok)" }; 
                    case "User":
                        if(refreshToken.username !== info.username)
                            return { flag: false, cause: "Mismatched refreshTokenUser and Username" };
                        else {
                            res.cookie('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                            res.locals.refreshedTokenMessage= 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'
                            return { flag: true, cause: "Authorized (AccessToken is expired but RefreshToken is Ok)" };
                        }
                    case "Admin":
                        if(refreshToken.role !== "Admin")
                            return { flag: false, cause: "refreshToken role is not Admin" };
                        else {
                            res.cookie('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                            res.locals.refreshedTokenMessage= 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'
                            return { flag: true, cause: "Authorized (AccessToken is expired but RefreshToken has Admin role)" };
                        }
                    case "Group":
                        if (info.emails.every(memberEmail => refreshToken.email !== memberEmail)) {
                            return { flag: false, cause: "You don't belong to the requested group" };
                        }
                        if (info.emails.some(memberEmail => refreshToken.email === memberEmail)) {
                            res.cookie('accessToken', newAccessToken, { httpOnly: true, path: '/api', maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                            res.locals.refreshedTokenMessage= 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'
                            return { flag: true, cause: "Authorized (AccessToken is expired but RefreshTokens has an email that belongs to the requested group)" };
                        }
                    default:
                        return { flag: false, cause: "Strange authorization required" };
                }
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return { flag: false, cause: "Perform login again" }
                } else {
                    return { flag: false, cause: err.name }
                }
            }
        } else {
            return { flag: false, cause: err.name };
        }
    }
}

/**
 * Handle possible amount filtering options in the query parameters for getTransactionsByUser when called by a Regular user.
 * @param req the request object that can contain query parameters
 * @returns an object that can be used for filtering MongoDB queries according to the `amount` parameter.
 *  The returned object must handle all possible combination of amount filtering parameters, including the case where none are present.
 *  Example: {amount: {$gte: 100}} returns all transactions whose `amount` parameter is greater or equal than 100
 */
export const handleAmountFilterParams = (req) => {

    if (req.query.hasOwnProperty("min")){
        if (Number.isNaN(parseFloat(req.query.min)))
            throw new Error("min is not a numerical value");

        if (req.query.hasOwnProperty("max")){
            if (Number.isNaN(parseFloat(req.query.max)))
                throw new Error("max is not a numerical value");

            return { amount: {$gte: parseFloat(req.query.min), $lte: parseFloat(req.query.max)} }
        } else {
            return {amount: {$gte: parseFloat(req.query.min)} };
        }
    } else {
        if (req.query.hasOwnProperty("max")){
            if (Number.isNaN(parseFloat(req.query.max)))
                throw new Error("max is not a numerical value");

            return {amount: {$lte: parseFloat(req.query.max)} };
        } else {
            return {};
        }
    }

}


/* 
-Check format of email 
 */
export const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

/* 
-Check format of date 
 */
export function validateDate(date) {
    if (typeof date !== "string")
        return false;

    var pattern = /^\d{4}-\d{2}-\d{2}$/;
    return pattern.test(date);
}