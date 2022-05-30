
const createResponse = (message, status, data) => {
    return {
        message: message,
        status: status,
        data: data
    }
}

const unauthorizedResponse = () => {
    return {
        message: 'Unauthorized',
        status: 401,
        data: null,
    }
}

module.exports = {
    createResponse,
    unauthorizedResponse
}