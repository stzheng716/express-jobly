"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobIds
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newJob = {
    title: "new job 1",
    salary: 1,
    equity: 0.01,
    companyHandle: "c1"
  };

  

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id: job.id,
      title: "new job 1",
      salary: 1,
      equity: "0.01",
      companyHandle: "c1"
    });

    const result = await db.query(
      `SELECT id,
        title,
        salary,
        equity,
        company_handle
           FROM jobs
           WHERE id = ${job.id}`);
    expect(result.rows).toEqual([
      {
        id: job.id,
        title: "new job 1",
        salary: 1,
        equity: "0.01",
        company_handle: "c1"
      },
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {

  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: jobIds[2],
        title:'test job title 3',
        salary: 3,
        equity: "0",
        companyHandle: 'c1'
      },
      {
        id: jobIds[1],
        title:'test job title 2',
        salary: 2,
        equity: "0.02",
        companyHandle: 'c1'
      },
      {
        id: jobIds[0],
        title:'test job title 1',
        salary: 1,
        equity: "0.01",
        companyHandle: 'c1'
      },
    ]);
  });

  test("works: filter by title (case insensitive)", async function () {
    let jobs = await Job.findAll({ title: "test job title 1" });
    expect(jobs).toEqual([
      {
        id: jobIds[0],
        title:'test job title 1',
        salary: 1,
        equity: "0.01",
        companyHandle: 'c1'
      }
    ]);
  });

  test("works: filter minSalary", async function () {
    let jobs = await Job.findAll({ minSalary: 2 });
    expect(jobs).toEqual([
      {
        id: jobIds[2],
        title:'test job title 3',
        salary: 3,
        equity: "0",
        companyHandle: 'c1'
      },
      {
        id: jobIds[1],
        title:'test job title 2',
        salary: 2,
        equity: "0.02",
        companyHandle: 'c1'
      },
    ]);
  });

  test("works: filter hasEquity = true", async function () {
    let jobs = await Job.findAll({ hasEquity: true });
    expect(jobs).toEqual([
      {
        id: jobIds[1],
        title:'test job title 2',
        salary: 2,
        equity: "0.02",
        companyHandle: 'c1'
      },
      {
        id: jobIds[0],
        title:'test job title 1',
        salary: 1,
        equity: "0.01",
        companyHandle: 'c1'
      },
    ]);
  });

  test("works: filter hasEquity = false", async function () {
    let jobs = await Job.findAll({ hasEquity: false });
    expect(jobs).toEqual([
      {
        id: jobIds[2],
        title:'test job title 3',
        salary: 3,
        equity: "0",
        companyHandle: 'c1'
      },
      {
        id: jobIds[1],
        title:'test job title 2',
        salary: 2,
        equity: "0.02",
        companyHandle: 'c1'
      },
      {
        id: jobIds[0],
        title:'test job title 1',
        salary: 1,
        equity: "0.01",
        companyHandle: 'c1'
      }
    ]);
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(jobIds[0]);
    expect(job).toEqual({
      id: jobIds[0],
      title:'test job title 1',
      salary: 1,
      equity: "0.01",
      companyHandle: 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(0);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title:'new update title',
    salary: 1,
    equity: "0.01",
  };

  test("works", async function () {
    let job = await Job.update(jobIds[0], updateData);
    expect(job).toEqual({
      id: jobIds[0],
      companyHandle: "c1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = ${jobIds[0]}`);
    expect(result.rows).toEqual([{
      id: jobIds[0],
      title:'new update title',
      salary: 1,
      equity: "0.01",
      company_handle: 'c1'
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title:'test job title 1',
      salary: null,
      equity: null,
    };

    let job = await Job.update(jobIds[0], updateDataSetNulls);
    expect(job).toEqual({
      id: jobIds[0],
      companyHandle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
           FROM jobs
           WHERE id = ${jobIds[0]}`);
    expect(result.rows).toEqual([{
      id: jobIds[0],
      title:'test job title 1',
      salary: null,
      equity: null,
      company_handle: 'c1'
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(0, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(jobIds[0], {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(jobIds[0]);
    const res = await db.query(
      `SELECT id FROM jobs WHERE id=${jobIds[0]}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(0);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
