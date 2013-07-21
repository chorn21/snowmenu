
// code for the /update_menu page

$(function() {

    var today = new Date();
    var foodItems = {};
    var menuList;
    var currentMenu;
    var createNewFoodItemBtn = $("#submit-new-item");
    var submitMenuBtn = $("#submit-menu");

    // retrieve all food items and put them into food item tables
    getMenus();
    getFoods();

    function getMenus() {
        $.ajax('get menus URL', {
            'method' : 'GET',
            'success' : function(data) {
                $.each(data, function(i) {
                    var d = data[i];
                    var menu = new Menu(d.date, d.foods, d.comments);
                    addToMenuList(menu);
                });
            }

        });
    }

    // click handler for the date options
    $(".date-option").click(function(e) {
        // grab menu from date-option's data attribute and assign it to currentMenu
        var menu = $(e.target).data("menu");
        currentMenu = menu;  // assign the selected menu to currentMenu
        $("#menu-date").append(moment(currentMenu.date).format("l"));  // show the date of currentMenu
        // add each food item on currentMenu.foods to the "updating menu" list
        $.each(currentMenu.foods, function(i) {
            var d = currentMenu.foods[i];
            // append each of currentMenu's food items to the updating list
            $("#current-menu-updating ."+d.type).append('<div id="'+d.name+'" class="'+d.type+'-item"><i class="icon-remove"></i><h5 class="item-name">'+d.name+'</h5><p class="item-desc">'+d.description+'</p></div>');
            // set that food item's data attribute as the Food object
            $("#"+d.name).data(d);
            // make sure the object is "checked" in the list of all the food items
            var row = $("tr").find("[data-slide='" + d + "']");
            $(row.find('input[value="'+d.name+'"]')[0]).attr('checked');
            // delegate click handler for the item's removal to make sure the item gets unchecked in the list of all items and removed from currentMenu.foods if it is deselected
            $("#"+d.name+" i").click(function() {
                $("#"+ d.name).remove();
                delete currentMenu.foods[d.name];
                $(row.find('input[value="'+d.name+'"]')[0]).removeAttr('checked');
            });
        });
    });

    function addToMenuList(menu) {
        menuList[menu.date] = menu;
        var dateMenu = $("#date-menu");
        var dateMoment = moment(menu.date);
        // append date to the list
        var dateOption = $('<option class="date-option">'+dateMoment.format('l')+'</option>');
        dateOption.data("menu", menu);
        dateMenu.append(dateOption);
        // assign menu to data attribute of list item
    }

    function getFoods() {
        $.ajax('http://ommule.ausoff.indeed.net:5005/json_data?all_food=1', {
            'method' : 'GET',
            'success' : function(data) {
                // for each food item in the data.foods array, create a Food object and add it to the appropriate food table
                $.each(data.foods, function(i) {
                    var d = data.foods[i];
                    foodItems[d.name] = new Food(d.name, d.description, d.food_type, d.snowmen, d.puddles, new Options(d.options.gluten, d.options.onions, d.options.nuts, d.options.dairy, d.options.vegetarian));
                    // append each foodItem to the appropriate table
                    addToItemList(foodItems[d.name], "#"+foodItems[d.name].type+"-table");
                });
            }
        });
    }

    createNewFoodItemBtn.click(function() {
        var name = $("#food-item-name").val();
        var desc = $("#food-item-desc").val();
        var gluten = $("#gluten").is(':checked');
        var onions = $("#onions").is(':checked');
        var nuts = $("#nuts").is(':checked');
        var dairy = $("#dairy").is(':checked');
        var vegetarian = $("#vegetarian").is(':checked');
        var type;
        var radioBtns = document.getElementsByClassName('food-type');
        for(var i=0; i<radioBtns.length; i++) {
            if(radioBtns[i].checked) {
                type = radioBtns[i].value;
                break;
            }
        }
        // create a new Food object from the inputted data
        var newItem = new Food(removeSpaces($("#food-item-name").val()), desc, type, 0, 0, new Options(gluten, onions, nuts, dairy, vegetarian));
        var data = {
            'name' : name,
            'description' : desc,
            'type' : type,
            'snowmen' : 0,
            'puddles' : 0,
            'gluten' : gluten,
            'onions' : onions,
            'nuts' : nuts,
            'dairy' : dairy,
            'vegetarian' : vegetarian,
            'date' : today.toISOString().substring(0, 10)
        };
        // post the new food item to the server
        $.ajax('/food_post', {
            'method': 'POST',
            'data': JSON.stringify(data),
            'complete': function() {
                console.log("food posted successfully");
                currentMenu.foods[name] = newItem;
            },
            contentType: 'application/json',
            // This is the type of data you're expecting back from the server.
            dataType: 'json'
        });
    });

    function removeSpaces(itemName) {
        return itemName.replace(/\s+/g, '');
    }

    submitMenuBtn.click(function() {
        var data = {
            'date' : currentMenu.date.toISOString().substring(0, 10),
            'foods' : currentMenu.foods,
            'comments' : currentMenu.comments
        }
        // post the new menu to the server
        $.ajax('/menu_post', {
            'method': 'POST',
            'data': JSON.stringify(data),
            'complete': function() {
                window.location.replace("/");
            },
            contentType: 'application/json',
            // This is the type of data you're expecting back from the server.
            dataType: 'json'
        });
    });

    $(".icon-remove").click(function(e) {
        $(e.target).parent().remove();
        delete currentMenu.foods[e.target.data("item").name];
    });

    function addToItemList(item, container) {
        var table = $(container+" tbody");
        console.log(table);
        var row = $("<tr></tr>");
        table.append(row);
        row.data("item", item);  // binds data to row
        row.append("<td>"+item.name+"</td>");
        row.append("<td>"+item.description+"</td>");
        row.append("<td>"+(item.options.gluten ? "yes" : "no")+"</td>");
        row.append("<td>"+(item.options.onions ? "yes" : "no")+"</td>");
        row.append("<td>"+(item.options.nuts ? "yes" : "no")+"</td>");
        row.append("<td>"+(item.options.dairy ? "yes" : "no")+"</td>");
        row.append("<td>"+(item.options.vegetarian ? "yes" : "no")+"</td>");
        row.append('<td><input type="checkbox" value="'+item.name+'" class="checkbox"></td>');
        var checkbox = $('input[value="'+item.name+'"]');
        checkbox.change(function(e) {
            var foodItem = $(e.target).parents("tr").data("item");
            if(e.target.checked) {
                $("#current-menu-updating ."+foodItem.type).append('<div id="'+foodItem.name+'" class="'+foodItem.type+'-item"><i class="icon-remove"></i><h5 class="item-name">'+foodItem.name+'</h5><p class="item-desc">'+foodItem.description+'</p></div>');
                $("#"+foodItem.name).data(foodItem);
                currentMenu.foods[foodItem.name] = foodItem;
                $("#"+foodItem.name+" i").click(function() {
                    $("#"+foodItem.name).remove();
                    delete currentMenu.foods[foodItem.name];
                    $(row.find('input[value="'+foodItem.name+'"]')[0]).removeAttr('checked');
                });
            }
            else {
                $("#"+foodItem.name).remove();
                delete currentMenu.foods[foodItem.name];
            }
        });

    }
});
