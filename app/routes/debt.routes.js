/**
 * VirtualYou
 * @license Apache-2.0
 * @author David L Whitehurst
 */

const { authJwt } = require("../utility");
const controller = require("../controllers/debt.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    /*
     * ************************************************************************
     * ADMIN ONLY
     * ************************************************************************
     */
    // GET - all debts
    app.get(
        "/financial/v1/debts",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllDebts
    );

    // GET - a debt by id
    app.get(
        "/financial/v1/debts/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getDebt
    );

    // PUT - update a debt by id
    app.put(
        "/financial/v1/debts/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateDebt
    );

    // DELETE - a debt by id
    app.delete(
        "/financial/v1/debts/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteDebt
    );

    // DELETE - all debts
    app.delete(
        "/financial/v1/debts",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAllDebts
    );

    /*
     * ************************************************************************
     * OWNER, AGENT, (MONITOR?) USER
     * ************************************************************************
     */

    // GET - all debts for owner
    app.get(
        "/financial/v1/owner/debts",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAllDebtsForOwner
    );

    // GET - debt by id for owner only
    app.get(
        "/financial/v1/owner/debts/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getDebtForOwner
    );

    // POST - create a new Debt for owner (owner or agent cognizant of userKey)
    app.post(
        "/financial/v1/owner/debts",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.createDebtForOwner
    );

    // PUT - update a debt for owner only
    app.put(
        "/financial/v1/owner/debts/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.updateDebtForOwner
    );

    // DELETE - delete a debt by id for owner only
    app.delete(
        "/financial/v1/owner/debts/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteDebtForOwner
    );

    // DELETE - all debts for owner only
    app.delete(
        "/financial/v1/owner/debts",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAllDebtsForOwner
    );

};

