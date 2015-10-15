define(["exports", "text!apps/portfolio/layout/work_list_item.html"], function (exports, appLayout) {
    $.extend(exports, {
        options: {
            appid: "portfolio-work"
        },
        init: function (options) {
            var self = this;
            this.element = options.parent.html("Loading...");

            this.date = options.date || 0;
            this._loadData(options);
            this.activated = true;
        },
        loaded: function (options) {
            this.activated = true;

            if (options.date != this.date) {
                this.date = options.date || 0;
                this._loadData();
            } else if (this.data) {
                this._fillData(this.data);
            }
        },
        unloaded: function (options) {
            this.activated = false;
        },
        pageScroll: function (e) {
            this._displayItems(this.element);
        },
        _loadData: function () {
            var self = this;
            this.element.html("Loading...");
            ls.net.get(ls.host + ls.config.a.portfolio + "/" + this.date + ".json", function (result) {
                if (result.status === 1) {
                    var data = result.data;
                    self.data = data;
                    self._fillData(data);
                } else {
                    self.element.html(result);
                }
            }, "JSON");
        },
        _fillData: function (data) {
            this.element.html($(_.template(appLayout, { d: data.list })));
            $("body").scrollTop(0);
            $(window).trigger("scroll");
        },
        _displayItems: function ($parent) {
            var self = this;

            var cls = $parent;
            var scroll_top = $(window).scrollTop();
            var scroll_height = window.innerHeight - 64;
            var items = cls.find(".workportfolio-list-item");
            items.each(function (idx, el) {
                var $el = $(el);
                var img = $el.find("img");
                if (!img.attr("data-original")) { return true; }

                var top = $el.position().top;
                if (top < scroll_top - scroll_height * 1) { return true; }
                if (top > scroll_top + scroll_height * 1) { return false; }
                
                var img_src = ls.config.m.host + ls.config.m.photo + "/" + self.date + "/" + img.attr("data-original");
                img.removeAttr("data-original");
                var image = new Image();
                image.onload = function () { self._imgOnload(img, img_src); }
                image.src = img_src;
            });
        },
        _imgOnload: function ($img, img_src) {
            $img.hide();
            $img.attr("src", img_src);
            setTimeout(function () {
                $img.fadeIn();
            }, 10);
        }
    });
});