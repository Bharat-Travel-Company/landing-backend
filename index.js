import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./src/routes/mainRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use("/", mainRoutes);

const MERCHANT_ID = "your_merchant_id";
const SECRET_KEY = "your_secret_key";
const SALT_KEY = "your_salt_key";
const PHONEPE_API_URL = "https://api.phonepe.com/v3/payment/initiate";

app.post("/api/phonepe/pay", async (req, res) => {
  const { amount, transactionId, userId } = req.body;

  // Create payload with amount, etc.
  const payload = {
    amount, // amount in paisa
    transactionId,
    userId,
    merchantId: MERCHANT_ID,
  };

  // Generate checksum
  const dataString = JSON.stringify(payload);
  const checksum = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(dataString)
    .digest("base64");

  try {
    const response = await axios.post(PHONEPE_API_URL, payload, {
      headers: {
        "X-CHECKSUM": checksum,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

app.listen("3000", () => {
  console.log("listening on 3000");
});

export default app;
