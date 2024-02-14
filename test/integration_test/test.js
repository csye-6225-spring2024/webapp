import request from "supertest";
import app from "../../server.js";
import { expect } from "chai";
 
describe("User Endpoint Integration Tests", () => {
  it("should create an account and validate its existence with GET", async () => {
    // Send a POST request to create a new user
    const createUserResponse = await request(app)
      .post("/v1/user")
      .send({
        first_name: "test",
        last_name: "test",
        username: "test@example.com",
        password: "test",
      });
    // Expect response status code to be 201
    expect(createUserResponse.status).to.equal(201);
    const userId = createUserResponse.body.id;
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@example.com:test"
    ).toString("base64")}`;
    // Send a GET request
    const getUserResponse = await request(app)
      .get(`/v1/user/self`)
      .set("Authorization", authHeader);
    // Expect the response status code to be 200 (OK)
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.body.id).to.equal(userId);
  });
 
  it("should update an account and validate the changes with GET", async () => {
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@example.com:test"
    ).toString("base64")}`;
    // Send a PUT request
    const updateUserResponse = await request(app)
      .put(`/v1/user/self`)
      .set("Authorization", authHeader)
      .send({first_name: 'testnew', last_name: 'testnew', password: 'test'});
    expect(updateUserResponse.status).to.equal(204);
    // Send a GET request
    const getUserResponse = await request(app)
      .get(`/v1/user/self`)
      .set("Authorization", authHeader);
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.body.first_name).to.equal("testnew");
  });
});