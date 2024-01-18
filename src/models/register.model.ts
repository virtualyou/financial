
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
 * register.model.ts
 */

import { DataTypes } from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const register = (sequelize: any, Sequelize: any) => {
    return sequelize.define("registers", {
        transDate: { // dayNumber converts to real date
            type: DataTypes.DATE,
            allowNull: true
        },
        name: {
            type: Sequelize.STRING
        },
        creditColumn: {
            type: Sequelize.STRING
        },
        cleared: { // number for month e.g. Jan would be 1
            type: Sequelize.STRING
        },
        debitColumn: {
            type: Sequelize.STRING
        },
        balanceColumn: {
            type: Sequelize.STRING
        },
        reconcileDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};
export default register;
