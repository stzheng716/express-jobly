"use strict";

//TODO: ADD DOC STRINGS!!!!

class Filter {
    constructor(value) {
        this.value = value;
    }

    getWhereStringPart(startingParamIndex) {
        throw new Error("should not instantiate abstract Filter");
    }

    getValue() {
        return this.value;
    }

    static buildFilters(filtersPOJO) {
        const filters = Object.entries(filtersPOJO)
            .map(([filterName, filterVal]) => {

                console.log("filterName", filterName);
                console.log("filterVal", filterVal);

                // get the class corresponding to this filter
                const filterClass = filterMap[filterName];

                console.log("filterClass: ", filterClass);

                // construct instance of the class with the value
                // for the filter specified by the user
                return new filterClass(filterVal);
            });

        return filters;
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