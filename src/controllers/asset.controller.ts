
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
 * asset.controller.ts
 */

import {Request, Response} from 'express';
import db from '../models';

const Asset = db.asset;

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

const getAllAssets = (req: Request, res: Response) => {
    Asset.findAll()
        .then((data:AssetType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getAllAssetsForOwner = (req: Request, res: Response) => {

    Asset.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data:AssetType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getAsset = (req: Request, res: Response) => {
    const id = req.params['id'];

    Asset.findByPk(id)
        .then((data:AssetType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Asset with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getAssetForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Asset.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data:AssetType) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Asset with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const createAssetForOwner = (req: Request, res: Response) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Create new Asset object
    const asset = {
        name: req.body.name || "",
        assetType: req.body.assetType || "",
        accountNo: req.body.accountNo || "",
        website: req.body.website || "",
        websiteUser: req.body.websiteUser || "",
        websitePassword: req.body.websitePassword || "",
        holdingCompany: req.body.holdingCompany || "",
        holdingCompanyAddress: req.body.holdingCompanyAddress || "",
        holdingCompanyPhone: req.body.holdingCompanyPhone || "",
        balance: req.body.balance || "",
        userKey: getWhereKey(req)
    };

    // Create Asset using Sequelize
    Asset.create(asset)
        .then((data:AssetType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateAsset = (req: Request, res: Response) => {
    const id = req.params['id'];

    Asset.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num:number) => {
            if (num == 1) {
                res.send({
                    message: "Asset was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Asset with id=${id} could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateAssetForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Asset.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num:number) => {
            if (num == 1) {
                res.send({
                    message: "Asset was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Asset with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};


const deleteAsset = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Asset.destroy({
        where: {
            id: id
        }
    })
        .then((num:number) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Asset was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Asset was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAssetForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Asset.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    }).then((num:number) => {
        if (num == 1) {
            return res.status(200).send({
                message: "Asset was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Asset was not found!`
            });
        }
    })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllAssets = (req: Request, res: Response) => {

    Asset.destroy({
        where: {},
        truncate: false
    })
        .then((nums:number) => {
            res.status(200).send({ message: `${nums} Assets were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const deleteAllAssetsForOwner = (req: Request, res: Response) => {

    // if ownerId = 0 then user is owner
    Asset.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums:number) => {
            res.status(200).send({ message: `${nums} Assets were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const getWhereKey = (req: Request) => {
    let key: number;
    const user: number  =  parseInt(req.userId);
    const owner: number = parseInt(req.ownerId);

    if (owner === 0) {
        key = user;
        console.log("key " + user);
        return key;
    } else {
        key = owner;
        console.log("bastard key " + owner);
        return key;
    }
}

const assetController = {
    getAllAssets,
    getAllAssetsForOwner,
    getAsset,
    getAssetForOwner,
    createAssetForOwner,
    updateAsset,
    updateAssetForOwner,
    deleteAsset,
    deleteAssetForOwner,
    deleteAllAssets,
    deleteAllAssetsForOwner
};
export default assetController;


