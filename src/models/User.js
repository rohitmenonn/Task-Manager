const mongoose = require('mongoose')
const { isEmail } = require('validator');

const User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,

        validate(value){
            if(!isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password cannot contain 'password' ");
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0) throw new Error('Age cannot be negative')
        } 
    }
})

module.exports = User