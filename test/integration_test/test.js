import axios from "axios";
import { expect } from "chai";
import User from "../../models/userModel";
 
axios.defaults.baseURL = "http://localhost:8080";
 
describe("User Endpoint Integration Tests", () => {
  it("Create an account and verify its presence using a GET request.", async () => {
    // POST request to create a new user
    const createUserResponse = await axios.post("/v1/user", {
      first_name: "test",
      last_name: "test",
      username: "test@gmail.com",
      password: "Test@12345",
    });
    expect(createUserResponse.status).to.equal(201);

    await User.update({ isVerified: true }, { where: { username: "test@gmail.com" } });

    const userId = createUserResponse.data.id;
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@gmail.com:Test@12345"
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
 
  it("Update an account and verify the modifications using a GET request.", async () => {
    // Authenticate
    const authHeader = `Basic ${Buffer.from(
      "test@gmail.com:Test@12345"
    ).toString("base64")}`;
    // Send a PUT request
    const updateUserResponse = await axios.put("/v1/user/self", {
      first_name: 'testnew',
      last_name: 'testnew',
      password: 'Test@12345'
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