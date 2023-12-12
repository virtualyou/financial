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
 * endpoints.test.ts
 */

import request from "supertest";
import app from "../src/app";

describe("Test get all owner assets", () => {
  const agent = request.agent(app);
  it("GET /financial/v1/owner/assets", async () => {
    const response2 = await agent.get("/financial/v1/owner/assets"); //.set(cookie);
    expect(response2.statusCode).toBe(403);
    expect(response2.type).toBe("application/json");
    expect(response2.body).toEqual({"message": "No token provided!"});
  });
});

describe("Test get all owner debts", () => {
  const agent = request.agent(app);
  it("GET /financial/v1/owner/debts", async () => {
    const response2 = await agent.get("/financial/v1/owner/debts"); //.set(cookie);
    expect(response2.statusCode).toBe(403);
    expect(response2.type).toBe("application/json");
    expect(response2.body).toEqual({"message": "No token provided!"});
  });
});
