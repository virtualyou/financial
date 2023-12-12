
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
const controller = require("../controllers/asset.controller");

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
    // GET - all assets
    app.get(
        "/financial/v1/assets",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllAssets
    );

    // GET - a asset by id
    app.get(
        "/financial/v1/assets/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAsset
    );

    // PUT - update a asset by id
    app.put(
        "/financial/v1/assets/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updateAsset
    );

    // DELETE - a asset by id
    app.delete(
        "/financial/v1/assets/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAsset
    );

    // DELETE - all assets
    app.delete(
        "/financial/v1/assets",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAllAssets
    );

    /*
     * ************************************************************************
     * OWNER, AGENT, (MONITOR?) USER
     * ************************************************************************
     */

    // GET - all assets for owner
    app.get(
        "/financial/v1/owner/assets",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAllAssetsForOwner
    );

    // GET - asset by id for owner only
    app.get(
        "/financial/v1/owner/assets/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAssetForOwner
    );

    // POST - create a new Asset for owner (owner or agent cognizant of userKey)
    app.post(
        "/financial/v1/owner/assets",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.createAssetForOwner
    );

    // PUT - update a asset for owner only
    app.put(
        "/financial/v1/owner/assets/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.updateAssetForOwner
    );

    // DELETE - delete a asset by id for owner only
    app.delete(
        "/financial/v1/owner/assets/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAssetForOwner
    );

    // DELETE - all assets for owner only
    app.delete(
        "/financial/v1/owner/assets",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAllAssetsForOwner
    );

};

