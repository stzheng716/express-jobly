"use strict";

/**Accept a string and returns it as a number or null if it can't be
 * converted
*/
function toNumOrNull(str) {
    const result = Number(str);

    return isNaN(result) ? null : result;
}

module.exports = { toNumOrNull: toNumOrNull };