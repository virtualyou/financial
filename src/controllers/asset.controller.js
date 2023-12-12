
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

const db = require("../models");
const {locals} = require("express/lib/application");
const Asset = db.asset;

/**
 * This asynchronous controller function returns a list of all Assets.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Asset objects
 */

exports.getAllAssets = (req, res) => {
    Asset.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving assets."
            });
        });
};

/**
 * This asynchronous controller function returns a list of
 * Assets specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Asset objects
 */

exports.getAllAssetsForOwner = (req, res) => {

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Asset.findAll({
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
                    err.message || "Internal server error occurred while retrieving assets."
            });
        });
};

/**
 * This controller function returns a Asset
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Asset object
 */

exports.getAsset = (req, res) => {
    const id = req.params.id;

    Asset.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Asset with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Asset with id=" + id
            });
        });
};

/**
 * This controller function returns a Asset
 * based on it's id and ONLY IF the Asset belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Asset object
 */

exports.getAssetForOwner = (req, res) => {
    const id = req.params.id;

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Asset.findOne({
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
                    message: `May not belong to Owner or cannot find this Asset with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Asset with id=" + id
            });
        });
};

/**
 * This controller function creates a Asset
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
exports.createAssetForOwner = (req, res) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Asset
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
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
        userKey: req.body.userKey || 0
    };
/*
{
  "name": "Savings",
  "assetType": "Savings",
  "accountNo": "AT-00-9999234",
  "website": "https://wellsfargo.com",
  "websiteUser": "popeye2",
  "websitePassword": "ssap123",
  "holdingCompany": "Wells Fargo",
  "holdingCompanyAddress": "45 Stagecoach Ln, Carson City, NV, 25289",
  "holdingCompanyPhone": "800-429-2035",
  "balance": "5000.00",
  "userKey": 10
}
 */

    // Create Asset using Sequelize
    Asset.create(asset)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An internal server error occurred creating the Asset."
            });
        });
};

exports.updateAsset = (req, res) => {
    const id = req.params.id;

    Asset.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
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
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Asset with id=" + id
            });
        });
};

exports.updateAssetForOwner = (req, res) => {
    const id = req.params.id;

    // Owner may be creating the Asset
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Asset.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then(num => {
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
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Asset with id=" + id
            });
        });
};


/**
 * This asynchronous controller function deletes a Asset
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAsset = (req, res) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Asset.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
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
        .catch(err => {
            return res.status(500).send({
                message: "Asset with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes a Asset
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

exports.deleteAssetForOwner = (req, res) => {
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
    Asset.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then(num => {
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
        .catch(err => {
            return res.status(500).send({
                message: "Asset with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Assets.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllAssets = (req, res) => {

    Asset.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Assets were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating assets!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Assets for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllAssetsForOwner = (req, res) => {

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Asset.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Assets were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating assets!"
            });
        });
}

