/**
 * VirtualYou
 * @license Apache-2.0
 * @author David L Whitehurst
 */

const db = require("../models");
const {locals} = require("express/lib/application");
const Debt = db.debt;

/**
 * This asynchronous controller function returns a list of all Debts.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Debt objects
 */

exports.getAllDebts = (req, res) => {
    Debt.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving debts."
            });
        });
};

/**
 * This asynchronous controller function returns a list of
 * Debts specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Debt objects
 */

exports.getAllDebtsForOwner = (req, res) => {

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Debt.findAll({
            where: {
                userKey: key,
            },
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving debts."
            });
        });
};

/**
 * This controller function returns a Debt
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Debt object
 */

exports.getDebt = (req, res) => {
    const id = req.params.id;

    Debt.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Debt with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Debt with id=" + id
            });
        });
};

/**
 * This controller function returns a Debt
 * based on it's id and ONLY IF the Debt belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Debt object
 */

exports.getDebtForOwner = (req, res) => {
    const id = req.params.id;

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Debt.findOne({
        where: {
            id: id,
            userKey: key
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Debt with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Debt with id=" + id
            });
        });
};

/**
 * This controller function creates a Debt
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
exports.createDebtForOwner = (req, res) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Debt
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // Create new Debt object
    const debt = {
        name: req.body.name || "",
        debtType: req.body.debtType || "",
        accountNo: req.body.accountNo || "",
        website: req.body.website || "",
        websiteUser: req.body.websiteUser || "",
        websitePassword: req.body.websitePassword || "",
        holdingCompany: req.body.holdingCompany || "",
        holdingCompanyAddress: req.body.holdingCompanyAddress || "",
        holdingCompanyPhone: req.body.holdingCompanyPhone || "",
        balance: req.body.balance || "",
        frequency: req.body.frequency || "",
        due: new Date(req.body.due || null),
        payment: req.body.payment || "",
        userKey: req.body.userKey || 0
    };

    // Create Debt using Sequelize
    Debt.create(debt)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An internal server error occurred creating the Debt."
            });
        });
};

exports.updateDebt = (req, res) => {
    const id = req.params.id;

    Debt.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Debt was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Debt with id=${id} could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Debt with id=" + id
            });
        });
};

exports.updateDebtForOwner = (req, res) => {
    const id = req.params.id;

    // Owner may be creating the Debt
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Debt.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Debt was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Debt with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Debt with id=" + id
            });
        });
};


/**
 * This asynchronous controller function deletes a Debt
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteDebt = (req, res) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Debt.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Debt was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Debt was not found!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Debt with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes a Debt
 * based on it's id and ONLY if it belongs to the
 * Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteDebtForOwner = (req, res) => {
    // url parameter
    const id = req.params.id;

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // delete specific record
    Debt.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then(num => {
        if (num == 1) {
            return res.status(200).send({
                message: "Debt was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Debt was not found!`
            });
        }
    })
        .catch(err => {
            return res.status(500).send({
                message: "Debt with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Debts.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllDebts = (req, res) => {

    Debt.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Debts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating debts!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Debts for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllDebtsForOwner = (req, res) => {

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Debt.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Debts were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating debts!"
            });
        });
}

