"use strict";

/**Accept strings and returns null or integer  */

function toIntOrNull(str){
    const isNaNResult = Number(str);

    return isNaN(isNaNResult) ? null : isNaNResult
}

module.exports = { toIntOrNull };