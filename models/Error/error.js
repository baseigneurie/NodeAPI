const error = {
    message: '',
    title: '',
    errCode: 0
};

function createError(title, msg, code) {
    e = error;
    e.title = title;
    e.message = msg;
    e.errCode = (code ? code : -1);
    return e;
}

module.exports = {
    createError: createError
}
