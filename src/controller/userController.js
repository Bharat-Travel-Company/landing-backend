import Form from "../models/dbUserSchema.js";
import nodemailer from "nodemailer";

const createUser = async (req, res) => {
  const { name, phone, email, numberOfMembers, selectedPackage } = req.body;

  if (!name && !email && !phone) {
    return res.status(500).json({ message: "All feilds are our required" });
  }

  try {
    // Check if email and phone number already exists
    const existingUser = await Form.findOne({ email, phone });
    if (existingUser) {
      return res.status(400).json({
        message:
          "This email and phone number already exist. Please use different combination.",
      });
    }

    // Save data to the database
    const formData = new Form({
      name,
      phone,
      email,
      numberOfMembers,
      selectedPackage,
    });
    await formData.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "query.connecttrip@gmail.com",
        pass: "kfxh qxuc llvs uyde",
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
      from: "query.connecttrip@gmail.com",
      to: "query.connecttrip@gmail.com",
      subject: `Contact form submission from ${name}`,
      html: emailBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "form not sended" });
      }
      res.status(200).json({ message: "Form submitted successfully" });
    });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({
      message: "Form Submitted failed",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const leads = await Form.find(); // Fetch all data from the Form collection

    // Start building the HTML table
    let tableHTML = `
      <html>
        <head>
          <title>User Details</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid black;
              padding: 10px;
              text-align: left;
            }
            th {
              background-color: orange;
              color: black;
              font-weight: bold;
            }
            h1 {
              text-align: center;
              // margin-top: 20px;
              font-weight: bold;
              color: black;
              background-color: orange;
              padding: 10px;
              width: fit-content;
              margin: 20px auto; /* Center align the heading */
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <h1>User Details</h1>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Selected Package</th>
                <th>No. of Members</th>
              </tr>
            </thead>
            <tbody>
    `;

    // Add rows to the table for each user
    leads.forEach((lead, index) => {
      tableHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${lead.name || "N/A"}</td>
          <td>${lead.email || "N/A"}</td>
          <td>${lead.phone || "N/A"}</td>
          <td>${lead.selectedPackage || "N/A"}</td>
          <td>${lead.numberOfMembers || "N/A"}</td>
        </tr>
      `;
    });

    // Close the table and HTML
    tableHTML += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Return the HTML response
    res.status(200).send(tableHTML);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
};

const editUser = (req, res) => {
  const { name, phone, email, numberOfMembers, selectedPackage } = req.body;

  if (!name && !email && !phone) {
    return res.status(500).json({ message: "All feilds are our required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "query.connecttrip@gmail.com",
      pass: "kfxh qxuc llvs uyde",
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
    from: "query.connecttrip@gmail.com",
    to: "query.connecttrip@gmail.com",
    subject: `Contact form submission from ${name}`,
    html: emailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "form not sended" });
    }
    res.status(200).json({ message: "Form submitted successfully" });
  });
};

export default {
  createUser,
  getAllUsers,
  editUser,
};
