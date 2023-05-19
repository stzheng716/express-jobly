"use strict";

/**Accept a string and returns it as a number or null if it can't be
 * converted
*/
function toNumOrNull(str) {
    const result = Number(str);

    return isNaN(result) ? null : result;
}


/**
 * If the string (after converting to lowercase) is "true" or "false" returns
 * the corresponding boolean. Otherwise returns null.
 */
function toBoolOrNull(str) {
    switch (str.toLowerCase()) {
        case "true": return true;
        case "false": return false;
        default: return null;
    }
}

module.exports = { toNumOrNull, toBoolOrNull };