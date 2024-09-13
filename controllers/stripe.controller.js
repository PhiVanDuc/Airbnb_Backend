require("dotenv").config();

const message_response = require("../utils/response");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {
    create_payment_intent: async (req, res) => {
        try {
            const { amount } = req.body;
            
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd",
                automatic_payment_methods: { enabled: true }
            });

            return message_response(res, 200, true, "Successfully created payment intent!", { paymentIntent });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    },

    get_payment_detail: async (req, res) => {
        try {
            const clientSecret = req.params.client_secret;            

            if (clientSecret === "undefined" || !clientSecret) message_response(res, 400, false, "Missing client secret!");

            const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);
            const paymentMethod = await stripe.paymentMethods.retrieve(paymentIntent?.payment_method);
            return message_response(res, 200, true, "Successfully get detail payment intent!", { paymentIntent, paymentMethod });
        }
        catch(error) {
            console.log(error);
            return message_response(res, 500, false, "Error from server!");
        }
    }
}