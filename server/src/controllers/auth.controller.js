import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export const signup = async (req, res) => {
    try {
        const { email , password , username, image } = req.body;

        if(!email || !username || !password){
            return res.status(400).json({
                success: false,
                messgae: "Email , username , password are required",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            },
        });

        if(existingUser){
            return res.status(400).json({
                success: false,
                messgae: "User with this maik already exist",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
              email: email.toLowerCase(),
              password: hashedPassword,
              username,
              image
            },
        });
        const token = jwt.sign(
        {
        userId: user.id,
        email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EPIRES_IN
        }
        );
        return res.status(201).json({
            success: true,
            messgae: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                bio: user.bio,
                image: user.image,
                ble_id: user.ble_id
            }
        })
    } catch (error) {
        console.log("error in signup");
         return res.status(500).json({
                success: false,
                messgae: "Internal server error",
            });
    }
}



export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if(!email || !password){
          return res.status(400).json({
              success: false,
              messgae: "Email , username , password are required",
          });
      }

      const user = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase(),
        }
      });
      if(!user){
         return res.status(401).json({
            success: false,
            messgae: "Invalid credentials",
        });
      }
      const ispasswordValid = await bcrypt.compare(password, user.password);
      if(!ispasswordValid){
         return res.status(401).json({
            success: false,
            messgae: "Invalid credentials",
        });        
      }
      const token = jwt.sign(
        {
        userId: user.id,
        email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EPIRES_IN
        }
    );

    return res.status(201).json({
        success: true,
        messgae: "User registered successfully",
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
            ble_id: user.ble_id
        }
    })
    } catch (error) {
        console.log("error in login");
        return res.status(500).json({
            success: false,
            messgae: "Internal server error",
        });
    }
}