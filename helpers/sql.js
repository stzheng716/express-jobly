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


/** 
 * Take in an object with fields to filter {nameLike: "google", minEmployees:10, 
 * maxEmployee:100}, returns object with whereClause joined by 'AND' and array 
 * of values 
 * {
 *  whereClause: "WHERE num_employees >= $1 AND num_employees <= $2 AND name 
 *    ILIKE $3",
 *  values: [10, 100, `%testName%`]
 * }
 * 
*/

function sqlForFilter(dataToFilter) {
  const keys = Object.keys(dataToFilter);

  const filters = Filter.buildFilters(dataToFilter);

  const whereParts = [];
  const values = [];

  for (const filter of filters) {
    whereParts.push(filter.getWhereStringPart(values.length + 1));
    values.push(filter.getValue());
  }

  return {
    whereClause: values.length > 0 ? "WHERE " + whereParts.join(" AND "): "",
    values
  };
}

module.exports = { sqlForPartialUpdate, sqlForFilter };
