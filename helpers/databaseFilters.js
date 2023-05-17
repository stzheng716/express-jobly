"use strict";

const { BadRequestError } = require("../expressError");

/** Abstract class for filters use to generate WHERE clause for sql statements. */

class Filter {
    constructor(value) {
        this.value = value;
    }
    /** Generate a where clause and '$' + index for the position of filter was
     * passed in */
    getWhereStringPart(startingParamIndex) {
        throw new Error("should not instantiate abstract Filter");
    }

    /** Get value of specified value for this filter */
    getValue() {
        return this.value;
    }

    /** Take a object of filter names and values, returns array of corresponding
     * filter child classes
     * {nameLike: "google", minEmployees:10, maxEmployee:100} =>
     * [CompanyNameLikeFilter, MinEmployeesFilter, ...]
     * */

    static buildFilters(filtersPOJO) {

        this.validateFilter(filtersPOJO);

        const filters = Object.entries(filtersPOJO)
            .map(([filterName, filterVal]) => {

                // get the class corresponding to this filter
                const filterClass = filterMap[filterName];

                // construct instance of the class with the value
                // for the filter specified by the user
                return new filterClass(filterVal);
            });

        return filters;
    }

    /**Take an object of filter names and values, determine if minEmployee and
     * maxEmployee are inside POJO and throw error if minEmployee is greater than
     * maxEmployee */

    static validateFilter(filtersPOJO){
        if("minEmployees" in filtersPOJO && "maxEmployees" in filtersPOJO) {
            if(filtersPOJO.minEmployees > filtersPOJO.maxEmployees) {
                throw new BadRequestError(`minEmployees can't be greater than maxEmployees`)
            }
        }
    }
}

class MinEmployeesFilter extends Filter {
    constructor(minEmployees) {
        super(minEmployees);
    }

    getWhereStringPart(startingParamIndex) {
        return `num_employees >= $${startingParamIndex}`;
    }
}

class MaxEmployeesFilter extends Filter {
    constructor(maxEmployees) {
        super(maxEmployees);
    }

    getWhereStringPart(startingParamIndex) {
        return `num_employees <= $${startingParamIndex}`;
    }
}

class CompanyNameLikeFilter extends Filter {
    constructor(name) {
        super();
        this.name = name;
    }

    getWhereStringPart(startingParamIndex) {
        return `name ILIKE $${startingParamIndex}`;
    }

    /** overridden to add '%'s for SQL ILIKE*/
    getValue() {
        return `%${this.name}%`;
    }
}

const filterMap = {
    "minEmployees": MinEmployeesFilter,
    "maxEmployees": MaxEmployeesFilter,
    "nameLike": CompanyNameLikeFilter,
};


module.exports = {
    Filter
};