define(["exports", "text!apps/award/layout/app.html"], function (exports, appLayout) {
    $.extend(exports, {
        options: {
            appid: "award"
        },
        init: function (options) {
            this.element = $(".page-" + this.options.appid).html(appLayout);
        },
        loaded: function (options) {
        },
        unloaded: function (options) {
        }
    });
});