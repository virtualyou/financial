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
 * asset.routes.ts
 */

import {NextFunction, Request, Response} from "express";
import assetController from "../controllers/asset.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const assetRouter = express();

assetRouter.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

/*
 * ************************************************************************
 * WARNING: Admin only
 * ************************************************************************
 */

// GET - all assets
assetRouter.get(
    "/financial/v1/assets",
    [authJwt.verifyToken, authJwt.isAdmin],
    assetController.getAllAssets
);

// GET - a asset by id
assetRouter.get(
    "/financial/v1/assets/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    assetController.getAsset
);

// PUT - update a asset by id
assetRouter.put(
    "/financial/v1/assets/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    assetController.updateAsset
);

// DELETE - a asset by id
assetRouter.delete(
    "/financial/v1/assets/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    assetController.deleteAsset
);

// DELETE - all assets
assetRouter.delete(
    "/financial/v1/assets",
    [authJwt.verifyToken, authJwt.isAdmin],
    assetController.deleteAllAssets
);

/*
 * ************************************************************************
 * Owner related
 * ************************************************************************
 */

// GET - all assets for owner
assetRouter.get(
    "/financial/v1/owner/assets",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    assetController.getAllAssetsForOwner
);

// GET - asset by id for owner only
assetRouter.get(
    "/financial/v1/owner/assets/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    assetController.getAssetForOwner
);

// POST - create a new Asset for owner (owner or agent cognizant of userKey)
assetRouter.post(
    "/financial/v1/owner/assets",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    assetController.createAssetForOwner
);

// PUT - update a asset for owner only
assetRouter.put(
    "/financial/v1/owner/assets/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    assetController.updateAssetForOwner
);

// DELETE - delete a asset by id for owner only
assetRouter.delete(
    "/financial/v1/owner/assets/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    assetController.deleteAssetForOwner
);

// DELETE - all assets for owner only
assetRouter.delete(
    "/financial/v1/owner/assets",
    [authJwt.verifyToken, authJwt.isOwnerOrAgent],
    assetController.deleteAllAssetsForOwner
);

export default assetRouter;