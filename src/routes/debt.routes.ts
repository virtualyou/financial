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
 * debt.routes.ts
 */

import {NextFunction, Request, Response} from "express";
import debtController from "../controllers/debt.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const debtRouter = express();

debtRouter.use(function (_req: Request, res: Response, next: NextFunction) {
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
debtRouter.get(
    "/financial/v1/debts",
    [authJwt.verifyToken, authJwt.isAdmin],
    debtController.getAllDebts
);

// GET - a debt by id
debtRouter.get(
    "/financial/v1/debts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    debtController.getDebt
);

// PUT - update a debt by id
debtRouter.put(
    "/financial/v1/debts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    debtController.updateDebt
);

// DELETE - a debt by id
debtRouter.delete(
    "/financial/v1/debts/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    debtController.deleteDebt
);

// DELETE - all debts
debtRouter.delete(
    "/financial/v1/debts",
    [authJwt.verifyToken, authJwt.isAdmin],
    debtController.deleteAllDebts
);

/*
 * ************************************************************************
 * OWNER, AGENT, (MONITOR?) USER
 * ************************************************************************
 */

// GET - all debts for owner
debtRouter.get(
    "/financial/v1/owner/debts",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    debtController.getAllDebtsForOwner
);

// GET - debt by id for owner only
debtRouter.get(
    "/financial/v1/owner/debts/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    debtController.getDebtForOwner
);

// POST - create a new Debt for owner (owner or agent cognizant of userKey)
debtRouter.post(
    "/financial/v1/owner/debts",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    debtController.createDebtForOwner
);

// PUT - update a debt for owner only
debtRouter.put(
    "/financial/v1/owner/debts/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    debtController.updateDebtForOwner
);

// DELETE - delete a debt by id for owner only
debtRouter.delete(
    "/financial/v1/owner/debts/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    debtController.deleteDebtForOwner
);

// DELETE - all debts for owner only
debtRouter.delete(
    "/financial/v1/owner/debts",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    debtController.deleteAllDebtsForOwner
);

export default debtRouter;