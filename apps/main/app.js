define(["jquery", "exports", "text!../apps/main/layout/app.html"], function ($, exports, appLayout) {
    $.extend(exports, {
        init: function () {
            $("#bootloading").remove();
            $("#shareto").after(appLayout);
            this.element = $(".content-container");
            this._registerEvents();
            if(!window.debug) {
                this.addBaiduHm();
            }
        },
        navChange: function (appId, paramsStr) {
            this.currParams = ls.utils.parseParams(paramsStr || "");

            if (this.currAppID) {
                this.element.children(".page-" + this.currAppID).hide();
                ls.apps[this.currAppID + "App"].unloaded(this.currParams);
            }
            this.currAppID = appId;
            if (!ls.apps[appId + "App"]) {
                this.element.append($(this.template.page.replace(/\{0\}/, appId)));
            } else {
                this.element.children(".page-" + this.currAppID).show();
            }
            this._openApp(appId, this.currParams);
        },
        _registerEvents: function () {
            var self = this;
            window.onresize = function (e) {
                self._sizeChanged(e);
            };
            $(window).bind("scroll", function (e) {
                var cls = e.target;
                cls.isScrolling = true;
                if (cls.scroll_interval) { return; }
                cls.scroll_interval = setInterval(function () {
                    if (cls.isScrolling) {
                        cls.isScrolling = false;
                    }
                    else {
                        clearInterval(cls.scroll_interval);
                        self._onScroll(e);
                        cls.scroll_interval = 0;
                    }
                }, 200);
            });
            $(document).bind("keydown", function(e) {
                self._keyDown(e);
            });

            this.navbar = $(".navbar");
            this.navbar.find(".navbar-toggle").bind("click", function (e) {
                var sender = $(this);
                var target = sender.attr("data-target");
                if (sender.hasClass("collapsed")) {
                    sender.removeClass("collapsed");
                    self.navbar.find(target).addClass("in");
                } else {
                    sender.addClass("collapsed");
                    self.navbar.find(target).removeClass("in");
                }
            });
        },
        _keyDown: function (e) {
            if (!ls.apps[this.currAppID + "App"]) { return; }
            if (ls.apps[this.currAppID + "App"].keyDown) {
                ls.apps[this.currAppID + "App"].keyDown(e);
            }
        },
        _onScroll: function (e) {
            if (!ls.apps[this.currAppID + "App"]) { return; }
            if (ls.apps[this.currAppID + "App"].pageScroll) {
                ls.apps[this.currAppID + "App"].pageScroll(e);
            }
        },
        _sizeChanged: function (e) {
            if (!ls.apps[this.currAppID + "App"]) { return; }
            if (ls.apps[this.currAppID + "App"].sizeChanged) {
                ls.apps[this.currAppID + "App"].sizeChanged(e);
            }
        },
        _openApp: function (appId, options) {
            var _id = appId + "App",
                _app = ls.apps[_id];
            if (_app) {
                _app.loaded(options);
            } else {
                try {
                    require([_id], function (app) {
                        ls.apps[_id] = app;
                        app.init(options);
                    });
                } catch (e) {}
            }
        },
        addBaiduHm: function () {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?7296d363eb7e33d819becbcb9d6cafbd";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);

            //$("body").append('<script type="text/javascript">var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");=document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3F7f36468541a593974ce402a10fe79c6d' type='text/javascript'%3E%3C/script%3E"));</script>');

            // hm.onload = hm.onreadystatechange = function () {
            //     if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
            //         if (_hmt) {
            //             window._hmtPush = _hmt.push;
            //             _hmt.push = function (aryObj) {
            //                 var kn = aryObj[0],
            //                     category = aryObj[1] || "",
            //                     action = aryObj.length > 2 ? aryObj[2] : "",
            //                     opt_label = aryObj.length > 3 ? aryObj[3] : "",
            //                     opt_value = aryObj.length > 4 ? aryObj[4] : "";
            //                 _hmtPush.call(window, [kn, category, category + "\/" + action, category + "\/" + action + "\/" + opt_label, opt_value]);
            //             }
            //         }
            //     }
            // };
        },
        template: {
            page: '<div class="page page-{0}"><div class="page-loading">Initializing...</div></div>',
            loading: '<div class="loading">Loading...</div>'
        }
    });
});