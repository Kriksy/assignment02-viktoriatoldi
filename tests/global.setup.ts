import {
  test as setup,
  expect,
  request,
  APIRequestContext,
} from "@playwright/test";
import { faker } from "@faker-js/faker";
import { APIHelper } from "./apiHelpers";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

let tokens = new Array();
// Run before all tests in file
setup("Login", async ({ playwright, request }) => {
  const loginResponse = await request.post("/api/login", {
    data: {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    },
  });

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const { token, username } = await loginResponse.json();

  // apiContext = await playwright.request.newContext({
  //   baseURL: `${process.env.BASE_URL}`,
  //   extraHTTPHeaders: {
  //     // Add authorization token to all requests.
  //     "x-user-auth": JSON.stringify({ username, token }),
  //   },
  // });

  fs.writeFile(authFile, JSON.stringify({ username, token }), (err) => {
    if (err) {
      throw new Error(`Failed to write to file: ${err}`);
    }
  });
});
