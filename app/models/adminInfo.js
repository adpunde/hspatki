module.exports = {
    validateAdmin: function (data) {
        if (!data.username || !data.password)
            return false;
        if (data.username === 'admin' && data.password === 'password')
            return true;
        return false;
    }
};
