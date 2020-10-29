if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongo "mongodb+srv://cluster0.ytrbi.mongodb.net/vidjot-prod" --username root'}
}
else {
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}