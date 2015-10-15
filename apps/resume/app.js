define(["exports", "text!apps/resume/layout/app.html"], function (exports, appLayout) {
    $.extend(exports, {
        options: {
            appid: "resume"
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