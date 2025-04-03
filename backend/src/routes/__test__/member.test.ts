import request from "supertest";
import { prisma, app } from "../../server";

const route = "/api/members";

const testMember = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  groupName: "Group A",
  role: "Developer",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2024-12-31"),
};
const badRequest = {
  id: 2,
  first_name: "John",
  last_name: "Doe",
  group_name: "Group A",
  role: "Developer",
  expected_salary: 50000,
  expected_date_of_defense: new Date("2024-12-31"),
};
const updatedMember = {
  firstName: "Jane",
  lastName: "Doe",
  groupName: "Group A",
  role: "Developer",
  expectedSalary: 55000,
  expectedDateOfDefense: new Date("2024-12-31"),
};

describe("Member route", () => {
  afterAll(async () => {
    await prisma.member.deleteMany();
    await prisma.$disconnect();
  });
  //happy path
  it("should create a new member", async () => {
    const response = await request(app).post(route).send(testMember);

    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe(testMember.firstName);
    expect(response.body.lastName).toBe(testMember.lastName);
  });
// sad path
  it("should not create a member when missing required fields", async () => {
    const response = await request(app).post(route).send({
      firstName: "Jane",
      lastName: "Doe",
    });

    expect(response.status).toBe(500);
  });

  it("should handle errors when creating a member", async () => {
    const response = await request(app).post(route).send(badRequest);
    expect(response.status).toBe(500);
  });

  it("should fetch all members", async () => {
    const response = await request(app).get(route);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("should fail fetching a member that does not exist", async () => {
    const response = await request(app).get(route + "/100");

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it("should fail fetching a member because if a bad request", async () => {
    const response = await request(app).get(route + "/helloWorld");

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
  });

  it("should update a member", async () => {
    const member = await prisma.member.create({
      data: testMember,
    });

    const updatedMember = {
      ...testMember,
      firstName: "Jane",
    };

    const response = await request(app)
      .put(`${route}/${member.id}`)
      .send(updatedMember);

    expect(response.status).toBe(200);
    expect(response.body.firstName).toBe(updatedMember.firstName);
  });

  it("should fail updating a member because of wrong data sent", async () => {
    const badRequest = {
      firstName: 1000,
      lastName: 2000,
    }

    const response = await request(app)
      .put(`${route}/1`)
      .send(badRequest);

    expect(response.status).toBe(500);
  });

  it("should fail updating a member that does not exist", async () => {
    const response = await request(app)
      .put(`${route}/`)
      .send(updatedMember);

    expect(response.status).toBe(404);
  });


});
