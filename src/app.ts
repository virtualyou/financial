/*
 *
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
 * app.ts
 */

import express, {type Express} from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import db from "./models/index";
import assetRouter from "./routes/asset.routes";
import debtRouter from "./routes/debt.routes";
import cookieSession from "cookie-session";
import * as process from "process";

// swagger api documentation
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";


const initIndex = process.argv.indexOf("--init=true");
const init = initIndex !== -1;

const app: Express = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    cookieSession({
        name: "virtualyou-session",
        keys: ["COOKIE_SECRET"],
        //domain: '.virtualyouplan.com',
        httpOnly: true,
        sameSite: 'strict'
    })
);

app.use(function (_req, res, next) {
    res.setTimeout(120000, function () {
        console.log('Request has timed out.');
        res.send(408);
    });
    next();
});

app.get("/", (_req, res) => {
    res.send("Welcome to the VirtualYou Financial API.");
});

// swagger path to api documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// database
const Asset = db.asset;
const Debt = db.debt;

if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log("Drop and Resync Db");
        initial();
    });
} else {
    db.sequelize.sync();
}

// routes
app.use(assetRouter);
app.use(debtRouter);


// create reference objects
function initial() {
// new objects
    Asset.create({
        name: "Savings LFCU",
        assetType: "Savings",
        accountNo: "AT-00-9999234",
        website: "https://lfcu.com",
        websiteUser: "popeye2",
        websitePassword: "ssap123",
        holdingCompany: "Langley Federal Credit Union",
        holdingCompanyAddress: "45 Stagecoach Ln, Carson City, NV, 25289",
        holdingCompanyPhone: "800-429-2035",
        balance: "15000.00",
        userKey: 1
    });

    Asset.create({
        name: "Checking LFCU",
        assetType: "Regular Checking",
        accountNo: "AT-00-9999235",
        website: "https://lfcu.com",
        websiteUser: "popeye2",
        websitePassword: "ssap123",
        holdingCompany: "Langley Federal Credit Union",
        holdingCompanyAddress: "45 Stagecoach Ln, Carson City, NV, 25289",
        holdingCompanyPhone: "800-429-2035",
        balance: "3879.13",
        userKey: 1
    });

    Debt.create({
        name: "Water Utility",
        debtType: "Utility",
        accountNo: "123456",
        website: "https://vawater.gov",
        websiteUser: "guitarman77",
        websitePassword: "pass123",
        holdingCompany: "Virginia Water Utility",
        holdingCompanyAddress: "23 North Pike, Petersburg, VA 12345",
        holdingCompanyPhone: "800-123-4567",
        balance: "0.00",
        frequency: "Monthly",
        due: "11/15/2023",
        payment: "65.75",
        userKey: 1
    });

    Debt.create({
        name: "Dominion Power",
        debtType: "Utility",
        accountNo: "123783",
        website: "https://vadominion.com",
        websiteUser: "consumerHog62",
        websitePassword: "pass123",
        holdingCompany: "VA Dominion Power Inc.",
        holdingCompanyAddress: "2344 Taylor Ln, Richmond, VA 23799",
        holdingCompanyPhone: "800-877-1938",
        balance: "0.00",
        frequency: "Monthly",
        due: "11/15/2023",
        payment: "178.24",
        userKey: 1
    });

    Debt.create({
        name: "Rocket Mortgage",
        debtType: "Mortgage",
        accountNo: "823-100009",
        website: "https://rocket.com",
        websiteUser: "dlw12999",
        websitePassword: "pass123",
        holdingCompany: "Rocket Mortgage LLC",
        holdingCompanyAddress: "399 West Toll Road, Sterling, VA 28444",
        holdingCompanyPhone: "800-940-2309",
        balance: "0.00",
        frequency: "Monthly",
        due: "12/01/2023",
        payment: "1478.02",
        userKey: 1
    });
}

export default app;
