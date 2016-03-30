//TODO: writte comments
function WrongTypeException(type){
    this.name = "WrongTypeException";
    this.message = "Check values type, "+ type +" is expected.";
    return this.name + " - " + this.message;
}
function UndefinedParamtersException(message){
    this.name = "UndefinedParamtersException";
    this.message = "Check values type, "+ message +".";
    return this.name + " - " + this.message;
}


function EmptyParametersException(){
    this.name = "EmptyParametersException";
    this.message = "Parameters JSON is empty, check this";
    return this.name + " - " + this.message;
}

function NullParamatersException(){
    this.name = "NullParamatersException";
    this.message = "Parameters is null value, check this";
    return this.name + " - " + this.message;
}


