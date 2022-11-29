const { insert, getData, search } = require("../services/ProductServices")
const httpstatus = require("http-status")


const create = (req, res) => {

    insert(req.body)
        .then(response => res.status(httpstatus.OK).send(response))
        .catch(err => res.status(httpstatus.INTERNAL_SERVER_ERROR).send(err))
}

const read = (req, res) => {
    getData()
        .then(response => res.status(httpstatus.OK).send(response))
        .catch(err => res.status(httpstatus.INTERNAL_SERVER_ERROR).send(err))
}

const find = (req, res) => {

    search(req.params.search)
        .then(response => res.status(httpstatus.OK).send(response))
        .catch(err => res.status(httpstatus.INTERNAL_SERVER_ERROR).send(err))
}



module.exports = {
    create,
    read,
    find
}