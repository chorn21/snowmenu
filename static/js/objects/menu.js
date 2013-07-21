
function Menu(date, foods, comments) {
    this.date = date;
    this.foods = foods;
    this.comments = comments;
}

Menu.prototype.display = function() {
    $(".entree").empty();
    $(".soup-salad").empty();
    $(".side").empty();
    $(".dessert").empty();
    var foods = this.foods;
    var comments = this.comments;
    var date = this.date;
    // append each food item on the menu to the appropriate section
    $.each(foods, function(i) {
        var d = foods[i];
        var row = $('<div class="'+ d.type+'-item row item"></div>');  // create a new row in the menu section
        $("#current-menu ."+ d.type).append(row);
        row.data("item", d);  // assign the food item as the data attribute of that row
        // actually append the html
        row.append('<div class="votes"><div id="upvote-'+d.name+'" class="snowmen-icon row">☃</div><div class="snowmen row">'+(d.snowmen - d.puddles)+'</div><div id="downvote-'+d.name+'" class="puddles-icon row">☀</div></div><div class="item-info"><h5 class="item-name">'+d.name+'</h5><p class="item-desc">'+d.description+'</p><div class="menu-options"></div></div>');
        // include the proper options images
        if(d.options.gluten == false) {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_glutenfree.png" />');
        }
        if(d.options.onions == true) {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_onion.png" />');
        }
        else {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_onionfree.png" />');
        }
        if(d.options.nuts == true) {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_nuts.png" />');
        }
        else {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_nutfree.png" />');
        }
        if(d.options.vegetarian == true) {
            $(row.find(".menu-options")[0]).append('<img src="static/img/icon_veg.png" />');
        }
        // distinguish if the user has upvoted or downvoted this option
        if(d.users.carolineh.hasUpvoted) {
            $("#upvote-"+d.name).css("font-weight", "bold");
            $("#upvote-"+d.name).next().css("font-weight", "bold");
        }
        else if(d.users.carolineh.hasDownvoted) {
            $("#downvote-"+d.name).css("font-weight", "bold");
        }
        // upvote handler
        $("#upvote-"+ d.name).click(function(e) {
            var foodItem = $(e.target).parents("."+ d.type+"-item").data("item");
            foodItem.upvote(foodItem.users.carolineh);
            $(row.find(".snowmen")[0]).text(foodItem.snowmen-foodItem.puddles);
            $("#upvote-"+d.name).css("font-weight", "bold");
            $("#upvote-"+d.name).next().css("font-weight", "bold");
            $("#downvote-"+d.name).css("font-weight", "normal");
            var data = {
                'vote_type' : 1,
                'user_name' : 'carolineh',
                'name' : foodItem.name,
                'description' : foodItem.description,
                'type' : foodItem.type,
                'snowmen' : foodItem.snowmen,
                'puddles' : foodItem.puddles,
                'users' : foodItem.users
            };
            // send updated food item to server
            $.ajax('/update_food', {
                'method' : 'PUT',
                'data' : JSON.stringify(data),
                'complete' : function(response) {
                    console.log("updated food item");
                    console.log(response);
                },
                contentType : 'application/json',
                dataType : 'json'
            });
        });
        // downvote handler
        $("#downvote-"+ d.name).click(function(e) {
            var foodItem = $(e.target).parents("."+ d.type+"-item").data("item");
            foodItem.downvote(foodItem.users.carolineh);
            $(row.find(".snowmen")[0]).text(foodItem.snowmen-foodItem.puddles);
            $("#downvote-"+d.name).css("font-weight", "bold");
            $("#upvote-"+d.name).css("font-weight", "normal");
            $("#upvote-"+d.name).next().css("font-weight", "normal");
            var data = {
                'vote_type' : 0,
                'user_name' : 'carolineh',
                'name' : foodItem.name,
                'description' : foodItem.description,
                'type' : foodItem.type,
                'snowmen' : foodItem.snowmen,
                'puddles' : foodItem.puddles,
                'users' : foodItem.users
            };
            // send updated food item to server
            $.ajax('/update_food', {
                'method' : 'PUT',
                'data' : JSON.stringify(data),
                'complete' : function(response) {
                    console.log("updated food item");
                    console.log(response);
                },
                contentType : 'application/json',
                dataType : 'json'
            });
        });
    });
    // take care of the comments for that menu
    $.each(comments, function(i) {
        var comments = $($("#current-menu").find(".comments")[0]);
        var comment = $('<div class="comment row"></div>');
        comment.data("comment", comments[i]);
        comments.append(comment);
        comment.append('<div class="comment row"><div class="comment-info"><span class="comment-name">'+comments[i].user_name+'</span><span class="comment-snowmen snowmen-icon">☃</span><span class="snowmen">'+comments[i].snowmen+'</span><div class="comment-text">'+comments[i].text+'</div></div>');
    });

    $(".comment-snowmen").click(function(e) {
        var comment = $(e.target).parents(".comment").id;
        var commentData = $(e.target).parents(".comment").data("item");
        var data = {
            'vote_type' : 1,
            'comment_id' : comment,
            'user_name' : 'carolineh',
            'snowmen' : commentData.snowmen
        };
        console.log(data);
        // send updated food item to server
        $.ajax('/update_comment', {
            'method' : 'PUT',
            'data' : JSON.stringify(data),
            'complete' : function(response) {
                console.log("updated comment");
                console.log(response);
            },
            contentType : 'application/json',
            dataType : 'json'
        });
    });

    $("#post-comment").click(function() {
        var comment = new Comment('carolineh', $("#comment-input").val(), 0);
        comments.push(comment);
        var data = {
            'date' : date,
            'user_name' : comment.user_name,
            'text' : comment.text,
            'snowmen' : comment.snowmen
        };
        console.log(data);
        // post comment to server
        $.ajax('/comment_post', {
            'method' : 'POST',
            'data' : JSON.stringify(data),
            'complete' : function(response) {
                console.log("want to get an id from this response and assign it to the comment", response);
                $(".comments").append('<div class="comment"><div><span> class="comment-name">'+comment.user_name+'</span><span class="comment-snowmen">☃</span><span class="snowmen">'+comment.snowmen+'</span></div><div class="comment-text">'+comment.text+'</div></div>');
            },
            contentType : 'application/json',
            dataType : 'json'
        });
    });
}
