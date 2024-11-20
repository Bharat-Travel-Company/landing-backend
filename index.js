import express from "express";
import cors from "cors";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import mongoose from "mongoose";
import Form from "./dbSchema.js";

dotenv.config()

// Database Connection
try {
    mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`)
    // console.log("Database Connected Successfully")
} catch (error) {
    res.status(500).send({message:"Internal Server Error",
        error:error.message
        })
    // console.log(error)
}

const app = express()

app.use(cors({
    origin:'*',
    credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.post("/send-email/userDetails", async (req,res) => {
    const {name, phone, email, numberOfMembers, selectedPackage} = req.body

    if(!name && !email && !phone){
        return res.status(500).json({message: "All feilds are our required"})
    }

    try {
      // Check if email and phone number already exists
      const existingUser = await Form.findOne({email, phone });
      if(existingUser){
        return res.status(400).json({
          message: "This email and phone number already exist. Please use different combination."
        });
      }

      // Save data to the database
        const formData = new Form({ name, phone, email, numberOfMembers, selectedPackage });
        await formData.save();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'query.connecttrip@gmail.com',
          pass: 'kfxh qxuc llvs uyde',
        },
      });

      const emailBody = `
      <h2>Form Submission Details</h2>
      <table border="1" cellpadding="10" cellspacing="0">
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${email}</td>
        </tr>
        <tr>
          <td>No. Of Members</td>
          <td>${numberOfMembers}</td>
        </tr>
        <tr>
          <td>Phone</td>
          <td>${phone}</td>
        </tr>
        <tr>
          <td>Destination</td>
          <td>${selectedPackage}</td>
        </tr>
      </table>
    `;
      const mailOptions = {
        from: 'query.connecttrip@gmail.com',
        to: 'query.connecttrip@gmail.com',
        subject: `Contact form submission from ${name}`,
        html: emailBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({message: "form not sended"});
        }
        res.status(200).json({message: "Form submitted successfully"});
      });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).json({
          message: "Form Submitted failed"
        });
    }

})


app.put("/send-email", (req,res) => {
  const {name, phone, email, numberOfMembers, selectedPackage} = req.body

  if(!name && !email && !phone){
      return res.status(500).json({message: "All feilds are our required"})
  }

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'query.connecttrip@gmail.com',
        pass: 'kfxh qxuc llvs uyde',
      },
    });

    const emailBody = `
    <h2>Form Submission Details</h2>
    <table border="1" cellpadding="10" cellspacing="0">
      <tr>
        <th>Field</th>
        <th>Value</th>
      </tr>
      <tr>
        <td>Name</td>
        <td>${name}</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>${email}</td>
      </tr>
      <tr>
        <td>No. Of Members</td>
        <td>${numberOfMembers}</td>
      </tr>
      <tr>
        <td>Phone</td>
        <td>${phone}</td>
      </tr>
      <tr>
        <td>Destination</td>
        <td>${selectedPackage}</td>
      </tr>
    </table>
  `;
      const mailOptions = {
        from: 'query.connecttrip@gmail.com',
        to: 'query.connecttrip@gmail.com',
        subject: `Contact form submission from ${name}`,
        html: emailBody,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({message: "form not sended"});
        }
        res.status(200).json({message: "Form submitted successfully"});
      });

})

const MERCHANT_ID = 'your_merchant_id';
const SECRET_KEY = 'your_secret_key';
const SALT_KEY = 'your_salt_key';
const PHONEPE_API_URL = 'https://api.phonepe.com/v3/payment/initiate';

app.post('/api/phonepe/pay', async (req, res) => {
    const { amount, transactionId, userId } = req.body;
    
    // Create payload with amount, etc.
    const payload = {
        amount,  // amount in paisa
        transactionId,
        userId,
        merchantId: MERCHANT_ID,
    };

    // Generate checksum
    const dataString = JSON.stringify(payload);
    const checksum = crypto.createHmac('sha256', SECRET_KEY)
                           .update(dataString)
                           .digest('base64');

    try {
        const response = await axios.post(PHONEPE_API_URL, payload, {
            headers: {
                'X-CHECKSUM': checksum,
                'Content-Type': 'application/json',
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});


// npm install express axios crypto






app.listen("3000",() => {
    console.log("listening on 3000")
})

export default app;