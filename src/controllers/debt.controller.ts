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
 * debt.controller.ts
 */

import {Request, Response} from 'express';
import db from '../models';

const Debt = db.debt;

class ExpressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExpressError';
    }
}

const errorHandler = (err: ExpressError, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
};

const getAllDebts = (req: Request, res: Response) => {
    Debt.findAll()
        .then((data: DebtType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getAllDebtsForOwner = (req: Request, res: Response) => {

    Debt.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data: DebtType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getDebt = (req: Request, res: Response) => {
    const id = req.params['id'];

    Debt.findByPk(id)
        .then((data: DebtType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Debt with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getDebtForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Debt.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data: DebtType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Debt with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const createDebtForOwner = (req: Request, res: Response) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
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
        due: req.body.due || "",
        payment: req.body.payment || "",
        userKey: getWhereKey(req)
    };

    // Create Debt using Sequelize
    Debt.create(debt)
        .then((data: DebtType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateDebt = (req: Request, res: Response) => {
    const id = req.params['id'];

    Debt.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
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
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateDebtForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Debt.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num: number) => {
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
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const deleteDebt = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Debt.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
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
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteDebtForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Debt.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req),
        }
    }).then((num: number) => {
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
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllDebts = (req: Request, res: Response) => {

    Debt.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({message: `${nums} Debts were deleted successfully!`});
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllDebtsForOwner = (req: Request, res: Response) => {

    Debt.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({message: `${nums} Debts were deleted successfully!`});
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const getWhereKey = (req: Request) => {
    let key: number;
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }
    return key;
}

const debtController = {
    getAllDebts,
    getAllDebtsForOwner,
    getDebt,
    getDebtForOwner,
    createDebtForOwner,
    updateDebt,
    updateDebtForOwner,
    deleteDebt,
    deleteDebtForOwner,
    deleteAllDebts,
    deleteAllDebtsForOwner
};
export default debtController;
