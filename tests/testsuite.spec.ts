import { test, expect, request, APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { APIHelper } from "./apiHelpers";

// Request context is reused by all tests in the file.
let apiContext: APIRequestContext;
let apiHelper: APIHelper;

// Run before all tests in file
test.beforeAll("Login", async ({ playwright, request }) => {
  const loginResponse = await request.post("/api/login", {
    data: {
      username: process.env.TEST_USERNAME,
      password: process.env.TEST_PASSWORD,
    },
  });

  expect(loginResponse.ok()).toBeTruthy();
  expect(loginResponse.status()).toBe(200);

  const { token, username } = await loginResponse.json();

  apiContext = await playwright.request.newContext({
    baseURL: `${process.env.BASE_URL}`,
    extraHTTPHeaders: {
      // Add authorization token to all requests.
      "x-user-auth": JSON.stringify({ username, token }),
    },
  });
});

// Run after all tests in file
test.afterAll(async ({}) => {
  // Dispose all responses.
  await apiContext.dispose();
});

test.describe("Test suite backend v1", () => {
  test.beforeAll("Setup API Helper", () => {
    apiHelper = new APIHelper("/", apiContext);
  });

  test("Create Client", async ({}) => {
    const payload = {
      name: faker.person.fullName,
      email: faker.internet.email,
      telephone: faker.phone.number,
    };

    const createClientResponse = await apiHelper.createClient(payload);
    expect(createClientResponse.ok()).toBeTruthy();
    expect(createClientResponse.status()).toBe(200);

    const jsonApiResponse = await createClientResponse.json();

    // expect(jsonApiResponse).toMatchObject(
    //   expect.objectContaining({
    //     // created: payload.name,
    //     id: "14",
    //   })
    // );
  });
});
