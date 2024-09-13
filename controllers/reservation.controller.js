require("dotenv").config();
const response_message = require("../utils/response");
const { formatDateToDateOnly } = require("../utils/time");

const { User, Reservation, Bill, sequelize } = require("../models/index");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

module.exports = {
    create_reservation: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { customer_id, info } = req.body;

            if (!customer_id || !info) return response_message(res, 404, false, "Missing data!");

            const guest = await User.findByPk(customer_id);
            if (!guest) {
                await transaction.rollback();
                return response_message(res, 404, false, "Guest not found!");
            }

            const createReservation = await Reservation.create({
                host_id: info?.host_id,
                host_fullname: info?.host_fullname,
                host_image: info?.host_image,
                host_email: info?.host_email,
                customer_id,
                customer_fullname: guest?.fullname,
                customer_image: guest?.image,
                customer_email: guest?.email,
                customer_number: info?.customer_number,
                property_id: info?.property_id,
                cover_image: info?.cover_image,
                title: info?.title,
                categories: info?.categories,
                check_in: info?.check_in,
                check_out: info?.check_out,
                status: info?.status             
            }, { transaction });

            const createBill = await Bill.create({
                reservation_id: createReservation?.id,
                payment_intent_id: info?.payment_intent_id,
                nights: info?.nights,
                base_price: info?.base_price,
                airbnb_fee_service: info?.airbnb_fee_service,
                total_amount: info?.total_amount,
                status: createReservation?.status
            }, { transaction });

            if (!createReservation || !createBill) {
                await transaction.rollback();
                return response_message(res, 400, false, "Can't create reservation!");
            }

            await transaction.commit();
            return response_message(res, 200, true, "Success created reservation!");
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            
            return response_message(res, 500, false, "Error from server!");
        }
    },

    get_reservations: async (req, res) => {
        try {
            const { host_id, status } = req.query;

            if (!host_id || !status) return response_message(res, 404, false, "Missing host id or status!");

            const reservations = await Reservation.findAll({
                where: {
                    host_id,
                    status
                },
                include: {
                    model: Bill,
                    as: "bills"
                }
            });

            if (!reservations?.length === 0) return response_message(res, 400, true, "Not founded resetvations!");
            return response_message(res, 200, true, "Successfully retrived reservations!", { reservations });
        }
        catch(error) {
            console.log(error);
            
            return response_message(res, 500, false, "Error from server!");
        }
    },

    cancel_reservation: async (req, res) => {
        try {
            const { reservation_id, payment_intent_id, status, total } = req.query;

            if (!reservation_id) return response_message(res, 404, false, "Missing reservation id!");
            
            let refund;
            if (status === "Upcoming") {
                refund = await stripe.refunds.create({
                    payment_intent: payment_intent_id,
                });
            } else if (status === "Arriving soon") {
                const amountInCents = Math.round(+total * 100);

                refund = await stripe.refunds.create({
                    payment_intent: payment_intent_id,
                    amount: (amountInCents / 2)
                });
            }
            if (refund?.status === "failed") return response_message(res, 400, false, "Refund failed, can't cancel reservation!");

            await Reservation.destroy({
                where: {
                    id: reservation_id
                }
            });

            return response_message(res, 200, true, "Successfully cancel reservation!")
        }
        catch (error) {
            console.log(error);
            return response_message(res, 500, false, "Error from server!");
        }
    },
    
    check_in_reservation: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { reservation_id, check_in, service_fee_percent } = req.body;
            if (!reservation_id || !check_in) return response_message(res, 404, false, "Missing reservation id or check in date!");
            
            // Bắt đầu Lấy ra số ngày trước khi đến ngày check-in
            const checkInDate = new Date(check_in);
            const today = new Date();
            
            today.setHours(0, 0, 0, 0);
            checkInDate.setHours(0, 0, 0, 0);
            
            const diffTime = checkInDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            // Kết thúc

            const reservation = await Reservation.findByPk(
                reservation_id,
                {
                    include: {
                        model: Bill,
                        as: "bills"
                    },
                    transaction  
                }
            );

            const updateReservation = await Reservation.update(
                {
                    check_in: formatDateToDateOnly(new Date()),
                    status: "Currently hosting"
                },
                {
                    where: { id: reservation_id },
                    transaction
                }
            )
            if (!updateReservation) {
                await transaction.rollback();
                return response_message(res, 400, false, "Failed to update reservation!");
            }

            if (diffDays > 0) {
                const nights = reservation?.bills?.nights + diffDays;
                const base_price = reservation?.bills?.base_price;
                const profit_price = Math.ceil(base_price + (base_price * (service_fee_percent / 100)));
                const total_amount = profit_price * nights;
                const airbnb_fee_service = Math.ceil(total_amount * (service_fee_percent / 100));

                const updateBill = await Bill.update(
                    {
                        nights,
                        airbnb_fee_service,
                        total_amount,
                        status: "Currently hosting"
                    },
                    {
                        where: { id: reservation?.bills?.id },
                        transaction
                    }
                )
                if (!updateBill) {
                    await transaction.rollback();
                    return response_message(res, 400, false, "Failed to update bill!");
                }
            } else {
                const updateBill = await Bill.update(
                    {
                        status: "Currently hosting"
                    },
                    {
                        where: { id: reservation?.bills?.id },
                        transaction
                    }
                )
                if (!updateBill) {
                    await transaction.rollback();
                    return response_message(res, 400, false, "Failed to update bill!");
                }
            }

            await transaction.commit(); 
            return response_message(res, 200, true, "Successfully check in!");
        }
        catch(error) {
            await transaction.rollback();
            console.log(error);
            return response_message(res, 500, false, "Error from server!");
        }
    },

    check_out_reservation: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            const { reservation_id, check_out } = req.body;
            if (!reservation_id || !check_out) return response_message(res, 404, false, "Missing reservation id or check out date!");

            const currentDate = new Date();
            const checkOutDate = new Date(check_out);

            currentDate.setHours(0, 0, 0, 0);
            checkOutDate.setHours(0, 0, 0, 0);

            const reservation = await Reservation.findByPk(
                reservation_id,
                {
                    include: {
                        model: Bill,
                        as: "bills"
                    }
                }
            );

            if (currentDate.getTime() === checkOutDate.getTime()) {
                const updateReservation = await Reservation.update(
                    { status: "Checked out" },
                    {
                        where: { id: reservation_id },
                        transaction
                    }
                );
                if (!updateReservation) {
                    await transaction.rollback();
                    return response_message(res, 400, false, "Failed to update reservation!");
                }
            }
            else if (currentDate.getTime() < checkOutDate.getTime()) {
                const updateReservation = await Reservation.update(
                    {   
                        check_out: formatDateToDateOnly(currentDate),
                        status: "Checked out"
                    },
                    {
                        where: { id: reservation_id },
                        transaction
                    }
                );
                if (!updateReservation) {
                    await transaction.rollback();
                    return response_message(res, 400, false, "Failed to update reservation!");
                }
            }

            const updateBill = await Bill.update(
                { status: "Checked out" },
                {
                    where: { id: reservation?.bills?.id },
                    transaction
                }
            )
            if (!updateBill) {
                await transaction.rollback();
                return response_message(res, 400, false, "Failed to update bill!");
            }

            await transaction.commit();
            return response_message(res, 200, true, "Successfully checked out!");
        }
        catch (error) {
            await transaction.rollback();
            console.log(error);
            return response_message(res, 500, false, "Error from server!");
        }
    }
}