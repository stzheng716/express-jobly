"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const testJob = await Job.create({
  title: "test job title 3", salary: 3, equity: 0,
  companyHandle: "c1"
})


/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "title1",
    salary: 10000,
    equity: 0.01,
    companyHandle: "c1"
  };

  test("ok for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "title1",
        salary: 10000,
        equity: "0.01",
        companyHandle: "c1"
      },
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        salary: 10000,
        equity: 0.01,
        companyHandle: "c1"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "title1",
        salary: -1,
        equity: 0.01,
        companyHandle: "c1"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with field", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "title1",
        badSalary: 10000,
        equity: 0.01,
        companyHandle: "c1"
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for user", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** GET /companies */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
          {
            id: expect.any(Number),
            title: "test job title 3",
            salary: 3,
            equity: "0",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 2",
            salary: 2,
            equity: "0.02",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 1",
            salary: 1,
            equity: "0.01",
            companyHandle: "c1"
          }
        ],
    });
  });

  test("filter by title", async function () {
    const resp = await request(app).get("/jobs").query({ title: "test job title 1" });
    expect(resp.body).toEqual({
      jobs:
        [
          {
            id: expect.any(Number),
            title: "test job title 1",
            salary: 1,
            equity: "0.01",
            companyHandle: "c1"
          }
        ],
    });
  });

  test("filter by salary", async function () {
    const resp = await request(app).get("/jobs").query({ minSalary: 2 });
    expect(resp.body).toEqual({
      jobs:
        [
          {
            id: expect.any(Number),
            title: "test job title 3",
            salary: 3,
            equity: "0",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 2",
            salary: 2,
            equity: "0.02",
            companyHandle: "c1"
          }
        ],
    });
  });

  test("filter by hasEquity", async function () {
    const resp = await request(app).get("/companies").query({ hasEquity: true });
    expect(resp.body).toEqual({
      companies:
        [
          {
            id: expect.any(Number),
            title: "test job title 2",
            salary: 2,
            equity: "0.02",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 1",
            salary: 1,
            equity: "0.01",
            companyHandle: "c1"
          }
        ],
    });
  });

  test("filter by hasEquity", async function () {
    const resp = await request(app).get("/companies").query({ hasEquity: false });
    expect(resp.body).toEqual({
      companies:
        [
          {
            id: expect.any(Number),
            title: "test job title 1",
            salary: 1,
            equity: "0.01",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 2",
            salary: 2,
            equity: "0.02",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "test job title 3",
            salary: 3,
            equity: "0",
            companyHandle: "c1"
          }
        ],
    });
  });

  test("error: filter by non filter", async function () {
    const resp = await request(app).get("/jobs").query({ location: "New York" });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    console.log("TESTJOB ID=",testJob.id)
    const resp = await request(app).get(`/jobs/${testJob.id}`);
    expect(resp.body).toEqual({
      job: {
        id: testJob.id,
        title: "test job title 3",
        salary: 3,
        equity: 0,
        companyHandle: "c1"
      },
    });
  });

  test("not found for no such jobs", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/jobs/${testJob.id}`)
      .send({
        title: "new-title",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      company: {
        id: testJob.id,
        title: "new-title",
        salary: 3, 
        equity: 0, 
        companyHandle: "c1"},
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
    .patch(`/jobs/${testJob.id}`)
      .send({
        title: "new-title",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for user", async function () {
    const resp = await request(app)
    .patch(`/jobs/${testJob.id}`)
    .send({
      title: "new-title",
    })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
    .patch(`/jobs/0`)
    .send({
      title: "new-title",
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on id change attempt", async function () {
    const resp = await request(app)
    .patch(`/jobs/${testJob.id}`)
    .send({
      id: 123
    })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
    .patch(`/jobs/${testJob.id}`)
      .send({
        salary: -1, 
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
  
  test("unauth for anon", async function () {
    const resp = await request(app)
    .delete(`/jobs/${testJob.id}`)
    expect(resp.statusCode).toEqual(401);
  });
  
  test("unauth for user", async function () {
    const resp = await request(app)
    .delete(`/jobs/${testJob.id}`)
    .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("works for admin", async function () {
    const resp = await request(app)
    .delete(`/jobs/${testJob.id}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: `${testJob.id}` });
  });
  
  test("not found for no such job", async function () {
    const resp = await request(app)
    .delete(`/jobs/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
