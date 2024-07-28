const User = require("../model/user.model")
const errorHandler = require("../util/error")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


const signup = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      return res.status(400).json({ msg: 'All fields are required' });
    }
  
    try {
      const hashed = bcrypt.hashSync(password, 10);
      const newUser = new User({ email, password: hashed });
      await newUser.save();
      res.status(200).json({ msg: 'Signup successful' });
    } catch (error) {
      next(error); // Error handling
    }
  };

const signIn = async(req, res, next)=>{
    const {email, password} = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(404, 'all fields required'))
    }else{
        try {
            const validUser = await User.findOne({email})
            if (!validUser) {
                return next(errorHandler(400, 'inavlid password'))
            }else{
                const token = jwt.sign(
                    {
                        id: validUser._id, 
                    },
                    "shazaniyu"
                )

                const {password: pass, ...rest} = validUser._doc
                res.render('dashbord', {rest})
                // res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {signup, signIn}