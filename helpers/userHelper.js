import UserSchema from '../schemas/userSchema.js';
import bcrypt from 'bcrypt';

// const getUserStatus = async (email) => {
//     try {
//         const user = await UserSchema.findOne({email: email});

//         if (user) {
//             return user.isLoggedIn;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         throw error;
//     }
// };


const getUsernameAvailability = async (username) => {
    try {
        const users = await UserSchema.find({username: username});
        return users.length === 0;
    } catch (error) {
        throw error;
    }
};

const getEmailAvailability = async (email) => {
    try {
        const users = await UserSchema.find({email: email});
        return users.length === 0;
    } catch (error) {
        throw error;
    }
};

const hashPasswordAsync = async (password, userSalt) => {
    try {
        const salt = userSalt ? userSalt : await bcrypt.genSalt();
        const result = {
            password: await bcrypt.hash(password, salt),
            salt: salt
        };
    
        return result;
    } catch (error) {
        throw error;
    }
};

const getUserUpdateQuery = async (body) => {
    try {
        const schemaProperties = Object.keys(UserSchema.schema.paths)
        const requestKeys = Object.keys(body)
        const requestValues = Object.values(body)
        const updateQuery = {}
       
        for (let i = 0; i < requestKeys.length; i++) {
            if ( schemaProperties.includes(requestKeys[i]) && requestKeys[i] !== 'password'){
                updateQuery[requestKeys[i]] = requestValues[i];
            }
        }
        return updateQuery;
    } catch (error) {
        throw error;
    }
};

const getAuthenticationStatus = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/account/login');
    } else {
        next();
    }    
};

export {
    // getUserStatus,
    getUsernameAvailability,
    getEmailAvailability,
    hashPasswordAsync,
    getUserUpdateQuery,
    getAuthenticationStatus,
}