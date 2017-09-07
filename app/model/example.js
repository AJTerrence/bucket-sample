module.exports = (app)=>{

    // example
    class ExampleModel {
        constructor(){
        }

    }
    return new ExampleModel();

    // or mongodb
    // const mongoose = require('mongoose');
    // const ExampleModel = mongoose.model('example', mongoose.Schema({
    //     column1: String,
    //     column2: Number
    // }));
    // return ExampleModel;

}