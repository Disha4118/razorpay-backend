const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================
// Create Order
// =======================

exports.createOrder = async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {

            amount: amount * 100,

            currency: "INR",

            receipt: "receipt_" + Date.now()

        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Order Creation Failed"

        });

    }

};


// =======================
// Verify Payment
// =======================

exports.verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;


        const generatedSignature = crypto

            .createHmac(

                "sha256",

                process.env.RAZORPAY_KEY_SECRET

            )

            .update(

                razorpay_order_id +

                "|" +

                razorpay_payment_id

            )

            .digest("hex");


        if (generatedSignature === razorpay_signature) {

            return res.json({

                success: true,

                message: "Payment Verified"

            });

        }


        return res.status(400).json({

            success: false,

            message: "Invalid Signature"

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


// =======================
// Webhook
// =======================

exports.webhook = async (req, res) => {

    try {

        const razorpaySignature = req.headers["x-razorpay-signature"];

        const generatedSignature = crypto

            .createHmac(

                "sha256",

                process.env.WEBHOOK_SECRET

            )

            .update(req.body)

            .digest("hex");


        if (generatedSignature !== razorpaySignature) {

            return res.status(400).json({

                success: false,

                message: "Invalid Webhook Signature"

            });

        }


        const event = JSON.parse(req.body.toString());

        console.log("✅ Webhook Verified");

        console.log("Event :", event.event);


        if (event.event === "payment.captured") {

            const payment = event.payload.payment.entity;

            console.log("Payment ID :", payment.id);

            console.log("Amount :", payment.amount / 100);

            console.log("Status :", payment.status);

            // TODO:
            // Save Payment in MongoDB
            // Confirm Booking
            // Send Email

        }

        return res.status(200).json({

            success: true

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

};