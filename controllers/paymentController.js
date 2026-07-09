const crypto = require("crypto");

exports.webhook = async (req, res) => {

    try {

        const webhookSignature =
            req.headers["x-razorpay-signature"];

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.WEBHOOK_SECRET
            )
            .update(req.body) // Raw Buffer
            .digest("hex");

        if (generatedSignature !== webhookSignature) {

            return res.status(400).json({
                success: false,
                message: "Invalid Webhook Signature"
            });

        }

        const event = JSON.parse(req.body.toString());

        console.log("✅ Webhook Verified");

        console.log("Event :", event.event);

        if (event.event === "payment.captured") {

            const payment =
                event.payload.payment.entity;

            console.log("Payment Id :", payment.id);

            console.log("Amount :", payment.amount);

            console.log("Status :", payment.status);

            // TODO:
            // MongoDB update
            // Booking Confirm
            // Send Email

        }

        res.status(200).json({
            success: true
        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });

    }

};