"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate, sqlForFilter } = require("./sql");

describe("SQLpartialUpdate", function () {
    test("Returns object with set statement string and values", function () {
        const dataToUpdate = { firstName: 'Aliya', age: 32 };
        const jsToSql = { firstName: "first_name" };
        const results = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(results).toEqual({
            setCols: `"first_name"=$1, "age"=$2`,
            values: ["Aliya", 32]
        });
    });

    test("throws BadRequestError due to no data", function () {
        const dataToUpdate = {};
        const jsToSql = { firstName: "first_name" };
        expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql))
            .toThrow(BadRequestError);
    });
});

describe("sqlForFilter", function () {
    test("Returns object with where statement string and values", function () {
        const dataToFilter = { minEmployees: 10 };
        const results = sqlForFilter(dataToFilter);
        expect(results).toEqual({
            whereClause: `WHERE num_employees >= $1`,
            values: [10]
        });
    });

    test("works with all company filters", function () {
        const dataToFilter = {
            minEmployees: 10,
            maxEmployees: 100,
            nameLike: "testName"
         };
        const results = sqlForFilter(dataToFilter);
        expect(results).toEqual({
            whereClause: `WHERE num_employees >= $1 AND num_employees <= $2 AND name ILIKE $3`,
            values: [10, 100, `%testName%`]
        });
    });

    test("works with empty filter data", function () {
        const dataToFilter = {};
        const results = sqlForFilter(dataToFilter);
        expect(results).toEqual({
            whereClause: "",
            values: []
        });
    });
});