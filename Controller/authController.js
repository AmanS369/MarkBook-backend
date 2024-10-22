import User from "../Database/Model/userModel.js";
import Space from "../Database/Model/spaceModel.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "firebase-admin"; // Make sure to import Firebase Admin SDK
import { hash, compare } from "../Utils/authHelper.js";
import UserCollection from "../Database/Model/userCollection.js";
dotenv.config();
export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    //validation
    const ex_user = await User.findOne({ email });
    if (ex_user) {
      return res.status(200).send({
        success: false,
        message: "already registered",
      });
    }
    const hashpass = await hash(password);

    // Create default QuickBits space

    //save user
    const user = new User({
      name,
      email,
      phone,
      password: hashpass,
    });
    await user.save();

    const defaultSpace = new Space({
      title: "QuickBits",
      description: "Quick Spaces Bit",
    });
    await defaultSpace.save();

    const userCollection = new UserCollection({
      userID: user._id,
      defaultSpace: defaultSpace._id,
    });

    await userCollection.save();

    // Update space with owner information

    res.status(201).send({
      success: true,
      message: "User registered and default space created",
      user: {
        name: user.name,
        email: user.email,
        defaultSpace: {
          id: defaultSpace._id,
          title: defaultSpace.title,
        },
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      success: false,
      message: "Error in registration",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const match = await compare(password, user.password);

      if (match) {
        const token = await JWT.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: "70d",
        });

        // Generate Firebase custom token
        const firebaseToken = await admin
          .auth()
          .createCustomToken(user._id.toString());

        res.status(200).send({
          message: "Welcome",
          user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
          token,
          firebaseToken,
        });
      } else {
        res.status(400).send({ message: "Incorrect password" });
      }
    } else {
      res.status(404).send({ message: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error in login" });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).send({ message: "Logout successful" });
};

// export const updateProfile = async (req, res) => {
//   try {
//     const { name, email, phone, address } = req.body;
//     const user = await User.findById(req.user._id);

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         name: name || user.name,
//         phone: phone || user.phone,
//         address: address || user.address,
//       },
//       { new: true },
//     );
//     //save

//     res.status(200).send({
//       success: true,
//       message: "PRofile Update",
//       updatedUser,
//     });
//   } catch (e) {
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//     });
//     console.log(e);
//   }
// };

// //send amil;
// const sendResetPasswordMail = async (name, email, token) => {
//   console.log(name);

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: config.user,
//         pass: config.pass,
//       },
//     });
//     const mailOptions = {
//       from: config.user,
//       to: email,
//       subject: "Reset Password - JJK ECOMMERCE",
//       html: `
//               <html>
//                 <head>
//                   <style>
//                     @import url('https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap');

//                     body {
//                       font-family: 'Roboto', Arial, sans-serif;
//                       background-color: #f4f4f4;
//                     }
//                     .container {
//                       max-width: 600px;
//                       margin: 0 auto;
//                       padding: 20px;
//                       background-color: #ffffff;
//                       border: 1px solid #e0e0e0;
//                       border-radius: 4px;
//                     }
//                     .header {
//                       text-align: center;
//                       margin-bottom: 20px;
//                     }
//                     .header h2 {
//                       color: #333333;
//                     }
//                     .content {
//                       margin-top: 20px;
//                       padding: 20px;
//                       background-color: #f8f8f8;
//                       border-radius: 4px;
//                     }
//                     .button {
//                       display: inline-block;
//                       background-color: #4CAF50;
//                       color: #ffffff;
//                       padding: 10px 20px;
//                       text-align: center;
//                       text-decoration: none;
//                       border-radius: 4px;
//                       transition: background-color 0.3s ease;
//                     }
//                     .button:hover {
//                       background-color: #45a049;
//                     }
//                   </style>
//                 </head>
//                 <body>
//                   <div class="container">
//                     <div class="header">
//                       <h2>Reset Password - JJK ECOMMERCE</h2>
//                     </div>
//                     <div class="content">
//                       <p>Hi ${name},</p>
//                       <p>Please click the link below to reset your password:</p>
//                       <p>
//                         <a class="button" href="${
//                           process.env.PASSWORD_CHANGE_LINK + token
//                         }">Reset Password</a>
//                       </p>
//                     </div>
//                   </div>
//                 </body>
//               </html>
//             `,
//     };
//     transporter.sendMail(mailOptions, function (error, infor) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("mail sent");
//       }
//     });
//   } catch (e) {
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//     });
//     console.log(e);
//   }
// };

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const ex_user = await User.findOne({ email });
//     const resettoken = randomstring.generate();

//     console.log(resettoken);

//     if (ex_user) {
//       const data = await User.updateOne(
//         { email: email },
//         { $set: { reset_token: resettoken } },
//       );

//       sendResetPasswordMail(ex_user?.name, email, resettoken);
//       res.status(200).send({
//         success: true,
//         message: " Reset Link send to Email",
//         data,
//       });
//     } else {
//       res.status(200).send({
//         success: false,
//         message: "No such User Exist",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
// export const resetPassword = async (req, res) => {
//   try {
//     const token = req.query.token;
//     console.log(token);
//     const tokendata = await User.findOne({ reset_token: token });
//     console.log(tokendata?.name);
//     if (tokendata) {
//       const password = req.body.password;
//       const hashpass = await hash(password);
//       const { userData } = await User.findByIdAndUpdate(
//         { _id: tokendata._id },
//         { $set: { password: hashpass, token: "" } },
//         { new: true },
//       );
//       res.status(200).send({
//         success: true,
//         message: "Password changed",
//         userData,
//       });
//     } else {
//       res.status(500).send({
//         success: false,
//         message: "link expired",
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).send({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };
