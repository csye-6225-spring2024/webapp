#Testing
import axios from "axios";
import { expect } from "chai";
 
axios.defaults.baseURL = "http://localhost:8080";
 
describe("User Endpoint Integration Tests", () => {
  it("should create an account and validate its existence with GET", async () => {
    // POST request to create a new user
    const createUserResponse = await axios.post("/v1/user", {
      first_name: "test",
      last_name: "test",
      username: "test@gmail.com",
      password: "test",
    });
    expect(createUserResponse.status).to.equal(201);
    const userId = createUserResponse.data.id;
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@gmail.com:test"
    ).toString("base64")}`;
    // Send a GET request
    const getUserResponse = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.data.id).to.equal(userId);
  });
 
  it("should update an account and validate the changes with GET", async () => {
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@gmail.com:test"
    ).toString("base64")}`;
    // Send a PUT request
    const updateUserResponse = await axios.put("/v1/user/self", {
      first_name: 'testnew',
      last_name: 'testnew',
      password: 'test'
    }, {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(updateUserResponse.status).to.equal(204);
    // Send a GET request
    const getUserResponse = await axios.get("/v1/user/self", {
      headers: {
        Authorization: authHeader,
      },
    });
    expect(getUserResponse.status).to.equal(200);
    expect(getUserResponse.data.first_name).to.equal("testnew");
  });
});
