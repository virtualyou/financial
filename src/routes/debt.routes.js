
/*
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
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

