const moment = require("moment")

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
}
let generateLoctionMessage = (from, lat, long) => {
    return {
        from,
        url: `https://www.google.com/maps?=${lat},${long}`,
        createdAt: moment().valueOf()

    }

}
module.exports = { generateMessage, generateLoctionMessage }