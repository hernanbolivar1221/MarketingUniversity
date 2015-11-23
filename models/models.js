// service data profile
app.service("serviceEmpty", function(){
    this.data = function(){
        return {
            image: 'https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-ash2/v/t1.0-9/601178_3900433867422_162045609_n.jpg?oh=ac2f5f6a05eaaab5dc1d13c4ca7291c7&oe=56F8B9F4&__gda__=1458801069_be0663af3e01bf0b87eba6c3adee8384',
            name:'Hernan Dario Bolivar',
            description:'Diseñador web y frontend', 
            pts: 0

        }
    }
});

var User = function(userData){

    this.username = (userData && userData.username ? userData.username : null);
    this.password = (userData && userData.password ? userData.password : null);
    this.email = (userData && userData.email ? userData.email : null);
    this.avatar = (userData && userData.avatar ? userData.avatar : null);
    this.first_name = (userData && userData.firstname ? userData.firstname : null);
    this.last_name = (userData && userData.lastname ? userData.lastname : null);
    this.job_title = (userData && userData.jobtitle ? userData.jobtitle : null);

    this.setUsername = function(username){
        this.username = username;
    }
    this.getUsername = function(){
        return this.username;
    }
    this.setPassword = function(password){
        this.password = password;
    }
    this.getPassword = function(){
        return this.password;
    }
    this.setEmail = function(email){
        this.email = email;
    }
    this.getEmail = function(){
        return this.email;
    }
    this.setAvatar = function(avatar){
        this.avatar = avatar;
    }
    this.getAvatar = function(){
        return this.avatar;
    }
    this.setFirst_name = function(firstname){
        this.firstname = firstname;
    }
    this.getFirst_name = function(){
        return this.firstname
    }



}