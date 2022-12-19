
module.exports = function(){
    if(!process.env.PRIVATE_KEY){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
    
}();