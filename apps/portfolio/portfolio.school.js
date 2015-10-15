define(["exports", "text!apps/portfolio/layout/school_list_item.html"], function (exports, appLayout) {
    $.extend(exports, {
        options: {
            appid: "portfolio-school"
        },
        init: function (options) {
            var self = this;

            this.element = options.parent.html("Loading...");
            this.element.on("click", ".carousel-control", function () {
                var $sender = $(this);
                var $parent = $sender.parent(".content");
                var $loading = $parent.find("#portfolio_school");
                var $img = $parent.find(".img_portfolio");
                var dataID = $parent.attr("data-id");
                var current = parseInt($parent.attr("data-current"));

                var item = self._getItemInfo(dataID, self.data.list);
                var nextimg = -1;
                if ($sender.attr("data-slide") === "prev") {
                    if (current === 1) {
                        return;
                    }
                    current = current - 1;
                    $parent.attr("data-current", current);
                }else{
                    if (current >= item.max) {
                        return;
                    }
                    current = current + 1;
                    nextimg = current + 1;
                    if (nextimg > item.max) {
                        nextimg = item.max;
                    }
                    $parent.attr("data-current", current);
                }

                $loading.show();
                var img_src = ls.config.m.host + ls.config.m.photo + "/" + item.guid + "/" + item.guid + "-" + current + ".jpg";
                var img_src_next = ls.config.m.host + ls.config.m.photo + "/" + item.guid + "/" + item.guid + "-" + nextimg + ".jpg";
                var image = new Image();
                image.onload = function () {
                    $img.attr("src", img_src);
                    $loading.hide();
                    if ($sender.attr("data-slide") === "next") {
                        setTimeout(function () {
                            self._preload(img_src_next);
                        }, 100);
                    }
                };
                image.src = img_src;
            });

            this.date = options.date || 0;
            this._loadData();
        },
        loaded: function (options) {
            if (options.date != this.date) {
                this.date = options.date || 0;
                this._loadData();
            } else if (this.data) {
                this._fillData(this.data);
            }
        },
        unloaded: function (options) {
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
        _getItemInfo: function (id, list) {
            var obj;
            for (var i = 0; i < list.length; i++) {
                if(list[i].guid === id){
                    obj = list[i];
                    break;
                }
            }
            return obj;
        },
        _preload: function (img_src) {
            var image = new Image();
            image.src = img_src;
        }
    });
});