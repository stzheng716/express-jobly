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
        return Object.entries(filtersPOJO).map((filterName, filterVal) => {

            // get the class corresponding to this filter
            const filterClass = filterMap[filterName];

            // construct instance of the class with the value
            // for the filter specified by the user
            return new filterClass(filterVal);
        });
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
}