
/* main method for snowmenu */

$(function() {

    var today = new Date();
    var date = today.toISOString().substring(0, 10);
    var menuList;
    var currentMenu;

    getMenus();

    // get all menus for the week and assign them to the appropriate day tab
    function getMenus() {
        console.log("getting menus");
        $.ajax('http://ommule.ausoff.indeed.net:5005/json_data?user=carolineh', {
            'method' : 'GET',
            'success' : function(data) {
                console.log("was successful");
                $.each(data, function(i) {
                    var d = data[i];
                    var foods = {};
                    var comments = {};
                    $.each(data[i].foods, function(j) {
                        var d = data[i].foods;
                        foods[j] = new Food(d.name, d.description, d.food_type, d.snowmen, d.puddles, new Options(d.gluten, d.onions, d.nuts, d.dairy, d.vegetarian));
                    });
                    $.each(data[i].comments, function(j) {
                        var d = data[i].comments;
                        comments[j] = new Comment(d.user_name, d.text, d.snowmen);
                    });
                    var menu = new Menu(d.date, foods, comments);
                    assignToDateOption(menu);
                });
                loadTodaysMenu();
            },
            'error' : function() {
                console.log("shit's fucked up");
            }
        });
    }

    function loadTodaysMenu() {
        var day = getDayOfWeek(today.getDay());
        $("#"+day).click();
    }

    function assignToDateOption(menu) {
        menuList[moment(menu.date).format('l')] = menu;
        var day = getDayOfWeek(menu.date.getDay());
        var dateOption = $("#"+day);
        // assign menu to proper date option button
        dateOption.data("menu", menu);
    }

    $(".menu_date_btn").click(function(e) {
        currentMenu = $(e.target).data("menu");
        $(e.target).addClass("active");
        $("#menu-date").append(moment(currentMenu.date).format("l"));  // show the date of currentMenu
        currentMenu.display();
    });

    function getDayOfWeek(day) {
        if(day == 1) {
            return "monday";
        }
        else if(day == 2) {
            return "tuesday";
        }
        else if(day == 3) {
            return "wednesday";
        }
        else if(day == 4) {
            return "thursday";
        }
        else if(day == 5) {
            return "friday";
        }
    }

});
