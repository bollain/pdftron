(function () {
	/*
 *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*****************************************************************************/
	var $jscomp = $jscomp || {};
	$jscomp.scope = {};
	$jscomp.arrayIteratorImpl = function (e) {
		var d = 0;
		return function () {
			return d < e.length ? { done: !1, value: e[d++] } : { done: !0 };
		};
	};
	$jscomp.arrayIterator = function (e) {
		return { next: $jscomp.arrayIteratorImpl(e) };
	};
	$jscomp.ASSUME_ES5 = !1;
	$jscomp.ASSUME_NO_NATIVE_MAP = !1;
	$jscomp.ASSUME_NO_NATIVE_SET = !1;
	$jscomp.SIMPLE_FROUND_POLYFILL = !1;
	$jscomp.ISOLATE_POLYFILLS = !1;
	$jscomp.FORCE_POLYFILL_PROMISE = !1;
	$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
	$jscomp.defineProperty =
		$jscomp.ASSUME_ES5 || 'function' == typeof Object.defineProperties
			? Object.defineProperty
			: function (e, d, f) {
					if (e == Array.prototype || e == Object.prototype) return e;
					e[d] = f.value;
					return e;
			  };
	$jscomp.getGlobal = function (e) {
		e = [
			'object' == typeof globalThis && globalThis,
			e,
			'object' == typeof window && window,
			'object' == typeof self && self,
			'object' == typeof global && global,
		];
		for (var d = 0; d < e.length; ++d) {
			var f = e[d];
			if (f && f.Math == Math) return f;
		}
		throw Error('Cannot find global object');
	};
	$jscomp.global = $jscomp.getGlobal(this);
	$jscomp.IS_SYMBOL_NATIVE =
		'function' === typeof Symbol && 'symbol' === typeof Symbol('x');
	$jscomp.TRUST_ES6_POLYFILLS =
		!$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
	$jscomp.polyfills = {};
	$jscomp.propertyToPolyfillSymbol = {};
	$jscomp.POLYFILL_PREFIX = '$jscp$';
	var $jscomp$lookupPolyfilledValue = function (e, d) {
		var f = $jscomp.propertyToPolyfillSymbol[d];
		if (null == f) return e[d];
		f = e[f];
		return void 0 !== f ? f : e[d];
	};
	$jscomp.polyfill = function (e, d, f, a) {
		d &&
			($jscomp.ISOLATE_POLYFILLS
				? $jscomp.polyfillIsolated(e, d, f, a)
				: $jscomp.polyfillUnisolated(e, d, f, a));
	};
	$jscomp.polyfillUnisolated = function (e, d, f, a) {
		f = $jscomp.global;
		e = e.split('.');
		for (a = 0; a < e.length - 1; a++) {
			var c = e[a];
			if (!(c in f)) return;
			f = f[c];
		}
		e = e[e.length - 1];
		a = f[e];
		d = d(a);
		d != a &&
			null != d &&
			$jscomp.defineProperty(f, e, {
				configurable: !0,
				writable: !0,
				value: d,
			});
	};
	$jscomp.polyfillIsolated = function (e, d, f, a) {
		var c = e.split('.');
		e = 1 === c.length;
		a = c[0];
		a = !e && a in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
		for (var m = 0; m < c.length - 1; m++) {
			var g = c[m];
			if (!(g in a)) return;
			a = a[g];
		}
		c = c[c.length - 1];
		f = $jscomp.IS_SYMBOL_NATIVE && 'es6' === f ? a[c] : null;
		d = d(f);
		null != d &&
			(e
				? $jscomp.defineProperty($jscomp.polyfills, c, {
						configurable: !0,
						writable: !0,
						value: d,
				  })
				: d !== f &&
				  (void 0 === $jscomp.propertyToPolyfillSymbol[c] &&
						((f = (1e9 * Math.random()) >>> 0),
						($jscomp.propertyToPolyfillSymbol[c] = $jscomp.IS_SYMBOL_NATIVE
							? $jscomp.global.Symbol(c)
							: $jscomp.POLYFILL_PREFIX + f + '$' + c)),
				  $jscomp.defineProperty(a, $jscomp.propertyToPolyfillSymbol[c], {
						configurable: !0,
						writable: !0,
						value: d,
				  })));
	};
	$jscomp.initSymbol = function () {};
	$jscomp.polyfill(
		'Symbol',
		function (e) {
			if (e) return e;
			var d = function (m, g) {
				this.$jscomp$symbol$id_ = m;
				$jscomp.defineProperty(this, 'description', {
					configurable: !0,
					writable: !0,
					value: g,
				});
			};
			d.prototype.toString = function () {
				return this.$jscomp$symbol$id_;
			};
			var f = 'jscomp_symbol_' + ((1e9 * Math.random()) >>> 0) + '_',
				a = 0,
				c = function (m) {
					if (this instanceof c)
						throw new TypeError('Symbol is not a constructor');
					return new d(f + (m || '') + '_' + a++, m);
				};
			return c;
		},
		'es6',
		'es3'
	);
	$jscomp.polyfill(
		'Symbol.iterator',
		function (e) {
			if (e) return e;
			e = Symbol('Symbol.iterator');
			for (
				var d =
						'Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(
							' '
						),
					f = 0;
				f < d.length;
				f++
			) {
				var a = $jscomp.global[d[f]];
				'function' === typeof a &&
					'function' != typeof a.prototype[e] &&
					$jscomp.defineProperty(a.prototype, e, {
						configurable: !0,
						writable: !0,
						value: function () {
							return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
						},
					});
			}
			return e;
		},
		'es6',
		'es3'
	);
	$jscomp.iteratorPrototype = function (e) {
		e = { next: e };
		e[Symbol.iterator] = function () {
			return this;
		};
		return e;
	};
	$jscomp.checkEs6ConformanceViaProxy = function () {
		try {
			var e = {},
				d = Object.create(
					new $jscomp.global.Proxy(e, {
						get: function (f, a, c) {
							return f == e && 'q' == a && c == d;
						},
					})
				);
			return !0 === d.q;
		} catch (f) {
			return !1;
		}
	};
	$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS = !1;
	$jscomp.ES6_CONFORMANCE =
		$jscomp.USE_PROXY_FOR_ES6_CONFORMANCE_CHECKS &&
		$jscomp.checkEs6ConformanceViaProxy();
	$jscomp.makeIterator = function (e) {
		var d =
			'undefined' != typeof Symbol && Symbol.iterator && e[Symbol.iterator];
		return d ? d.call(e) : $jscomp.arrayIterator(e);
	};
	$jscomp.owns = function (e, d) {
		return Object.prototype.hasOwnProperty.call(e, d);
	};
	$jscomp.MapEntry = function () {};
	$jscomp.polyfill(
		'Promise',
		function (e) {
			function d() {
				this.batch_ = null;
			}
			function f(g) {
				return g instanceof c
					? g
					: new c(function (b, h) {
							b(g);
					  });
			}
			if (
				e &&
				(!(
					$jscomp.FORCE_POLYFILL_PROMISE ||
					($jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
						'undefined' === typeof $jscomp.global.PromiseRejectionEvent)
				) ||
					!$jscomp.global.Promise ||
					-1 === $jscomp.global.Promise.toString().indexOf('[native code]'))
			)
				return e;
			d.prototype.asyncExecute = function (g) {
				if (null == this.batch_) {
					this.batch_ = [];
					var b = this;
					this.asyncExecuteFunction(function () {
						b.executeBatch_();
					});
				}
				this.batch_.push(g);
			};
			var a = $jscomp.global.setTimeout;
			d.prototype.asyncExecuteFunction = function (g) {
				a(g, 0);
			};
			d.prototype.executeBatch_ = function () {
				for (; this.batch_ && this.batch_.length; ) {
					var g = this.batch_;
					this.batch_ = [];
					for (var b = 0; b < g.length; ++b) {
						var h = g[b];
						g[b] = null;
						try {
							h();
						} catch (l) {
							this.asyncThrow_(l);
						}
					}
				}
				this.batch_ = null;
			};
			d.prototype.asyncThrow_ = function (g) {
				this.asyncExecuteFunction(function () {
					throw g;
				});
			};
			var c = function (g) {
				this.state_ = 0;
				this.result_ = void 0;
				this.onSettledCallbacks_ = [];
				this.isRejectionHandled_ = !1;
				var b = this.createResolveAndReject_();
				try {
					g(b.resolve, b.reject);
				} catch (h) {
					b.reject(h);
				}
			};
			c.prototype.createResolveAndReject_ = function () {
				function g(l) {
					return function (t) {
						h || ((h = !0), l.call(b, t));
					};
				}
				var b = this,
					h = !1;
				return { resolve: g(this.resolveTo_), reject: g(this.reject_) };
			};
			c.prototype.resolveTo_ = function (g) {
				if (g === this)
					this.reject_(new TypeError('A Promise cannot resolve to itself'));
				else if (g instanceof c) this.settleSameAsPromise_(g);
				else {
					a: switch (typeof g) {
						case 'object':
							var b = null != g;
							break a;
						case 'function':
							b = !0;
							break a;
						default:
							b = !1;
					}
					b ? this.resolveToNonPromiseObj_(g) : this.fulfill_(g);
				}
			};
			c.prototype.resolveToNonPromiseObj_ = function (g) {
				var b = void 0;
				try {
					b = g.then;
				} catch (h) {
					this.reject_(h);
					return;
				}
				'function' == typeof b
					? this.settleSameAsThenable_(b, g)
					: this.fulfill_(g);
			};
			c.prototype.reject_ = function (g) {
				this.settle_(2, g);
			};
			c.prototype.fulfill_ = function (g) {
				this.settle_(1, g);
			};
			c.prototype.settle_ = function (g, b) {
				if (0 != this.state_)
					throw Error(
						'Cannot settle(' +
							g +
							', ' +
							b +
							'): Promise already settled in state' +
							this.state_
					);
				this.state_ = g;
				this.result_ = b;
				2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
				this.executeOnSettledCallbacks_();
			};
			c.prototype.scheduleUnhandledRejectionCheck_ = function () {
				var g = this;
				a(function () {
					if (g.notifyUnhandledRejection_()) {
						var b = $jscomp.global.console;
						'undefined' !== typeof b && b.error(g.result_);
					}
				}, 1);
			};
			c.prototype.notifyUnhandledRejection_ = function () {
				if (this.isRejectionHandled_) return !1;
				var g = $jscomp.global.CustomEvent,
					b = $jscomp.global.Event,
					h = $jscomp.global.dispatchEvent;
				if ('undefined' === typeof h) return !0;
				'function' === typeof g
					? (g = new g('unhandledrejection', { cancelable: !0 }))
					: 'function' === typeof b
					? (g = new b('unhandledrejection', { cancelable: !0 }))
					: ((g = $jscomp.global.document.createEvent('CustomEvent')),
					  g.initCustomEvent('unhandledrejection', !1, !0, g));
				g.promise = this;
				g.reason = this.result_;
				return h(g);
			};
			c.prototype.executeOnSettledCallbacks_ = function () {
				if (null != this.onSettledCallbacks_) {
					for (var g = 0; g < this.onSettledCallbacks_.length; ++g)
						m.asyncExecute(this.onSettledCallbacks_[g]);
					this.onSettledCallbacks_ = null;
				}
			};
			var m = new d();
			c.prototype.settleSameAsPromise_ = function (g) {
				var b = this.createResolveAndReject_();
				g.callWhenSettled_(b.resolve, b.reject);
			};
			c.prototype.settleSameAsThenable_ = function (g, b) {
				var h = this.createResolveAndReject_();
				try {
					g.call(b, h.resolve, h.reject);
				} catch (l) {
					h.reject(l);
				}
			};
			c.prototype.then = function (g, b) {
				function h(r, A) {
					return 'function' == typeof r
						? function (n) {
								try {
									l(r(n));
								} catch (C) {
									t(C);
								}
						  }
						: A;
				}
				var l,
					t,
					v = new c(function (r, A) {
						l = r;
						t = A;
					});
				this.callWhenSettled_(h(g, l), h(b, t));
				return v;
			};
			c.prototype.catch = function (g) {
				return this.then(void 0, g);
			};
			c.prototype.callWhenSettled_ = function (g, b) {
				function h() {
					switch (l.state_) {
						case 1:
							g(l.result_);
							break;
						case 2:
							b(l.result_);
							break;
						default:
							throw Error('Unexpected state: ' + l.state_);
					}
				}
				var l = this;
				null == this.onSettledCallbacks_
					? m.asyncExecute(h)
					: this.onSettledCallbacks_.push(h);
				this.isRejectionHandled_ = !0;
			};
			c.resolve = f;
			c.reject = function (g) {
				return new c(function (b, h) {
					h(g);
				});
			};
			c.race = function (g) {
				return new c(function (b, h) {
					for (
						var l = $jscomp.makeIterator(g), t = l.next();
						!t.done;
						t = l.next()
					)
						f(t.value).callWhenSettled_(b, h);
				});
			};
			c.all = function (g) {
				var b = $jscomp.makeIterator(g),
					h = b.next();
				return h.done
					? f([])
					: new c(function (l, t) {
							function v(n) {
								return function (C) {
									r[n] = C;
									A--;
									0 == A && l(r);
								};
							}
							var r = [],
								A = 0;
							do
								r.push(void 0),
									A++,
									f(h.value).callWhenSettled_(v(r.length - 1), t),
									(h = b.next());
							while (!h.done);
					  });
			};
			return c;
		},
		'es6',
		'es3'
	);
	$jscomp.checkStringArgs = function (e, d, f) {
		if (null == e)
			throw new TypeError(
				"The 'this' value for String.prototype." +
					f +
					' must not be null or undefined'
			);
		if (d instanceof RegExp)
			throw new TypeError(
				'First argument to String.prototype.' +
					f +
					' must not be a regular expression'
			);
		return e + '';
	};
	$jscomp.polyfill(
		'String.prototype.endsWith',
		function (e) {
			return e
				? e
				: function (d, f) {
						var a = $jscomp.checkStringArgs(this, d, 'endsWith');
						d += '';
						void 0 === f && (f = a.length);
						f = Math.max(0, Math.min(f | 0, a.length));
						for (var c = d.length; 0 < c && 0 < f; )
							if (a[--f] != d[--c]) return !1;
						return 0 >= c;
				  };
		},
		'es6',
		'es3'
	);
	$jscomp.underscoreProtoCanBeSet = function () {
		var e = { a: !0 },
			d = {};
		try {
			return (d.__proto__ = e), d.a;
		} catch (f) {}
		return !1;
	};
	$jscomp.setPrototypeOf =
		$jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.setPrototypeOf
			? Object.setPrototypeOf
			: $jscomp.underscoreProtoCanBeSet()
			? function (e, d) {
					e.__proto__ = d;
					if (e.__proto__ !== d) throw new TypeError(e + ' is not extensible');
					return e;
			  }
			: null;
	$jscomp.assign =
		$jscomp.TRUST_ES6_POLYFILLS && 'function' == typeof Object.assign
			? Object.assign
			: function (e, d) {
					for (var f = 1; f < arguments.length; f++) {
						var a = arguments[f];
						if (a) for (var c in a) $jscomp.owns(a, c) && (e[c] = a[c]);
					}
					return e;
			  };
	(function (e) {
		function d(a) {
			if (f[a]) return f[a].exports;
			var c = (f[a] = { i: a, l: !1, exports: {} });
			e[a].call(c.exports, c, c.exports, d);
			c.l = !0;
			return c.exports;
		}
		var f = {};
		d.m = e;
		d.c = f;
		d.d = function (a, c, m) {
			d.o(a, c) || Object.defineProperty(a, c, { enumerable: !0, get: m });
		};
		d.r = function (a) {
			'undefined' !== typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(a, Symbol.toStringTag, { value: 'Module' });
			Object.defineProperty(a, '__esModule', { value: !0 });
		};
		d.t = function (a, c) {
			c & 1 && (a = d(a));
			if (c & 8 || (c & 4 && 'object' === typeof a && a && a.__esModule))
				return a;
			var m = Object.create(null);
			d.r(m);
			Object.defineProperty(m, 'default', { enumerable: !0, value: a });
			if (c & 2 && 'string' != typeof a)
				for (var g in a)
					d.d(
						m,
						g,
						function (b) {
							return a[b];
						}.bind(null, g)
					);
			return m;
		};
		d.n = function (a) {
			var c =
				a && a.__esModule
					? function () {
							return a['default'];
					  }
					: function () {
							return a;
					  };
			d.d(c, 'a', c);
			return c;
		};
		d.o = function (a, c) {
			return Object.prototype.hasOwnProperty.call(a, c);
		};
		d.p = '/core/office/';
		return d((d.s = 13));
	})([
		function (e, d, f) {
			f.d(d, 'c', function () {
				return c;
			});
			f.d(d, 'a', function () {
				return g;
			});
			f.d(d, 'b', function () {
				return m;
			});
			var a = f(1),
				c = function (b, h) {
					Object(a.a)('disableLogs') ||
						(h ? console.warn(b + ': ' + h) : console.warn(b));
				},
				m = function (b, h, l, t) {
					void 0 === t && (t = !1);
					var v = l.pop();
					l = l.length ? l.join(', ') + ' and ' + v : v;
					t
						? c(
								"'" +
									h +
									"' will be deprecated in version " +
									b +
									'. Please use ' +
									l +
									' instead.'
						  )
						: c(
								"'" +
									h +
									"' is deprecated since version " +
									b +
									'. Please use ' +
									l +
									' instead.'
						  );
				},
				g = function (b, h) {};
		},
		function (e, d, f) {
			f.d(d, 'a', function () {
				return m;
			});
			f.d(d, 'b', function () {
				return g;
			});
			var a = {},
				c = {
					flattenedResources: !1,
					CANVAS_CACHE_SIZE: void 0,
					maxPagesBefore: void 0,
					maxPagesAhead: void 0,
					disableLogs: !1,
					wvsQueryParameters: {},
					_trnDebugMode: !1,
					_logFiltersEnabled: null,
				},
				m = function (b) {
					return c[b];
				},
				g = function (b, h) {
					var l;
					c[b] = h;
					null === (l = a[b]) || void 0 === l
						? void 0
						: l.forEach(function (t) {
								t(h);
						  });
				};
		},
		function (e, d, f) {
			f.d(d, 'a', function () {
				return x;
			});
			f.d(d, 'b', function () {
				return y;
			});
			f.d(d, 'c', function () {
				return F;
			});
			var a = f(7),
				c = f(0),
				m = f(4),
				g = f(3),
				b = 'undefined' === typeof window ? self : window,
				h = b.importScripts,
				l = !1,
				t = function (k, q) {
					l || (h(b.basePath + 'decode.min.js'), (l = !0));
					k = self.BrotliDecode(Object(g.b)(k));
					return q ? k : Object(g.a)(k);
				},
				v = function (k, q) {
					return Object(a.a)(void 0, void 0, Promise, function () {
						var u;
						return Object(a.b)(this, function (z) {
							switch (z.label) {
								case 0:
									return l
										? [3, 2]
										: [
												4,
												Object(m.a)(
													self.Core.getWorkerPath() + 'external/decode.min.js',
													'Failed to download decode.min.js',
													window
												),
										  ];
								case 1:
									z.sent(), (l = !0), (z.label = 2);
								case 2:
									return (
										(u = self.BrotliDecode(Object(g.b)(k))),
										[2, q ? u : Object(g.a)(u)]
									);
							}
						});
					});
				};
			(function () {
				function k() {
					this.remainingDataArrays = [];
				}
				k.prototype.processRaw = function (q) {
					return q;
				};
				k.prototype.processBrotli = function (q) {
					this.remainingDataArrays.push(q);
					return null;
				};
				k.prototype.GetNextChunk = function (q) {
					this.decodeFunction ||
						(this.decodeFunction =
							0 === q[0] && 97 === q[1] && 115 === q[2] && 109 === q[3]
								? this.processRaw
								: this.processBrotli);
					return this.decodeFunction(q);
				};
				k.prototype.End = function () {
					if (this.remainingDataArrays.length) {
						for (var q = this.arrays, u = 0, z = 0; z < q.length; ++z)
							u += q[z].length;
						u = new Uint8Array(u);
						var J = 0;
						for (z = 0; z < q.length; ++z) {
							var p = q[z];
							u.set(p, J);
							J += p.length;
						}
						return t(u, !0);
					}
					return null;
				};
				return k;
			})();
			var r = !1,
				A = function (k) {
					r || (h(b.basePath + 'pako_inflate.min.js'), (r = !0));
					var q = 10;
					if ('string' === typeof k) {
						if (k.charCodeAt(3) & 8) {
							for (; 0 !== k.charCodeAt(q); ++q);
							++q;
						}
					} else if (k[3] & 8) {
						for (; 0 !== k[q]; ++q);
						++q;
					}
					k = Object(g.b)(k);
					k = k.subarray(q, k.length - 8);
					return b.pako.inflate(k, { windowBits: -15 });
				},
				n = function (k, q) {
					return q ? k : Object(g.a)(k);
				},
				C = function (k) {
					var q = !k.shouldOutputArray,
						u = new XMLHttpRequest();
					u.open('GET', k.url, k.isAsync);
					var z = q && u.overrideMimeType;
					u.responseType = z ? 'text' : 'arraybuffer';
					z && u.overrideMimeType('text/plain; charset=x-user-defined');
					u.send();
					var J = function () {
						var w = Date.now();
						var D = z ? u.responseText : new Uint8Array(u.response);
						Object(c.a)('worker', 'Result length is ' + D.length);
						D.length < k.compressedMaximum
							? ((D = k.decompressFunction(D, k.shouldOutputArray)),
							  Object(c.c)(
									'There may be some degradation of performance. Your server has not been configured to serve .gz. and .br. files with the expected Content-Encoding. See http://www.pdftron.com/kb_content_encoding for instructions on how to resolve this.'
							  ),
							  h &&
									Object(c.a)('worker', 'Decompressed length is ' + D.length))
							: q && (D = Object(g.a)(D));
						h &&
							Object(c.a)(
								'worker',
								k.url + ' Decompression took ' + (Date.now() - w)
							);
						return D;
					};
					if (k.isAsync)
						var p = new Promise(function (w, D) {
							u.onload = function () {
								200 === this.status || 0 === this.status
									? w(J())
									: D('Download Failed ' + k.url);
							};
							u.onerror = function () {
								D('Network error occurred ' + k.url);
							};
						});
					else {
						if (200 === u.status || 0 === u.status) return J();
						throw Error('Failed to load ' + k.url);
					}
					return p;
				},
				x = function (k) {
					var q = k.lastIndexOf('/');
					-1 === q && (q = 0);
					var u = k.slice(q).replace('.', '.br.');
					h ||
						(u.endsWith('.js.mem')
							? (u = u.replace('.js.mem', '.mem'))
							: u.endsWith('.js') && (u = u.concat('.mem')));
					return k.slice(0, q) + u;
				},
				H = function (k, q) {
					var u = k.lastIndexOf('/');
					-1 === u && (u = 0);
					var z = k.slice(u).replace('.', '.gz.');
					q.url = k.slice(0, u) + z;
					q.decompressFunction = A;
					return C(q);
				},
				E = function (k, q) {
					q.url = x(k);
					q.decompressFunction = h ? t : v;
					return C(q);
				},
				I = function (k, q) {
					k.endsWith('.js.mem')
						? (k = k.slice(0, -4))
						: k.endsWith('.mem') && (k = k.slice(0, -4) + '.js.mem');
					q.url = k;
					q.decompressFunction = n;
					return C(q);
				},
				K = function (k, q, u, z) {
					return k.catch(function (J) {
						Object(c.c)(J);
						return z(q, u);
					});
				},
				B = function (k, q, u) {
					var z;
					if (u.isAsync) {
						var J = q[0](k, u);
						for (z = 1; z < q.length; ++z) J = K(J, k, u, q[z]);
						return J;
					}
					for (z = 0; z < q.length; ++z)
						try {
							return q[z](k, u);
						} catch (p) {
							Object(c.c)(p.message);
						}
					throw Error('');
				},
				F = function (k, q, u, z) {
					return B(k, [H, E, I], {
						compressedMaximum: q,
						isAsync: u,
						shouldOutputArray: z,
					});
				},
				y = function (k, q, u, z) {
					return B(k, [E, H, I], {
						compressedMaximum: q,
						isAsync: u,
						shouldOutputArray: z,
					});
				};
		},
		function (e, d, f) {
			f.d(d, 'b', function () {
				return a;
			});
			f.d(d, 'a', function () {
				return c;
			});
			var a = function (m) {
					if ('string' === typeof m) {
						for (
							var g = new Uint8Array(m.length), b = m.length, h = 0;
							h < b;
							h++
						)
							g[h] = m.charCodeAt(h);
						return g;
					}
					return m;
				},
				c = function (m) {
					if ('string' !== typeof m) {
						for (var g = '', b = 0, h = m.length, l; b < h; )
							(l = m.subarray(b, b + 1024)),
								(b += 1024),
								(g += String.fromCharCode.apply(null, l));
						return g;
					}
					return m;
				};
		},
		function (e, d, f) {
			function a(m, g, b) {
				return new Promise(function (h) {
					if (!m) return h();
					var l = b.document.createElement('script');
					l.type = 'text/javascript';
					l.onload = function () {
						h();
					};
					l.onerror = function () {
						g && Object(c.c)(g);
						h();
					};
					l.src = m;
					b.document.getElementsByTagName('head')[0].appendChild(l);
				});
			}
			f.d(d, 'a', function () {
				return a;
			});
			var c = f(0);
		},
		function (e, d, f) {
			function a(b, h, l) {
				function t(A) {
					r = r || Date.now();
					return A
						? (Object(c.a)('load', 'Try instantiateStreaming'),
						  fetch(Object(m.a)(b))
								.then(function (n) {
									return WebAssembly.instantiateStreaming(n, h);
								})
								.catch(function (n) {
									Object(c.a)(
										'load',
										'instantiateStreaming Failed ' + b + ' message ' + n.message
									);
									return t(!1);
								}))
						: Object(m.b)(b, l, !0, !0).then(function (n) {
								v = Date.now();
								Object(c.a)('load', 'Request took ' + (v - r) + ' ms');
								return WebAssembly.instantiate(n, h);
						  });
				}
				var v, r;
				return t(!!WebAssembly.instantiateStreaming).then(function (A) {
					Object(c.a)(
						'load',
						'WASM compilation took ' + (Date.now() - (v || r)) + ' ms'
					);
					return A;
				});
			}
			f.d(d, 'a', function () {
				return a;
			});
			var c = f(0),
				m = f(2),
				g = f(4);
			f.d(d, 'b', function () {
				return g.a;
			});
		},
		function (e, d) {
			d = (function () {
				return this;
			})();
			try {
				d = d || new Function('return this')();
			} catch (f) {
				'object' === typeof window && (d = window);
			}
			e.exports = d;
		},
		function (e, d, f) {
			function a(m, g, b, h) {
				function l(t) {
					return t instanceof b
						? t
						: new b(function (v) {
								v(t);
						  });
				}
				return new (b || (b = Promise))(function (t, v) {
					function r(C) {
						try {
							n(h.next(C));
						} catch (x) {
							v(x);
						}
					}
					function A(C) {
						try {
							n(h['throw'](C));
						} catch (x) {
							v(x);
						}
					}
					function n(C) {
						C.done ? t(C.value) : l(C.value).then(r, A);
					}
					n((h = h.apply(m, g || [])).next());
				});
			}
			function c(m, g) {
				function b(n) {
					return function (C) {
						return h([n, C]);
					};
				}
				function h(n) {
					if (t) throw new TypeError('Generator is already executing.');
					for (; l; )
						try {
							if (
								((t = 1),
								v &&
									(r =
										n[0] & 2
											? v['return']
											: n[0]
											? v['throw'] || ((r = v['return']) && r.call(v), 0)
											: v.next) &&
									!(r = r.call(v, n[1])).done)
							)
								return r;
							if (((v = 0), r)) n = [n[0] & 2, r.value];
							switch (n[0]) {
								case 0:
								case 1:
									r = n;
									break;
								case 4:
									return l.label++, { value: n[1], done: !1 };
								case 5:
									l.label++;
									v = n[1];
									n = [0];
									continue;
								case 7:
									n = l.ops.pop();
									l.trys.pop();
									continue;
								default:
									if (
										!((r = l.trys), (r = 0 < r.length && r[r.length - 1])) &&
										(6 === n[0] || 2 === n[0])
									) {
										l = 0;
										continue;
									}
									if (3 === n[0] && (!r || (n[1] > r[0] && n[1] < r[3])))
										l.label = n[1];
									else if (6 === n[0] && l.label < r[1])
										(l.label = r[1]), (r = n);
									else if (r && l.label < r[2]) (l.label = r[2]), l.ops.push(n);
									else {
										r[2] && l.ops.pop();
										l.trys.pop();
										continue;
									}
							}
							n = g.call(m, l);
						} catch (C) {
							(n = [6, C]), (v = 0);
						} finally {
							t = r = 0;
						}
					if (n[0] & 5) throw n[1];
					return { value: n[0] ? n[1] : void 0, done: !0 };
				}
				var l = {
						label: 0,
						sent: function () {
							if (r[0] & 1) throw r[1];
							return r[1];
						},
						trys: [],
						ops: [],
					},
					t,
					v,
					r,
					A;
				return (
					(A = { next: b(0), throw: b(1), return: b(2) }),
					'function' === typeof Symbol &&
						(A[Symbol.iterator] = function () {
							return this;
						}),
					A
				);
			}
			f.d(d, 'a', function () {
				return a;
			});
			f.d(d, 'b', function () {
				return c;
			});
		},
		function (e, d, f) {
			d.a = function () {
				ArrayBuffer.prototype.slice ||
					(ArrayBuffer.prototype.slice = function (a, c) {
						void 0 === a && (a = 0);
						void 0 === c && (c = this.byteLength);
						a = Math.floor(a);
						c = Math.floor(c);
						0 > a && (a += this.byteLength);
						0 > c && (c += this.byteLength);
						a = Math.min(Math.max(0, a), this.byteLength);
						c = Math.min(Math.max(0, c), this.byteLength);
						if (0 >= c - a) return new ArrayBuffer(0);
						var m = new ArrayBuffer(c - a),
							g = new Uint8Array(m);
						a = new Uint8Array(this, a, c - a);
						g.set(a);
						return m;
					});
			};
		},
		function (e, d, f) {
			f.d(d, 'a', function () {
				return a;
			});
			f(10);
			var a = function (c, m) {
				return function () {};
			};
		},
		function (e, d, f) {
			d.a = function (a) {
				var c = {};
				decodeURIComponent(a.slice(1))
					.split('&')
					.forEach(function (m) {
						m = m.split('=', 2);
						c[m[0]] = m[1];
					});
				return c;
			};
		},
		function (e, d, f) {
			f.d(d, 'a', function () {
				return b;
			});
			var a = f(2),
				c = f(5),
				m = f(12),
				g = (function () {
					function h(l) {
						var t = this;
						this.promise = l.then(function (v) {
							t.response = v;
							t.status = 200;
						});
					}
					h.prototype.addEventListener = function (l, t) {
						this.promise.then(t);
					};
					return h;
				})(),
				b = function (h, l, t) {
					if (Object(m.a)() && !t)
						(self.Module.instantiateWasm = function (r, A) {
							return Object(c.a)(h + 'Wasm.wasm', r, l['Wasm.wasm']).then(
								function (n) {
									A(n.instance);
								}
							);
						}),
							(t = Object(a.b)(h + 'Wasm.js.mem', l['Wasm.js.mem'], !1, !1));
					else {
						t = Object(a.b)(
							(self.Module.asmjsPrefix ? self.Module.asmjsPrefix : '') +
								h +
								'.js.mem',
							l['.js.mem'],
							!1
						);
						var v = Object(a.c)(
							(self.Module.memoryInitializerPrefixURL
								? self.Module.memoryInitializerPrefixURL
								: '') +
								h +
								'.mem',
							l['.mem'],
							!0,
							!0
						);
						self.Module.memoryInitializerRequest = new g(v);
					}
					t = new Blob([t], { type: 'application/javascript' });
					importScripts(URL.createObjectURL(t));
				};
		},
		function (e, d, f) {
			f.d(d, 'a', function () {
				return A;
			});
			f(0);
			var a = 'undefined' === typeof window ? self : window;
			e = (function () {
				var n = navigator.userAgent.toLowerCase();
				return (n =
					/(msie) ([\w.]+)/.exec(n) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(n))
					? parseInt(n[2], 10)
					: n;
			})();
			var c = (function () {
				var n = a.navigator.userAgent.match(/OPR/),
					C = a.navigator.userAgent.match(/Maxthon/),
					x = a.navigator.userAgent.match(/Edge/);
				return a.navigator.userAgent.match(/Chrome\/(.*?) /) && !n && !C && !x;
			})();
			(function () {
				if (!c) return null;
				var n = a.navigator.userAgent.match(/Chrome\/([0-9]+)\./);
				return n ? parseInt(n[1], 10) : n;
			})();
			var m =
				!!navigator.userAgent.match(/Edge/i) ||
				(navigator.userAgent.match(/Edg\/(.*?)/) &&
					a.navigator.userAgent.match(/Chrome\/(.*?) /));
			(function () {
				if (!m) return null;
				var n = a.navigator.userAgent.match(/Edg\/([0-9]+)\./);
				return n ? parseInt(n[1], 10) : n;
			})();
			d =
				/iPad|iPhone|iPod/.test(a.navigator.platform) ||
				('MacIntel' === navigator.platform && 1 < navigator.maxTouchPoints) ||
				/iPad|iPhone|iPod/.test(a.navigator.userAgent);
			var g = (function () {
					var n = a.navigator.userAgent.match(
						/.*\/([0-9\.]+)\s(Safari|Mobile).*/i
					);
					return n ? parseFloat(n[1]) : n;
				})(),
				b =
					/^((?!chrome|android).)*safari/i.test(a.navigator.userAgent) ||
					(/^((?!chrome|android).)*$/.test(a.navigator.userAgent) && d),
				h = a.navigator.userAgent.match(/Firefox/);
			(function () {
				if (!h) return null;
				var n = a.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
				return n ? parseInt(n[1], 10) : n;
			})();
			e || /Android|webOS|Touch|IEMobile|Silk/i.test(navigator.userAgent);
			navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
			a.navigator.userAgent.indexOf('Android');
			var l = /Mac OS X 10_13_6.*\(KHTML, like Gecko\)$/.test(
					a.navigator.userAgent
				),
				t = a.navigator.userAgent.match(/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i)
					? 14 <=
					  parseInt(
							a.navigator.userAgent.match(
								/(iPad|iPhone).+\sOS\s((\d+)(_\d)*)/i
							)[3],
							10
					  )
					: !1,
				v = !(!self.WebAssembly || !self.WebAssembly.validate),
				r =
					-1 < a.navigator.userAgent.indexOf('Edge/16') ||
					-1 < a.navigator.userAgent.indexOf('MSAppHost'),
				A = function () {
					return v && !r && !(!t && ((b && 14 > g) || l));
				};
		},
		function (e, d, f) {
			e.exports = f(14);
		},
		function (e, d, f) {
			f.r(d);
			f(15);
			f(20);
			e = f(8);
			f(21);
			Object(e.a)();
		},
		function (e, d, f) {
			(function (a, c) {
				function m(g) {
					'@babel/helpers - typeof';
					return (
						(m =
							'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
								? function (b) {
										return typeof b;
								  }
								: function (b) {
										return b &&
											'function' == typeof Symbol &&
											b.constructor === Symbol &&
											b !== Symbol.prototype
											? 'symbol'
											: typeof b;
								  }),
						m(g)
					);
				}
				(function (g) {
					function b() {
						for (var p = 0; p < z.length; p++) z[p][0](z[p][1]);
						z = [];
						J = !1;
					}
					function h(p, w) {
						z.push([p, w]);
						J || ((J = !0), u(b, 0));
					}
					function l(p, w) {
						function D(G) {
							r(w, G);
						}
						function L(G) {
							n(w, G);
						}
						try {
							p(D, L);
						} catch (G) {
							L(G);
						}
					}
					function t(p) {
						var w = p.owner,
							D = w.state_;
						w = w.data_;
						var L = p[D];
						p = p.then;
						if ('function' === typeof L) {
							D = y;
							try {
								w = L(w);
							} catch (G) {
								n(p, G);
							}
						}
						v(p, w) || (D === y && r(p, w), D === k && n(p, w));
					}
					function v(p, w) {
						var D;
						try {
							if (p === w)
								throw new TypeError(
									'A promises callback cannot return that same promise.'
								);
							if (w && ('function' === typeof w || 'object' === m(w))) {
								var L = w.then;
								if ('function' === typeof L)
									return (
										L.call(
											w,
											function (G) {
												D || ((D = !0), w !== G ? r(p, G) : A(p, G));
											},
											function (G) {
												D || ((D = !0), n(p, G));
											}
										),
										!0
									);
							}
						} catch (G) {
							return D || n(p, G), !0;
						}
						return !1;
					}
					function r(p, w) {
						(p !== w && v(p, w)) || A(p, w);
					}
					function A(p, w) {
						p.state_ === B && ((p.state_ = F), (p.data_ = w), h(x, p));
					}
					function n(p, w) {
						p.state_ === B && ((p.state_ = F), (p.data_ = w), h(H, p));
					}
					function C(p) {
						var w = p.then_;
						p.then_ = void 0;
						for (p = 0; p < w.length; p++) t(w[p]);
					}
					function x(p) {
						p.state_ = y;
						C(p);
					}
					function H(p) {
						p.state_ = k;
						C(p);
					}
					function E(p) {
						if ('function' !== typeof p)
							throw new TypeError(
								'Promise constructor takes a function argument'
							);
						if (!(this instanceof E))
							throw new TypeError(
								"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
							);
						this.then_ = [];
						l(p, this);
					}
					g.createPromiseCapability = function () {
						var p = {};
						p.promise = new E(function (w, D) {
							p.resolve = w;
							p.reject = D;
						});
						return p;
					};
					var I = g.Promise,
						K =
							I &&
							'resolve' in I &&
							'reject' in I &&
							'all' in I &&
							'race' in I &&
							(function () {
								var p;
								new I(function (w) {
									p = w;
								});
								return 'function' === typeof p;
							})();
					'undefined' !== typeof exports && exports
						? ((exports.Promise = K ? I : E), (exports.Polyfill = E))
						: 'function' === typeof define && f(19)
						? define(function () {
								return K ? I : E;
						  })
						: K || (g.Promise = E);
					var B = 'pending',
						F = 'sealed',
						y = 'fulfilled',
						k = 'rejected',
						q = function () {},
						u = 'undefined' !== typeof c ? c : setTimeout,
						z = [],
						J;
					E.prototype = {
						constructor: E,
						state_: B,
						then_: null,
						data_: void 0,
						then: function (p, w) {
							p = {
								owner: this,
								then: new this.constructor(q),
								fulfilled: p,
								rejected: w,
							};
							this.state_ === y || this.state_ === k
								? h(t, p)
								: this.then_.push(p);
							return p.then;
						},
						catch: function (p) {
							return this.then(null, p);
						},
					};
					E.all = function (p) {
						if ('[object Array]' !== Object.prototype.toString.call(p))
							throw new TypeError('You must pass an array to Promise.all().');
						return new this(function (w, D) {
							function L(P) {
								O++;
								return function (Q) {
									G[P] = Q;
									--O || w(G);
								};
							}
							for (var G = [], O = 0, M = 0, N; M < p.length; M++)
								(N = p[M]) && 'function' === typeof N.then
									? N.then(L(M), D)
									: (G[M] = N);
							O || w(G);
						});
					};
					E.race = function (p) {
						if ('[object Array]' !== Object.prototype.toString.call(p))
							throw new TypeError('You must pass an array to Promise.race().');
						return new this(function (w, D) {
							for (var L = 0, G; L < p.length; L++)
								(G = p[L]) && 'function' === typeof G.then
									? G.then(w, D)
									: w(G);
						});
					};
					E.resolve = function (p) {
						return p && 'object' === m(p) && p.constructor === this
							? p
							: new this(function (w) {
									w(p);
							  });
					};
					E.reject = function (p) {
						return new this(function (w, D) {
							D(p);
						});
					};
				})(
					'undefined' !== typeof window
						? window
						: 'undefined' !== typeof a
						? a
						: 'undefined' !== typeof self
						? self
						: void 0
				);
			}.call(this, f(6), f(16).setImmediate));
		},
		function (e, d, f) {
			(function (a) {
				function c(b, h) {
					this._id = b;
					this._clearFn = h;
				}
				var m =
						('undefined' !== typeof a && a) ||
						('undefined' !== typeof self && self) ||
						window,
					g = Function.prototype.apply;
				d.setTimeout = function () {
					return new c(g.call(setTimeout, m, arguments), clearTimeout);
				};
				d.setInterval = function () {
					return new c(g.call(setInterval, m, arguments), clearInterval);
				};
				d.clearTimeout = d.clearInterval = function (b) {
					b && b.close();
				};
				c.prototype.unref = c.prototype.ref = function () {};
				c.prototype.close = function () {
					this._clearFn.call(m, this._id);
				};
				d.enroll = function (b, h) {
					clearTimeout(b._idleTimeoutId);
					b._idleTimeout = h;
				};
				d.unenroll = function (b) {
					clearTimeout(b._idleTimeoutId);
					b._idleTimeout = -1;
				};
				d._unrefActive = d.active = function (b) {
					clearTimeout(b._idleTimeoutId);
					var h = b._idleTimeout;
					0 <= h &&
						(b._idleTimeoutId = setTimeout(function () {
							b._onTimeout && b._onTimeout();
						}, h));
				};
				f(17);
				d.setImmediate =
					('undefined' !== typeof self && self.setImmediate) ||
					('undefined' !== typeof a && a.setImmediate) ||
					(this && this.setImmediate);
				d.clearImmediate =
					('undefined' !== typeof self && self.clearImmediate) ||
					('undefined' !== typeof a && a.clearImmediate) ||
					(this && this.clearImmediate);
			}.call(this, f(6)));
		},
		function (e, d, f) {
			(function (a, c) {
				(function (m, g) {
					function b(B) {
						delete x[B];
					}
					function h(B) {
						if (H) setTimeout(h, 0, B);
						else {
							var F = x[B];
							if (F) {
								H = !0;
								try {
									var y = F.callback,
										k = F.args;
									switch (k.length) {
										case 0:
											y();
											break;
										case 1:
											y(k[0]);
											break;
										case 2:
											y(k[0], k[1]);
											break;
										case 3:
											y(k[0], k[1], k[2]);
											break;
										default:
											y.apply(g, k);
									}
								} finally {
									b(B), (H = !1);
								}
							}
						}
					}
					function l() {
						I = function (B) {
							c.nextTick(function () {
								h(B);
							});
						};
					}
					function t() {
						if (m.postMessage && !m.importScripts) {
							var B = !0,
								F = m.onmessage;
							m.onmessage = function () {
								B = !1;
							};
							m.postMessage('', '*');
							m.onmessage = F;
							return B;
						}
					}
					function v() {
						var B = 'setImmediate$' + Math.random() + '$',
							F = function (y) {
								y.source === m &&
									'string' === typeof y.data &&
									0 === y.data.indexOf(B) &&
									h(+y.data.slice(B.length));
							};
						m.addEventListener
							? m.addEventListener('message', F, !1)
							: m.attachEvent('onmessage', F);
						I = function (y) {
							m.postMessage(B + y, '*');
						};
					}
					function r() {
						var B = new MessageChannel();
						B.port1.onmessage = function (F) {
							h(F.data);
						};
						I = function (F) {
							B.port2.postMessage(F);
						};
					}
					function A() {
						var B = E.documentElement;
						I = function (F) {
							var y = E.createElement('script');
							y.onreadystatechange = function () {
								h(F);
								y.onreadystatechange = null;
								B.removeChild(y);
								y = null;
							};
							B.appendChild(y);
						};
					}
					function n() {
						I = function (B) {
							setTimeout(h, 0, B);
						};
					}
					if (!m.setImmediate) {
						var C = 1,
							x = {},
							H = !1,
							E = m.document,
							I,
							K = Object.getPrototypeOf && Object.getPrototypeOf(m);
						K = K && K.setTimeout ? K : m;
						'[object process]' === {}.toString.call(m.process)
							? l()
							: t()
							? v()
							: m.MessageChannel
							? r()
							: E && 'onreadystatechange' in E.createElement('script')
							? A()
							: n();
						K.setImmediate = function (B) {
							'function' !== typeof B && (B = new Function('' + B));
							for (
								var F = Array(arguments.length - 1), y = 0;
								y < F.length;
								y++
							)
								F[y] = arguments[y + 1];
							x[C] = { callback: B, args: F };
							I(C);
							return C++;
						};
						K.clearImmediate = b;
					}
				})(
					'undefined' === typeof self
						? 'undefined' === typeof a
							? this
							: a
						: self
				);
			}.call(this, f(6), f(18)));
		},
		function (e, d) {
			function f() {
				throw Error('setTimeout has not been defined');
			}
			function a() {
				throw Error('clearTimeout has not been defined');
			}
			function c(x) {
				if (t === setTimeout) return setTimeout(x, 0);
				if ((t === f || !t) && setTimeout)
					return (t = setTimeout), setTimeout(x, 0);
				try {
					return t(x, 0);
				} catch (H) {
					try {
						return t.call(null, x, 0);
					} catch (E) {
						return t.call(this, x, 0);
					}
				}
			}
			function m(x) {
				if (v === clearTimeout) return clearTimeout(x);
				if ((v === a || !v) && clearTimeout)
					return (v = clearTimeout), clearTimeout(x);
				try {
					return v(x);
				} catch (H) {
					try {
						return v.call(null, x);
					} catch (E) {
						return v.call(this, x);
					}
				}
			}
			function g() {
				A &&
					n &&
					((A = !1), n.length ? (r = n.concat(r)) : (C = -1), r.length && b());
			}
			function b() {
				if (!A) {
					var x = c(g);
					A = !0;
					for (var H = r.length; H; ) {
						n = r;
						for (r = []; ++C < H; ) n && n[C].run();
						C = -1;
						H = r.length;
					}
					n = null;
					A = !1;
					m(x);
				}
			}
			function h(x, H) {
				this.fun = x;
				this.array = H;
			}
			function l() {}
			e = e.exports = {};
			try {
				var t = 'function' === typeof setTimeout ? setTimeout : f;
			} catch (x) {
				t = f;
			}
			try {
				var v = 'function' === typeof clearTimeout ? clearTimeout : a;
			} catch (x) {
				v = a;
			}
			var r = [],
				A = !1,
				n,
				C = -1;
			e.nextTick = function (x) {
				var H = Array(arguments.length - 1);
				if (1 < arguments.length)
					for (var E = 1; E < arguments.length; E++) H[E - 1] = arguments[E];
				r.push(new h(x, H));
				1 !== r.length || A || c(b);
			};
			h.prototype.run = function () {
				this.fun.apply(null, this.array);
			};
			e.title = 'browser';
			e.browser = !0;
			e.env = {};
			e.argv = [];
			e.version = '';
			e.versions = {};
			e.on = l;
			e.addListener = l;
			e.once = l;
			e.off = l;
			e.removeListener = l;
			e.removeAllListeners = l;
			e.emit = l;
			e.prependListener = l;
			e.prependOnceListener = l;
			e.listeners = function (x) {
				return [];
			};
			e.binding = function (x) {
				throw Error('process.binding is not supported');
			};
			e.cwd = function () {
				return '/';
			};
			e.chdir = function (x) {
				throw Error('process.chdir is not supported');
			};
			e.umask = function () {
				return 0;
			};
		},
		function (e, d) {
			e.exports = {};
		},
		function (e, d, f) {
			(function (a) {
				'undefined' === typeof a.crypto &&
					(a.crypto = {
						getRandomValues: function (c) {
							for (var m = 0; m < c.length; m++) c[m] = 256 * Math.random();
						},
					});
			})('undefined' === typeof window ? self : window);
		},
		function (e, d, f) {
			function a(b) {
				'@babel/helpers - typeof';
				return (
					(a =
						'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
							? function (h) {
									return typeof h;
							  }
							: function (h) {
									return h &&
										'function' == typeof Symbol &&
										h.constructor === Symbol &&
										h !== Symbol.prototype
										? 'symbol'
										: typeof h;
							  }),
					a(b)
				);
			}
			var c = f(9),
				m = f(11),
				g = null;
			(function (b) {
				function h(x) {
					n || (n = []);
					n.push(x);
				}
				var l,
					t,
					v,
					r,
					A = !1,
					n = [],
					C = function () {
						function x() {
							l = function () {};
						}
						function H(y) {
							var k = [];
							return {
								resource_array: k,
								msg: JSON.stringify(y.data, function (q, u) {
									if (
										'object' === a(u) &&
										((q = null),
										u instanceof Uint8Array
											? (q = u)
											: u instanceof ArrayBuffer && (q = new Uint8Array(u)),
										q)
									) {
										u = v(q.length);
										var z = r(u);
										z &&
											new Uint8Array(Module.HEAPU8.buffer, z, q.length).set(q);
										k.push(u);
										return { __trn_res_id: u };
									}
									return u;
								}),
							};
						}
						function E() {
							A = !0;
							postMessage({
								type: 'abort',
								data: { error: 'Office worker has terminated unexpectedly' },
							});
						}
						function I(y) {
							if (!A)
								try {
									var k = H(y);
									t(k.msg);
								} catch (q) {
									E(q);
								}
						}
						b.basePath = '../';
						var K = b.officeWorkerPath || '';
						b.workerBasePath && (b.basePath = b.workerBasePath);
						b.basePath = b.externalPath
							? b.externalPath
							: b.basePath + 'external/';
						importScripts(''.concat(b.basePath, 'Promise.js'));
						b.ContinueFunc = function (y) {
							l('ContinueFunc called');
							setTimeout(function () {
								onmessage({ data: { action: 'continue' } });
							}, y);
						};
						if (b.pdfWorkerPath) var B = b.pdfWorkerPath;
						if (b.officeAsmPath) var F = b.officeAsmPath;
						b.Module = {
							memoryInitializerPrefixURL: B,
							asmjsPrefix: F,
							onRuntimeInitialized: function () {
								l || x();
								var y = Date.now() - g;
								Object(c.a)(
									'load',
									'time duration from start to ready: '.concat(
										JSON.stringify(y)
									)
								);
								t = function (k) {
									if (null !== k && void 0 !== k && 0 !== k && !A) {
										var q = (k.length << 2) + 1,
											u = Module._malloc(q);
										0 < stringToUTF8(k, u, q) && Module._TRN_OnMessage(u);
									}
								};
								v = function (k) {
									return Module._TRN_CreateBufferResource(k);
								};
								r = function (k) {
									return Module._TRN_GetResourcePointer(k);
								};
								l('OnReady called');
								onmessage = I;
								Module._TRN_InitWorker();
								for (y = 0; y < n.length; ++y) onmessage(n[y]);
								n = null;
							},
							fetchSelf: function () {
								g = Date.now();
								Object(m.a)(
									''.concat(K, 'WebOfficeWorker'),
									{
										'Wasm.wasm': 5e6,
										'Wasm.js.mem': 1e5,
										'.js.mem': 5e6,
										'.mem': 3e6,
									},
									!!navigator.userAgent.match(/Edge/i) || b.wasmDisabled
								);
							},
							onAbort: E,
							noExitRuntime: !0,
						};
					};
				b.onmessage = function (x) {
					'init' === x.data.action &&
						((b.wasmDisabled = !x.data.wasm),
						(b.externalPath = x.data.externalPath),
						(b.officeAsmPath = x.data.officeAsmPath),
						(b.pdfWorkerPath = x.data.pdfWorkerPath),
						(b.onmessage = h),
						C(),
						b.Module.fetchSelf());
				};
			})('undefined' === typeof window ? self : window);
		},
	]);
}.call(this || window));
