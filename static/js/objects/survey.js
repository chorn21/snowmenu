$(function() {

var optionCount = 2;

$("#addOption").click(function() {
    var input = $(document.createElement('input'));
    var item = $(document.createElement('li'));
    input.attr("name", "option" + optionCount);
    input.attr("type", "text");
    item.attr("id", "option" + optionCount);
    item.append(input);
    optionCount++;
    $("#optionCountInput").attr("value", optionCount);
    $("#optionList").append(item);
});

$("#removeOption").click(function() {
    optionCount--;
    var input = $("#option" + optionCount);
    $("#optionCountInput").attr("value", optionCount);
    input.remove();
});

});
