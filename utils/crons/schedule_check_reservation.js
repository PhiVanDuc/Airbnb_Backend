const { Reservation, Bill } = require("../../models/index");
const { Op } = require("sequelize");
const moment = require("moment");

const schedule_check_reservation = async () => {
    try {
        const currentDateTime = moment(); // Lấy thời gian hiện tại

        // 1. Tìm kiếm và cập nhật bills với reservation có status là "Upcoming"
        const upcomingBills = await Bill.findAll({
            include: [{
                model: Reservation,
                as: "reservations",
                where: {
                    status: "Upcoming",
                    check_in: {
                        [Op.between]: [currentDateTime.toDate(), currentDateTime.add(24, 'hours').toDate()]
                    }
                }
            }]
        });

        for (let bill of upcomingBills) {
            await bill.update({ status: "Arriving soon" });
            await bill.reservations.update({ status: "Arriving soon" });
        }

        // 2. Tìm kiếm và xóa bills với reservation có status là "Arriving soon"
        const arrivingSoonBills = await Bill.findAll({
            include: [{
                model: Reservation,
                as: "reservations",
                where: {
                    status: "Arriving soon",
                    check_in: {
                        [Op.gt]: currentDateTime.add(24, 'hours').toDate()
                    }
                }
            }]
        });

        for (let bill of arrivingSoonBills) {
            await bill.Reservation.destroy();
        }

        // 3. Tìm kiếm và cập nhật bills với reservation có status là "Currently hosting"
        const currentlyHostingBills = await Bill.findAll({
            include: [{
                model: Reservation,
                as: "reservations",
                where: {
                    status: "Currently hosting",
                    check_out: currentDateTime.toDate()
                }
            }]
        });

        for (let bill of currentlyHostingBills) {
            await bill.update({ status: "Checking out" });
            await bill.reservations.update({ status: "Checking out" });
        }

    } catch (error) {
        console.error("Error in schedule_check_reservation:", error);
    }
}

module.exports = schedule_check_reservation;
