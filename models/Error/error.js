var error = {
    title: "",
    message: "",
    status: 0
};

function sendError(title, msg, code) {
    e = error;
    e.title = title;
    e.message = msg;
    e.status = code;
    return e;
}

module.exports.errObj = error;
module.exports.sendError = sendError;
