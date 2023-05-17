"use strict";

const { BadRequestError } = require("../expressError");
const { Filter } = require("./databaseFilters");

/**
 * @param {object} dataToUpdate object mapping keys to vals that will be set
 * in the database  E.G. { firstName: 'Aliya', age: 32 }
 *
 * @param {object} jsToSql object mapping certain keys in dataToUpdate to their
 * corresponding column names in the database E.G. { firstName: "first_name" }
 *
 * @returns {object} object with setCols and values. setCols is a string
 * for the SET clause of the DB query like "column_1=$1, column_2=$2, ..."
 * E.G. " "first_name"=$1, "age"=$2 "
 *
 * values is an array of values corresponding to the column names in
 * setCols E.G. ['Aliya', 32]
 *
 * format: {
 *  setCols,
 *  values
 * }
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

/** return object with whereClause as string, values as array if no data return empty obj with empty whereClause as string and value: array */

function sqlForFilter(dataToFilter) {
  const keys = Object.keys(dataToFilter);
  if (keys.length === 0) {
    return {
      whereClause: "",
      values: [],
    };
  };

  const filters = Filter.buildFilters(dataToFilter);

  const whereParts = [];
  const values = [];

  for (const filter of filters) {
    whereParts.push(filter.getWhereStringPart(values.length + 1));
    values.push(filter.getValue());
  }

  return {
    whereClause: whereParts.join(" AND "),
    values
  };
}

module.exports = { sqlForPartialUpdate, sqlForFilter };
