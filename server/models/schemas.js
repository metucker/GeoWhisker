const oracle = require('oracledb');
const Schema = oracle.Schema;

const userSchema = new Schema({
    id: {type:Number, unique},//ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY
    dateCreated: {type:Date, default:Date.now},
    email: {type:String, required:true},//email VARCHAR2(255) NOT NULL
    uname: {type:String},//uname VARCHAR2(50) NOT NULL
    pw: {type:String, required:true},//pw VARCHAR2(255) NOT NULL
    feeder: {type:Boolean},//feeder NUMBER(1)
    trapper: {type:Boolean},//trapper NUMBER(1)
    admin: {type:Boolean}, //admin NUMBER(1)
    dateModified: {type:Date, default:Date.now}
});

const catSchema = new Schema({
    id: {type:Number},//ID NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY
    cname: {type:String, required:true},//name VARCHAR2(255) NOT NULL
    dateCreated: {type:Date, default:Date.now},
    dateModified: {type:Date, default:Date.now},
    age: {type:Number},//age NUMBER(3) NOT NULL
    aliases :  {type:Array},
    geographical_area: {type:String},
    microchipped: {type:Boolean},
    hlength: {type:String},
    photos: {type:Array}, 
    gender: {type:String}, //F, M
    age: {type:Number}, //maybe there should be a kitten/adult/senior option
    chipID: {type:String},
    eartip: {type:Boolean},
    feederID: {type:Number},
    feral: {type:Boolean},
    colors: {type:coatColorsSchema},
    patterns: {type:coatPatternsSchema},
    health: {type:healthSchema},
    comments: {type:Array},
});

const coatColorsSchema = new Schema({
    black: {type:Boolean},
    white: {type:Boolean},
    orange: {type:Boolean},
    gray: {type:Boolean},
    brown: {type:Boolean}, 
    other: {type:String}
});

const coatPatternsSchema = new Schema ({
    solid: {type:Boolean},
    striped: {type:Boolean},
    bicolored: {type:Boolean},
    tricolored: {type:Boolean},
    colorPoint: {type:Boolean},
    other: {type:String}
});

const healthSchema = new Schema ({
    eartipped: {type:Boolean},
    fiv: {type:Boolean},
    felv: {type:Boolean},
    allergies: {type:Array},
    spayedNeutered: {type:Boolean},
    pregnant: {type:Boolean},
    nursing: {type:Boolean},
    currAffliction: {type:String},
    vaccinations: {type:Array}, 
    misc: {type:String},
    rightLeftEar: {type:String}
});

const commentsSchema = new Schema ({
    date: {type:Date, default:Date.now},
    id: {type:Number},
    body: {type:String},
    userID: {type:Number},
    catID: {type:Number},
    labels: {type:Array}
});

const labelsSchema = new Schema ({
    needsMedCare: {type:Boolean},
    helpWanted: {type:Boolean},
    needsFeeding: {type:Boolean},
})


const Users = oracle.model('Users', userSchema, 'Caretakers');
const Cats = oracle.model('Cats', catSchema, 'Cats');
const CoatColors = oracle.model('CoatColors', coatColorsSchema, 'CoatColors');
const CoatPatterns = oracle.model('CoatPatterns', coatPatternsSchema, 'CoatPatterns');
const Health = oracle.model('Health', healthSchema, 'Health');
const Comments = oracle.model('Comments', commentsSchema, 'Comments');
const Labels = oracle.model('Labels', labelsSchema, 'Labels');
const mySchemas = 
    {'Users':Users, 
    'Cats':Cats, 
    'CoatColors':CoatColors, 
    'CoatPatterns':CoatPatterns, 
    'Health':Health, 
    'Comments':Comments, 
    'Labels':Labels};

module.exports = mySchemas;