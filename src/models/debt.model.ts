
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
 * debt.model.ts
 */

import { DataTypes } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debt = (sequelize: any, Sequelize: any) => {
    return sequelize.define("debts", {
        name: {
            type: Sequelize.STRING
        },
        debtType: {
            type: Sequelize.STRING
        },
        accountNo: {
            type: Sequelize.STRING
        },
        website: {
            type: Sequelize.STRING
        },
        websiteUser: {
            type: Sequelize.STRING
        },
        websitePassword: {
            type: Sequelize.STRING
        },
        holdingCompany: {
            type: Sequelize.STRING
        },
        holdingCompanyAddress: {
            type: Sequelize.STRING
        },
        holdingCompanyPhone: {
            type: Sequelize.STRING
        },
        balance: {
            type: Sequelize.STRING
        },
        frequency: {
            type: Sequelize.STRING
        },
        due: {
            type: DataTypes.DATE,
            allowNull: true
        },
        payment: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};
export default debt;
