if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: "mongodb atlas link"}
}
else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}