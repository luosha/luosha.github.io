define(["exports", "text!apps/contact/layout/app.html"], function (exports, appLayout) {
    $.extend(exports, {
        options: {
            appid: "contact"
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