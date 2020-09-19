exports.getdate = function () {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    var Day = today.toLocaleDateString("en-US", options);
    return Day;
};
exports.getday =function (){
        var today = new Date();
        var options = {
            weekday: "long",

        };
        var Day = today.toLocaleDateString("en-US", options);
        return Day;
    };

