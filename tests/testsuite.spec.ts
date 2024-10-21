import { test, expect, request, APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { APIHelper } from "./apiHelpers";
import path from "path";
import { promises as fs } from "fs";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

// Request context is reused by all tests in the file.
let apiContext: APIRequestContext;
let apiHelper: APIHelper;

// Run before all tests in file
test.beforeAll("Setup x-user-auth", async ({ playwright, request }) => {
  const jsonString = await fs.readFile(authFile, "utf8");
  const { username, token } = JSON.parse(jsonString);

  apiContext = await playwright.request.newContext({
    baseURL: `${process.env.BASE_URL}`,
    extraHTTPHeaders: {
      // Add authorization token to all requests.
      "x-user-auth": JSON.stringify({ username, token }),
    },
  });
  apiHelper = new APIHelper("/", apiContext);
});

// Run after all tests in file
test.afterAll(async ({}) => {
  // Dispose all responses.
  await apiContext.dispose();
});

test.describe("Test suite backend v1", () => {
  test("Create Client", async ({}) => {
    const payload = {
      name: faker.person.fullName,
      email: faker.internet.email,
      telephone: faker.phone.number,
    };

    const createClientResponse = await apiHelper.createClient(payload);
    expect(createClientResponse).toBeOK();

    const jsonApiResponse = await createClientResponse.json();

    expect(jsonApiResponse).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number),
        created: expect.anything(),
      })
    );
  });

  test("Create Bill", async ({}) => {
    const payload = {
      value: faker.number.int({ min: 0, max: 1000 }),
    };

    const createResponse = await apiHelper.createBill(payload);

    expect(await createResponse.json()).toMatchObject(
      expect.objectContaining({
        id: expect.any(Number),
        created: expect.anything(),
      })
    );
    expect(createResponse.ok()).toBeTruthy();
    expect(createResponse.status()).toBe(200);
  });
});
