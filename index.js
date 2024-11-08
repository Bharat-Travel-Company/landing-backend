import express from "express";
import cors from "cors";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors({
    origin:'*',
    credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.post("/send-email", (req,res) => {
    const {name, phone, email, numberOfMembers, selectedPackage, specialReq} = req.body

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
        <tr>
          <td>Special Requirements</td>
          <td>${specialReq}</td>
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


app.put("/send-email", (req,res) => {
  const {name, phone, email, numberOfMembers, selectedPackage, specialReq} = req.body

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
      <tr>
          <td>Special Requirements</td>
          <td>${specialReq}</td>
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
    console.log("listning on 3000")
})
