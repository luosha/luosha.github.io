define(["exports"], function (exports) {
    $.extend(exports, {
        options: {
            appid: "portfolio"
        },
        init: function (options) {
            var self = this;
            this.element = $(".page-" + this.options.appid).html("Loading...");
            this.loaded(options);
        },
        loaded: function (options) {
            var date = options.date || 0;
            this.loadApp(options.type || "work", {"parent": this.element, "date": date});
        },
        unloaded: function (options) {
            for (var key in this.subApp) {
                this.subApp[key].unloaded(options);
            }
            this.element.html("");
        },
        pageScroll: function (e) {
            if (!this.subApp[this.subAppID]) { return; }
            if (this.subApp[this.subAppID].pageScroll) {
                this.subApp[this.subAppID].pageScroll(e);
            }
        },
        loadApp: function (id, options, callback) {
            var self = this;

            if (!this.subApp) {
                this.subApp = {};
            }

            this.subAppID = id;
            var _app = this.subApp[id];
            if (_app) {
                _app.loaded(options);
            } else {
                try {
                    var path = "../apps/portfolio/portfolio." + id;
                    require([path], function (a) {
                        self.subApp[id] = a;
                        a.init(options);
                        if (callback) {
                            callback();
                        }
                    });
                } catch (e) { console.warn(e); }
            }
        }
    });
});