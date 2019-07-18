
const responseObject = (statusCode, message, data) => {
    const responseObject = {
        status: {
            code: statusCode,
            message: message
        },
        data: data
    }
    return responseObject;
}
export default responseObject