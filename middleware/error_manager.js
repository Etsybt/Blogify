const { errors } = require("../errors")
const errorManager = (err, req, res, next) => {
    const status_res = res.status_res ? res.status_res : 500;

    switch (status_res) {
        case errors.VALIDATION_ERROR:
            res.json({
                title: "Not Valid",
                message: err.message,
                stackTrace: err.stack
            });

            break;
        case errors.NOT_FOUND:
            res.json({
                title: "Not Found",
                message: err.message,
                stackTrace: err.stack
            });

        case errors.UNAUTHORIZED:
            res.json({
                title: "Unauthorizes",
                message: err.message,
                stackTrace: err.stack
            });

        case errors.FROBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
                stackTrace: err.stack
            });

        case errors.SERVER_ERR:
            res.json({
                title: "Server error",
                message: err.message,
                stackTrace: err.stack
            });


        default:
            console.log("No errors, all's working fine!");
            break;
    }
};

module.exports = errorManager;