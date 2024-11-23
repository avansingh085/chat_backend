const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    contacts:[
              {mobile:{
                type:String,
                 trim:true,
                require:true
              },
              user:{
                type:String,
                trim:true,
                default:''
              },
              img:{
                type:String,
                default:''
              },
              title:{
                type:String,
                trim:true,
                default:''
              }
            }
            ],
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    messages: [{
        from: {
            type: String,
            trim:true,
            required: true,
        },
        receiver: {
            type: String,
            trim:true,
            required: true,
        },
        message: {
            type: String,
            trim:true,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }] // Embeds an array of messages for each user
});
const User = mongoose.model('User', userSchema);

module.exports = User;
