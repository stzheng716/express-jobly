"use strict";

const { toNumOrNull, toBoolOrNull  } = require("./util");

describe("toNumOrNull", function () {
    test("Returns Number from a string", function () {
        const results = toNumOrNull("15");
        expect(results).toEqual(15);
    });

    test("Returns null from a string", function () {
        const results = toNumOrNull("test");
        expect(results).toEqual(null);
    });
})

describe("toBoolOrNull", function () {
    test("Returns Bool from a string = true", function () {
        const results = toBoolOrNull("true");
        expect(results).toEqual(true);
    });

    test("Returns Bool from a string = false", function () {
        const results = toBoolOrNull("false");
        expect(results).toEqual(false);
    });

    test("Returns Null from a string", function () {
        const results = toBoolOrNull("test");
        expect(results).toEqual(null);
    });
})