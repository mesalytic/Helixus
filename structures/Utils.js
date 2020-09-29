/**
 * Capitalizes a string
 * @param {string} string 
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    capitalize
};