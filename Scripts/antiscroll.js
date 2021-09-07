/*
 * Antiscroll: cross-browser native OS X Lion scrollbars
 * https://github.com/Automattic/antiscroll
 * v0.9
 */

!function(t) {
    function i(i, e) {
        this.el = t(i),
        this.options = e || {},
        this.x = !1 !== this.options.x || this.options.forceHorizontal,
        this.y = !1 !== this.options.y || this.options.forceVertical,
        this.autoHide = !1 !== this.options.autoHide,
        this.padding = void 0 == this.options.padding ? 2 : this.options.padding,
        this.inner = this.el.find(".antiscroll-inner"),
        this.inner.css({
            width: "+=" + (this.y ? n() : 0),
            height: "+=" + (this.x ? n() : 0)
        }),
        this.refresh()
    }
    function e(i) {
        this.pane = i,
        this.pane.el.append(this.el),
        this.innerEl = this.pane.inner.get(0),
        this.dragging = !1,
        this.enter = !1,
        this.shown = !1,
        this.pane.el.mouseenter(t.proxy(this, "mouseenter")),
        this.pane.el.mouseleave(t.proxy(this, "mouseleave")),
        this.el.mousedown(t.proxy(this, "mousedown")),
        this.innerPaneScrollListener = t.proxy(this, "scroll"),
        this.pane.inner.scroll(this.innerPaneScrollListener),
        this.innerPaneMouseWheelListener = t.proxy(this, "mousewheel"),
        this.pane.inner.bind("mousewheel", this.innerPaneMouseWheelListener);
        var e = this.pane.options.initialDisplay;
        e !== !1 && (this.show(), this.pane.autoHide && (this.hiding = setTimeout(t.proxy(this, "hide"), parseInt(e, 10) || 3e3)))
    }
    function s(t, i) {
        function e() {}
        e.prototype = i.prototype,
        t.prototype = new e
    }
    function n() {
        if (void 0 === o) {
            var i = t('<div class="antiscroll-inner" style="width:50px;height:50px;overflow-y:scroll;position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%"/></div>');
            t("body").append(i);
            var e = t(i).innerWidth(),
                s = t("div", i).innerWidth();
            t(i).remove(),
            o = e - s
        }
        return o
    }
    t.fn.antiscroll = function(i) {
        return this.each(function() {
            t(this).data("antiscroll") && t(this).data("antiscroll").destroy(),
            t(this).data("antiscroll", new t.Antiscroll(this, i))
        })
    },
    t.Antiscroll = i,
    i.prototype.refresh = function() {
        var t = this.inner.get(0).scrollWidth > this.el.width() + (this.y ? n() : 0),
            i = this.inner.get(0).scrollHeight > this.el.height() + (this.x ? n() : 0);
        this.x && (!this.horizontal && t ? this.horizontal = new e.Horizontal(this) : this.horizontal && !t ? (this.horizontal.destroy(), this.horizontal = null) : this.horizontal && this.horizontal.update()),
        this.y && (!this.vertical && i ? this.vertical = new e.Vertical(this) : this.vertical && !i ? (this.vertical.destroy(), this.vertical = null) : this.vertical && this.vertical.update())
    },
    i.prototype.destroy = function() {
        return this.horizontal && (this.horizontal.destroy(), this.horizontal = null), this.vertical && (this.vertical.destroy(), this.vertical = null), this
    },
    i.prototype.rebuild = function() {
        return this.destroy(), this.inner.attr("style", ""), i.call(this, this.el, this.options), this
    },
    e.prototype.destroy = function() {
        return this.el.remove(), this.pane.inner.unbind("scroll", this.innerPaneScrollListener), this.pane.inner.unbind("mousewheel", this.innerPaneMouseWheelListener), this
    },
    e.prototype.mouseenter = function() {
        this.enter = !0,
        this.show()
    },
    e.prototype.mouseleave = function() {
        this.enter = !1,
        this.dragging || this.pane.autoHide && this.hide()
    },
    e.prototype.scroll = function() {
        this.shown || (this.show(), this.enter || this.dragging || this.pane.autoHide && (this.hiding = setTimeout(t.proxy(this, "hide"), 1500))),
        this.update()
    },
    e.prototype.mousedown = function(i) {
        i.preventDefault(),
        this.dragging = !0,
        this.startPageY = i.pageY - parseInt(this.el.css("top"), 10),
        this.startPageX = i.pageX - parseInt(this.el.css("left"), 10),
        this.el[0].ownerDocument.onselectstart = function() {
            return !1
        };
        var e = (this.pane, t.proxy(this, "mousemove")),
            s = this;
        t(this.el[0].ownerDocument).mousemove(e).mouseup(function() {
            s.dragging = !1,
            this.onselectstart = null,
            t(this).unbind("mousemove", e),
            s.enter || s.hide()
        })
    },
    e.prototype.show = function(t) {
        !this.shown && this.update() && (this.el.addClass("antiscroll-scrollbar-shown"), this.hiding && (clearTimeout(this.hiding), this.hiding = null), this.shown = !0)
    },
    e.prototype.hide = function() {
        this.pane.autoHide !== !1 && this.shown && (this.el.removeClass("antiscroll-scrollbar-shown"), this.shown = !1)
    },
    e.Horizontal = function(i) {
        this.el = t('<div class="antiscroll-scrollbar antiscroll-scrollbar-horizontal"/>', i.el),
        e.call(this, i)
    },
    s(e.Horizontal, e),
    e.Horizontal.prototype.update = function() {
        var t = this.pane.el.width(),
            i = t - 2 * this.pane.padding,
            e = this.pane.inner.get(0);
        return this.el.css("width", i * t / e.scrollWidth).css("left", i * e.scrollLeft / e.scrollWidth), t < e.scrollWidth
    },
    e.Horizontal.prototype.mousemove = function(t) {
        var i = this.pane.el.width() - 2 * this.pane.padding,
            e = t.pageX - this.startPageX,
            s = this.el.width(),
            n = this.pane.inner.get(0),
            o = Math.min(Math.max(e, 0), i - s);
        n.scrollLeft = (n.scrollWidth - this.pane.el.width()) * o / (i - s)
    },
    e.Horizontal.prototype.mousewheel = function(t, i, e, s) {
        return 0 > e && 0 == this.pane.inner.get(0).scrollLeft || e > 0 && this.innerEl.scrollLeft + Math.ceil(this.pane.el.width()) == this.innerEl.scrollWidth ? (t.preventDefault(), !1) : void 0
    },
    e.Vertical = function(i) {
        this.el = t('<div class="antiscroll-scrollbar antiscroll-scrollbar-vertical"/>', i.el),
        e.call(this, i)
    },
    s(e.Vertical, e),
    e.Vertical.prototype.update = function() {
        var t = this.pane.el.height(),
            i = t - 2 * this.pane.padding,
            e = this.innerEl,
            s = i * t / e.scrollHeight;
        s = 20 > s ? 20 : s;
        var n = i * e.scrollTop / e.scrollHeight;
        if (n + s > i) {
            var o = n + s - i;
            n = n - o - 3
        }
        return this.el.css("height", s).css("top", n), t < e.scrollHeight
    },
    e.Vertical.prototype.mousemove = function(t) {
        var i = this.pane.el.height(),
            e = i - 2 * this.pane.padding,
            s = t.pageY - this.startPageY,
            n = this.el.height(),
            o = this.innerEl,
            h = Math.min(Math.max(s, 0), e - n);
        o.scrollTop = (o.scrollHeight - i) * h / (e - n)
    },
    e.Vertical.prototype.mousewheel = function(t, i, e, s) {
        return s > 0 && 0 == this.innerEl.scrollTop || 0 > s && this.innerEl.scrollTop + Math.ceil(this.pane.el.height()) == this.innerEl.scrollHeight ? (t.preventDefault(), !1) : void 0
    };
    var o
}(jQuery);

