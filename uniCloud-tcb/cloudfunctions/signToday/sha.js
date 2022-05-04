var t, e, r = r || function(t, e) {
    var r = {}, n = r.lib = {}, i = n.Base = function() {
        function t() {}
        return {
            extend: function(e) {
                t.prototype = this;
                var r = new t();
                return e && r.mixIn(e), r.$super = this, r;
            },
            create: function() {
                var t = this.extend();
                return t.init.apply(t, arguments), t;
            },
            init: function() {},
            mixIn: function(t) {
                for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);
                t.hasOwnProperty("toString") && (this.toString = t.toString);
            },
            clone: function() {
                return this.$super.extend(this);
            }
        };
    }(), s = n.WordArray = i.extend({
        init: function(t, e) {
            t = this.words = t || [], this.sigBytes = null != e ? e : 4 * t.length;
        },
        toString: function(t) {
            return (t || a).stringify(this);
        },
        concat: function(t) {
            var e = this.words, r = t.words, n = this.sigBytes;
            t = t.sigBytes;
            if (this.clamp(), n % 4) for (var i = 0; i < t; i++) e[n + i >>> 2] |= (r[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 24 - (n + i) % 4 * 8; else if (65535 < r.length) for (i = 0; i < t; i += 4) e[n + i >>> 2] = r[i >>> 2]; else e.push.apply(e, r);
            return this.sigBytes += t, this;
        },
        clamp: function() {
            var e = this.words, r = this.sigBytes;
            e[r >>> 2] &= 4294967295 << 32 - r % 4 * 8, e.length = t.ceil(r / 4);
        },
        clone: function() {
            var t = i.clone.call(this);
            return t.words = this.words.slice(0), t;
        },
        random: function(e) {
            for (var r = [], n = 0; n < e; n += 4) r.push(4294967296 * t.random() | 0);
            return s.create(r, e);
        }
    }), o = r.enc = {}, a = o.Hex = {
        stringify: function(t) {
            for (var e = t.words, r = (t = t.sigBytes, []), n = 0; n < t; n++) {
                var i = e[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                r.push((i >>> 4).toString(16)), r.push((15 & i).toString(16));
            }
            return r.join("");
        },
        parse: function(t) {
            for (var e = t.length, r = [], n = 0; n < e; n += 2) r[n >>> 3] |= parseInt(t.substr(n, 2), 16) << 24 - n % 8 * 4;
            return s.create(r, e / 2);
        }
    }, c = o.Latin1 = {
        stringify: function(t) {
            for (var e = t.words, r = (t = t.sigBytes, []), n = 0; n < t; n++) r.push(String.fromCharCode(e[n >>> 2] >>> 24 - n % 4 * 8 & 255));
            return r.join("");
        },
        parse: function(t) {
            for (var e = t.length, r = [], n = 0; n < e; n++) r[n >>> 2] |= (255 & t.charCodeAt(n)) << 24 - n % 4 * 8;
            return s.create(r, e);
        }
    }, h = o.Utf8 = {
        stringify: function(t) {
            try {
                return decodeURIComponent(escape(c.stringify(t)));
            } catch (t) {
                throw Error("Malformed UTF-8 data");
            }
        },
        parse: function(t) {
            return c.parse(unescape(encodeURIComponent(t)));
        }
    }, u = n.BufferedBlockAlgorithm = i.extend({
        reset: function() {
            this._data = s.create(), this._nDataBytes = 0;
        },
        _append: function(t) {
            "string" == typeof t && (t = h.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes;
        },
        _process: function(e) {
            var r = this._data, n = r.words, i = r.sigBytes, o = this.blockSize, a = i / (4 * o);
            e = (a = e ? t.ceil(a) : t.max((0 | a) - this._minBufferSize, 0)) * o, i = t.min(4 * e, i);
            if (e) {
                for (var c = 0; c < e; c += o) this._doProcessBlock(n, c);
                c = n.splice(0, e), r.sigBytes -= i;
            }
            return s.create(c, i);
        },
        clone: function() {
            var t = i.clone.call(this);
            return t._data = this._data.clone(), t;
        },
        _minBufferSize: 0
    });
    n.Hasher = u.extend({
        init: function() {
            this.reset();
        },
        reset: function() {
            u.reset.call(this), this._doReset();
        },
        update: function(t) {
            return this._append(t), this._process(), this;
        },
        finalize: function(t) {
            return t && this._append(t), this._doFinalize(), this._hash;
        },
        clone: function() {
            var t = u.clone.call(this);
            return t._hash = this._hash.clone(), t;
        },
        blockSize: 16,
        _createHelper: function(t) {
            return function(e, r) {
                return t.create(r).finalize(e);
            };
        },
        _createHmacHelper: function(t) {
            return function(e, r) {
                return f.HMAC.create(t, r).finalize(e);
            };
        }
    });
    var f = r.algo = {};
    return r;
}(Math);

!function(t) {
    var e = r, n = (i = e.lib).WordArray, i = i.Hasher, s = e.algo, o = [], a = [];
    !function() {
        function e(e) {
            for (var r = t.sqrt(e), n = 2; n <= r; n++) if (!(e % n)) return !1;
            return !0;
        }
        function r(t) {
            return 4294967296 * (t - (0 | t)) | 0;
        }
        for (var n = 2, i = 0; 64 > i; ) e(n) && (8 > i && (o[i] = r(t.pow(n, .5))), a[i] = r(t.pow(n, 1 / 3)), 
        i++), n++;
    }();
    var c = [];
    s = s.SHA256 = i.extend({
        _doReset: function() {
            this._hash = n.create(o.slice(0));
        },
        _doProcessBlock: function(t, e) {
            for (var r = this._hash.words, n = r[0], i = r[1], s = r[2], o = r[3], h = r[4], u = r[5], f = r[6], l = r[7], d = 0; 64 > d; d++) {
                if (16 > d) c[d] = 0 | t[e + d]; else {
                    var p = c[d - 15], _ = c[d - 2];
                    c[d] = ((p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3) + c[d - 7] + ((_ << 15 | _ >>> 17) ^ (_ << 13 | _ >>> 19) ^ _ >>> 10) + c[d - 16];
                }
                p = l + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & u ^ ~h & f) + a[d] + c[d], 
                _ = ((n << 30 | n >>> 2) ^ (n << 19 | n >>> 13) ^ (n << 10 | n >>> 22)) + (n & i ^ n & s ^ i & s), 
                l = f, f = u, u = h, h = o + p | 0, o = s, s = i, i = n, n = p + _ | 0;
            }
            r[0] = r[0] + n | 0, r[1] = r[1] + i | 0, r[2] = r[2] + s | 0, r[3] = r[3] + o | 0, 
            r[4] = r[4] + h | 0, r[5] = r[5] + u | 0, r[6] = r[6] + f | 0, r[7] = r[7] + l | 0;
        },
        _doFinalize: function() {
            var t = this._data, e = t.words, r = 8 * this._nDataBytes, n = 8 * t.sigBytes;
            e[n >>> 5] |= 128 << 24 - n % 32, e[15 + (n + 64 >>> 9 << 4)] = r, t.sigBytes = 4 * e.length, 
            this._process();
        }
    });
    e.SHA256 = i._createHelper(s), e.HmacSHA256 = i._createHmacHelper(s);
}(Math), e = (t = r).enc.Utf8, t.algo.HMAC = t.lib.Base.extend({
    init: function(t, r) {
        t = this._hasher = t.create(), "string" == typeof r && (r = e.parse(r));
        var n = t.blockSize, i = 4 * n;
        r.sigBytes > i && (r = t.finalize(r));
        for (var s = this._oKey = r.clone(), o = this._iKey = r.clone(), a = s.words, c = o.words, h = 0; h < n; h++) a[h] ^= 1549556828, 
        c[h] ^= 909522486;
        s.sigBytes = o.sigBytes = i, this.reset();
    },
    reset: function() {
        var t = this._hasher;
        t.reset(), t.update(this._iKey);
    },
    update: function(t) {
        return this._hasher.update(t), this;
    },
    finalize: function(t) {
        var e = this._hasher;
        return t = e.finalize(t), e.reset(), e.finalize(this._oKey.clone().concat(t));
    }
}), module.exports = r;