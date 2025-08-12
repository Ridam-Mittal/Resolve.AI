import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './../models/user.js';
import { inngest } from './../inngest/client.js';



export const signup = async (req, res) => {
    try {
        const { email, password, skills=[] } = req.body;

        if(!email || !password){
            return res.status(400).json({error: "Email or Password is not entered"});
        }
        
        if(password.length < 6){
            return res.status(400).json({error: "Minimum password length should be 6"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({error: "Account with this Email already exists"});
        }
        
        const hashedpassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedpassword,
            skills 
        })

        
        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res.status(500).json({error: "Something went wrong while registering the user."});
        }

        // Fire inngest event
        await inngest.send({
            name: "user/signup",
            data: {
                email
            }
        })


        const token = jwt.sign(
            {_id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        res.cookie("token", token, options);

        return res.status(200).json({message: "Account created.", user: createdUser, token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({error: "Email or Password is not entered"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({error: "Account doesn't exists"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid credentials"})
        }


        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            return res.status(500).json({error: "Something went wrong while Logging in"});
        }


        const token = jwt.sign(
            {_id: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        };

        // res.cookie("token", token, options);
        
        return res.status(200).json({message: "User Logged in", user: createdUser, token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const logout = async (req, res) => {
    try{
        // res.clearCookie('token');
        res.status(200).json({message: "Logged out successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}



export const updateUser = async (req, res) => {
    try {
        const {skills = [], role, email} = req.body;
        if(req.user?.role !== 'admin'){
            return res.status(403).json({ error: "Forbidden"});
        } 
        const user = await User.findOne({email}).select("-password");
        if(!user){
            return res.status(401).json({error: "User not found" });
        }

        await user.updateOne({
            skills: skills.length ? skills : user.skills,
            role: role || user.role
        });

        res.status(200).json({ message: "User updated successfully", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const SelfUpdate = async (req, res) => {
    try {
        const { skills = [], email } = req.body;
        if(req?.user?.role === 'user'){
            return res.status(403).json({ error: "Forbidden"});
        }

        const user = await User.findOne({email}).select("-password");
        if(!user){
            return res.status(401).json({error: "User not found" });
        }

         // Update skills (if array) and email (if different)
        if (Array.isArray(skills)) {
            user.skills = skills;
        }

        if (email && email !== user.email) {
            user.email = email;
        }

        await user.save();

        return res.status(200).json({ message: "User updated successfully",  user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}




export const getUsers = async (req, res) => {
    try {
        if(req.user?.role !== 'admin'){
            return res.status(403).json({ error: "Forbidden"});
        }
        const users = await User.find().select("-password");
        users.sort((a, b) => a.role.charCodeAt(0) - b.role.charCodeAt(0));
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}