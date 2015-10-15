define(["exports", "text!apps/home/layout/app.html", "text!apps/home/layout/portfolio_item.html"
], function (exports, appLayout, portfolioItemLayout) {
    $.extend(exports, {
        options: {
            appid: "home"
        },
        init: function (options) {
            var self = this;
            this.element = $(".page-" + this.options.appid).html(appLayout);
            this.$listbox = this.element.find(".portfolio-listBox");
            this._loadData();
        },
        loaded: function (options) {
            this.activated = true;
        },
        unloaded: function (options) {
            this.activated = false;
        },
        pageScroll: function (e) {
            this._displayItems(this.element);
        },
        _loadData: function () {
            var self = this;
            this.$listbox.html("Loading...");
            ls.net.get(ls.host + ls.config.a.portfoliotree, function (result) {
                if (result.status === 1) {
                    var data = result.data;
                    self._fillData(data.list);
                } else {
                    this.element.html(result);
                }
            }, "JSON");
        },
        _fillData: function (data) {
            this.$listbox.html("");
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                this.$listbox.append($(_.template(portfolioItemLayout, { d: d })));
            }
            this.loaded();
            $(window).trigger("scroll");
        },
        _displayItems: function ($parent) {
            var self = this;

            var cls = $parent;
            var scroll_t = $(window).scrollTop();
            var scroll_h = window.innerHeight;
            var items = cls.find(".home-list-item");
            items.each(function (idx, el) {
                var $el = $(el);
                var img = $el.find("img");
                if (!img.attr("data-original")) { return true; }

                var top = $el.position().top;
                if (top < scroll_t - scroll_h * 1) { return true; }
                if (top > scroll_t + scroll_h * 1) { return false; }

                var guid = $el.attr("data-guid");
                var img_src = ls.config.m.host + ls.config.m.photo + "/" + guid + "/" + img.attr("data-original");
                img.attr("src", img_src);
                img.removeAttr("data-original");
            });
        }
    });
});