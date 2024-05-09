
async function register(req, res, next) {
    console.log(req.body);

    res.send("Register");
}

export default {
    register
}