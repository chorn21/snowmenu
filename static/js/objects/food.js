
function Food(name, description, type, snowmen, puddles, options) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.snowmen = snowmen;
    this.puddles = puddles;
    this.options = options;
    this.users = {'zak' : { 'hasUpvoted' : false, 'hasDownvoted' : false }, 'carolineh' : { 'hasUpvoted' : false, 'hasDownvoted' : false }};
}

Food.prototype.upvote = function(user) {
    if(user.hasDownvoted) {
        this.puddles--;
        user.hasUpvoted = true;
        user.hasDownvoted = false;
    }
    else if(user.hasUpvoted == false && user.hasDownvoted == false) {
        this.snowmen++;
        user.hasUpvoted = true;
    }
}

Food.prototype.downvote = function(user) {
    if(user.hasUpvoted) {
        this.snowmen--;
        user.hasDownvoted = true;
        user.hasUpvoted = false;
    }
    else if(user.hasUpvoted == false && user.hasDownvoted == false) {
        this.puddles++;
        user.hasDownvoted = true;
    }
}