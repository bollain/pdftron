!function () {
	var n,
		i,
		a = {
			scope: {},
			arrayIteratorImpl: function (e) {
				var t = 0;
				return function () {
					return t < e.length ? { done: !1, value: e[t++] } : { done: !0 };
				};
			},
			arrayIterator: function (e) {
				return { next: a.arrayIteratorImpl(e) };
			},
			makeIterator: function (e) {
				var t =
					'undefined' != typeof Symbol && Symbol.iterator && e[Symbol.iterator];
				return t ? t.call(e) : a.arrayIterator(e);
			},
			ASSUME_ES5: !1,
			ASSUME_NO_NATIVE_MAP: !1,
			ASSUME_NO_NATIVE_SET: !1,
			SIMPLE_FROUND_POLYFILL: !1,
			ISOLATE_POLYFILLS: !1,
			FORCE_POLYFILL_PROMISE: !1,
			FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION: !1,
			getGlobal: function (e) {
				e = [
					'object' == typeof globalThis && globalThis,
					e,
					'object' == typeof window && window,
					'object' == typeof self && self,
					'object' == typeof global && global,
				];
				for (var t = 0; t < e.length; ++t) {
					var n = e[t];
					if (n && n.Math == Math) return n;
				}
				throw Error('Cannot find global object');
			},
		};
	(a.global = a.getGlobal(this)),
		(a.defineProperty =
			a.ASSUME_ES5 || 'function' == typeof Object.defineProperties
				? Object.defineProperty
				: function (e, t, n) {
						return (
							e != Array.prototype && e != Object.prototype && (e[t] = n.value),
							e
						);
				  }),
		(a.IS_SYMBOL_NATIVE =
			'function' == typeof Symbol && 'symbol' == typeof Symbol('x')),
		(a.TRUST_ES6_POLYFILLS = !a.ISOLATE_POLYFILLS || a.IS_SYMBOL_NATIVE),
		(a.polyfills = {}),
		(a.propertyToPolyfillSymbol = {}),
		(a.POLYFILL_PREFIX = '$jscp$');
	function r(e) {
		var t;
		return (
			i[e] ||
			((t = i[e] = { i: e, l: !1, exports: {} }),
			n[e].call(t.exports, t, t.exports, r),
			(t.l = !0),
			t)
		).exports;
	}
	(a.polyfill = function (e, t, n, i) {
		t &&
			(a.ISOLATE_POLYFILLS
				? a.polyfillIsolated(e, t, n, i)
				: a.polyfillUnisolated(e, t, n, i));
	}),
		(a.polyfillUnisolated = function (e, t, n, i) {
			for (n = a.global, e = e.split('.'), i = 0; i < e.length - 1; i++) {
				var r = e[i];
				if (!(r in n)) return;
				n = n[r];
			}
			(t = t((i = n[(e = e[e.length - 1])]))) != i &&
				null != t &&
				a.defineProperty(n, e, { configurable: !0, writable: !0, value: t });
		}),
		(a.polyfillIsolated = function (e, t, n, i) {
			var r = e.split('.');
			(e = 1 === r.length),
				(i = r[0]),
				(i = !e && i in a.polyfills ? a.polyfills : a.global);
			for (var o = 0; o < r.length - 1; o++) {
				var s = r[o];
				if (!(s in i)) return;
				i = i[s];
			}
			(r = r[r.length - 1]),
				null !=
					(t = t((n = a.IS_SYMBOL_NATIVE && 'es6' === n ? i[r] : null))) &&
					(e
						? a.defineProperty(a.polyfills, r, {
								configurable: !0,
								writable: !0,
								value: t,
						  })
						: t !== n &&
						  (void 0 === a.propertyToPolyfillSymbol[r] &&
								((n = (1e9 * Math.random()) >>> 0),
								(a.propertyToPolyfillSymbol[r] = a.IS_SYMBOL_NATIVE
									? a.global.Symbol(r)
									: a.POLYFILL_PREFIX + n + '$' + r)),
						  a.defineProperty(i, a.propertyToPolyfillSymbol[r], {
								configurable: !0,
								writable: !0,
								value: t,
						  })));
		}),
		a.polyfill(
			'Promise',
			function (e) {
				function t() {
					this.batch_ = null;
				}
				function s(n) {
					return n instanceof u
						? n
						: new u(function (e, t) {
								e(n);
						  });
				}
				if (
					e &&
					(!(
						a.FORCE_POLYFILL_PROMISE ||
						(a.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION &&
							void 0 === a.global.PromiseRejectionEvent)
					) ||
						!a.global.Promise ||
						-1 === a.global.Promise.toString().indexOf('[native code]'))
				)
					return e;
				t.prototype.asyncExecute = function (e) {
					var t;
					null == this.batch_ &&
						((this.batch_ = []),
						(t = this).asyncExecuteFunction(function () {
							t.executeBatch_();
						})),
						this.batch_.push(e);
				};
				function u(e) {
					(this.state_ = 0),
						(this.result_ = void 0),
						(this.onSettledCallbacks_ = []),
						(this.isRejectionHandled_ = !1);
					var t = this.createResolveAndReject_();
					try {
						e(t.resolve, t.reject);
					} catch (e) {
						t.reject(e);
					}
				}
				var n = a.global.setTimeout,
					r =
						((t.prototype.asyncExecuteFunction = function (e) {
							n(e, 0);
						}),
						(t.prototype.executeBatch_ = function () {
							for (; this.batch_ && this.batch_.length; ) {
								var e = this.batch_;
								this.batch_ = [];
								for (var t = 0; t < e.length; ++t) {
									var n = e[t];
									e[t] = null;
									try {
										n();
									} catch (e) {
										this.asyncThrow_(e);
									}
								}
							}
							this.batch_ = null;
						}),
						(t.prototype.asyncThrow_ = function (e) {
							this.asyncExecuteFunction(function () {
								throw e;
							});
						}),
						(u.prototype.createResolveAndReject_ = function () {
							function e(t) {
								return function (e) {
									i || ((i = !0), t.call(n, e));
								};
							}
							var n = this,
								i = !1;
							return { resolve: e(this.resolveTo_), reject: e(this.reject_) };
						}),
						(u.prototype.resolveTo_ = function (e) {
							if (e === this)
								this.reject_(
									new TypeError('A Promise cannot resolve to itself')
								);
							else if (e instanceof u) this.settleSameAsPromise_(e);
							else {
								switch (typeof e) {
									case 'object':
										var t = null != e;
										break;
									case 'function':
										t = !0;
										break;
									default:
										t = !1;
								}
								t ? this.resolveToNonPromiseObj_(e) : this.fulfill_(e);
							}
						}),
						(u.prototype.resolveToNonPromiseObj_ = function (e) {
							var t = void 0;
							try {
								t = e.then;
							} catch (e) {
								return void this.reject_(e);
							}
							'function' == typeof t
								? this.settleSameAsThenable_(t, e)
								: this.fulfill_(e);
						}),
						(u.prototype.reject_ = function (e) {
							this.settle_(2, e);
						}),
						(u.prototype.fulfill_ = function (e) {
							this.settle_(1, e);
						}),
						(u.prototype.settle_ = function (e, t) {
							if (0 != this.state_)
								throw Error(
									'Cannot settle(' +
										e +
										', ' +
										t +
										'): Promise already settled in state' +
										this.state_
								);
							(this.state_ = e),
								(this.result_ = t),
								2 === this.state_ && this.scheduleUnhandledRejectionCheck_(),
								this.executeOnSettledCallbacks_();
						}),
						(u.prototype.scheduleUnhandledRejectionCheck_ = function () {
							var t = this;
							n(function () {
								var e;
								t.notifyUnhandledRejection_() &&
									void 0 !== (e = a.global.console) &&
									e.error(t.result_);
							}, 1);
						}),
						(u.prototype.notifyUnhandledRejection_ = function () {
							var e, t, n;
							return (
								!this.isRejectionHandled_ &&
								((e = a.global.CustomEvent),
								(t = a.global.Event),
								void 0 === (n = a.global.dispatchEvent) ||
									('function' == typeof e
										? (e = new e('unhandledrejection', { cancelable: !0 }))
										: 'function' == typeof t
										? (e = new t('unhandledrejection', { cancelable: !0 }))
										: (e =
												a.global.document.createEvent(
													'CustomEvent'
												)).initCustomEvent('unhandledrejection', !1, !0, e),
									(e.promise = this),
									(e.reason = this.result_),
									n(e)))
							);
						}),
						(u.prototype.executeOnSettledCallbacks_ = function () {
							if (null != this.onSettledCallbacks_) {
								for (var e = 0; e < this.onSettledCallbacks_.length; ++e)
									r.asyncExecute(this.onSettledCallbacks_[e]);
								this.onSettledCallbacks_ = null;
							}
						}),
						new t());
				return (
					(u.prototype.settleSameAsPromise_ = function (e) {
						var t = this.createResolveAndReject_();
						e.callWhenSettled_(t.resolve, t.reject);
					}),
					(u.prototype.settleSameAsThenable_ = function (e, t) {
						var n = this.createResolveAndReject_();
						try {
							e.call(t, n.resolve, n.reject);
						} catch (e) {
							n.reject(e);
						}
					}),
					(u.prototype.then = function (e, t) {
						function n(t, e) {
							return 'function' == typeof t
								? function (e) {
										try {
											i(t(e));
										} catch (e) {
											r(e);
										}
								  }
								: e;
						}
						var i,
							r,
							o = new u(function (e, t) {
								(i = e), (r = t);
							});
						return this.callWhenSettled_(n(e, i), n(t, r)), o;
					}),
					(u.prototype.catch = function (e) {
						return this.then(void 0, e);
					}),
					(u.prototype.callWhenSettled_ = function (e, t) {
						function n() {
							switch (i.state_) {
								case 1:
									e(i.result_);
									break;
								case 2:
									t(i.result_);
									break;
								default:
									throw Error('Unexpected state: ' + i.state_);
							}
						}
						var i = this;
						null == this.onSettledCallbacks_
							? r.asyncExecute(n)
							: this.onSettledCallbacks_.push(n),
							(this.isRejectionHandled_ = !0);
					}),
					(u.resolve = s),
					(u.reject = function (n) {
						return new u(function (e, t) {
							t(n);
						});
					}),
					(u.race = function (r) {
						return new u(function (e, t) {
							for (
								var n = a.makeIterator(r), i = n.next();
								!i.done;
								i = n.next()
							)
								s(i.value).callWhenSettled_(e, t);
						});
					}),
					(u.all = function (e) {
						var t = a.makeIterator(e),
							o = t.next();
						return o.done
							? s([])
							: new u(function (n, e) {
									for (
										var i = [], r = 0;
										i.push(void 0),
											r++,
											s(o.value).callWhenSettled_(
												(function e(t) {
													return function (e) {
														(i[t] = e), 0 == --r && n(i);
													};
												})(i.length - 1),
												e
											),
											!(o = t.next()).done;

									);
							  });
					}),
					u
				);
			},
			'es6',
			'es3'
		),
		(a.checkStringArgs = function (e, t, n) {
			if (null == e)
				throw new TypeError(
					"The 'this' value for String.prototype." +
						n +
						' must not be null or undefined'
				);
			if (t instanceof RegExp)
				throw new TypeError(
					'First argument to String.prototype.' +
						n +
						' must not be a regular expression'
				);
			return e + '';
		}),
		a.polyfill(
			'String.prototype.startsWith',
			function (e) {
				return (
					e ||
					function (e, t) {
						var n = a.checkStringArgs(this, e, 'startsWith'),
							i = n.length,
							r = (e += '').length;
						t = Math.max(0, Math.min(0 | t, n.length));
						for (var o = 0; o < r && t < i; ) if (n[t++] != e[o++]) return !1;
						return r <= o;
					}
				);
			},
			'es6',
			'es3'
		),
		a.polyfill(
			'Array.from',
			function (e) {
				return (
					e ||
					function (e, t, n) {
						t =
							null != t
								? t
								: function (e) {
										return e;
								  };
						var i = [],
							r =
								'undefined' != typeof Symbol &&
								Symbol.iterator &&
								e[Symbol.iterator];
						if ('function' == typeof r) {
							e = r.call(e);
							for (var o = 0; !(r = e.next()).done; )
								i.push(t.call(n, r.value, o++));
						} else
							for (r = e.length, o = 0; o < r; o++) i.push(t.call(n, e[o], o));
						return i;
					}
				);
			},
			'es6',
			'es3'
		),
		(n = [
			function (e, t, n) {
				e.exports = n(1);
			},
			function (e, t) {
				function c(e) {
					return (c =
						'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
							? function (e) {
									return typeof e;
							  }
							: function (e) {
									return e &&
										'function' == typeof Symbol &&
										e.constructor === Symbol &&
										e !== Symbol.prototype
										? 'symbol'
										: typeof e;
							  })(e);
				}
				var a = [],
					s = [],
					u = 0,
					n = 0,
					d = [],
					h = [],
					l = 'undefined' == typeof window ? this : window;
				function i() {
					return {
						putBool: function (e, t, n) {
							if (!1 !== n && !0 !== n)
								throw new TypeError('An boolean value is expected for putBool');
							e[t] = n;
						},
						putNumber: function (e, t, n) {
							e[t] = 0 + n;
						},
						jsColorToNumber: function (e) {
							return (
								4278190080 +
								65536 * Math.floor(e.R) +
								256 * Math.floor(e.G) +
								Math.floor(e.B)
							);
						},
						jsColorFromNumber: function (e) {
							return {
								A: (5.960464477539063e-8 * e) & 255,
								R: (16711680 & (0 | e)) >>> 16,
								G: (65280 & (0 | e)) >>> 8,
								B: 255 & (0 | e),
							};
						},
					};
				}
				function r(i) {
					return Promise.resolve().then(function e(t) {
						var n = (t = i.next(t)).value;
						return t.done ? t.value : n.then(e);
					});
				}
				var p = l.Core.PDFNet || {};
				(p.Convert =
					l.Core.PDFNet && l.Core.PDFNet.Convert ? l.Core.PDFNet.Convert : {}),
					(p.Optimizer = {}),
					l.Core && l.Core.enableFullPDF(),
					(l.isArrayBuffer = function (e) {
						return (
							e instanceof ArrayBuffer ||
							(null != e &&
								null != e.constructor &&
								'ArrayBuffer' === e.constructor.name &&
								'number' == typeof e.byteLength)
						);
					}),
					(p.Destroyable = function () {
						if (this.constructor === p.Destroyable)
							throw Error("Can't instantiate abstract class!");
					}),
					(p.Destroyable.prototype.takeOwnership = function () {
						S(this.id);
					}),
					(p.Destroyable.prototype.destroy = function () {
						return (
							this.takeOwnership(),
							p.sendWithPromise(this.name + '.destroy', {
								auto_dealloc_obj: this.id,
							})
						);
					}),
					(p.Action = function (e) {
						(this.name = 'Action'), (this.id = e);
					}),
					(p.ActionParameter = function (e) {
						(this.name = 'ActionParameter'), (this.id = e);
					}),
					(p.ActionParameter.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.Annot = function (e) {
						(this.name = 'Annot'), (this.id = e);
					}),
					(p.AnnotBorderStyle = function (e) {
						(this.name = 'AnnotBorderStyle'), (this.id = e);
					}),
					(p.AnnotBorderStyle.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.AttrObj = function (e) {
						(this.name = 'AttrObj'), (this.id = e);
					}),
					(p.Bookmark = function (e) {
						(this.name = 'Bookmark'), (this.id = e);
					}),
					(p.ByteRange = function (e, t) {
						if (((this.name = 'ByteRange'), !e || void 0 !== t))
							return new p.ByteRange({
								m_offset: (e = void 0 === e ? 0 : e),
								m_size: (t = void 0 === t ? 0 : t),
							});
						O(e, this);
					}),
					(p.CaretAnnot = function (e) {
						(this.name = 'CaretAnnot'), (this.id = e);
					}),
					(p.CheckBoxWidget = function (e) {
						(this.name = 'CheckBoxWidget'), (this.id = e);
					}),
					(p.ChunkRenderer = function (e) {
						(this.name = 'ChunkRenderer'), (this.id = e);
					}),
					(p.CircleAnnot = function (e) {
						(this.name = 'CircleAnnot'), (this.id = e);
					}),
					(p.ClassMap = function (e) {
						(this.name = 'ClassMap'), (this.id = e);
					}),
					(p.ColorPt = function (e) {
						(this.name = 'ColorPt'), (this.id = e);
					}),
					(p.ColorPt.prototype = Object.create(p.Destroyable.prototype)),
					(p.ColorSpace = function (e) {
						(this.name = 'ColorSpace'), (this.id = e);
					}),
					(p.ColorSpace.prototype = Object.create(p.Destroyable.prototype)),
					(p.ComboBoxWidget = function (e) {
						(this.name = 'ComboBoxWidget'), (this.id = e);
					}),
					(p.ContentItem = function (e, t) {
						if (((this.name = 'ContentItem'), !e || void 0 !== t))
							return new p.ContentItem({
								o: (e = void 0 === e ? '0' : e),
								p: (t = void 0 === t ? '0' : t),
							});
						O(e, this);
					}),
					(p.ContentReplacer = function (e) {
						(this.name = 'ContentReplacer'), (this.id = e);
					}),
					(p.ContentReplacer.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.ConversionMonitor = function (e) {
						(this.name = 'ConversionMonitor'), (this.id = e);
					}),
					(p.ConversionMonitor.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.Date = function (e, t, n, i, r, o, s, u, a, c) {
						if (((this.name = 'Date'), !e || void 0 !== t))
							return new p.Date({
								year: (e = void 0 === e ? 0 : e),
								month: (t = void 0 === t ? 0 : t),
								day: (n = void 0 === n ? 0 : n),
								hour: (i = void 0 === i ? 0 : i),
								minute: (r = void 0 === r ? 0 : r),
								second: (o = void 0 === o ? 0 : o),
								UT: (s = void 0 === s ? 0 : s),
								UT_hour: (u = void 0 === u ? 0 : u),
								UT_minutes: (a = void 0 === a ? 0 : a),
								mp_obj: (c = void 0 === c ? '0' : c),
							});
						O(e, this);
					}),
					(p.Destination = function (e) {
						(this.name = 'Destination'), (this.id = e);
					}),
					(p.DictIterator = function (e) {
						(this.name = 'DictIterator'), (this.id = e);
					}),
					(p.DictIterator.prototype = Object.create(p.Destroyable.prototype)),
					(p.DigestAlgorithm = function (e) {
						(this.name = 'DigestAlgorithm'), (this.id = e);
					}),
					(p.DigitalSignatureField = function (e) {
						if (((this.name = 'DigitalSignatureField'), 'object' === c(e)))
							O(e, this);
						else if (void 0 !== e)
							return new p.DigitalSignatureField({ mp_field_dict_obj: e });
					}),
					(p.DisallowedChange = function (e) {
						(this.name = 'DisallowedChange'), (this.id = e);
					}),
					(p.DisallowedChange.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.DocSnapshot = function (e) {
						(this.name = 'DocSnapshot'), (this.id = e);
					}),
					(p.DocSnapshot.prototype = Object.create(p.Destroyable.prototype)),
					(p.Element = function (e) {
						(this.name = 'Element'), (this.id = e);
					}),
					(p.ElementBuilder = function (e) {
						(this.name = 'ElementBuilder'), (this.id = e);
					}),
					(p.ElementBuilder.prototype = Object.create(p.Destroyable.prototype)),
					(p.ElementReader = function (e) {
						(this.name = 'ElementReader'), (this.id = e);
					}),
					(p.ElementReader.prototype = Object.create(p.Destroyable.prototype)),
					(p.ElementWriter = function (e) {
						(this.name = 'ElementWriter'), (this.id = e);
					}),
					(p.ElementWriter.prototype = Object.create(p.Destroyable.prototype)),
					(p.EmbeddedTimestampVerificationResult = function (e) {
						(this.name = 'EmbeddedTimestampVerificationResult'), (this.id = e);
					}),
					(p.EmbeddedTimestampVerificationResult.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.FDFDoc = function (e) {
						(this.name = 'FDFDoc'), (this.id = e);
					}),
					(p.FDFDoc.prototype = Object.create(p.Destroyable.prototype)),
					(p.FDFField = function (e, t) {
						if (((this.name = 'FDFField'), !e || void 0 !== t))
							return new p.FDFField({
								mp_leaf_node: (e = void 0 === e ? '0' : e),
								mp_root_array: (t = void 0 === t ? '0' : t),
							});
						O(e, this);
					}),
					(p.Field = function (e, t) {
						if (((this.name = 'Field'), !e || void 0 !== t))
							return new p.Field({
								leaf_node: (e = void 0 === e ? '0' : e),
								builder: (t = void 0 === t ? '0' : t),
							});
						O(e, this);
					}),
					(p.FileAttachmentAnnot = function (e) {
						(this.name = 'FileAttachmentAnnot'), (this.id = e);
					}),
					(p.FileSpec = function (e) {
						(this.name = 'FileSpec'), (this.id = e);
					}),
					(p.Filter = function (e) {
						(this.name = 'Filter'), (this.id = e);
					}),
					(p.Filter.prototype = Object.create(p.Destroyable.prototype)),
					(p.FilterReader = function (e) {
						(this.name = 'FilterReader'), (this.id = e);
					}),
					(p.FilterReader.prototype = Object.create(p.Destroyable.prototype)),
					(p.FilterWriter = function (e) {
						(this.name = 'FilterWriter'), (this.id = e);
					}),
					(p.FilterWriter.prototype = Object.create(p.Destroyable.prototype)),
					(p.Flattener = function (e) {
						(this.name = 'Flattener'), (this.id = e);
					}),
					(p.Flattener.prototype = Object.create(p.Destroyable.prototype)),
					(p.Font = function (e) {
						(this.name = 'Font'), (this.id = e);
					}),
					(p.Font.prototype = Object.create(p.Destroyable.prototype)),
					(p.FreeTextAnnot = function (e) {
						(this.name = 'FreeTextAnnot'), (this.id = e);
					}),
					(p.Function = function (e) {
						(this.name = 'Function'), (this.id = e);
					}),
					(p.Function.prototype = Object.create(p.Destroyable.prototype)),
					(p.GState = function (e) {
						(this.name = 'GState'), (this.id = e);
					}),
					(p.GeometryCollection = function (e) {
						(this.name = 'GeometryCollection'), (this.id = e);
					}),
					(p.GeometryCollection.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.HighlightAnnot = function (e) {
						(this.name = 'HighlightAnnot'), (this.id = e);
					}),
					(p.Highlights = function (e) {
						(this.name = 'Highlights'), (this.id = e);
					}),
					(p.Highlights.prototype = Object.create(p.Destroyable.prototype)),
					(p.Image = function (e) {
						(this.name = 'Image'), (this.id = e);
					}),
					(p.InkAnnot = function (e) {
						(this.name = 'InkAnnot'), (this.id = e);
					}),
					(p.Iterator = function (e, t) {
						(this.name = 'Iterator'), (this.id = e), (this.type = t);
					}),
					(p.Iterator.prototype = Object.create(p.Destroyable.prototype)),
					(p.KeyStrokeActionResult = function (e) {
						(this.name = 'KeyStrokeActionResult'), (this.id = e);
					}),
					(p.KeyStrokeActionResult.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.KeyStrokeEventData = function (e) {
						(this.name = 'KeyStrokeEventData'), (this.id = e);
					}),
					(p.KeyStrokeEventData.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.LineAnnot = function (e) {
						(this.name = 'LineAnnot'), (this.id = e);
					}),
					(p.LinkAnnot = function (e) {
						(this.name = 'LinkAnnot'), (this.id = e);
					}),
					(p.ListBoxWidget = function (e) {
						(this.name = 'ListBoxWidget'), (this.id = e);
					}),
					(p.MarkupAnnot = function (e) {
						(this.name = 'MarkupAnnot'), (this.id = e);
					}),
					(p.Matrix2D = function (e, t, n, i, r, o) {
						if (((this.name = 'Matrix2D'), !e || void 0 !== t))
							return new p.Matrix2D({
								m_a: (e = void 0 === e ? 0 : e),
								m_b: (t = void 0 === t ? 0 : t),
								m_c: (n = void 0 === n ? 0 : n),
								m_d: (i = void 0 === i ? 0 : i),
								m_h: (r = void 0 === r ? 0 : r),
								m_v: (o = void 0 === o ? 0 : o),
							});
						O(e, this);
					}),
					(p.MovieAnnot = function (e) {
						(this.name = 'MovieAnnot'), (this.id = e);
					}),
					(p.NameTree = function (e) {
						(this.name = 'NameTree'), (this.id = e);
					}),
					(p.NumberTree = function (e) {
						(this.name = 'NumberTree'), (this.id = e);
					}),
					(p.OCG = function (e) {
						(this.name = 'OCG'), (this.id = e);
					}),
					(p.OCGConfig = function (e) {
						(this.name = 'OCGConfig'), (this.id = e);
					}),
					(p.OCGContext = function (e) {
						(this.name = 'OCGContext'), (this.id = e);
					}),
					(p.OCGContext.prototype = Object.create(p.Destroyable.prototype)),
					(p.OCMD = function (e) {
						(this.name = 'OCMD'), (this.id = e);
					}),
					(p.OCRModule = function (e) {
						(this.name = 'OCRModule'), (this.id = e);
					}),
					(p.Obj = function (e) {
						(this.name = 'Obj'), (this.id = e);
					}),
					(p.ObjSet = function (e) {
						(this.name = 'ObjSet'), (this.id = e);
					}),
					(p.ObjSet.prototype = Object.create(p.Destroyable.prototype)),
					(p.ObjectIdentifier = function (e) {
						(this.name = 'ObjectIdentifier'), (this.id = e);
					}),
					(p.ObjectIdentifier.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.OwnedBitmap = function (e) {
						(this.name = 'OwnedBitmap'), (this.id = e);
					}),
					(p.PDFACompliance = function (e) {
						(this.name = 'PDFACompliance'), (this.id = e);
					}),
					(p.PDFACompliance.prototype = Object.create(p.Destroyable.prototype)),
					(p.PDFDC = function (e) {
						(this.name = 'PDFDC'), (this.id = e);
					}),
					(p.PDFDCEX = function (e) {
						(this.name = 'PDFDCEX'), (this.id = e);
					}),
					(p.PDFDoc = function (e) {
						(this.name = 'PDFDoc'), (this.id = e);
					}),
					(p.PDFDoc.prototype = Object.create(p.Destroyable.prototype)),
					(p.PDFDocInfo = function (e) {
						(this.name = 'PDFDocInfo'), (this.id = e);
					}),
					(p.PDFDocViewPrefs = function (e) {
						(this.name = 'PDFDocViewPrefs'), (this.id = e);
					}),
					(p.PDFDraw = function (e) {
						(this.name = 'PDFDraw'), (this.id = e);
					}),
					(p.PDFDraw.prototype = Object.create(p.Destroyable.prototype)),
					(p.PDFRasterizer = function (e) {
						(this.name = 'PDFRasterizer'), (this.id = e);
					}),
					(p.PDFRasterizer.prototype = Object.create(p.Destroyable.prototype)),
					(p.PDFTronCustomSecurityHandler = function (e) {
						(this.name = 'PDFTronCustomSecurityHandler'), (this.id = e);
					}),
					(p.PDFView = function (e) {
						(this.name = 'PDFView'), (this.id = e);
					}),
					(p.PDFViewCtrl = function (e) {
						(this.name = 'PDFViewCtrl'), (this.id = e);
					}),
					(p.Page = function (e) {
						(this.name = 'Page'), (this.id = e);
					}),
					(p.PageLabel = function (e, t, n) {
						if (((this.name = 'PageLabel'), !e || void 0 !== t))
							return new p.PageLabel({
								mp_obj: (e = void 0 === e ? '0' : e),
								m_first_page: (t = void 0 === t ? 0 : t),
								m_last_page: (n = void 0 === n ? 0 : n),
							});
						O(e, this);
					}),
					(p.PageSet = function (e) {
						(this.name = 'PageSet'), (this.id = e);
					}),
					(p.PageSet.prototype = Object.create(p.Destroyable.prototype)),
					(p.PatternColor = function (e) {
						(this.name = 'PatternColor'), (this.id = e);
					}),
					(p.PatternColor.prototype = Object.create(p.Destroyable.prototype)),
					(p.PolyLineAnnot = function (e) {
						(this.name = 'PolyLineAnnot'), (this.id = e);
					}),
					(p.PolygonAnnot = function (e) {
						(this.name = 'PolygonAnnot'), (this.id = e);
					}),
					(p.PopupAnnot = function (e) {
						(this.name = 'PopupAnnot'), (this.id = e);
					}),
					(p.PrinterMode = function (e) {
						(this.name = 'PrinterMode'), (this.id = e);
					}),
					(p.PushButtonWidget = function (e) {
						(this.name = 'PushButtonWidget'), (this.id = e);
					}),
					(p.RadioButtonGroup = function (e) {
						(this.name = 'RadioButtonGroup'), (this.id = e);
					}),
					(p.RadioButtonGroup.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.RadioButtonWidget = function (e) {
						(this.name = 'RadioButtonWidget'), (this.id = e);
					}),
					(p.Rect = function (e, t, n, i, r) {
						if (((this.name = 'Rect'), !e || void 0 !== t))
							return new p.Rect({
								x1: (e = void 0 === e ? 0 : e),
								y1: (t = void 0 === t ? 0 : t),
								x2: (n = void 0 === n ? 0 : n),
								y2: (i = void 0 === i ? 0 : i),
								mp_rect: (r = void 0 === r ? '0' : r),
							});
						O(e, this);
					}),
					(p.Redaction = function (e) {
						(this.name = 'Redaction'), (this.id = e);
					}),
					(p.RedactionAnnot = function (e) {
						(this.name = 'RedactionAnnot'), (this.id = e);
					}),
					(p.Redactor = function (e) {
						(this.name = 'Redactor'), (this.id = e);
					}),
					(p.Reflow = function (e) {
						(this.name = 'Reflow'), (this.id = e);
					}),
					(p.Reflow.prototype = Object.create(p.Destroyable.prototype)),
					(p.ResultSnapshot = function (e) {
						(this.name = 'ResultSnapshot'), (this.id = e);
					}),
					(p.ResultSnapshot.prototype = Object.create(p.Destroyable.prototype)),
					(p.RoleMap = function (e) {
						(this.name = 'RoleMap'), (this.id = e);
					}),
					(p.RubberStampAnnot = function (e) {
						(this.name = 'RubberStampAnnot'), (this.id = e);
					}),
					(p.SDFDoc = function (e) {
						(this.name = 'SDFDoc'), (this.id = e);
					}),
					(p.SElement = function (e, t) {
						if (((this.name = 'SElement'), !e || void 0 !== t))
							return new p.SElement({
								obj: (e = void 0 === e ? '0' : e),
								k: (t = void 0 === t ? '0' : t),
							});
						O(e, this);
					}),
					(p.STree = function (e) {
						(this.name = 'STree'), (this.id = e);
					}),
					(p.ScreenAnnot = function (e) {
						(this.name = 'ScreenAnnot'), (this.id = e);
					}),
					(p.SecurityHandler = function (e) {
						(this.name = 'SecurityHandler'), (this.id = e);
					}),
					(p.SecurityHandler.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.Shading = function (e) {
						(this.name = 'Shading'), (this.id = e);
					}),
					(p.Shading.prototype = Object.create(p.Destroyable.prototype)),
					(p.ShapedText = function (e) {
						(this.name = 'ShapedText'), (this.id = e);
					}),
					(p.ShapedText.prototype = Object.create(p.Destroyable.prototype)),
					(p.SignatureHandler = function (e) {
						(this.name = 'SignatureHandler'), (this.id = e);
					}),
					(p.SignatureWidget = function (e) {
						(this.name = 'SignatureWidget'), (this.id = e);
					}),
					(p.SoundAnnot = function (e) {
						(this.name = 'SoundAnnot'), (this.id = e);
					}),
					(p.SquareAnnot = function (e) {
						(this.name = 'SquareAnnot'), (this.id = e);
					}),
					(p.SquigglyAnnot = function (e) {
						(this.name = 'SquigglyAnnot'), (this.id = e);
					}),
					(p.Stamper = function (e) {
						(this.name = 'Stamper'), (this.id = e);
					}),
					(p.Stamper.prototype = Object.create(p.Destroyable.prototype)),
					(p.StrikeOutAnnot = function (e) {
						(this.name = 'StrikeOutAnnot'), (this.id = e);
					}),
					(p.TextAnnot = function (e) {
						(this.name = 'TextAnnot'), (this.id = e);
					}),
					(p.TextExtractor = function (e) {
						(this.name = 'TextExtractor'), (this.id = e);
					}),
					(p.TextExtractor.prototype = Object.create(p.Destroyable.prototype)),
					(p.TextExtractorLine = function (e, t, n, i, r, o) {
						if (((this.name = 'TextExtractorLine'), !e || void 0 !== t))
							return new p.TextExtractorLine({
								line: (e = void 0 === e ? '0' : e),
								uni: (t = void 0 === t ? '0' : t),
								num: (n = void 0 === n ? 0 : n),
								cur_num: (i = void 0 === i ? 0 : i),
								m_direction: (r = void 0 === r ? 0 : r),
								mp_bld: (o = void 0 === o ? '0' : o),
							});
						O(e, this);
					}),
					(p.TextExtractorStyle = function (e) {
						if (((this.name = 'TextExtractorStyle'), 'object' === c(e)))
							O(e, this);
						else if (void 0 !== e)
							return new p.TextExtractorStyle({ mp_imp: e });
					}),
					(p.TextExtractorWord = function (e, t, n, i, r, o) {
						if (((this.name = 'TextExtractorWord'), !e || void 0 !== t))
							return new p.TextExtractorWord({
								line: (e = void 0 === e ? '0' : e),
								word: (t = void 0 === t ? '0' : t),
								uni: (n = void 0 === n ? '0' : n),
								num: (i = void 0 === i ? 0 : i),
								cur_num: (r = void 0 === r ? 0 : r),
								mp_bld: (o = void 0 === o ? '0' : o),
							});
						O(e, this);
					}),
					(p.TextMarkupAnnot = function (e) {
						(this.name = 'TextMarkupAnnot'), (this.id = e);
					}),
					(p.TextRange = function (e) {
						(this.name = 'TextRange'), (this.id = e);
					}),
					(p.TextSearch = function (e) {
						(this.name = 'TextSearch'), (this.id = e);
					}),
					(p.TextSearch.prototype = Object.create(p.Destroyable.prototype)),
					(p.TextWidget = function (e) {
						(this.name = 'TextWidget'), (this.id = e);
					}),
					(p.TimestampingConfiguration = function (e) {
						(this.name = 'TimestampingConfiguration'), (this.id = e);
					}),
					(p.TimestampingConfiguration.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.TimestampingResult = function (e) {
						(this.name = 'TimestampingResult'), (this.id = e);
					}),
					(p.TimestampingResult.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.TrustVerificationResult = function (e) {
						(this.name = 'TrustVerificationResult'), (this.id = e);
					}),
					(p.TrustVerificationResult.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.UnderlineAnnot = function (e) {
						(this.name = 'UnderlineAnnot'), (this.id = e);
					}),
					(p.UndoManager = function (e) {
						(this.name = 'UndoManager'), (this.id = e);
					}),
					(p.UndoManager.prototype = Object.create(p.Destroyable.prototype)),
					(p.VerificationOptions = function (e) {
						(this.name = 'VerificationOptions'), (this.id = e);
					}),
					(p.VerificationOptions.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.VerificationResult = function (e) {
						(this.name = 'VerificationResult'), (this.id = e);
					}),
					(p.VerificationResult.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.ViewChangeCollection = function (e) {
						(this.name = 'ViewChangeCollection'), (this.id = e);
					}),
					(p.ViewChangeCollection.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.WatermarkAnnot = function (e) {
						(this.name = 'WatermarkAnnot'), (this.id = e);
					}),
					(p.WebFontDownloader = function (e) {
						(this.name = 'WebFontDownloader'), (this.id = e);
					}),
					(p.WidgetAnnot = function (e) {
						(this.name = 'WidgetAnnot'), (this.id = e);
					}),
					(p.X501AttributeTypeAndValue = function (e) {
						(this.name = 'X501AttributeTypeAndValue'), (this.id = e);
					}),
					(p.X501AttributeTypeAndValue.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.X501DistinguishedName = function (e) {
						(this.name = 'X501DistinguishedName'), (this.id = e);
					}),
					(p.X501DistinguishedName.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.X509Certificate = function (e) {
						(this.name = 'X509Certificate'), (this.id = e);
					}),
					(p.X509Certificate.prototype = Object.create(
						p.Destroyable.prototype
					)),
					(p.X509Extension = function (e) {
						(this.name = 'X509Extension'), (this.id = e);
					}),
					(p.X509Extension.prototype = Object.create(p.Destroyable.prototype)),
					(p.PDFDoc.createRefreshOptions = function () {
						return Promise.resolve(new p.PDFDoc.RefreshOptions());
					}),
					(p.PDFDoc.RefreshOptions = function () {
						(this.mImpl = {}), (this.mHelpers = i());
					}),
					(p.PDFDoc.RefreshOptions.prototype.getDrawBackgroundOnly =
						function () {
							return (
								!('DrawBackgroundOnly' in mImpl) || !!mImpl.DrawBackgroundOnly
							);
						}),
					(p.PDFDoc.RefreshOptions.prototype.setDrawBackgroundOnly = function (
						e
					) {
						return mHelpers.putBool(mImpl, 'DrawBackgroundOnly', e), this;
					}),
					(p.PDFDoc.RefreshOptions.prototype.getRefreshExisting = function () {
						return !('RefreshExisting' in mImpl) || !!mImpl.RefreshExisting;
					}),
					(p.PDFDoc.RefreshOptions.prototype.setRefreshExisting = function (e) {
						return mHelpers.putBool(mImpl, 'RefreshExisting', e), this;
					}),
					(p.PDFDoc.RefreshOptions.prototype.getUseNonStandardRotation =
						function () {
							return (
								'UseNonStandardRotation' in mImpl &&
								!!mImpl.UseNonStandardRotation
							);
						}),
					(p.PDFDoc.RefreshOptions.prototype.setUseNonStandardRotation =
						function (e) {
							return mHelpers.putBool(mImpl, 'UseNonStandardRotation', e), this;
						}),
					(p.PDFDoc.RefreshOptions.prototype.getUseRoundedCorners =
						function () {
							return 'UseRoundedCorners' in mImpl && !!mImpl.UseRoundedCorners;
						}),
					(p.PDFDoc.RefreshOptions.prototype.setUseRoundedCorners = function (
						e
					) {
						return mHelpers.putBool(mImpl, 'UseRoundedCorners', e), this;
					}),
					(p.PDFDoc.RefreshOptions.prototype.getJsonString = function () {
						return JSON.stringify(this.mImpl);
					}),
					(p.createRefreshOptions = p.PDFDoc.createRefreshOptions),
					(p.RefreshOptions = p.PDFDoc.RefreshOptions),
					(p.PDFDoc.createDiffOptions = function () {
						return Promise.resolve(new p.PDFDoc.DiffOptions());
					}),
					(p.PDFDoc.DiffOptions = function () {
						(this.mImpl = {}), (this.mHelpers = i());
					}),
					(p.PDFDoc.DiffOptions.prototype.getAddGroupAnnots = function () {
						return (
							'AddGroupAnnots' in this.mImpl && !!this.mImpl.AddGroupAnnots
						);
					}),
					(p.PDFDoc.DiffOptions.prototype.setAddGroupAnnots = function (e) {
						return this.mHelpers.putBool(this.mImpl, 'AddGroupAnnots', e), this;
					}),
					(p.PDFDoc.DiffOptions.prototype.getBlendMode = function () {
						return 'BlendMode' in this.mImpl ? this.mImpl.BlendMode : 5;
					}),
					(p.PDFDoc.DiffOptions.prototype.setBlendMode = function (e) {
						return this.mHelpers.putNumber(this.mImpl, 'BlendMode', e), this;
					}),
					(p.PDFDoc.DiffOptions.prototype.getColorA = function () {
						return 'ColorA' in this.mImpl
							? this.mHelpers.jsColorFromNumber(this.mImpl.ColorA)
							: this.mHelpers.jsColorFromNumber(4291559424);
					}),
					(p.PDFDoc.DiffOptions.prototype.setColorA = function (e) {
						return (
							this.mHelpers.putNumber(
								this.mImpl,
								'ColorA',
								this.mHelpers.jsColorToNumber(e)
							),
							this
						);
					}),
					(p.PDFDoc.DiffOptions.prototype.getColorB = function () {
						return 'ColorB' in this.mImpl
							? this.mHelpers.jsColorFromNumber(this.mImpl.ColorB)
							: this.mHelpers.jsColorFromNumber(4278242508);
					}),
					(p.PDFDoc.DiffOptions.prototype.setColorB = function (e) {
						return (
							this.mHelpers.putNumber(
								this.mImpl,
								'ColorB',
								this.mHelpers.jsColorToNumber(e)
							),
							this
						);
					}),
					(p.PDFDoc.DiffOptions.prototype.getLuminosityCompression =
						function () {
							return 'LuminosityCompression' in this.mImpl
								? this.mImpl.LuminosityCompression
								: 10;
						}),
					(p.PDFDoc.DiffOptions.prototype.setLuminosityCompression = function (
						e
					) {
						return (
							this.mHelpers.putNumber(this.mImpl, 'LuminosityCompression', e),
							this
						);
					}),
					(p.PDFDoc.DiffOptions.prototype.getJsonString = function () {
						return JSON.stringify(this.mImpl);
					}),
					(p.createDiffOptions = p.PDFDoc.createDiffOptions),
					(p.DiffOptions = p.PDFDoc.DiffOptions),
					(p.PDFDoc.createTextDiffOptions = function () {
						return Promise.resolve(new p.PDFDoc.TextDiffOptions());
					}),
					(p.PDFDoc.TextDiffOptions = function () {
						(this.name = 'PDFNet.PDFDoc.TextDiffOptions'),
							(this.mImpl = {}),
							(this.mHelpers = i());
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getColorA = function () {
						return 'ColorA' in this.mImpl
							? this.mHelpers.jsColorFromNumber(this.mImpl.ColorA)
							: this.mHelpers.jsColorFromNumber(4293284423);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.setColorA = function (e) {
						return (
							this.mHelpers.putNumber(
								this.mImpl,
								'ColorA',
								this.mHelpers.jsColorToNumber(e)
							),
							this
						);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getOpacityA = function () {
						return 'OpacityA' in this.mImpl ? this.mImpl.OpacityA : 0.5;
					}),
					(p.PDFDoc.TextDiffOptions.prototype.setOpacityA = function (e) {
						return this.mHelpers.putNumber(this.mImpl, 'OpacityA', e), this;
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getColorB = function () {
						return 'ColorB' in this.mImpl
							? this.mHelpers.jsColorFromNumber(this.mImpl.ColorB)
							: this.mHelpers.jsColorFromNumber(4284278322);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.setColorB = function (e) {
						return (
							this.mHelpers.putNumber(
								this.mImpl,
								'ColorB',
								this.mHelpers.jsColorToNumber(e)
							),
							this
						);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getCompareUsingZOrder =
						function () {
							return (
								'CompareUsingZOrder' in this.mImpl &&
								!!this.mImpl.CompareUsingZOrder
							);
						}),
					(p.PDFDoc.TextDiffOptions.prototype.setCompareUsingZOrder = function (
						e
					) {
						return (
							this.mHelpers.putBool(this.mImpl, 'CompareUsingZOrder', e), this
						);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getOpacityB = function () {
						return 'OpacityB' in this.mImpl ? this.mImpl.OpacityB : 0.5;
					}),
					(p.PDFDoc.TextDiffOptions.prototype.setOpacityB = function (e) {
						return this.mHelpers.putNumber(this.mImpl, 'OpacityB', e), this;
					}),
					(p.PDFDoc.TextDiffOptions.prototype.addZonesForPage = function (
						e,
						t,
						n
					) {
						if (
							(void 0 === this.mImpl[e] && (this.mImpl[e] = []),
							this.mImpl[e].length < n)
						)
							for (var i = this.mImpl[e].length; i < n; i++)
								this.mImpl[e].push([]);
						(t = t.map(function (e) {
							return [e.x1, e.y1, e.x2, e.y2];
						})),
							(this.mImpl[e][n - 1] = t);
					}),
					(p.PDFDoc.TextDiffOptions.prototype.addIgnoreZonesForPage = function (
						e,
						t
					) {
						return this.addZonesForPage('IgnoreZones', e, t), this;
					}),
					(p.PDFDoc.TextDiffOptions.prototype.getJsonString = function () {
						return JSON.stringify(this.mImpl);
					}),
					(p.FDFDoc.createXFDFExportOptions = function () {
						return Promise.resolve(new p.FDFDoc.XFDFExportOptions());
					}),
					(p.FDFDoc.XFDFExportOptions = function () {
						(this.name = 'PDFNet.FDFDoc.XFDFExportOptions'),
							(this.mImpl = {}),
							(this.mHelpers = i());
					}),
					(p.FDFDoc.XFDFExportOptions.prototype.getWriteAnnotationAppearance =
						function () {
							return (
								'WriteAnnotationAppearance' in this.mImpl &&
								!!this.mImpl.WriteAnnotationAppearance
							);
						}),
					(p.FDFDoc.XFDFExportOptions.prototype.setWriteAnnotationAppearance =
						function (e) {
							return (
								this.mHelpers.putBool(
									this.mImpl,
									'WriteAnnotationAppearance',
									e
								),
								this
							);
						}),
					(p.FDFDoc.XFDFExportOptions.prototype.getWriteImagedata =
						function () {
							return (
								!('WriteImagedata' in this.mImpl) || !!this.mImpl.WriteImagedata
							);
						}),
					(p.FDFDoc.XFDFExportOptions.prototype.setWriteImagedata = function (
						e
					) {
						return this.mHelpers.putBool(this.mImpl, 'WriteImagedata', e), this;
					}),
					(p.FDFDoc.XFDFExportOptions.prototype.getJsonString = function () {
						return JSON.stringify(this.mImpl);
					}),
					(p.Convert.createAdvancedImagingConvertOptions = function () {
						return Promise.resolve(
							new p.Convert.AdvancedImagingConvertOptions()
						);
					}),
					(p.Convert.AdvancedImagingConvertOptions = function () {
						(this.name = 'PDFNet.Convert.AdvancedImagingConvertOptions'),
							(this.mImpl = {}),
							(this.mHelpers = i());
					}),
					(p.Convert.AdvancedImagingConvertOptions.prototype.getDefaultDPI =
						function () {
							return 'DefaultDPI' in this.mImpl ? this.mImpl.DefaultDPI : 72;
						}),
					(p.Convert.AdvancedImagingConvertOptions.prototype.setDefaultDPI =
						function (e) {
							return this.mHelpers.putNumber(this.mImpl, 'DefaultDPI', e), this;
						}),
					(p.Convert.AdvancedImagingConvertOptions.prototype.getEnableAutoLevel =
						function () {
							return (
								'EnableAutoLevel' in this.mImpl && !!this.mImpl.EnableAutoLevel
							);
						}),
					(p.Convert.AdvancedImagingConvertOptions.prototype.setEnableAutoLevel =
						function (e) {
							return (
								this.mHelpers.putBool(this.mImpl, 'EnableAutoLevel', e), this
							);
						}),
					(p.PDFDoc.createMergeXFDFOptions = function () {
						return Promise.resolve(new p.PDFDoc.MergeXFDFOptions());
					}),
					(p.PDFDoc.MergeXFDFOptions = function () {
						(this.name = 'PDFNet.PDFDoc.MergeXFDFOptions'),
							(this.mImpl = {}),
							(this.mHelpers = i());
					}),
					(p.PDFDoc.MergeXFDFOptions.prototype.getForce = function () {
						return 'Force' in this.mImpl && !!this.mImpl.Force;
					}),
					(p.PDFDoc.MergeXFDFOptions.prototype.setForce = function (e) {
						return this.mHelpers.putBool(this.mImpl, 'Force', e), this;
					}),
					(p.PDFDoc.MergeXFDFOptions.prototype.getJsonString = function () {
						return JSON.stringify(this.mImpl);
					}),
					(p.QuadPoint = function (e, t, n, i, r, o, s, u) {
						if (((this.name = 'QuadPoint'), !e || void 0 !== t))
							return new p.QuadPoint({
								p1x: (e = void 0 === e ? 0 : e),
								p1y: (t = void 0 === t ? 0 : t),
								p2x: (n = void 0 === n ? 0 : n),
								p2y: (i = void 0 === i ? 0 : i),
								p3x: (r = void 0 === r ? 0 : r),
								p3y: (o = void 0 === o ? 0 : o),
								p4x: (s = void 0 === s ? 0 : s),
								p4y: (u = void 0 === u ? 0 : u),
							});
						O(e, this);
					}),
					(p.Point = function (e, t) {
						if (((this.name = 'Point'), !e || void 0 !== t))
							return new p.Point({
								x: (e = void 0 === e ? 0 : e),
								y: (t = void 0 === t ? 0 : t),
							});
						O(e, this);
					}),
					(p.CharData = function (e) {
						if (void 0 === e)
							throw new TypeError(
								'CharData requires an object to construct with.'
							);
						(this.name = 'CharData'), O(e, this);
					}),
					(p.Separation = function (e) {
						if (void 0 === e)
							throw new TypeError(
								'Separation requires an object to construct with.'
							);
						(this.name = 'Separation'), O(e, this);
					}),
					(p.Optimizer.createImageSettings = function () {
						return Promise.resolve(new p.Optimizer.ImageSettings());
					}),
					(p.Optimizer.ImageSettings = function () {
						(this.m_max_pixels = 4294967295),
							(this.m_max_dpi = 225),
							(this.m_resample_dpi = 150),
							(this.m_quality = 5),
							(this.m_compression_mode =
								p.Optimizer.ImageSettings.CompressionMode.e_retain),
							(this.m_downsample_mode =
								p.Optimizer.ImageSettings.DownsampleMode.e_default),
							(this.m_force_changes = this.m_force_recompression = !1);
					}),
					(p.Optimizer.ImageSettings.prototype.setImageDPI = function (e, t) {
						return (this.m_max_dpi = e), (this.m_resample_dpi = t), this;
					}),
					(p.Optimizer.ImageSettings.prototype.setCompressionMode = function (
						e
					) {
						return (this.m_compression_mode = e), this;
					}),
					(p.Optimizer.ImageSettings.prototype.setDownsampleMode = function (
						e
					) {
						return (this.m_downsample_mode = e), this;
					}),
					(p.Optimizer.ImageSettings.prototype.setQuality = function (e) {
						return (this.m_quality = e), this;
					}),
					(p.Optimizer.ImageSettings.prototype.forceRecompression = function (
						e
					) {
						return (this.m_force_recompression = e), this;
					}),
					(p.Optimizer.ImageSettings.prototype.forceChanges = function (e) {
						return (this.m_force_changes = e), this;
					}),
					(p.Optimizer.createMonoImageSettings = function () {
						return Promise.resolve(new p.Optimizer.MonoImageSettings());
					}),
					(p.Optimizer.MonoImageSettings = function () {
						(this.m_max_pixels = 4294967295),
							(this.m_max_dpi = 450),
							(this.m_resample_dpi = 300),
							(this.m_jbig2_threshold = 8.5),
							(this.m_compression_mode =
								p.Optimizer.ImageSettings.CompressionMode.e_retain),
							(this.m_downsample_mode =
								p.Optimizer.ImageSettings.DownsampleMode.e_default),
							(this.m_force_changes = this.m_force_recompression = !1);
					}),
					(p.Optimizer.MonoImageSettings.prototype.setImageDPI = function (
						e,
						t
					) {
						return (this.m_max_dpi = e), (this.m_resample_dpi = t), this;
					}),
					(p.Optimizer.MonoImageSettings.prototype.setCompressionMode =
						function (e) {
							return (this.m_compression_mode = e), this;
						}),
					(p.Optimizer.MonoImageSettings.prototype.setDownsampleMode =
						function (e) {
							return (this.m_downsample_mode = e), this;
						}),
					(p.Optimizer.MonoImageSettings.prototype.setJBIG2Threshold =
						function (e) {
							return (this.m_jbig2_threshold = quality), this;
						}),
					(p.Optimizer.MonoImageSettings.prototype.forceRecompression =
						function (e) {
							return (this.m_force_recompression = e), this;
						}),
					(p.Optimizer.MonoImageSettings.prototype.forceChanges = function (e) {
						return (this.m_force_changes = e), this;
					}),
					(p.Optimizer.createTextSettings = function () {
						return Promise.resolve(new p.Optimizer.TextSettings());
					}),
					(p.Optimizer.TextSettings = function () {
						this.m_embed_fonts = this.m_subset_fonts = !1;
					}),
					(p.Optimizer.TextSettings.prototype.subsetFonts = function (e) {
						return (this.m_subset_fonts = e), this;
					}),
					(p.Optimizer.TextSettings.prototype.embedFonts = function (e) {
						return (this.m_embed_fonts = e), this;
					}),
					(p.Optimizer.createOptimizerSettings = function () {
						return Promise.resolve(new p.Optimizer.OptimizerSettings());
					}),
					(p.Optimizer.OptimizerSettings = function () {
						(this.color_image_settings = new p.Optimizer.ImageSettings()),
							(this.grayscale_image_settings = new p.Optimizer.ImageSettings()),
							(this.mono_image_settings = new p.Optimizer.MonoImageSettings()),
							(this.text_settings = new p.Optimizer.TextSettings()),
							(this.remove_custom = !0);
					}),
					(p.Optimizer.OptimizerSettings.prototype.setColorImageSettings =
						function (e) {
							return (this.color_image_settings = e), this;
						}),
					(p.Optimizer.OptimizerSettings.prototype.setGrayscaleImageSettings =
						function (e) {
							return (this.grayscale_image_settings = e), this;
						}),
					(p.Optimizer.OptimizerSettings.prototype.setMonoImageSettings =
						function (e) {
							return (this.mono_image_settings = e), this;
						}),
					(p.Optimizer.OptimizerSettings.prototype.setTextSettings = function (
						e
					) {
						return (this.text_settings = e), this;
					}),
					(p.Optimizer.OptimizerSettings.prototype.removeCustomEntries =
						function (e) {
							return (this.remove_custom = e), this;
						}),
					(p.Optimizer.ImageSettings.CompressionMode = {
						e_retain: 0,
						e_flate: 1,
						e_jpeg: 2,
						e_jpeg2000: 3,
						e_none: 4,
					}),
					(p.Optimizer.ImageSettings.DownsampleMode = {
						e_off: 0,
						e_default: 1,
					}),
					(p.Optimizer.MonoImageSettings.CompressionMode = {
						e_jbig2: 0,
						e_flate: 1,
						e_none: 2,
					}),
					(p.Optimizer.MonoImageSettings.DownsampleMode = {
						e_off: 0,
						e_default: 1,
					}),
					(p.Convert.ConversionOptions = function (e) {
						(this.name = 'PDFNet.Convert.ConversionOptions'),
							e && O(JSON.parse(e), this);
					}),
					(p.Convert.createOfficeToPDFOptions = function (e) {
						return Promise.resolve(new p.Convert.OfficeToPDFOptions(e));
					}),
					(p.Convert.OfficeToPDFOptions = function (e) {
						p.Convert.ConversionOptions.call(this, e);
					}),
					(p.Convert.OfficeToPDFOptions.prototype.setApplyPageBreaksToSheet =
						function (e) {
							return (this.ApplyPageBreaksToSheet = e), this;
						}),
					(p.Convert.OfficeToPDFOptions.prototype.setDisplayChangeTracking =
						function (e) {
							return (this.DisplayChangeTracking = e), this;
						}),
					(p.Convert.OfficeToPDFOptions.prototype.setExcelDefaultCellBorderWidth =
						function (e) {
							return (this.ExcelDefaultCellBorderWidth = e), this;
						}),
					(p.Convert.OfficeToPDFOptions.prototype.setExcelMaxAllowedCellCount =
						function (e) {
							return (this.ExcelMaxAllowedCellCount = e), this;
						}),
					(p.Convert.OfficeToPDFOptions.prototype.setLocale = function (e) {
						return (this.Locale = e), this;
					}),
					(p.Convert.OfficeToPDFOptions.prototype.setTemplateParamsJson =
						function (e) {
							return (this.TemplateParamsJson = e), this;
						}),
					(p.Convert.OverprintPreviewMode = {
						e_op_off: 0,
						e_op_on: 1,
						e_op_pdfx_on: 2,
					}),
					(p.Convert.XPSOutputCommonOptions = function () {
						this.name = 'PDFNet.Convert.XPSOutputCommonOptions';
					}),
					(p.Convert.XPSOutputCommonOptions.prototype.setPrintMode = function (
						e
					) {
						return (this.PRINTMODE = e), this;
					}),
					(p.Convert.XPSOutputCommonOptions.prototype.setDPI = function (e) {
						return (this.DPI = e), this;
					}),
					(p.Convert.XPSOutputCommonOptions.prototype.setRenderPages =
						function (e) {
							return (this.RENDER = e), this;
						}),
					(p.Convert.XPSOutputCommonOptions.prototype.setThickenLines =
						function (e) {
							return (this.THICKENLINES = e), this;
						}),
					(p.Convert.XPSOutputCommonOptions.prototype.generateURLLinks =
						function (e) {
							return (this.URL_LINKS = e), this;
						}),
					(p.Convert.XPSOutputCommonOptions.prototype.setOverprint = function (
						e
					) {
						switch (e) {
							case p.Convert.OverprintPreviewMode.e_op_off:
								this.OVERPRINT_MODE = 'OFF';
								break;
							case p.Convert.OverprintPreviewMode.e_op_on:
								this.OVERPRINT_MODE = 'ON';
								break;
							case p.Convert.OverprintPreviewMode.e_op_pdfx_on:
								this.OVERPRINT_MODE = 'PDFX';
						}
						return this;
					}),
					(p.Convert.createXPSOutputOptions = function () {
						return Promise.resolve(new p.Convert.XPSOutputOptions());
					}),
					(p.Convert.XPSOutputOptions = function () {
						this.name = 'PDFNet.Convert.XPSOutputOptions';
					}),
					(p.Convert.XPSOutputOptions.prototype = Object.create(
						p.Convert.XPSOutputCommonOptions.prototype
					)),
					(p.Convert.XPSOutputOptions.prototype.setOpenXps = function (e) {
						return (this.OPENXPS = e), this;
					}),
					(p.Convert.FlattenFlag = {
						e_off: 0,
						e_simple: 1,
						e_fast: 2,
						e_high_quality: 3,
					}),
					(p.Convert.FlattenThresholdFlag = {
						e_very_strict: 0,
						e_strict: 1,
						e_default: 2,
						e_keep_most: 3,
						e_keep_all: 4,
					}),
					(p.Convert.AnnotationOutputFlag = {
						e_internal_xfdf: 0,
						e_external_xfdf: 1,
						e_flatten: 2,
					}),
					(p.Convert.createXODOutputOptions = function () {
						return Promise.resolve(new p.Convert.XODOutputOptions());
					}),
					(p.Convert.XODOutputOptions = function () {
						this.name = 'PDFNet.Convert.XODOutputOptions';
					}),
					(p.Convert.XODOutputOptions.prototype = Object.create(
						p.Convert.XPSOutputCommonOptions.prototype
					)),
					(p.Convert.XODOutputOptions.prototype.setOutputThumbnails = function (
						e
					) {
						return (this.NOTHUMBS = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setOutputThumbnails = function (
						e
					) {
						return (this.NOTHUMBS = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setThumbnailSize = function (
						e,
						t
					) {
						return (
							(this.THUMB_SIZE = e), (this.LARGE_THUMB_SIZE = t || e), this
						);
					}),
					(p.Convert.XODOutputOptions.prototype.setElementLimit = function (e) {
						return (this.ELEMENTLIMIT = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setOpacityMaskWorkaround =
						function (e) {
							return (this.MASKRENDER = e), this;
						}),
					(p.Convert.XODOutputOptions.prototype.setMaximumImagePixels =
						function (e) {
							return (this.MAX_IMAGE_PIXELS = e), this;
						}),
					(p.Convert.XODOutputOptions.prototype.setFlattenContent = function (
						e
					) {
						switch (e) {
							case p.Convert.FlattenFlag.e_off:
								this.FLATTEN_CONTENT = 'OFF';
								break;
							case p.Convert.FlattenFlag.e_simple:
								this.FLATTEN_CONTENT = 'SIMPLE';
								break;
							case p.Convert.FlattenFlag.e_fast:
								this.FLATTEN_CONTENT = 'FAST';
								break;
							case p.Convert.FlattenFlag.e_high_quality:
								this.FLATTEN_CONTENT = 'HIGH_QUALITY';
						}
						return this;
					}),
					(p.Convert.XODOutputOptions.prototype.setFlattenThreshold = function (
						e
					) {
						switch (e) {
							case p.Convert.FlattenThresholdFlag.e_very_strict:
								this.FLATTEN_THRESHOLD = 'VERY_STRICT';
								break;
							case p.Convert.FlattenThresholdFlag.e_strict:
								this.FLATTEN_THRESHOLD = 'STRICT';
								break;
							case p.Convert.FlattenThresholdFlag.e_default:
								this.FLATTEN_THRESHOLD = 'DEFAULT';
								break;
							case p.Convert.FlattenThresholdFlag.e_keep_most:
								this.FLATTEN_THRESHOLD = 'KEEP_MOST';
								break;
							case p.Convert.FlattenThresholdFlag.e_keep_all:
								this.FLATTEN_THRESHOLD = 'KEEP_ALL';
						}
						return this;
					}),
					(p.Convert.XODOutputOptions.prototype.setPreferJPG = function (e) {
						return (this.PREFER_JPEG = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setJPGQuality = function (e) {
						return (this.JPEG_QUALITY = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setSilverlightTextWorkaround =
						function (e) {
							return (this.REMOVE_ROTATED_TEXT = e), this;
						}),
					(p.Convert.XODOutputOptions.prototype.setAnnotationOutput = function (
						e
					) {
						switch (e) {
							case p.Convert.AnnotationOutputFlag.e_internal_xfdf:
								this.ANNOTATION_OUTPUT = 'INTERNAL';
								break;
							case p.Convert.AnnotationOutputFlag.e_external_xfdf:
								this.ANNOTATION_OUTPUT = 'EXTERNAL';
								break;
							case p.Convert.AnnotationOutputFlag.e_flatten:
								this.ANNOTATION_OUTPUT = 'FLATTEN';
						}
						return this;
					}),
					(p.Convert.XODOutputOptions.prototype.setExternalParts = function (
						e
					) {
						return (this.EXTERNAL_PARTS = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.setEncryptPassword = function (
						e
					) {
						return (this.ENCRYPT_PASSWORD = e), this;
					}),
					(p.Convert.XODOutputOptions.prototype.useSilverlightFlashCompatible =
						function (e) {
							return (this.COMPATIBLE_XOD = e), this;
						}),
					(p.Convert.createTiffOutputOptions = function () {
						return Promise.resolve(new p.Convert.TiffOutputOptions());
					}),
					(p.Convert.TiffOutputOptions = function () {
						this.name = 'PDFNet.Convert.TiffOutputOptions';
					}),
					(p.Convert.TiffOutputOptions.prototype.setBox = function (e) {
						switch (e) {
							case p.Page.Box.e_media:
								this.BOX = 'media';
								break;
							case p.Page.Box.e_crop:
								this.BOX = 'crop';
								break;
							case p.Page.Box.e_bleed:
								this.BOX = 'bleed';
								break;
							case p.Page.Box.e_trim:
								this.BOX = 'trim';
								break;
							case p.Page.Box.e_art:
								this.BOX = 'art';
						}
						return this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setRotate = function (e) {
						switch (e) {
							case p.Page.Box.e_0:
								this.ROTATE = '0';
								break;
							case p.Page.Box.e_90:
								this.ROTATE = '90';
								break;
							case p.Page.Box.e_180:
								this.ROTATE = '180';
								break;
							case p.Page.Box.e_270:
								this.ROTATE = '270';
						}
						return this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setClip = function (
						e,
						t,
						n,
						i
					) {
						return (
							(this.CLIP_X1 = e),
							(this.CLIP_Y1 = t),
							(this.CLIP_X2 = n),
							(this.CLIP_Y2 = i),
							this
						);
					}),
					(p.Convert.TiffOutputOptions.prototype.setPages = function (e) {
						return (this.PAGES = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setOverprint = function (e) {
						switch (e) {
							case p.PDFRasterizer.OverprintPreviewMode.e_op_off:
								this.OVERPRINT_MODE = 'OFF';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_on:
								this.OVERPRINT_MODE = 'ON';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
								this.OVERPRINT_MODE = 'PDFX';
						}
						return this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setCMYK = function (e) {
						return (this.CMYK = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setDither = function (e) {
						return (this.DITHER = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setGray = function (e) {
						return (this.GRAY = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setMono = function (e) {
						return (this.MONO = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setAnnots = function (e) {
						return (this.ANNOTS = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setSmooth = function (e) {
						return (this.SMOOTH = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setPrintmode = function (e) {
						return (this.PRINTMODE = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setTransparentPage = function (
						e
					) {
						return (this.TRANSPARENT_PAGE = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setPalettized = function (e) {
						return (this.PALETTIZED = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setDPI = function (e) {
						return (this.DPI = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setGamma = function (e) {
						return (this.GAMMA = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setHRes = function (e) {
						return (this.HRES = e), this;
					}),
					(p.Convert.TiffOutputOptions.prototype.setVRes = function (e) {
						return (this.VRES = e), this;
					}),
					(p.Convert.createHTMLOutputOptions = function () {
						return Promise.resolve(new p.Convert.HTMLOutputOptions());
					}),
					(p.Convert.HTMLOutputOptions = function () {
						this.name = 'PDFNet.Convert.HTMLOutputOptions';
					}),
					(p.Convert.HTMLOutputOptions.prototype.setPreferJPG = function (e) {
						return (this.PREFER_JPEG = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setJPGQuality = function (e) {
						return (this.JPEG_QUALITY = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setDPI = function (e) {
						return (this.DPI = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setMaximumImagePixels =
						function (e) {
							return (this.MAX_IMAGE_PIXELS = e), this;
						}),
					(p.Convert.HTMLOutputOptions.prototype.setScale = function (e) {
						return (this.SCALE = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setExternalLinks = function (
						e
					) {
						return (this.EXTERNAL_LINKS = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setInternalLinks = function (
						e
					) {
						return (this.INTERNAL_LINKS = e), this;
					}),
					(p.Convert.HTMLOutputOptions.prototype.setSimplifyText = function (
						e
					) {
						return (this.SIMPLIFY_TEXT = e), this;
					}),
					(p.Convert.createEPUBOutputOptions = function () {
						return Promise.resolve(new p.Convert.EPUBOutputOptions());
					}),
					(p.Convert.EPUBOutputOptions = function () {
						this.name = 'PDFNet.Convert.EPUBOutputOptions';
					}),
					(p.Convert.EPUBOutputOptions.prototype.setExpanded = function (e) {
						return (this.EPUB_EXPANDED = e), this;
					}),
					(p.Convert.EPUBOutputOptions.prototype.setReuseCover = function (e) {
						return (this.EPUB_REUSE_COVER = e), this;
					}),
					(p.Convert.createSVGOutputOptions = function () {
						return Promise.resolve(new p.Convert.SVGOutputOptions());
					}),
					(p.Convert.SVGOutputOptions = function () {
						this.name = 'PDFNet.Convert.SVGOutputOptions';
					}),
					(p.Convert.SVGOutputOptions.prototype.setEmbedImages = function (e) {
						return (this.EMBEDIMAGES = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setNoFonts = function (e) {
						return (this.NOFONTS = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setSvgFonts = function (e) {
						return (this.SVGFONTS = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setEmbedFonts = function (e) {
						return (this.EMBEDFONTS = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setNoUnicode = function (e) {
						return (this.NOUNICODE = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setIndividualCharPlacement =
						function (e) {
							return (this.INDIVIDUALCHARPLACEMENT = e), this;
						}),
					(p.Convert.SVGOutputOptions.prototype.setRemoveCharPlacement =
						function (e) {
							return (this.REMOVECHARPLACEMENT = e), this;
						}),
					(p.Convert.SVGOutputOptions.prototype.setFlattenContent = function (
						e
					) {
						switch (e) {
							case p.Convert.FlattenFlag.e_off:
								this.FLATTEN_CONTENT = 'OFF';
								break;
							case p.Convert.FlattenFlag.e_simple:
								this.FLATTEN_CONTENT = 'SIMPLE';
								break;
							case p.Convert.FlattenFlag.e_fast:
								this.FLATTEN_CONTENT = 'FAST';
								break;
							case p.Convert.FlattenFlag.e_high_quality:
								this.FLATTEN_CONTENT = 'HIGH_QUALITY';
						}
						return this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setFlattenThreshold = function (
						e
					) {
						switch (e) {
							case p.Convert.FlattenThresholdFlag.e_very_strict:
								this.FLATTEN_THRESHOLD = 'VERY_STRICT';
								break;
							case p.Convert.FlattenThresholdFlag.e_strict:
								this.FLATTEN_THRESHOLD = 'STRICT';
								break;
							case p.Convert.FlattenThresholdFlag.e_default:
								this.FLATTEN_THRESHOLD = 'DEFAULT';
								break;
							case p.Convert.FlattenThresholdFlag.e_keep_most:
								this.FLATTEN_THRESHOLD = 'KEEP_MOST';
								break;
							case p.Convert.FlattenThresholdFlag.e_keep_all:
								this.FLATTEN_THRESHOLD = 'KEEP_ALL';
						}
						return this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setFlattenDPI = function (e) {
						return (this.DPI = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setFlattenMaximumImagePixels =
						function (e) {
							return (this.MAX_IMAGE_PIXELS = e), this;
						}),
					(p.Convert.SVGOutputOptions.prototype.setCompress = function (e) {
						return (this.SVGZ = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setOutputThumbnails = function (
						e
					) {
						return (this.NOTHUMBS = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setThumbnailSize = function (
						e
					) {
						return (this.THUMB_SIZE = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setCreateXmlWrapper = function (
						e
					) {
						return (this.NOXMLDOC = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setDtd = function (e) {
						return (this.OMITDTD = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setAnnots = function (e) {
						return (this.NOANNOTS = e), this;
					}),
					(p.Convert.SVGOutputOptions.prototype.setOverprint = function (e) {
						switch (e) {
							case p.PDFRasterizer.OverprintPreviewMode.e_op_off:
								this.OVERPRINT_MODE = 'OFF';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_on:
								this.OVERPRINT_MODE = 'ON';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
								this.OVERPRINT_MODE = 'PDFX';
						}
						return this;
					}),
					(p.PDFDoc.createViewerOptimizedOptions = function () {
						return Promise.resolve(new p.PDFDoc.ViewerOptimizedOptions());
					}),
					(p.PDFDoc.ViewerOptimizedOptions = function () {
						this.name = 'PDFNet.PDFDoc.ViewerOptimizedOptions';
					}),
					(p.PDFDoc.ViewerOptimizedOptions.prototype.setThumbnailRenderingThreshold =
						function (e) {
							return (this.COMPLEXITY_THRESHOLD = e), this;
						}),
					(p.PDFDoc.ViewerOptimizedOptions.prototype.setMinimumInitialThumbnails =
						function (e) {
							return (this.MINIMUM_INITIAL_THUMBNAILS = e), this;
						}),
					(p.PDFDoc.ViewerOptimizedOptions.prototype.setThumbnailSize =
						function (e) {
							return (this.THUMB_SIZE = e), this;
						}),
					(p.PDFDoc.ViewerOptimizedOptions.prototype.setOverprint = function (
						e
					) {
						switch (e) {
							case p.PDFRasterizer.OverprintPreviewMode.e_op_off:
								this.OVERPRINT_MODE = 'OFF';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_on:
								this.OVERPRINT_MODE = 'ON';
								break;
							case p.PDFRasterizer.OverprintPreviewMode.e_op_pdfx_on:
								this.OVERPRINT_MODE = 'PDFX';
						}
						return this;
					}),
					(p.MarkupAnnot.prototype = new p.Annot()),
					(p.TextMarkupAnnot.prototype = new p.MarkupAnnot()),
					(p.CaretAnnot.prototype = new p.MarkupAnnot()),
					(p.LineAnnot.prototype = new p.MarkupAnnot()),
					(p.CircleAnnot.prototype = new p.MarkupAnnot()),
					(p.FileAttachmentAnnot.prototype = new p.MarkupAnnot()),
					(p.FreeTextAnnot.prototype = new p.MarkupAnnot()),
					(p.HighlightAnnot.prototype = new p.TextMarkupAnnot()),
					(p.InkAnnot.prototype = new p.MarkupAnnot()),
					(p.LinkAnnot.prototype = new p.Annot()),
					(p.MovieAnnot.prototype = new p.Annot()),
					(p.PolyLineAnnot.prototype = new p.LineAnnot()),
					(p.PolygonAnnot.prototype = new p.PolyLineAnnot()),
					(p.PopupAnnot.prototype = new p.Annot()),
					(p.RedactionAnnot.prototype = new p.MarkupAnnot()),
					(p.RubberStampAnnot.prototype = new p.MarkupAnnot()),
					(p.ScreenAnnot.prototype = new p.Annot()),
					(p.SoundAnnot.prototype = new p.MarkupAnnot()),
					(p.SquareAnnot.prototype = new p.MarkupAnnot()),
					(p.SquigglyAnnot.prototype = new p.TextMarkupAnnot()),
					(p.StrikeOutAnnot.prototype = new p.TextMarkupAnnot()),
					(p.TextAnnot.prototype = new p.MarkupAnnot()),
					(p.UnderlineAnnot.prototype = new p.TextMarkupAnnot()),
					(p.WatermarkAnnot.prototype = new p.Annot()),
					(p.WidgetAnnot.prototype = new p.Annot()),
					(p.SignatureWidget.prototype = new p.WidgetAnnot()),
					(p.ComboBoxWidget.prototype = new p.WidgetAnnot()),
					(p.ListBoxWidget.prototype = new p.WidgetAnnot()),
					(p.TextWidget.prototype = new p.WidgetAnnot()),
					(p.CheckBoxWidget.prototype = new p.WidgetAnnot()),
					(p.RadioButtonWidget.prototype = new p.WidgetAnnot()),
					(p.PushButtonWidget.prototype = new p.WidgetAnnot()),
					(p.PrinterMode.PaperSize = {
						e_custom: 0,
						e_letter: 1,
						e_letter_small: 2,
						e_tabloid: 3,
						e_ledger: 4,
						e_legal: 5,
						e_statement: 6,
						e_executive: 7,
						e_a3: 8,
						e_a4: 9,
						e_a4_mall: 10,
						e_a5: 11,
						e_b4_jis: 12,
						e_b5_jis: 13,
						e_folio: 14,
						e_quarto: 15,
						e_10x14: 16,
						e_11x17: 17,
						e_note: 18,
						e_envelope_9: 19,
						e_envelope_10: 20,
						e_envelope_11: 21,
						e_envelope_12: 22,
						e_envelope_14: 23,
						e_c_size_sheet: 24,
						e_d_size_sheet: 25,
						e_e_size_sheet: 26,
						e_envelope_dl: 27,
						e_envelope_c5: 28,
						e_envelope_c3: 29,
						e_envelope_c4: 30,
						e_envelope_c6: 31,
						e_envelope_c65: 32,
						e_envelope_b4: 33,
						e_envelope_b5: 34,
						e_envelope_b6: 35,
						e_envelope_italy: 36,
						e_envelope_monarch: 37,
						e_6_3_quarters_envelope: 38,
						e_us_std_fanfold: 39,
						e_german_std_fanfold: 40,
						e_german_legal_fanfold: 41,
						e_b4_iso: 42,
						e_japanese_postcard: 43,
						e_9x11: 44,
						e_10x11: 45,
						e_15x11: 46,
						e_envelope_invite: 47,
						e_reserved_48: 48,
						e_reserved_49: 49,
						e_letter_extra: 50,
						e_legal_extra: 51,
						e_tabloid_extra: 52,
						e_a4_extra: 53,
						e_letter_transverse: 54,
						e_a4_transverse: 55,
						e_letter_extra_transverse: 56,
						e_supera_supera_a4: 57,
						e_Superb_Superb_a3: 58,
						e_letter_plus: 59,
						e_a4_plus: 60,
						e_a5_transverse: 61,
						e_b5_jis_transverse: 62,
						e_a3_extra: 63,
						e_a5_extra: 64,
						e_b5_iso_extra: 65,
						e_a2: 66,
						e_a3_transverse: 67,
						e_a3_extra_transverse: 68,
						e_japanese_double_postcard: 69,
						e_a6: 70,
						e_japanese_envelope_kaku_2: 71,
						e_japanese_envelope_kaku_3: 72,
						e_japanese_envelope_chou_3: 73,
						e_japanese_envelope_chou_4: 74,
						e_letter_rotated: 75,
						e_a3_rotated: 76,
						e_a4_rotated: 77,
						e_a5_rotated: 78,
						e_b4_jis_rotated: 79,
						e_b5_jis_rotated: 80,
						e_japanese_postcard_rotated: 81,
						e_double_japanese_postcard_rotated: 82,
						e_a6_rotated: 83,
						e_japanese_envelope_kaku_2_rotated: 84,
						e_japanese_envelope_kaku_3_rotated: 85,
						e_japanese_envelope_chou_3_rotated: 86,
						e_japanese_envelope_chou_4_rotated: 87,
						e_b6_jis: 88,
						e_b6_jis_rotated: 89,
						e_12x11: 90,
						e_japanese_envelope_you_4: 91,
						e_japanese_envelope_you_4_rotated: 92,
						e_PrinterMode_prc_16k: 93,
						e_prc_32k: 94,
						e_prc_32k_big: 95,
						e_prc_envelop_1: 96,
						e_prc_envelop_2: 97,
						e_prc_envelop_3: 98,
						e_prc_envelop_4: 99,
						e_prc_envelop_5: 100,
						e_prc_envelop_6: 101,
						e_prc_envelop_7: 102,
						e_prc_envelop_8: 103,
						e_prc_envelop_9: 104,
						e_prc_envelop_10: 105,
						e_prc_16k_rotated: 106,
						e_prc_32k_rotated: 107,
						e_prc_32k_big__rotated: 108,
						e_prc_envelop_1_rotated: 109,
						e_prc_envelop_2_rotated: 110,
						e_prc_envelop_3_rotated: 111,
						e_prc_envelop_4_rotated: 112,
						e_prc_envelop_5_rotated: 113,
						e_prc_envelop_6_rotated: 114,
						e_prc_envelop_7_rotated: 115,
						e_prc_envelop_8_rotated: 116,
						e_prc_envelop_9_rotated: 117,
						e_prc_envelop_10_rotated: 118,
					}),
					(p.Field.EventType = {
						e_action_trigger_keystroke: 13,
						e_action_trigger_format: 14,
						e_action_trigger_validate: 15,
						e_action_trigger_calculate: 16,
					}),
					(p.Field.Type = {
						e_button: 0,
						e_check: 1,
						e_radio: 2,
						e_text: 3,
						e_choice: 4,
						e_signature: 5,
						e_null: 6,
					}),
					(p.Field.Flag = {
						e_read_only: 0,
						e_required: 1,
						e_no_export: 2,
						e_pushbutton_flag: 3,
						e_radio_flag: 4,
						e_toggle_to_off: 5,
						e_radios_in_unison: 6,
						e_multiline: 7,
						e_password: 8,
						e_file_select: 9,
						e_no_spellcheck: 10,
						e_no_scroll: 11,
						e_comb: 12,
						e_rich_text: 13,
						e_combo: 14,
						e_edit: 15,
						e_sort: 16,
						e_multiselect: 17,
						e_commit_on_sel_change: 18,
					}),
					(p.Field.TextJustification = {
						e_left_justified: 0,
						e_centered: 1,
						e_right_justified: 2,
					}),
					(p.Filter.StdFileOpenMode = {
						e_read_mode: 0,
						e_write_mode: 1,
						e_append_mode: 2,
					}),
					(p.Filter.ReferencePos = { e_begin: 0, e_end: 2, e_cur: 1 }),
					(p.OCGContext.OCDrawMode = { e_VisibleOC: 0, e_AllOC: 1, e_NoOC: 2 }),
					(p.OCMD.VisibilityPolicyType = {
						e_AllOn: 0,
						e_AnyOn: 1,
						e_AnyOff: 2,
						e_AllOff: 3,
					}),
					(p.PDFACompliance.Conformance = {
						e_Level1A: 1,
						e_Level1B: 2,
						e_Level2A: 3,
						e_Level2B: 4,
						e_Level2U: 5,
						e_Level3A: 6,
						e_Level3B: 7,
						e_Level3U: 8,
					}),
					(p.PDFACompliance.ErrorCode = {
						e_PDFA0_1_0: 10,
						e_PDFA0_1_1: 11,
						e_PDFA0_1_2: 12,
						e_PDFA0_1_3: 13,
						e_PDFA0_1_4: 14,
						e_PDFA0_1_5: 15,
						e_PDFA1_2_1: 121,
						e_PDFA1_2_2: 122,
						e_PDFA1_3_1: 131,
						e_PDFA1_3_2: 132,
						e_PDFA1_3_3: 133,
						e_PDFA1_3_4: 134,
						e_PDFA1_4_1: 141,
						e_PDFA1_4_2: 142,
						e_PDFA1_6_1: 161,
						e_PDFA1_7_1: 171,
						e_PDFA1_7_2: 172,
						e_PDFA1_7_3: 173,
						e_PDFA1_7_4: 174,
						e_PDFA1_8_1: 181,
						e_PDFA1_8_2: 182,
						e_PDFA1_8_3: 183,
						e_PDFA1_8_4: 184,
						e_PDFA1_8_5: 185,
						e_PDFA1_8_6: 186,
						e_PDFA1_10_1: 1101,
						e_PDFA1_11_1: 1111,
						e_PDFA1_11_2: 1112,
						e_PDFA1_12_1: 1121,
						e_PDFA1_12_2: 1122,
						e_PDFA1_12_3: 1123,
						e_PDFA1_12_4: 1124,
						e_PDFA1_12_5: 1125,
						e_PDFA1_12_6: 1126,
						e_PDFA1_13_1: 1131,
						e_PDFA2_2_1: 221,
						e_PDFA2_3_2: 232,
						e_PDFA2_3_3: 233,
						e_PDFA2_3_3_1: 2331,
						e_PDFA2_3_3_2: 2332,
						e_PDFA2_3_4_1: 2341,
						e_PDFA2_4_1: 241,
						e_PDFA2_4_2: 242,
						e_PDFA2_4_3: 243,
						e_PDFA2_4_4: 244,
						e_PDFA2_5_1: 251,
						e_PDFA2_5_2: 252,
						e_PDFA2_6_1: 261,
						e_PDFA2_7_1: 271,
						e_PDFA2_8_1: 281,
						e_PDFA2_9_1: 291,
						e_PDFA2_10_1: 2101,
						e_PDFA3_2_1: 321,
						e_PDFA3_3_1: 331,
						e_PDFA3_3_2: 332,
						e_PDFA3_3_3_1: 3331,
						e_PDFA3_3_3_2: 3332,
						e_PDFA3_4_1: 341,
						e_PDFA3_5_1: 351,
						e_PDFA3_5_2: 352,
						e_PDFA3_5_3: 353,
						e_PDFA3_5_4: 354,
						e_PDFA3_5_5: 355,
						e_PDFA3_5_6: 356,
						e_PDFA3_6_1: 361,
						e_PDFA3_7_1: 371,
						e_PDFA3_7_2: 372,
						e_PDFA3_7_3: 373,
						e_PDFA4_1: 41,
						e_PDFA4_2: 42,
						e_PDFA4_3: 43,
						e_PDFA4_4: 44,
						e_PDFA4_5: 45,
						e_PDFA4_6: 46,
						e_PDFA5_2_1: 521,
						e_PDFA5_2_2: 522,
						e_PDFA5_2_3: 523,
						e_PDFA5_2_4: 524,
						e_PDFA5_2_5: 525,
						e_PDFA5_2_6: 526,
						e_PDFA5_2_7: 527,
						e_PDFA5_2_8: 528,
						e_PDFA5_2_9: 529,
						e_PDFA5_2_10: 5210,
						e_PDFA5_2_11: 5211,
						e_PDFA5_3_1: 531,
						e_PDFA5_3_2_1: 5321,
						e_PDFA5_3_2_2: 5322,
						e_PDFA5_3_2_3: 5323,
						e_PDFA5_3_2_4: 5324,
						e_PDFA5_3_2_5: 5325,
						e_PDFA5_3_3_1: 5331,
						e_PDFA5_3_3_2: 5332,
						e_PDFA5_3_3_3: 5333,
						e_PDFA5_3_3_4: 5334,
						e_PDFA5_3_4_0: 5340,
						e_PDFA5_3_4_1: 5341,
						e_PDFA5_3_4_2: 5342,
						e_PDFA5_3_4_3: 5343,
						e_PDFA6_1_1: 611,
						e_PDFA6_1_2: 612,
						e_PDFA6_2_1: 621,
						e_PDFA6_2_2: 622,
						e_PDFA6_2_3: 623,
						e_PDFA7_2_1: 721,
						e_PDFA7_2_2: 722,
						e_PDFA7_2_3: 723,
						e_PDFA7_2_4: 724,
						e_PDFA7_2_5: 725,
						e_PDFA7_3_1: 731,
						e_PDFA7_3_2: 732,
						e_PDFA7_3_3: 733,
						e_PDFA7_3_4: 734,
						e_PDFA7_3_5: 735,
						e_PDFA7_3_6: 736,
						e_PDFA7_3_7: 737,
						e_PDFA7_3_8: 738,
						e_PDFA7_3_9: 739,
						e_PDFA7_5_1: 751,
						e_PDFA7_8_1: 781,
						e_PDFA7_8_2: 782,
						e_PDFA7_8_3: 783,
						e_PDFA7_8_4: 784,
						e_PDFA7_8_5: 785,
						e_PDFA7_8_6: 786,
						e_PDFA7_8_7: 787,
						e_PDFA7_8_8: 788,
						e_PDFA7_8_9: 789,
						e_PDFA7_8_10: 7810,
						e_PDFA7_8_11: 7811,
						e_PDFA7_8_12: 7812,
						e_PDFA7_8_13: 7813,
						e_PDFA7_8_14: 7814,
						e_PDFA7_8_15: 7815,
						e_PDFA7_8_16: 7816,
						e_PDFA7_8_17: 7817,
						e_PDFA7_8_18: 7818,
						e_PDFA7_8_19: 7819,
						e_PDFA7_8_20: 7820,
						e_PDFA7_8_21: 7821,
						e_PDFA7_8_22: 7822,
						e_PDFA7_8_23: 7823,
						e_PDFA7_8_24: 7824,
						e_PDFA7_8_25: 7825,
						e_PDFA7_8_26: 7826,
						e_PDFA7_8_27: 7827,
						e_PDFA7_8_28: 7828,
						e_PDFA7_8_29: 7829,
						e_PDFA7_8_30: 7830,
						e_PDFA7_8_31: 7831,
						e_PDFA7_11_1: 7111,
						e_PDFA7_11_2: 7112,
						e_PDFA7_11_3: 7113,
						e_PDFA7_11_4: 7114,
						e_PDFA7_11_5: 7115,
						e_PDFA9_1: 91,
						e_PDFA9_2: 92,
						e_PDFA9_3: 93,
						e_PDFA9_4: 94,
						e_PDFA3_8_1: 381,
						e_PDFA8_2_2: 822,
						e_PDFA8_3_3_1: 8331,
						e_PDFA8_3_3_2: 8332,
						e_PDFA8_3_4_1: 8341,
						e_PDFA1_2_3: 123,
						e_PDFA1_10_2: 1102,
						e_PDFA1_10_3: 1103,
						e_PDFA1_12_10: 11210,
						e_PDFA1_13_5: 1135,
						e_PDFA2_3_10: 2310,
						e_PDFA2_4_2_10: 24220,
						e_PDFA2_4_2_11: 24221,
						e_PDFA2_4_2_12: 24222,
						e_PDFA2_4_2_13: 24223,
						e_PDFA2_5_10: 2510,
						e_PDFA2_5_11: 2511,
						e_PDFA2_5_12: 2512,
						e_PDFA2_8_3_1: 2831,
						e_PDFA2_8_3_2: 2832,
						e_PDFA2_8_3_3: 2833,
						e_PDFA2_8_3_4: 2834,
						e_PDFA2_8_3_5: 2835,
						e_PDFA2_10_20: 21020,
						e_PDFA2_10_21: 21021,
						e_PDFA11_0_0: 11e3,
						e_PDFA6_2_11_8: 62118,
						e_PDFA8_1: 81,
						e_PDFA_3E1: 1,
						e_PDFA_3E2: 2,
						e_PDFA_3E3: 3,
						e_PDFA_LAST: 4,
					}),
					(p.ContentItem.Type = {
						e_MCR: 0,
						e_MCID: 1,
						e_OBJR: 2,
						e_Unknown: 3,
					}),
					(p.Action.Type = {
						e_GoTo: 0,
						e_GoToR: 1,
						e_GoToE: 2,
						e_Launch: 3,
						e_Thread: 4,
						e_URI: 5,
						e_Sound: 6,
						e_Movie: 7,
						e_Hide: 8,
						e_Named: 9,
						e_SubmitForm: 10,
						e_ResetForm: 11,
						e_ImportData: 12,
						e_JavaScript: 13,
						e_SetOCGState: 14,
						e_Rendition: 15,
						e_Trans: 16,
						e_GoTo3DView: 17,
						e_RichMediaExecute: 18,
						e_Unknown: 19,
					}),
					(p.Action.FormActionFlag = {
						e_exclude: 0,
						e_include_no_value_fields: 1,
						e_export_format: 2,
						e_get_method: 3,
						e_submit_coordinates: 4,
						e_xfdf: 5,
						e_include_append_saves: 6,
						e_include_annotations: 7,
						e_submit_pdf: 8,
						e_canonical_format: 9,
						e_excl_non_user_annots: 10,
						e_excl_F_key: 11,
						e_embed_form: 13,
					}),
					(p.Page.EventType = {
						e_action_trigger_page_open: 11,
						e_action_trigger_page_close: 12,
					}),
					(p.Page.Box = {
						e_media: 0,
						e_crop: 1,
						e_bleed: 2,
						e_trim: 3,
						e_art: 4,
						e_user_crop: 5,
					}),
					(p.Page.Rotate = { e_0: 0, e_90: 1, e_180: 2, e_270: 3 }),
					(p.Annot.EventType = {
						e_action_trigger_activate: 0,
						e_action_trigger_annot_enter: 1,
						e_action_trigger_annot_exit: 2,
						e_action_trigger_annot_down: 3,
						e_action_trigger_annot_up: 4,
						e_action_trigger_annot_focus: 5,
						e_action_trigger_annot_blur: 6,
						e_action_trigger_annot_page_open: 7,
						e_action_trigger_annot_page_close: 8,
						e_action_trigger_annot_page_visible: 9,
						e_action_trigger_annot_page_invisible: 10,
					}),
					(p.Annot.Type = {
						e_Text: 0,
						e_Link: 1,
						e_FreeText: 2,
						e_Line: 3,
						e_Square: 4,
						e_Circle: 5,
						e_Polygon: 6,
						e_Polyline: 7,
						e_Highlight: 8,
						e_Underline: 9,
						e_Squiggly: 10,
						e_StrikeOut: 11,
						e_Stamp: 12,
						e_Caret: 13,
						e_Ink: 14,
						e_Popup: 15,
						e_FileAttachment: 16,
						e_Sound: 17,
						e_Movie: 18,
						e_Widget: 19,
						e_Screen: 20,
						e_PrinterMark: 21,
						e_TrapNet: 22,
						e_Watermark: 23,
						e_3D: 24,
						e_Redact: 25,
						e_Projection: 26,
						e_RichMedia: 27,
						e_Unknown: 28,
					}),
					(p.Annot.Flag = {
						e_invisible: 0,
						e_hidden: 1,
						e_print: 2,
						e_no_zoom: 3,
						e_no_rotate: 4,
						e_no_view: 5,
						e_annot_read_only: 6,
						e_locked: 7,
						e_toggle_no_view: 8,
						e_locked_contents: 9,
					}),
					(p.AnnotBorderStyle.Style = {
						e_solid: 0,
						e_dashed: 1,
						e_beveled: 2,
						e_inset: 3,
						e_underline: 4,
					}),
					(p.Annot.State = { e_normal: 0, e_rollover: 1, e_down: 2 }),
					(p.LineAnnot.EndingStyle = {
						e_Square: 0,
						e_Circle: 1,
						e_Diamond: 2,
						e_OpenArrow: 3,
						e_ClosedArrow: 4,
						e_Butt: 5,
						e_ROpenArrow: 6,
						e_RClosedArrow: 7,
						e_Slash: 8,
						e_None: 9,
						e_Unknown: 10,
					}),
					(p.LineAnnot.IntentType = {
						e_LineArrow: 0,
						e_LineDimension: 1,
						e_null: 2,
					}),
					(p.LineAnnot.CapPos = { e_Inline: 0, e_Top: 1 }),
					(p.FileAttachmentAnnot.Icon = {
						e_Graph: 0,
						e_PushPin: 1,
						e_Paperclip: 2,
						e_Tag: 3,
						e_Unknown: 4,
					}),
					(p.FreeTextAnnot.IntentName = {
						e_FreeText: 0,
						e_FreeTextCallout: 1,
						e_FreeTextTypeWriter: 2,
						e_Unknown: 3,
					}),
					(p.LinkAnnot.HighlightingMode = {
						e_none: 0,
						e_invert: 1,
						e_outline: 2,
						e_push: 3,
					}),
					(p.MarkupAnnot.BorderEffect = { e_None: 0, e_Cloudy: 1 }),
					(p.PolyLineAnnot.IntentType = {
						e_PolygonCloud: 0,
						e_PolyLineDimension: 1,
						e_PolygonDimension: 2,
						e_Unknown: 3,
					}),
					(p.RedactionAnnot.QuadForm = {
						e_LeftJustified: 0,
						e_Centered: 1,
						e_RightJustified: 2,
						e_None: 3,
					}),
					(p.RubberStampAnnot.Icon = {
						e_Approved: 0,
						e_Experimental: 1,
						e_NotApproved: 2,
						e_AsIs: 3,
						e_Expired: 4,
						e_NotForPublicRelease: 5,
						e_Confidential: 6,
						e_Final: 7,
						e_Sold: 8,
						e_Departmental: 9,
						e_ForComment: 10,
						e_TopSecret: 11,
						e_ForPublicRelease: 12,
						e_Draft: 13,
						e_Unknown: 14,
					}),
					(p.ScreenAnnot.ScaleType = { e_Anamorphic: 0, e_Proportional: 1 }),
					(p.ScreenAnnot.ScaleCondition = {
						e_Always: 0,
						e_WhenBigger: 1,
						e_WhenSmaller: 2,
						e_Never: 3,
					}),
					(p.ScreenAnnot.IconCaptionRelation = {
						e_NoIcon: 0,
						e_NoCaption: 1,
						e_CBelowI: 2,
						e_CAboveI: 3,
						e_CRightILeft: 4,
						e_CLeftIRight: 5,
						e_COverlayI: 6,
					}),
					(p.SoundAnnot.Icon = { e_Speaker: 0, e_Mic: 1, e_Unknown: 2 }),
					(p.TextAnnot.Icon = {
						e_Comment: 0,
						e_Key: 1,
						e_Help: 2,
						e_NewParagraph: 3,
						e_Paragraph: 4,
						e_Insert: 5,
						e_Note: 6,
						e_Unknown: 7,
					}),
					(p.WidgetAnnot.HighlightingMode = {
						e_none: 0,
						e_invert: 1,
						e_outline: 2,
						e_push: 3,
						e_toggle: 4,
					}),
					(p.WidgetAnnot.ScaleType = { e_Anamorphic: 0, e_Proportional: 1 }),
					(p.WidgetAnnot.IconCaptionRelation = {
						e_NoIcon: 0,
						e_NoCaption: 1,
						e_CBelowI: 2,
						e_CAboveI: 3,
						e_CRightILeft: 4,
						e_CLeftIRight: 5,
						e_COverlayI: 6,
					}),
					(p.WidgetAnnot.ScaleCondition = {
						e_Always: 0,
						e_WhenBigger: 1,
						e_WhenSmaller: 2,
						e_Never: 3,
					}),
					(p.ColorSpace.Type = {
						e_device_gray: 0,
						e_device_rgb: 1,
						e_device_cmyk: 2,
						e_cal_gray: 3,
						e_cal_rgb: 4,
						e_lab: 5,
						e_icc: 6,
						e_indexed: 7,
						e_pattern: 8,
						e_separation: 9,
						e_device_n: 10,
						e_null: 11,
					}),
					(p.Convert.PrinterMode = {
						e_auto: 0,
						e_interop_only: 1,
						e_printer_only: 2,
						e_prefer_builtin_converter: 3,
					}),
					(p.Destination.FitType = {
						e_XYZ: 0,
						e_Fit: 1,
						e_FitH: 2,
						e_FitV: 3,
						e_FitR: 4,
						e_FitB: 5,
						e_FitBH: 6,
						e_FitBV: 7,
					}),
					(p.GState.Attribute = {
						e_transform: 0,
						e_rendering_intent: 1,
						e_stroke_cs: 2,
						e_stroke_color: 3,
						e_fill_cs: 4,
						e_fill_color: 5,
						e_line_width: 6,
						e_line_cap: 7,
						e_line_join: 8,
						e_flatness: 9,
						e_miter_limit: 10,
						e_dash_pattern: 11,
						e_char_spacing: 12,
						e_word_spacing: 13,
						e_horizontal_scale: 14,
						e_leading: 15,
						e_font: 16,
						e_font_size: 17,
						e_text_render_mode: 18,
						e_text_rise: 19,
						e_text_knockout: 20,
						e_text_pos_offset: 21,
						e_blend_mode: 22,
						e_opacity_fill: 23,
						e_opacity_stroke: 24,
						e_alpha_is_shape: 25,
						e_soft_mask: 26,
						e_smoothnes: 27,
						e_auto_stoke_adjust: 28,
						e_stroke_overprint: 29,
						e_fill_overprint: 30,
						e_overprint_mode: 31,
						e_transfer_funct: 32,
						e_BG_funct: 33,
						e_UCR_funct: 34,
						e_halftone: 35,
						e_null: 36,
					}),
					(p.GState.LineCap = {
						e_butt_cap: 0,
						e_round_cap: 1,
						e_square_cap: 2,
					}),
					(p.GState.LineJoin = {
						e_miter_join: 0,
						e_round_join: 1,
						e_bevel_join: 2,
					}),
					(p.GState.TextRenderingMode = {
						e_fill_text: 0,
						e_stroke_text: 1,
						e_fill_stroke_text: 2,
						e_invisible_text: 3,
						e_fill_clip_text: 4,
						e_stroke_clip_text: 5,
						e_fill_stroke_clip_text: 6,
						e_clip_text: 7,
					}),
					(p.GState.RenderingIntent = {
						e_absolute_colorimetric: 0,
						e_relative_colorimetric: 1,
						e_saturation: 2,
						e_perceptual: 3,
					}),
					(p.GState.BlendMode = {
						e_bl_compatible: 0,
						e_bl_normal: 1,
						e_bl_multiply: 2,
						e_bl_screen: 3,
						e_bl_difference: 4,
						e_bl_darken: 5,
						e_bl_lighten: 6,
						e_bl_color_dodge: 7,
						e_bl_color_burn: 8,
						e_bl_exclusion: 9,
						e_bl_hard_light: 10,
						e_bl_overlay: 11,
						e_bl_soft_light: 12,
						e_bl_luminosity: 13,
						e_bl_hue: 14,
						e_bl_saturation: 15,
						e_bl_color: 16,
					}),
					(p.Element.Type = {
						e_null: 0,
						e_path: 1,
						e_text_begin: 2,
						e_text: 3,
						e_text_new_line: 4,
						e_text_end: 5,
						e_image: 6,
						e_inline_image: 7,
						e_shading: 8,
						e_form: 9,
						e_group_begin: 10,
						e_group_end: 11,
						e_marked_content_begin: 12,
						e_marked_content_end: 13,
						e_marked_content_point: 14,
					}),
					(p.Element.PathSegmentType = {
						e_moveto: 1,
						e_lineto: 2,
						e_cubicto: 3,
						e_conicto: 4,
						e_rect: 5,
						e_closepath: 6,
					}),
					(p.ShapedText.ShapingStatus = {
						e_FullShaping: 0,
						e_PartialShaping: 1,
						e_NoShaping: 2,
					}),
					(p.ShapedText.FailureReason = {
						e_NoFailure: 0,
						e_UnsupportedFontType: 1,
						e_NotIndexEncoded: 2,
						e_FontDataNotFound: 3,
					}),
					(p.ElementWriter.WriteMode = {
						e_underlay: 0,
						e_overlay: 1,
						e_replacement: 2,
					}),
					(p.Flattener.Threshold = {
						e_very_strict: 0,
						e_strict: 1,
						e_default: 2,
						e_keep_most: 3,
						e_keep_all: 4,
					}),
					(p.Flattener.Mode = { e_simple: 0, e_fast: 1 }),
					(p.Font.StandardType1Font = {
						e_times_roman: 0,
						e_times_bold: 1,
						e_times_italic: 2,
						e_times_bold_italic: 3,
						e_helvetica: 4,
						e_helvetica_bold: 5,
						e_helvetica_oblique: 6,
						e_helvetica_bold_oblique: 7,
						e_courier: 8,
						e_courier_bold: 9,
						e_courier_oblique: 10,
						e_courier_bold_oblique: 11,
						e_symbol: 12,
						e_zapf_dingbats: 13,
						e_null: 14,
					}),
					(p.Font.Encoding = { e_IdentityH: 0, e_Indices: 1 }),
					(p.Font.Type = {
						e_Type1: 0,
						e_TrueType: 1,
						e_MMType1: 2,
						e_Type3: 3,
						e_Type0: 4,
						e_CIDType0: 5,
						e_CIDType2: 6,
					}),
					(p.Function.Type = {
						e_sampled: 0,
						e_exponential: 2,
						e_stitching: 3,
						e_postscript: 4,
					}),
					(p.Image.InputFilter = {
						e_none: 0,
						e_jpeg: 1,
						e_jp2: 2,
						e_flate: 3,
						e_g3: 4,
						e_g4: 5,
						e_ascii_hex: 6,
					}),
					(p.PageLabel.Style = {
						e_decimal: 0,
						e_roman_uppercase: 1,
						e_roman_lowercase: 2,
						e_alphabetic_uppercase: 3,
						e_alphabetic_lowercase: 4,
						e_none: 5,
					}),
					(p.PageSet.Filter = { e_all: 0, e_even: 1, e_odd: 2 }),
					(p.PatternColor.Type = {
						e_uncolored_tiling_pattern: 0,
						e_colored_tiling_pattern: 1,
						e_shading: 2,
						e_null: 3,
					}),
					(p.PatternColor.TilingType = {
						e_constant_spacing: 0,
						e_no_distortion: 1,
						e_constant_spacing_fast_fill: 2,
					}),
					(p.GeometryCollection.SnappingMode = {
						e_DefaultSnapMode: 14,
						e_PointOnLine: 1,
						e_LineMidpoint: 2,
						e_LineIntersection: 4,
						e_PathEndpoint: 8,
					}),
					(p.DigestAlgorithm.Type = {
						e_SHA1: 0,
						e_SHA256: 1,
						e_SHA384: 2,
						e_SHA512: 3,
						e_RIPEMD160: 4,
						e_unknown_digest_algorithm: 5,
					}),
					(p.ObjectIdentifier.Predefined = {
						e_commonName: 0,
						e_surname: 1,
						e_countryName: 2,
						e_localityName: 3,
						e_stateOrProvinceName: 4,
						e_streetAddress: 5,
						e_organizationName: 6,
						e_organizationalUnitName: 7,
						e_SHA1: 8,
						e_SHA256: 9,
						e_SHA384: 10,
						e_SHA512: 11,
						e_RIPEMD160: 12,
						e_RSA_encryption_PKCS1: 13,
					}),
					(p.DigitalSignatureField.SubFilterType = {
						e_adbe_x509_rsa_sha1: 0,
						e_adbe_pkcs7_detached: 1,
						e_adbe_pkcs7_sha1: 2,
						e_ETSI_CAdES_detached: 3,
						e_ETSI_RFC3161: 4,
						e_unknown: 5,
						e_absent: 6,
					}),
					(p.DigitalSignatureField.DocumentPermissions = {
						e_no_changes_allowed: 1,
						e_formfilling_signing_allowed: 2,
						e_annotating_formfilling_signing_allowed: 3,
						e_unrestricted: 4,
					}),
					(p.DigitalSignatureField.FieldPermissions = {
						e_lock_all: 0,
						e_include: 1,
						e_exclude: 2,
					}),
					(p.PDFDoc.EventType = {
						e_action_trigger_doc_will_close: 17,
						e_action_trigger_doc_will_save: 18,
						e_action_trigger_doc_did_save: 19,
						e_action_trigger_doc_will_print: 20,
						e_action_trigger_doc_did_print: 21,
					}),
					(p.PDFDoc.InsertFlag = { e_none: 0, e_insert_bookmark: 1 }),
					(p.PDFDoc.ExtractFlag = {
						e_forms_only: 0,
						e_annots_only: 1,
						e_both: 2,
					}),
					(p.PDFDoc.SignaturesVerificationStatus = {
						e_unsigned: 0,
						e_failure: 1,
						e_untrusted: 2,
						e_unsupported: 3,
						e_verified: 4,
					}),
					(p.PDFDocViewPrefs.PageMode = {
						e_UseNone: 0,
						e_UseThumbs: 1,
						e_UseBookmarks: 2,
						e_FullScreen: 3,
						e_UseOC: 4,
						e_UseAttachments: 5,
					}),
					(p.PDFDocViewPrefs.PageLayout = {
						e_Default: 0,
						e_SinglePage: 1,
						e_OneColumn: 2,
						e_TwoColumnLeft: 3,
						e_TwoColumnRight: 4,
						e_TwoPageLeft: 5,
						e_TwoPageRight: 6,
					}),
					(p.PDFDocViewPrefs.ViewerPref = {
						e_HideToolbar: 0,
						e_HideMenubar: 1,
						e_HideWindowUI: 2,
						e_FitWindow: 3,
						e_CenterWindow: 4,
						e_DisplayDocTitle: 5,
					}),
					(p.PDFRasterizer.Type = { e_BuiltIn: 0, e_GDIPlus: 1 }),
					(p.PDFRasterizer.OverprintPreviewMode = {
						e_op_off: 0,
						e_op_on: 1,
						e_op_pdfx_on: 2,
					}),
					(p.PDFRasterizer.ColorPostProcessMode = {
						e_postprocess_none: 0,
						e_postprocess_invert: 1,
						e_postprocess_gradient_map: 2,
						e_postprocess_night_mode: 3,
					}),
					(p.PDFDraw.PixelFormat = {
						e_rgba: 0,
						e_bgra: 1,
						e_rgb: 2,
						e_bgr: 3,
						e_gray: 4,
						e_gray_alpha: 5,
						e_cmyk: 6,
					}),
					(p.CMSType = { e_lcms: 0, e_icm: 1, e_no_cms: 2 }),
					(p.CharacterOrdering = {
						e_Identity: 0,
						e_Japan1: 1,
						e_Japan2: 2,
						e_GB1: 3,
						e_CNS1: 4,
						e_Korea1: 5,
					}),
					(p.LogLevel = {
						e_LogLevel_Off: -1,
						e_LogLevel_Fatal: 5,
						e_LogLevel_Error: 4,
						e_LogLevel_Warning: 3,
						e_LogLevel_Info: 2,
						e_LogLevel_Trace: 1,
						e_LogLevel_Debug: 0,
					}),
					(p.ConnectionErrorHandlingMode = {
						e_continue: 0,
						e_continue_unless_switching_to_demo: 1,
						e_stop: 2,
					}),
					(p.Shading.Type = {
						e_function_shading: 0,
						e_axial_shading: 1,
						e_radial_shading: 2,
						e_free_gouraud_shading: 3,
						e_lattice_gouraud_shading: 4,
						e_coons_shading: 5,
						e_tensor_shading: 6,
						e_null: 7,
					}),
					(p.Stamper.SizeType = {
						e_relative_scale: 1,
						e_absolute_size: 2,
						e_font_size: 3,
					}),
					(p.Stamper.TextAlignment = {
						e_align_left: -1,
						e_align_center: 0,
						e_align_right: 1,
					}),
					(p.Stamper.HorizontalAlignment = {
						e_horizontal_left: -1,
						e_horizontal_center: 0,
						e_horizontal_right: 1,
					}),
					(p.Stamper.VerticalAlignment = {
						e_vertical_bottom: -1,
						e_vertical_center: 0,
						e_vertical_top: 1,
					}),
					(p.TextExtractor.ProcessingFlags = {
						e_no_ligature_exp: 1,
						e_no_dup_remove: 2,
						e_punct_break: 4,
						e_remove_hidden_text: 8,
						e_no_invisible_text: 16,
						e_no_watermarks: 128,
						e_extract_using_zorder: 256,
					}),
					(p.TextExtractor.XMLOutputFlags = {
						e_words_as_elements: 1,
						e_output_bbox: 2,
						e_output_style_info: 4,
					}),
					(p.TextSearch.ResultCode = { e_done: 0, e_page: 1, e_found: 2 }),
					(p.TextSearch.Mode = {
						e_reg_expression: 1,
						e_case_sensitive: 2,
						e_whole_word: 4,
						e_search_up: 8,
						e_page_stop: 16,
						e_highlight: 32,
						e_ambient_string: 64,
					}),
					(p.Obj.Type = {
						e_null: 0,
						e_bool: 1,
						e_number: 2,
						e_name: 3,
						e_string: 4,
						e_dict: 5,
						e_array: 6,
						e_stream: 7,
					}),
					(p.SDFDoc.SaveOptions = {
						e_incremental: 1,
						e_remove_unused: 2,
						e_hex_strings: 4,
						e_omit_xref: 8,
						e_linearized: 16,
						e_compatibility: 32,
					}),
					(p.SecurityHandler.Permission = {
						e_owner: 1,
						e_doc_open: 2,
						e_doc_modify: 3,
						e_print: 4,
						e_print_high: 5,
						e_extract_content: 6,
						e_mod_annot: 7,
						e_fill_forms: 8,
						e_access_support: 9,
						e_assemble_doc: 10,
					}),
					(p.SecurityHandler.AlgorithmType = {
						e_RC4_40: 1,
						e_RC4_128: 2,
						e_AES: 3,
						e_AES_256: 4,
					}),
					(p.VerificationOptions.SecurityLevel = {
						e_compatibility_and_archiving: 0,
						e_maximum: 1,
					}),
					(p.VerificationOptions.TimeMode = {
						e_signing: 0,
						e_timestamp: 1,
						e_current: 2,
					}),
					(p.VerificationOptions.CertificateTrustFlag = {
						e_signing_trust: 1,
						e_certification_trust: 2,
						e_dynamic_content: 4,
						e_javascript: 16,
						e_identity: 32,
						e_trust_anchor: 64,
						e_default_trust: 97,
						e_complete_trust: 119,
					}),
					(p.VerificationResult.DocumentStatus = {
						e_no_error: 0,
						e_corrupt_file: 1,
						e_unsigned: 2,
						e_bad_byteranges: 3,
						e_corrupt_cryptographic_contents: 4,
					}),
					(p.VerificationResult.DigestStatus = {
						e_digest_invalid: 0,
						e_digest_verified: 1,
						e_digest_verification_disabled: 2,
						e_weak_digest_algorithm_but_digest_verifiable: 3,
						e_no_digest_status: 4,
						e_unsupported_encoding: 5,
					}),
					(p.VerificationResult.TrustStatus = {
						e_trust_verified: 0,
						e_untrusted: 1,
						e_trust_verification_disabled: 2,
						e_no_trust_status: 3,
					}),
					(p.VerificationResult.ModificationPermissionsStatus = {
						e_invalidated_by_disallowed_changes: 0,
						e_has_allowed_changes: 1,
						e_unmodified: 2,
						e_permissions_verification_disabled: 3,
						e_no_permissions_status: 4,
					}),
					(p.DisallowedChange.Type = {
						e_form_filled: 0,
						e_digital_signature_signed: 1,
						e_page_template_instantiated: 2,
						e_annotation_created_or_updated_or_deleted: 3,
						e_other: 4,
						e_unknown: 5,
					}),
					(p.Iterator.prototype.hasNext = function () {
						return p.sendWithPromise('Iterator.hasNext', { itr: this.id });
					}),
					(p.Iterator.prototype.next = function () {
						return p.sendWithPromise('Iterator.next', { itr: this.id });
					}),
					(p.DictIterator.prototype.hasNext = function () {
						return p.sendWithPromise('DictIterator.hasNext', { itr: this.id });
					}),
					(p.DictIterator.prototype.key = function () {
						return p
							.sendWithPromise('DictIterator.key', { itr: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.DictIterator.prototype.value = function () {
						return p
							.sendWithPromise('DictIterator.value', { itr: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.DictIterator.prototype.next = function () {
						return p.sendWithPromise('DictIterator.next', { itr: this.id });
					}),
					(p.Matrix2D.prototype.copy = function () {
						return (
							P('copy', this.yieldFunction),
							p
								.sendWithPromise('Matrix2D.copy', { m: this })
								.then(function (e) {
									return new p.Matrix2D(e);
								})
						);
					}),
					(p.Matrix2D.prototype.set = function (e, t, n, i, r, o) {
						f(
							arguments.length,
							6,
							'set',
							'(number, number, number, number, number, number)',
							[
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
								[i, 'number'],
								[r, 'number'],
								[o, 'number'],
							]
						),
							P('set', this.yieldFunction);
						var s = this;
						return (
							(this.yieldFunction = 'Matrix2D.set'),
							p
								.sendWithPromise('Matrix2D.set', {
									matrix: this,
									a: e,
									b: t,
									c: n,
									d: i,
									h: r,
									v: o,
								})
								.then(function (e) {
									(s.yieldFunction = void 0), O(e, s);
								})
						);
					}),
					(p.Matrix2D.prototype.concat = function (e, t, n, i, r, o) {
						f(
							arguments.length,
							6,
							'concat',
							'(number, number, number, number, number, number)',
							[
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
								[i, 'number'],
								[r, 'number'],
								[o, 'number'],
							]
						),
							P('concat', this.yieldFunction);
						var s = this;
						return (
							(this.yieldFunction = 'Matrix2D.concat'),
							p
								.sendWithPromise('Matrix2D.concat', {
									matrix: this,
									a: e,
									b: t,
									c: n,
									d: i,
									h: r,
									v: o,
								})
								.then(function (e) {
									(s.yieldFunction = void 0), O(e, s);
								})
						);
					}),
					(p.Matrix2D.prototype.equals = function (e) {
						return (
							f(arguments.length, 1, 'equals', '(PDFNet.Matrix2D)', [
								[e, 'Structure', p.Matrix2D, 'Matrix2D'],
							]),
							P('equals', this.yieldFunction),
							F('equals', [[e, 0]]),
							p.sendWithPromise('Matrix2D.equals', { m1: this, m2: e })
						);
					}),
					(p.Matrix2D.prototype.inverse = function () {
						return (
							P('inverse', this.yieldFunction),
							p
								.sendWithPromise('Matrix2D.inverse', { matrix: this })
								.then(function (e) {
									return new p.Matrix2D(e);
								})
						);
					}),
					(p.Matrix2D.prototype.translate = function (e, t) {
						f(arguments.length, 2, 'translate', '(number, number)', [
							[e, 'number'],
							[t, 'number'],
						]),
							P('translate', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Matrix2D.translate'),
							p
								.sendWithPromise('Matrix2D.translate', {
									matrix: this,
									h: e,
									v: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Matrix2D.prototype.preTranslate = function (e, t) {
						f(arguments.length, 2, 'preTranslate', '(number, number)', [
							[e, 'number'],
							[t, 'number'],
						]),
							P('preTranslate', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Matrix2D.preTranslate'),
							p
								.sendWithPromise('Matrix2D.preTranslate', {
									matrix: this,
									h: e,
									v: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Matrix2D.prototype.postTranslate = function (e, t) {
						f(arguments.length, 2, 'postTranslate', '(number, number)', [
							[e, 'number'],
							[t, 'number'],
						]),
							P('postTranslate', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Matrix2D.postTranslate'),
							p
								.sendWithPromise('Matrix2D.postTranslate', {
									matrix: this,
									h: e,
									v: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Matrix2D.prototype.scale = function (e, t) {
						f(arguments.length, 2, 'scale', '(number, number)', [
							[e, 'number'],
							[t, 'number'],
						]),
							P('scale', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Matrix2D.scale'),
							p
								.sendWithPromise('Matrix2D.scale', { matrix: this, h: e, v: t })
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Matrix2D.createZeroMatrix = function () {
						return p
							.sendWithPromise('matrix2DCreateZeroMatrix', {})
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Matrix2D.createIdentityMatrix = function () {
						return p
							.sendWithPromise('matrix2DCreateIdentityMatrix', {})
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Matrix2D.createRotationMatrix = function (e) {
						return (
							f(arguments.length, 1, 'createRotationMatrix', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('matrix2DCreateRotationMatrix', { angle: e })
								.then(function (e) {
									return new p.Matrix2D(e);
								})
						);
					}),
					(p.Matrix2D.prototype.multiply = function (e) {
						f(arguments.length, 1, 'multiply', '(PDFNet.Matrix2D)', [
							[e, 'Structure', p.Matrix2D, 'Matrix2D'],
						]),
							P('multiply', this.yieldFunction),
							F('multiply', [[e, 0]]);
						var t = this;
						return (
							(this.yieldFunction = 'Matrix2D.multiply'),
							p
								.sendWithPromise('Matrix2D.multiply', { matrix: this, m: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('fieldCreate', { field_dict: e.id })
								.then(function (e) {
									return new p.Field(e);
								})
						);
					}),
					(p.Field.prototype.isValid = function () {
						return (
							P('isValid', this.yieldFunction),
							p.sendWithPromise('Field.isValid', { field: this })
						);
					}),
					(p.Field.prototype.getType = function () {
						return (
							P('getType', this.yieldFunction),
							p.sendWithPromise('Field.getType', { field: this })
						);
					}),
					(p.Field.prototype.getValue = function () {
						return (
							P('getValue', this.yieldFunction),
							p
								.sendWithPromise('Field.getValue', { field: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Field.prototype.getValueAsString = function () {
						return (
							P('getValueAsString', this.yieldFunction),
							p.sendWithPromise('Field.getValueAsString', { field: this })
						);
					}),
					(p.Field.prototype.getDefaultValueAsString = function () {
						return (
							P('getDefaultValueAsString', this.yieldFunction),
							p.sendWithPromise('Field.getDefaultValueAsString', {
								field: this,
							})
						);
					}),
					(p.Field.prototype.setValueAsString = function (e) {
						f(arguments.length, 1, 'setValueAsString', '(string)', [
							[e, 'string'],
						]),
							P('setValueAsString', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.setValueAsString'),
							p
								.sendWithPromise('Field.setValueAsString', {
									field: this,
									value: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = y(p.ViewChangeCollection, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.Field.prototype.setValue = function (e) {
						f(arguments.length, 1, 'setValue', '(PDFNet.Obj)', [
							[e, 'Object', p.Obj, 'Obj'],
						]),
							P('setValue', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.setValue'),
							p
								.sendWithPromise('Field.setValue', { field: this, value: e.id })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = y(p.ViewChangeCollection, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.Field.prototype.setValueAsBool = function (e) {
						f(arguments.length, 1, 'setValueAsBool', '(boolean)', [
							[e, 'boolean'],
						]),
							P('setValueAsBool', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.setValueAsBool'),
							p
								.sendWithPromise('Field.setValueAsBool', {
									field: this,
									value: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = y(p.ViewChangeCollection, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.Field.prototype.getTriggerAction = function (e) {
						return (
							f(arguments.length, 1, 'getTriggerAction', '(number)', [
								[e, 'number'],
							]),
							P('getTriggerAction', this.yieldFunction),
							p
								.sendWithPromise('Field.getTriggerAction', {
									field: this,
									trigger: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Field.prototype.getValueAsBool = function () {
						return (
							P('getValueAsBool', this.yieldFunction),
							p.sendWithPromise('Field.getValueAsBool', { field: this })
						);
					}),
					(p.Field.prototype.refreshAppearance = function () {
						P('refreshAppearance', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.refreshAppearance'),
							p
								.sendWithPromise('Field.refreshAppearance', { field: this })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.eraseAppearance = function () {
						P('eraseAppearance', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.eraseAppearance'),
							p
								.sendWithPromise('Field.eraseAppearance', { field: this })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.getDefaultValue = function () {
						return (
							P('getDefaultValue', this.yieldFunction),
							p
								.sendWithPromise('Field.getDefaultValue', { field: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Field.prototype.getName = function () {
						return (
							P('getName', this.yieldFunction),
							p.sendWithPromise('Field.getName', { field: this })
						);
					}),
					(p.Field.prototype.getPartialName = function () {
						return (
							P('getPartialName', this.yieldFunction),
							p.sendWithPromise('Field.getPartialName', { field: this })
						);
					}),
					(p.Field.prototype.rename = function (e) {
						f(arguments.length, 1, 'rename', '(string)', [[e, 'string']]),
							P('rename', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.rename'),
							p
								.sendWithPromise('Field.rename', { field: this, field_name: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.isAnnot = function () {
						return (
							P('isAnnot', this.yieldFunction),
							p.sendWithPromise('Field.isAnnot', { field: this })
						);
					}),
					(p.Field.prototype.useSignatureHandler = function (e) {
						f(arguments.length, 1, 'useSignatureHandler', '(number)', [
							[e, 'number'],
						]),
							P('useSignatureHandler', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.useSignatureHandler'),
							p
								.sendWithPromise('Field.useSignatureHandler', {
									field: this,
									signature_handler_id: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = D(p.Obj, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.Field.prototype.getFlag = function (e) {
						return (
							f(arguments.length, 1, 'getFlag', '(number)', [[e, 'number']]),
							P('getFlag', this.yieldFunction),
							p.sendWithPromise('Field.getFlag', { field: this, flag: e })
						);
					}),
					(p.Field.prototype.setFlag = function (e, t) {
						f(arguments.length, 2, 'setFlag', '(number, boolean)', [
							[e, 'number'],
							[t, 'boolean'],
						]),
							P('setFlag', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Field.setFlag'),
							p
								.sendWithPromise('Field.setFlag', {
									field: this,
									flag: e,
									value: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Field.prototype.getJustification = function () {
						P('getJustification', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.getJustification'),
							p
								.sendWithPromise('Field.getJustification', { field: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.field, t), e.result;
								})
						);
					}),
					(p.Field.prototype.setJustification = function (e) {
						f(arguments.length, 1, 'setJustification', '(number)', [
							[e, 'number'],
						]),
							P('setJustification', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.setJustification'),
							p
								.sendWithPromise('Field.setJustification', {
									field: this,
									j: e,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.setMaxLen = function (e) {
						f(arguments.length, 1, 'setMaxLen', '(number)', [[e, 'number']]),
							P('setMaxLen', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.setMaxLen'),
							p
								.sendWithPromise('Field.setMaxLen', { field: this, max_len: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.getMaxLen = function () {
						return (
							P('getMaxLen', this.yieldFunction),
							p.sendWithPromise('Field.getMaxLen', { field: this })
						);
					}),
					(p.Field.prototype.getDefaultAppearance = function () {
						P('getDefaultAppearance', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.getDefaultAppearance'),
							p
								.sendWithPromise('Field.getDefaultAppearance', { field: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = D(p.GState, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.Field.prototype.getUpdateRect = function () {
						return (
							P('getUpdateRect', this.yieldFunction),
							p
								.sendWithPromise('Field.getUpdateRect', { field: this })
								.then(function (e) {
									return new p.Rect(e);
								})
						);
					}),
					(p.Field.prototype.flatten = function (e) {
						f(arguments.length, 1, 'flatten', '(PDFNet.Page)', [
							[e, 'Object', p.Page, 'Page'],
						]),
							P('flatten', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Field.flatten'),
							p
								.sendWithPromise('Field.flatten', { field: this, page: e.id })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Field.prototype.findInheritedAttribute = function (e) {
						return (
							f(arguments.length, 1, 'findInheritedAttribute', '(string)', [
								[e, 'string'],
							]),
							P('findInheritedAttribute', this.yieldFunction),
							p
								.sendWithPromise('Field.findInheritedAttribute', {
									field: this,
									attrib: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Field.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('Field.getSDFObj', { field: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Field.prototype.getOptCount = function () {
						return (
							P('getOptCount', this.yieldFunction),
							p.sendWithPromise('Field.getOptCount', { field: this })
						);
					}),
					(p.Field.prototype.getOpt = function (e) {
						return (
							f(arguments.length, 1, 'getOpt', '(number)', [[e, 'number']]),
							P('getOpt', this.yieldFunction),
							p.sendWithPromise('Field.getOpt', { field: this, index: e })
						);
					}),
					(p.Field.prototype.isLockedByDigitalSignature = function () {
						return (
							P('isLockedByDigitalSignature', this.yieldFunction),
							p.sendWithPromise('Field.isLockedByDigitalSignature', {
								field: this,
							})
						);
					}),
					(p.FDFDoc.create = function () {
						return p.sendWithPromise('fdfDocCreate', {}).then(function (e) {
							return y(p.FDFDoc, e);
						});
					}),
					(p.FDFDoc.createFromStream = function (e) {
						return (
							f(arguments.length, 1, 'createFromStream', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							0 != e.id && S(e.id),
							p
								.sendWithPromise('fdfDocCreateFromStream', {
									no_own_stream: e.id,
								})
								.then(function (e) {
									return y(p.FDFDoc, e);
								})
						);
					}),
					(p.FDFDoc.createFromMemoryBuffer = function (e) {
						f(
							arguments.length,
							1,
							'createFromMemoryBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p
							.sendWithPromise('fdfDocCreateFromMemoryBuffer', { buf: t })
							.then(function (e) {
								return y(p.FDFDoc, e);
							});
					}),
					(p.FDFDoc.prototype.isModified = function () {
						return p.sendWithPromise('FDFDoc.isModified', { doc: this.id });
					}),
					(p.FDFDoc.prototype.saveMemoryBuffer = function () {
						return p
							.sendWithPromise('FDFDoc.saveMemoryBuffer', { doc: this.id })
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.FDFDoc.prototype.getTrailer = function () {
						return p
							.sendWithPromise('FDFDoc.getTrailer', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.FDFDoc.prototype.getRoot = function () {
						return p
							.sendWithPromise('FDFDoc.getRoot', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.FDFDoc.prototype.getFDF = function () {
						return p
							.sendWithPromise('FDFDoc.getFDF', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.FDFDoc.prototype.getPDFFileName = function () {
						return p.sendWithPromise('FDFDoc.getPDFFileName', { doc: this.id });
					}),
					(p.FDFDoc.prototype.setPDFFileName = function (e) {
						return (
							f(arguments.length, 1, 'setPDFFileName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FDFDoc.setPDFFileName', {
								doc: this.id,
								filepath: e,
							})
						);
					}),
					(p.FDFDoc.prototype.getID = function () {
						return p
							.sendWithPromise('FDFDoc.getID', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.FDFDoc.prototype.setID = function (e) {
						return (
							f(arguments.length, 1, 'setID', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('FDFDoc.setID', { doc: this.id, id: e.id })
						);
					}),
					(p.FDFDoc.prototype.getFieldIteratorBegin = function () {
						return p
							.sendWithPromise('FDFDoc.getFieldIteratorBegin', { doc: this.id })
							.then(function (e) {
								return y(p.Iterator, e, 'FDFField');
							});
					}),
					(p.FDFDoc.prototype.getFieldIterator = function (e) {
						return (
							f(arguments.length, 1, 'getFieldIterator', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('FDFDoc.getFieldIterator', {
									doc: this.id,
									field_name: e,
								})
								.then(function (e) {
									return y(p.Iterator, e, 'FDFField');
								})
						);
					}),
					(p.FDFDoc.prototype.getField = function (e) {
						return (
							f(arguments.length, 1, 'getField', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('FDFDoc.getField', {
									doc: this.id,
									field_name: e,
								})
								.then(function (e) {
									return new p.FDFField(e);
								})
						);
					}),
					(p.FDFDoc.prototype.fieldCreate = function (e, t, n) {
						return (
							void 0 === n && (n = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fieldCreate',
								'(string, number, PDFNet.Obj)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('FDFDoc.fieldCreate', {
									doc: this.id,
									field_name: e,
									type: t,
									field_value: n.id,
								})
								.then(function (e) {
									return new p.FDFField(e);
								})
						);
					}),
					(p.FDFDoc.prototype.fieldCreateFromString = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'fieldCreateFromString',
								'(string, number, string)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'string'],
								]
							),
							p
								.sendWithPromise('FDFDoc.fieldCreateFromString', {
									doc: this.id,
									field_name: e,
									type: t,
									field_value: n,
								})
								.then(function (e) {
									return new p.FDFField(e);
								})
						);
					}),
					(p.FDFDoc.prototype.getSDFDoc = function () {
						return p
							.sendWithPromise('FDFDoc.getSDFDoc', { doc: this.id })
							.then(function (e) {
								return D(p.SDFDoc, e);
							});
					}),
					(p.FDFDoc.createFromXFDF = function (e) {
						return (
							f(arguments.length, 1, 'createFromXFDF', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('fdfDocCreateFromXFDF', { file_name: e })
								.then(function (e) {
									return y(p.FDFDoc, e);
								})
						);
					}),
					(p.FDFDoc.prototype.saveAsXFDFWithOptions = function (e, t) {
						return (
							void 0 === t && (t = null),
							f(
								arguments.length,
								1,
								'saveAsXFDFWithOptions',
								'(string, PDFNet.OptionBase)',
								[
									[e, 'string'],
									[t, 'OptionBase'],
								]
							),
							F('saveAsXFDFWithOptions', [[t, 1]]),
							(t = t ? t.getJsonString() : '{}'),
							p.sendWithPromise('FDFDoc.saveAsXFDFWithOptions', {
								doc: this.id,
								filepath: e,
								opts: t,
							})
						);
					}),
					(p.FDFDoc.prototype.saveAsXFDFAsString = function () {
						return p.sendWithPromise('FDFDoc.saveAsXFDFAsString', {
							doc: this.id,
						});
					}),
					(p.FDFDoc.prototype.saveAsXFDFAsStringWithOptions = function (e) {
						return (
							void 0 === e && (e = null),
							f(
								arguments.length,
								0,
								'saveAsXFDFAsStringWithOptions',
								'(PDFNet.OptionBase)',
								[[e, 'OptionBase']]
							),
							F('saveAsXFDFAsStringWithOptions', [[e, 0]]),
							(e = e ? e.getJsonString() : '{}'),
							p.sendWithPromise('FDFDoc.saveAsXFDFAsStringWithOptions', {
								doc: this.id,
								opts: e,
							})
						);
					}),
					(p.FDFDoc.prototype.mergeAnnots = function (e, t) {
						return (
							void 0 === t && (t = ''),
							f(arguments.length, 1, 'mergeAnnots', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p.sendWithPromise('FDFDoc.mergeAnnots', {
								doc: this.id,
								command_file: e,
								permitted_user: t,
							})
						);
					}),
					(p.FDFField.create = function (e, t) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							void 0 === t && (t = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj, PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('fdfFieldCreate', {
									field_dict: e.id,
									fdf_dict: t.id,
								})
								.then(function (e) {
									return new p.FDFField(e);
								})
						);
					}),
					(p.FDFField.prototype.getValue = function () {
						P('getValue', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'FDFField.getValue'),
							p
								.sendWithPromise('FDFField.getValue', { field: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = D(p.Obj, e.result)),
										O(e.field, t),
										e.result
									);
								})
						);
					}),
					(p.FDFField.prototype.setValue = function (e) {
						f(arguments.length, 1, 'setValue', '(PDFNet.Obj)', [
							[e, 'Object', p.Obj, 'Obj'],
						]),
							P('setValue', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'FDFField.setValue'),
							p
								.sendWithPromise('FDFField.setValue', {
									field: this,
									value: e.id,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.FDFField.prototype.getName = function () {
						P('getName', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'FDFField.getName'),
							p
								.sendWithPromise('FDFField.getName', { field: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.field, t), e.result;
								})
						);
					}),
					(p.FDFField.prototype.getPartialName = function () {
						P('getPartialName', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'FDFField.getPartialName'),
							p
								.sendWithPromise('FDFField.getPartialName', { field: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.field, t), e.result;
								})
						);
					}),
					(p.FDFField.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('FDFField.getSDFObj', { field: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.FDFField.prototype.findAttribute = function (e) {
						return (
							f(arguments.length, 1, 'findAttribute', '(string)', [
								[e, 'string'],
							]),
							P('findAttribute', this.yieldFunction),
							p
								.sendWithPromise('FDFField.findAttribute', {
									field: this,
									attrib: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Filter.prototype.createASCII85Encode = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createASCII85Encode',
								'(number, number)',
								[
									[e, 'number'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('Filter.createASCII85Encode', {
									no_own_input_filter: this.id,
									line_width: e,
									buf_sz: t,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createMemoryFilter = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createMemoryFilter',
								'(number, boolean)',
								[
									[e, 'number'],
									[t, 'boolean'],
								]
							),
							p
								.sendWithPromise('filterCreateMemoryFilter', {
									buf_sz: e,
									is_input: t,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGBFromElement = function (e) {
						return (
							f(
								arguments.length,
								1,
								'createImage2RGBFromElement',
								'(PDFNet.Element)',
								[[e, 'Object', p.Element, 'Element']]
							),
							p
								.sendWithPromise('filterCreateImage2RGBFromElement', {
									elem: e.id,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGBFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createImage2RGBFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('filterCreateImage2RGBFromObj', { obj: e.id })
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGB = function (e) {
						return (
							f(arguments.length, 1, 'createImage2RGB', '(PDFNet.Image)', [
								[e, 'Object', p.Image, 'Image'],
							]),
							p
								.sendWithPromise('filterCreateImage2RGB', { img: e.id })
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGBAFromElement = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createImage2RGBAFromElement',
								'(PDFNet.Element, boolean)',
								[
									[e, 'Object', p.Element, 'Element'],
									[t, 'boolean'],
								]
							),
							p
								.sendWithPromise('filterCreateImage2RGBAFromElement', {
									elem: e.id,
									premultiply: t,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGBAFromObj = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createImage2RGBAFromObj',
								'(PDFNet.Obj, boolean)',
								[
									[e, 'Object', p.Obj, 'Obj'],
									[t, 'boolean'],
								]
							),
							p
								.sendWithPromise('filterCreateImage2RGBAFromObj', {
									obj: e.id,
									premultiply: t,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.createImage2RGBA = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createImage2RGBA',
								'(PDFNet.Image, boolean)',
								[
									[e, 'Object', p.Image, 'Image'],
									[t, 'boolean'],
								]
							),
							p
								.sendWithPromise('filterCreateImage2RGBA', {
									img: e.id,
									premultiply: t,
								})
								.then(function (e) {
									return y(p.Filter, e);
								})
						);
					}),
					(p.Filter.prototype.attachFilter = function (e) {
						return (
							f(arguments.length, 1, 'attachFilter', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							0 != e.id && S(e.id),
							p.sendWithPromise('Filter.attachFilter', {
								filter: this.id,
								no_own_attach_filter: e.id,
							})
						);
					}),
					(p.Filter.prototype.releaseAttachedFilter = function () {
						return p
							.sendWithPromise('Filter.releaseAttachedFilter', {
								filter: this.id,
							})
							.then(function (e) {
								return y(p.Filter, e);
							});
					}),
					(p.Filter.prototype.getAttachedFilter = function () {
						return p
							.sendWithPromise('Filter.getAttachedFilter', { filter: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.Filter.prototype.getSourceFilter = function () {
						return p
							.sendWithPromise('Filter.getSourceFilter', { filter: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.Filter.prototype.getName = function () {
						return p.sendWithPromise('Filter.getName', { filter: this.id });
					}),
					(p.Filter.prototype.getDecodeName = function () {
						return p.sendWithPromise('Filter.getDecodeName', {
							filter: this.id,
						});
					}),
					(p.Filter.prototype.begin = function () {
						return p.sendWithPromise('Filter.begin', { filter: this.id });
					}),
					(p.Filter.prototype.size = function () {
						return p.sendWithPromise('Filter.size', { filter: this.id });
					}),
					(p.Filter.prototype.consume = function (e) {
						return (
							f(arguments.length, 1, 'consume', '(number)', [[e, 'number']]),
							p.sendWithPromise('Filter.consume', {
								filter: this.id,
								num_bytes: e,
							})
						);
					}),
					(p.Filter.prototype.count = function () {
						return p.sendWithPromise('Filter.count', { filter: this.id });
					}),
					(p.Filter.prototype.setCount = function (e) {
						return (
							f(arguments.length, 1, 'setCount', '(number)', [[e, 'number']]),
							p.sendWithPromise('Filter.setCount', {
								filter: this.id,
								new_count: e,
							})
						);
					}),
					(p.Filter.prototype.setStreamLength = function (e) {
						return (
							f(arguments.length, 1, 'setStreamLength', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Filter.setStreamLength', {
								filter: this.id,
								bytes: e,
							})
						);
					}),
					(p.Filter.prototype.flush = function () {
						return p.sendWithPromise('Filter.flush', { filter: this.id });
					}),
					(p.Filter.prototype.flushAll = function () {
						return p.sendWithPromise('Filter.flushAll', { filter: this.id });
					}),
					(p.Filter.prototype.isInputFilter = function () {
						return p.sendWithPromise('Filter.isInputFilter', {
							filter: this.id,
						});
					}),
					(p.Filter.prototype.canSeek = function () {
						return p.sendWithPromise('Filter.canSeek', { filter: this.id });
					}),
					(p.Filter.prototype.seek = function (e, t) {
						return (
							f(arguments.length, 2, 'seek', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('Filter.seek', {
								filter: this.id,
								offset: e,
								origin: t,
							})
						);
					}),
					(p.Filter.prototype.tell = function () {
						return p.sendWithPromise('Filter.tell', { filter: this.id });
					}),
					(p.Filter.prototype.createInputIterator = function () {
						return p
							.sendWithPromise('Filter.createInputIterator', {
								filter: this.id,
							})
							.then(function (e) {
								return y(p.Filter, e);
							});
					}),
					(p.Filter.prototype.getFilePath = function () {
						return p.sendWithPromise('Filter.getFilePath', { filter: this.id });
					}),
					(p.Filter.prototype.memoryFilterGetBuffer = function () {
						return p.sendWithPromise('Filter.memoryFilterGetBuffer', {
							filter: this.id,
						});
					}),
					(p.Filter.prototype.memoryFilterSetAsInputFilter = function () {
						return p.sendWithPromise('Filter.memoryFilterSetAsInputFilter', {
							filter: this.id,
						});
					}),
					(p.Filter.prototype.memoryFilterReset = function () {
						return p.sendWithPromise('Filter.memoryFilterReset', {
							filter: this.id,
						});
					}),
					(p.FilterReader.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							p
								.sendWithPromise('filterReaderCreate', { filter: e.id })
								.then(function (e) {
									return y(p.FilterReader, e);
								})
						);
					}),
					(p.FilterReader.prototype.attachFilter = function (e) {
						return (
							f(arguments.length, 1, 'attachFilter', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							p.sendWithPromise('FilterReader.attachFilter', {
								reader: this.id,
								filter: e.id,
							})
						);
					}),
					(p.FilterReader.prototype.getAttachedFilter = function () {
						return p
							.sendWithPromise('FilterReader.getAttachedFilter', {
								reader: this.id,
							})
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.FilterReader.prototype.seek = function (e, t) {
						return (
							f(arguments.length, 2, 'seek', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('FilterReader.seek', {
								reader: this.id,
								offset: e,
								origin: t,
							})
						);
					}),
					(p.FilterReader.prototype.tell = function () {
						return p.sendWithPromise('FilterReader.tell', { reader: this.id });
					}),
					(p.FilterReader.prototype.count = function () {
						return p.sendWithPromise('FilterReader.count', { reader: this.id });
					}),
					(p.FilterReader.prototype.flush = function () {
						return p.sendWithPromise('FilterReader.flush', { reader: this.id });
					}),
					(p.FilterReader.prototype.flushAll = function () {
						return p.sendWithPromise('FilterReader.flushAll', {
							reader: this.id,
						});
					}),
					(p.FilterReader.prototype.get = function () {
						return p.sendWithPromise('FilterReader.get', { reader: this.id });
					}),
					(p.FilterReader.prototype.peek = function () {
						return p.sendWithPromise('FilterReader.peek', { reader: this.id });
					}),
					(p.FilterWriter.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							p
								.sendWithPromise('filterWriterCreate', { filter: e.id })
								.then(function (e) {
									return y(p.FilterWriter, e);
								})
						);
					}),
					(p.FilterWriter.prototype.attachFilter = function (e) {
						return (
							f(arguments.length, 1, 'attachFilter', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							p.sendWithPromise('FilterWriter.attachFilter', {
								writer: this.id,
								filter: e.id,
							})
						);
					}),
					(p.FilterWriter.prototype.getAttachedFilter = function () {
						return p
							.sendWithPromise('FilterWriter.getAttachedFilter', {
								writer: this.id,
							})
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.FilterWriter.prototype.seek = function (e, t) {
						return (
							f(arguments.length, 2, 'seek', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('FilterWriter.seek', {
								writer: this.id,
								offset: e,
								origin: t,
							})
						);
					}),
					(p.FilterWriter.prototype.tell = function () {
						return p.sendWithPromise('FilterWriter.tell', { writer: this.id });
					}),
					(p.FilterWriter.prototype.count = function () {
						return p.sendWithPromise('FilterWriter.count', { writer: this.id });
					}),
					(p.FilterWriter.prototype.flush = function () {
						return p.sendWithPromise('FilterWriter.flush', { writer: this.id });
					}),
					(p.FilterWriter.prototype.flushAll = function () {
						return p.sendWithPromise('FilterWriter.flushAll', {
							writer: this.id,
						});
					}),
					(p.FilterWriter.prototype.writeUChar = function (e) {
						return (
							f(arguments.length, 1, 'writeUChar', '(number)', [[e, 'number']]),
							p.sendWithPromise('FilterWriter.writeUChar', {
								writer: this.id,
								ch: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeInt16 = function (e) {
						return (
							f(arguments.length, 1, 'writeInt16', '(number)', [[e, 'number']]),
							p.sendWithPromise('FilterWriter.writeInt16', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeUInt16 = function (e) {
						return (
							f(arguments.length, 1, 'writeUInt16', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FilterWriter.writeUInt16', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeInt32 = function (e) {
						return (
							f(arguments.length, 1, 'writeInt32', '(number)', [[e, 'number']]),
							p.sendWithPromise('FilterWriter.writeInt32', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeUInt32 = function (e) {
						return (
							f(arguments.length, 1, 'writeUInt32', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FilterWriter.writeUInt32', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeInt64 = function (e) {
						return (
							f(arguments.length, 1, 'writeInt64', '(number)', [[e, 'number']]),
							p.sendWithPromise('FilterWriter.writeInt64', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeUInt64 = function (e) {
						return (
							f(arguments.length, 1, 'writeUInt64', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FilterWriter.writeUInt64', {
								writer: this.id,
								num: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeString = function (e) {
						return (
							f(arguments.length, 1, 'writeString', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FilterWriter.writeString', {
								writer: this.id,
								str: e,
							})
						);
					}),
					(p.FilterWriter.prototype.writeFilter = function (e) {
						return (
							f(arguments.length, 1, 'writeFilter', '(PDFNet.FilterReader)', [
								[e, 'Object', p.FilterReader, 'FilterReader'],
							]),
							p.sendWithPromise('FilterWriter.writeFilter', {
								writer: this.id,
								reader: e.id,
							})
						);
					}),
					(p.FilterWriter.prototype.writeLine = function (e, t) {
						return (
							void 0 === t && (t = 13),
							f(arguments.length, 1, 'writeLine', '(string, number)', [
								[e, 'const char* = 0'],
								[t, 'number'],
							]),
							p.sendWithPromise('FilterWriter.writeLine', {
								writer: this.id,
								line: e,
								eol: t,
							})
						);
					}),
					(p.FilterWriter.prototype.writeBuffer = function (e) {
						f(arguments.length, 1, 'writeBuffer', '(ArrayBuffer|TypedArray)', [
							[e, 'ArrayBuffer'],
						]);
						var t = b(e, !1);
						return p.sendWithPromise('FilterWriter.writeBuffer', {
							writer: this.id,
							buf: t,
						});
					}),
					(p.OCG.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.PDFDoc, string)', [
								[e, 'PDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('ocgCreate', { pdfdoc: e.id, name: t })
								.then(function (e) {
									return D(p.OCG, e);
								})
						);
					}),
					(p.OCG.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('ocgCreateFromObj', { ocg_dict: e.id })
								.then(function (e) {
									return D(p.OCG, e);
								})
						);
					}),
					(p.OCG.prototype.copy = function () {
						return p
							.sendWithPromise('OCG.copy', { ocg: this.id })
							.then(function (e) {
								return D(p.OCG, e);
							});
					}),
					(p.OCG.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('OCG.getSDFObj', { ocg: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCG.prototype.isValid = function () {
						return p.sendWithPromise('OCG.isValid', { ocg: this.id });
					}),
					(p.OCG.prototype.getName = function () {
						return p.sendWithPromise('OCG.getName', { c: this.id });
					}),
					(p.OCG.prototype.setName = function (e) {
						return (
							f(arguments.length, 1, 'setName', '(string)', [[e, 'string']]),
							p.sendWithPromise('OCG.setName', { c: this.id, value: e })
						);
					}),
					(p.OCG.prototype.getIntent = function () {
						return p
							.sendWithPromise('OCG.getIntent', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCG.prototype.setIntent = function (e) {
						return (
							f(arguments.length, 1, 'setIntent', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCG.setIntent', { c: this.id, value: e.id })
						);
					}),
					(p.OCG.prototype.hasUsage = function () {
						return p.sendWithPromise('OCG.hasUsage', { c: this.id });
					}),
					(p.OCG.prototype.getUsage = function (e) {
						return (
							f(arguments.length, 1, 'getUsage', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('OCG.getUsage', { c: this.id, key: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.OCG.prototype.getCurrentState = function (e) {
						return (
							f(arguments.length, 1, 'getCurrentState', '(PDFNet.OCGContext)', [
								[e, 'Object', p.OCGContext, 'OCGContext'],
							]),
							p.sendWithPromise('OCG.getCurrentState', {
								c: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.OCG.prototype.setCurrentState = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setCurrentState',
								'(PDFNet.OCGContext, boolean)',
								[
									[e, 'Object', p.OCGContext, 'OCGContext'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('OCG.setCurrentState', {
								c: this.id,
								ctx: e.id,
								state: t,
							})
						);
					}),
					(p.OCG.prototype.getInitialState = function (e) {
						return (
							f(arguments.length, 1, 'getInitialState', '(PDFNet.OCGConfig)', [
								[e, 'Object', p.OCGConfig, 'OCGConfig'],
							]),
							p.sendWithPromise('OCG.getInitialState', {
								c: this.id,
								cfg: e.id,
							})
						);
					}),
					(p.OCG.prototype.setInitialState = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setInitialState',
								'(PDFNet.OCGConfig, boolean)',
								[
									[e, 'Object', p.OCGConfig, 'OCGConfig'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('OCG.setInitialState', {
								c: this.id,
								cfg: e.id,
								state: t,
							})
						);
					}),
					(p.OCG.prototype.isLocked = function (e) {
						return (
							f(arguments.length, 1, 'isLocked', '(PDFNet.OCGConfig)', [
								[e, 'Object', p.OCGConfig, 'OCGConfig'],
							]),
							p.sendWithPromise('OCG.isLocked', { c: this.id, cfg: e.id })
						);
					}),
					(p.OCG.prototype.setLocked = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setLocked',
								'(PDFNet.OCGConfig, boolean)',
								[
									[e, 'Object', p.OCGConfig, 'OCGConfig'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('OCG.setLocked', {
								c: this.id,
								cfg: e.id,
								state: t,
							})
						);
					}),
					(p.OCGConfig.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('ocgConfigCreateFromObj', { dict: e.id })
								.then(function (e) {
									return D(p.OCGConfig, e);
								})
						);
					}),
					(p.OCGConfig.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.PDFDoc, boolean)', [
								[e, 'PDFDoc'],
								[t, 'boolean'],
							]),
							p
								.sendWithPromise('ocgConfigCreate', {
									pdfdoc: e.id,
									default_config: t,
								})
								.then(function (e) {
									return D(p.OCGConfig, e);
								})
						);
					}),
					(p.OCGConfig.prototype.copy = function () {
						return p
							.sendWithPromise('OCGConfig.copy', { c: this.id })
							.then(function (e) {
								return D(p.OCGConfig, e);
							});
					}),
					(p.OCGConfig.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('OCGConfig.getSDFObj', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.getOrder = function () {
						return p
							.sendWithPromise('OCGConfig.getOrder', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.setOrder = function (e) {
						return (
							f(arguments.length, 1, 'setOrder', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCGConfig.setOrder', {
								c: this.id,
								value: e.id,
							})
						);
					}),
					(p.OCGConfig.prototype.getName = function () {
						return p.sendWithPromise('OCGConfig.getName', { c: this.id });
					}),
					(p.OCGConfig.prototype.setName = function (e) {
						return (
							f(arguments.length, 1, 'setName', '(string)', [[e, 'string']]),
							p.sendWithPromise('OCGConfig.setName', { c: this.id, value: e })
						);
					}),
					(p.OCGConfig.prototype.getCreator = function () {
						return p.sendWithPromise('OCGConfig.getCreator', { c: this.id });
					}),
					(p.OCGConfig.prototype.setCreator = function (e) {
						return (
							f(arguments.length, 1, 'setCreator', '(string)', [[e, 'string']]),
							p.sendWithPromise('OCGConfig.setCreator', {
								c: this.id,
								value: e,
							})
						);
					}),
					(p.OCGConfig.prototype.getInitBaseState = function () {
						return p.sendWithPromise('OCGConfig.getInitBaseState', {
							c: this.id,
						});
					}),
					(p.OCGConfig.prototype.setInitBaseState = function (e) {
						return (
							void 0 === e && (e = 'ON'),
							f(arguments.length, 0, 'setInitBaseState', '(string)', [
								[e, 'const char* = 0'],
							]),
							p.sendWithPromise('OCGConfig.setInitBaseState', {
								c: this.id,
								value: e,
							})
						);
					}),
					(p.OCGConfig.prototype.getInitOnStates = function () {
						return p
							.sendWithPromise('OCGConfig.getInitOnStates', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.setInitOnStates = function (e) {
						return (
							f(arguments.length, 1, 'setInitOnStates', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCGConfig.setInitOnStates', {
								c: this.id,
								value: e.id,
							})
						);
					}),
					(p.OCGConfig.prototype.getInitOffStates = function () {
						return p
							.sendWithPromise('OCGConfig.getInitOffStates', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.setInitOffStates = function (e) {
						return (
							f(arguments.length, 1, 'setInitOffStates', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCGConfig.setInitOffStates', {
								c: this.id,
								value: e.id,
							})
						);
					}),
					(p.OCGConfig.prototype.getIntent = function () {
						return p
							.sendWithPromise('OCGConfig.getIntent', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.setIntent = function (e) {
						return (
							f(arguments.length, 1, 'setIntent', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCGConfig.setIntent', {
								c: this.id,
								value: e.id,
							})
						);
					}),
					(p.OCGConfig.prototype.getLockedOCGs = function () {
						return p
							.sendWithPromise('OCGConfig.getLockedOCGs', { c: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCGConfig.prototype.setLockedOCGs = function (e) {
						return (
							f(arguments.length, 1, 'setLockedOCGs', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('OCGConfig.setLockedOCGs', {
								c: this.id,
								value: e.id,
							})
						);
					}),
					(p.OCGContext.createFromConfig = function (e) {
						return (
							f(arguments.length, 1, 'createFromConfig', '(PDFNet.OCGConfig)', [
								[e, 'Object', p.OCGConfig, 'OCGConfig'],
							]),
							p
								.sendWithPromise('ocgContextCreateFromConfig', { cfg: e.id })
								.then(function (e) {
									return y(p.OCGContext, e);
								})
						);
					}),
					(p.OCGContext.prototype.copy = function () {
						return p
							.sendWithPromise('OCGContext.copy', { c: this.id })
							.then(function (e) {
								return y(p.OCGContext, e);
							});
					}),
					(p.OCGContext.prototype.getState = function (e) {
						return (
							f(arguments.length, 1, 'getState', '(PDFNet.OCG)', [
								[e, 'Object', p.OCG, 'OCG'],
							]),
							p.sendWithPromise('OCGContext.getState', {
								c: this.id,
								grp: e.id,
							})
						);
					}),
					(p.OCGContext.prototype.setState = function (e, t) {
						return (
							f(arguments.length, 2, 'setState', '(PDFNet.OCG, boolean)', [
								[e, 'Object', p.OCG, 'OCG'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('OCGContext.setState', {
								c: this.id,
								grp: e.id,
								state: t,
							})
						);
					}),
					(p.OCGContext.prototype.resetStates = function (e) {
						return (
							f(arguments.length, 1, 'resetStates', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('OCGContext.resetStates', {
								c: this.id,
								all_on: e,
							})
						);
					}),
					(p.OCGContext.prototype.setNonOCDrawing = function (e) {
						return (
							f(arguments.length, 1, 'setNonOCDrawing', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('OCGContext.setNonOCDrawing', {
								c: this.id,
								draw_non_OC: e,
							})
						);
					}),
					(p.OCGContext.prototype.getNonOCDrawing = function () {
						return p.sendWithPromise('OCGContext.getNonOCDrawing', {
							c: this.id,
						});
					}),
					(p.OCGContext.prototype.setOCDrawMode = function (e) {
						return (
							f(arguments.length, 1, 'setOCDrawMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('OCGContext.setOCDrawMode', {
								c: this.id,
								oc_draw_mode: e,
							})
						);
					}),
					(p.OCGContext.prototype.getOCMode = function () {
						return p.sendWithPromise('OCGContext.getOCMode', { c: this.id });
					}),
					(p.OCMD.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('ocmdCreateFromObj', { ocmd_dict: e.id })
								.then(function (e) {
									return D(p.OCMD, e);
								})
						);
					}),
					(p.OCMD.create = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Obj, number)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.Obj, 'Obj'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('ocmdCreate', {
									pdfdoc: e.id,
									ocgs: t.id,
									vis_policy: n,
								})
								.then(function (e) {
									return D(p.OCMD, e);
								})
						);
					}),
					(p.OCMD.prototype.copy = function () {
						return p
							.sendWithPromise('OCMD.copy', { ocmd: this.id })
							.then(function (e) {
								return D(p.OCMD, e);
							});
					}),
					(p.OCMD.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('OCMD.getSDFObj', { ocmd: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCMD.prototype.getOCGs = function () {
						return p
							.sendWithPromise('OCMD.getOCGs', { ocmd: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCMD.prototype.getVisibilityExpression = function () {
						return p
							.sendWithPromise('OCMD.getVisibilityExpression', {
								ocmd: this.id,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.OCMD.prototype.isValid = function () {
						return p.sendWithPromise('OCMD.isValid', { ocmd: this.id });
					}),
					(p.OCMD.prototype.isCurrentlyVisible = function (e) {
						return (
							f(
								arguments.length,
								1,
								'isCurrentlyVisible',
								'(PDFNet.OCGContext)',
								[[e, 'Object', p.OCGContext, 'OCGContext']]
							),
							p.sendWithPromise('OCMD.isCurrentlyVisible', {
								ocmd: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.OCMD.prototype.getVisibilityPolicy = function () {
						return p.sendWithPromise('OCMD.getVisibilityPolicy', {
							ocmd: this.id,
						});
					}),
					(p.OCMD.prototype.setVisibilityPolicy = function (e) {
						return (
							f(arguments.length, 1, 'setVisibilityPolicy', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('OCMD.setVisibilityPolicy', {
								ocmd: this.id,
								vis_policy: e,
							})
						);
					}),
					(p.PDFACompliance.prototype.getErrorCount = function () {
						return p.sendWithPromise('PDFACompliance.getErrorCount', {
							pdfac: this.id,
						});
					}),
					(p.PDFACompliance.prototype.getError = function (e) {
						return (
							f(arguments.length, 1, 'getError', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFACompliance.getError', {
								pdfac: this.id,
								idx: e,
							})
						);
					}),
					(p.PDFACompliance.prototype.getRefObjCount = function (e) {
						return (
							f(arguments.length, 1, 'getRefObjCount', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFACompliance.getRefObjCount', {
								pdfac: this.id,
								id: e,
							})
						);
					}),
					(p.PDFACompliance.prototype.getRefObj = function (e, t) {
						return (
							f(arguments.length, 2, 'getRefObj', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('PDFACompliance.getRefObj', {
								pdfac: this.id,
								id: e,
								err_idx: t,
							})
						);
					}),
					(p.PDFACompliance.getPDFAErrorMessage = function (e) {
						return (
							f(arguments.length, 1, 'getPDFAErrorMessage', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pdfaComplianceGetPDFAErrorMessage', { id: e })
						);
					}),
					(p.PDFACompliance.getDeclaredConformance = function (e) {
						return (
							f(
								arguments.length,
								1,
								'getDeclaredConformance',
								'(PDFNet.PDFDoc)',
								[[e, 'PDFDoc']]
							),
							p.sendWithPromise('pdfaComplianceGetDeclaredConformance', {
								doc: e.id,
							})
						);
					}),
					(p.PDFACompliance.prototype.saveAsFromBuffer = function (e) {
						return (
							void 0 === e && (e = !1),
							f(arguments.length, 0, 'saveAsFromBuffer', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('PDFACompliance.saveAsFromBuffer', {
									pdfac: this.id,
									linearized: e,
								})
								.then(function (e) {
									return new Uint8Array(e);
								})
						);
					}),
					(p.AttrObj.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('attrObjCreate', { dict: e.id })
								.then(function (e) {
									return D(p.AttrObj, e);
								})
						);
					}),
					(p.AttrObj.prototype.copy = function () {
						return p
							.sendWithPromise('AttrObj.copy', { a: this.id })
							.then(function (e) {
								return D(p.AttrObj, e);
							});
					}),
					(p.AttrObj.prototype.getOwner = function () {
						return p.sendWithPromise('AttrObj.getOwner', { obj: this.id });
					}),
					(p.AttrObj.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('AttrObj.getSDFObj', { obj: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ClassMap.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('classMapCreate', { dict: e.id })
								.then(function (e) {
									return D(p.ClassMap, e);
								})
						);
					}),
					(p.ClassMap.prototype.copy = function () {
						return p
							.sendWithPromise('ClassMap.copy', { p: this.id })
							.then(function (e) {
								return D(p.ClassMap, e);
							});
					}),
					(p.ClassMap.prototype.isValid = function () {
						return p.sendWithPromise('ClassMap.isValid', { map: this.id });
					}),
					(p.ClassMap.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('ClassMap.getSDFObj', { map: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ContentItem.prototype.copy = function () {
						return (
							P('copy', this.yieldFunction),
							p
								.sendWithPromise('ContentItem.copy', { c: this })
								.then(function (e) {
									return new p.ContentItem(e);
								})
						);
					}),
					(p.ContentItem.prototype.getType = function () {
						return (
							P('getType', this.yieldFunction),
							p.sendWithPromise('ContentItem.getType', { item: this })
						);
					}),
					(p.ContentItem.prototype.getParent = function () {
						P('getParent', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'ContentItem.getParent'),
							p
								.sendWithPromise('ContentItem.getParent', { item: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.SElement(e.result)),
										O(e.item, t),
										e.result
									);
								})
						);
					}),
					(p.ContentItem.prototype.getPage = function () {
						P('getPage', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'ContentItem.getPage'),
							p
								.sendWithPromise('ContentItem.getPage', { item: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = D(p.Page, e.result)),
										O(e.item, t),
										e.result
									);
								})
						);
					}),
					(p.ContentItem.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('ContentItem.getSDFObj', { item: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ContentItem.prototype.getMCID = function () {
						return (
							P('getMCID', this.yieldFunction),
							p.sendWithPromise('ContentItem.getMCID', { item: this })
						);
					}),
					(p.ContentItem.prototype.getContainingStm = function () {
						return (
							P('getContainingStm', this.yieldFunction),
							p
								.sendWithPromise('ContentItem.getContainingStm', { item: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ContentItem.prototype.getStmOwner = function () {
						return (
							P('getStmOwner', this.yieldFunction),
							p
								.sendWithPromise('ContentItem.getStmOwner', { item: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ContentItem.prototype.getRefObj = function () {
						return (
							P('getRefObj', this.yieldFunction),
							p
								.sendWithPromise('ContentItem.getRefObj', { item: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.RoleMap.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('roleMapCreate', { dict: e.id })
								.then(function (e) {
									return D(p.RoleMap, e);
								})
						);
					}),
					(p.RoleMap.prototype.copy = function () {
						return p
							.sendWithPromise('RoleMap.copy', { p: this.id })
							.then(function (e) {
								return D(p.RoleMap, e);
							});
					}),
					(p.RoleMap.prototype.isValid = function () {
						return p.sendWithPromise('RoleMap.isValid', { map: this.id });
					}),
					(p.RoleMap.prototype.getDirectMap = function (e) {
						return (
							f(arguments.length, 1, 'getDirectMap', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('RoleMap.getDirectMap', {
								map: this.id,
								type: e,
							})
						);
					}),
					(p.RoleMap.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('RoleMap.getSDFObj', { map: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SElement.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('sElementCreate', { dict: e.id })
								.then(function (e) {
									return new p.SElement(e);
								})
						);
					}),
					(p.SElement.createFromPDFDoc = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createFromPDFDoc',
								'(PDFNet.PDFDoc, string)',
								[
									[e, 'PDFDoc'],
									[t, 'string'],
								]
							),
							p
								.sendWithPromise('sElementCreateFromPDFDoc', {
									doc: e.id,
									struct_type: t,
								})
								.then(function (e) {
									return new p.SElement(e);
								})
						);
					}),
					(p.SElement.prototype.insert = function (t, e) {
						f(arguments.length, 2, 'insert', '(PDFNet.SElement, number)', [
							[t, 'Structure', p.SElement, 'SElement'],
							[e, 'number'],
						]),
							P('insert', this.yieldFunction),
							F('insert', [[t, 0]]);
						var n = this;
						return (
							(this.yieldFunction = 'SElement.insert'),
							(t.yieldFunction = 'SElement.insert'),
							p
								.sendWithPromise('SElement.insert', {
									e: this,
									kid: t,
									insert_before: e,
								})
								.then(function (e) {
									(n.yieldFunction = void 0),
										(t.yieldFunction = void 0),
										O(e.e, n),
										O(e.kid, t);
								})
						);
					}),
					(p.SElement.prototype.createContentItem = function (e, t, n) {
						void 0 === n && (n = -1),
							f(
								arguments.length,
								2,
								'createContentItem',
								'(PDFNet.PDFDoc, PDFNet.Page, number)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.Page, 'Page'],
									[n, 'number'],
								]
							),
							P('createContentItem', this.yieldFunction);
						var i = this;
						return (
							(this.yieldFunction = 'SElement.createContentItem'),
							p
								.sendWithPromise('SElement.createContentItem', {
									e: this,
									doc: e.id,
									page: t.id,
									insert_before: n,
								})
								.then(function (e) {
									return (i.yieldFunction = void 0), O(e.e, i), e.result;
								})
						);
					}),
					(p.SElement.prototype.isValid = function () {
						return (
							P('isValid', this.yieldFunction),
							p.sendWithPromise('SElement.isValid', { e: this })
						);
					}),
					(p.SElement.prototype.getType = function () {
						return (
							P('getType', this.yieldFunction),
							p.sendWithPromise('SElement.getType', { e: this })
						);
					}),
					(p.SElement.prototype.getNumKids = function () {
						return (
							P('getNumKids', this.yieldFunction),
							p.sendWithPromise('SElement.getNumKids', { e: this })
						);
					}),
					(p.SElement.prototype.isContentItem = function (e) {
						return (
							f(arguments.length, 1, 'isContentItem', '(number)', [
								[e, 'number'],
							]),
							P('isContentItem', this.yieldFunction),
							p.sendWithPromise('SElement.isContentItem', { e: this, index: e })
						);
					}),
					(p.SElement.prototype.getAsContentItem = function (e) {
						return (
							f(arguments.length, 1, 'getAsContentItem', '(number)', [
								[e, 'number'],
							]),
							P('getAsContentItem', this.yieldFunction),
							p
								.sendWithPromise('SElement.getAsContentItem', {
									e: this,
									index: e,
								})
								.then(function (e) {
									return new p.ContentItem(e);
								})
						);
					}),
					(p.SElement.prototype.getAsStructElem = function (e) {
						return (
							f(arguments.length, 1, 'getAsStructElem', '(number)', [
								[e, 'number'],
							]),
							P('getAsStructElem', this.yieldFunction),
							p
								.sendWithPromise('SElement.getAsStructElem', {
									e: this,
									index: e,
								})
								.then(function (e) {
									return new p.SElement(e);
								})
						);
					}),
					(p.SElement.prototype.getParent = function () {
						return (
							P('getParent', this.yieldFunction),
							p
								.sendWithPromise('SElement.getParent', { e: this })
								.then(function (e) {
									return new p.SElement(e);
								})
						);
					}),
					(p.SElement.prototype.getStructTreeRoot = function () {
						return (
							P('getStructTreeRoot', this.yieldFunction),
							p
								.sendWithPromise('SElement.getStructTreeRoot', { e: this })
								.then(function (e) {
									return D(p.STree, e);
								})
						);
					}),
					(p.SElement.prototype.hasTitle = function () {
						return (
							P('hasTitle', this.yieldFunction),
							p.sendWithPromise('SElement.hasTitle', { e: this })
						);
					}),
					(p.SElement.prototype.getTitle = function () {
						return (
							P('getTitle', this.yieldFunction),
							p.sendWithPromise('SElement.getTitle', { e: this })
						);
					}),
					(p.SElement.prototype.getID = function () {
						return (
							P('getID', this.yieldFunction),
							p
								.sendWithPromise('SElement.getID', { e: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SElement.prototype.hasActualText = function () {
						return (
							P('hasActualText', this.yieldFunction),
							p.sendWithPromise('SElement.hasActualText', { e: this })
						);
					}),
					(p.SElement.prototype.getActualText = function () {
						return (
							P('getActualText', this.yieldFunction),
							p.sendWithPromise('SElement.getActualText', { e: this })
						);
					}),
					(p.SElement.prototype.hasAlt = function () {
						return (
							P('hasAlt', this.yieldFunction),
							p.sendWithPromise('SElement.hasAlt', { e: this })
						);
					}),
					(p.SElement.prototype.getAlt = function () {
						return (
							P('getAlt', this.yieldFunction),
							p.sendWithPromise('SElement.getAlt', { e: this })
						);
					}),
					(p.SElement.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('SElement.getSDFObj', { e: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.STree.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('sTreeCreate', { struct_dict: e.id })
								.then(function (e) {
									return D(p.STree, e);
								})
						);
					}),
					(p.STree.createFromPDFDoc = function (e) {
						return (
							f(arguments.length, 1, 'createFromPDFDoc', '(PDFNet.PDFDoc)', [
								[e, 'PDFDoc'],
							]),
							p
								.sendWithPromise('sTreeCreateFromPDFDoc', { doc: e.id })
								.then(function (e) {
									return D(p.STree, e);
								})
						);
					}),
					(p.STree.prototype.insert = function (t, e) {
						return (
							f(arguments.length, 2, 'insert', '(PDFNet.SElement, number)', [
								[t, 'Structure', p.SElement, 'SElement'],
								[e, 'number'],
							]),
							F('insert', [[t, 0]]),
							(t.yieldFunction = 'STree.insert'),
							p
								.sendWithPromise('STree.insert', {
									tree: this.id,
									kid: t,
									insert_before: e,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.STree.prototype.copy = function () {
						return p
							.sendWithPromise('STree.copy', { c: this.id })
							.then(function (e) {
								return D(p.STree, e);
							});
					}),
					(p.STree.prototype.isValid = function () {
						return p.sendWithPromise('STree.isValid', { tree: this.id });
					}),
					(p.STree.prototype.getNumKids = function () {
						return p.sendWithPromise('STree.getNumKids', { tree: this.id });
					}),
					(p.STree.prototype.getKid = function (e) {
						return (
							f(arguments.length, 1, 'getKid', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('STree.getKid', { tree: this.id, index: e })
								.then(function (e) {
									return new p.SElement(e);
								})
						);
					}),
					(p.STree.prototype.getRoleMap = function () {
						return p
							.sendWithPromise('STree.getRoleMap', { tree: this.id })
							.then(function (e) {
								return D(p.RoleMap, e);
							});
					}),
					(p.STree.prototype.getClassMap = function () {
						return p
							.sendWithPromise('STree.getClassMap', { tree: this.id })
							.then(function (e) {
								return D(p.ClassMap, e);
							});
					}),
					(p.STree.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('STree.getSDFObj', { tree: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Action.createGoto = function (e) {
						return (
							f(arguments.length, 1, 'createGoto', '(PDFNet.Destination)', [
								[e, 'Object', p.Destination, 'Destination'],
							]),
							p
								.sendWithPromise('actionCreateGoto', { dest: e.id })
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createGotoWithKey = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createGotoWithKey',
								'(string, PDFNet.Destination)',
								[
									[e, 'string'],
									[t, 'Object', p.Destination, 'Destination'],
								]
							),
							p
								.sendWithPromise('actionCreateGotoWithKey', {
									key: e,
									dest: t.id,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createGotoRemote = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createGotoRemote',
								'(PDFNet.FileSpec, number)',
								[
									[e, 'Object', p.FileSpec, 'FileSpec'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('actionCreateGotoRemote', {
									file: e.id,
									page_num: t,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createGotoRemoteSetNewWindow = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createGotoRemoteSetNewWindow',
								'(PDFNet.FileSpec, number, boolean)',
								[
									[e, 'Object', p.FileSpec, 'FileSpec'],
									[t, 'number'],
									[n, 'boolean'],
								]
							),
							p
								.sendWithPromise('actionCreateGotoRemoteSetNewWindow', {
									file: e.id,
									page_num: t,
									new_window: n,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createURI = function (e, t) {
						return (
							f(arguments.length, 2, 'createURI', '(PDFNet.SDFDoc, string)', [
								[e, 'SDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('actionCreateURI', { sdfdoc: e.id, uri: t })
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createURIWithUString = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createURIWithUString',
								'(PDFNet.SDFDoc, string)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
								]
							),
							p
								.sendWithPromise('actionCreateURIWithUString', {
									sdfdoc: e.id,
									uri: t,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createSubmitForm = function (e) {
						return (
							f(arguments.length, 1, 'createSubmitForm', '(PDFNet.FileSpec)', [
								[e, 'Object', p.FileSpec, 'FileSpec'],
							]),
							p
								.sendWithPromise('actionCreateSubmitForm', { url: e.id })
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createLaunch = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createLaunch',
								'(PDFNet.SDFDoc, string)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
								]
							),
							p
								.sendWithPromise('actionCreateLaunch', {
									sdfdoc: e.id,
									path: t,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					});
				(p.Action.createHideField = function (e, t) {
					return (
						f(
							arguments.length,
							2,
							'createHideField',
							'(PDFNet.SDFDoc, Array<string>)',
							[
								[e, 'SDFDoc'],
								[t, 'Array'],
							]
						),
						p
							.sendWithPromise('actionCreateHideField', {
								sdfdoc: e.id,
								field_names_list: t,
							})
							.then(function (e) {
								return D(p.Action, e);
							})
					);
				}),
					(p.Action.createImportData = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createImportData',
								'(PDFNet.SDFDoc, string)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
								]
							),
							p
								.sendWithPromise('actionCreateImportData', {
									sdfdoc: e.id,
									path: t,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createResetForm = function (e) {
						return (
							f(arguments.length, 1, 'createResetForm', '(PDFNet.SDFDoc)', [
								[e, 'SDFDoc'],
							]),
							p
								.sendWithPromise('actionCreateResetForm', { sdfdoc: e.id })
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.createJavaScript = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createJavaScript',
								'(PDFNet.SDFDoc, string)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
								]
							),
							p
								.sendWithPromise('actionCreateJavaScript', {
									sdfdoc: e.id,
									script: t,
								})
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('actionCreate', { in_obj: e.id })
								.then(function (e) {
									return D(p.Action, e);
								})
						);
					}),
					(p.Action.prototype.copy = function () {
						return p
							.sendWithPromise('Action.copy', { in_action: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.Action.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('Action.compare', {
								action: this.id,
								in_action: e.id,
							})
						);
					}),
					(p.Action.prototype.isValid = function () {
						return p.sendWithPromise('Action.isValid', { action: this.id });
					}),
					(p.Action.prototype.getType = function () {
						return p.sendWithPromise('Action.getType', { action: this.id });
					}),
					(p.Action.prototype.getDest = function () {
						return p
							.sendWithPromise('Action.getDest', { action: this.id })
							.then(function (e) {
								return D(p.Destination, e);
							});
					}),
					(p.Action.prototype.getNext = function () {
						return p
							.sendWithPromise('Action.getNext', { action: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Action.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Action.getSDFObj', { action: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Action.prototype.getFormActionFlag = function (e) {
						return (
							f(arguments.length, 1, 'getFormActionFlag', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Action.getFormActionFlag', {
								action: this.id,
								flag: e,
							})
						);
					}),
					(p.Action.prototype.setFormActionFlag = function (e, t) {
						return (
							f(arguments.length, 2, 'setFormActionFlag', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('Action.setFormActionFlag', {
								action: this.id,
								flag: e,
								value: t,
							})
						);
					}),
					(p.Action.prototype.needsWriteLock = function () {
						return p.sendWithPromise('Action.needsWriteLock', {
							action: this.id,
						});
					}),
					(p.Action.prototype.execute = function () {
						return p.sendWithPromise('Action.execute', { action: this.id });
					}),
					(p.Action.prototype.executeKeyStrokeAction = function (e) {
						return (
							f(
								arguments.length,
								1,
								'executeKeyStrokeAction',
								'(PDFNet.KeyStrokeEventData)',
								[[e, 'Object', p.KeyStrokeEventData, 'KeyStrokeEventData']]
							),
							p
								.sendWithPromise('Action.executeKeyStrokeAction', {
									action: this.id,
									data: e.id,
								})
								.then(function (e) {
									return y(p.KeyStrokeActionResult, e);
								})
						);
					}),
					(p.KeyStrokeActionResult.prototype.isValid = function () {
						return p.sendWithPromise('KeyStrokeActionResult.isValid', {
							action_ret: this.id,
						});
					}),
					(p.KeyStrokeActionResult.prototype.getText = function () {
						return p.sendWithPromise('KeyStrokeActionResult.getText', {
							action_ret: this.id,
						});
					}),
					(p.KeyStrokeActionResult.prototype.copy = function () {
						return p
							.sendWithPromise('KeyStrokeActionResult.copy', {
								action_ret: this.id,
							})
							.then(function (e) {
								return y(p.KeyStrokeActionResult, e);
							});
					}),
					(p.KeyStrokeEventData.create = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'create',
								'(string, string, string, number, number)',
								[
									[e, 'string'],
									[t, 'string'],
									[n, 'string'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p
								.sendWithPromise('keyStrokeEventDataCreate', {
									field_name: e,
									current: t,
									change: n,
									selection_start: i,
									selection_end: r,
								})
								.then(function (e) {
									return y(p.KeyStrokeEventData, e);
								})
						);
					}),
					(p.KeyStrokeEventData.prototype.copy = function () {
						return p
							.sendWithPromise('KeyStrokeEventData.copy', { data: this.id })
							.then(function (e) {
								return y(p.KeyStrokeEventData, e);
							});
					}),
					(p.Page.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('pageCreate', { page_dict: e.id })
								.then(function (e) {
									return D(p.Page, e);
								})
						);
					}),
					(p.Page.prototype.copy = function () {
						return p
							.sendWithPromise('Page.copy', { p: this.id })
							.then(function (e) {
								return D(p.Page, e);
							});
					}),
					(p.Page.prototype.isValid = function () {
						return p.sendWithPromise('Page.isValid', { page: this.id });
					}),
					(p.Page.prototype.getIndex = function () {
						return p.sendWithPromise('Page.getIndex', { page: this.id });
					}),
					(p.Page.prototype.getTriggerAction = function (e) {
						return (
							f(arguments.length, 1, 'getTriggerAction', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('Page.getTriggerAction', {
									page: this.id,
									trigger: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Page.prototype.getBox = function (e) {
						return (
							f(arguments.length, 1, 'getBox', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Page.getBox', { page: this.id, type: e })
								.then(function (e) {
									return new p.Rect(e);
								})
						);
					}),
					(p.Page.prototype.setBox = function (e, t) {
						return (
							f(arguments.length, 2, 'setBox', '(number, PDFNet.Rect)', [
								[e, 'number'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('setBox', [[t, 1]]),
							p.sendWithPromise('Page.setBox', {
								page: this.id,
								type: e,
								box: t,
							})
						);
					}),
					(p.Page.prototype.getCropBox = function () {
						return p
							.sendWithPromise('Page.getCropBox', { page: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Page.prototype.setCropBox = function (e) {
						return (
							f(arguments.length, 1, 'setCropBox', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setCropBox', [[e, 0]]),
							p.sendWithPromise('Page.setCropBox', { page: this.id, box: e })
						);
					}),
					(p.Page.prototype.getMediaBox = function () {
						return p
							.sendWithPromise('Page.getMediaBox', { page: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Page.prototype.setMediaBox = function (e) {
						return (
							f(arguments.length, 1, 'setMediaBox', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setMediaBox', [[e, 0]]),
							p.sendWithPromise('Page.setMediaBox', { page: this.id, box: e })
						);
					}),
					(p.Page.prototype.getVisibleContentBox = function () {
						return p
							.sendWithPromise('Page.getVisibleContentBox', { page: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Page.prototype.getRotation = function () {
						return p.sendWithPromise('Page.getRotation', { page: this.id });
					}),
					(p.Page.prototype.setRotation = function (e) {
						return (
							f(arguments.length, 1, 'setRotation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Page.setRotation', { page: this.id, angle: e })
						);
					}),
					(p.Page.addRotations = function (e, t) {
						return (
							f(arguments.length, 2, 'addRotations', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('pageAddRotations', { r0: e, r1: t })
						);
					}),
					(p.Page.subtractRotations = function (e, t) {
						return (
							f(arguments.length, 2, 'subtractRotations', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('pageSubtractRotations', { r0: e, r1: t })
						);
					}),
					(p.Page.rotationToDegree = function (e) {
						return (
							f(arguments.length, 1, 'rotationToDegree', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pageRotationToDegree', { r: e })
						);
					}),
					(p.Page.degreeToRotation = function (e) {
						return (
							f(arguments.length, 1, 'degreeToRotation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pageDegreeToRotation', { r: e })
						);
					}),
					(p.Page.prototype.getPageWidth = function (e) {
						return (
							void 0 === e && (e = p.Page.Box.e_crop),
							f(arguments.length, 0, 'getPageWidth', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Page.getPageWidth', {
								page: this.id,
								box_type: e,
							})
						);
					}),
					(p.Page.prototype.getPageHeight = function (e) {
						return (
							void 0 === e && (e = p.Page.Box.e_crop),
							f(arguments.length, 0, 'getPageHeight', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Page.getPageHeight', {
								page: this.id,
								box_type: e,
							})
						);
					}),
					(p.Page.prototype.getDefaultMatrix = function (e, t, n) {
						return (
							void 0 === e && (e = !1),
							void 0 === t && (t = p.Page.Box.e_crop),
							void 0 === n && (n = p.Page.Rotate.e_0),
							f(
								arguments.length,
								0,
								'getDefaultMatrix',
								'(boolean, number, number)',
								[
									[e, 'boolean'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('Page.getDefaultMatrix', {
									page: this.id,
									flip_y: e,
									box_type: t,
									angle: n,
								})
								.then(function (e) {
									return new p.Matrix2D(e);
								})
						);
					}),
					(p.Page.prototype.getAnnots = function () {
						return p
							.sendWithPromise('Page.getAnnots', { page: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Page.prototype.getNumAnnots = function () {
						return p.sendWithPromise('Page.getNumAnnots', { page: this.id });
					}),
					(p.Page.prototype.getAnnot = function (e) {
						return (
							f(arguments.length, 1, 'getAnnot', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Page.getAnnot', { page: this.id, index: e })
								.then(function (e) {
									return D(p.Annot, e);
								})
						);
					}),
					(p.Page.prototype.annotInsert = function (e, t) {
						return (
							f(arguments.length, 2, 'annotInsert', '(number, PDFNet.Annot)', [
								[e, 'number'],
								[t, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('Page.annotInsert', {
								page: this.id,
								pos: e,
								annot: t.id,
							})
						);
					}),
					(p.Page.prototype.annotPushBack = function (e) {
						return (
							f(arguments.length, 1, 'annotPushBack', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('Page.annotPushBack', {
								page: this.id,
								annot: e.id,
							})
						);
					}),
					(p.Page.prototype.annotPushFront = function (e) {
						return (
							f(arguments.length, 1, 'annotPushFront', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('Page.annotPushFront', {
								page: this.id,
								annot: e.id,
							})
						);
					}),
					(p.Page.prototype.annotRemove = function (e) {
						return (
							f(arguments.length, 1, 'annotRemove', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('Page.annotRemove', {
								page: this.id,
								annot: e.id,
							})
						);
					}),
					(p.Page.prototype.annotRemoveByIndex = function (e) {
						return (
							f(arguments.length, 1, 'annotRemoveByIndex', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Page.annotRemoveByIndex', {
								page: this.id,
								index: e,
							})
						);
					}),
					(p.Page.prototype.scale = function (e) {
						return (
							f(arguments.length, 1, 'scale', '(number)', [[e, 'number']]),
							p.sendWithPromise('Page.scale', { page: this.id, scale: e })
						);
					}),
					(p.Page.prototype.flattenField = function (t) {
						return (
							f(arguments.length, 1, 'flattenField', '(PDFNet.Field)', [
								[t, 'Structure', p.Field, 'Field'],
							]),
							F('flattenField', [[t, 0]]),
							(t.yieldFunction = 'Page.flattenField'),
							p
								.sendWithPromise('Page.flattenField', {
									page: this.id,
									field_to_flatten: t,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Page.prototype.hasTransition = function () {
						return p.sendWithPromise('Page.hasTransition', { page: this.id });
					}),
					(p.Page.prototype.getUserUnitSize = function () {
						return p.sendWithPromise('Page.getUserUnitSize', { page: this.id });
					}),
					(p.Page.prototype.setUserUnitSize = function (e) {
						return (
							f(arguments.length, 1, 'setUserUnitSize', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Page.setUserUnitSize', {
								page: this.id,
								unit_size: e,
							})
						);
					}),
					(p.Page.prototype.getResourceDict = function () {
						return p
							.sendWithPromise('Page.getResourceDict', { page: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Page.prototype.getContents = function () {
						return p
							.sendWithPromise('Page.getContents', { page: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Page.prototype.getThumb = function () {
						return p
							.sendWithPromise('Page.getThumb', { page: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Page.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Page.getSDFObj', { page: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Page.prototype.findInheritedAttribute = function (e) {
						return (
							f(arguments.length, 1, 'findInheritedAttribute', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Page.findInheritedAttribute', {
									page: this.id,
									attrib: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Annot.create = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'create',
								'(PDFNet.SDFDoc, number, PDFNet.Rect)',
								[
									[e, 'SDFDoc'],
									[t, 'number'],
									[n, 'Structure', p.Rect, 'Rect'],
								]
							),
							F('create', [[n, 2]]),
							p
								.sendWithPromise('annotCreate', { doc: e.id, type: t, pos: n })
								.then(function (e) {
									return D(p.Annot, e);
								})
						);
					}),
					(p.Annot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('annotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.Annot, e);
								})
						);
					}),
					(p.Annot.prototype.copy = function () {
						return p
							.sendWithPromise('Annot.copy', { d: this.id })
							.then(function (e) {
								return D(p.Annot, e);
							});
					}),
					(p.Annot.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('Annot.compare', { annot: this.id, d: e.id })
						);
					}),
					(p.Annot.prototype.isValid = function () {
						return p.sendWithPromise('Annot.isValid', { annot: this.id });
					}),
					(p.Annot.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Annot.getSDFObj', { annot: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Annot.prototype.getType = function () {
						return p.sendWithPromise('Annot.getType', { annot: this.id });
					}),
					(p.Annot.prototype.isMarkup = function () {
						return p.sendWithPromise('Annot.isMarkup', { annot: this.id });
					}),
					(p.Annot.prototype.getRect = function () {
						return p
							.sendWithPromise('Annot.getRect', { annot: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Annot.prototype.getVisibleContentBox = function () {
						return p
							.sendWithPromise('Annot.getVisibleContentBox', { annot: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Annot.prototype.setRect = function (e) {
						return (
							f(arguments.length, 1, 'setRect', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setRect', [[e, 0]]),
							p.sendWithPromise('Annot.setRect', { annot: this.id, pos: e })
						);
					}),
					(p.Annot.prototype.resize = function (e) {
						return (
							f(arguments.length, 1, 'resize', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('resize', [[e, 0]]),
							p.sendWithPromise('Annot.resize', { annot: this.id, newrect: e })
						);
					}),
					(p.Annot.prototype.setContents = function (e) {
						return (
							f(arguments.length, 1, 'setContents', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Annot.setContents', {
								annot: this.id,
								contents: e,
							})
						);
					}),
					(p.Annot.prototype.getContents = function () {
						return p.sendWithPromise('Annot.getContents', { annot: this.id });
					}),
					(p.Annot.prototype.getTriggerAction = function (e) {
						return (
							f(arguments.length, 1, 'getTriggerAction', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('Annot.getTriggerAction', {
									annot: this.id,
									trigger: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Annot.prototype.getCustomData = function (e) {
						return (
							f(arguments.length, 1, 'getCustomData', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Annot.getCustomData', {
								annot: this.id,
								key: e,
							})
						);
					}),
					(p.Annot.prototype.setCustomData = function (e, t) {
						return (
							f(arguments.length, 2, 'setCustomData', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p.sendWithPromise('Annot.setCustomData', {
								annot: this.id,
								key: e,
								value: t,
							})
						);
					}),
					(p.Annot.prototype.deleteCustomData = function (e) {
						return (
							f(arguments.length, 1, 'deleteCustomData', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Annot.deleteCustomData', {
								annot: this.id,
								key: e,
							})
						);
					}),
					(p.Annot.prototype.getPage = function () {
						return p
							.sendWithPromise('Annot.getPage', { annot: this.id })
							.then(function (e) {
								return D(p.Page, e);
							});
					}),
					(p.Annot.prototype.setPage = function (e) {
						return (
							f(arguments.length, 1, 'setPage', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('Annot.setPage', { annot: this.id, page: e.id })
						);
					}),
					(p.Annot.prototype.getUniqueID = function () {
						return p
							.sendWithPromise('Annot.getUniqueID', { annot: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Annot.prototype.setUniqueID = function (e) {
						f(arguments.length, 1, 'setUniqueID', '(ArrayBuffer|TypedArray)', [
							[e, 'ArrayBuffer'],
						]);
						var t = b(e, !1);
						return p.sendWithPromise('Annot.setUniqueID', {
							annot: this.id,
							id_buf: t,
						});
					}),
					(p.Annot.prototype.getDate = function () {
						return p
							.sendWithPromise('Annot.getDate', { annot: this.id })
							.then(function (e) {
								return new p.Date(e);
							});
					}),
					(p.Annot.prototype.setDate = function (e) {
						return (
							f(arguments.length, 1, 'setDate', '(PDFNet.Date)', [
								[e, 'Structure', p.Date, 'Date'],
							]),
							F('setDate', [[e, 0]]),
							p.sendWithPromise('Annot.setDate', { annot: this.id, date: e })
						);
					}),
					(p.Annot.prototype.getFlag = function (e) {
						return (
							f(arguments.length, 1, 'getFlag', '(number)', [[e, 'number']]),
							p.sendWithPromise('Annot.getFlag', { annot: this.id, flag: e })
						);
					}),
					(p.Annot.prototype.setFlag = function (e, t) {
						return (
							f(arguments.length, 2, 'setFlag', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('Annot.setFlag', {
								annot: this.id,
								flag: e,
								value: t,
							})
						);
					}),
					(p.AnnotBorderStyle.create = function (e, t, n, i) {
						return (
							void 0 === n && (n = 0),
							void 0 === i && (i = 0),
							f(
								arguments.length,
								2,
								'create',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('annotBorderStyleCreate', {
									s: e,
									b_width: t,
									b_hr: n,
									b_vr: i,
								})
								.then(function (e) {
									return y(p.AnnotBorderStyle, e);
								})
						);
					}),
					(p.AnnotBorderStyle.createWithDashPattern = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'createWithDashPattern',
								'(number, number, number, number, Array<number>)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'Array'],
								]
							),
							p
								.sendWithPromise('annotBorderStyleCreateWithDashPattern', {
									s: e,
									b_width: t,
									b_hr: n,
									b_vr: i,
									b_dash_list: r,
								})
								.then(function (e) {
									return y(p.AnnotBorderStyle, e);
								})
						);
					}),
					(p.AnnotBorderStyle.prototype.copy = function () {
						return p
							.sendWithPromise('AnnotBorderStyle.copy', { bs: this.id })
							.then(function (e) {
								return y(p.AnnotBorderStyle, e);
							});
					}),
					(p.AnnotBorderStyle.prototype.getStyle = function () {
						return p.sendWithPromise('AnnotBorderStyle.getStyle', {
							bs: this.id,
						});
					}),
					(p.AnnotBorderStyle.prototype.setStyle = function (e) {
						return (
							f(arguments.length, 1, 'setStyle', '(number)', [[e, 'number']]),
							p.sendWithPromise('AnnotBorderStyle.setStyle', {
								bs: this.id,
								style: e,
							})
						);
					}),
					(p.Annot.prototype.getAppearance = function (e, t) {
						return (
							void 0 === e && (e = p.Annot.State.e_normal),
							void 0 === t && (t = null),
							f(arguments.length, 0, 'getAppearance', '(number, string)', [
								[e, 'number'],
								[t, 'const char* = 0'],
							]),
							p
								.sendWithPromise('Annot.getAppearance', {
									annot: this.id,
									annot_state: e,
									app_state: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Annot.prototype.setAppearance = function (e, t, n) {
						return (
							void 0 === t && (t = p.Annot.State.e_normal),
							void 0 === n && (n = null),
							f(
								arguments.length,
								1,
								'setAppearance',
								'(PDFNet.Obj, number, string)',
								[
									[e, 'Object', p.Obj, 'Obj'],
									[t, 'number'],
									[n, 'const char* = 0'],
								]
							),
							p.sendWithPromise('Annot.setAppearance', {
								annot: this.id,
								app_stream: e.id,
								annot_state: t,
								app_state: n,
							})
						);
					}),
					(p.Annot.prototype.removeAppearance = function (e, t) {
						return (
							void 0 === e && (e = p.Annot.State.e_normal),
							void 0 === t && (t = null),
							f(arguments.length, 0, 'removeAppearance', '(number, string)', [
								[e, 'number'],
								[t, 'const char* = 0'],
							]),
							p.sendWithPromise('Annot.removeAppearance', {
								annot: this.id,
								annot_state: e,
								app_state: t,
							})
						);
					}),
					(p.Annot.prototype.flatten = function (e) {
						return (
							f(arguments.length, 1, 'flatten', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('Annot.flatten', { annot: this.id, page: e.id })
						);
					}),
					(p.Annot.prototype.getActiveAppearanceState = function () {
						return p.sendWithPromise('Annot.getActiveAppearanceState', {
							annot: this.id,
						});
					}),
					(p.Annot.prototype.setActiveAppearanceState = function (e) {
						return (
							f(arguments.length, 1, 'setActiveAppearanceState', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Annot.setActiveAppearanceState', {
								annot: this.id,
								astate: e,
							})
						);
					}),
					(p.Annot.prototype.getColor = function () {
						return p
							.sendWithPromise('Annot.getColor', { annot: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.Annot.prototype.getColorAsRGB = function () {
						return p
							.sendWithPromise('Annot.getColorAsRGB', { annot: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.Annot.prototype.getColorAsCMYK = function () {
						return p
							.sendWithPromise('Annot.getColorAsCMYK', { annot: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.Annot.prototype.getColorAsGray = function () {
						return p
							.sendWithPromise('Annot.getColorAsGray', { annot: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.Annot.prototype.getColorCompNum = function () {
						return p.sendWithPromise('Annot.getColorCompNum', {
							annot: this.id,
						});
					}),
					(p.Annot.prototype.setColorDefault = function (e) {
						return (
							f(arguments.length, 1, 'setColorDefault', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p.sendWithPromise('Annot.setColorDefault', {
								annot: this.id,
								col: e.id,
							})
						);
					}),
					(p.Annot.prototype.setColor = function (e, t) {
						return (
							void 0 === t && (t = 3),
							f(arguments.length, 1, 'setColor', '(PDFNet.ColorPt, number)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
								[t, 'number'],
							]),
							p.sendWithPromise('Annot.setColor', {
								annot: this.id,
								col: e.id,
								numcomp: t,
							})
						);
					}),
					(p.Annot.prototype.getStructParent = function () {
						return p.sendWithPromise('Annot.getStructParent', {
							annot: this.id,
						});
					}),
					(p.Annot.prototype.setStructParent = function (e) {
						return (
							f(arguments.length, 1, 'setStructParent', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Annot.setStructParent', {
								annot: this.id,
								parkeyval: e,
							})
						);
					}),
					(p.Annot.prototype.getOptionalContent = function () {
						return p
							.sendWithPromise('Annot.getOptionalContent', { annot: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Annot.prototype.setOptionalContent = function (e) {
						return (
							f(arguments.length, 1, 'setOptionalContent', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('Annot.setOptionalContent', {
								annot: this.id,
								content: e.id,
							})
						);
					}),
					(p.Annot.prototype.refreshAppearance = function () {
						return p.sendWithPromise('Annot.refreshAppearance', {
							annot: this.id,
						});
					}),
					(p.Annot.prototype.refreshAppearanceRefreshOptions = function (e) {
						return (
							void 0 === e && (e = null),
							f(
								arguments.length,
								0,
								'refreshAppearanceRefreshOptions',
								'(PDFNet.OptionBase)',
								[[e, 'OptionBase']]
							),
							F('refreshAppearanceRefreshOptions', [[e, 0]]),
							(e = e ? e.getJsonString() : '{}'),
							p.sendWithPromise('Annot.refreshAppearanceRefreshOptions', {
								annot: this.id,
								options: e,
							})
						);
					}),
					(p.Annot.prototype.getRotation = function () {
						return p.sendWithPromise('Annot.getRotation', { annot: this.id });
					}),
					(p.Annot.prototype.setRotation = function (e) {
						return (
							f(arguments.length, 1, 'setRotation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Annot.setRotation', {
								annot: this.id,
								angle: e,
							})
						);
					}),
					(p.AnnotBorderStyle.prototype.getWidth = function () {
						return p.sendWithPromise('AnnotBorderStyle.getWidth', {
							bs: this.id,
						});
					}),
					(p.AnnotBorderStyle.prototype.setWidth = function (e) {
						return (
							f(arguments.length, 1, 'setWidth', '(number)', [[e, 'number']]),
							p.sendWithPromise('AnnotBorderStyle.setWidth', {
								bs: this.id,
								width: e,
							})
						);
					}),
					(p.AnnotBorderStyle.prototype.getHR = function () {
						return p.sendWithPromise('AnnotBorderStyle.getHR', { bs: this.id });
					}),
					(p.AnnotBorderStyle.prototype.setHR = function (e) {
						return (
							f(arguments.length, 1, 'setHR', '(number)', [[e, 'number']]),
							p.sendWithPromise('AnnotBorderStyle.setHR', {
								bs: this.id,
								horizontal_radius: e,
							})
						);
					}),
					(p.AnnotBorderStyle.prototype.getVR = function () {
						return p.sendWithPromise('AnnotBorderStyle.getVR', { bs: this.id });
					}),
					(p.AnnotBorderStyle.prototype.setVR = function (e) {
						return (
							f(arguments.length, 1, 'setVR', '(number)', [[e, 'number']]),
							p.sendWithPromise('AnnotBorderStyle.setVR', {
								bs: this.id,
								vertical_radius: e,
							})
						);
					}),
					(p.AnnotBorderStyle.prototype.getDashPattern = function () {
						return p
							.sendWithPromise('AnnotBorderStyle.getDashPattern', {
								bs: this.id,
							})
							.then(function (e) {
								return new Float64Array(e);
							});
					}),
					(p.Annot.prototype.getBorderStyle = function () {
						return p
							.sendWithPromise('Annot.getBorderStyle', { annot: this.id })
							.then(function (e) {
								return y(p.AnnotBorderStyle, e);
							});
					}),
					(p.Annot.prototype.setBorderStyle = function (e, t) {
						return (
							void 0 === t && (t = !1),
							f(
								arguments.length,
								1,
								'setBorderStyle',
								'(PDFNet.AnnotBorderStyle, boolean)',
								[
									[e, 'Object', p.AnnotBorderStyle, 'AnnotBorderStyle'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('Annot.setBorderStyle', {
								annot: this.id,
								bs: e.id,
								oldStyleOnly: t,
							})
						);
					}),
					(p.Annot.getBorderStyleStyle = function (e) {
						return (
							f(
								arguments.length,
								1,
								'getBorderStyleStyle',
								'(PDFNet.AnnotBorderStyle)',
								[[e, 'Object', p.AnnotBorderStyle, 'AnnotBorderStyle']]
							),
							p.sendWithPromise('annotGetBorderStyleStyle', { bs: e.id })
						);
					}),
					(p.Annot.setBorderStyleStyle = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setBorderStyleStyle',
								'(PDFNet.AnnotBorderStyle, number)',
								[
									[e, 'Object', p.AnnotBorderStyle, 'AnnotBorderStyle'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('annotSetBorderStyleStyle', {
								bs: e.id,
								bst: t,
							})
						);
					}),
					(p.AnnotBorderStyle.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.AnnotBorderStyle)', [
								[e, 'Object', p.AnnotBorderStyle, 'AnnotBorderStyle'],
							]),
							p.sendWithPromise('AnnotBorderStyle.compare', {
								a: this.id,
								b: e.id,
							})
						);
					}),
					(p.CaretAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('caretAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.CaretAnnot, e);
								})
						);
					}),
					(p.CaretAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('caretAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.CaretAnnot, e);
								})
						);
					}),
					(p.CaretAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('caretAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.CaretAnnot, e);
								})
						);
					}),
					(p.CaretAnnot.prototype.getSymbol = function () {
						return p.sendWithPromise('CaretAnnot.getSymbol', {
							caret: this.id,
						});
					}),
					(p.CaretAnnot.prototype.setSymbol = function (e) {
						return (
							f(arguments.length, 1, 'setSymbol', '(string)', [[e, 'string']]),
							p.sendWithPromise('CaretAnnot.setSymbol', {
								caret: this.id,
								symbol: e,
							})
						);
					}),
					(p.LineAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('lineAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.LineAnnot, e);
								})
						);
					}),
					(p.LineAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('lineAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.LineAnnot, e);
								})
						);
					}),
					(p.LineAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('lineAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.LineAnnot, e);
								})
						);
					}),
					(p.LineAnnot.prototype.getStartPoint = function () {
						return p.sendWithPromise('LineAnnot.getStartPoint', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setStartPoint = function (e) {
						return (
							f(arguments.length, 1, 'setStartPoint', '(PDFNet.Point)', [
								[e, 'Structure', p.Point, 'Point'],
							]),
							F('setStartPoint', [[e, 0]]),
							p.sendWithPromise('LineAnnot.setStartPoint', {
								line: this.id,
								sp: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getEndPoint = function () {
						return p.sendWithPromise('LineAnnot.getEndPoint', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setEndPoint = function (e) {
						return (
							f(arguments.length, 1, 'setEndPoint', '(PDFNet.Point)', [
								[e, 'Structure', p.Point, 'Point'],
							]),
							F('setEndPoint', [[e, 0]]),
							p.sendWithPromise('LineAnnot.setEndPoint', {
								line: this.id,
								ep: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getStartStyle = function () {
						return p.sendWithPromise('LineAnnot.getStartStyle', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setStartStyle = function (e) {
						return (
							f(arguments.length, 1, 'setStartStyle', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setStartStyle', {
								line: this.id,
								ss: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getEndStyle = function () {
						return p.sendWithPromise('LineAnnot.getEndStyle', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setEndStyle = function (e) {
						return (
							f(arguments.length, 1, 'setEndStyle', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setEndStyle', {
								line: this.id,
								es: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getLeaderLineLength = function () {
						return p.sendWithPromise('LineAnnot.getLeaderLineLength', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setLeaderLineLength = function (e) {
						return (
							f(arguments.length, 1, 'setLeaderLineLength', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setLeaderLineLength', {
								line: this.id,
								length: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getLeaderLineExtensionLength = function () {
						return p.sendWithPromise('LineAnnot.getLeaderLineExtensionLength', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setLeaderLineExtensionLength = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setLeaderLineExtensionLength',
								'(number)',
								[[e, 'number']]
							),
							p.sendWithPromise('LineAnnot.setLeaderLineExtensionLength', {
								line: this.id,
								length: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getShowCaption = function () {
						return p.sendWithPromise('LineAnnot.getShowCaption', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setShowCaption = function (e) {
						return (
							f(arguments.length, 1, 'setShowCaption', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('LineAnnot.setShowCaption', {
								line: this.id,
								showCaption: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getIntentType = function () {
						return p.sendWithPromise('LineAnnot.getIntentType', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setIntentType = function (e) {
						return (
							f(arguments.length, 1, 'setIntentType', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setIntentType', {
								line: this.id,
								it: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getCapPos = function () {
						return p.sendWithPromise('LineAnnot.getCapPos', { line: this.id });
					}),
					(p.LineAnnot.prototype.setCapPos = function (e) {
						return (
							f(arguments.length, 1, 'setCapPos', '(number)', [[e, 'number']]),
							p.sendWithPromise('LineAnnot.setCapPos', { line: this.id, it: e })
						);
					}),
					(p.LineAnnot.prototype.getLeaderLineOffset = function () {
						return p.sendWithPromise('LineAnnot.getLeaderLineOffset', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setLeaderLineOffset = function (e) {
						return (
							f(arguments.length, 1, 'setLeaderLineOffset', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setLeaderLineOffset', {
								line: this.id,
								length: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getTextHOffset = function () {
						return p.sendWithPromise('LineAnnot.getTextHOffset', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setTextHOffset = function (e) {
						return (
							f(arguments.length, 1, 'setTextHOffset', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setTextHOffset', {
								line: this.id,
								offset: e,
							})
						);
					}),
					(p.LineAnnot.prototype.getTextVOffset = function () {
						return p.sendWithPromise('LineAnnot.getTextVOffset', {
							line: this.id,
						});
					}),
					(p.LineAnnot.prototype.setTextVOffset = function (e) {
						return (
							f(arguments.length, 1, 'setTextVOffset', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LineAnnot.setTextVOffset', {
								line: this.id,
								offset: e,
							})
						);
					}),
					(p.CircleAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('circleAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.CircleAnnot, e);
								})
						);
					}),
					(p.CircleAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('circleAnnotCreateFromAnnot', { circle: e.id })
								.then(function (e) {
									return D(p.CircleAnnot, e);
								})
						);
					}),
					(p.CircleAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('circleAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.CircleAnnot, e);
								})
						);
					}),
					(p.CircleAnnot.prototype.getInteriorColor = function () {
						return p
							.sendWithPromise('CircleAnnot.getInteriorColor', {
								circle: this.id,
							})
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.CircleAnnot.prototype.getInteriorColorCompNum = function () {
						return p.sendWithPromise('CircleAnnot.getInteriorColorCompNum', {
							circle: this.id,
						});
					}),
					(p.CircleAnnot.prototype.setInteriorColorDefault = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setInteriorColorDefault',
								'(PDFNet.ColorPt)',
								[[e, 'Object', p.ColorPt, 'ColorPt']]
							),
							p.sendWithPromise('CircleAnnot.setInteriorColorDefault', {
								circle: this.id,
								col: e.id,
							})
						);
					}),
					(p.CircleAnnot.prototype.setInteriorColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setInteriorColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('CircleAnnot.setInteriorColor', {
								circle: this.id,
								col: e.id,
								numcomp: t,
							})
						);
					}),
					(p.CircleAnnot.prototype.getContentRect = function () {
						return p
							.sendWithPromise('CircleAnnot.getContentRect', {
								circle: this.id,
							})
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.CircleAnnot.prototype.setContentRect = function (e) {
						return (
							f(arguments.length, 1, 'setContentRect', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setContentRect', [[e, 0]]),
							p.sendWithPromise('CircleAnnot.setContentRect', {
								circle: this.id,
								cr: e,
							})
						);
					}),
					(p.CircleAnnot.prototype.getPadding = function () {
						return p
							.sendWithPromise('CircleAnnot.getPadding', { circle: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.CircleAnnot.prototype.setPadding = function (e) {
						return (
							f(arguments.length, 1, 'setPadding', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setPadding', [[e, 0]]),
							p.sendWithPromise('CircleAnnot.setPadding', {
								circle: this.id,
								cr: e,
							})
						);
					}),
					(p.FileAttachmentAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('fileAttachmentAnnotCreateFromObj', {
									d: e.id,
								})
								.then(function (e) {
									return D(p.FileAttachmentAnnot, e);
								})
						);
					}),
					(p.FileAttachmentAnnot.prototype.export = function (e) {
						return (
							void 0 === e && (e = ''),
							f(arguments.length, 0, 'export', '(string)', [[e, 'string']]),
							p.sendWithPromise('FileAttachmentAnnot.export', {
								fileatt: this.id,
								save_as: e,
							})
						);
					}),
					(p.FileAttachmentAnnot.prototype.createFromAnnot = function () {
						return p
							.sendWithPromise('FileAttachmentAnnot.createFromAnnot', {
								fileatt: this.id,
							})
							.then(function (e) {
								return D(p.Annot, e);
							});
					}),
					(p.FileAttachmentAnnot.createWithFileSpec = function (e, t, n, i) {
						return (
							void 0 === i && (i = p.FileAttachmentAnnot.Icon.e_PushPin),
							f(
								arguments.length,
								3,
								'createWithFileSpec',
								'(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.FileSpec, number)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Object', p.FileSpec, 'FileSpec'],
									[i, 'number'],
								]
							),
							F('createWithFileSpec', [[t, 1]]),
							p
								.sendWithPromise('fileAttachmentAnnotCreateWithFileSpec', {
									doc: e.id,
									pos: t,
									fs: n.id,
									icon_name: i,
								})
								.then(function (e) {
									return D(p.FileAttachmentAnnot, e);
								})
						);
					}),
					(p.FileAttachmentAnnot.createDefault = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createDefault',
								'(PDFNet.SDFDoc, PDFNet.Rect, string)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('createDefault', [[t, 1]]),
							p
								.sendWithPromise('fileAttachmentAnnotCreateDefault', {
									doc: e.id,
									pos: t,
									path: n,
								})
								.then(function (e) {
									return D(p.FileAttachmentAnnot, e);
								})
						);
					}),
					(p.FileAttachmentAnnot.prototype.getFileSpec = function () {
						return p
							.sendWithPromise('FileAttachmentAnnot.getFileSpec', {
								fileatt: this.id,
							})
							.then(function (e) {
								return D(p.FileSpec, e);
							});
					}),
					(p.FileAttachmentAnnot.prototype.setFileSpec = function (e) {
						return (
							f(arguments.length, 1, 'setFileSpec', '(PDFNet.FileSpec)', [
								[e, 'Object', p.FileSpec, 'FileSpec'],
							]),
							p.sendWithPromise('FileAttachmentAnnot.setFileSpec', {
								fileatt: this.id,
								file: e.id,
							})
						);
					}),
					(p.FileAttachmentAnnot.prototype.getIcon = function () {
						return p.sendWithPromise('FileAttachmentAnnot.getIcon', {
							fileatt: this.id,
						});
					}),
					(p.FileAttachmentAnnot.prototype.setIcon = function (e) {
						return (
							void 0 === e && (e = p.FileAttachmentAnnot.Icon.e_PushPin),
							f(arguments.length, 0, 'setIcon', '(number)', [[e, 'number']]),
							p.sendWithPromise('FileAttachmentAnnot.setIcon', {
								fileatt: this.id,
								type: e,
							})
						);
					}),
					(p.FileAttachmentAnnot.prototype.getIconName = function () {
						return p.sendWithPromise('FileAttachmentAnnot.getIconName', {
							fileatt: this.id,
						});
					}),
					(p.FileAttachmentAnnot.prototype.setIconName = function (e) {
						return (
							f(arguments.length, 1, 'setIconName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FileAttachmentAnnot.setIconName', {
								fileatt: this.id,
								iname: e,
							})
						);
					}),
					(p.FreeTextAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('freeTextAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.FreeTextAnnot, e);
								})
						);
					}),
					(p.FreeTextAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('freeTextAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.FreeTextAnnot, e);
								})
						);
					}),
					(p.FreeTextAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('freeTextAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.FreeTextAnnot, e);
								})
						);
					}),
					(p.FreeTextAnnot.prototype.getDefaultAppearance = function () {
						return p.sendWithPromise('FreeTextAnnot.getDefaultAppearance', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.setDefaultAppearance = function (e) {
						return (
							f(arguments.length, 1, 'setDefaultAppearance', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FreeTextAnnot.setDefaultAppearance', {
								ft: this.id,
								app_str: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getQuaddingFormat = function () {
						return p.sendWithPromise('FreeTextAnnot.getQuaddingFormat', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.setQuaddingFormat = function (e) {
						return (
							f(arguments.length, 1, 'setQuaddingFormat', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FreeTextAnnot.setQuaddingFormat', {
								ft: this.id,
								format: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getCalloutLinePoints = function () {
						return p.sendWithPromise('FreeTextAnnot.getCalloutLinePoints', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.setCalloutLinePoints = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'setCalloutLinePoints',
								'(PDFNet.Point, PDFNet.Point, PDFNet.Point)',
								[
									[e, 'Structure', p.Point, 'Point'],
									[t, 'Structure', p.Point, 'Point'],
									[n, 'Structure', p.Point, 'Point'],
								]
							),
							F('setCalloutLinePoints', [
								[e, 0],
								[t, 1],
								[n, 2],
							]),
							p.sendWithPromise('FreeTextAnnot.setCalloutLinePoints', {
								ft: this.id,
								p1: e,
								p2: t,
								p3: n,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.setCalloutLinePointsTwo = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setCalloutLinePointsTwo',
								'(PDFNet.Point, PDFNet.Point)',
								[
									[e, 'Structure', p.Point, 'Point'],
									[t, 'Structure', p.Point, 'Point'],
								]
							),
							F('setCalloutLinePointsTwo', [
								[e, 0],
								[t, 1],
							]),
							p.sendWithPromise('FreeTextAnnot.setCalloutLinePointsTwo', {
								ft: this.id,
								p1: e,
								p2: t,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getIntentName = function () {
						return p.sendWithPromise('FreeTextAnnot.getIntentName', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.setIntentName = function (e) {
						return (
							void 0 === e && (e = p.FreeTextAnnot.IntentName.e_FreeText),
							f(arguments.length, 0, 'setIntentName', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FreeTextAnnot.setIntentName', {
								ft: this.id,
								mode: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.setIntentNameDefault = function () {
						return p.sendWithPromise('FreeTextAnnot.setIntentNameDefault', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.getEndingStyle = function () {
						return p.sendWithPromise('FreeTextAnnot.getEndingStyle', {
							ft: this.id,
						});
					}),
					(p.FreeTextAnnot.prototype.setEndingStyle = function (e) {
						return (
							f(arguments.length, 1, 'setEndingStyle', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FreeTextAnnot.setEndingStyle', {
								ft: this.id,
								style: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.setEndingStyleName = function (e) {
						return (
							f(arguments.length, 1, 'setEndingStyleName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FreeTextAnnot.setEndingStyleName', {
								ft: this.id,
								est: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.setTextColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setTextColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('FreeTextAnnot.setTextColor', {
								ft: this.id,
								color: e.id,
								col_comp: t,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getTextColor = function () {
						return p
							.sendWithPromise('FreeTextAnnot.getTextColor', { ft: this.id })
							.then(function (e) {
								return (e.color = y(p.ColorPt, e.color)), e;
							});
					}),
					(p.FreeTextAnnot.prototype.setLineColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setLineColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('FreeTextAnnot.setLineColor', {
								ft: this.id,
								color: e.id,
								col_comp: t,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getLineColor = function () {
						return p
							.sendWithPromise('FreeTextAnnot.getLineColor', { ft: this.id })
							.then(function (e) {
								return (e.color = y(p.ColorPt, e.color)), e;
							});
					}),
					(p.FreeTextAnnot.prototype.setFontName = function (e) {
						return (
							f(arguments.length, 1, 'setFontName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('FreeTextAnnot.setFontName', {
								ft: this.id,
								fontName: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.setFontSize = function (e) {
						return (
							f(arguments.length, 1, 'setFontSize', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('FreeTextAnnot.setFontSize', {
								ft: this.id,
								font_size: e,
							})
						);
					}),
					(p.FreeTextAnnot.prototype.getFontSize = function () {
						return p.sendWithPromise('FreeTextAnnot.getFontSize', {
							ft: this.id,
						});
					}),
					(p.HighlightAnnot.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('highlightAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.HighlightAnnot, e);
								})
						);
					}),
					(p.HighlightAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('highlightAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.HighlightAnnot, e);
								})
						);
					}),
					(p.HighlightAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('highlightAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.HighlightAnnot, e);
								})
						);
					}),
					(p.InkAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('inkAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.InkAnnot, e);
								})
						);
					}),
					(p.InkAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('inkAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.InkAnnot, e);
								})
						);
					}),
					(p.InkAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('inkAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.InkAnnot, e);
								})
						);
					}),
					(p.InkAnnot.prototype.getPathCount = function () {
						return p.sendWithPromise('InkAnnot.getPathCount', { ink: this.id });
					}),
					(p.InkAnnot.prototype.getPointCount = function (e) {
						return (
							f(arguments.length, 1, 'getPointCount', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('InkAnnot.getPointCount', {
								ink: this.id,
								pathindex: e,
							})
						);
					}),
					(p.InkAnnot.prototype.getPoint = function (e, t) {
						return (
							f(arguments.length, 2, 'getPoint', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('InkAnnot.getPoint', {
								ink: this.id,
								pathindex: e,
								pointindex: t,
							})
						);
					}),
					(p.InkAnnot.prototype.setPoint = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'setPoint',
								'(number, number, PDFNet.Point)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'Structure', p.Point, 'Point'],
								]
							),
							F('setPoint', [[n, 2]]),
							p.sendWithPromise('InkAnnot.setPoint', {
								ink: this.id,
								pathindex: e,
								pointindex: t,
								pt: n,
							})
						);
					}),
					(p.InkAnnot.prototype.erase = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'erase',
								'(PDFNet.Point, PDFNet.Point, number)',
								[
									[e, 'Structure', p.Point, 'Point'],
									[t, 'Structure', p.Point, 'Point'],
									[n, 'number'],
								]
							),
							F('erase', [
								[e, 0],
								[t, 1],
							]),
							p.sendWithPromise('InkAnnot.erase', {
								ink: this.id,
								pt1: e,
								pt2: t,
								width: n,
							})
						);
					}),
					(p.InkAnnot.prototype.getHighlightIntent = function () {
						return p.sendWithPromise('InkAnnot.getHighlightIntent', {
							ink: this.id,
						});
					}),
					(p.InkAnnot.prototype.setHighlightIntent = function (e) {
						return (
							f(arguments.length, 1, 'setHighlightIntent', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('InkAnnot.setHighlightIntent', {
								ink: this.id,
								highlight: e,
							})
						);
					}),
					(p.LinkAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('linkAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.LinkAnnot, e);
								})
						);
					}),
					(p.LinkAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('linkAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.LinkAnnot, e);
								})
						);
					}),
					(p.LinkAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('linkAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.LinkAnnot, e);
								})
						);
					}),
					(p.LinkAnnot.prototype.removeAction = function () {
						return p.sendWithPromise('LinkAnnot.removeAction', {
							link: this.id,
						});
					}),
					(p.LinkAnnot.prototype.getAction = function () {
						return p
							.sendWithPromise('LinkAnnot.getAction', { link: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.LinkAnnot.prototype.setAction = function (e) {
						return (
							f(arguments.length, 1, 'setAction', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('LinkAnnot.setAction', {
								link: this.id,
								action: e.id,
							})
						);
					}),
					(p.LinkAnnot.prototype.getHighlightingMode = function () {
						return p.sendWithPromise('LinkAnnot.getHighlightingMode', {
							link: this.id,
						});
					}),
					(p.LinkAnnot.prototype.setHighlightingMode = function (e) {
						return (
							f(arguments.length, 1, 'setHighlightingMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LinkAnnot.setHighlightingMode', {
								link: this.id,
								value: e,
							})
						);
					}),
					(p.LinkAnnot.prototype.getQuadPointCount = function () {
						return p.sendWithPromise('LinkAnnot.getQuadPointCount', {
							link: this.id,
						});
					}),
					(p.LinkAnnot.prototype.getQuadPoint = function (e) {
						return (
							f(arguments.length, 1, 'getQuadPoint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('LinkAnnot.getQuadPoint', {
								link: this.id,
								idx: e,
							})
						);
					}),
					(p.LinkAnnot.prototype.setQuadPoint = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setQuadPoint',
								'(number, PDFNet.QuadPoint)',
								[
									[e, 'number'],
									[t, 'Structure', p.QuadPoint, 'QuadPoint'],
								]
							),
							F('setQuadPoint', [[t, 1]]),
							p.sendWithPromise('LinkAnnot.setQuadPoint', {
								link: this.id,
								idx: e,
								qp: t,
							})
						);
					}),
					(p.getNormalizedUrl = function (e) {
						return (
							f(arguments.length, 1, 'getNormalizedUrl', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('getNormalizedUrl', { url: e })
						);
					}),
					(p.MarkupAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('markupAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.MarkupAnnot, e);
								})
						);
					}),
					(p.MarkupAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('markupAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.MarkupAnnot, e);
								})
						);
					}),
					(p.MarkupAnnot.prototype.getTitle = function () {
						return p.sendWithPromise('MarkupAnnot.getTitle', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setTitle = function (e) {
						return (
							f(arguments.length, 1, 'setTitle', '(string)', [[e, 'string']]),
							p.sendWithPromise('MarkupAnnot.setTitle', {
								markup: this.id,
								title: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.setTitleUString = function (e) {
						return (
							f(arguments.length, 1, 'setTitleUString', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('MarkupAnnot.setTitleUString', {
								markup: this.id,
								title: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getPopup = function () {
						return p
							.sendWithPromise('MarkupAnnot.getPopup', { markup: this.id })
							.then(function (e) {
								return D(p.Annot, e);
							});
					}),
					(p.MarkupAnnot.prototype.setPopup = function (e) {
						return (
							f(arguments.length, 1, 'setPopup', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('MarkupAnnot.setPopup', {
								markup: this.id,
								ppup: e.id,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getOpacity = function () {
						return p.sendWithPromise('MarkupAnnot.getOpacity', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setOpacity = function (e) {
						return (
							f(arguments.length, 1, 'setOpacity', '(number)', [[e, 'number']]),
							p.sendWithPromise('MarkupAnnot.setOpacity', {
								markup: this.id,
								op: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getSubject = function () {
						return p.sendWithPromise('MarkupAnnot.getSubject', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setSubject = function (e) {
						return (
							f(arguments.length, 1, 'setSubject', '(string)', [[e, 'string']]),
							p.sendWithPromise('MarkupAnnot.setSubject', {
								markup: this.id,
								contents: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getCreationDates = function () {
						return p
							.sendWithPromise('MarkupAnnot.getCreationDates', {
								markup: this.id,
							})
							.then(function (e) {
								return new p.Date(e);
							});
					}),
					(p.MarkupAnnot.prototype.getBorderEffect = function () {
						return p.sendWithPromise('MarkupAnnot.getBorderEffect', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setBorderEffect = function (e) {
						return (
							void 0 === e && (e = p.MarkupAnnot.BorderEffect.e_None),
							f(arguments.length, 0, 'setBorderEffect', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('MarkupAnnot.setBorderEffect', {
								markup: this.id,
								effect: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getBorderEffectIntensity = function () {
						return p.sendWithPromise('MarkupAnnot.getBorderEffectIntensity', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setBorderEffectIntensity = function (e) {
						return (
							void 0 === e && (e = 0),
							f(arguments.length, 0, 'setBorderEffectIntensity', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('MarkupAnnot.setBorderEffectIntensity', {
								markup: this.id,
								intensity: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.setCreationDates = function (e) {
						return (
							f(arguments.length, 1, 'setCreationDates', '(PDFNet.Date)', [
								[e, 'Structure', p.Date, 'Date'],
							]),
							F('setCreationDates', [[e, 0]]),
							p.sendWithPromise('MarkupAnnot.setCreationDates', {
								markup: this.id,
								dt: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getInteriorColor = function () {
						return p
							.sendWithPromise('MarkupAnnot.getInteriorColor', {
								markup: this.id,
							})
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.MarkupAnnot.prototype.getInteriorColorCompNum = function () {
						return p.sendWithPromise('MarkupAnnot.getInteriorColorCompNum', {
							markup: this.id,
						});
					}),
					(p.MarkupAnnot.prototype.setInteriorColorRGB = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setInteriorColorRGB',
								'(PDFNet.ColorPt)',
								[[e, 'Object', p.ColorPt, 'ColorPt']]
							),
							p.sendWithPromise('MarkupAnnot.setInteriorColorRGB', {
								markup: this.id,
								col: e.id,
							})
						);
					}),
					(p.MarkupAnnot.prototype.setInteriorColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setInteriorColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('MarkupAnnot.setInteriorColor', {
								markup: this.id,
								c: e.id,
								CompNum: t,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getContentRect = function () {
						return p
							.sendWithPromise('MarkupAnnot.getContentRect', {
								markup: this.id,
							})
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.MarkupAnnot.prototype.setContentRect = function (e) {
						return (
							f(arguments.length, 1, 'setContentRect', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setContentRect', [[e, 0]]),
							p.sendWithPromise('MarkupAnnot.setContentRect', {
								markup: this.id,
								cr: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.getPadding = function () {
						return p
							.sendWithPromise('MarkupAnnot.getPadding', { markup: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.MarkupAnnot.prototype.setPadding = function (e) {
						return (
							f(arguments.length, 1, 'setPadding', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setPadding', [[e, 0]]),
							p.sendWithPromise('MarkupAnnot.setPadding', {
								markup: this.id,
								rd: e,
							})
						);
					}),
					(p.MarkupAnnot.prototype.rotateAppearance = function (e) {
						return (
							f(arguments.length, 1, 'rotateAppearance', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('MarkupAnnot.rotateAppearance', {
								markup: this.id,
								angle: e,
							})
						);
					}),
					(p.MovieAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('movieAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.MovieAnnot, e);
								})
						);
					}),
					(p.MovieAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('movieAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.MovieAnnot, e);
								})
						);
					}),
					(p.MovieAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('movieAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.MovieAnnot, e);
								})
						);
					}),
					(p.MovieAnnot.prototype.getTitle = function () {
						return p.sendWithPromise('MovieAnnot.getTitle', { movie: this.id });
					}),
					(p.MovieAnnot.prototype.setTitle = function (e) {
						return (
							f(arguments.length, 1, 'setTitle', '(string)', [[e, 'string']]),
							p.sendWithPromise('MovieAnnot.setTitle', {
								movie: this.id,
								title: e,
							})
						);
					}),
					(p.MovieAnnot.prototype.isToBePlayed = function () {
						return p.sendWithPromise('MovieAnnot.isToBePlayed', {
							movie: this.id,
						});
					}),
					(p.MovieAnnot.prototype.setToBePlayed = function (e) {
						return (
							void 0 === e && (e = !0),
							f(arguments.length, 0, 'setToBePlayed', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('MovieAnnot.setToBePlayed', {
								movie: this.id,
								isplay: e,
							})
						);
					}),
					(p.PolyLineAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('polyLineAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.PolyLineAnnot, e);
								})
						);
					}),
					(p.PolyLineAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('polyLineAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.PolyLineAnnot, e);
								})
						);
					}),
					(p.PolyLineAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('polyLineAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.PolyLineAnnot, e);
								})
						);
					}),
					(p.PolyLineAnnot.prototype.getVertexCount = function () {
						return p.sendWithPromise('PolyLineAnnot.getVertexCount', {
							polyline: this.id,
						});
					}),
					(p.PolyLineAnnot.prototype.getVertex = function (e) {
						return (
							f(arguments.length, 1, 'getVertex', '(number)', [[e, 'number']]),
							p.sendWithPromise('PolyLineAnnot.getVertex', {
								polyline: this.id,
								idx: e,
							})
						);
					}),
					(p.PolyLineAnnot.prototype.setVertex = function (e, t) {
						return (
							f(arguments.length, 2, 'setVertex', '(number, PDFNet.Point)', [
								[e, 'number'],
								[t, 'Structure', p.Point, 'Point'],
							]),
							F('setVertex', [[t, 1]]),
							p.sendWithPromise('PolyLineAnnot.setVertex', {
								polyline: this.id,
								idx: e,
								pt: t,
							})
						);
					}),
					(p.PolyLineAnnot.prototype.getStartStyle = function () {
						return p.sendWithPromise('PolyLineAnnot.getStartStyle', {
							polyline: this.id,
						});
					}),
					(p.PolyLineAnnot.prototype.setStartStyle = function (e) {
						return (
							f(arguments.length, 1, 'setStartStyle', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PolyLineAnnot.setStartStyle', {
								polyline: this.id,
								style: e,
							})
						);
					}),
					(p.PolyLineAnnot.prototype.getEndStyle = function () {
						return p.sendWithPromise('PolyLineAnnot.getEndStyle', {
							polyline: this.id,
						});
					}),
					(p.PolyLineAnnot.prototype.setEndStyle = function (e) {
						return (
							f(arguments.length, 1, 'setEndStyle', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PolyLineAnnot.setEndStyle', {
								polyline: this.id,
								style: e,
							})
						);
					}),
					(p.PolyLineAnnot.prototype.getIntentName = function () {
						return p.sendWithPromise('PolyLineAnnot.getIntentName', {
							polyline: this.id,
						});
					}),
					(p.PolyLineAnnot.prototype.setIntentName = function (e) {
						return (
							f(arguments.length, 1, 'setIntentName', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PolyLineAnnot.setIntentName', {
								polyline: this.id,
								mode: e,
							})
						);
					}),
					(p.PolygonAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('polygonAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.PolygonAnnot, e);
								})
						);
					}),
					(p.PolygonAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('polygonAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.PolygonAnnot, e);
								})
						);
					}),
					(p.PolygonAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('polygonAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.PolygonAnnot, e);
								})
						);
					}),
					(p.PopupAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('popupAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.PopupAnnot, e);
								})
						);
					}),
					(p.PopupAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('popupAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.PopupAnnot, e);
								})
						);
					}),
					(p.PopupAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('popupAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.PopupAnnot, e);
								})
						);
					}),
					(p.PopupAnnot.prototype.getParent = function () {
						return p
							.sendWithPromise('PopupAnnot.getParent', { popup: this.id })
							.then(function (e) {
								return D(p.Annot, e);
							});
					}),
					(p.PopupAnnot.prototype.setParent = function (e) {
						return (
							f(arguments.length, 1, 'setParent', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('PopupAnnot.setParent', {
								popup: this.id,
								parent: e.id,
							})
						);
					}),
					(p.PopupAnnot.prototype.isOpen = function () {
						return p.sendWithPromise('PopupAnnot.isOpen', { popup: this.id });
					}),
					(p.PopupAnnot.prototype.setOpen = function (e) {
						return (
							f(arguments.length, 1, 'setOpen', '(boolean)', [[e, 'boolean']]),
							p.sendWithPromise('PopupAnnot.setOpen', {
								popup: this.id,
								isopen: e,
							})
						);
					}),
					(p.RedactionAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('redactionAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.RedactionAnnot, e);
								})
						);
					}),
					(p.RedactionAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('redactionAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.RedactionAnnot, e);
								})
						);
					}),
					(p.RedactionAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('redactionAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.RedactionAnnot, e);
								})
						);
					}),
					(p.RedactionAnnot.prototype.getQuadPointCount = function () {
						return p.sendWithPromise('RedactionAnnot.getQuadPointCount', {
							redaction: this.id,
						});
					}),
					(p.RedactionAnnot.prototype.getQuadPoint = function (e) {
						return (
							f(arguments.length, 1, 'getQuadPoint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('RedactionAnnot.getQuadPoint', {
								redaction: this.id,
								idx: e,
							})
						);
					}),
					(p.RedactionAnnot.prototype.setQuadPoint = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setQuadPoint',
								'(number, PDFNet.QuadPoint)',
								[
									[e, 'number'],
									[t, 'Structure', p.QuadPoint, 'QuadPoint'],
								]
							),
							F('setQuadPoint', [[t, 1]]),
							p.sendWithPromise('RedactionAnnot.setQuadPoint', {
								redaction: this.id,
								idx: e,
								qp: t,
							})
						);
					}),
					(p.RedactionAnnot.prototype.setAppFormXO = function (e) {
						return (
							f(arguments.length, 1, 'setAppFormXO', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('RedactionAnnot.setAppFormXO', {
								redaction: this.id,
								formxo: e.id,
							})
						);
					}),
					(p.RedactionAnnot.prototype.getOverlayText = function () {
						return p.sendWithPromise('RedactionAnnot.getOverlayText', {
							redaction: this.id,
						});
					}),
					(p.RedactionAnnot.prototype.setOverlayText = function (e) {
						return (
							f(arguments.length, 1, 'setOverlayText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('RedactionAnnot.setOverlayText', {
								redaction: this.id,
								title: e,
							})
						);
					}),
					(p.RedactionAnnot.prototype.getUseRepeat = function () {
						return p.sendWithPromise('RedactionAnnot.getUseRepeat', {
							redaction: this.id,
						});
					}),
					(p.RedactionAnnot.prototype.setUseRepeat = function (e) {
						return (
							void 0 === e && (e = !1),
							f(arguments.length, 0, 'setUseRepeat', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('RedactionAnnot.setUseRepeat', {
								redaction: this.id,
								userepeat: e,
							})
						);
					}),
					(p.RedactionAnnot.prototype.getOverlayTextAppearance = function () {
						return p.sendWithPromise(
							'RedactionAnnot.getOverlayTextAppearance',
							{ redaction: this.id }
						);
					}),
					(p.RedactionAnnot.prototype.setOverlayTextAppearance = function (e) {
						return (
							f(arguments.length, 1, 'setOverlayTextAppearance', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('RedactionAnnot.setOverlayTextAppearance', {
								redaction: this.id,
								app: e,
							})
						);
					}),
					(p.RedactionAnnot.prototype.getQuadForm = function () {
						return p.sendWithPromise('RedactionAnnot.getQuadForm', {
							redaction: this.id,
						});
					}),
					(p.RedactionAnnot.prototype.setQuadForm = function (e) {
						return (
							void 0 === e && (e = p.RedactionAnnot.QuadForm.e_LeftJustified),
							f(arguments.length, 0, 'setQuadForm', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('RedactionAnnot.setQuadForm', {
								redaction: this.id,
								form: e,
							})
						);
					}),
					(p.RedactionAnnot.prototype.getAppFormXO = function () {
						return p
							.sendWithPromise('RedactionAnnot.getAppFormXO', {
								redaction: this.id,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.RubberStampAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('rubberStampAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.RubberStampAnnot, e);
								})
						);
					}),
					(p.RubberStampAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('rubberStampAnnotCreateFromAnnot', {
									ann: e.id,
								})
								.then(function (e) {
									return D(p.RubberStampAnnot, e);
								})
						);
					}),
					(p.RubberStampAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('rubberStampAnnotCreate', {
									doc: e.id,
									pos: t,
								})
								.then(function (e) {
									return D(p.RubberStampAnnot, e);
								})
						);
					}),
					(p.RubberStampAnnot.createCustom = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createCustom',
								'(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							),
							F('createCustom', [[t, 1]]),
							p
								.sendWithPromise('rubberStampAnnotCreateCustom', {
									doc: e.id,
									pos: t,
									form_xobject: n.id,
								})
								.then(function (e) {
									return D(p.RubberStampAnnot, e);
								})
						);
					}),
					(p.RubberStampAnnot.prototype.getIcon = function () {
						return p.sendWithPromise('RubberStampAnnot.getIcon', {
							stamp: this.id,
						});
					}),
					(p.RubberStampAnnot.prototype.setIcon = function (e) {
						return (
							void 0 === e && (e = p.RubberStampAnnot.Icon.e_Draft),
							f(arguments.length, 0, 'setIcon', '(number)', [[e, 'number']]),
							p.sendWithPromise('RubberStampAnnot.setIcon', {
								stamp: this.id,
								type: e,
							})
						);
					}),
					(p.RubberStampAnnot.prototype.setIconDefault = function () {
						return p.sendWithPromise('RubberStampAnnot.setIconDefault', {
							stamp: this.id,
						});
					}),
					(p.RubberStampAnnot.prototype.getIconName = function () {
						return p.sendWithPromise('RubberStampAnnot.getIconName', {
							stamp: this.id,
						});
					}),
					(p.RubberStampAnnot.prototype.setIconName = function (e) {
						return (
							f(arguments.length, 1, 'setIconName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('RubberStampAnnot.setIconName', {
								stamp: this.id,
								iconstring: e,
							})
						);
					}),
					(p.ScreenAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('screenAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.ScreenAnnot, e);
								})
						);
					}),
					(p.ScreenAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('screenAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.ScreenAnnot, e);
								})
						);
					}),
					(p.ScreenAnnot.prototype.getTitle = function () {
						return p.sendWithPromise('ScreenAnnot.getTitle', { s: this.id });
					}),
					(p.ScreenAnnot.prototype.setTitle = function (e) {
						return (
							f(arguments.length, 1, 'setTitle', '(string)', [[e, 'string']]),
							p.sendWithPromise('ScreenAnnot.setTitle', {
								s: this.id,
								title: e,
							})
						);
					}),
					(p.ScreenAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('screenAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.ScreenAnnot, e);
								})
						);
					}),
					(p.ScreenAnnot.prototype.getAction = function () {
						return p
							.sendWithPromise('ScreenAnnot.getAction', { s: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.ScreenAnnot.prototype.setAction = function (e) {
						return (
							f(arguments.length, 1, 'setAction', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('ScreenAnnot.setAction', {
								s: this.id,
								action: e.id,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getBorderColor = function () {
						return p
							.sendWithPromise('ScreenAnnot.getBorderColor', { s: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.ScreenAnnot.prototype.setBorderColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setBorderColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('ScreenAnnot.setBorderColor', {
								s: this.id,
								col: e.id,
								numcomp: t,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getBorderColorCompNum = function () {
						return p.sendWithPromise('ScreenAnnot.getBorderColorCompNum', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.getBackgroundColorCompNum = function () {
						return p.sendWithPromise('ScreenAnnot.getBackgroundColorCompNum', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.getBackgroundColor = function () {
						return p
							.sendWithPromise('ScreenAnnot.getBackgroundColor', { s: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.ScreenAnnot.prototype.setBackgroundColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setBackgroundColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('ScreenAnnot.setBackgroundColor', {
								s: this.id,
								col: e.id,
								numcomp: t,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getStaticCaptionText = function () {
						return p.sendWithPromise('ScreenAnnot.getStaticCaptionText', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setStaticCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setStaticCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ScreenAnnot.setStaticCaptionText', {
								s: this.id,
								contents: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getRolloverCaptionText = function () {
						return p.sendWithPromise('ScreenAnnot.getRolloverCaptionText', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setRolloverCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setRolloverCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ScreenAnnot.setRolloverCaptionText', {
								s: this.id,
								contents: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getMouseDownCaptionText = function () {
						return p.sendWithPromise('ScreenAnnot.getMouseDownCaptionText', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setMouseDownCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setMouseDownCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ScreenAnnot.setMouseDownCaptionText', {
								s: this.id,
								contents: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getStaticIcon = function () {
						return p
							.sendWithPromise('ScreenAnnot.getStaticIcon', { s: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ScreenAnnot.prototype.setStaticIcon = function (e) {
						return (
							f(arguments.length, 1, 'setStaticIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('ScreenAnnot.setStaticIcon', {
								s: this.id,
								icon: e.id,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getRolloverIcon = function () {
						return p
							.sendWithPromise('ScreenAnnot.getRolloverIcon', { s: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ScreenAnnot.prototype.setRolloverIcon = function (e) {
						return (
							f(arguments.length, 1, 'setRolloverIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('ScreenAnnot.setRolloverIcon', {
								s: this.id,
								icon: e.id,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getMouseDownIcon = function () {
						return p
							.sendWithPromise('ScreenAnnot.getMouseDownIcon', { s: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ScreenAnnot.prototype.setMouseDownIcon = function (e) {
						return (
							f(arguments.length, 1, 'setMouseDownIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('ScreenAnnot.setMouseDownIcon', {
								s: this.id,
								icon: e.id,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getScaleType = function () {
						return p.sendWithPromise('ScreenAnnot.getScaleType', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setScaleType = function (e) {
						return (
							f(arguments.length, 1, 'setScaleType', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ScreenAnnot.setScaleType', {
								s: this.id,
								st: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getIconCaptionRelation = function () {
						return p.sendWithPromise('ScreenAnnot.getIconCaptionRelation', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setIconCaptionRelation = function (e) {
						return (
							f(arguments.length, 1, 'setIconCaptionRelation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ScreenAnnot.setIconCaptionRelation', {
								s: this.id,
								icr: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getScaleCondition = function () {
						return p.sendWithPromise('ScreenAnnot.getScaleCondition', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setScaleCondition = function (e) {
						return (
							f(arguments.length, 1, 'setScaleCondition', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ScreenAnnot.setScaleCondition', {
								s: this.id,
								sc: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getFitFull = function () {
						return p.sendWithPromise('ScreenAnnot.getFitFull', { s: this.id });
					}),
					(p.ScreenAnnot.prototype.setFitFull = function (e) {
						return (
							f(arguments.length, 1, 'setFitFull', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('ScreenAnnot.setFitFull', { s: this.id, ff: e })
						);
					}),
					(p.ScreenAnnot.prototype.getHIconLeftOver = function () {
						return p.sendWithPromise('ScreenAnnot.getHIconLeftOver', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setHIconLeftOver = function (e) {
						return (
							f(arguments.length, 1, 'setHIconLeftOver', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ScreenAnnot.setHIconLeftOver', {
								s: this.id,
								hl: e,
							})
						);
					}),
					(p.ScreenAnnot.prototype.getVIconLeftOver = function () {
						return p.sendWithPromise('ScreenAnnot.getVIconLeftOver', {
							s: this.id,
						});
					}),
					(p.ScreenAnnot.prototype.setVIconLeftOver = function (e) {
						return (
							f(arguments.length, 1, 'setVIconLeftOver', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ScreenAnnot.setVIconLeftOver', {
								s: this.id,
								vl: e,
							})
						);
					}),
					(p.SoundAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('soundAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.SoundAnnot, e);
								})
						);
					}),
					(p.SoundAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('soundAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.SoundAnnot, e);
								})
						);
					}),
					(p.SoundAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('soundAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.SoundAnnot, e);
								})
						);
					}),
					(p.SoundAnnot.createWithData = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'createWithData',
								'(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Filter, number, number, number)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Object', p.Filter, 'Filter'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							F('createWithData', [[t, 1]]),
							0 != n.id && S(n.id),
							p
								.sendWithPromise('soundAnnotCreateWithData', {
									doc: e.id,
									pos: t,
									no_own_stream: n.id,
									sample_bits: i,
									sample_freq: r,
									num_channels: o,
								})
								.then(function (e) {
									return D(p.SoundAnnot, e);
								})
						);
					}),
					(p.SoundAnnot.createAtPoint = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createAtPoint',
								'(PDFNet.SDFDoc, PDFNet.Point)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Point, 'Point'],
								]
							),
							F('createAtPoint', [[t, 1]]),
							p
								.sendWithPromise('soundAnnotCreateAtPoint', {
									doc: e.id,
									pos: t,
								})
								.then(function (e) {
									return D(p.SoundAnnot, e);
								})
						);
					}),
					(p.SoundAnnot.prototype.getSoundStream = function () {
						return p
							.sendWithPromise('SoundAnnot.getSoundStream', { sound: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SoundAnnot.prototype.setSoundStream = function (e) {
						return (
							f(arguments.length, 1, 'setSoundStream', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('SoundAnnot.setSoundStream', {
								sound: this.id,
								icon: e.id,
							})
						);
					}),
					(p.SoundAnnot.prototype.getIcon = function () {
						return p.sendWithPromise('SoundAnnot.getIcon', { sound: this.id });
					}),
					(p.SoundAnnot.prototype.setIcon = function (e) {
						return (
							void 0 === e && (e = p.SoundAnnot.Icon.e_Speaker),
							f(arguments.length, 0, 'setIcon', '(number)', [[e, 'number']]),
							p.sendWithPromise('SoundAnnot.setIcon', {
								sound: this.id,
								type: e,
							})
						);
					}),
					(p.SoundAnnot.prototype.getIconName = function () {
						return p.sendWithPromise('SoundAnnot.getIconName', {
							sound: this.id,
						});
					}),
					(p.SoundAnnot.prototype.setIconName = function (e) {
						return (
							f(arguments.length, 1, 'setIconName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('SoundAnnot.setIconName', {
								sound: this.id,
								type: e,
							})
						);
					}),
					(p.SquareAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('squareAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.SquareAnnot, e);
								})
						);
					}),
					(p.SquareAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('squareAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.SquareAnnot, e);
								})
						);
					}),
					(p.SquareAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('squareAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.SquareAnnot, e);
								})
						);
					}),
					(p.SquareAnnot.prototype.getInteriorColor = function () {
						return p
							.sendWithPromise('SquareAnnot.getInteriorColor', {
								square: this.id,
							})
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.SquareAnnot.prototype.getInteriorColorCompNum = function () {
						return p.sendWithPromise('SquareAnnot.getInteriorColorCompNum', {
							square: this.id,
						});
					}),
					(p.SquareAnnot.prototype.setInteriorColorDefault = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setInteriorColorDefault',
								'(PDFNet.ColorPt)',
								[[e, 'Object', p.ColorPt, 'ColorPt']]
							),
							p.sendWithPromise('SquareAnnot.setInteriorColorDefault', {
								square: this.id,
								col: e.id,
							})
						);
					}),
					(p.SquareAnnot.prototype.setInteriorColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setInteriorColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('SquareAnnot.setInteriorColor', {
								square: this.id,
								col: e.id,
								numcomp: t,
							})
						);
					}),
					(p.SquareAnnot.prototype.getContentRect = function () {
						return p
							.sendWithPromise('SquareAnnot.getContentRect', {
								square: this.id,
							})
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.SquareAnnot.prototype.setContentRect = function (e) {
						return (
							f(arguments.length, 1, 'setContentRect', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setContentRect', [[e, 0]]),
							p.sendWithPromise('SquareAnnot.setContentRect', {
								square: this.id,
								cr: e,
							})
						);
					}),
					(p.SquareAnnot.prototype.getPadding = function () {
						return p
							.sendWithPromise('SquareAnnot.getPadding', { square: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.SquareAnnot.prototype.setPadding = function (e) {
						return (
							f(arguments.length, 1, 'setPadding', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setPadding', [[e, 0]]),
							p.sendWithPromise('SquareAnnot.setPadding', {
								square: this.id,
								cr: e,
							})
						);
					}),
					(p.SquigglyAnnot.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('squigglyAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.SquigglyAnnot, e);
								})
						);
					}),
					(p.SquigglyAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('squigglyAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.SquigglyAnnot, e);
								})
						);
					}),
					(p.SquigglyAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('squigglyAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.SquigglyAnnot, e);
								})
						);
					}),
					(p.StrikeOutAnnot.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('strikeOutAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.StrikeOutAnnot, e);
								})
						);
					}),
					(p.StrikeOutAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('strikeOutAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.StrikeOutAnnot, e);
								})
						);
					}),
					(p.StrikeOutAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('strikeOutAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.StrikeOutAnnot, e);
								})
						);
					}),
					(p.TextAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('textAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.TextAnnot, e);
								})
						);
					}),
					(p.TextAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('textAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.TextAnnot, e);
								})
						);
					}),
					(p.TextAnnot.createAtPoint = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createAtPoint',
								'(PDFNet.SDFDoc, PDFNet.Point)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Point, 'Point'],
								]
							),
							F('createAtPoint', [[t, 1]]),
							p
								.sendWithPromise('textAnnotCreateAtPoint', {
									doc: e.id,
									pos: t,
								})
								.then(function (e) {
									return D(p.TextAnnot, e);
								})
						);
					}),
					(p.TextAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('textAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.TextAnnot, e);
								})
						);
					}),
					(p.TextAnnot.prototype.isOpen = function () {
						return p.sendWithPromise('TextAnnot.isOpen', { text: this.id });
					}),
					(p.TextAnnot.prototype.setOpen = function (e) {
						return (
							f(arguments.length, 1, 'setOpen', '(boolean)', [[e, 'boolean']]),
							p.sendWithPromise('TextAnnot.setOpen', {
								text: this.id,
								isopen: e,
							})
						);
					}),
					(p.TextAnnot.prototype.getIcon = function () {
						return p.sendWithPromise('TextAnnot.getIcon', { text: this.id });
					}),
					(p.TextAnnot.prototype.setIcon = function (e) {
						return (
							void 0 === e && (e = p.TextAnnot.Icon.e_Note),
							f(arguments.length, 0, 'setIcon', '(number)', [[e, 'number']]),
							p.sendWithPromise('TextAnnot.setIcon', { text: this.id, icon: e })
						);
					}),
					(p.TextAnnot.prototype.setIconDefault = function () {
						return p.sendWithPromise('TextAnnot.setIconDefault', {
							text: this.id,
						});
					}),
					(p.TextAnnot.prototype.getIconName = function () {
						return p.sendWithPromise('TextAnnot.getIconName', {
							text: this.id,
						});
					}),
					(p.TextAnnot.prototype.setIconName = function (e) {
						return (
							f(arguments.length, 1, 'setIconName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('TextAnnot.setIconName', {
								text: this.id,
								icon: e,
							})
						);
					}),
					(p.TextAnnot.prototype.getState = function () {
						return p.sendWithPromise('TextAnnot.getState', { text: this.id });
					}),
					(p.TextAnnot.prototype.setState = function (e) {
						return (
							void 0 === e && (e = ''),
							f(arguments.length, 0, 'setState', '(string)', [[e, 'string']]),
							p.sendWithPromise('TextAnnot.setState', {
								text: this.id,
								state: e,
							})
						);
					}),
					(p.TextAnnot.prototype.getStateModel = function () {
						return p.sendWithPromise('TextAnnot.getStateModel', {
							text: this.id,
						});
					}),
					(p.TextAnnot.prototype.setStateModel = function (e) {
						return (
							f(arguments.length, 1, 'setStateModel', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('TextAnnot.setStateModel', {
								text: this.id,
								sm: e,
							})
						);
					}),
					(p.TextAnnot.prototype.getAnchorPosition = function (t) {
						return (
							f(arguments.length, 1, 'getAnchorPosition', '(PDFNet.Point)', [
								[t, 'Structure', p.Point, 'Point'],
							]),
							F('getAnchorPosition', [[t, 0]]),
							(t.yieldFunction = 'TextAnnot.getAnchorPosition'),
							p
								.sendWithPromise('TextAnnot.getAnchorPosition', {
									text: this.id,
									anchor: t,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.TextAnnot.prototype.setAnchorPosition = function (e) {
						return (
							f(arguments.length, 1, 'setAnchorPosition', '(PDFNet.Point)', [
								[e, 'Structure', p.Point, 'Point'],
							]),
							F('setAnchorPosition', [[e, 0]]),
							p.sendWithPromise('TextAnnot.setAnchorPosition', {
								text: this.id,
								anchor: e,
							})
						);
					}),
					(p.UnderlineAnnot.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('underlineAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.UnderlineAnnot, e);
								})
						);
					}),
					(p.UnderlineAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('underlineAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.UnderlineAnnot, e);
								})
						);
					}),
					(p.UnderlineAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('underlineAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.UnderlineAnnot, e);
								})
						);
					}),
					(p.WatermarkAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('watermarkAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.WatermarkAnnot, e);
								})
						);
					}),
					(p.WatermarkAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('watermarkAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.WatermarkAnnot, e);
								})
						);
					}),
					(p.WatermarkAnnot.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, PDFNet.Rect)', [
								[e, 'SDFDoc'],
								[t, 'Structure', p.Rect, 'Rect'],
							]),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('watermarkAnnotCreate', { doc: e.id, pos: t })
								.then(function (e) {
									return D(p.WatermarkAnnot, e);
								})
						);
					}),
					(p.TextMarkupAnnot.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('textMarkupAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.TextMarkupAnnot, e);
								})
						);
					}),
					(p.TextMarkupAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('textMarkupAnnotCreateFromAnnot', {
									ann: e.id,
								})
								.then(function (e) {
									return D(p.TextMarkupAnnot, e);
								})
						);
					}),
					(p.TextMarkupAnnot.prototype.getQuadPointCount = function () {
						return p.sendWithPromise('TextMarkupAnnot.getQuadPointCount', {
							textmarkup: this.id,
						});
					}),
					(p.TextMarkupAnnot.prototype.getQuadPoint = function (e) {
						return (
							f(arguments.length, 1, 'getQuadPoint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('TextMarkupAnnot.getQuadPoint', {
								textmarkup: this.id,
								idx: e,
							})
						);
					}),
					(p.TextMarkupAnnot.prototype.setQuadPoint = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setQuadPoint',
								'(number, PDFNet.QuadPoint)',
								[
									[e, 'number'],
									[t, 'Structure', p.QuadPoint, 'QuadPoint'],
								]
							),
							F('setQuadPoint', [[t, 1]]),
							p.sendWithPromise('TextMarkupAnnot.setQuadPoint', {
								textmarkup: this.id,
								idx: e,
								qp: t,
							})
						);
					}),
					(p.WidgetAnnot.create = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'create',
								'(PDFNet.SDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'SDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('create', [
								[t, 1],
								[n, 2],
							]),
							(n.yieldFunction = 'WidgetAnnot.create'),
							p
								.sendWithPromise('widgetAnnotCreate', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return (
										(n.yieldFunction = void 0),
										(e.result = D(p.WidgetAnnot, e.result)),
										O(e.field, n),
										e.result
									);
								})
						);
					}),
					(p.WidgetAnnot.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('widgetAnnotCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.WidgetAnnot, e);
								})
						);
					}),
					(p.WidgetAnnot.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('widgetAnnotCreateFromAnnot', { ann: e.id })
								.then(function (e) {
									return D(p.WidgetAnnot, e);
								})
						);
					}),
					(p.WidgetAnnot.prototype.getField = function () {
						return p
							.sendWithPromise('WidgetAnnot.getField', { widget: this.id })
							.then(function (e) {
								return new p.Field(e);
							});
					}),
					(p.WidgetAnnot.prototype.getHighlightingMode = function () {
						return p.sendWithPromise('WidgetAnnot.getHighlightingMode', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setHighlightingMode = function (e) {
						return (
							void 0 === e && (e = p.WidgetAnnot.HighlightingMode.e_invert),
							f(arguments.length, 0, 'setHighlightingMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setHighlightingMode', {
								widget: this.id,
								value: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getAction = function () {
						return p
							.sendWithPromise('WidgetAnnot.getAction', { widget: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.WidgetAnnot.prototype.setAction = function (e) {
						return (
							f(arguments.length, 1, 'setAction', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('WidgetAnnot.setAction', {
								widget: this.id,
								action: e.id,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getBorderColor = function () {
						return p
							.sendWithPromise('WidgetAnnot.getBorderColor', {
								widget: this.id,
							})
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.WidgetAnnot.prototype.setBorderColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setBorderColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('WidgetAnnot.setBorderColor', {
								widget: this.id,
								col: e.id,
								compnum: t,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getBorderColorCompNum = function () {
						return p.sendWithPromise('WidgetAnnot.getBorderColorCompNum', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.getBackgroundColorCompNum = function () {
						return p.sendWithPromise('WidgetAnnot.getBackgroundColorCompNum', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.getBackgroundColor = function () {
						return p
							.sendWithPromise('WidgetAnnot.getBackgroundColor', {
								widget: this.id,
							})
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.WidgetAnnot.prototype.setBackgroundColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setBackgroundColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('WidgetAnnot.setBackgroundColor', {
								widget: this.id,
								col: e.id,
								compnum: t,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getStaticCaptionText = function () {
						return p.sendWithPromise('WidgetAnnot.getStaticCaptionText', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setStaticCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setStaticCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('WidgetAnnot.setStaticCaptionText', {
								widget: this.id,
								contents: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getRolloverCaptionText = function () {
						return p.sendWithPromise('WidgetAnnot.getRolloverCaptionText', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setRolloverCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setRolloverCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('WidgetAnnot.setRolloverCaptionText', {
								widget: this.id,
								contents: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getMouseDownCaptionText = function () {
						return p.sendWithPromise('WidgetAnnot.getMouseDownCaptionText', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setMouseDownCaptionText = function (e) {
						return (
							f(arguments.length, 1, 'setMouseDownCaptionText', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('WidgetAnnot.setMouseDownCaptionText', {
								widget: this.id,
								contents: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getStaticIcon = function () {
						return p
							.sendWithPromise('WidgetAnnot.getStaticIcon', { widget: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.WidgetAnnot.prototype.setStaticIcon = function (e) {
						return (
							f(arguments.length, 1, 'setStaticIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('WidgetAnnot.setStaticIcon', {
								widget: this.id,
								icon: e.id,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getRolloverIcon = function () {
						return p
							.sendWithPromise('WidgetAnnot.getRolloverIcon', {
								widget: this.id,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.WidgetAnnot.prototype.setRolloverIcon = function (e) {
						return (
							f(arguments.length, 1, 'setRolloverIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('WidgetAnnot.setRolloverIcon', {
								widget: this.id,
								icon: e.id,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getMouseDownIcon = function () {
						return p
							.sendWithPromise('WidgetAnnot.getMouseDownIcon', {
								widget: this.id,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.WidgetAnnot.prototype.setMouseDownIcon = function (e) {
						return (
							f(arguments.length, 1, 'setMouseDownIcon', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('WidgetAnnot.setMouseDownIcon', {
								widget: this.id,
								icon: e.id,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getScaleType = function () {
						return p.sendWithPromise('WidgetAnnot.getScaleType', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setScaleType = function (e) {
						return (
							f(arguments.length, 1, 'setScaleType', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setScaleType', {
								widget: this.id,
								st: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getIconCaptionRelation = function () {
						return p.sendWithPromise('WidgetAnnot.getIconCaptionRelation', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setIconCaptionRelation = function (e) {
						return (
							f(arguments.length, 1, 'setIconCaptionRelation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setIconCaptionRelation', {
								widget: this.id,
								icr: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getScaleCondition = function () {
						return p.sendWithPromise('WidgetAnnot.getScaleCondition', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setScaleCondition = function (e) {
						return (
							f(arguments.length, 1, 'setScaleCondition', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setScaleCondition', {
								widget: this.id,
								sd: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getFitFull = function () {
						return p.sendWithPromise('WidgetAnnot.getFitFull', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setFitFull = function (e) {
						return (
							f(arguments.length, 1, 'setFitFull', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('WidgetAnnot.setFitFull', {
								widget: this.id,
								ff: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getHIconLeftOver = function () {
						return p.sendWithPromise('WidgetAnnot.getHIconLeftOver', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setHIconLeftOver = function (e) {
						return (
							f(arguments.length, 1, 'setHIconLeftOver', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setHIconLeftOver', {
								widget: this.id,
								hl: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getVIconLeftOver = function () {
						return p.sendWithPromise('WidgetAnnot.getVIconLeftOver', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.setVIconLeftOver = function (e) {
						return (
							f(arguments.length, 1, 'setVIconLeftOver', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setVIconLeftOver', {
								widget: this.id,
								vl: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.setFontSize = function (e) {
						return (
							f(arguments.length, 1, 'setFontSize', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('WidgetAnnot.setFontSize', {
								widget: this.id,
								font_size: e,
							})
						);
					}),
					(p.WidgetAnnot.prototype.setTextColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setTextColor',
								'(PDFNet.ColorPt, number)',
								[
									[e, 'Object', p.ColorPt, 'ColorPt'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('WidgetAnnot.setTextColor', {
								widget: this.id,
								color: e.id,
								col_comp: t,
							})
						);
					}),
					(p.WidgetAnnot.prototype.setFont = function (e) {
						return (
							f(arguments.length, 1, 'setFont', '(PDFNet.Font)', [
								[e, 'Object', p.Font, 'Font'],
							]),
							p.sendWithPromise('WidgetAnnot.setFont', {
								widget: this.id,
								font: e.id,
							})
						);
					}),
					(p.WidgetAnnot.prototype.getFontSize = function () {
						return p.sendWithPromise('WidgetAnnot.getFontSize', {
							widget: this.id,
						});
					}),
					(p.WidgetAnnot.prototype.getTextColor = function () {
						return p
							.sendWithPromise('WidgetAnnot.getTextColor', { widget: this.id })
							.then(function (e) {
								return (e.col = y(p.ColorPt, e.col)), e;
							});
					}),
					(p.WidgetAnnot.prototype.getFont = function () {
						return p
							.sendWithPromise('WidgetAnnot.getFont', { widget: this.id })
							.then(function (e) {
								return y(p.Font, e);
							});
					}),
					(p.SignatureWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('signatureWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.SignatureWidget, e);
								})
						);
					}),
					(p.SignatureWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('signatureWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.SignatureWidget, e);
								})
						);
					}),
					(p.SignatureWidget.createWithDigitalSignatureField = function (
						e,
						t,
						n
					) {
						return (
							f(
								arguments.length,
								3,
								'createWithDigitalSignatureField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.DigitalSignatureField)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[
										n,
										'Structure',
										p.DigitalSignatureField,
										'DigitalSignatureField',
									],
								]
							),
							F('createWithDigitalSignatureField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise(
									'signatureWidgetCreateWithDigitalSignatureField',
									{ doc: e.id, pos: t, field: n }
								)
								.then(function (e) {
									return D(p.SignatureWidget, e);
								})
						);
					}),
					(p.SignatureWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('signatureWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.SignatureWidget, e);
								})
						);
					}),
					(p.SignatureWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('signatureWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.SignatureWidget, e);
								})
						);
					}),
					(p.SignatureWidget.prototype.createSignatureAppearance = function (
						e
					) {
						return (
							f(
								arguments.length,
								1,
								'createSignatureAppearance',
								'(PDFNet.Image)',
								[[e, 'Object', p.Image, 'Image']]
							),
							p.sendWithPromise('SignatureWidget.createSignatureAppearance', {
								self: this.id,
								img: e.id,
							})
						);
					}),
					(p.SignatureWidget.prototype.getDigitalSignatureField = function () {
						return p
							.sendWithPromise('SignatureWidget.getDigitalSignatureField', {
								self: this.id,
							})
							.then(function (e) {
								return new p.DigitalSignatureField(e);
							});
					}),
					(p.ComboBoxWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('comboBoxWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.ComboBoxWidget, e);
								})
						);
					}),
					(p.ComboBoxWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('comboBoxWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.ComboBoxWidget, e);
								})
						);
					}),
					(p.ComboBoxWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('comboBoxWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.ComboBoxWidget, e);
								})
						);
					}),
					(p.ComboBoxWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('comboBoxWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.ComboBoxWidget, e);
								})
						);
					}),
					(p.ComboBoxWidget.prototype.addOption = function (e) {
						return (
							f(arguments.length, 1, 'addOption', '(string)', [[e, 'string']]),
							p.sendWithPromise('ComboBoxWidget.addOption', {
								combobox: this.id,
								value: e,
							})
						);
					}),
					(p.ComboBoxWidget.prototype.addOptions = function (e) {
						return (
							f(arguments.length, 1, 'addOptions', '(Array<string>)', [
								[e, 'Array'],
							]),
							p.sendWithPromise('ComboBoxWidget.addOptions', {
								combobox: this.id,
								opts_list: e,
							})
						);
					}),
					(p.ComboBoxWidget.prototype.setSelectedOption = function (e) {
						return (
							f(arguments.length, 1, 'setSelectedOption', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ComboBoxWidget.setSelectedOption', {
								combobox: this.id,
								value: e,
							})
						);
					}),
					(p.ComboBoxWidget.prototype.getSelectedOption = function () {
						return p.sendWithPromise('ComboBoxWidget.getSelectedOption', {
							combobox: this.id,
						});
					}),
					(p.ComboBoxWidget.prototype.replaceOptions = function (e) {
						return (
							f(arguments.length, 1, 'replaceOptions', '(Array<string>)', [
								[e, 'Array'],
							]),
							p.sendWithPromise('ComboBoxWidget.replaceOptions', {
								combobox: this.id,
								new_opts_list: e,
							})
						);
					}),
					(p.ComboBoxWidget.prototype.removeOption = function (e) {
						return (
							f(arguments.length, 1, 'removeOption', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ComboBoxWidget.removeOption', {
								combobox: this.id,
								value: e,
							})
						);
					}),
					(p.ListBoxWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('listBoxWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.ListBoxWidget, e);
								})
						);
					}),
					(p.ListBoxWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('listBoxWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.ListBoxWidget, e);
								})
						);
					}),
					(p.ListBoxWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('listBoxWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.ListBoxWidget, e);
								})
						);
					}),
					(p.ListBoxWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('listBoxWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.ListBoxWidget, e);
								})
						);
					}),
					(p.ListBoxWidget.prototype.addOption = function (e) {
						return (
							f(arguments.length, 1, 'addOption', '(string)', [[e, 'string']]),
							p.sendWithPromise('ListBoxWidget.addOption', {
								listbox: this.id,
								value: e,
							})
						);
					}),
					(p.ListBoxWidget.prototype.addOptions = function (e) {
						return (
							f(arguments.length, 1, 'addOptions', '(Array<string>)', [
								[e, 'Array'],
							]),
							p.sendWithPromise('ListBoxWidget.addOptions', {
								listbox: this.id,
								opts_list: e,
							})
						);
					}),
					(p.ListBoxWidget.prototype.setSelectedOptions = function (e) {
						return (
							f(arguments.length, 1, 'setSelectedOptions', '(Array<string>)', [
								[e, 'Array'],
							]),
							p.sendWithPromise('ListBoxWidget.setSelectedOptions', {
								listbox: this.id,
								selected_opts_list: e,
							})
						);
					}),
					(p.ListBoxWidget.prototype.replaceOptions = function (e) {
						return (
							f(arguments.length, 1, 'replaceOptions', '(Array<string>)', [
								[e, 'Array'],
							]),
							p.sendWithPromise('ListBoxWidget.replaceOptions', {
								listbox: this.id,
								new_opts_list: e,
							})
						);
					}),
					(p.ListBoxWidget.prototype.removeOption = function (e) {
						return (
							f(arguments.length, 1, 'removeOption', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ListBoxWidget.removeOption', {
								listbox: this.id,
								value: e,
							})
						);
					}),
					(p.TextWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('textWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.TextWidget, e);
								})
						);
					}),
					(p.TextWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('textWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.TextWidget, e);
								})
						);
					}),
					(p.TextWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('textWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.TextWidget, e);
								})
						);
					}),
					(p.TextWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('textWidgetCreateFromAnnot', { annot: e.id })
								.then(function (e) {
									return D(p.TextWidget, e);
								})
						);
					}),
					(p.TextWidget.prototype.setText = function (e) {
						return (
							f(arguments.length, 1, 'setText', '(string)', [[e, 'string']]),
							p.sendWithPromise('TextWidget.setText', {
								widget: this.id,
								text: e,
							})
						);
					}),
					(p.TextWidget.prototype.getText = function () {
						return p.sendWithPromise('TextWidget.getText', { widget: this.id });
					}),
					(p.CheckBoxWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('checkBoxWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.CheckBoxWidget, e);
								})
						);
					}),
					(p.CheckBoxWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('checkBoxWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.CheckBoxWidget, e);
								})
						);
					}),
					(p.CheckBoxWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('checkBoxWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.CheckBoxWidget, e);
								})
						);
					}),
					(p.CheckBoxWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('checkBoxWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.CheckBoxWidget, e);
								})
						);
					}),
					(p.CheckBoxWidget.prototype.isChecked = function () {
						return p.sendWithPromise('CheckBoxWidget.isChecked', {
							button: this.id,
						});
					}),
					(p.CheckBoxWidget.prototype.setChecked = function (e) {
						return (
							f(arguments.length, 1, 'setChecked', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('CheckBoxWidget.setChecked', {
								button: this.id,
								checked: e,
							})
						);
					}),
					(p.RadioButtonWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('radioButtonWidgetCreateFromObj', { d: e.id })
								.then(function (e) {
									return D(p.RadioButtonWidget, e);
								})
						);
					}),
					(p.RadioButtonWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('radioButtonWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.RadioButtonWidget, e);
								})
						);
					}),
					(p.RadioButtonWidget.prototype.isEnabled = function () {
						return p.sendWithPromise('RadioButtonWidget.isEnabled', {
							button: this.id,
						});
					}),
					(p.RadioButtonWidget.prototype.enableButton = function () {
						return p.sendWithPromise('RadioButtonWidget.enableButton', {
							button: this.id,
						});
					}),
					(p.RadioButtonWidget.prototype.getGroup = function () {
						return p
							.sendWithPromise('RadioButtonWidget.getGroup', {
								button: this.id,
							})
							.then(function (e) {
								return y(p.RadioButtonGroup, e);
							});
					}),
					(p.PushButtonWidget.create = function (e, t, n) {
						return (
							void 0 === n && (n = ''),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.PDFDoc, PDFNet.Rect, string)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'string'],
								]
							),
							F('create', [[t, 1]]),
							p
								.sendWithPromise('pushButtonWidgetCreate', {
									doc: e.id,
									pos: t,
									field_name: n,
								})
								.then(function (e) {
									return D(p.PushButtonWidget, e);
								})
						);
					}),
					(p.PushButtonWidget.createWithField = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createWithField',
								'(PDFNet.PDFDoc, PDFNet.Rect, PDFNet.Field)',
								[
									[e, 'PDFDoc'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'Structure', p.Field, 'Field'],
								]
							),
							F('createWithField', [
								[t, 1],
								[n, 2],
							]),
							p
								.sendWithPromise('pushButtonWidgetCreateWithField', {
									doc: e.id,
									pos: t,
									field: n,
								})
								.then(function (e) {
									return D(p.PushButtonWidget, e);
								})
						);
					}),
					(p.PushButtonWidget.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('pushButtonWidgetCreateFromObj', { obj: e.id })
								.then(function (e) {
									return D(p.PushButtonWidget, e);
								})
						);
					}),
					(p.PushButtonWidget.createFromAnnot = function (e) {
						return (
							f(arguments.length, 1, 'createFromAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p
								.sendWithPromise('pushButtonWidgetCreateFromAnnot', {
									annot: e.id,
								})
								.then(function (e) {
									return D(p.PushButtonWidget, e);
								})
						);
					}),
					(p.Bookmark.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.PDFDoc, string)', [
								[e, 'PDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('bookmarkCreate', {
									in_doc: e.id,
									in_title: t,
								})
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('bookmarkCreateFromObj', {
									in_bookmark_dict: e.id,
								})
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.prototype.copy = function () {
						return p
							.sendWithPromise('Bookmark.copy', { in_bookmark: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.Bookmark)', [
								[e, 'Object', p.Bookmark, 'Bookmark'],
							]),
							p.sendWithPromise('Bookmark.compare', {
								bm: this.id,
								in_bookmark: e.id,
							})
						);
					}),
					(p.Bookmark.prototype.isValid = function () {
						return p.sendWithPromise('Bookmark.isValid', { bm: this.id });
					}),
					(p.Bookmark.prototype.hasChildren = function () {
						return p.sendWithPromise('Bookmark.hasChildren', { bm: this.id });
					}),
					(p.Bookmark.prototype.getNext = function () {
						return p
							.sendWithPromise('Bookmark.getNext', { bm: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.getPrev = function () {
						return p
							.sendWithPromise('Bookmark.getPrev', { bm: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.getFirstChild = function () {
						return p
							.sendWithPromise('Bookmark.getFirstChild', { bm: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.getLastChild = function () {
						return p
							.sendWithPromise('Bookmark.getLastChild', { bm: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.getParent = function () {
						return p
							.sendWithPromise('Bookmark.getParent', { bm: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.Bookmark.prototype.find = function (e) {
						return (
							f(arguments.length, 1, 'find', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Bookmark.find', { bm: this.id, in_title: e })
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.prototype.addNewChild = function (e) {
						return (
							f(arguments.length, 1, 'addNewChild', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Bookmark.addNewChild', {
									bm: this.id,
									in_title: e,
								})
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.prototype.addChild = function (e) {
						return (
							f(arguments.length, 1, 'addChild', '(PDFNet.Bookmark)', [
								[e, 'Object', p.Bookmark, 'Bookmark'],
							]),
							p.sendWithPromise('Bookmark.addChild', {
								bm: this.id,
								in_bookmark: e.id,
							})
						);
					}),
					(p.Bookmark.prototype.addNewNext = function (e) {
						return (
							f(arguments.length, 1, 'addNewNext', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Bookmark.addNewNext', {
									bm: this.id,
									in_title: e,
								})
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.prototype.addNext = function (e) {
						return (
							f(arguments.length, 1, 'addNext', '(PDFNet.Bookmark)', [
								[e, 'Object', p.Bookmark, 'Bookmark'],
							]),
							p.sendWithPromise('Bookmark.addNext', {
								bm: this.id,
								in_bookmark: e.id,
							})
						);
					}),
					(p.Bookmark.prototype.addNewPrev = function (e) {
						return (
							f(arguments.length, 1, 'addNewPrev', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Bookmark.addNewPrev', {
									bm: this.id,
									in_title: e,
								})
								.then(function (e) {
									return D(p.Bookmark, e);
								})
						);
					}),
					(p.Bookmark.prototype.addPrev = function (e) {
						return (
							f(arguments.length, 1, 'addPrev', '(PDFNet.Bookmark)', [
								[e, 'Object', p.Bookmark, 'Bookmark'],
							]),
							p.sendWithPromise('Bookmark.addPrev', {
								bm: this.id,
								in_bookmark: e.id,
							})
						);
					}),
					(p.Bookmark.prototype.delete = function () {
						return p.sendWithPromise('Bookmark.delete', { bm: this.id });
					}),
					(p.Bookmark.prototype.unlink = function () {
						return p.sendWithPromise('Bookmark.unlink', { bm: this.id });
					}),
					(p.Bookmark.prototype.getIndent = function () {
						return p.sendWithPromise('Bookmark.getIndent', { bm: this.id });
					}),
					(p.Bookmark.prototype.isOpen = function () {
						return p.sendWithPromise('Bookmark.isOpen', { bm: this.id });
					}),
					(p.Bookmark.prototype.setOpen = function (e) {
						return (
							f(arguments.length, 1, 'setOpen', '(boolean)', [[e, 'boolean']]),
							p.sendWithPromise('Bookmark.setOpen', { bm: this.id, in_open: e })
						);
					}),
					(p.Bookmark.prototype.getOpenCount = function () {
						return p.sendWithPromise('Bookmark.getOpenCount', { bm: this.id });
					}),
					(p.Bookmark.prototype.getTitle = function () {
						return p.sendWithPromise('Bookmark.getTitle', { bm: this.id });
					}),
					(p.Bookmark.prototype.getTitleObj = function () {
						return p
							.sendWithPromise('Bookmark.getTitleObj', { bm: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Bookmark.prototype.setTitle = function (e) {
						return (
							f(arguments.length, 1, 'setTitle', '(string)', [[e, 'string']]),
							p.sendWithPromise('Bookmark.setTitle', { bm: this.id, title: e })
						);
					}),
					(p.Bookmark.prototype.getAction = function () {
						return p
							.sendWithPromise('Bookmark.getAction', { bm: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.Bookmark.prototype.setAction = function (e) {
						return (
							f(arguments.length, 1, 'setAction', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('Bookmark.setAction', {
								bm: this.id,
								in_action: e.id,
							})
						);
					}),
					(p.Bookmark.prototype.removeAction = function () {
						return p.sendWithPromise('Bookmark.removeAction', { bm: this.id });
					}),
					(p.Bookmark.prototype.getFlags = function () {
						return p.sendWithPromise('Bookmark.getFlags', { bm: this.id });
					}),
					(p.Bookmark.prototype.setFlags = function (e) {
						return (
							f(arguments.length, 1, 'setFlags', '(number)', [[e, 'number']]),
							p.sendWithPromise('Bookmark.setFlags', {
								bm: this.id,
								in_flags: e,
							})
						);
					}),
					(p.Bookmark.prototype.getColor = function () {
						return p.sendWithPromise('Bookmark.getColor', { bm: this.id });
					}),
					(p.Bookmark.prototype.setColor = function (e, t, n) {
						return (
							void 0 === e && (e = 0),
							void 0 === t && (t = 0),
							void 0 === n && (n = 0),
							f(arguments.length, 0, 'setColor', '(number, number, number)', [
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
							]),
							p.sendWithPromise('Bookmark.setColor', {
								bm: this.id,
								in_r: e,
								in_g: t,
								in_b: n,
							})
						);
					}),
					(p.Bookmark.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Bookmark.getSDFObj', { bm: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ColorPt.init = function (e, t, n, i) {
						return (
							void 0 === e && (e = 0),
							void 0 === t && (t = 0),
							void 0 === n && (n = 0),
							void 0 === i && (i = 0),
							f(
								arguments.length,
								0,
								'init',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('colorPtInit', { x: e, y: t, z: n, w: i })
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.ColorPt.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p.sendWithPromise('ColorPt.compare', {
								left: this.id,
								right: e.id,
							})
						);
					}),
					(p.ColorPt.prototype.set = function (e, t, n, i) {
						return (
							void 0 === e && (e = 0),
							void 0 === t && (t = 0),
							void 0 === n && (n = 0),
							void 0 === i && (i = 0),
							f(
								arguments.length,
								0,
								'set',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('ColorPt.set', {
								cp: this.id,
								x: e,
								y: t,
								z: n,
								w: i,
							})
						);
					}),
					(p.ColorPt.prototype.setByIndex = function (e, t) {
						return (
							f(arguments.length, 2, 'setByIndex', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('ColorPt.setByIndex', {
								cp: this.id,
								colorant_index: e,
								colorant_value: t,
							})
						);
					}),
					(p.ColorPt.prototype.get = function (e) {
						return (
							f(arguments.length, 1, 'get', '(number)', [[e, 'number']]),
							p.sendWithPromise('ColorPt.get', {
								cp: this.id,
								colorant_index: e,
							})
						);
					}),
					(p.ColorPt.prototype.setColorantNum = function (e) {
						return (
							f(arguments.length, 1, 'setColorantNum', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ColorPt.setColorantNum', {
								cp: this.id,
								num: e,
							})
						);
					}),
					(p.ColorSpace.createDeviceGray = function () {
						return p
							.sendWithPromise('colorSpaceCreateDeviceGray', {})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.createDeviceRGB = function () {
						return p
							.sendWithPromise('colorSpaceCreateDeviceRGB', {})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.createDeviceCMYK = function () {
						return p
							.sendWithPromise('colorSpaceCreateDeviceCMYK', {})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.createPattern = function () {
						return p
							.sendWithPromise('colorSpaceCreatePattern', {})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('colorSpaceCreate', { color_space: e.id })
								.then(function (e) {
									return y(p.ColorSpace, e);
								})
						);
					}),
					(p.ColorSpace.createICCFromFilter = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createICCFromFilter',
								'(PDFNet.SDFDoc, PDFNet.Filter)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.Filter, 'Filter'],
								]
							),
							0 != t.id && S(t.id),
							p
								.sendWithPromise('colorSpaceCreateICCFromFilter', {
									doc: e.id,
									no_own_filter: t.id,
								})
								.then(function (e) {
									return y(p.ColorSpace, e);
								})
						);
					}),
					(p.ColorSpace.createICCFromBuffer = function (e, t) {
						f(
							arguments.length,
							2,
							'createICCFromBuffer',
							'(PDFNet.SDFDoc, ArrayBuffer|TypedArray)',
							[
								[e, 'SDFDoc'],
								[t, 'ArrayBuffer'],
							]
						);
						var n = b(t, !1);
						return p
							.sendWithPromise('colorSpaceCreateICCFromBuffer', {
								doc: e.id,
								buf: n,
							})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.getComponentNumFromObj = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'getComponentNumFromObj',
								'(number, PDFNet.Obj)',
								[
									[e, 'number'],
									[t, 'Object', p.Obj, 'Obj'],
								]
							),
							p.sendWithPromise('colorSpaceGetComponentNumFromObj', {
								cs_type: e,
								cs_obj: t.id,
							})
						);
					}),
					(p.ColorSpace.getTypeFromObj = function (e) {
						return (
							f(arguments.length, 1, 'getTypeFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('colorSpaceGetTypeFromObj', { cs_obj: e.id })
						);
					}),
					(p.ColorSpace.prototype.getType = function () {
						return p.sendWithPromise('ColorSpace.getType', { cs: this.id });
					}),
					(p.ColorSpace.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('ColorSpace.getSDFObj', { cs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ColorSpace.prototype.getComponentNum = function () {
						return p.sendWithPromise('ColorSpace.getComponentNum', {
							cs: this.id,
						});
					}),
					(p.ColorSpace.prototype.initColor = function () {
						return p
							.sendWithPromise('ColorSpace.initColor', { cs: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.ColorSpace.prototype.initComponentRanges = function (e) {
						return (
							f(arguments.length, 1, 'initComponentRanges', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ColorSpace.initComponentRanges', {
								cs: this.id,
								num_comps: e,
							})
						);
					}),
					(p.ColorSpace.prototype.convert2Gray = function (e) {
						return (
							f(arguments.length, 1, 'convert2Gray', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p
								.sendWithPromise('ColorSpace.convert2Gray', {
									cs: this.id,
									in_color: e.id,
								})
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.ColorSpace.prototype.convert2RGB = function (e) {
						return (
							f(arguments.length, 1, 'convert2RGB', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p
								.sendWithPromise('ColorSpace.convert2RGB', {
									cs: this.id,
									in_color: e.id,
								})
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.ColorSpace.prototype.convert2CMYK = function (e) {
						return (
							f(arguments.length, 1, 'convert2CMYK', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p
								.sendWithPromise('ColorSpace.convert2CMYK', {
									cs: this.id,
									in_color: e.id,
								})
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.ColorSpace.prototype.getAlternateColorSpace = function () {
						return p
							.sendWithPromise('ColorSpace.getAlternateColorSpace', {
								cs: this.id,
							})
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.prototype.getBaseColorSpace = function () {
						return p
							.sendWithPromise('ColorSpace.getBaseColorSpace', { cs: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.ColorSpace.prototype.getHighVal = function () {
						return p.sendWithPromise('ColorSpace.getHighVal', { cs: this.id });
					}),
					(p.ColorSpace.prototype.getLookupTable = function () {
						return p.sendWithPromise('ColorSpace.getLookupTable', {
							cs: this.id,
						});
					}),
					(p.ColorSpace.prototype.getBaseColor = function (e) {
						return (
							f(arguments.length, 1, 'getBaseColor', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('ColorSpace.getBaseColor', {
									cs: this.id,
									color_idx: e,
								})
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.ColorSpace.prototype.getTintFunction = function () {
						return p
							.sendWithPromise('ColorSpace.getTintFunction', { cs: this.id })
							.then(function (e) {
								return y(p.Function, e);
							});
					}),
					(p.ColorSpace.prototype.isAll = function () {
						return p.sendWithPromise('ColorSpace.isAll', { cs: this.id });
					}),
					(p.ColorSpace.prototype.isNone = function () {
						return p.sendWithPromise('ColorSpace.isNone', { cs: this.id });
					}),
					(p.ContentReplacer.create = function () {
						return p
							.sendWithPromise('contentReplacerCreate', {})
							.then(function (e) {
								return y(p.ContentReplacer, e);
							});
					}),
					(p.ContentReplacer.prototype.addImage = function (e, t) {
						return (
							f(arguments.length, 2, 'addImage', '(PDFNet.Rect, PDFNet.Obj)', [
								[e, 'Structure', p.Rect, 'Rect'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							F('addImage', [[e, 0]]),
							p.sendWithPromise('ContentReplacer.addImage', {
								cr: this.id,
								target_region: e,
								replacement_image: t.id,
							})
						);
					}),
					(p.ContentReplacer.prototype.addText = function (e, t) {
						return (
							f(arguments.length, 2, 'addText', '(PDFNet.Rect, string)', [
								[e, 'Structure', p.Rect, 'Rect'],
								[t, 'string'],
							]),
							F('addText', [[e, 0]]),
							p.sendWithPromise('ContentReplacer.addText', {
								cr: this.id,
								target_region: e,
								replacement_text: t,
							})
						);
					}),
					(p.ContentReplacer.prototype.addString = function (e, t) {
						return (
							f(arguments.length, 2, 'addString', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p.sendWithPromise('ContentReplacer.addString', {
								cr: this.id,
								template_text: e,
								replacement_text: t,
							})
						);
					}),
					(p.ContentReplacer.prototype.setMatchStrings = function (e, t) {
						return (
							f(arguments.length, 2, 'setMatchStrings', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p.sendWithPromise('ContentReplacer.setMatchStrings', {
								cr: this.id,
								start_str: e,
								end_str: t,
							})
						);
					}),
					(p.ContentReplacer.prototype.process = function (e) {
						return (
							f(arguments.length, 1, 'process', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('ContentReplacer.process', {
								cr: this.id,
								page: e.id,
							})
						);
					}),
					(p.Reflow.prototype.getHtml = function () {
						return p.sendWithPromise('Reflow.getHtml', { self: this.id });
					}),
					(p.Reflow.prototype.getAnnot = function (e) {
						return (
							f(arguments.length, 1, 'getAnnot', '(string)', [[e, 'string']]),
							p.sendWithPromise('Reflow.getAnnot', { self: this.id, in_id: e })
						);
					}),
					(p.Reflow.prototype.setAnnot = function (e) {
						return (
							f(arguments.length, 1, 'setAnnot', '(string)', [[e, 'string']]),
							p.sendWithPromise('Reflow.setAnnot', {
								self: this.id,
								in_json: e,
							})
						);
					}),
					(p.Reflow.prototype.setIncludeImages = function (e) {
						return (
							f(arguments.length, 1, 'setIncludeImages', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Reflow.setIncludeImages', {
								self: this.id,
								include: e,
							})
						);
					}),
					(p.Reflow.prototype.setHTMLOutputTextMarkup = function (e) {
						return (
							f(arguments.length, 1, 'setHTMLOutputTextMarkup', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Reflow.setHTMLOutputTextMarkup', {
								self: this.id,
								include: e,
							})
						);
					}),
					(p.Reflow.prototype.setMessageWhenNoReflowContent = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setMessageWhenNoReflowContent',
								'(string)',
								[[e, 'string']]
							),
							p.sendWithPromise('Reflow.setMessageWhenNoReflowContent', {
								self: this.id,
								content: e,
							})
						);
					}),
					(p.Reflow.prototype.setMessageWhenReflowFailed = function (e) {
						return (
							f(arguments.length, 1, 'setMessageWhenReflowFailed', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Reflow.setMessageWhenReflowFailed', {
								self: this.id,
								content: e,
							})
						);
					}),
					(p.Reflow.prototype.setHideBackgroundImages = function (e) {
						return (
							f(arguments.length, 1, 'setHideBackgroundImages', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Reflow.setHideBackgroundImages', {
								self: this.id,
								hide_background_images: e,
							})
						);
					}),
					(p.Reflow.prototype.setHideImagesUnderText = function (e) {
						return (
							f(arguments.length, 1, 'setHideImagesUnderText', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Reflow.setHideImagesUnderText', {
								self: this.id,
								hide_images_under_text: e,
							})
						);
					}),
					(p.Reflow.prototype.setHideImagesUnderInvisibleText = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setHideImagesUnderInvisibleText',
								'(boolean)',
								[[e, 'boolean']]
							),
							p.sendWithPromise('Reflow.setHideImagesUnderInvisibleText', {
								self: this.id,
								hide_images_under_invisible_text: e,
							})
						);
					}),
					(p.Reflow.prototype.setDoNotReflowTextOverImages = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setDoNotReflowTextOverImages',
								'(boolean)',
								[[e, 'boolean']]
							),
							p.sendWithPromise('Reflow.setDoNotReflowTextOverImages', {
								self: this.id,
								do_not_reflow_text_over_images: e,
							})
						);
					}),
					(p.Reflow.prototype.setFontOverrideName = function (e) {
						return (
							f(arguments.length, 1, 'setFontOverrideName', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Reflow.setFontOverrideName', {
								self: this.id,
								font_family: e,
							})
						);
					}),
					(p.Reflow.prototype.setCustomStyles = function (e) {
						return (
							f(arguments.length, 1, 'setCustomStyles', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Reflow.setCustomStyles', {
								self: this.id,
								styles: e,
							})
						);
					}),
					(p.Reflow.prototype.setIncludeBBoxForRecognizedZones = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setIncludeBBoxForRecognizedZones',
								'(boolean)',
								[[e, 'boolean']]
							),
							p.sendWithPromise('Reflow.setIncludeBBoxForRecognizedZones', {
								self: this.id,
								include: e,
							})
						);
					}),
					(p.Convert.fromXpsMem = function (e, t) {
						f(
							arguments.length,
							2,
							'fromXpsMem',
							'(PDFNet.PDFDoc, ArrayBuffer|TypedArray)',
							[
								[e, 'PDFDoc'],
								[t, 'ArrayBuffer'],
							]
						);
						var n = b(t, !1);
						return p.sendWithPromise('convertFromXpsMem', {
							in_pdfdoc: e.id,
							buf: n,
						});
					}),
					(p.Convert.createReflow = function (e, t) {
						return (
							f(arguments.length, 2, 'createReflow', '(PDFNet.Page, string)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('convertCreateReflow', {
									in_page: e.id,
									json_zones: t,
								})
								.then(function (e) {
									return y(p.Reflow, e);
								})
						);
					}),
					(p.Convert.fromTextWithBuffer = function (e, t, n) {
						return (
							void 0 === n && (n = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fromTextWithBuffer',
								'(PDFNet.PDFDoc, ArrayBuffer|TypedArray, PDFNet.Obj)',
								[
									[e, 'PDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							),
							(t = b(t, !1)),
							p.sendWithPromise('convertFromTextWithBuffer', {
								in_pdfdoc: e.id,
								in_filename: t,
								options: n.id,
							})
						);
					}),
					(p.Convert.toXpsBuffer = function (t, e) {
						var n;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'toXpsBuffer',
								'(PDFNet.PDFDoc, PDFNet.Obj)',
								[
									[t, 'PDFDoc'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.XPSOutputOptions',
									],
								]
							),
							(e =
								'PDFNet.Convert.XPSOutputOptions' === e.name
									? ((n = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(n));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertToXpsBuffer', {
										in_pdfdoc: t.id,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.Convert.fileToXpsWithBuffer = function (t, n, e) {
						var i;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fileToXpsWithBuffer',
								'(ArrayBuffer|TypedArray, string, PDFNet.Obj)',
								[
									[t, 'ArrayBuffer'],
									[n, 'string'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.XPSOutputOptions',
									],
								]
							),
							n.startsWith('.') || (n = '.' + n),
							(t = b(t, !1)),
							(e =
								'PDFNet.Convert.XPSOutputOptions' === e.name
									? ((i = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(i));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertFileToXpsWithBuffer', {
										in_inputFilename: t,
										in_inputFilename_extension: n,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.Convert.fileToXodWithBuffer = function (t, n, e) {
						var i;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fileToXodWithBuffer',
								'(ArrayBuffer|TypedArray, string, PDFNet.Obj)',
								[
									[t, 'ArrayBuffer'],
									[n, 'string'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.XODOutputOptions',
									],
								]
							),
							n.startsWith('.') || (n = '.' + n),
							(t = b(t, !1)),
							(e =
								'PDFNet.Convert.XODOutputOptions' === e.name
									? ((i = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(i));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertFileToXodWithBuffer', {
										in_filename: t,
										in_filename_extension: n,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.Convert.toXodBuffer = function (t, e) {
						var n;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'toXodBuffer',
								'(PDFNet.PDFDoc, PDFNet.Obj)',
								[
									[t, 'PDFDoc'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.XODOutputOptions',
									],
								]
							),
							(e =
								'PDFNet.Convert.XODOutputOptions' === e.name
									? ((n = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(n));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertToXodBuffer', {
										in_pdfdoc: t.id,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.ConversionMonitor.prototype.next = function () {
						return p.sendWithPromise('ConversionMonitor.next', {
							conversionMonitor: this.id,
						});
					}),
					(p.ConversionMonitor.prototype.ready = function () {
						return p.sendWithPromise('ConversionMonitor.ready', {
							conversionMonitor: this.id,
						});
					}),
					(p.ConversionMonitor.prototype.progress = function () {
						return p.sendWithPromise('ConversionMonitor.progress', {
							conversionMonitor: this.id,
						});
					}),
					(p.ConversionMonitor.prototype.filter = function () {
						return p
							.sendWithPromise('ConversionMonitor.filter', {
								conversionMonitor: this.id,
							})
							.then(function (e) {
								return y(p.Filter, e);
							});
					}),
					(p.Convert.officeToPdfWithFilter = function (t, n, e) {
						var i;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'officeToPdfWithFilter',
								'(PDFNet.PDFDoc, PDFNet.Filter, PDFNet.Obj)',
								[
									[t, 'PDFDoc'],
									[n, 'Object', p.Filter, 'Filter'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.ConversionOptions',
									],
								]
							),
							0 != n.id && S(n.id),
							(e =
								'PDFNet.Convert.ConversionOptions' === e.name
									? ((i = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(i));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p.sendWithPromise('convertOfficeToPdfWithFilter', {
									in_pdfdoc: t.id,
									no_own_in_stream: n.id,
									options: e.id,
								});
							})
						);
					}),
					(p.Convert.toPdfWithBuffer = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'toPdfWithBuffer',
								'(PDFNet.PDFDoc, ArrayBuffer|TypedArray, string)',
								[
									[e, 'PDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'string'],
								]
							),
							n.startsWith('.') || (n = '.' + n),
							(t = b(t, !1)),
							p.sendWithPromise('convertToPdfWithBuffer', {
								in_pdfdoc: e.id,
								in_filename: t,
								in_filename_extension: n,
							})
						);
					}),
					(p.Convert.fromTiff = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'fromTiff',
								'(PDFNet.PDFDoc, PDFNet.Filter)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.Filter, 'Filter'],
								]
							),
							p.sendWithPromise('convertFromTiff', {
								in_pdfdoc: e.id,
								in_data: t.id,
							})
						);
					}),
					(p.Convert.pageToHtml = function (e) {
						return (
							f(arguments.length, 1, 'pageToHtml', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('convertPageToHtml', { page: e.id })
						);
					}),
					(p.Convert.pageToHtmlZoned = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'pageToHtmlZoned',
								'(PDFNet.Page, string)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'string'],
								]
							),
							p.sendWithPromise('convertPageToHtmlZoned', {
								page: e.id,
								json_zones: t,
							})
						);
					}),
					(p.Convert.fileToTiffWithBuffer = function (t, n, e) {
						var i;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fileToTiffWithBuffer',
								'(ArrayBuffer|TypedArray, string, PDFNet.Obj)',
								[
									[t, 'ArrayBuffer'],
									[n, 'string'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.TiffOutputOptions',
									],
								]
							),
							n.startsWith('.') || (n = '.' + n),
							(t = b(t, !1)),
							(e =
								'PDFNet.Convert.TiffOutputOptions' === e.name
									? ((i = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(i));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertFileToTiffWithBuffer', {
										in_filename: t,
										in_filename_extension: n,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.Convert.toTiffBuffer = function (t, e) {
						var n;
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'toTiffBuffer',
								'(PDFNet.PDFDoc, PDFNet.Obj)',
								[
									[t, 'PDFDoc'],
									[
										e,
										'OptionObject',
										p.Obj,
										'Obj',
										'PDFNet.Convert.TiffOutputOptions',
									],
								]
							),
							(e =
								'PDFNet.Convert.TiffOutputOptions' === e.name
									? ((n = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(n));
									  }))
									: Promise.resolve(e)).then(function (e) {
								return p
									.sendWithPromise('convertToTiffBuffer', {
										in_pdfdoc: t.id,
										options: e.id,
									})
									.then(function (e) {
										return new Uint8Array(e);
									});
							})
						);
					}),
					(p.Date.init = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'init',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p
								.sendWithPromise('dateInit', {
									year: e,
									month: t,
									day: n,
									hour: i,
									minute: r,
									second: o,
								})
								.then(function (e) {
									return new p.Date(e);
								})
						);
					}),
					(p.Date.prototype.isValid = function () {
						return (
							P('isValid', this.yieldFunction),
							p.sendWithPromise('Date.isValid', { date: this })
						);
					}),
					(p.Date.prototype.attach = function (e) {
						f(arguments.length, 1, 'attach', '(PDFNet.Obj)', [
							[e, 'Object', p.Obj, 'Obj'],
						]),
							P('attach', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Date.attach'),
							p
								.sendWithPromise('Date.attach', { date: this, d: e.id })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Date.prototype.update = function (e) {
						void 0 === e && (e = new p.Obj('__null')),
							f(arguments.length, 0, 'update', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							P('update', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Date.update'),
							p
								.sendWithPromise('Date.update', { date: this, d: e.id })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.date, t), e.result;
								})
						);
					}),
					(p.Date.prototype.setCurrentTime = function () {
						P('setCurrentTime', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Date.setCurrentTime'),
							p
								.sendWithPromise('Date.setCurrentTime', { date: this })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Destination.createXYZ = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'createXYZ',
								'(PDFNet.Page, number, number, number)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('destinationCreateXYZ', {
									page: e.id,
									left: t,
									top: n,
									zoom: i,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFit = function (e) {
						return (
							f(arguments.length, 1, 'createFit', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p
								.sendWithPromise('destinationCreateFit', { page: e.id })
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitH = function (e, t) {
						return (
							f(arguments.length, 2, 'createFitH', '(PDFNet.Page, number)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('destinationCreateFitH', {
									page: e.id,
									top: t,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitV = function (e, t) {
						return (
							f(arguments.length, 2, 'createFitV', '(PDFNet.Page, number)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('destinationCreateFitV', {
									page: e.id,
									left: t,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitR = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'createFitR',
								'(PDFNet.Page, number, number, number, number)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p
								.sendWithPromise('destinationCreateFitR', {
									page: e.id,
									left: t,
									bottom: n,
									right: i,
									top: r,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitB = function (e) {
						return (
							f(arguments.length, 1, 'createFitB', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p
								.sendWithPromise('destinationCreateFitB', { page: e.id })
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitBH = function (e, t) {
						return (
							f(arguments.length, 2, 'createFitBH', '(PDFNet.Page, number)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('destinationCreateFitBH', {
									page: e.id,
									top: t,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.createFitBV = function (e, t) {
						return (
							f(arguments.length, 2, 'createFitBV', '(PDFNet.Page, number)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('destinationCreateFitBV', {
									page: e.id,
									left: t,
								})
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('destinationCreate', { dest: e.id })
								.then(function (e) {
									return D(p.Destination, e);
								})
						);
					}),
					(p.Destination.prototype.copy = function () {
						return p
							.sendWithPromise('Destination.copy', { d: this.id })
							.then(function (e) {
								return D(p.Destination, e);
							});
					}),
					(p.Destination.prototype.isValid = function () {
						return p.sendWithPromise('Destination.isValid', { dest: this.id });
					}),
					(p.Destination.prototype.getFitType = function () {
						return p.sendWithPromise('Destination.getFitType', {
							dest: this.id,
						});
					}),
					(p.Destination.prototype.getPage = function () {
						return p
							.sendWithPromise('Destination.getPage', { dest: this.id })
							.then(function (e) {
								return D(p.Page, e);
							});
					}),
					(p.Destination.prototype.setPage = function (e) {
						return (
							f(arguments.length, 1, 'setPage', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('Destination.setPage', {
								dest: this.id,
								page: e.id,
							})
						);
					}),
					(p.Destination.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Destination.getSDFObj', { dest: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Destination.prototype.getExplicitDestObj = function () {
						return p
							.sendWithPromise('Destination.getExplicitDestObj', {
								dest: this.id,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.getTransform = function () {
						return p
							.sendWithPromise('GState.getTransform', { gs: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.GState.prototype.getStrokeColorSpace = function () {
						return p
							.sendWithPromise('GState.getStrokeColorSpace', { gs: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.GState.prototype.getFillColorSpace = function () {
						return p
							.sendWithPromise('GState.getFillColorSpace', { gs: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.GState.prototype.getStrokeColor = function () {
						return p
							.sendWithPromise('GState.getStrokeColor', { gs: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.GState.prototype.getStrokePattern = function () {
						return p
							.sendWithPromise('GState.getStrokePattern', { gs: this.id })
							.then(function (e) {
								return y(p.PatternColor, e);
							});
					}),
					(p.GState.prototype.getFillColor = function () {
						return p
							.sendWithPromise('GState.getFillColor', { gs: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.GState.prototype.getFillPattern = function () {
						return p
							.sendWithPromise('GState.getFillPattern', { gs: this.id })
							.then(function (e) {
								return y(p.PatternColor, e);
							});
					}),
					(p.GState.prototype.getFlatness = function () {
						return p.sendWithPromise('GState.getFlatness', { gs: this.id });
					}),
					(p.GState.prototype.getLineCap = function () {
						return p.sendWithPromise('GState.getLineCap', { gs: this.id });
					}),
					(p.GState.prototype.getLineJoin = function () {
						return p.sendWithPromise('GState.getLineJoin', { gs: this.id });
					}),
					(p.GState.prototype.getLineWidth = function () {
						return p.sendWithPromise('GState.getLineWidth', { gs: this.id });
					}),
					(p.GState.prototype.getMiterLimit = function () {
						return p.sendWithPromise('GState.getMiterLimit', { gs: this.id });
					}),
					(p.GState.prototype.getPhase = function () {
						return p.sendWithPromise('GState.getPhase', { gs: this.id });
					}),
					(p.GState.prototype.getCharSpacing = function () {
						return p.sendWithPromise('GState.getCharSpacing', { gs: this.id });
					}),
					(p.GState.prototype.getWordSpacing = function () {
						return p.sendWithPromise('GState.getWordSpacing', { gs: this.id });
					}),
					(p.GState.prototype.getHorizontalScale = function () {
						return p.sendWithPromise('GState.getHorizontalScale', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getLeading = function () {
						return p.sendWithPromise('GState.getLeading', { gs: this.id });
					}),
					(p.GState.prototype.getFont = function () {
						return p
							.sendWithPromise('GState.getFont', { gs: this.id })
							.then(function (e) {
								return y(p.Font, e);
							});
					}),
					(p.GState.prototype.getFontSize = function () {
						return p.sendWithPromise('GState.getFontSize', { gs: this.id });
					}),
					(p.GState.prototype.getTextRenderMode = function () {
						return p.sendWithPromise('GState.getTextRenderMode', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getTextRise = function () {
						return p.sendWithPromise('GState.getTextRise', { gs: this.id });
					}),
					(p.GState.prototype.isTextKnockout = function () {
						return p.sendWithPromise('GState.isTextKnockout', { gs: this.id });
					}),
					(p.GState.prototype.getRenderingIntent = function () {
						return p.sendWithPromise('GState.getRenderingIntent', {
							gs: this.id,
						});
					}),
					(p.GState.getRenderingIntentType = function (e) {
						return (
							f(arguments.length, 1, 'getRenderingIntentType', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('gStateGetRenderingIntentType', { name: e })
						);
					}),
					(p.GState.prototype.getBlendMode = function () {
						return p.sendWithPromise('GState.getBlendMode', { gs: this.id });
					}),
					(p.GState.prototype.getFillOpacity = function () {
						return p.sendWithPromise('GState.getFillOpacity', { gs: this.id });
					}),
					(p.GState.prototype.getStrokeOpacity = function () {
						return p.sendWithPromise('GState.getStrokeOpacity', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getAISFlag = function () {
						return p.sendWithPromise('GState.getAISFlag', { gs: this.id });
					}),
					(p.GState.prototype.getSoftMask = function () {
						return p
							.sendWithPromise('GState.getSoftMask', { gs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.getSoftMaskTransform = function () {
						return p
							.sendWithPromise('GState.getSoftMaskTransform', { gs: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.GState.prototype.getStrokeOverprint = function () {
						return p.sendWithPromise('GState.getStrokeOverprint', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getFillOverprint = function () {
						return p.sendWithPromise('GState.getFillOverprint', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getOverprintMode = function () {
						return p.sendWithPromise('GState.getOverprintMode', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getAutoStrokeAdjust = function () {
						return p.sendWithPromise('GState.getAutoStrokeAdjust', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getSmoothnessTolerance = function () {
						return p.sendWithPromise('GState.getSmoothnessTolerance', {
							gs: this.id,
						});
					}),
					(p.GState.prototype.getTransferFunct = function () {
						return p
							.sendWithPromise('GState.getTransferFunct', { gs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.getBlackGenFunct = function () {
						return p
							.sendWithPromise('GState.getBlackGenFunct', { gs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.getUCRFunct = function () {
						return p
							.sendWithPromise('GState.getUCRFunct', { gs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.getHalftone = function () {
						return p
							.sendWithPromise('GState.getHalftone', { gs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.GState.prototype.setTransformMatrix = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setTransformMatrix',
								'(PDFNet.Matrix2D)',
								[[e, 'Structure', p.Matrix2D, 'Matrix2D']]
							),
							F('setTransformMatrix', [[e, 0]]),
							p.sendWithPromise('GState.setTransformMatrix', {
								gs: this.id,
								mtx: e,
							})
						);
					}),
					(p.GState.prototype.setTransform = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'setTransform',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p.sendWithPromise('GState.setTransform', {
								gs: this.id,
								a: e,
								b: t,
								c: n,
								d: i,
								h: r,
								v: o,
							})
						);
					}),
					(p.GState.prototype.concatMatrix = function (e) {
						return (
							f(arguments.length, 1, 'concatMatrix', '(PDFNet.Matrix2D)', [
								[e, 'Structure', p.Matrix2D, 'Matrix2D'],
							]),
							F('concatMatrix', [[e, 0]]),
							p.sendWithPromise('GState.concatMatrix', { gs: this.id, mtx: e })
						);
					}),
					(p.GState.prototype.concat = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'concat',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p.sendWithPromise('GState.concat', {
								gs: this.id,
								a: e,
								b: t,
								c: n,
								d: i,
								h: r,
								v: o,
							})
						);
					}),
					(p.GState.prototype.setStrokeColorSpace = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setStrokeColorSpace',
								'(PDFNet.ColorSpace)',
								[[e, 'Object', p.ColorSpace, 'ColorSpace']]
							),
							p.sendWithPromise('GState.setStrokeColorSpace', {
								gs: this.id,
								cs: e.id,
							})
						);
					}),
					(p.GState.prototype.setFillColorSpace = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setFillColorSpace',
								'(PDFNet.ColorSpace)',
								[[e, 'Object', p.ColorSpace, 'ColorSpace']]
							),
							p.sendWithPromise('GState.setFillColorSpace', {
								gs: this.id,
								cs: e.id,
							})
						);
					}),
					(p.GState.prototype.setStrokeColorWithColorPt = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setStrokeColorWithColorPt',
								'(PDFNet.ColorPt)',
								[[e, 'Object', p.ColorPt, 'ColorPt']]
							),
							p.sendWithPromise('GState.setStrokeColorWithColorPt', {
								gs: this.id,
								c: e.id,
							})
						);
					}),
					(p.GState.prototype.setStrokeColorWithPattern = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setStrokeColorWithPattern',
								'(PDFNet.PatternColor)',
								[[e, 'Object', p.PatternColor, 'PatternColor']]
							),
							p.sendWithPromise('GState.setStrokeColorWithPattern', {
								gs: this.id,
								pattern: e.id,
							})
						);
					}),
					(p.GState.prototype.setStrokeColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setStrokeColor',
								'(PDFNet.PatternColor, PDFNet.ColorPt)',
								[
									[e, 'Object', p.PatternColor, 'PatternColor'],
									[t, 'Object', p.ColorPt, 'ColorPt'],
								]
							),
							p.sendWithPromise('GState.setStrokeColor', {
								gs: this.id,
								pattern: e.id,
								c: t.id,
							})
						);
					}),
					(p.GState.prototype.setFillColorWithColorPt = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setFillColorWithColorPt',
								'(PDFNet.ColorPt)',
								[[e, 'Object', p.ColorPt, 'ColorPt']]
							),
							p.sendWithPromise('GState.setFillColorWithColorPt', {
								gs: this.id,
								c: e.id,
							})
						);
					}),
					(p.GState.prototype.setFillColorWithPattern = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setFillColorWithPattern',
								'(PDFNet.PatternColor)',
								[[e, 'Object', p.PatternColor, 'PatternColor']]
							),
							p.sendWithPromise('GState.setFillColorWithPattern', {
								gs: this.id,
								pattern: e.id,
							})
						);
					}),
					(p.GState.prototype.setFillColor = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setFillColor',
								'(PDFNet.PatternColor, PDFNet.ColorPt)',
								[
									[e, 'Object', p.PatternColor, 'PatternColor'],
									[t, 'Object', p.ColorPt, 'ColorPt'],
								]
							),
							p.sendWithPromise('GState.setFillColor', {
								gs: this.id,
								pattern: e.id,
								c: t.id,
							})
						);
					}),
					(p.GState.prototype.setFlatness = function (e) {
						return (
							f(arguments.length, 1, 'setFlatness', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setFlatness', {
								gs: this.id,
								flatness: e,
							})
						);
					}),
					(p.GState.prototype.setLineCap = function (e) {
						return (
							f(arguments.length, 1, 'setLineCap', '(number)', [[e, 'number']]),
							p.sendWithPromise('GState.setLineCap', { gs: this.id, cap: e })
						);
					}),
					(p.GState.prototype.setLineJoin = function (e) {
						return (
							f(arguments.length, 1, 'setLineJoin', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setLineJoin', { gs: this.id, join: e })
						);
					}),
					(p.GState.prototype.setLineWidth = function (e) {
						return (
							f(arguments.length, 1, 'setLineWidth', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setLineWidth', {
								gs: this.id,
								width: e,
							})
						);
					}),
					(p.GState.prototype.setMiterLimit = function (e) {
						return (
							f(arguments.length, 1, 'setMiterLimit', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setMiterLimit', {
								gs: this.id,
								miter_limit: e,
							})
						);
					}),
					(p.GState.prototype.setDashPattern = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setDashPattern',
								'(Array<number>, number)',
								[
									[e, 'Array'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('GState.setDashPattern', {
								gs: this.id,
								dash_array: e,
								phase: t,
							})
						);
					}),
					(p.GState.prototype.setCharSpacing = function (e) {
						return (
							f(arguments.length, 1, 'setCharSpacing', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setCharSpacing', {
								gs: this.id,
								char_spacing: e,
							})
						);
					}),
					(p.GState.prototype.setWordSpacing = function (e) {
						return (
							f(arguments.length, 1, 'setWordSpacing', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setWordSpacing', {
								gs: this.id,
								word_spacing: e,
							})
						);
					}),
					(p.GState.prototype.setHorizontalScale = function (e) {
						return (
							f(arguments.length, 1, 'setHorizontalScale', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setHorizontalScale', {
								gs: this.id,
								hscale: e,
							})
						);
					}),
					(p.GState.prototype.setLeading = function (e) {
						return (
							f(arguments.length, 1, 'setLeading', '(number)', [[e, 'number']]),
							p.sendWithPromise('GState.setLeading', {
								gs: this.id,
								leading: e,
							})
						);
					}),
					(p.GState.prototype.setFont = function (e, t) {
						return (
							f(arguments.length, 2, 'setFont', '(PDFNet.Font, number)', [
								[e, 'Object', p.Font, 'Font'],
								[t, 'number'],
							]),
							p.sendWithPromise('GState.setFont', {
								gs: this.id,
								font: e.id,
								font_sz: t,
							})
						);
					}),
					(p.GState.prototype.setTextRenderMode = function (e) {
						return (
							f(arguments.length, 1, 'setTextRenderMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setTextRenderMode', {
								gs: this.id,
								rmode: e,
							})
						);
					}),
					(p.GState.prototype.setTextRise = function (e) {
						return (
							f(arguments.length, 1, 'setTextRise', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setTextRise', { gs: this.id, rise: e })
						);
					}),
					(p.GState.prototype.setTextKnockout = function (e) {
						return (
							f(arguments.length, 1, 'setTextKnockout', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('GState.setTextKnockout', {
								gs: this.id,
								knockout: e,
							})
						);
					}),
					(p.GState.prototype.setRenderingIntent = function (e) {
						return (
							f(arguments.length, 1, 'setRenderingIntent', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setRenderingIntent', {
								gs: this.id,
								intent: e,
							})
						);
					}),
					(p.GState.prototype.setBlendMode = function (e) {
						return (
							f(arguments.length, 1, 'setBlendMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setBlendMode', { gs: this.id, BM: e })
						);
					}),
					(p.GState.prototype.setFillOpacity = function (e) {
						return (
							f(arguments.length, 1, 'setFillOpacity', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setFillOpacity', { gs: this.id, ca: e })
						);
					}),
					(p.GState.prototype.setStrokeOpacity = function (e) {
						return (
							f(arguments.length, 1, 'setStrokeOpacity', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setStrokeOpacity', {
								gs: this.id,
								ca: e,
							})
						);
					}),
					(p.GState.prototype.setAISFlag = function (e) {
						return (
							f(arguments.length, 1, 'setAISFlag', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('GState.setAISFlag', { gs: this.id, AIS: e })
						);
					}),
					(p.GState.prototype.setSoftMask = function (e) {
						return (
							f(arguments.length, 1, 'setSoftMask', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('GState.setSoftMask', { gs: this.id, SM: e.id })
						);
					}),
					(p.GState.prototype.setStrokeOverprint = function (e) {
						return (
							f(arguments.length, 1, 'setStrokeOverprint', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('GState.setStrokeOverprint', {
								gs: this.id,
								OP: e,
							})
						);
					}),
					(p.GState.prototype.setFillOverprint = function (e) {
						return (
							f(arguments.length, 1, 'setFillOverprint', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('GState.setFillOverprint', {
								gs: this.id,
								op: e,
							})
						);
					}),
					(p.GState.prototype.setOverprintMode = function (e) {
						return (
							f(arguments.length, 1, 'setOverprintMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setOverprintMode', {
								gs: this.id,
								OPM: e,
							})
						);
					}),
					(p.GState.prototype.setAutoStrokeAdjust = function (e) {
						return (
							f(arguments.length, 1, 'setAutoStrokeAdjust', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('GState.setAutoStrokeAdjust', {
								gs: this.id,
								SA: e,
							})
						);
					}),
					(p.GState.prototype.setSmoothnessTolerance = function (e) {
						return (
							f(arguments.length, 1, 'setSmoothnessTolerance', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('GState.setSmoothnessTolerance', {
								gs: this.id,
								SM: e,
							})
						);
					}),
					(p.GState.prototype.setBlackGenFunct = function (e) {
						return (
							f(arguments.length, 1, 'setBlackGenFunct', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('GState.setBlackGenFunct', {
								gs: this.id,
								BG: e.id,
							})
						);
					}),
					(p.GState.prototype.setUCRFunct = function (e) {
						return (
							f(arguments.length, 1, 'setUCRFunct', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('GState.setUCRFunct', {
								gs: this.id,
								UCR: e.id,
							})
						);
					}),
					(p.GState.prototype.setTransferFunct = function (e) {
						return (
							f(arguments.length, 1, 'setTransferFunct', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('GState.setTransferFunct', {
								gs: this.id,
								TR: e.id,
							})
						);
					}),
					(p.GState.prototype.setHalftone = function (e) {
						return (
							f(arguments.length, 1, 'setHalftone', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('GState.setHalftone', { gs: this.id, HT: e.id })
						);
					}),
					(p.Element.prototype.getType = function () {
						return p.sendWithPromise('Element.getType', { e: this.id });
					}),
					(p.Element.prototype.getGState = function () {
						return p
							.sendWithPromise('Element.getGState', { e: this.id })
							.then(function (e) {
								return D(p.GState, e);
							});
					}),
					(p.Element.prototype.getCTM = function () {
						return p
							.sendWithPromise('Element.getCTM', { e: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Element.prototype.getParentStructElement = function () {
						return p
							.sendWithPromise('Element.getParentStructElement', { e: this.id })
							.then(function (e) {
								return new p.SElement(e);
							});
					}),
					(p.Element.prototype.getStructMCID = function () {
						return p.sendWithPromise('Element.getStructMCID', { e: this.id });
					}),
					(p.Element.prototype.isOCVisible = function () {
						return p.sendWithPromise('Element.isOCVisible', { e: this.id });
					}),
					(p.Element.prototype.isClippingPath = function () {
						return p.sendWithPromise('Element.isClippingPath', { e: this.id });
					}),
					(p.Element.prototype.isStroked = function () {
						return p.sendWithPromise('Element.isStroked', { e: this.id });
					}),
					(p.Element.prototype.isFilled = function () {
						return p.sendWithPromise('Element.isFilled', { e: this.id });
					}),
					(p.Element.prototype.isWindingFill = function () {
						return p.sendWithPromise('Element.isWindingFill', { e: this.id });
					}),
					(p.Element.prototype.isClipWindingFill = function () {
						return p.sendWithPromise('Element.isClipWindingFill', {
							e: this.id,
						});
					}),
					(p.Element.prototype.setPathClip = function (e) {
						return (
							f(arguments.length, 1, 'setPathClip', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Element.setPathClip', { e: this.id, clip: e })
						);
					}),
					(p.Element.prototype.setPathStroke = function (e) {
						return (
							f(arguments.length, 1, 'setPathStroke', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Element.setPathStroke', {
								e: this.id,
								stroke: e,
							})
						);
					}),
					(p.Element.prototype.setPathFill = function (e) {
						return (
							f(arguments.length, 1, 'setPathFill', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Element.setPathFill', { e: this.id, fill: e })
						);
					}),
					(p.Element.prototype.setWindingFill = function (e) {
						return (
							f(arguments.length, 1, 'setWindingFill', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Element.setWindingFill', {
								e: this.id,
								winding_rule: e,
							})
						);
					}),
					(p.Element.prototype.setClipWindingFill = function (e) {
						return (
							f(arguments.length, 1, 'setClipWindingFill', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Element.setClipWindingFill', {
								e: this.id,
								winding_rule: e,
							})
						);
					}),
					(p.Element.prototype.setPathTypes = function (e, t) {
						return (
							f(arguments.length, 2, 'setPathTypes', '(string, number)', [
								[e, 'string'],
								[t, 'number'],
							]),
							p.sendWithPromise('Element.setPathTypes', {
								e: this.id,
								in_seg_types: e,
								count: t,
							})
						);
					}),
					(p.Element.prototype.getXObject = function () {
						return p
							.sendWithPromise('Element.getXObject', { e: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Element.prototype.getImageData = function () {
						return p
							.sendWithPromise('Element.getImageData', { e: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.Element.prototype.getImageDataSize = function () {
						return p.sendWithPromise('Element.getImageDataSize', {
							e: this.id,
						});
					}),
					(p.Element.prototype.getImageColorSpace = function () {
						return p
							.sendWithPromise('Element.getImageColorSpace', { e: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.Element.prototype.getImageWidth = function () {
						return p.sendWithPromise('Element.getImageWidth', { e: this.id });
					}),
					(p.Element.prototype.getImageHeight = function () {
						return p.sendWithPromise('Element.getImageHeight', { e: this.id });
					}),
					(p.Element.prototype.getDecodeArray = function () {
						return p
							.sendWithPromise('Element.getDecodeArray', { e: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Element.prototype.getBitsPerComponent = function () {
						return p.sendWithPromise('Element.getBitsPerComponent', {
							e: this.id,
						});
					}),
					(p.Element.prototype.getComponentNum = function () {
						return p.sendWithPromise('Element.getComponentNum', { e: this.id });
					}),
					(p.Element.prototype.isImageMask = function () {
						return p.sendWithPromise('Element.isImageMask', { e: this.id });
					}),
					(p.Element.prototype.isImageInterpolate = function () {
						return p.sendWithPromise('Element.isImageInterpolate', {
							e: this.id,
						});
					}),
					(p.Element.prototype.getMask = function () {
						return p
							.sendWithPromise('Element.getMask', { e: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Element.prototype.getImageRenderingIntent = function () {
						return p.sendWithPromise('Element.getImageRenderingIntent', {
							e: this.id,
						});
					}),
					(p.Element.prototype.getTextString = function () {
						return p.sendWithPromise('Element.getTextString', { e: this.id });
					}),
					(p.Element.prototype.getTextMatrix = function () {
						return p
							.sendWithPromise('Element.getTextMatrix', { e: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Element.prototype.getCharIterator = function () {
						return p
							.sendWithPromise('Element.getCharIterator', { e: this.id })
							.then(function (e) {
								return y(p.Iterator, e, 'CharData');
							});
					}),
					(p.Element.prototype.getTextLength = function () {
						return p.sendWithPromise('Element.getTextLength', { e: this.id });
					}),
					(p.Element.prototype.getPosAdjustment = function () {
						return p.sendWithPromise('Element.getPosAdjustment', {
							e: this.id,
						});
					}),
					(p.Element.prototype.getNewTextLineOffset = function () {
						return p.sendWithPromise('Element.getNewTextLineOffset', {
							e: this.id,
						});
					}),
					(p.Element.prototype.hasTextMatrix = function () {
						return p.sendWithPromise('Element.hasTextMatrix', { e: this.id });
					}),
					(p.Element.prototype.setTextData = function (e) {
						f(arguments.length, 1, 'setTextData', '(ArrayBuffer|TypedArray)', [
							[e, 'ArrayBuffer'],
						]);
						var t = b(e, !1);
						return p.sendWithPromise('Element.setTextData', {
							e: this.id,
							buf_text_data: t,
						});
					}),
					(p.Element.prototype.setTextMatrix = function (e) {
						return (
							f(arguments.length, 1, 'setTextMatrix', '(PDFNet.Matrix2D)', [
								[e, 'Structure', p.Matrix2D, 'Matrix2D'],
							]),
							F('setTextMatrix', [[e, 0]]),
							p.sendWithPromise('Element.setTextMatrix', { e: this.id, mtx: e })
						);
					}),
					(p.Element.prototype.setTextMatrixEntries = function (
						e,
						t,
						n,
						i,
						r,
						o
					) {
						return (
							f(
								arguments.length,
								6,
								'setTextMatrixEntries',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p.sendWithPromise('Element.setTextMatrixEntries', {
								e: this.id,
								a: e,
								b: t,
								c: n,
								d: i,
								h: r,
								v: o,
							})
						);
					}),
					(p.Element.prototype.setPosAdjustment = function (e) {
						return (
							f(arguments.length, 1, 'setPosAdjustment', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Element.setPosAdjustment', {
								e: this.id,
								adjust: e,
							})
						);
					}),
					(p.Element.prototype.updateTextMetrics = function () {
						return p.sendWithPromise('Element.updateTextMetrics', {
							e: this.id,
						});
					}),
					(p.Element.prototype.setNewTextLineOffset = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setNewTextLineOffset',
								'(number, number)',
								[
									[e, 'number'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('Element.setNewTextLineOffset', {
								e: this.id,
								dx: e,
								dy: t,
							})
						);
					}),
					(p.Element.prototype.getShading = function () {
						return p
							.sendWithPromise('Element.getShading', { e: this.id })
							.then(function (e) {
								return y(p.Shading, e);
							});
					}),
					(p.Element.prototype.getMCPropertyDict = function () {
						return p
							.sendWithPromise('Element.getMCPropertyDict', { e: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Element.prototype.getMCTag = function () {
						return p
							.sendWithPromise('Element.getMCTag', { e: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ShapedText.prototype.getScale = function () {
						return p.sendWithPromise('ShapedText.getScale', { self: this.id });
					}),
					(p.ShapedText.prototype.getShapingStatus = function () {
						return p.sendWithPromise('ShapedText.getShapingStatus', {
							self: this.id,
						});
					}),
					(p.ShapedText.prototype.getFailureReason = function () {
						return p.sendWithPromise('ShapedText.getFailureReason', {
							self: this.id,
						});
					}),
					(p.ShapedText.prototype.getText = function () {
						return p.sendWithPromise('ShapedText.getText', { self: this.id });
					}),
					(p.ShapedText.prototype.getNumGlyphs = function () {
						return p.sendWithPromise('ShapedText.getNumGlyphs', {
							self: this.id,
						});
					}),
					(p.ShapedText.prototype.getGlyph = function (e) {
						return (
							f(arguments.length, 1, 'getGlyph', '(number)', [[e, 'number']]),
							p.sendWithPromise('ShapedText.getGlyph', {
								self: this.id,
								index: e,
							})
						);
					}),
					(p.ShapedText.prototype.getGlyphXPos = function (e) {
						return (
							f(arguments.length, 1, 'getGlyphXPos', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ShapedText.getGlyphXPos', {
								self: this.id,
								index: e,
							})
						);
					}),
					(p.ShapedText.prototype.getGlyphYPos = function (e) {
						return (
							f(arguments.length, 1, 'getGlyphYPos', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('ShapedText.getGlyphYPos', {
								self: this.id,
								index: e,
							})
						);
					}),
					(p.ElementBuilder.create = function () {
						return p
							.sendWithPromise('elementBuilderCreate', {})
							.then(function (e) {
								return y(p.ElementBuilder, e);
							});
					}),
					(p.ElementBuilder.prototype.reset = function (e) {
						return (
							void 0 === e && (e = new p.GState('0')),
							f(arguments.length, 0, 'reset', '(PDFNet.GState)', [
								[e, 'Object', p.GState, 'GState'],
							]),
							p.sendWithPromise('ElementBuilder.reset', {
								b: this.id,
								gs: e.id,
							})
						);
					}),
					(p.ElementBuilder.prototype.createImage = function (e) {
						return (
							f(arguments.length, 1, 'createImage', '(PDFNet.Image)', [
								[e, 'Object', p.Image, 'Image'],
							]),
							p
								.sendWithPromise('ElementBuilder.createImage', {
									b: this.id,
									img: e.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createImageFromMatrix = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createImageFromMatrix',
								'(PDFNet.Image, PDFNet.Matrix2D)',
								[
									[e, 'Object', p.Image, 'Image'],
									[t, 'Structure', p.Matrix2D, 'Matrix2D'],
								]
							),
							F('createImageFromMatrix', [[t, 1]]),
							p
								.sendWithPromise('ElementBuilder.createImageFromMatrix', {
									b: this.id,
									img: e.id,
									mtx: t,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createImageScaled = function (
						e,
						t,
						n,
						i,
						r
					) {
						return (
							f(
								arguments.length,
								5,
								'createImageScaled',
								'(PDFNet.Image, number, number, number, number)',
								[
									[e, 'Object', p.Image, 'Image'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createImageScaled', {
									b: this.id,
									img: e.id,
									x: t,
									y: n,
									hscale: i,
									vscale: r,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createGroupBegin = function () {
						return p
							.sendWithPromise('ElementBuilder.createGroupBegin', {
								b: this.id,
							})
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createGroupEnd = function () {
						return p
							.sendWithPromise('ElementBuilder.createGroupEnd', { b: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createShading = function (e) {
						return (
							f(arguments.length, 1, 'createShading', '(PDFNet.Shading)', [
								[e, 'Object', p.Shading, 'Shading'],
							]),
							p
								.sendWithPromise('ElementBuilder.createShading', {
									b: this.id,
									sh: e.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createFormFromStream = function (e) {
						return (
							f(arguments.length, 1, 'createFormFromStream', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('ElementBuilder.createFormFromStream', {
									b: this.id,
									form: e.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createFormFromPage = function (e) {
						return (
							f(arguments.length, 1, 'createFormFromPage', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p
								.sendWithPromise('ElementBuilder.createFormFromPage', {
									b: this.id,
									page: e.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createFormFromDoc = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createFormFromDoc',
								'(PDFNet.Page, PDFNet.PDFDoc)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'PDFDoc'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createFormFromDoc', {
									b: this.id,
									page: e.id,
									doc: t.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createTextBeginWithFont = function (
						e,
						t
					) {
						return (
							f(
								arguments.length,
								2,
								'createTextBeginWithFont',
								'(PDFNet.Font, number)',
								[
									[e, 'Object', p.Font, 'Font'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createTextBeginWithFont', {
									b: this.id,
									font: e.id,
									font_sz: t,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createTextBegin = function () {
						return p
							.sendWithPromise('ElementBuilder.createTextBegin', { b: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createTextEnd = function () {
						return p
							.sendWithPromise('ElementBuilder.createTextEnd', { b: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createTextRun = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createTextRun',
								'(string, PDFNet.Font, number)',
								[
									[e, 'string'],
									[t, 'Object', p.Font, 'Font'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createTextRun', {
									b: this.id,
									text_data: e,
									font: t.id,
									font_sz: n,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createTextRunUnsigned = function (
						e,
						t,
						n
					) {
						return (
							f(
								arguments.length,
								3,
								'createTextRunUnsigned',
								'(string, PDFNet.Font, number)',
								[
									[e, 'string'],
									[t, 'Object', p.Font, 'Font'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createTextRunUnsigned', {
									b: this.id,
									text_data: e,
									font: t.id,
									font_sz: n,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createNewTextRun = function (e) {
						return (
							f(arguments.length, 1, 'createNewTextRun', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ElementBuilder.createNewTextRun', {
									b: this.id,
									text_data: e,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createNewTextRunUnsigned = function (e) {
						return (
							f(arguments.length, 1, 'createNewTextRunUnsigned', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ElementBuilder.createNewTextRunUnsigned', {
									b: this.id,
									text_data: e,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createShapedTextRun = function (e) {
						return (
							f(
								arguments.length,
								1,
								'createShapedTextRun',
								'(PDFNet.ShapedText)',
								[[e, 'Object', p.ShapedText, 'ShapedText']]
							),
							p
								.sendWithPromise('ElementBuilder.createShapedTextRun', {
									b: this.id,
									text_data: e.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createTextNewLineWithOffset = function (
						e,
						t
					) {
						return (
							f(
								arguments.length,
								2,
								'createTextNewLineWithOffset',
								'(number, number)',
								[
									[e, 'number'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createTextNewLineWithOffset', {
									b: this.id,
									dx: e,
									dy: t,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createTextNewLine = function () {
						return p
							.sendWithPromise('ElementBuilder.createTextNewLine', {
								b: this.id,
							})
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createPath = function (e, t) {
						f(
							arguments.length,
							2,
							'createPath',
							'(Array<number>, ArrayBuffer|TypedArray)',
							[
								[e, 'Array'],
								[t, 'ArrayBuffer'],
							]
						);
						var n = b(t, !1);
						return p
							.sendWithPromise('ElementBuilder.createPath', {
								b: this.id,
								points_list: e,
								buf_seg_types: n,
							})
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createRect = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'createRect',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createRect', {
									b: this.id,
									x: e,
									y: t,
									width: n,
									height: i,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createEllipse = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'createEllipse',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createEllipse', {
									b: this.id,
									x: e,
									y: t,
									width: n,
									height: i,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.pathBegin = function () {
						return p.sendWithPromise('ElementBuilder.pathBegin', {
							b: this.id,
						});
					}),
					(p.ElementBuilder.prototype.pathEnd = function () {
						return p
							.sendWithPromise('ElementBuilder.pathEnd', { b: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.rect = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'rect',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('ElementBuilder.rect', {
								b: this.id,
								x: e,
								y: t,
								width: n,
								height: i,
							})
						);
					}),
					(p.ElementBuilder.prototype.ellipse = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'ellipse',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('ElementBuilder.ellipse', {
								b: this.id,
								x: e,
								y: t,
								width: n,
								height: i,
							})
						);
					}),
					(p.ElementBuilder.prototype.moveTo = function (e, t) {
						return (
							f(arguments.length, 2, 'moveTo', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('ElementBuilder.moveTo', {
								b: this.id,
								x: e,
								y: t,
							})
						);
					}),
					(p.ElementBuilder.prototype.lineTo = function (e, t) {
						return (
							f(arguments.length, 2, 'lineTo', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('ElementBuilder.lineTo', {
								b: this.id,
								x: e,
								y: t,
							})
						);
					}),
					(p.ElementBuilder.prototype.curveTo = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'curveTo',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p.sendWithPromise('ElementBuilder.curveTo', {
								b: this.id,
								cx1: e,
								cy1: t,
								cx2: n,
								cy2: i,
								x2: r,
								y2: o,
							})
						);
					}),
					(p.ElementBuilder.prototype.arcTo = function (e, t, n, i, r, o) {
						return (
							f(
								arguments.length,
								6,
								'arcTo',
								'(number, number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							p.sendWithPromise('ElementBuilder.arcTo', {
								b: this.id,
								x: e,
								y: t,
								width: n,
								height: i,
								start: r,
								extent: o,
							})
						);
					}),
					(p.ElementBuilder.prototype.arcTo2 = function (e, t, n, i, r, o, s) {
						return (
							f(
								arguments.length,
								7,
								'arcTo2',
								'(number, number, number, boolean, boolean, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'boolean'],
									[r, 'boolean'],
									[o, 'number'],
									[s, 'number'],
								]
							),
							p.sendWithPromise('ElementBuilder.arcTo2', {
								b: this.id,
								xr: e,
								yr: t,
								rx: n,
								isLargeArc: i,
								sweep: r,
								endX: o,
								endY: s,
							})
						);
					}),
					(p.ElementBuilder.prototype.closePath = function () {
						return p.sendWithPromise('ElementBuilder.closePath', {
							b: this.id,
						});
					}),
					(p.ElementBuilder.prototype.createMarkedContentBeginInlineProperties =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'createMarkedContentBeginInlineProperties',
									'(string)',
									[[e, 'string']]
								),
								p
									.sendWithPromise(
										'ElementBuilder.createMarkedContentBeginInlineProperties',
										{ b: this.id, tag: e }
									)
									.then(function (e) {
										return D(p.Element, e);
									})
							);
						}),
					(p.ElementBuilder.prototype.createMarkedContentBegin = function (
						e,
						t
					) {
						return (
							f(
								arguments.length,
								2,
								'createMarkedContentBegin',
								'(string, PDFNet.Obj)',
								[
									[e, 'string'],
									[t, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createMarkedContentBegin', {
									b: this.id,
									tag: e,
									property_dict: t.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementBuilder.prototype.createMarkedContentEnd = function () {
						return p
							.sendWithPromise('ElementBuilder.createMarkedContentEnd', {
								b: this.id,
							})
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementBuilder.prototype.createMarkedContentPointInlineProperties =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'createMarkedContentPointInlineProperties',
									'(string)',
									[[e, 'string']]
								),
								p
									.sendWithPromise(
										'ElementBuilder.createMarkedContentPointInlineProperties',
										{ b: this.id, tag: e }
									)
									.then(function (e) {
										return D(p.Element, e);
									})
							);
						}),
					(p.ElementBuilder.prototype.createMarkedContentPoint = function (
						e,
						t
					) {
						return (
							f(
								arguments.length,
								2,
								'createMarkedContentPoint',
								'(string, PDFNet.Obj)',
								[
									[e, 'string'],
									[t, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('ElementBuilder.createMarkedContentPoint', {
									b: this.id,
									tag: e,
									property_dict: t.id,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.ElementReader.create = function () {
						return p
							.sendWithPromise('elementReaderCreate', {})
							.then(function (e) {
								return y(p.ElementReader, e);
							});
					}),
					(p.ElementReader.prototype.beginOnPage = function (e, t) {
						return (
							void 0 === t && (t = new p.OCGContext('0')),
							f(
								arguments.length,
								1,
								'beginOnPage',
								'(PDFNet.Page, PDFNet.OCGContext)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'Object', p.OCGContext, 'OCGContext'],
								]
							),
							p.sendWithPromise('ElementReader.beginOnPage', {
								r: this.id,
								page: e.id,
								ctx: t.id,
							})
						);
					}),
					(p.ElementReader.prototype.begin = function (e, t, n) {
						return (
							void 0 === t && (t = new p.Obj('0')),
							void 0 === n && (n = new p.OCGContext('0')),
							f(
								arguments.length,
								1,
								'begin',
								'(PDFNet.Obj, PDFNet.Obj, PDFNet.OCGContext)',
								[
									[e, 'Object', p.Obj, 'Obj'],
									[t, 'Object', p.Obj, 'Obj'],
									[n, 'Object', p.OCGContext, 'OCGContext'],
								]
							),
							p.sendWithPromise('ElementReader.begin', {
								r: this.id,
								content_stream: e.id,
								resource_dict: t.id,
								ctx: n.id,
							})
						);
					}),
					(p.ElementReader.prototype.appendResource = function (e) {
						return (
							f(arguments.length, 1, 'appendResource', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('ElementReader.appendResource', {
								r: this.id,
								res: e.id,
							})
						);
					}),
					(p.ElementReader.prototype.next = function () {
						return p
							.sendWithPromise('ElementReader.next', { r: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementReader.prototype.current = function () {
						return p
							.sendWithPromise('ElementReader.current', { r: this.id })
							.then(function (e) {
								return D(p.Element, e);
							});
					}),
					(p.ElementReader.prototype.formBegin = function () {
						return p.sendWithPromise('ElementReader.formBegin', { r: this.id });
					}),
					(p.ElementReader.prototype.patternBegin = function (e, t) {
						return (
							void 0 === t && (t = !1),
							f(arguments.length, 1, 'patternBegin', '(boolean, boolean)', [
								[e, 'boolean'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('ElementReader.patternBegin', {
								r: this.id,
								fill_pattern: e,
								reset_ctm_tfm: t,
							})
						);
					}),
					(p.ElementReader.prototype.type3FontBegin = function (t, e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'type3FontBegin',
								'(PDFNet.CharData, PDFNet.Obj)',
								[
									[t, 'Structure', p.CharData, 'CharData'],
									[e, 'Object', p.Obj, 'Obj'],
								]
							),
							F('type3FontBegin', [[t, 0]]),
							(t.yieldFunction = 'ElementReader.type3FontBegin'),
							p
								.sendWithPromise('ElementReader.type3FontBegin', {
									r: this.id,
									char_data: t,
									resource_dict: e.id,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.ElementReader.prototype.end = function () {
						return p.sendWithPromise('ElementReader.end', { r: this.id });
					}),
					(p.ElementReader.prototype.getChangesIterator = function () {
						return p
							.sendWithPromise('ElementReader.getChangesIterator', {
								r: this.id,
							})
							.then(function (e) {
								return y(p.Iterator, e, 'Int');
							});
					});
				function m(r, o) {
					o = o || {};
					var s = new XMLHttpRequest();
					return new Promise(
						function (t, n) {
							s.open('GET', r, !0),
								(s.responseType = 'arraybuffer'),
								o.withCredentials && (s.withCredentials = o.withCredentials),
								(s.onerror = function () {
									n(Error('Network error occurred'));
								}),
								(s.onload = function (e) {
									200 == this.status
										? ((e = new Uint8Array(s.response)), t(e))
										: n(Error('Download Failed'));
								});
							var e = o.customHeaders;
							if (e) for (var i in e) s.setRequestHeader(i, e[i]);
							s.send();
						},
						function () {
							s.abort();
						}
					);
				}
				function g(e) {
					return 0 === e
						? '1st'
						: 1 === e
						? '2nd'
						: 2 === e
						? '3rd'
						: e + 1 + 'th';
				}
				(p.ElementReader.prototype.isChanged = function (e) {
					return (
						f(arguments.length, 1, 'isChanged', '(number)', [[e, 'number']]),
						p.sendWithPromise('ElementReader.isChanged', {
							r: this.id,
							attrib: e,
						})
					);
				}),
					(p.ElementReader.prototype.clearChangeList = function () {
						return p.sendWithPromise('ElementReader.clearChangeList', {
							r: this.id,
						});
					}),
					(p.ElementReader.prototype.getFont = function (e) {
						return (
							f(arguments.length, 1, 'getFont', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('ElementReader.getFont', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementReader.prototype.getXObject = function (e) {
						return (
							f(arguments.length, 1, 'getXObject', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('ElementReader.getXObject', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementReader.prototype.getShading = function (e) {
						return (
							f(arguments.length, 1, 'getShading', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('ElementReader.getShading', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementReader.prototype.getColorSpace = function (e) {
						return (
							f(arguments.length, 1, 'getColorSpace', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ElementReader.getColorSpace', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementReader.prototype.getPattern = function (e) {
						return (
							f(arguments.length, 1, 'getPattern', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('ElementReader.getPattern', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementReader.prototype.getExtGState = function (e) {
						return (
							f(arguments.length, 1, 'getExtGState', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ElementReader.getExtGState', {
									r: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ElementWriter.create = function () {
						return p
							.sendWithPromise('elementWriterCreate', {})
							.then(function (e) {
								return y(p.ElementWriter, e);
							});
					}),
					(p.ElementWriter.prototype.beginOnPage = function (e, t, n, i, r) {
						return (
							void 0 === t && (t = p.ElementWriter.WriteMode.e_overlay),
							void 0 === n && (n = !0),
							void 0 === i && (i = !0),
							void 0 === r && (r = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'beginOnPage',
								'(PDFNet.Page, number, boolean, boolean, PDFNet.Obj)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'number'],
									[n, 'boolean'],
									[i, 'boolean'],
									[r, 'Object', p.Obj, 'Obj'],
								]
							),
							p.sendWithPromise('ElementWriter.beginOnPage', {
								w: this.id,
								page: e.id,
								placement: t,
								page_coord_sys: n,
								compress: i,
								resources: r.id,
							})
						);
					}),
					(p.ElementWriter.prototype.begin = function (e, t) {
						return (
							void 0 === t && (t = !0),
							f(arguments.length, 1, 'begin', '(PDFNet.SDFDoc, boolean)', [
								[e, 'SDFDoc'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('ElementWriter.begin', {
								w: this.id,
								doc: e.id,
								compress: t,
							})
						);
					}),
					(p.ElementWriter.prototype.beginOnObj = function (e, t, n) {
						return (
							void 0 === t && (t = !0),
							void 0 === n && (n = new p.Obj('0')),
							f(
								arguments.length,
								1,
								'beginOnObj',
								'(PDFNet.Obj, boolean, PDFNet.Obj)',
								[
									[e, 'Object', p.Obj, 'Obj'],
									[t, 'boolean'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							),
							p.sendWithPromise('ElementWriter.beginOnObj', {
								w: this.id,
								stream_obj_to_update: e.id,
								compress: t,
								resources: n.id,
							})
						);
					}),
					(p.ElementWriter.prototype.end = function () {
						return p
							.sendWithPromise('ElementWriter.end', { w: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ElementWriter.prototype.writeElement = function (e) {
						return (
							f(arguments.length, 1, 'writeElement', '(PDFNet.Element)', [
								[e, 'Object', p.Element, 'Element'],
							]),
							p.sendWithPromise('ElementWriter.writeElement', {
								w: this.id,
								element: e.id,
							})
						);
					}),
					(p.ElementWriter.prototype.writePlacedElement = function (e) {
						return (
							f(arguments.length, 1, 'writePlacedElement', '(PDFNet.Element)', [
								[e, 'Object', p.Element, 'Element'],
							]),
							p.sendWithPromise('ElementWriter.writePlacedElement', {
								w: this.id,
								element: e.id,
							})
						);
					}),
					(p.ElementWriter.prototype.flush = function () {
						return p.sendWithPromise('ElementWriter.flush', { w: this.id });
					}),
					(p.ElementWriter.prototype.writeBuffer = function (e) {
						f(arguments.length, 1, 'writeBuffer', '(ArrayBuffer|TypedArray)', [
							[e, 'ArrayBuffer'],
						]);
						var t = b(e, !1);
						return p.sendWithPromise('ElementWriter.writeBuffer', {
							w: this.id,
							data_buf: t,
						});
					}),
					(p.ElementWriter.prototype.writeString = function (e) {
						return (
							f(arguments.length, 1, 'writeString', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('ElementWriter.writeString', {
								w: this.id,
								str: e,
							})
						);
					}),
					(p.ElementWriter.prototype.setDefaultGState = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setDefaultGState',
								'(PDFNet.ElementReader)',
								[[e, 'Object', p.ElementReader, 'ElementReader']]
							),
							p.sendWithPromise('ElementWriter.setDefaultGState', {
								w: this.id,
								reader: e.id,
							})
						);
					}),
					(p.ElementWriter.prototype.writeGStateChanges = function (e) {
						return (
							f(arguments.length, 1, 'writeGStateChanges', '(PDFNet.Element)', [
								[e, 'Object', p.Element, 'Element'],
							]),
							p.sendWithPromise('ElementWriter.writeGStateChanges', {
								w: this.id,
								element: e.id,
							})
						);
					}),
					(p.FileSpec.create = function (e, t, n) {
						return (
							void 0 === n && (n = !0),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.SDFDoc, string, boolean)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
									[n, 'boolean'],
								]
							),
							p
								.sendWithPromise('fileSpecCreate', {
									doc: e.id,
									path: t,
									embed: n,
								})
								.then(function (e) {
									return D(p.FileSpec, e);
								})
						);
					}),
					(p.FileSpec.createURL = function (e, t) {
						return (
							f(arguments.length, 2, 'createURL', '(PDFNet.SDFDoc, string)', [
								[e, 'SDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('fileSpecCreateURL', { doc: e.id, url: t })
								.then(function (e) {
									return D(p.FileSpec, e);
								})
						);
					}),
					(p.FileSpec.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('fileSpecCreateFromObj', { f: e.id })
								.then(function (e) {
									return D(p.FileSpec, e);
								})
						);
					}),
					(p.FileSpec.prototype.copy = function () {
						return p
							.sendWithPromise('FileSpec.copy', { d: this.id })
							.then(function (e) {
								return D(p.FileSpec, e);
							});
					}),
					(p.FileSpec.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.FileSpec)', [
								[e, 'Object', p.FileSpec, 'FileSpec'],
							]),
							p.sendWithPromise('FileSpec.compare', { fs: this.id, d: e.id })
						);
					}),
					(p.FileSpec.prototype.isValid = function () {
						return p.sendWithPromise('FileSpec.isValid', { fs: this.id });
					}),
					(p.FileSpec.prototype.export = function (e) {
						return (
							void 0 === e && (e = ''),
							f(arguments.length, 0, 'export', '(string)', [[e, 'string']]),
							p.sendWithPromise('FileSpec.export', { fs: this.id, save_as: e })
						);
					}),
					(p.FileSpec.prototype.getFileData = function () {
						return p
							.sendWithPromise('FileSpec.getFileData', { fs: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.FileSpec.prototype.getFilePath = function () {
						return p.sendWithPromise('FileSpec.getFilePath', { fs: this.id });
					}),
					(p.FileSpec.prototype.setDesc = function (e) {
						return (
							f(arguments.length, 1, 'setDesc', '(string)', [[e, 'string']]),
							p.sendWithPromise('FileSpec.setDesc', { fs: this.id, desc: e })
						);
					}),
					(p.FileSpec.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('FileSpec.getSDFObj', { fs: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Flattener.create = function () {
						return p.sendWithPromise('flattenerCreate', {}).then(function (e) {
							return y(p.Flattener, e);
						});
					}),
					(p.Flattener.prototype.setDPI = function (e) {
						return (
							f(arguments.length, 1, 'setDPI', '(number)', [[e, 'number']]),
							p.sendWithPromise('Flattener.setDPI', {
								flattener: this.id,
								dpi: e,
							})
						);
					}),
					(p.Flattener.prototype.setThreshold = function (e) {
						return (
							f(arguments.length, 1, 'setThreshold', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Flattener.setThreshold', {
								flattener: this.id,
								threshold: e,
							})
						);
					}),
					(p.Flattener.prototype.setMaximumImagePixels = function (e) {
						return (
							f(arguments.length, 1, 'setMaximumImagePixels', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Flattener.setMaximumImagePixels', {
								flattener: this.id,
								max_pixels: e,
							})
						);
					}),
					(p.Flattener.prototype.setPreferJPG = function (e) {
						return (
							f(arguments.length, 1, 'setPreferJPG', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Flattener.setPreferJPG', {
								flattener: this.id,
								jpg: e,
							})
						);
					}),
					(p.Flattener.prototype.setJPGQuality = function (e) {
						return (
							f(arguments.length, 1, 'setJPGQuality', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Flattener.setJPGQuality', {
								flattener: this.id,
								quality: e,
							})
						);
					}),
					(p.Flattener.prototype.setPathHinting = function (e) {
						return (
							f(arguments.length, 1, 'setPathHinting', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Flattener.setPathHinting', {
								flattener: this.id,
								hinting: e,
							})
						);
					}),
					(p.Flattener.prototype.process = function (e, t) {
						return (
							f(arguments.length, 2, 'process', '(PDFNet.PDFDoc, number)', [
								[e, 'PDFDoc'],
								[t, 'number'],
							]),
							p.sendWithPromise('Flattener.process', {
								flattener: this.id,
								doc: e.id,
								mode: t,
							})
						);
					}),
					(p.Flattener.prototype.processPage = function (e, t) {
						return (
							f(arguments.length, 2, 'processPage', '(PDFNet.Page, number)', [
								[e, 'Object', p.Page, 'Page'],
								[t, 'number'],
							]),
							p.sendWithPromise('Flattener.processPage', {
								flattener: this.id,
								page: e.id,
								mode: t,
							})
						);
					}),
					(p.Font.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('fontCreateFromObj', { font_dict: e.id })
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, number)', [
								[e, 'SDFDoc'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('fontCreate', { doc: e.id, type: t })
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createFromFontDescriptor = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createFromFontDescriptor',
								'(PDFNet.SDFDoc, PDFNet.Font, string)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.Font, 'Font'],
									[n, 'string'],
								]
							),
							p
								.sendWithPromise('fontCreateFromFontDescriptor', {
									doc: e.id,
									from: t.id,
									char_set: n,
								})
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createFromName = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createFromName',
								'(PDFNet.SDFDoc, string, string)',
								[
									[e, 'SDFDoc'],
									[t, 'string'],
									[n, 'string'],
								]
							),
							p
								.sendWithPromise('fontCreateFromName', {
									doc: e.id,
									name: t,
									char_set: n,
								})
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createAndEmbed = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createAndEmbed',
								'(PDFNet.SDFDoc, number)',
								[
									[e, 'SDFDoc'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('fontCreateAndEmbed', { doc: e.id, type: t })
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createTrueTypeFontWithBuffer = function (e, t, n, i) {
						return (
							void 0 === n && (n = !0),
							void 0 === i && (i = !0),
							f(
								arguments.length,
								2,
								'createTrueTypeFontWithBuffer',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean, boolean)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'boolean'],
									[i, 'boolean'],
								]
							),
							(t = b(t, !1)),
							p
								.sendWithPromise('fontCreateTrueTypeFontWithBuffer', {
									doc: e.id,
									font_path: t,
									embed: n,
									subset: i,
								})
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createCIDTrueTypeFontWithBuffer = function (
						e,
						t,
						n,
						i,
						r,
						o
					) {
						return (
							void 0 === n && (n = !0),
							void 0 === i && (i = !0),
							void 0 === r && (r = p.Font.Encoding.e_IdentityH),
							void 0 === o && (o = 0),
							f(
								arguments.length,
								2,
								'createCIDTrueTypeFontWithBuffer',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean, boolean, number, number)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'boolean'],
									[i, 'boolean'],
									[r, 'number'],
									[o, 'number'],
								]
							),
							(t = b(t, !1)),
							p
								.sendWithPromise('fontCreateCIDTrueTypeFontWithBuffer', {
									doc: e.id,
									font_path: t,
									embed: n,
									subset: i,
									encoding: r,
									ttc_font_index: o,
								})
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.createType1FontWithBuffer = function (e, t, n) {
						return (
							void 0 === n && (n = !0),
							f(
								arguments.length,
								2,
								'createType1FontWithBuffer',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, boolean)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'boolean'],
								]
							),
							(t = b(t, !1)),
							p
								.sendWithPromise('fontCreateType1FontWithBuffer', {
									doc: e.id,
									font_path: t,
									embed: n,
								})
								.then(function (e) {
									return y(p.Font, e);
								})
						);
					}),
					(p.Font.prototype.getType = function () {
						return p.sendWithPromise('Font.getType', { font: this.id });
					}),
					(p.Font.prototype.isSimple = function () {
						return p.sendWithPromise('Font.isSimple', { font: this.id });
					}),
					(p.Font.getTypeFromObj = function (e) {
						return (
							f(arguments.length, 1, 'getTypeFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('fontGetTypeFromObj', { font_dict: e.id })
						);
					}),
					(p.Font.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Font.getSDFObj', { font: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Font.prototype.getDescriptor = function () {
						return p
							.sendWithPromise('Font.getDescriptor', { font: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Font.prototype.getName = function () {
						return p.sendWithPromise('Font.getName', { font: this.id });
					}),
					(p.Font.prototype.getFamilyName = function () {
						return p.sendWithPromise('Font.getFamilyName', { font: this.id });
					}),
					(p.Font.prototype.isFixedWidth = function () {
						return p.sendWithPromise('Font.isFixedWidth', { font: this.id });
					}),
					(p.Font.prototype.isSerif = function () {
						return p.sendWithPromise('Font.isSerif', { font: this.id });
					}),
					(p.Font.prototype.isSymbolic = function () {
						return p.sendWithPromise('Font.isSymbolic', { font: this.id });
					}),
					(p.Font.prototype.isItalic = function () {
						return p.sendWithPromise('Font.isItalic', { font: this.id });
					}),
					(p.Font.prototype.isAllCap = function () {
						return p.sendWithPromise('Font.isAllCap', { font: this.id });
					}),
					(p.Font.prototype.isForceBold = function () {
						return p.sendWithPromise('Font.isForceBold', { font: this.id });
					}),
					(p.Font.prototype.isHorizontalMode = function () {
						return p.sendWithPromise('Font.isHorizontalMode', {
							font: this.id,
						});
					}),
					(p.Font.prototype.getWidth = function (e) {
						return (
							f(arguments.length, 1, 'getWidth', '(number)', [[e, 'number']]),
							p.sendWithPromise('Font.getWidth', {
								font: this.id,
								char_code: e,
							})
						);
					}),
					(p.Font.prototype.getMaxWidth = function () {
						return p.sendWithPromise('Font.getMaxWidth', { font: this.id });
					}),
					(p.Font.prototype.getMissingWidth = function () {
						return p.sendWithPromise('Font.getMissingWidth', { font: this.id });
					}),
					(p.Font.prototype.getCharCodeIterator = function () {
						return p
							.sendWithPromise('Font.getCharCodeIterator', { font: this.id })
							.then(function (e) {
								return y(p.Iterator, e, 'Int');
							});
					}),
					(p.Font.prototype.getShapedText = function (e) {
						return (
							f(arguments.length, 1, 'getShapedText', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Font.getShapedText', {
									font: this.id,
									text_to_shape: e,
								})
								.then(function (e) {
									return y(p.ShapedText, e);
								})
						);
					}),
					(p.Font.prototype.getEncoding = function () {
						return p.sendWithPromise('Font.getEncoding', { font: this.id });
					}),
					(p.Font.prototype.isEmbedded = function () {
						return p.sendWithPromise('Font.isEmbedded', { font: this.id });
					}),
					(p.Font.prototype.getEmbeddedFontName = function () {
						return p.sendWithPromise('Font.getEmbeddedFontName', {
							font: this.id,
						});
					}),
					(p.Font.prototype.getEmbeddedFont = function () {
						return p
							.sendWithPromise('Font.getEmbeddedFont', { font: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Font.prototype.getEmbeddedFontBufSize = function () {
						return p.sendWithPromise('Font.getEmbeddedFontBufSize', {
							font: this.id,
						});
					}),
					(p.Font.prototype.getUnitsPerEm = function () {
						return p.sendWithPromise('Font.getUnitsPerEm', { font: this.id });
					}),
					(p.Font.prototype.getBBox = function () {
						return p
							.sendWithPromise('Font.getBBox', { font: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Font.prototype.getAscent = function () {
						return p.sendWithPromise('Font.getAscent', { font: this.id });
					}),
					(p.Font.prototype.getDescent = function () {
						return p.sendWithPromise('Font.getDescent', { font: this.id });
					}),
					(p.Font.prototype.getStandardType1FontType = function () {
						return p.sendWithPromise('Font.getStandardType1FontType', {
							font: this.id,
						});
					}),
					(p.Font.prototype.isCFF = function () {
						return p.sendWithPromise('Font.isCFF', { font: this.id });
					}),
					(p.Font.prototype.getType3FontMatrix = function () {
						return p
							.sendWithPromise('Font.getType3FontMatrix', { font: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Font.prototype.getType3GlyphStream = function (e) {
						return (
							f(arguments.length, 1, 'getType3GlyphStream', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('Font.getType3GlyphStream', {
									font: this.id,
									char_code: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Font.prototype.getVerticalAdvance = function (e) {
						return (
							f(arguments.length, 1, 'getVerticalAdvance', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Font.getVerticalAdvance', {
								font: this.id,
								char_code: e,
							})
						);
					}),
					(p.Font.prototype.getDescendant = function () {
						return p
							.sendWithPromise('Font.getDescendant', { font: this.id })
							.then(function (e) {
								return y(p.Font, e);
							});
					}),
					(p.Font.prototype.mapToCID = function (e) {
						return (
							f(arguments.length, 1, 'mapToCID', '(number)', [[e, 'number']]),
							p.sendWithPromise('Font.mapToCID', {
								font: this.id,
								char_code: e,
							})
						);
					}),
					(p.Function.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('functionCreate', { funct_dict: e.id })
								.then(function (e) {
									return y(p.Function, e);
								})
						);
					}),
					(p.Function.prototype.getType = function () {
						return p.sendWithPromise('Function.getType', { f: this.id });
					}),
					(p.Function.prototype.getInputCardinality = function () {
						return p.sendWithPromise('Function.getInputCardinality', {
							f: this.id,
						});
					}),
					(p.Function.prototype.getOutputCardinality = function () {
						return p.sendWithPromise('Function.getOutputCardinality', {
							f: this.id,
						});
					}),
					(p.Function.prototype.eval = function (e, t) {
						return (
							f(arguments.length, 2, 'eval', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('Function.eval', {
								f: this.id,
								inval: e,
								outval: t,
							})
						);
					}),
					(p.Function.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Function.getSDFObj', { f: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Highlights.create = function () {
						return p.sendWithPromise('highlightsCreate', {}).then(function (e) {
							return y(p.Highlights, e);
						});
					}),
					(p.Highlights.prototype.copyCtor = function () {
						return p
							.sendWithPromise('Highlights.copyCtor', { hlts: this.id })
							.then(function (e) {
								return y(p.Highlights, e);
							});
					}),
					(p.Highlights.prototype.add = function (e) {
						return (
							f(arguments.length, 1, 'add', '(PDFNet.Highlights)', [
								[e, 'Object', p.Highlights, 'Highlights'],
							]),
							p.sendWithPromise('Highlights.add', {
								hlts2: this.id,
								hlts: e.id,
							})
						);
					}),
					(p.Highlights.prototype.saveToString = function () {
						return p.sendWithPromise('Highlights.saveToString', {
							hlts: this.id,
						});
					}),
					(p.Highlights.prototype.clear = function () {
						return p.sendWithPromise('Highlights.clear', { hlts: this.id });
					}),
					(p.Highlights.prototype.begin = function (e) {
						return (
							f(arguments.length, 1, 'begin', '(PDFNet.PDFDoc)', [
								[e, 'PDFDoc'],
							]),
							p.sendWithPromise('Highlights.begin', {
								hlts: this.id,
								doc: e.id,
							})
						);
					}),
					(p.Highlights.prototype.hasNext = function () {
						return p.sendWithPromise('Highlights.hasNext', { hlts: this.id });
					}),
					(p.Highlights.prototype.next = function () {
						return p.sendWithPromise('Highlights.next', { hlts: this.id });
					}),
					(p.Highlights.prototype.getCurrentPageNumber = function () {
						return p.sendWithPromise('Highlights.getCurrentPageNumber', {
							hlts: this.id,
						});
					}),
					(p.Highlights.prototype.getCurrentTextRange = function () {
						return p
							.sendWithPromise('Highlights.getCurrentTextRange', {
								hlts: this.id,
							})
							.then(function (e) {
								return D(p.TextRange, e);
							});
					}),
					(p.Image.createFromMemory = function (e, t, n, i, r, o, s) {
						void 0 === s && (s = new p.Obj('0')),
							f(
								arguments.length,
								6,
								'createFromMemory',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.ColorSpace, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'Object', p.ColorSpace, 'ColorSpace'],
									[s, 'Object', p.Obj, 'Obj'],
								]
							);
						var u = b(t, !1);
						return p
							.sendWithPromise('imageCreateFromMemory', {
								doc: e.id,
								buf: u,
								width: n,
								height: i,
								bpc: r,
								color_space: o.id,
								encoder_hints: s.id,
							})
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.createFromMemory2 = function (e, t, n) {
						void 0 === n && (n = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'createFromMemory2',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							);
						var i = b(t, !1);
						return p
							.sendWithPromise('imageCreateFromMemory2', {
								doc: e.id,
								buf: i,
								encoder_hints: n.id,
							})
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.createFromStream = function (e, t, n, i, r, o, s) {
						return (
							void 0 === s && (s = new p.Obj('0')),
							f(
								arguments.length,
								6,
								'createFromStream',
								'(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.ColorSpace, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.FilterReader, 'FilterReader'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'Object', p.ColorSpace, 'ColorSpace'],
									[s, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('imageCreateFromStream', {
									doc: e.id,
									image_data: t.id,
									width: n,
									height: i,
									bpc: r,
									color_space: o.id,
									encoder_hints: s.id,
								})
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.createFromStream2 = function (e, t, n) {
						return (
							void 0 === n && (n = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'createFromStream2',
								'(PDFNet.SDFDoc, PDFNet.Filter, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.Filter, 'Filter'],
									[n, 'Object', p.Obj, 'Obj'],
								]
							),
							0 != t.id && S(t.id),
							p
								.sendWithPromise('imageCreateFromStream2', {
									doc: e.id,
									no_own_image_data: t.id,
									encoder_hints: n.id,
								})
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.createImageMask = function (e, t, n, i, r) {
						void 0 === r && (r = new p.Obj('0')),
							f(
								arguments.length,
								4,
								'createImageMask',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'number'],
									[i, 'number'],
									[r, 'Object', p.Obj, 'Obj'],
								]
							);
						var o = b(t, !1);
						return p
							.sendWithPromise('imageCreateImageMask', {
								doc: e.id,
								buf: o,
								width: n,
								height: i,
								encoder_hints: r.id,
							})
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.createImageMaskFromStream = function (e, t, n, i, r) {
						return (
							void 0 === r && (r = new p.Obj('0')),
							f(
								arguments.length,
								4,
								'createImageMaskFromStream',
								'(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.FilterReader, 'FilterReader'],
									[n, 'number'],
									[i, 'number'],
									[r, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('imageCreateImageMaskFromStream', {
									doc: e.id,
									image_data: t.id,
									width: n,
									height: i,
									encoder_hints: r.id,
								})
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.createSoftMask = function (e, t, n, i, r, o) {
						void 0 === o && (o = new p.Obj('0')),
							f(
								arguments.length,
								5,
								'createSoftMask',
								'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'ArrayBuffer'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'Object', p.Obj, 'Obj'],
								]
							);
						var s = b(t, !1);
						return p
							.sendWithPromise('imageCreateSoftMask', {
								doc: e.id,
								buf: s,
								width: n,
								height: i,
								bpc: r,
								encoder_hints: o.id,
							})
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.createSoftMaskFromStream = function (e, t, n, i, r, o) {
						return (
							void 0 === o && (o = new p.Obj('0')),
							f(
								arguments.length,
								5,
								'createSoftMaskFromStream',
								'(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.Obj)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.FilterReader, 'FilterReader'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('imageCreateSoftMaskFromStream', {
									doc: e.id,
									image_data: t.id,
									width: n,
									height: i,
									bpc: r,
									encoder_hints: o.id,
								})
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.createDirectFromMemory = function (e, t, n, i, r, o, s) {
						f(
							arguments.length,
							7,
							'createDirectFromMemory',
							'(PDFNet.SDFDoc, ArrayBuffer|TypedArray, number, number, number, PDFNet.ColorSpace, number)',
							[
								[e, 'SDFDoc'],
								[t, 'ArrayBuffer'],
								[n, 'number'],
								[i, 'number'],
								[r, 'number'],
								[o, 'Object', p.ColorSpace, 'ColorSpace'],
								[s, 'number'],
							]
						);
						var u = b(t, !1);
						return p
							.sendWithPromise('imageCreateDirectFromMemory', {
								doc: e.id,
								buf: u,
								width: n,
								height: i,
								bpc: r,
								color_space: o.id,
								input_format: s,
							})
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.createDirectFromStream = function (e, t, n, i, r, o, s) {
						return (
							f(
								arguments.length,
								7,
								'createDirectFromStream',
								'(PDFNet.SDFDoc, PDFNet.FilterReader, number, number, number, PDFNet.ColorSpace, number)',
								[
									[e, 'SDFDoc'],
									[t, 'Object', p.FilterReader, 'FilterReader'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'Object', p.ColorSpace, 'ColorSpace'],
									[s, 'number'],
								]
							),
							p
								.sendWithPromise('imageCreateDirectFromStream', {
									doc: e.id,
									image_data: t.id,
									width: n,
									height: i,
									bpc: r,
									color_space: o.id,
									input_format: s,
								})
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.createFromObj = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('imageCreateFromObj', { image_xobject: e.id })
								.then(function (e) {
									return D(p.Image, e);
								})
						);
					}),
					(p.Image.prototype.copy = function () {
						return p
							.sendWithPromise('Image.copy', { c: this.id })
							.then(function (e) {
								return D(p.Image, e);
							});
					}),
					(p.Image.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Image.getSDFObj', { img: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Image.prototype.isValid = function () {
						return p.sendWithPromise('Image.isValid', { img: this.id });
					}),
					(p.Image.prototype.getImageData = function () {
						return p
							.sendWithPromise('Image.getImageData', { img: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.Image.prototype.getImageDataSize = function () {
						return p.sendWithPromise('Image.getImageDataSize', {
							img: this.id,
						});
					}),
					(p.Image.prototype.getImageColorSpace = function () {
						return p
							.sendWithPromise('Image.getImageColorSpace', { img: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.Image.prototype.getImageWidth = function () {
						return p.sendWithPromise('Image.getImageWidth', { img: this.id });
					}),
					(p.Image.prototype.getImageHeight = function () {
						return p.sendWithPromise('Image.getImageHeight', { img: this.id });
					}),
					(p.Image.prototype.getDecodeArray = function () {
						return p
							.sendWithPromise('Image.getDecodeArray', { img: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Image.prototype.getBitsPerComponent = function () {
						return p.sendWithPromise('Image.getBitsPerComponent', {
							img: this.id,
						});
					}),
					(p.Image.prototype.getComponentNum = function () {
						return p.sendWithPromise('Image.getComponentNum', { img: this.id });
					}),
					(p.Image.prototype.isImageMask = function () {
						return p.sendWithPromise('Image.isImageMask', { img: this.id });
					}),
					(p.Image.prototype.isImageInterpolate = function () {
						return p.sendWithPromise('Image.isImageInterpolate', {
							img: this.id,
						});
					}),
					(p.Image.prototype.getMask = function () {
						return p
							.sendWithPromise('Image.getMask', { img: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Image.prototype.setMask = function (e) {
						return (
							f(arguments.length, 1, 'setMask', '(PDFNet.Image)', [
								[e, 'Object', p.Image, 'Image'],
							]),
							p.sendWithPromise('Image.setMask', {
								img: this.id,
								image_mask: e.id,
							})
						);
					}),
					(p.Image.prototype.setMaskWithObj = function (e) {
						return (
							f(arguments.length, 1, 'setMaskWithObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('Image.setMaskWithObj', {
								img: this.id,
								mask: e.id,
							})
						);
					}),
					(p.Image.prototype.getSoftMask = function () {
						return p
							.sendWithPromise('Image.getSoftMask', { img: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Image.prototype.setSoftMask = function (e) {
						return (
							f(arguments.length, 1, 'setSoftMask', '(PDFNet.Image)', [
								[e, 'Object', p.Image, 'Image'],
							]),
							p.sendWithPromise('Image.setSoftMask', {
								img: this.id,
								soft_mask: e.id,
							})
						);
					}),
					(p.Image.prototype.getImageRenderingIntent = function () {
						return p.sendWithPromise('Image.getImageRenderingIntent', {
							img: this.id,
						});
					}),
					(p.Image.prototype.exportFromStream = function (e) {
						return (
							f(
								arguments.length,
								1,
								'exportFromStream',
								'(PDFNet.FilterWriter)',
								[[e, 'Object', p.FilterWriter, 'FilterWriter']]
							),
							p.sendWithPromise('Image.exportFromStream', {
								img: this.id,
								writer: e.id,
							})
						);
					}),
					(p.Image.prototype.exportAsTiffFromStream = function (e) {
						return (
							f(
								arguments.length,
								1,
								'exportAsTiffFromStream',
								'(PDFNet.FilterWriter)',
								[[e, 'Object', p.FilterWriter, 'FilterWriter']]
							),
							p.sendWithPromise('Image.exportAsTiffFromStream', {
								img: this.id,
								writer: e.id,
							})
						);
					}),
					(p.Image.prototype.exportAsPngFromStream = function (e) {
						return (
							f(
								arguments.length,
								1,
								'exportAsPngFromStream',
								'(PDFNet.FilterWriter)',
								[[e, 'Object', p.FilterWriter, 'FilterWriter']]
							),
							p.sendWithPromise('Image.exportAsPngFromStream', {
								img: this.id,
								writer: e.id,
							})
						);
					}),
					(p.PageLabel.create = function (e, t, n, i) {
						return (
							void 0 === n && (n = ''),
							void 0 === i && (i = 1),
							f(
								arguments.length,
								2,
								'create',
								'(PDFNet.SDFDoc, number, string, number)',
								[
									[e, 'SDFDoc'],
									[t, 'number'],
									[n, 'string'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('pageLabelCreate', {
									doc: e.id,
									style: t,
									prefix: n,
									start_at: i,
								})
								.then(function (e) {
									return new p.PageLabel(e);
								})
						);
					}),
					(p.PageLabel.createFromObj = function (e, t, n) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							void 0 === t && (t = -1),
							void 0 === n && (n = -1),
							f(
								arguments.length,
								0,
								'createFromObj',
								'(PDFNet.Obj, number, number)',
								[
									[e, 'Object', p.Obj, 'Obj'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('pageLabelCreateFromObj', {
									l: e.id,
									first_page: t,
									last_page: n,
								})
								.then(function (e) {
									return new p.PageLabel(e);
								})
						);
					}),
					(p.PageLabel.prototype.compare = function (e) {
						f(arguments.length, 1, 'compare', '(PDFNet.PageLabel)', [
							[e, 'Structure', p.PageLabel, 'PageLabel'],
						]),
							P('compare', this.yieldFunction),
							F('compare', [[e, 0]]);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.compare'),
							p
								.sendWithPromise('PageLabel.compare', { l: this, d: e })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.l, t), e.result;
								})
						);
					}),
					(p.PageLabel.prototype.isValid = function () {
						return (
							P('isValid', this.yieldFunction),
							p.sendWithPromise('PageLabel.isValid', { l: this })
						);
					}),
					(p.PageLabel.prototype.getLabelTitle = function (e) {
						f(arguments.length, 1, 'getLabelTitle', '(number)', [
							[e, 'number'],
						]),
							P('getLabelTitle', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.getLabelTitle'),
							p
								.sendWithPromise('PageLabel.getLabelTitle', {
									l: this,
									page_num: e,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.l, t), e.result;
								})
						);
					}),
					(p.PageLabel.prototype.setStyle = function (e) {
						f(arguments.length, 1, 'setStyle', '(number)', [[e, 'number']]),
							P('setStyle', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.setStyle'),
							p
								.sendWithPromise('PageLabel.setStyle', { l: this, style: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.PageLabel.prototype.getStyle = function () {
						return (
							P('getStyle', this.yieldFunction),
							p.sendWithPromise('PageLabel.getStyle', { l: this })
						);
					}),
					(p.PageLabel.prototype.getPrefix = function () {
						return (
							P('getPrefix', this.yieldFunction),
							p.sendWithPromise('PageLabel.getPrefix', { l: this })
						);
					}),
					(p.PageLabel.prototype.setPrefix = function (e) {
						f(arguments.length, 1, 'setPrefix', '(string)', [[e, 'string']]),
							P('setPrefix', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.setPrefix'),
							p
								.sendWithPromise('PageLabel.setPrefix', { l: this, prefix: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.PageLabel.prototype.getStart = function () {
						return (
							P('getStart', this.yieldFunction),
							p.sendWithPromise('PageLabel.getStart', { l: this })
						);
					}),
					(p.PageLabel.prototype.setStart = function (e) {
						f(arguments.length, 1, 'setStart', '(number)', [[e, 'number']]),
							P('setStart', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.setStart'),
							p
								.sendWithPromise('PageLabel.setStart', { l: this, start_at: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.PageLabel.prototype.getFirstPageNum = function () {
						P('getFirstPageNum', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.getFirstPageNum'),
							p
								.sendWithPromise('PageLabel.getFirstPageNum', { l: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.l, t), e.result;
								})
						);
					}),
					(p.PageLabel.prototype.getLastPageNum = function () {
						P('getLastPageNum', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'PageLabel.getLastPageNum'),
							p
								.sendWithPromise('PageLabel.getLastPageNum', { l: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.l, t), e.result;
								})
						);
					}),
					(p.PageLabel.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('PageLabel.getSDFObj', { l: this })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PageSet.create = function () {
						return p.sendWithPromise('pageSetCreate', {}).then(function (e) {
							return y(p.PageSet, e);
						});
					}),
					(p.PageSet.createSinglePage = function (e) {
						return (
							f(arguments.length, 1, 'createSinglePage', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('pageSetCreateSinglePage', { one_page: e })
								.then(function (e) {
									return y(p.PageSet, e);
								})
						);
					}),
					(p.PageSet.createRange = function (e, t) {
						return (
							f(arguments.length, 2, 'createRange', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('pageSetCreateRange', {
									range_start: e,
									range_end: t,
								})
								.then(function (e) {
									return y(p.PageSet, e);
								})
						);
					}),
					(p.PageSet.createFilteredRange = function (e, t, n) {
						return (
							void 0 === n && (n = p.PageSet.Filter.e_all),
							f(
								arguments.length,
								2,
								'createFilteredRange',
								'(number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('pageSetCreateFilteredRange', {
									range_start: e,
									range_end: t,
									filter: n,
								})
								.then(function (e) {
									return y(p.PageSet, e);
								})
						);
					}),
					(p.PageSet.prototype.addPage = function (e) {
						return (
							f(arguments.length, 1, 'addPage', '(number)', [[e, 'number']]),
							p.sendWithPromise('PageSet.addPage', {
								page_set: this.id,
								one_page: e,
							})
						);
					}),
					(p.PageSet.prototype.addRange = function (e, t, n) {
						return (
							void 0 === n && (n = p.PageSet.Filter.e_all),
							f(arguments.length, 2, 'addRange', '(number, number, number)', [
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
							]),
							p.sendWithPromise('PageSet.addRange', {
								page_set: this.id,
								range_start: e,
								range_end: t,
								filter: n,
							})
						);
					}),
					(p.PatternColor.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('patternColorCreate', { pattern: e.id })
								.then(function (e) {
									return y(p.PatternColor, e);
								})
						);
					}),
					(p.PatternColor.getTypeFromObj = function (e) {
						return (
							f(arguments.length, 1, 'getTypeFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('patternColorGetTypeFromObj', { pattern: e.id })
						);
					}),
					(p.PatternColor.prototype.getType = function () {
						return p.sendWithPromise('PatternColor.getType', { pc: this.id });
					}),
					(p.PatternColor.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('PatternColor.getSDFObj', { pc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PatternColor.prototype.getMatrix = function () {
						return p
							.sendWithPromise('PatternColor.getMatrix', { pc: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.PatternColor.prototype.getShading = function () {
						return p
							.sendWithPromise('PatternColor.getShading', { pc: this.id })
							.then(function (e) {
								return y(p.Shading, e);
							});
					}),
					(p.PatternColor.prototype.getTilingType = function () {
						return p.sendWithPromise('PatternColor.getTilingType', {
							pc: this.id,
						});
					}),
					(p.PatternColor.prototype.getBBox = function () {
						return p
							.sendWithPromise('PatternColor.getBBox', { pc: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.PatternColor.prototype.getXStep = function () {
						return p.sendWithPromise('PatternColor.getXStep', { pc: this.id });
					}),
					(p.PatternColor.prototype.getYStep = function () {
						return p.sendWithPromise('PatternColor.getYStep', { pc: this.id });
					}),
					(p.GeometryCollection.prototype.snapToNearest = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'snapToNearest',
								'(number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p.sendWithPromise('GeometryCollection.snapToNearest', {
								self: this.id,
								x: e,
								y: t,
								mode: n,
							})
						);
					}),
					(p.GeometryCollection.prototype.snapToNearestPixel = function (
						e,
						t,
						n,
						i
					) {
						return (
							f(
								arguments.length,
								4,
								'snapToNearestPixel',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('GeometryCollection.snapToNearestPixel', {
								self: this.id,
								x: e,
								y: t,
								dpi: n,
								mode: i,
							})
						);
					}),
					(p.DigestAlgorithm.calculateDigest = function (e, t) {
						f(
							arguments.length,
							2,
							'calculateDigest',
							'(number, ArrayBuffer|TypedArray)',
							[
								[e, 'number'],
								[t, 'ArrayBuffer'],
							]
						);
						var n = b(t, !1);
						return p
							.sendWithPromise('digestAlgorithmCalculateDigest', {
								in_algorithm: e,
								in_buffer: n,
							})
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.ObjectIdentifier.createFromPredefined = function (e) {
						return (
							f(arguments.length, 1, 'createFromPredefined', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('objectIdentifierCreateFromPredefined', {
									in_oid_enum: e,
								})
								.then(function (e) {
									return y(p.ObjectIdentifier, e);
								})
						);
					}),
					(p.ObjectIdentifier.createFromIntArray = function (e) {
						return (
							f(arguments.length, 1, 'createFromIntArray', '(Array<number>)', [
								[e, 'Array'],
							]),
							p
								.sendWithPromise('objectIdentifierCreateFromIntArray', {
									in_list: e,
								})
								.then(function (e) {
									return y(p.ObjectIdentifier, e);
								})
						);
					}),
					(p.ObjectIdentifier.createFromDigestAlgorithm = function (e) {
						return (
							f(arguments.length, 1, 'createFromDigestAlgorithm', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('objectIdentifierCreateFromDigestAlgorithm', {
									in_algorithm: e,
								})
								.then(function (e) {
									return y(p.ObjectIdentifier, e);
								})
						);
					}),
					(p.ObjectIdentifier.prototype.getRawValue = function () {
						return p.sendWithPromise('ObjectIdentifier.getRawValue', {
							self: this.id,
						});
					}),
					(p.X501DistinguishedName.prototype.hasAttribute = function (e) {
						return (
							f(
								arguments.length,
								1,
								'hasAttribute',
								'(PDFNet.ObjectIdentifier)',
								[[e, 'Object', p.ObjectIdentifier, 'ObjectIdentifier']]
							),
							p.sendWithPromise('X501DistinguishedName.hasAttribute', {
								self: this.id,
								in_oid: e.id,
							})
						);
					}),
					(p.X501DistinguishedName.prototype.getStringValuesForAttribute =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'getStringValuesForAttribute',
									'(PDFNet.ObjectIdentifier)',
									[[e, 'Object', p.ObjectIdentifier, 'ObjectIdentifier']]
								),
								p.sendWithPromise(
									'X501DistinguishedName.getStringValuesForAttribute',
									{ self: this.id, in_oid: e.id }
								)
							);
						}),
					(p.X501DistinguishedName.prototype.getAllAttributesAndValues =
						function () {
							return p
								.sendWithPromise(
									'X501DistinguishedName.getAllAttributesAndValues',
									{ self: this.id }
								)
								.then(function (e) {
									for (var t = [], n = 0; n < e.length; ++n) {
										var i = e[n];
										if ('0' === i) return null;
										(i = new p.X501AttributeTypeAndValue(i)),
											t.push(i),
											a.push({ name: i.name, id: i.id });
									}
									return t;
								});
						}),
					(p.X509Certificate.createFromBuffer = function (e) {
						f(
							arguments.length,
							1,
							'createFromBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p
							.sendWithPromise('x509CertificateCreateFromBuffer', {
								in_cert_buf: t,
							})
							.then(function (e) {
								return y(p.X509Certificate, e);
							});
					}),
					(p.X509Certificate.prototype.getIssuerField = function () {
						return p
							.sendWithPromise('X509Certificate.getIssuerField', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.X501DistinguishedName, e);
							});
					}),
					(p.X509Certificate.prototype.getSubjectField = function () {
						return p
							.sendWithPromise('X509Certificate.getSubjectField', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.X501DistinguishedName, e);
							});
					}),
					(p.X509Certificate.prototype.getNotBeforeEpochTime = function () {
						return p.sendWithPromise('X509Certificate.getNotBeforeEpochTime', {
							self: this.id,
						});
					}),
					(p.X509Certificate.prototype.getNotAfterEpochTime = function () {
						return p.sendWithPromise('X509Certificate.getNotAfterEpochTime', {
							self: this.id,
						});
					}),
					(p.X509Certificate.prototype.getRawX509VersionNumber = function () {
						return p.sendWithPromise(
							'X509Certificate.getRawX509VersionNumber',
							{ self: this.id }
						);
					}),
					(p.X509Certificate.prototype.toString = function () {
						return p.sendWithPromise('X509Certificate.toString', {
							self: this.id,
						});
					}),
					(p.X509Certificate.prototype.getFingerprint = function (e) {
						return (
							void 0 === e && (e = p.DigestAlgorithm.Type.e_SHA256),
							f(arguments.length, 0, 'getFingerprint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('X509Certificate.getFingerprint', {
								self: this.id,
								in_digest_algorithm: e,
							})
						);
					}),
					(p.X509Certificate.prototype.getSerialNumber = function () {
						return p
							.sendWithPromise('X509Certificate.getSerialNumber', {
								self: this.id,
							})
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.X509Certificate.prototype.getExtensions = function () {
						return p
							.sendWithPromise('X509Certificate.getExtensions', {
								self: this.id,
							})
							.then(function (e) {
								for (var t = [], n = 0; n < e.length; ++n) {
									var i = e[n];
									if ('0' === i) return null;
									(i = new p.X509Extension(i)),
										t.push(i),
										a.push({ name: i.name, id: i.id });
								}
								return t;
							});
					}),
					(p.X509Certificate.prototype.getData = function () {
						return p
							.sendWithPromise('X509Certificate.getData', { self: this.id })
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.TimestampingConfiguration.createFromURL = function (e) {
						return (
							f(arguments.length, 1, 'createFromURL', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('timestampingConfigurationCreateFromURL', {
									in_url: e,
								})
								.then(function (e) {
									return y(p.TimestampingConfiguration, e);
								})
						);
					}),
					(p.TimestampingConfiguration.prototype.setTimestampAuthorityServerURL =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'setTimestampAuthorityServerURL',
									'(string)',
									[[e, 'string']]
								),
								p.sendWithPromise(
									'TimestampingConfiguration.setTimestampAuthorityServerURL',
									{ self: this.id, in_url: e }
								)
							);
						}),
					(p.TimestampingConfiguration.prototype.setTimestampAuthorityServerUsername =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'setTimestampAuthorityServerUsername',
									'(string)',
									[[e, 'string']]
								),
								p.sendWithPromise(
									'TimestampingConfiguration.setTimestampAuthorityServerUsername',
									{ self: this.id, in_username: e }
								)
							);
						}),
					(p.TimestampingConfiguration.prototype.setTimestampAuthorityServerPassword =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'setTimestampAuthorityServerPassword',
									'(string)',
									[[e, 'string']]
								),
								p.sendWithPromise(
									'TimestampingConfiguration.setTimestampAuthorityServerPassword',
									{ self: this.id, in_password: e }
								)
							);
						}),
					(p.TimestampingConfiguration.prototype.setUseNonce = function (e) {
						return (
							f(arguments.length, 1, 'setUseNonce', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('TimestampingConfiguration.setUseNonce', {
								self: this.id,
								in_use_nonce: e,
							})
						);
					}),
					(p.TimestampingConfiguration.prototype.testConfiguration = function (
						e
					) {
						return (
							f(
								arguments.length,
								1,
								'testConfiguration',
								'(PDFNet.VerificationOptions)',
								[[e, 'Object', p.VerificationOptions, 'VerificationOptions']]
							),
							p
								.sendWithPromise(
									'TimestampingConfiguration.testConfiguration',
									{ self: this.id, in_opts: e.id }
								)
								.then(function (e) {
									return y(p.TimestampingResult, e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.hasCryptographicSignature =
						function () {
							return (
								P('hasCryptographicSignature', this.yieldFunction),
								p.sendWithPromise(
									'DigitalSignatureField.hasCryptographicSignature',
									{ self: this }
								)
							);
						}),
					(p.DigitalSignatureField.prototype.getSubFilter = function () {
						return (
							P('getSubFilter', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getSubFilter', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getSignatureName = function () {
						return (
							P('getSignatureName', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getSignatureName', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getLocation = function () {
						return (
							P('getLocation', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getLocation', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getReason = function () {
						return (
							P('getReason', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getReason', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getContactInfo = function () {
						return (
							P('getContactInfo', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getContactInfo', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getCertCount = function () {
						return (
							P('getCertCount', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getCertCount', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.hasVisibleAppearance =
						function () {
							return (
								P('hasVisibleAppearance', this.yieldFunction),
								p.sendWithPromise(
									'DigitalSignatureField.hasVisibleAppearance',
									{ self: this }
								)
							);
						}),
					(p.DigitalSignatureField.prototype.setContactInfo = function (e) {
						f(arguments.length, 1, 'setContactInfo', '(string)', [
							[e, 'string'],
						]),
							P('setContactInfo', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.setContactInfo'),
							p
								.sendWithPromise('DigitalSignatureField.setContactInfo', {
									self: this,
									in_contact_info: e,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.setLocation = function (e) {
						f(arguments.length, 1, 'setLocation', '(string)', [[e, 'string']]),
							P('setLocation', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.setLocation'),
							p
								.sendWithPromise('DigitalSignatureField.setLocation', {
									self: this,
									in_location: e,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.setReason = function (e) {
						f(arguments.length, 1, 'setReason', '(string)', [[e, 'string']]),
							P('setReason', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.setReason'),
							p
								.sendWithPromise('DigitalSignatureField.setReason', {
									self: this,
									in_reason: e,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.setDocumentPermissions = function (
						e
					) {
						f(arguments.length, 1, 'setDocumentPermissions', '(number)', [
							[e, 'number'],
						]),
							P('setDocumentPermissions', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction =
								'DigitalSignatureField.setDocumentPermissions'),
							p
								.sendWithPromise(
									'DigitalSignatureField.setDocumentPermissions',
									{ self: this, in_perms: e }
								)
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.signOnNextSave = function (e, t) {
						f(arguments.length, 2, 'signOnNextSave', '(string, string)', [
							[e, 'string'],
							[t, 'string'],
						]),
							P('signOnNextSave', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.signOnNextSave'),
							p
								.sendWithPromise('DigitalSignatureField.signOnNextSave', {
									self: this,
									in_pkcs12_keyfile_path: e,
									in_password: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.certifyOnNextSave = function (
						e,
						t
					) {
						f(arguments.length, 2, 'certifyOnNextSave', '(string, string)', [
							[e, 'string'],
							[t, 'string'],
						]),
							P('certifyOnNextSave', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.certifyOnNextSave'),
							p
								.sendWithPromise('DigitalSignatureField.certifyOnNextSave', {
									self: this,
									in_pkcs12_keyfile_path: e,
									in_password: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.isLockedByDigitalSignature =
						function () {
							return (
								P('isLockedByDigitalSignature', this.yieldFunction),
								p.sendWithPromise(
									'DigitalSignatureField.isLockedByDigitalSignature',
									{ self: this }
								)
							);
						}),
					(p.DigitalSignatureField.prototype.getDocumentPermissions =
						function () {
							return (
								P('getDocumentPermissions', this.yieldFunction),
								p.sendWithPromise(
									'DigitalSignatureField.getDocumentPermissions',
									{ self: this }
								)
							);
						}),
					(p.DigitalSignatureField.prototype.clearSignature = function () {
						P('clearSignature', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.clearSignature'),
							p
								.sendWithPromise('DigitalSignatureField.clearSignature', {
									self: this,
								})
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.DigitalSignatureField.createFromField = function (e) {
						return (
							f(arguments.length, 1, 'createFromField', '(PDFNet.Field)', [
								[e, 'Structure', p.Field, 'Field'],
							]),
							F('createFromField', [[e, 0]]),
							p
								.sendWithPromise('digitalSignatureFieldCreateFromField', {
									in_field: e,
								})
								.then(function (e) {
									return new p.DigitalSignatureField(e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.getSigningTime = function () {
						return (
							P('getSigningTime', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.getSigningTime', {
									self: this,
								})
								.then(function (e) {
									return new p.Date(e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.getCert = function (e) {
						return (
							f(arguments.length, 1, 'getCert', '(number)', [[e, 'number']]),
							P('getCert', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.getCert', {
									self: this,
									in_index: e,
								})
								.then(function (e) {
									return new Uint8Array(e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.setFieldPermissions = function (
						e,
						t
					) {
						void 0 === t && (t = []),
							f(
								arguments.length,
								1,
								'setFieldPermissions',
								'(number, Array<string>)',
								[
									[e, 'number'],
									[t, 'Array'],
								]
							),
							P('setFieldPermissions', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction =
								'DigitalSignatureField.setFieldPermissions'),
							p
								.sendWithPromise('DigitalSignatureField.setFieldPermissions', {
									self: this,
									in_action: e,
									in_field_names_list: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.signOnNextSaveFromBuffer =
						function (e, t) {
							f(
								arguments.length,
								2,
								'signOnNextSaveFromBuffer',
								'(ArrayBuffer|TypedArray, string)',
								[
									[e, 'ArrayBuffer'],
									[t, 'string'],
								]
							),
								P('signOnNextSaveFromBuffer', this.yieldFunction);
							var n = this,
								i =
									((this.yieldFunction =
										'DigitalSignatureField.signOnNextSaveFromBuffer'),
									b(e, !1));
							return p
								.sendWithPromise(
									'DigitalSignatureField.signOnNextSaveFromBuffer',
									{ self: this, in_pkcs12_buffer: i, in_password: t }
								)
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								});
						}),
					(p.DigitalSignatureField.prototype.signOnNextSaveWithCustomHandler =
						function (e) {
							f(
								arguments.length,
								1,
								'signOnNextSaveWithCustomHandler',
								'(number)',
								[[e, 'number']]
							),
								P('signOnNextSaveWithCustomHandler', this.yieldFunction);
							var t = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.signOnNextSaveWithCustomHandler'),
								p
									.sendWithPromise(
										'DigitalSignatureField.signOnNextSaveWithCustomHandler',
										{ self: this, in_signature_handler_id: e }
									)
									.then(function (e) {
										(t.yieldFunction = void 0), O(e, t);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.certifyOnNextSaveFromBuffer =
						function (e, t) {
							f(
								arguments.length,
								2,
								'certifyOnNextSaveFromBuffer',
								'(ArrayBuffer|TypedArray, string)',
								[
									[e, 'ArrayBuffer'],
									[t, 'string'],
								]
							),
								P('certifyOnNextSaveFromBuffer', this.yieldFunction);
							var n = this,
								i =
									((this.yieldFunction =
										'DigitalSignatureField.certifyOnNextSaveFromBuffer'),
									b(e, !1));
							return p
								.sendWithPromise(
									'DigitalSignatureField.certifyOnNextSaveFromBuffer',
									{ self: this, in_pkcs12_buffer: i, in_password: t }
								)
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								});
						}),
					(p.DigitalSignatureField.prototype.certifyOnNextSaveWithCustomHandler =
						function (e) {
							f(
								arguments.length,
								1,
								'certifyOnNextSaveWithCustomHandler',
								'(number)',
								[[e, 'number']]
							),
								P('certifyOnNextSaveWithCustomHandler', this.yieldFunction);
							var t = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.certifyOnNextSaveWithCustomHandler'),
								p
									.sendWithPromise(
										'DigitalSignatureField.certifyOnNextSaveWithCustomHandler',
										{ self: this, in_signature_handler_id: e }
									)
									.then(function (e) {
										(t.yieldFunction = void 0), O(e, t);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.getSDFObj = function () {
						return (
							P('getSDFObj', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.getSDFObj', {
									self: this,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.getLockedFields = function () {
						return (
							P('getLockedFields', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.getLockedFields', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.verify = function (e) {
						return (
							f(arguments.length, 1, 'verify', '(PDFNet.VerificationOptions)', [
								[e, 'Object', p.VerificationOptions, 'VerificationOptions'],
							]),
							P('verify', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.verify', {
									self: this,
									in_opts: e.id,
								})
								.then(function (e) {
									return y(p.VerificationResult, e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.isCertification = function () {
						return (
							P('isCertification', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.isCertification', {
								self: this,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.getSignerCertFromCMS =
						function () {
							return (
								P('getSignerCertFromCMS', this.yieldFunction),
								p
									.sendWithPromise(
										'DigitalSignatureField.getSignerCertFromCMS',
										{ self: this }
									)
									.then(function (e) {
										return y(p.X509Certificate, e);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.getByteRanges = function () {
						return (
							P('getByteRanges', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.getByteRanges', {
									self: this,
								})
								.then(function (e) {
									for (var t = [], n = 0; n < e.length; ++n) {
										var i = e[n];
										if ('0' === i) return null;
										(i = new p.ByteRange(i)), t.push(i);
									}
									return t;
								})
						);
					}),
					(p.DigitalSignatureField.prototype.enableLTVOfflineVerification =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'enableLTVOfflineVerification',
									'(PDFNet.VerificationResult)',
									[[e, 'Object', p.VerificationResult, 'VerificationResult']]
								),
								P('enableLTVOfflineVerification', this.yieldFunction),
								p.sendWithPromise(
									'DigitalSignatureField.enableLTVOfflineVerification',
									{ self: this, in_verification_result: e.id }
								)
							);
						}),
					(p.DigitalSignatureField.prototype.timestampOnNextSave = function (
						e,
						t
					) {
						return (
							f(
								arguments.length,
								2,
								'timestampOnNextSave',
								'(PDFNet.TimestampingConfiguration, PDFNet.VerificationOptions)',
								[
									[
										e,
										'Object',
										p.TimestampingConfiguration,
										'TimestampingConfiguration',
									],
									[t, 'Object', p.VerificationOptions, 'VerificationOptions'],
								]
							),
							P('timestampOnNextSave', this.yieldFunction),
							p.sendWithPromise('DigitalSignatureField.timestampOnNextSave', {
								self: this,
								in_timestamping_config: e.id,
								in_timestamp_response_verification_options: t.id,
							})
						);
					}),
					(p.DigitalSignatureField.prototype.generateContentsWithEmbeddedTimestamp =
						function (e, t) {
							return (
								f(
									arguments.length,
									2,
									'generateContentsWithEmbeddedTimestamp',
									'(PDFNet.TimestampingConfiguration, PDFNet.VerificationOptions)',
									[
										[
											e,
											'Object',
											p.TimestampingConfiguration,
											'TimestampingConfiguration',
										],
										[t, 'Object', p.VerificationOptions, 'VerificationOptions'],
									]
								),
								P('generateContentsWithEmbeddedTimestamp', this.yieldFunction),
								p
									.sendWithPromise(
										'DigitalSignatureField.generateContentsWithEmbeddedTimestamp',
										{
											self: this,
											in_timestamping_config: e.id,
											in_timestamp_response_verification_options: t.id,
										}
									)
									.then(function (e) {
										return y(p.TimestampingResult, e);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.useSubFilter = function (e, t) {
						void 0 === t && (t = !0),
							f(arguments.length, 1, 'useSubFilter', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							P('useSubFilter', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.useSubFilter'),
							p
								.sendWithPromise('DigitalSignatureField.useSubFilter', {
									self: this,
									in_subfilter_type: e,
									in_make_mandatory: t,
								})
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.calculateDigest = function (e) {
						void 0 === e && (e = p.DigestAlgorithm.Type.e_SHA256),
							f(arguments.length, 0, 'calculateDigest', '(number)', [
								[e, 'number'],
							]),
							P('calculateDigest', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'DigitalSignatureField.calculateDigest'),
							p
								.sendWithPromise('DigitalSignatureField.calculateDigest', {
									self: this,
									in_digest_algorithm_type: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new Uint8Array(e.result)),
										O(e.self, t),
										e.result
									);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.setPreferredDigestAlgorithm =
						function (e, t) {
							void 0 === t && (t = !0),
								f(
									arguments.length,
									1,
									'setPreferredDigestAlgorithm',
									'(number, boolean)',
									[
										[e, 'number'],
										[t, 'boolean'],
									]
								),
								P('setPreferredDigestAlgorithm', this.yieldFunction);
							var n = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.setPreferredDigestAlgorithm'),
								p
									.sendWithPromise(
										'DigitalSignatureField.setPreferredDigestAlgorithm',
										{
											self: this,
											in_digest_algorithm_type: e,
											in_make_mandatory: t,
										}
									)
									.then(function (e) {
										(n.yieldFunction = void 0), O(e, n);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.createSigDictForCustomCertification =
						function (e, t, n) {
							f(
								arguments.length,
								3,
								'createSigDictForCustomCertification',
								'(string, number, number)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'number'],
								]
							),
								P('createSigDictForCustomCertification', this.yieldFunction);
							var i = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.createSigDictForCustomCertification'),
								p
									.sendWithPromise(
										'DigitalSignatureField.createSigDictForCustomCertification',
										{
											self: this,
											in_filter_name: e,
											in_subfilter_type: t,
											in_contents_size_to_reserve: n,
										}
									)
									.then(function (e) {
										(i.yieldFunction = void 0), O(e, i);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.createSigDictForCustomSigning =
						function (e, t, n) {
							f(
								arguments.length,
								3,
								'createSigDictForCustomSigning',
								'(string, number, number)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'number'],
								]
							),
								P('createSigDictForCustomSigning', this.yieldFunction);
							var i = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.createSigDictForCustomSigning'),
								p
									.sendWithPromise(
										'DigitalSignatureField.createSigDictForCustomSigning',
										{
											self: this,
											in_filter_name: e,
											in_subfilter_type: t,
											in_contents_size_to_reserve: n,
										}
									)
									.then(function (e) {
										(i.yieldFunction = void 0), O(e, i);
									})
							);
						}),
					(p.DigitalSignatureField.prototype.setSigDictTimeOfSigning =
						function (e) {
							f(
								arguments.length,
								1,
								'setSigDictTimeOfSigning',
								'(PDFNet.Date)',
								[[e, 'Structure', p.Date, 'Date']]
							),
								P('setSigDictTimeOfSigning', this.yieldFunction),
								F('setSigDictTimeOfSigning', [[e, 0]]);
							var t = this;
							return (
								(this.yieldFunction =
									'DigitalSignatureField.setSigDictTimeOfSigning'),
								p
									.sendWithPromise(
										'DigitalSignatureField.setSigDictTimeOfSigning',
										{ self: this, in_date: e }
									)
									.then(function (e) {
										(t.yieldFunction = void 0), O(e, t);
									})
							);
						}),
					(p.DigitalSignatureField.signDigestBuffer = function (e, t, n, i, r) {
						f(
							arguments.length,
							5,
							'signDigestBuffer',
							'(ArrayBuffer|TypedArray, ArrayBuffer|TypedArray, string, boolean, number)',
							[
								[e, 'ArrayBuffer'],
								[t, 'ArrayBuffer'],
								[n, 'string'],
								[i, 'boolean'],
								[r, 'number'],
							]
						);
						var o = b(e, !1),
							s = b(t, !1);
						return p
							.sendWithPromise('digitalSignatureFieldSignDigestBuffer', {
								in_digest_buf: o,
								in_pkcs12_buffer: s,
								in_keyfile_password: n,
								in_pades_mode: i,
								in_digest_algorithm_type: r,
							})
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.DigitalSignatureField.generateESSSigningCertPAdESAttribute =
						function (e, t) {
							return (
								f(
									arguments.length,
									2,
									'generateESSSigningCertPAdESAttribute',
									'(PDFNet.X509Certificate, number)',
									[
										[e, 'Object', p.X509Certificate, 'X509Certificate'],
										[t, 'number'],
									]
								),
								p
									.sendWithPromise(
										'digitalSignatureFieldGenerateESSSigningCertPAdESAttribute',
										{ in_signer_cert: e.id, in_digest_algorithm_type: t }
									)
									.then(function (e) {
										return new Uint8Array(e);
									})
							);
						}),
					(p.DigitalSignatureField.generateCMSSignedAttributes = function (
						e,
						t
					) {
						void 0 === t && (t = new ArrayBuffer(0)),
							f(
								arguments.length,
								1,
								'generateCMSSignedAttributes',
								'(ArrayBuffer|TypedArray, ArrayBuffer|TypedArray)',
								[
									[e, 'ArrayBuffer'],
									[t, 'ArrayBuffer'],
								]
							);
						var n = b(e, !1),
							i = b(t, !1);
						return p
							.sendWithPromise(
								'digitalSignatureFieldGenerateCMSSignedAttributes',
								{ in_digest_buf: n, in_custom_signedattributes_buf: i }
							)
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.DigitalSignatureField.generateCMSSignature = function (
						e,
						t,
						n,
						i,
						r,
						o
					) {
						f(
							arguments.length,
							6,
							'generateCMSSignature',
							'(PDFNet.X509Certificate, Array<Core.PDFNet.X509Certificate>, PDFNet.ObjectIdentifier, PDFNet.ObjectIdentifier, ArrayBuffer|TypedArray, ArrayBuffer|TypedArray)',
							[
								[e, 'Object', p.X509Certificate, 'X509Certificate'],
								[t, 'Array'],
								[n, 'Object', p.ObjectIdentifier, 'ObjectIdentifier'],
								[i, 'Object', p.ObjectIdentifier, 'ObjectIdentifier'],
								[r, 'ArrayBuffer'],
								[o, 'ArrayBuffer'],
							]
						);
						var s = b(r, !1),
							u = b(o, !1);
						return (
							(t = Array.from(t, function (e) {
								return e.id;
							})),
							p
								.sendWithPromise('digitalSignatureFieldGenerateCMSSignature', {
									in_signer_cert: e.id,
									in_chain_certs_list: t,
									in_digest_algorithm_oid: n.id,
									in_signature_algorithm_oid: i.id,
									in_signature_value_buf: s,
									in_signedattributes_buf: u,
								})
								.then(function (e) {
									return new Uint8Array(e);
								})
						);
					}),
					(p.PDFDoc.prototype.getTriggerAction = function (e) {
						return (
							f(arguments.length, 1, 'getTriggerAction', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.getTriggerAction', {
									doc: this.id,
									trigger: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.isXFA = function () {
						return p.sendWithPromise('PDFDoc.isXFA', { doc: this.id });
					}),
					(p.PDFDoc.create = function () {
						return p.sendWithPromise('pdfDocCreate', {}).then(function (e) {
							return y(p.PDFDoc, e);
						});
					}),
					(p.PDFDoc.createFromFilter = function (e) {
						return (
							f(arguments.length, 1, 'createFromFilter', '(PDFNet.Filter)', [
								[e, 'Object', p.Filter, 'Filter'],
							]),
							0 != e.id && S(e.id),
							p
								.sendWithPromise('pdfDocCreateFromFilter', {
									no_own_stream: e.id,
								})
								.then(function (e) {
									return y(p.PDFDoc, e);
								})
						);
					}),
					(p.PDFDoc.createFromBuffer = function (e) {
						f(
							arguments.length,
							1,
							'createFromBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p
							.sendWithPromise('pdfDocCreateFromBuffer', { buf: t })
							.then(function (e) {
								return y(p.PDFDoc, e);
							});
					}),
					(p.PDFDoc.createFromLayoutEls = function (e) {
						f(
							arguments.length,
							1,
							'createFromLayoutEls',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p
							.sendWithPromise('pdfDocCreateFromLayoutEls', { buf: t })
							.then(function (e) {
								return y(p.PDFDoc, e);
							});
					}),
					(p.PDFDoc.prototype.createShallowCopy = function () {
						return p
							.sendWithPromise('PDFDoc.createShallowCopy', { source: this.id })
							.then(function (e) {
								return y(p.PDFDoc, e);
							});
					}),
					(p.PDFDoc.prototype.isEncrypted = function () {
						return p.sendWithPromise('PDFDoc.isEncrypted', { doc: this.id });
					}),
					(p.PDFDoc.prototype.initStdSecurityHandlerUString = function (e) {
						return (
							f(
								arguments.length,
								1,
								'initStdSecurityHandlerUString',
								'(string)',
								[[e, 'string']]
							),
							p.sendWithPromise('PDFDoc.initStdSecurityHandlerUString', {
								doc: this.id,
								password: e,
							})
						);
					}),
					(p.PDFDoc.prototype.initStdSecurityHandlerBuffer = function (e) {
						f(
							arguments.length,
							1,
							'initStdSecurityHandlerBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise('PDFDoc.initStdSecurityHandlerBuffer', {
							doc: this.id,
							password_buf: t,
						});
					}),
					(p.PDFDoc.prototype.getSecurityHandler = function () {
						return p
							.sendWithPromise('PDFDoc.getSecurityHandler', { doc: this.id })
							.then(function (e) {
								return D(p.SecurityHandler, e);
							});
					}),
					(p.PDFDoc.prototype.setSecurityHandler = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setSecurityHandler',
								'(PDFNet.SecurityHandler)',
								[[e, 'Object', p.SecurityHandler, 'SecurityHandler']]
							),
							0 != e.id && S(e.id),
							p.sendWithPromise('PDFDoc.setSecurityHandler', {
								doc: this.id,
								no_own_handler: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.removeSecurity = function () {
						return p.sendWithPromise('PDFDoc.removeSecurity', { doc: this.id });
					}),
					(p.PDFDoc.prototype.getDocInfo = function () {
						return p
							.sendWithPromise('PDFDoc.getDocInfo', { doc: this.id })
							.then(function (e) {
								return D(p.PDFDocInfo, e);
							});
					}),
					(p.PDFDoc.prototype.getViewPrefs = function () {
						return p
							.sendWithPromise('PDFDoc.getViewPrefs', { doc: this.id })
							.then(function (e) {
								return D(p.PDFDocViewPrefs, e);
							});
					}),
					(p.PDFDoc.prototype.isModified = function () {
						return p.sendWithPromise('PDFDoc.isModified', { doc: this.id });
					}),
					(p.PDFDoc.prototype.hasRepairedXRef = function () {
						return p.sendWithPromise('PDFDoc.hasRepairedXRef', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.isLinearized = function () {
						return p.sendWithPromise('PDFDoc.isLinearized', { doc: this.id });
					}),
					(p.PDFDoc.prototype.saveMemoryBuffer = function (e) {
						return (
							f(arguments.length, 1, 'saveMemoryBuffer', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.saveMemoryBuffer', {
									doc: this.id,
									flags: e,
								})
								.then(function (e) {
									return new Uint8Array(e);
								})
						);
					}),
					(p.PDFDoc.prototype.saveStream = function (e, t) {
						return (
							f(arguments.length, 2, 'saveStream', '(PDFNet.Filter, number)', [
								[e, 'Object', p.Filter, 'Filter'],
								[t, 'number'],
							]),
							p.sendWithPromise('PDFDoc.saveStream', {
								doc: this.id,
								stream: e.id,
								flags: t,
							})
						);
					}),
					(p.PDFDoc.prototype.saveCustomSignatureBuffer = function (e, t) {
						f(
							arguments.length,
							2,
							'saveCustomSignatureBuffer',
							'(ArrayBuffer|TypedArray, PDFNet.DigitalSignatureField)',
							[
								[e, 'ArrayBuffer'],
								[
									t,
									'Structure',
									p.DigitalSignatureField,
									'DigitalSignatureField',
								],
							]
						),
							F('saveCustomSignatureBuffer', [[t, 1]]);
						var n = b(e, !1);
						return p
							.sendWithPromise('PDFDoc.saveCustomSignatureBuffer', {
								doc: this.id,
								in_signature_buf: n,
								in_field: t,
							})
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.PDFDoc.prototype.saveCustomSignatureStream = function (e, t) {
						f(
							arguments.length,
							2,
							'saveCustomSignatureStream',
							'(ArrayBuffer|TypedArray, PDFNet.DigitalSignatureField)',
							[
								[e, 'ArrayBuffer'],
								[
									t,
									'Structure',
									p.DigitalSignatureField,
									'DigitalSignatureField',
								],
							]
						),
							F('saveCustomSignatureStream', [[t, 1]]);
						var n = b(e, !1);
						return p
							.sendWithPromise('PDFDoc.saveCustomSignatureStream', {
								doc: this.id,
								in_signature_buf: n,
								in_field: t,
							})
							.then(function (e) {
								return y(p.Filter, e);
							});
					}),
					(p.PDFDoc.prototype.getPageIterator = function (e) {
						return (
							void 0 === e && (e = 1),
							f(arguments.length, 0, 'getPageIterator', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.getPageIterator', {
									doc: this.id,
									page_number: e,
								})
								.then(function (e) {
									return y(p.Iterator, e, 'Page');
								})
						);
					}),
					(p.PDFDoc.prototype.getPage = function (e) {
						return (
							f(arguments.length, 1, 'getPage', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('PDFDoc.getPage', {
									doc: this.id,
									page_number: e,
								})
								.then(function (e) {
									return D(p.Page, e);
								})
						);
					}),
					(p.PDFDoc.prototype.pageRemove = function (e) {
						return (
							f(arguments.length, 1, 'pageRemove', '(PDFNet.Iterator)', [
								[e, 'Object', p.Iterator, 'Iterator'],
							]),
							p.sendWithPromise('PDFDoc.pageRemove', {
								doc: this.id,
								page_itr: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.pageInsert = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'pageInsert',
								'(PDFNet.Iterator, PDFNet.Page)',
								[
									[e, 'Object', p.Iterator, 'Iterator'],
									[t, 'Object', p.Page, 'Page'],
								]
							),
							p.sendWithPromise('PDFDoc.pageInsert', {
								doc: this.id,
								where: e.id,
								page: t.id,
							})
						);
					}),
					(p.PDFDoc.prototype.insertPages = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'insertPages',
								'(number, PDFNet.PDFDoc, number, number, number)',
								[
									[e, 'number'],
									[t, 'PDFDoc'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p.sendWithPromise('PDFDoc.insertPages', {
								dest_doc: this.id,
								insert_before_page_number: e,
								src_doc: t.id,
								start_page: n,
								end_page: i,
								flag: r,
							})
						);
					}),
					(p.PDFDoc.prototype.insertPageSet = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'insertPageSet',
								'(number, PDFNet.PDFDoc, PDFNet.PageSet, number)',
								[
									[e, 'number'],
									[t, 'PDFDoc'],
									[n, 'Object', p.PageSet, 'PageSet'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('PDFDoc.insertPageSet', {
								dest_doc: this.id,
								insert_before_page_number: e,
								src_doc: t.id,
								source_page_set: n.id,
								flag: i,
							})
						);
					}),
					(p.PDFDoc.prototype.movePages = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'movePages',
								'(number, PDFNet.PDFDoc, number, number, number)',
								[
									[e, 'number'],
									[t, 'PDFDoc'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p.sendWithPromise('PDFDoc.movePages', {
								dest_doc: this.id,
								move_before_page_number: e,
								src_doc: t.id,
								start_page: n,
								end_page: i,
								flag: r,
							})
						);
					}),
					(p.PDFDoc.prototype.movePageSet = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'movePageSet',
								'(number, PDFNet.PDFDoc, PDFNet.PageSet, number)',
								[
									[e, 'number'],
									[t, 'PDFDoc'],
									[n, 'Object', p.PageSet, 'PageSet'],
									[i, 'number'],
								]
							),
							p.sendWithPromise('PDFDoc.movePageSet', {
								dest_doc: this.id,
								move_before_page_number: e,
								src_doc: t.id,
								source_page_set: n.id,
								flag: i,
							})
						);
					}),
					(p.PDFDoc.prototype.pagePushFront = function (e) {
						return (
							f(arguments.length, 1, 'pagePushFront', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('PDFDoc.pagePushFront', {
								doc: this.id,
								page: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.pagePushBack = function (e) {
						return (
							f(arguments.length, 1, 'pagePushBack', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('PDFDoc.pagePushBack', {
								doc: this.id,
								page: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.pageCreate = function (e) {
						return (
							void 0 === e && (e = new p.Rect(0, 0, 612, 792)),
							f(arguments.length, 0, 'pageCreate', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('pageCreate', [[e, 0]]),
							p
								.sendWithPromise('PDFDoc.pageCreate', {
									doc: this.id,
									media_box: e,
								})
								.then(function (e) {
									return D(p.Page, e);
								})
						);
					}),
					(p.PDFDoc.prototype.appendTextDiffPage = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'appendTextDiffPage',
								'(PDFNet.Page, PDFNet.Page)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'Object', p.Page, 'Page'],
								]
							),
							p.sendWithPromise('PDFDoc.appendTextDiffPage', {
								doc: this.id,
								page1: e.id,
								page2: t.id,
							})
						);
					}),
					(p.PDFDoc.prototype.appendTextDiffDoc = function (e, t, n) {
						return (
							void 0 === n && (n = null),
							f(
								arguments.length,
								2,
								'appendTextDiffDoc',
								'(PDFNet.PDFDoc, PDFNet.PDFDoc, PDFNet.OptionBase)',
								[
									[e, 'PDFDoc'],
									[t, 'PDFDoc'],
									[n, 'OptionBase'],
								]
							),
							F('appendTextDiffDoc', [[n, 2]]),
							(n = n ? n.getJsonString() : '{}'),
							p.sendWithPromise('PDFDoc.appendTextDiffDoc', {
								doc: this.id,
								doc1: e.id,
								doc2: t.id,
								options: n,
							})
						);
					}),
					(p.PDFDoc.highlightTextDiff = function (e, t, n) {
						return (
							void 0 === n && (n = null),
							f(
								arguments.length,
								2,
								'highlightTextDiff',
								'(PDFNet.PDFDoc, PDFNet.PDFDoc, PDFNet.OptionBase)',
								[
									[e, 'PDFDoc'],
									[t, 'PDFDoc'],
									[n, 'OptionBase'],
								]
							),
							F('highlightTextDiff', [[n, 2]]),
							(n = n ? n.getJsonString() : '{}'),
							p.sendWithPromise('pdfDocHighlightTextDiff', {
								doc1: e.id,
								doc2: t.id,
								options: n,
							})
						);
					}),
					(p.PDFDoc.prototype.getFirstBookmark = function () {
						return p
							.sendWithPromise('PDFDoc.getFirstBookmark', { doc: this.id })
							.then(function (e) {
								return D(p.Bookmark, e);
							});
					}),
					(p.PDFDoc.prototype.addRootBookmark = function (e) {
						return (
							f(arguments.length, 1, 'addRootBookmark', '(PDFNet.Bookmark)', [
								[e, 'Object', p.Bookmark, 'Bookmark'],
							]),
							p.sendWithPromise('PDFDoc.addRootBookmark', {
								doc: this.id,
								root_bookmark: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.getTrailer = function () {
						return p
							.sendWithPromise('PDFDoc.getTrailer', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.getRoot = function () {
						return p
							.sendWithPromise('PDFDoc.getRoot', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.jsContextInitialize = function () {
						return p.sendWithPromise('PDFDoc.jsContextInitialize', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.getPages = function () {
						return p
							.sendWithPromise('PDFDoc.getPages', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.getPageCount = function () {
						return p.sendWithPromise('PDFDoc.getPageCount', { doc: this.id });
					}),
					(p.PDFDoc.prototype.getDownloadedByteCount = function () {
						return p.sendWithPromise('PDFDoc.getDownloadedByteCount', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.getTotalRemoteByteCount = function () {
						return p.sendWithPromise('PDFDoc.getTotalRemoteByteCount', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.getFieldIteratorBegin = function () {
						return p
							.sendWithPromise('PDFDoc.getFieldIteratorBegin', { doc: this.id })
							.then(function (e) {
								return y(p.Iterator, e, 'Field');
							});
					}),
					(p.PDFDoc.prototype.getFieldIterator = function (e) {
						return (
							f(arguments.length, 1, 'getFieldIterator', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('PDFDoc.getFieldIterator', {
									doc: this.id,
									field_name: e,
								})
								.then(function (e) {
									return y(p.Iterator, e, 'Field');
								})
						);
					}),
					(p.PDFDoc.prototype.getField = function (e) {
						return (
							f(arguments.length, 1, 'getField', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('PDFDoc.getField', {
									doc: this.id,
									field_name: e,
								})
								.then(function (e) {
									return new p.Field(e);
								})
						);
					}),
					(p.PDFDoc.prototype.fieldCreate = function (e, t, n, i) {
						return (
							void 0 === n && (n = new p.Obj('0')),
							void 0 === i && (i = new p.Obj('0')),
							f(
								arguments.length,
								2,
								'fieldCreate',
								'(string, number, PDFNet.Obj, PDFNet.Obj)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'Object', p.Obj, 'Obj'],
									[i, 'Object', p.Obj, 'Obj'],
								]
							),
							p
								.sendWithPromise('PDFDoc.fieldCreate', {
									doc: this.id,
									field_name: e,
									type: t,
									field_value: n.id,
									def_field_value: i.id,
								})
								.then(function (e) {
									return new p.Field(e);
								})
						);
					}),
					(p.PDFDoc.prototype.fieldCreateFromStrings = function (e, t, n, i) {
						return (
							void 0 === i && (i = ''),
							f(
								arguments.length,
								3,
								'fieldCreateFromStrings',
								'(string, number, string, string)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'string'],
									[i, 'string'],
								]
							),
							p
								.sendWithPromise('PDFDoc.fieldCreateFromStrings', {
									doc: this.id,
									field_name: e,
									type: t,
									field_value: n,
									def_field_value: i,
								})
								.then(function (e) {
									return new p.Field(e);
								})
						);
					}),
					(p.PDFDoc.prototype.refreshFieldAppearances = function () {
						return p.sendWithPromise('PDFDoc.refreshFieldAppearances', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.refreshAnnotAppearances = function (e) {
						return (
							void 0 === e && (e = null),
							f(
								arguments.length,
								0,
								'refreshAnnotAppearances',
								'(PDFNet.OptionBase)',
								[[e, 'OptionBase']]
							),
							F('refreshAnnotAppearances', [[e, 0]]),
							(e = e ? e.getJsonString() : '{}'),
							p.sendWithPromise('PDFDoc.refreshAnnotAppearances', {
								doc: this.id,
								options: e,
							})
						);
					}),
					(p.PDFDoc.prototype.flattenAnnotations = function (e) {
						return (
							void 0 === e && (e = !1),
							f(arguments.length, 0, 'flattenAnnotations', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDoc.flattenAnnotations', {
								doc: this.id,
								forms_only: e,
							})
						);
					}),
					(p.PDFDoc.prototype.flattenAnnotationsAdvanced = function (e) {
						return (
							f(arguments.length, 1, 'flattenAnnotationsAdvanced', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDoc.flattenAnnotationsAdvanced', {
								doc: this.id,
								flags: e,
							})
						);
					}),
					(p.PDFDoc.prototype.getAcroForm = function () {
						return p
							.sendWithPromise('PDFDoc.getAcroForm', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.fdfExtract = function (e) {
						return (
							void 0 === e && (e = p.PDFDoc.ExtractFlag.e_forms_only),
							f(arguments.length, 0, 'fdfExtract', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('PDFDoc.fdfExtract', { doc: this.id, flag: e })
								.then(function (e) {
									return y(p.FDFDoc, e);
								})
						);
					}),
					(p.PDFDoc.prototype.fdfExtractPageSet = function (e, t) {
						return (
							void 0 === t && (t = p.PDFDoc.ExtractFlag.e_forms_only),
							f(
								arguments.length,
								1,
								'fdfExtractPageSet',
								'(PDFNet.PageSet, number)',
								[
									[e, 'Object', p.PageSet, 'PageSet'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('PDFDoc.fdfExtractPageSet', {
									doc: this.id,
									pages_to_extract: e.id,
									flag: t,
								})
								.then(function (e) {
									return y(p.FDFDoc, e);
								})
						);
					}),
					(p.PDFDoc.prototype.fdfMerge = function (e) {
						return (
							f(arguments.length, 1, 'fdfMerge', '(PDFNet.FDFDoc)', [
								[e, 'FDFDoc'],
							]),
							p.sendWithPromise('PDFDoc.fdfMerge', {
								doc: this.id,
								fdf_doc: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.fdfUpdate = function (e) {
						return (
							f(arguments.length, 1, 'fdfUpdate', '(PDFNet.FDFDoc)', [
								[e, 'FDFDoc'],
							]),
							p.sendWithPromise('PDFDoc.fdfUpdate', {
								doc: this.id,
								fdf_doc: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.getOpenAction = function () {
						return p
							.sendWithPromise('PDFDoc.getOpenAction', { doc: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.PDFDoc.prototype.setOpenAction = function (e) {
						return (
							f(arguments.length, 1, 'setOpenAction', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p.sendWithPromise('PDFDoc.setOpenAction', {
								doc: this.id,
								action: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.addFileAttachment = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'addFileAttachment',
								'(string, PDFNet.FileSpec)',
								[
									[e, 'string'],
									[t, 'Object', p.FileSpec, 'FileSpec'],
								]
							),
							p.sendWithPromise('PDFDoc.addFileAttachment', {
								doc: this.id,
								file_key: e,
								embedded_file: t.id,
							})
						);
					}),
					(p.PDFDoc.prototype.getPageLabel = function (e) {
						return (
							f(arguments.length, 1, 'getPageLabel', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.getPageLabel', {
									doc: this.id,
									page_num: e,
								})
								.then(function (e) {
									return new p.PageLabel(e);
								})
						);
					}),
					(p.PDFDoc.prototype.setPageLabel = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setPageLabel',
								'(number, PDFNet.PageLabel)',
								[
									[e, 'number'],
									[t, 'Structure', p.PageLabel, 'PageLabel'],
								]
							),
							F('setPageLabel', [[t, 1]]),
							p.sendWithPromise('PDFDoc.setPageLabel', {
								doc: this.id,
								page_num: e,
								label: t,
							})
						);
					}),
					(p.PDFDoc.prototype.removePageLabel = function (e) {
						return (
							f(arguments.length, 1, 'removePageLabel', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDoc.removePageLabel', {
								doc: this.id,
								page_num: e,
							})
						);
					}),
					(p.PDFDoc.prototype.getStructTree = function () {
						return p
							.sendWithPromise('PDFDoc.getStructTree', { doc: this.id })
							.then(function (e) {
								return D(p.STree, e);
							});
					}),
					(p.PDFDoc.prototype.hasOC = function () {
						return p.sendWithPromise('PDFDoc.hasOC', { doc: this.id });
					}),
					(p.PDFDoc.prototype.getOCGs = function () {
						return p
							.sendWithPromise('PDFDoc.getOCGs', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.getOCGConfig = function () {
						return p
							.sendWithPromise('PDFDoc.getOCGConfig', { doc: this.id })
							.then(function (e) {
								return D(p.OCGConfig, e);
							});
					}),
					(p.PDFDoc.prototype.createIndirectName = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectName', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('PDFDoc.createIndirectName', {
									doc: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectArray = function () {
						return p
							.sendWithPromise('PDFDoc.createIndirectArray', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.createIndirectBool = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectBool', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('PDFDoc.createIndirectBool', {
									doc: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectDict = function () {
						return p
							.sendWithPromise('PDFDoc.createIndirectDict', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.createIndirectNull = function () {
						return p
							.sendWithPromise('PDFDoc.createIndirectNull', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDoc.prototype.createIndirectNumber = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectNumber', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.createIndirectNumber', {
									doc: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectString = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'createIndirectString',
								'(number, number)',
								[
									[e, 'number'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('PDFDoc.createIndirectString', {
									doc: this.id,
									value: e,
									buf_size: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectStringFromUString = function (e) {
						return (
							f(
								arguments.length,
								1,
								'createIndirectStringFromUString',
								'(string)',
								[[e, 'string']]
							),
							p
								.sendWithPromise('PDFDoc.createIndirectStringFromUString', {
									doc: this.id,
									str: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectStreamFromFilter = function (e, t) {
						return (
							void 0 === t && (t = new p.Filter('0')),
							f(
								arguments.length,
								1,
								'createIndirectStreamFromFilter',
								'(PDFNet.FilterReader, PDFNet.Filter)',
								[
									[e, 'Object', p.FilterReader, 'FilterReader'],
									[t, 'Object', p.Filter, 'Filter'],
								]
							),
							0 != t.id && S(t.id),
							p
								.sendWithPromise('PDFDoc.createIndirectStreamFromFilter', {
									doc: this.id,
									data: e.id,
									no_own_filter_chain: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.createIndirectStream = function (e, t) {
						f(
							arguments.length,
							2,
							'createIndirectStream',
							'(ArrayBuffer|TypedArray, PDFNet.Filter)',
							[
								[e, 'ArrayBuffer'],
								[t, 'Object', p.Filter, 'Filter'],
							]
						);
						var n = b(e, !1);
						return (
							0 != t.id && S(t.id),
							p
								.sendWithPromise('PDFDoc.createIndirectStream', {
									doc: this.id,
									data_buf: n,
									no_own_filter_chain: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.PDFDoc.prototype.getSDFDoc = function () {
						return p
							.sendWithPromise('PDFDoc.getSDFDoc', { doc: this.id })
							.then(function (e) {
								return D(p.SDFDoc, e);
							});
					}),
					(p.PDFDoc.prototype.unlock = function () {
						var e = this;
						return p
							.sendWithPromise('PDFDoc.unlock', { doc: this.id })
							.then(function () {
								_(e);
							});
					}),
					(p.PDFDoc.prototype.unlockRead = function () {
						var e = this;
						return p
							.sendWithPromise('PDFDoc.unlockRead', { doc: this.id })
							.then(function () {
								_(e);
							});
					}),
					(p.PDFDoc.prototype.addHighlights = function (e) {
						return (
							f(arguments.length, 1, 'addHighlights', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('PDFDoc.addHighlights', {
								doc: this.id,
								hilite: e,
							})
						);
					}),
					(p.PDFDoc.prototype.isTagged = function () {
						return p.sendWithPromise('PDFDoc.isTagged', { doc: this.id });
					}),
					(p.PDFDoc.prototype.hasSignatures = function () {
						return p.sendWithPromise('PDFDoc.hasSignatures', { doc: this.id });
					}),
					(p.PDFDoc.prototype.addSignatureHandler = function (e) {
						return (
							f(
								arguments.length,
								1,
								'addSignatureHandler',
								'(PDFNet.SignatureHandler)',
								[[e, 'Object', p.SignatureHandler, 'SignatureHandler']]
							),
							p.sendWithPromise('PDFDoc.addSignatureHandler', {
								doc: this.id,
								signature_handler: e.id,
							})
						);
					}),
					(p.PDFDoc.prototype.addStdSignatureHandlerFromBuffer = function (
						e,
						t
					) {
						f(
							arguments.length,
							2,
							'addStdSignatureHandlerFromBuffer',
							'(ArrayBuffer|TypedArray, string)',
							[
								[e, 'ArrayBuffer'],
								[t, 'string'],
							]
						);
						var n = b(e, !1);
						return p.sendWithPromise(
							'PDFDoc.addStdSignatureHandlerFromBuffer',
							{ doc: this.id, pkcs12_buffer: n, pkcs12_pass: t }
						);
					}),
					(p.PDFDoc.prototype.removeSignatureHandler = function (e) {
						return (
							f(arguments.length, 1, 'removeSignatureHandler', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDoc.removeSignatureHandler', {
								doc: this.id,
								signature_handler_id: e,
							})
						);
					}),
					(p.PDFDoc.prototype.getSignatureHandler = function (e) {
						return (
							f(arguments.length, 1, 'getSignatureHandler', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('PDFDoc.getSignatureHandler', {
									doc: this.id,
									signature_handler_id: e,
								})
								.then(function (e) {
									return D(p.SignatureHandler, e);
								})
						);
					}),
					(p.PDFDoc.prototype.generateThumbnails = function (e) {
						return (
							f(arguments.length, 1, 'generateThumbnails', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDoc.generateThumbnails', {
								doc: this.id,
								size: e,
							})
						);
					}),
					(p.PDFDoc.prototype.appendVisualDiff = function (e, t, n) {
						return (
							void 0 === n && (n = null),
							f(
								arguments.length,
								2,
								'appendVisualDiff',
								'(PDFNet.Page, PDFNet.Page, PDFNet.OptionBase)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'Object', p.Page, 'Page'],
									[n, 'OptionBase'],
								]
							),
							F('appendVisualDiff', [[n, 2]]),
							(n = n ? n.getJsonString() : '{}'),
							p.sendWithPromise('PDFDoc.appendVisualDiff', {
								doc: this.id,
								p1: e.id,
								p2: t.id,
								opts: n,
							})
						);
					}),
					(p.PDFDoc.prototype.getGeometryCollectionForPage = function (e) {
						return (
							f(
								arguments.length,
								1,
								'getGeometryCollectionForPage',
								'(number)',
								[[e, 'number']]
							),
							p
								.sendWithPromise('PDFDoc.getGeometryCollectionForPage', {
									in_pdfdoc: this.id,
									page_num: e,
								})
								.then(function (e) {
									return y(p.GeometryCollection, e);
								})
						);
					}),
					(p.PDFDoc.prototype.getUndoManager = function () {
						return p
							.sendWithPromise('PDFDoc.getUndoManager', { doc: this.id })
							.then(function (e) {
								return y(p.UndoManager, e);
							});
					}),
					(p.PDFDoc.prototype.createDigitalSignatureField = function (e) {
						return (
							void 0 === e && (e = ''),
							f(
								arguments.length,
								0,
								'createDigitalSignatureField',
								'(string)',
								[[e, 'string']]
							),
							p
								.sendWithPromise('PDFDoc.createDigitalSignatureField', {
									doc: this.id,
									in_sig_field_name: e,
								})
								.then(function (e) {
									return new p.DigitalSignatureField(e);
								})
						);
					}),
					(p.PDFDoc.prototype.getDigitalSignatureFieldIteratorBegin =
						function () {
							return p
								.sendWithPromise(
									'PDFDoc.getDigitalSignatureFieldIteratorBegin',
									{ doc: this.id }
								)
								.then(function (e) {
									return y(p.Iterator, e, 'DigitalSignatureField');
								});
						}),
					(p.PDFDoc.prototype.getDigitalSignaturePermissions = function () {
						return p.sendWithPromise('PDFDoc.getDigitalSignaturePermissions', {
							doc: this.id,
						});
					}),
					(p.PDFDoc.prototype.saveViewerOptimizedBuffer = function (e) {
						f(
							arguments.length,
							1,
							'saveViewerOptimizedBuffer',
							'(PDFNet.Obj)',
							[
								[
									e,
									'OptionObject',
									p.Obj,
									'Obj',
									'PDFNet.PDFDoc.ViewerOptimizedOptions',
								],
							]
						),
							(e =
								'PDFNet.PDFDoc.ViewerOptimizedOptions' === e.name
									? ((t = e),
									  p.ObjSet.create().then(function (e) {
											return e.createFromJson(JSON.stringify(t));
									  }))
									: Promise.resolve(e));
						var t,
							n = this;
						return e.then(function (e) {
							return p
								.sendWithPromise('PDFDoc.saveViewerOptimizedBuffer', {
									doc: n.id,
									opts: e.id,
								})
								.then(function (e) {
									return new Uint8Array(e);
								});
						});
					}),
					(p.PDFDoc.prototype.verifySignedDigitalSignatures = function (e) {
						return (
							f(
								arguments.length,
								1,
								'verifySignedDigitalSignatures',
								'(PDFNet.VerificationOptions)',
								[[e, 'Object', p.VerificationOptions, 'VerificationOptions']]
							),
							p.sendWithPromise('PDFDoc.verifySignedDigitalSignatures', {
								doc: this.id,
								opts: e.id,
							})
						);
					}),
					(p.convertPageToAnnotAppearance = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'convertPageToAnnotAppearance',
								'(PDFNet.PDFDoc, number, number, string)',
								[
									[e, 'PDFDoc'],
									[t, 'number'],
									[n, 'number'],
									[i, 'string'],
								]
							),
							p.sendWithPromise('convertPageToAnnotAppearance', {
								docWithAppearance: e.id,
								objNum: t,
								annot_state: n,
								appearance_state: i,
							})
						);
					}),
					(p.PDFDoc.prototype.mergeXFDF = function (e, t) {
						return (
							void 0 === t && (t = null),
							f(
								arguments.length,
								1,
								'mergeXFDF',
								'(PDFNet.Filter, PDFNet.OptionBase)',
								[
									[e, 'Object', p.Filter, 'Filter'],
									[t, 'OptionBase'],
								]
							),
							F('mergeXFDF', [[t, 1]]),
							(t = t ? t.getJsonString() : '{}'),
							p.sendWithPromise('PDFDoc.mergeXFDF', {
								doc: this.id,
								stream: e.id,
								options: t,
							})
						);
					}),
					(p.PDFDoc.prototype.mergeXFDFString = function (e, t) {
						return (
							void 0 === t && (t = null),
							f(
								arguments.length,
								1,
								'mergeXFDFString',
								'(string, PDFNet.OptionBase)',
								[
									[e, 'string'],
									[t, 'OptionBase'],
								]
							),
							F('mergeXFDFString', [[t, 1]]),
							(t = t ? t.getJsonString() : '{}'),
							p.sendWithPromise('PDFDoc.mergeXFDFString', {
								doc: this.id,
								xfdf: e,
								options: t,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getTitle = function () {
						return p.sendWithPromise('PDFDocInfo.getTitle', { info: this.id });
					}),
					(p.PDFDocInfo.prototype.getTitleObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getTitleObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setTitle = function (e) {
						return (
							f(arguments.length, 1, 'setTitle', '(string)', [[e, 'string']]),
							p.sendWithPromise('PDFDocInfo.setTitle', {
								info: this.id,
								title: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getAuthor = function () {
						return p.sendWithPromise('PDFDocInfo.getAuthor', { info: this.id });
					}),
					(p.PDFDocInfo.prototype.getAuthorObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getAuthorObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setAuthor = function (e) {
						return (
							f(arguments.length, 1, 'setAuthor', '(string)', [[e, 'string']]),
							p.sendWithPromise('PDFDocInfo.setAuthor', {
								info: this.id,
								author: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getSubject = function () {
						return p.sendWithPromise('PDFDocInfo.getSubject', {
							info: this.id,
						});
					}),
					(p.PDFDocInfo.prototype.getSubjectObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getSubjectObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setSubject = function (e) {
						return (
							f(arguments.length, 1, 'setSubject', '(string)', [[e, 'string']]),
							p.sendWithPromise('PDFDocInfo.setSubject', {
								info: this.id,
								subject: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getKeywords = function () {
						return p.sendWithPromise('PDFDocInfo.getKeywords', {
							info: this.id,
						});
					}),
					(p.PDFDocInfo.prototype.getKeywordsObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getKeywordsObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setKeywords = function (e) {
						return (
							f(arguments.length, 1, 'setKeywords', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('PDFDocInfo.setKeywords', {
								info: this.id,
								keywords: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getCreator = function () {
						return p.sendWithPromise('PDFDocInfo.getCreator', {
							info: this.id,
						});
					}),
					(p.PDFDocInfo.prototype.getCreatorObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getCreatorObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setCreator = function (e) {
						return (
							f(arguments.length, 1, 'setCreator', '(string)', [[e, 'string']]),
							p.sendWithPromise('PDFDocInfo.setCreator', {
								info: this.id,
								creator: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getProducer = function () {
						return p.sendWithPromise('PDFDocInfo.getProducer', {
							info: this.id,
						});
					}),
					(p.PDFDocInfo.prototype.getProducerObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getProducerObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.prototype.setProducer = function (e) {
						return (
							f(arguments.length, 1, 'setProducer', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('PDFDocInfo.setProducer', {
								info: this.id,
								producer: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getCreationDate = function () {
						return p
							.sendWithPromise('PDFDocInfo.getCreationDate', { info: this.id })
							.then(function (e) {
								return new p.Date(e);
							});
					}),
					(p.PDFDocInfo.prototype.setCreationDate = function (e) {
						return (
							f(arguments.length, 1, 'setCreationDate', '(PDFNet.Date)', [
								[e, 'Structure', p.Date, 'Date'],
							]),
							F('setCreationDate', [[e, 0]]),
							p.sendWithPromise('PDFDocInfo.setCreationDate', {
								info: this.id,
								creation_date: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getModDate = function () {
						return p
							.sendWithPromise('PDFDocInfo.getModDate', { info: this.id })
							.then(function (e) {
								return new p.Date(e);
							});
					}),
					(p.PDFDocInfo.prototype.setModDate = function (e) {
						return (
							f(arguments.length, 1, 'setModDate', '(PDFNet.Date)', [
								[e, 'Structure', p.Date, 'Date'],
							]),
							F('setModDate', [[e, 0]]),
							p.sendWithPromise('PDFDocInfo.setModDate', {
								info: this.id,
								mod_date: e,
							})
						);
					}),
					(p.PDFDocInfo.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('PDFDocInfo.getSDFObj', { info: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocInfo.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('pdfDocInfoCreate', { tr: e.id })
								.then(function (e) {
									return D(p.PDFDocInfo, e);
								})
						);
					}),
					(p.PDFDocInfo.prototype.copy = function () {
						return p
							.sendWithPromise('PDFDocInfo.copy', { info: this.id })
							.then(function (e) {
								return D(p.PDFDocInfo, e);
							});
					}),
					(p.PDFDocViewPrefs.prototype.setInitialPage = function (e) {
						return (
							f(arguments.length, 1, 'setInitialPage', '(PDFNet.Destination)', [
								[e, 'Object', p.Destination, 'Destination'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setInitialPage', {
								p: this.id,
								dest: e.id,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.setPageMode = function (e) {
						return (
							f(arguments.length, 1, 'setPageMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setPageMode', {
								p: this.id,
								mode: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getPageMode = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getPageMode', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setLayoutMode = function (e) {
						return (
							f(arguments.length, 1, 'setLayoutMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setLayoutMode', {
								p: this.id,
								mode: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getLayoutMode = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getLayoutMode', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setPref = function (e, t) {
						return (
							f(arguments.length, 2, 'setPref', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setPref', {
								p: this.id,
								pref: e,
								value: t,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getPref = function (e) {
						return (
							f(arguments.length, 1, 'getPref', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFDocViewPrefs.getPref', {
								p: this.id,
								pref: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.setNonFullScreenPageMode = function (e) {
						return (
							f(arguments.length, 1, 'setNonFullScreenPageMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setNonFullScreenPageMode', {
								p: this.id,
								mode: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getNonFullScreenPageMode = function () {
						return p.sendWithPromise(
							'PDFDocViewPrefs.getNonFullScreenPageMode',
							{ p: this.id }
						);
					}),
					(p.PDFDocViewPrefs.prototype.setDirection = function (e) {
						return (
							f(arguments.length, 1, 'setDirection', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setDirection', {
								p: this.id,
								left_to_right: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getDirection = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getDirection', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setViewArea = function (e) {
						return (
							f(arguments.length, 1, 'setViewArea', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setViewArea', {
								p: this.id,
								box: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getViewArea = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getViewArea', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setViewClip = function (e) {
						return (
							f(arguments.length, 1, 'setViewClip', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setViewClip', {
								p: this.id,
								box: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getViewClip = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getViewClip', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setPrintArea = function (e) {
						return (
							f(arguments.length, 1, 'setPrintArea', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setPrintArea', {
								p: this.id,
								box: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getPrintArea = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getPrintArea', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.setPrintClip = function (e) {
						return (
							f(arguments.length, 1, 'setPrintClip', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDocViewPrefs.setPrintClip', {
								p: this.id,
								box: e,
							})
						);
					}),
					(p.PDFDocViewPrefs.prototype.getPrintClip = function () {
						return p.sendWithPromise('PDFDocViewPrefs.getPrintClip', {
							p: this.id,
						});
					}),
					(p.PDFDocViewPrefs.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('PDFDocViewPrefs.getSDFObj', { p: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.PDFDocViewPrefs.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('pdfDocViewPrefsCreate', { tr: e.id })
								.then(function (e) {
									return D(p.PDFDocViewPrefs, e);
								})
						);
					}),
					(p.PDFDocViewPrefs.prototype.copy = function () {
						return p
							.sendWithPromise('PDFDocViewPrefs.copy', { prefs: this.id })
							.then(function (e) {
								return D(p.PDFDocViewPrefs, e);
							});
					}),
					(p.PDFRasterizer.create = function (e) {
						return (
							void 0 === e && (e = p.PDFRasterizer.Type.e_BuiltIn),
							f(arguments.length, 0, 'create', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('pdfRasterizerCreate', { type: e })
								.then(function (e) {
									return y(p.PDFRasterizer, e);
								})
						);
					}),
					(p.PDFRasterizer.prototype.setDrawAnnotations = function (e) {
						return (
							f(arguments.length, 1, 'setDrawAnnotations', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setDrawAnnotations', {
								r: this.id,
								render_annots: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setHighlightFields = function (e) {
						return (
							f(arguments.length, 1, 'setHighlightFields', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setHighlightFields', {
								r: this.id,
								highlight: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setAntiAliasing = function (e) {
						return (
							f(arguments.length, 1, 'setAntiAliasing', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setAntiAliasing', {
								r: this.id,
								enable_aa: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setPathHinting = function (e) {
						return (
							f(arguments.length, 1, 'setPathHinting', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setPathHinting', {
								r: this.id,
								enable_hinting: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setThinLineAdjustment = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setThinLineAdjustment',
								'(boolean, boolean)',
								[
									[e, 'boolean'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('PDFRasterizer.setThinLineAdjustment', {
								r: this.id,
								grid_fit: e,
								stroke_adjust: t,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setGamma = function (e) {
						return (
							f(arguments.length, 1, 'setGamma', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFRasterizer.setGamma', {
								r: this.id,
								expgamma: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setOCGContext = function (e) {
						return (
							f(arguments.length, 1, 'setOCGContext', '(PDFNet.OCGContext)', [
								[e, 'Object', p.OCGContext, 'OCGContext'],
							]),
							p.sendWithPromise('PDFRasterizer.setOCGContext', {
								r: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setPrintMode = function (e) {
						return (
							f(arguments.length, 1, 'setPrintMode', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setPrintMode', {
								r: this.id,
								is_printing: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setImageSmoothing = function (e, t) {
						return (
							void 0 === e && (e = !0),
							void 0 === t && (t = !1),
							f(
								arguments.length,
								0,
								'setImageSmoothing',
								'(boolean, boolean)',
								[
									[e, 'boolean'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('PDFRasterizer.setImageSmoothing', {
								r: this.id,
								smoothing_enabled: e,
								hq_image_resampling: t,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setOverprint = function (e) {
						return (
							f(arguments.length, 1, 'setOverprint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFRasterizer.setOverprint', {
								r: this.id,
								op: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setCaching = function (e) {
						return (
							void 0 === e && (e = !0),
							f(arguments.length, 0, 'setCaching', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.setCaching', {
								r: this.id,
								enabled: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setOCGContext = function (e) {
						return (
							f(arguments.length, 1, 'setOCGContext', '(PDFNet.OCGContext)', [
								[e, 'Object', p.OCGContext, 'OCGContext'],
							]),
							p.sendWithPromise('PDFDraw.setOCGContext', {
								r: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setAnnotationState = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setAnnotationState',
								'(PDFNet.Annot, number)',
								[
									[e, 'Object', p.Annot, 'Annot'],
									[t, 'number'],
								]
							),
							p.sendWithPromise('PDFRasterizer.setAnnotationState', {
								r: this.id,
								annot: e.id,
								new_view_state: t,
							})
						);
					}),
					(p.PDFRasterizer.prototype.setRasterizerType = function (e) {
						return (
							f(arguments.length, 1, 'setRasterizerType', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFRasterizer.setRasterizerType', {
								r: this.id,
								type: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.getRasterizerType = function () {
						return p.sendWithPromise('PDFRasterizer.getRasterizerType', {
							r: this.id,
						});
					}),
					(p.PDFRasterizer.prototype.setColorPostProcessMode = function (e) {
						return (
							f(arguments.length, 1, 'setColorPostProcessMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFRasterizer.setColorPostProcessMode', {
								r: this.id,
								mode: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.getColorPostProcessMode = function () {
						return p.sendWithPromise('PDFRasterizer.getColorPostProcessMode', {
							r: this.id,
						});
					}),
					(p.PDFRasterizer.prototype.enableDisplayListCaching = function (e) {
						return (
							f(arguments.length, 1, 'enableDisplayListCaching', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFRasterizer.enableDisplayListCaching', {
								r: this.id,
								enabled: e,
							})
						);
					}),
					(p.PDFRasterizer.prototype.updateBuffer = function () {
						return p.sendWithPromise('PDFRasterizer.updateBuffer', {
							r: this.id,
						});
					}),
					(p.PDFRasterizer.prototype.rasterizeAnnot = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'rasterizeAnnot',
								'(PDFNet.Annot, PDFNet.Page, PDFNet.Matrix2D, boolean, boolean)',
								[
									[e, 'Object', p.Annot, 'Annot'],
									[t, 'Object', p.Page, 'Page'],
									[n, 'Structure', p.Matrix2D, 'Matrix2D'],
									[i, 'boolean'],
									[r, 'boolean'],
								]
							),
							F('rasterizeAnnot', [[n, 2]]),
							p
								.sendWithPromise('PDFRasterizer.rasterizeAnnot', {
									r: this.id,
									annot: e.id,
									page: t.id,
									device_mtx: n,
									demult: i,
									cancel: r,
								})
								.then(function (e) {
									return D(p.OwnedBitmap, e);
								})
						);
					}),
					(p.PDFRasterizer.prototype.rasterizeSeparations = function (
						e,
						t,
						n,
						i,
						r,
						o
					) {
						return (
							f(
								arguments.length,
								6,
								'rasterizeSeparations',
								'(PDFNet.Page, number, number, PDFNet.Matrix2D, PDFNet.Rect, boolean)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'number'],
									[n, 'number'],
									[i, 'Structure', p.Matrix2D, 'Matrix2D'],
									[r, 'Structure', p.Rect, 'Rect'],
									[o, 'boolean'],
								]
							),
							F('rasterizeSeparations', [
								[i, 3],
								[r, 4],
							]),
							p
								.sendWithPromise('PDFRasterizer.rasterizeSeparations', {
									r: this.id,
									page: e.id,
									width: t,
									height: n,
									mtx: i,
									clip: r,
									cancel: o,
								})
								.then(function (e) {
									for (var t = [], n = 0; n < e.length; ++n) {
										var i = e[n];
										if ('0' === i) return null;
										(i = new p.Separation(i)), t.push(i);
									}
									return t;
								})
						);
					}),
					(p.PDFDraw.create = function (e) {
						return (
							void 0 === e && (e = 92),
							f(arguments.length, 0, 'create', '(number)', [[e, 'number']]),
							p.sendWithPromise('pdfDrawCreate', { dpi: e }).then(function (e) {
								return y(p.PDFDraw, e);
							})
						);
					}),
					(p.PDFDraw.prototype.setRasterizerType = function (e) {
						return (
							f(arguments.length, 1, 'setRasterizerType', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDraw.setRasterizerType', {
								d: this.id,
								type: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setDPI = function (e) {
						return (
							f(arguments.length, 1, 'setDPI', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFDraw.setDPI', { d: this.id, dpi: e })
						);
					}),
					(p.PDFDraw.prototype.setImageSize = function (e, t, n) {
						return (
							void 0 === n && (n = !0),
							f(
								arguments.length,
								2,
								'setImageSize',
								'(number, number, boolean)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'boolean'],
								]
							),
							p.sendWithPromise('PDFDraw.setImageSize', {
								d: this.id,
								width: e,
								height: t,
								preserve_aspect_ratio: n,
							})
						);
					}),
					(p.PDFDraw.prototype.setPageBox = function (e) {
						return (
							f(arguments.length, 1, 'setPageBox', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFDraw.setPageBox', { d: this.id, region: e })
						);
					}),
					(p.PDFDraw.prototype.setClipRect = function (e) {
						return (
							f(arguments.length, 1, 'setClipRect', '(PDFNet.Rect)', [
								[e, 'Structure', p.Rect, 'Rect'],
							]),
							F('setClipRect', [[e, 0]]),
							p.sendWithPromise('PDFDraw.setClipRect', { d: this.id, rect: e })
						);
					}),
					(p.PDFDraw.prototype.setFlipYAxis = function (e) {
						return (
							f(arguments.length, 1, 'setFlipYAxis', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setFlipYAxis', {
								d: this.id,
								flip_y: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setRotate = function (e) {
						return (
							f(arguments.length, 1, 'setRotate', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFDraw.setRotate', { d: this.id, r: e })
						);
					}),
					(p.PDFDraw.prototype.setDrawAnnotations = function (e) {
						return (
							f(arguments.length, 1, 'setDrawAnnotations', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setDrawAnnotations', {
								d: this.id,
								render_annots: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setHighlightFields = function (e) {
						return (
							f(arguments.length, 1, 'setHighlightFields', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setHighlightFields', {
								d: this.id,
								highlight: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setAntiAliasing = function (e) {
						return (
							f(arguments.length, 1, 'setAntiAliasing', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setAntiAliasing', {
								d: this.id,
								enable_aa: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setPathHinting = function (e) {
						return (
							f(arguments.length, 1, 'setPathHinting', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setPathHinting', {
								d: this.id,
								enable_hinting: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setThinLineAdjustment = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'setThinLineAdjustment',
								'(boolean, boolean)',
								[
									[e, 'boolean'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('PDFDraw.setThinLineAdjustment', {
								d: this.id,
								grid_fit: e,
								stroke_adjust: t,
							})
						);
					}),
					(p.PDFDraw.prototype.setGamma = function (e) {
						return (
							f(arguments.length, 1, 'setGamma', '(number)', [[e, 'number']]),
							p.sendWithPromise('PDFDraw.setGamma', { d: this.id, exp: e })
						);
					}),
					(p.PDFDraw.prototype.setPrintMode = function (e) {
						return (
							f(arguments.length, 1, 'setPrintMode', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setPrintMode', {
								d: this.id,
								is_printing: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setPageTransparent = function (e) {
						return (
							f(arguments.length, 1, 'setPageTransparent', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setPageTransparent', {
								d: this.id,
								is_transparent: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setDefaultPageColor = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'setDefaultPageColor',
								'(number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p.sendWithPromise('PDFDraw.setDefaultPageColor', {
								d: this.id,
								r: e,
								g: t,
								b: n,
							})
						);
					}),
					(p.PDFDraw.prototype.setOverprint = function (e) {
						return (
							f(arguments.length, 1, 'setOverprint', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDraw.setOverprint', { d: this.id, op: e })
						);
					}),
					(p.PDFDraw.prototype.setImageSmoothing = function (e, t) {
						return (
							void 0 === e && (e = !0),
							void 0 === t && (t = !1),
							f(
								arguments.length,
								0,
								'setImageSmoothing',
								'(boolean, boolean)',
								[
									[e, 'boolean'],
									[t, 'boolean'],
								]
							),
							p.sendWithPromise('PDFDraw.setImageSmoothing', {
								d: this.id,
								smoothing_enabled: e,
								hq_image_resampling: t,
							})
						);
					}),
					(p.PDFDraw.prototype.setCaching = function (e) {
						return (
							void 0 === e && (e = !0),
							f(arguments.length, 0, 'setCaching', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('PDFDraw.setCaching', {
								d: this.id,
								enabled: e,
							})
						);
					}),
					(p.PDFDraw.prototype.setColorPostProcessMode = function (e) {
						return (
							f(arguments.length, 1, 'setColorPostProcessMode', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('PDFDraw.setColorPostProcessMode', {
								d: this.id,
								mode: e,
							})
						);
					}),
					(p.PDFDraw.prototype.getSeparationBitmaps = function (e) {
						return (
							f(arguments.length, 1, 'getSeparationBitmaps', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p
								.sendWithPromise('PDFDraw.getSeparationBitmaps', {
									d: this.id,
									page: e.id,
								})
								.then(function (e) {
									for (var t = [], n = 0; n < e.length; ++n) {
										var i = e[n];
										if ('0' === i) return null;
										(i = new p.Separation(i)), t.push(i);
									}
									return t;
								})
						);
					}),
					(p.enableJavaScript = function (e) {
						return (
							f(arguments.length, 1, 'enableJavaScript', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('pdfNetEnableJavaScript', { enable: e })
						);
					}),
					(p.isJavaScriptEnabled = function () {
						return p.sendWithPromise('pdfNetIsJavaScriptEnabled', {});
					}),
					(p.terminateEx = function (e) {
						return (
							f(arguments.length, 1, 'terminateEx', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pdfNetTerminateEx', { termination_level: e })
						);
					}),
					(p.setColorManagement = function (e) {
						return (
							void 0 === e && (e = p.CMSType.e_lcms),
							f(arguments.length, 0, 'setColorManagement', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pdfNetSetColorManagement', { t: e })
						);
					}),
					(p.setDefaultDeviceCMYKProfileFromFilter = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setDefaultDeviceCMYKProfileFromFilter',
								'(PDFNet.Filter)',
								[[e, 'Object', p.Filter, 'Filter']]
							),
							p.sendWithPromise('pdfNetSetDefaultDeviceCMYKProfileFromFilter', {
								stream: e.id,
							})
						);
					}),
					(p.setDefaultDeviceRGBProfileFromFilter = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setDefaultDeviceRGBProfileFromFilter',
								'(PDFNet.Filter)',
								[[e, 'Object', p.Filter, 'Filter']]
							),
							p.sendWithPromise('pdfNetSetDefaultDeviceRGBProfileFromFilter', {
								stream: e.id,
							})
						);
					}),
					(p.setDefaultFlateCompressionLevel = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setDefaultFlateCompressionLevel',
								'(number)',
								[[e, 'number']]
							),
							p.sendWithPromise('pdfNetSetDefaultFlateCompressionLevel', {
								level: e,
							})
						);
					}),
					(p.setViewerCache = function (e, t) {
						return (
							f(arguments.length, 2, 'setViewerCache', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('pdfNetSetViewerCache', {
								max_cache_size: e,
								on_disk: t,
							})
						);
					}),
					(p.getVersion = function () {
						return p.sendWithPromise('pdfNetGetVersion', {});
					}),
					(p.setLogLevel = function (e) {
						return (
							void 0 === e && (e = p.LogLevel.e_LogLevel_Fatal),
							f(arguments.length, 0, 'setLogLevel', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pdfNetSetLogLevel', { level: e })
						);
					}),
					(p.getSystemFontList = function () {
						return p.sendWithPromise('pdfNetGetSystemFontList', {});
					}),
					(p.addPDFTronCustomHandler = function (e) {
						return (
							f(arguments.length, 1, 'addPDFTronCustomHandler', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('pdfNetAddPDFTronCustomHandler', {
								custom_id: e,
							})
						);
					}),
					(p.getVersionString = function () {
						return p.sendWithPromise('pdfNetGetVersionString', {});
					}),
					(p.setConnectionErrorHandlingMode = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setConnectionErrorHandlingMode',
								'(number)',
								[[e, 'number']]
							),
							p.sendWithPromise('pdfNetSetConnectionErrorHandlingMode', {
								mode: e,
							})
						);
					}),
					(p.Rect.init = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'init',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('rectInit', { x1: e, y1: t, x2: n, y2: i })
								.then(function (e) {
									return new p.Rect(e);
								})
						);
					}),
					(p.Rect.prototype.attach = function (e) {
						f(arguments.length, 1, 'attach', '(PDFNet.Obj)', [
							[e, 'Object', p.Obj, 'Obj'],
						]),
							P('attach', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Rect.attach'),
							p
								.sendWithPromise('Rect.attach', { rect: this, obj: e.id })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Rect.prototype.update = function (e) {
						void 0 === e && (e = new p.Obj('__null')),
							f(arguments.length, 0, 'update', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							P('update', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Rect.update'),
							p
								.sendWithPromise('Rect.update', { rect: this, obj: e.id })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.rect, t), e.result;
								})
						);
					}),
					(p.Rect.prototype.get = function () {
						return (
							P('get', this.yieldFunction),
							p.sendWithPromise('Rect.get', { rect: this })
						);
					}),
					(p.Rect.prototype.set = function (e, t, n, i) {
						f(arguments.length, 4, 'set', '(number, number, number, number)', [
							[e, 'number'],
							[t, 'number'],
							[n, 'number'],
							[i, 'number'],
						]),
							P('set', this.yieldFunction);
						var r = this;
						return (
							(this.yieldFunction = 'Rect.set'),
							p
								.sendWithPromise('Rect.set', {
									rect: this,
									x1: e,
									y1: t,
									x2: n,
									y2: i,
								})
								.then(function (e) {
									(r.yieldFunction = void 0), O(e, r);
								})
						);
					}),
					(p.Rect.prototype.width = function () {
						return (
							P('width', this.yieldFunction),
							p.sendWithPromise('Rect.width', { rect: this })
						);
					}),
					(p.Rect.prototype.height = function () {
						return (
							P('height', this.yieldFunction),
							p.sendWithPromise('Rect.height', { rect: this })
						);
					}),
					(p.Rect.prototype.contains = function (e, t) {
						return (
							f(arguments.length, 2, 'contains', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							P('contains', this.yieldFunction),
							p.sendWithPromise('Rect.contains', { rect: this, x: e, y: t })
						);
					}),
					(p.Rect.prototype.intersectRect = function (e, t) {
						f(
							arguments.length,
							2,
							'intersectRect',
							'(PDFNet.Rect, PDFNet.Rect)',
							[
								[e, 'Structure', p.Rect, 'Rect'],
								[t, 'Structure', p.Rect, 'Rect'],
							]
						),
							P('intersectRect', this.yieldFunction),
							F('intersectRect', [
								[e, 0],
								[t, 1],
							]);
						var n = this;
						return (
							(this.yieldFunction = 'Rect.intersectRect'),
							p
								.sendWithPromise('Rect.intersectRect', {
									rect: this,
									rect1: e,
									rect2: t,
								})
								.then(function (e) {
									return (n.yieldFunction = void 0), O(e.rect, n), e.result;
								})
						);
					}),
					(p.Rect.prototype.normalize = function () {
						P('normalize', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Rect.normalize'),
							p
								.sendWithPromise('Rect.normalize', { rect: this })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Rect.prototype.inflate1 = function (e) {
						f(arguments.length, 1, 'inflate1', '(number)', [[e, 'number']]),
							P('inflate1', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'Rect.inflate1'),
							p
								.sendWithPromise('Rect.inflate1', { rect: this, amount: e })
								.then(function (e) {
									(t.yieldFunction = void 0), O(e, t);
								})
						);
					}),
					(p.Rect.prototype.inflate2 = function (e, t) {
						f(arguments.length, 2, 'inflate2', '(number, number)', [
							[e, 'number'],
							[t, 'number'],
						]),
							P('inflate2', this.yieldFunction);
						var n = this;
						return (
							(this.yieldFunction = 'Rect.inflate2'),
							p
								.sendWithPromise('Rect.inflate2', { rect: this, x: e, y: t })
								.then(function (e) {
									(n.yieldFunction = void 0), O(e, n);
								})
						);
					}),
					(p.Redactor.redactionCreate = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'redactionCreate',
								'(number, PDFNet.Rect, boolean, string)',
								[
									[e, 'number'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'boolean'],
									[i, 'string'],
								]
							),
							F('redactionCreate', [[t, 1]]),
							p
								.sendWithPromise('Redactor.redactionCreate', {
									page_num: e,
									bbox: t,
									negative: n,
									text: i,
								})
								.then(function (e) {
									return D(p.Redaction, e);
								})
						);
					}),
					(p.Redactor.redactionDestroy = function (e) {
						return (
							f(arguments.length, 1, 'redactionDestroy', '(PDFNet.Redaction)', [
								[e, 'Object', p.Redaction, 'Redaction'],
							]),
							p.sendWithPromise('Redactor.redactionDestroy', {
								redaction: e.id,
							})
						);
					}),
					(p.Redactor.redactionCopy = function (e) {
						return (
							f(arguments.length, 1, 'redactionCopy', '(PDFNet.Redaction)', [
								[e, 'Object', p.Redaction, 'Redaction'],
							]),
							p
								.sendWithPromise('Redactor.redactionCopy', { other: e.id })
								.then(function (e) {
									return D(p.Redaction, e);
								})
						);
					}),
					(p.Shading.create = function (e) {
						return (
							void 0 === e && (e = new p.Obj('0')),
							f(arguments.length, 0, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('shadingCreate', { shading_dict: e.id })
								.then(function (e) {
									return y(p.Shading, e);
								})
						);
					}),
					(p.Shading.getTypeFromObj = function (e) {
						return (
							f(arguments.length, 1, 'getTypeFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('shadingGetTypeFromObj', { shading_dict: e.id })
						);
					}),
					(p.Shading.prototype.getType = function () {
						return p.sendWithPromise('Shading.getType', { s: this.id });
					}),
					(p.Shading.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('Shading.getSDFObj', { s: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Shading.prototype.getBaseColorSpace = function () {
						return p
							.sendWithPromise('Shading.getBaseColorSpace', { s: this.id })
							.then(function (e) {
								return y(p.ColorSpace, e);
							});
					}),
					(p.Shading.prototype.hasBBox = function () {
						return p.sendWithPromise('Shading.hasBBox', { s: this.id });
					}),
					(p.Shading.prototype.getBBox = function () {
						return p
							.sendWithPromise('Shading.getBBox', { s: this.id })
							.then(function (e) {
								return new p.Rect(e);
							});
					}),
					(p.Shading.prototype.hasBackground = function () {
						return p.sendWithPromise('Shading.hasBackground', { s: this.id });
					}),
					(p.Shading.prototype.getBackground = function () {
						return p
							.sendWithPromise('Shading.getBackground', { s: this.id })
							.then(function (e) {
								return y(p.ColorPt, e);
							});
					}),
					(p.Shading.prototype.getAntialias = function () {
						return p.sendWithPromise('Shading.getAntialias', { s: this.id });
					}),
					(p.Shading.prototype.getParamStart = function () {
						return p.sendWithPromise('Shading.getParamStart', { s: this.id });
					}),
					(p.Shading.prototype.getParamEnd = function () {
						return p.sendWithPromise('Shading.getParamEnd', { s: this.id });
					}),
					(p.Shading.prototype.isExtendStart = function () {
						return p.sendWithPromise('Shading.isExtendStart', { s: this.id });
					}),
					(p.Shading.prototype.isExtendEnd = function () {
						return p.sendWithPromise('Shading.isExtendEnd', { s: this.id });
					}),
					(p.Shading.prototype.getColor = function (e) {
						return (
							f(arguments.length, 1, 'getColor', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Shading.getColor', { s: this.id, t: e })
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.Shading.prototype.getCoords = function () {
						return p.sendWithPromise('Shading.getCoords', { s: this.id });
					}),
					(p.Shading.prototype.getCoordsRadial = function () {
						return p.sendWithPromise('Shading.getCoordsRadial', { s: this.id });
					}),
					(p.Shading.prototype.getDomain = function () {
						return p.sendWithPromise('Shading.getDomain', { s: this.id });
					}),
					(p.Shading.prototype.getMatrix = function () {
						return p
							.sendWithPromise('Shading.getMatrix', { s: this.id })
							.then(function (e) {
								return new p.Matrix2D(e);
							});
					}),
					(p.Shading.prototype.getColorForFunction = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'getColorForFunction',
								'(number, number)',
								[
									[e, 'number'],
									[t, 'number'],
								]
							),
							p
								.sendWithPromise('Shading.getColorForFunction', {
									s: this.id,
									t1: e,
									t2: t,
								})
								.then(function (e) {
									return y(p.ColorPt, e);
								})
						);
					}),
					(p.Stamper.create = function (e, t, n) {
						return (
							f(arguments.length, 3, 'create', '(number, number, number)', [
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
							]),
							p
								.sendWithPromise('stamperCreate', { size_type: e, a: t, b: n })
								.then(function (e) {
									return y(p.Stamper, e);
								})
						);
					}),
					(p.Stamper.prototype.stampImage = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'stampImage',
								'(PDFNet.PDFDoc, PDFNet.Image, PDFNet.PageSet)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.Image, 'Image'],
									[n, 'Object', p.PageSet, 'PageSet'],
								]
							),
							p.sendWithPromise('Stamper.stampImage', {
								stamp: this.id,
								dest_doc: e.id,
								img: t.id,
								dest_pages: n.id,
							})
						);
					}),
					(p.Stamper.prototype.stampPage = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'stampPage',
								'(PDFNet.PDFDoc, PDFNet.Page, PDFNet.PageSet)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.Page, 'Page'],
									[n, 'Object', p.PageSet, 'PageSet'],
								]
							),
							p.sendWithPromise('Stamper.stampPage', {
								stamp: this.id,
								dest_doc: e.id,
								page: t.id,
								dest_pages: n.id,
							})
						);
					}),
					(p.Stamper.prototype.stampText = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'stampText',
								'(PDFNet.PDFDoc, string, PDFNet.PageSet)',
								[
									[e, 'PDFDoc'],
									[t, 'string'],
									[n, 'Object', p.PageSet, 'PageSet'],
								]
							),
							p.sendWithPromise('Stamper.stampText', {
								stamp: this.id,
								dest_doc: e.id,
								txt: t,
								dest_pages: n.id,
							})
						);
					}),
					(p.Stamper.prototype.setFont = function (e) {
						return (
							f(arguments.length, 1, 'setFont', '(PDFNet.Font)', [
								[e, 'Object', p.Font, 'Font'],
							]),
							p.sendWithPromise('Stamper.setFont', {
								stamp: this.id,
								font: e.id,
							})
						);
					}),
					(p.Stamper.prototype.setFontColor = function (e) {
						return (
							f(arguments.length, 1, 'setFontColor', '(PDFNet.ColorPt)', [
								[e, 'Object', p.ColorPt, 'ColorPt'],
							]),
							p.sendWithPromise('Stamper.setFontColor', {
								stamp: this.id,
								font_color: e.id,
							})
						);
					}),
					(p.Stamper.prototype.setTextAlignment = function (e) {
						return (
							f(arguments.length, 1, 'setTextAlignment', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Stamper.setTextAlignment', {
								stamp: this.id,
								text_alignment: e,
							})
						);
					}),
					(p.Stamper.prototype.setOpacity = function (e) {
						return (
							f(arguments.length, 1, 'setOpacity', '(number)', [[e, 'number']]),
							p.sendWithPromise('Stamper.setOpacity', {
								stamp: this.id,
								opacity: e,
							})
						);
					}),
					(p.Stamper.prototype.setRotation = function (e) {
						return (
							f(arguments.length, 1, 'setRotation', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('Stamper.setRotation', {
								stamp: this.id,
								rotation: e,
							})
						);
					}),
					(p.Stamper.prototype.setAsBackground = function (e) {
						return (
							f(arguments.length, 1, 'setAsBackground', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Stamper.setAsBackground', {
								stamp: this.id,
								background: e,
							})
						);
					}),
					(p.Stamper.prototype.setAsAnnotation = function (e) {
						return (
							f(arguments.length, 1, 'setAsAnnotation', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Stamper.setAsAnnotation', {
								stamp: this.id,
								annotation: e,
							})
						);
					}),
					(p.Stamper.prototype.showsOnScreen = function (e) {
						return (
							f(arguments.length, 1, 'showsOnScreen', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Stamper.showsOnScreen', {
								stamp: this.id,
								on_screen: e,
							})
						);
					}),
					(p.Stamper.prototype.showsOnPrint = function (e) {
						return (
							f(arguments.length, 1, 'showsOnPrint', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('Stamper.showsOnPrint', {
								stamp: this.id,
								on_print: e,
							})
						);
					}),
					(p.Stamper.prototype.setAlignment = function (e, t) {
						return (
							f(arguments.length, 2, 'setAlignment', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('Stamper.setAlignment', {
								stamp: this.id,
								horizontal_alignment: e,
								vertical_alignment: t,
							})
						);
					}),
					(p.Stamper.prototype.setPosition = function (e, t, n) {
						return (
							void 0 === n && (n = !1),
							f(
								arguments.length,
								2,
								'setPosition',
								'(number, number, boolean)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'boolean'],
								]
							),
							p.sendWithPromise('Stamper.setPosition', {
								stamp: this.id,
								horizontal_distance: e,
								vertical_distance: t,
								use_percentage: n,
							})
						);
					}),
					(p.Stamper.prototype.setSize = function (e, t, n) {
						return (
							f(arguments.length, 3, 'setSize', '(number, number, number)', [
								[e, 'number'],
								[t, 'number'],
								[n, 'number'],
							]),
							p.sendWithPromise('Stamper.setSize', {
								stamp: this.id,
								size_type: e,
								a: t,
								b: n,
							})
						);
					}),
					(p.Stamper.deleteStamps = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'deleteStamps',
								'(PDFNet.PDFDoc, PDFNet.PageSet)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.PageSet, 'PageSet'],
								]
							),
							p.sendWithPromise('stamperDeleteStamps', {
								doc: e.id,
								page_set: t.id,
							})
						);
					}),
					(p.Stamper.hasStamps = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'hasStamps',
								'(PDFNet.PDFDoc, PDFNet.PageSet)',
								[
									[e, 'PDFDoc'],
									[t, 'Object', p.PageSet, 'PageSet'],
								]
							),
							p.sendWithPromise('stamperHasStamps', {
								doc: e.id,
								page_set: t.id,
							})
						);
					}),
					(p.TextExtractor.create = function () {
						return p
							.sendWithPromise('textExtractorCreate', {})
							.then(function (e) {
								return y(p.TextExtractor, e);
							});
					}),
					(p.TextExtractor.prototype.setOCGContext = function (e) {
						return (
							f(arguments.length, 1, 'setOCGContext', '(PDFNet.OCGContext)', [
								[e, 'Object', p.OCGContext, 'OCGContext'],
							]),
							p.sendWithPromise('TextExtractor.setOCGContext', {
								te: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.TextExtractor.prototype.begin = function (e, t, n) {
						return (
							void 0 === t && (t = null),
							void 0 === n && (n = 0),
							f(
								arguments.length,
								1,
								'begin',
								'(PDFNet.Page, PDFNet.Rect, number)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'Structure', p.Rect, 'Rect'],
									[n, 'number'],
								]
							),
							F('begin', [[t, 1]]),
							p.sendWithPromise('TextExtractor.begin', {
								te: this.id,
								page: e.id,
								clip_ptr: t,
								flags: n,
							})
						);
					}),
					(p.TextExtractor.prototype.getWordCount = function () {
						return p.sendWithPromise('TextExtractor.getWordCount', {
							te: this.id,
						});
					}),
					(p.TextExtractor.prototype.setRightToLeftLanguage = function (e) {
						return (
							f(arguments.length, 1, 'setRightToLeftLanguage', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('TextExtractor.setRightToLeftLanguage', {
								te: this.id,
								rtl: e,
							})
						);
					}),
					(p.TextExtractor.prototype.getRightToLeftLanguage = function () {
						return p.sendWithPromise('TextExtractor.getRightToLeftLanguage', {
							te: this.id,
						});
					}),
					(p.TextExtractor.prototype.getAsText = function (e) {
						return (
							void 0 === e && (e = !0),
							f(arguments.length, 0, 'getAsText', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('TextExtractor.getAsText', {
								te: this.id,
								dehyphen: e,
							})
						);
					}),
					(p.TextExtractor.prototype.getTextUnderAnnot = function (e) {
						return (
							f(arguments.length, 1, 'getTextUnderAnnot', '(PDFNet.Annot)', [
								[e, 'Object', p.Annot, 'Annot'],
							]),
							p.sendWithPromise('TextExtractor.getTextUnderAnnot', {
								te: this.id,
								annot: e.id,
							})
						);
					}),
					(p.TextExtractor.prototype.getAsXML = function (e) {
						return (
							void 0 === e && (e = 0),
							f(arguments.length, 0, 'getAsXML', '(number)', [[e, 'number']]),
							p.sendWithPromise('TextExtractor.getAsXML', {
								te: this.id,
								xml_output_flags: e,
							})
						);
					}),
					(p.TextExtractorStyle.prototype.getFont = function () {
						P('getFont', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.getFont'),
							p
								.sendWithPromise('TextExtractorStyle.getFont', { tes: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = D(p.Obj, e.result)),
										O(e.tes, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorStyle.prototype.getFontName = function () {
						P('getFontName', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.getFontName'),
							p
								.sendWithPromise('TextExtractorStyle.getFontName', {
									tes: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tes, t), e.result;
								})
						);
					}),
					(p.TextExtractorStyle.prototype.getFontSize = function () {
						P('getFontSize', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.getFontSize'),
							p
								.sendWithPromise('TextExtractorStyle.getFontSize', {
									tes: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tes, t), e.result;
								})
						);
					}),
					(p.TextExtractorStyle.prototype.getWeight = function () {
						P('getWeight', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.getWeight'),
							p
								.sendWithPromise('TextExtractorStyle.getWeight', { tes: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tes, t), e.result;
								})
						);
					}),
					(p.TextExtractorStyle.prototype.isItalic = function () {
						P('isItalic', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.isItalic'),
							p
								.sendWithPromise('TextExtractorStyle.isItalic', { tes: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tes, t), e.result;
								})
						);
					}),
					(p.TextExtractorStyle.prototype.isSerif = function () {
						P('isSerif', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.isSerif'),
							p
								.sendWithPromise('TextExtractorStyle.isSerif', { tes: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tes, t), e.result;
								})
						);
					}),
					(p.TextExtractorStyle.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.TextExtractorStyle)', [
								[e, 'Structure', p.TextExtractorStyle, 'TextExtractorStyle'],
							]),
							P('compare', this.yieldFunction),
							F('compare', [[e, 0]]),
							p.sendWithPromise('TextExtractorStyle.compare', {
								tes: this,
								s: e,
							})
						);
					}),
					(p.TextExtractorStyle.create = function () {
						return p
							.sendWithPromise('textExtractorStyleCreate', {})
							.then(function (e) {
								return new p.TextExtractorStyle(e);
							});
					}),
					(p.TextExtractorStyle.prototype.copy = function () {
						P('copy', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorStyle.copy'),
							p
								.sendWithPromise('TextExtractorStyle.copy', { s: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorStyle(e.result)),
										O(e.s, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorWord.prototype.getNumGlyphs = function () {
						P('getNumGlyphs', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getNumGlyphs'),
							p
								.sendWithPromise('TextExtractorWord.getNumGlyphs', {
									tew: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tew, t), e.result;
								})
						);
					}),
					(p.TextExtractorWord.prototype.getCharStyle = function (e) {
						f(arguments.length, 1, 'getCharStyle', '(number)', [[e, 'number']]),
							P('getCharStyle', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getCharStyle'),
							p
								.sendWithPromise('TextExtractorWord.getCharStyle', {
									tew: this,
									char_idx: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorStyle(e.result)),
										O(e.tew, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorWord.prototype.getStyle = function () {
						P('getStyle', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getStyle'),
							p
								.sendWithPromise('TextExtractorWord.getStyle', { tew: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorStyle(e.result)),
										O(e.tew, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorWord.prototype.getStringLen = function () {
						P('getStringLen', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getStringLen'),
							p
								.sendWithPromise('TextExtractorWord.getStringLen', {
									tew: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tew, t), e.result;
								})
						);
					}),
					(p.TextExtractorWord.prototype.getNextWord = function () {
						P('getNextWord', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getNextWord'),
							p
								.sendWithPromise('TextExtractorWord.getNextWord', { tew: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorWord(e.result)),
										O(e.tew, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorWord.prototype.getCurrentNum = function () {
						P('getCurrentNum', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.getCurrentNum'),
							p
								.sendWithPromise('TextExtractorWord.getCurrentNum', {
									tew: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tew, t), e.result;
								})
						);
					}),
					(p.TextExtractorWord.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.TextExtractorWord)', [
								[e, 'Structure', p.TextExtractorWord, 'TextExtractorWord'],
							]),
							P('compare', this.yieldFunction),
							F('compare', [[e, 0]]),
							p.sendWithPromise('TextExtractorWord.compare', {
								tew: this,
								word: e,
							})
						);
					}),
					(p.TextExtractorWord.create = function () {
						return p
							.sendWithPromise('textExtractorWordCreate', {})
							.then(function (e) {
								return new p.TextExtractorWord(e);
							});
					}),
					(p.TextExtractorWord.prototype.isValid = function () {
						P('isValid', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorWord.isValid'),
							p
								.sendWithPromise('TextExtractorWord.isValid', { tew: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.tew, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.getNumWords = function () {
						P('getNumWords', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getNumWords'),
							p
								.sendWithPromise('TextExtractorLine.getNumWords', {
									line: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.isSimpleLine = function () {
						P('isSimpleLine', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.isSimpleLine'),
							p
								.sendWithPromise('TextExtractorLine.isSimpleLine', {
									line: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.getFirstWord = function () {
						P('getFirstWord', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getFirstWord'),
							p
								.sendWithPromise('TextExtractorLine.getFirstWord', {
									line: this,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorWord(e.result)),
										O(e.line, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorLine.prototype.getWord = function (e) {
						f(arguments.length, 1, 'getWord', '(number)', [[e, 'number']]),
							P('getWord', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getWord'),
							p
								.sendWithPromise('TextExtractorLine.getWord', {
									line: this,
									word_idx: e,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorWord(e.result)),
										O(e.line, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorLine.prototype.getNextLine = function () {
						P('getNextLine', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getNextLine'),
							p
								.sendWithPromise('TextExtractorLine.getNextLine', {
									line: this,
								})
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorLine(e.result)),
										O(e.line, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorLine.prototype.getCurrentNum = function () {
						P('getCurrentNum', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getCurrentNum'),
							p
								.sendWithPromise('TextExtractorLine.getCurrentNum', {
									line: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.getStyle = function () {
						P('getStyle', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getStyle'),
							p
								.sendWithPromise('TextExtractorLine.getStyle', { line: this })
								.then(function (e) {
									return (
										(t.yieldFunction = void 0),
										(e.result = new p.TextExtractorStyle(e.result)),
										O(e.line, t),
										e.result
									);
								})
						);
					}),
					(p.TextExtractorLine.prototype.getParagraphID = function () {
						P('getParagraphID', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getParagraphID'),
							p
								.sendWithPromise('TextExtractorLine.getParagraphID', {
									line: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.getFlowID = function () {
						P('getFlowID', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.getFlowID'),
							p
								.sendWithPromise('TextExtractorLine.getFlowID', { line: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.endsWithHyphen = function () {
						P('endsWithHyphen', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.endsWithHyphen'),
							p
								.sendWithPromise('TextExtractorLine.endsWithHyphen', {
									line: this,
								})
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractorLine.prototype.compare = function (e) {
						return (
							f(arguments.length, 1, 'compare', '(PDFNet.TextExtractorLine)', [
								[e, 'Structure', p.TextExtractorLine, 'TextExtractorLine'],
							]),
							P('compare', this.yieldFunction),
							F('compare', [[e, 0]]),
							p.sendWithPromise('TextExtractorLine.compare', {
								line: this,
								line2: e,
							})
						);
					}),
					(p.TextExtractorLine.create = function () {
						return p
							.sendWithPromise('textExtractorLineCreate', {})
							.then(function (e) {
								return new p.TextExtractorLine(e);
							});
					}),
					(p.TextExtractorLine.prototype.isValid = function () {
						P('isValid', this.yieldFunction);
						var t = this;
						return (
							(this.yieldFunction = 'TextExtractorLine.isValid'),
							p
								.sendWithPromise('TextExtractorLine.isValid', { line: this })
								.then(function (e) {
									return (t.yieldFunction = void 0), O(e.line, t), e.result;
								})
						);
					}),
					(p.TextExtractor.prototype.getNumLines = function () {
						return p.sendWithPromise('TextExtractor.getNumLines', {
							te: this.id,
						});
					}),
					(p.TextExtractor.prototype.getFirstLine = function () {
						return p
							.sendWithPromise('TextExtractor.getFirstLine', { te: this.id })
							.then(function (e) {
								return new p.TextExtractorLine(e);
							});
					}),
					(p.TextExtractor.prototype.getQuads = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'getQuads',
								'(PDFNet.Matrix2D, number, number)',
								[
									[e, 'Structure', p.Matrix2D, 'Matrix2D'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							F('getQuads', [[e, 0]]),
							p.sendWithPromise('TextExtractor.getQuads', {
								te: this.id,
								mtx: e,
								quads: t,
								quads_size: n,
							})
						);
					}),
					(p.TextSearch.create = function () {
						return p.sendWithPromise('textSearchCreate', {}).then(function (e) {
							return y(p.TextSearch, e);
						});
					}),
					(p.TextSearch.prototype.begin = function (e, t, n, i, r) {
						return (
							void 0 === i && (i = -1),
							void 0 === r && (r = -1),
							f(
								arguments.length,
								3,
								'begin',
								'(PDFNet.PDFDoc, string, number, number, number)',
								[
									[e, 'PDFDoc'],
									[t, 'string'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p.sendWithPromise('TextSearch.begin', {
								ts: this.id,
								doc: e.id,
								pattern: t,
								mode: n,
								start_page: i,
								end_page: r,
							})
						);
					}),
					(p.TextSearch.prototype.setPattern = function (e) {
						return (
							f(arguments.length, 1, 'setPattern', '(string)', [[e, 'string']]),
							p.sendWithPromise('TextSearch.setPattern', {
								ts: this.id,
								pattern: e,
							})
						);
					}),
					(p.TextSearch.prototype.getMode = function () {
						return p.sendWithPromise('TextSearch.getMode', { ts: this.id });
					}),
					(p.TextSearch.prototype.setMode = function (e) {
						return (
							f(arguments.length, 1, 'setMode', '(number)', [[e, 'number']]),
							p.sendWithPromise('TextSearch.setMode', { ts: this.id, mode: e })
						);
					}),
					(p.TextSearch.prototype.setRightToLeftLanguage = function (e) {
						return (
							f(arguments.length, 1, 'setRightToLeftLanguage', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('TextSearch.setRightToLeftLanguage', {
								ts: this.id,
								flag: e,
							})
						);
					}),
					(p.TextSearch.prototype.getCurrentPage = function () {
						return p.sendWithPromise('TextSearch.getCurrentPage', {
							ts: this.id,
						});
					}),
					(p.TextSearch.prototype.setOCGContext = function (e) {
						return (
							f(arguments.length, 1, 'setOCGContext', '(PDFNet.OCGContext)', [
								[e, 'Object', p.OCGContext, 'OCGContext'],
							]),
							p.sendWithPromise('TextSearch.setOCGContext', {
								te: this.id,
								ctx: e.id,
							})
						);
					}),
					(p.NameTree.create = function (e, t) {
						return (
							f(arguments.length, 2, 'create', '(PDFNet.SDFDoc, string)', [
								[e, 'SDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('nameTreeCreate', { doc: e.id, name: t })
								.then(function (e) {
									return D(p.NameTree, e);
								})
						);
					}),
					(p.NameTree.find = function (e, t) {
						return (
							f(arguments.length, 2, 'find', '(PDFNet.SDFDoc, string)', [
								[e, 'SDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('nameTreeFind', { doc: e.id, name: t })
								.then(function (e) {
									return D(p.NameTree, e);
								})
						);
					}),
					(p.NameTree.createFromObj = function (e) {
						return (
							f(arguments.length, 1, 'createFromObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('nameTreeCreateFromObj', { name_tree: e.id })
								.then(function (e) {
									return D(p.NameTree, e);
								})
						);
					}),
					(p.NameTree.prototype.copy = function () {
						return p
							.sendWithPromise('NameTree.copy', { d: this.id })
							.then(function (e) {
								return D(p.NameTree, e);
							});
					}),
					(p.NameTree.prototype.isValid = function () {
						return p.sendWithPromise('NameTree.isValid', { tree: this.id });
					}),
					(p.NameTree.prototype.getIterator = function (e) {
						return (
							f(arguments.length, 1, 'getIterator', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('NameTree.getIterator', {
									tree: this.id,
									key: e,
								})
								.then(function (e) {
									return y(p.DictIterator, e);
								})
						);
					}),
					(p.NameTree.prototype.getValue = function (e) {
						return (
							f(arguments.length, 1, 'getValue', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('NameTree.getValue', { tree: this.id, key: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.NameTree.prototype.getIteratorBegin = function () {
						return p
							.sendWithPromise('NameTree.getIteratorBegin', { tree: this.id })
							.then(function (e) {
								return y(p.DictIterator, e);
							});
					}),
					(p.NameTree.prototype.put = function (e, t) {
						return (
							f(arguments.length, 2, 'put', '(string, PDFNet.Obj)', [
								[e, 'string'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('NameTree.put', {
								tree: this.id,
								key: e,
								value: t.id,
							})
						);
					}),
					(p.NameTree.prototype.eraseKey = function (e) {
						return (
							f(arguments.length, 1, 'eraseKey', '(string)', [[e, 'string']]),
							p.sendWithPromise('NameTree.eraseKey', { tree: this.id, key: e })
						);
					}),
					(p.NameTree.prototype.erase = function (e) {
						return (
							f(arguments.length, 1, 'erase', '(PDFNet.DictIterator)', [
								[e, 'Object', p.DictIterator, 'DictIterator'],
							]),
							p.sendWithPromise('NameTree.erase', { tree: this.id, pos: e.id })
						);
					}),
					(p.NameTree.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('NameTree.getSDFObj', { tree: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.NumberTree.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('numberTreeCreate', { number_tree: e.id })
								.then(function (e) {
									return D(p.NumberTree, e);
								})
						);
					}),
					(p.NumberTree.prototype.copy = function () {
						return p
							.sendWithPromise('NumberTree.copy', { tree: this.id })
							.then(function (e) {
								return D(p.NumberTree, e);
							});
					}),
					(p.NumberTree.prototype.isValid = function () {
						return p.sendWithPromise('NumberTree.isValid', { tree: this.id });
					}),
					(p.NumberTree.prototype.getIterator = function (e) {
						return (
							f(arguments.length, 1, 'getIterator', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('NumberTree.getIterator', {
									tree: this.id,
									key: e,
								})
								.then(function (e) {
									return y(p.DictIterator, e);
								})
						);
					}),
					(p.NumberTree.prototype.getValue = function (e) {
						return (
							f(arguments.length, 1, 'getValue', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('NumberTree.getValue', {
									tree: this.id,
									key: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.NumberTree.prototype.getIteratorBegin = function () {
						return p
							.sendWithPromise('NumberTree.getIteratorBegin', { tree: this.id })
							.then(function (e) {
								return y(p.DictIterator, e);
							});
					}),
					(p.NumberTree.prototype.put = function (e, t) {
						return (
							f(arguments.length, 2, 'put', '(number, PDFNet.Obj)', [
								[e, 'number'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('NumberTree.put', {
								tree: this.id,
								key: e,
								value: t.id,
							})
						);
					}),
					(p.NumberTree.prototype.eraseKey = function (e) {
						return (
							f(arguments.length, 1, 'eraseKey', '(number)', [[e, 'number']]),
							p.sendWithPromise('NumberTree.eraseKey', {
								tree: this.id,
								key: e,
							})
						);
					}),
					(p.NumberTree.prototype.erase = function (e) {
						return (
							f(arguments.length, 1, 'erase', '(PDFNet.DictIterator)', [
								[e, 'Object', p.DictIterator, 'DictIterator'],
							]),
							p.sendWithPromise('NumberTree.erase', {
								tree: this.id,
								pos: e.id,
							})
						);
					}),
					(p.NumberTree.prototype.getSDFObj = function () {
						return p
							.sendWithPromise('NumberTree.getSDFObj', { tree: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Obj.prototype.getType = function () {
						return p.sendWithPromise('Obj.getType', { o: this.id });
					}),
					(p.Obj.prototype.getDoc = function () {
						return p
							.sendWithPromise('Obj.getDoc', { o: this.id })
							.then(function (e) {
								return D(p.SDFDoc, e);
							});
					}),
					(p.Obj.prototype.write = function (e) {
						return (
							f(arguments.length, 1, 'write', '(PDFNet.FilterWriter)', [
								[e, 'Object', p.FilterWriter, 'FilterWriter'],
							]),
							p.sendWithPromise('Obj.write', { o: this.id, stream: e.id })
						);
					}),
					(p.Obj.prototype.isEqual = function (e) {
						return (
							f(arguments.length, 1, 'isEqual', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('Obj.isEqual', { o: this.id, to: e.id })
						);
					}),
					(p.Obj.prototype.isBool = function () {
						return p.sendWithPromise('Obj.isBool', { o: this.id });
					}),
					(p.Obj.prototype.getBool = function () {
						return p.sendWithPromise('Obj.getBool', { o: this.id });
					}),
					(p.Obj.prototype.setBool = function (e) {
						return (
							f(arguments.length, 1, 'setBool', '(boolean)', [[e, 'boolean']]),
							p.sendWithPromise('Obj.setBool', { o: this.id, b: e })
						);
					}),
					(p.Obj.prototype.isNumber = function () {
						return p.sendWithPromise('Obj.isNumber', { o: this.id });
					}),
					(p.Obj.prototype.getNumber = function () {
						return p.sendWithPromise('Obj.getNumber', { o: this.id });
					}),
					(p.Obj.prototype.setNumber = function (e) {
						return (
							f(arguments.length, 1, 'setNumber', '(number)', [[e, 'number']]),
							p.sendWithPromise('Obj.setNumber', { o: this.id, n: e })
						);
					}),
					(p.Obj.prototype.isNull = function () {
						return p.sendWithPromise('Obj.isNull', { o: this.id });
					}),
					(p.Obj.prototype.isString = function () {
						return p.sendWithPromise('Obj.isString', { o: this.id });
					}),
					(p.Obj.prototype.getBuffer = function () {
						return p.sendWithPromise('Obj.getBuffer', { o: this.id });
					}),
					(p.Obj.prototype.setString = function (e) {
						return (
							f(arguments.length, 1, 'setString', '(string)', [[e, 'string']]),
							p.sendWithPromise('Obj.setString', { o: this.id, value: e })
						);
					}),
					(p.Obj.prototype.setUString = function (e) {
						return (
							f(arguments.length, 1, 'setUString', '(string)', [[e, 'string']]),
							p.sendWithPromise('Obj.setUString', { o: this.id, value: e })
						);
					}),
					(p.Obj.prototype.isName = function () {
						return p.sendWithPromise('Obj.isName', { o: this.id });
					}),
					(p.Obj.prototype.getName = function () {
						return p.sendWithPromise('Obj.getName', { o: this.id });
					}),
					(p.Obj.prototype.setName = function (e) {
						return (
							f(arguments.length, 1, 'setName', '(string)', [[e, 'string']]),
							p.sendWithPromise('Obj.setName', { o: this.id, name: e })
						);
					}),
					(p.Obj.prototype.isIndirect = function () {
						return p.sendWithPromise('Obj.isIndirect', { o: this.id });
					}),
					(p.Obj.prototype.getObjNum = function () {
						return p.sendWithPromise('Obj.getObjNum', { o: this.id });
					}),
					(p.Obj.prototype.getGenNum = function () {
						return p.sendWithPromise('Obj.getGenNum', { o: this.id });
					}),
					(p.Obj.prototype.getOffset = function () {
						return p.sendWithPromise('Obj.getOffset', { o: this.id });
					}),
					(p.Obj.prototype.isFree = function () {
						return p.sendWithPromise('Obj.isFree', { o: this.id });
					}),
					(p.Obj.prototype.setMark = function (e) {
						return (
							f(arguments.length, 1, 'setMark', '(boolean)', [[e, 'boolean']]),
							p.sendWithPromise('Obj.setMark', { o: this.id, mark: e })
						);
					}),
					(p.Obj.prototype.isMarked = function () {
						return p.sendWithPromise('Obj.isMarked', { o: this.id });
					}),
					(p.Obj.prototype.isLoaded = function () {
						return p.sendWithPromise('Obj.isLoaded', { o: this.id });
					}),
					(p.Obj.prototype.isContainer = function () {
						return p.sendWithPromise('Obj.isContainer', { o: this.id });
					}),
					(p.Obj.prototype.size = function () {
						return p.sendWithPromise('Obj.size', { o: this.id });
					}),
					(p.Obj.prototype.getDictIterator = function () {
						return p
							.sendWithPromise('Obj.getDictIterator', { o: this.id })
							.then(function (e) {
								return y(p.DictIterator, e);
							});
					}),
					(p.Obj.prototype.isDict = function () {
						return p.sendWithPromise('Obj.isDict', { o: this.id });
					}),
					(p.Obj.prototype.find = function (e) {
						return (
							f(arguments.length, 1, 'find', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Obj.find', { o: this.id, key: e })
								.then(function (e) {
									return y(p.DictIterator, e);
								})
						);
					}),
					(p.Obj.prototype.findObj = function (e) {
						return (
							f(arguments.length, 1, 'findObj', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Obj.findObj', { o: this.id, key: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.get = function (e) {
						return (
							f(arguments.length, 1, 'get', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Obj.get', { o: this.id, key: e })
								.then(function (e) {
									return y(p.DictIterator, e);
								})
						);
					}),
					(p.Obj.prototype.putName = function (e, t) {
						return (
							f(arguments.length, 2, 'putName', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.putName', { o: this.id, key: e, name: t })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putArray = function (e) {
						return (
							f(arguments.length, 1, 'putArray', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Obj.putArray', { o: this.id, key: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putBool = function (e, t) {
						return (
							f(arguments.length, 2, 'putBool', '(string, boolean)', [
								[e, 'string'],
								[t, 'boolean'],
							]),
							p
								.sendWithPromise('Obj.putBool', {
									o: this.id,
									key: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putDict = function (e) {
						return (
							f(arguments.length, 1, 'putDict', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('Obj.putDict', { o: this.id, key: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putNumber = function (e, t) {
						return (
							f(arguments.length, 2, 'putNumber', '(string, number)', [
								[e, 'string'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('Obj.putNumber', {
									o: this.id,
									key: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putString = function (e, t) {
						return (
							f(arguments.length, 2, 'putString', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.putString', {
									o: this.id,
									key: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putText = function (e, t) {
						return (
							f(arguments.length, 2, 'putText', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.putText', { o: this.id, key: e, t: t })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putNull = function (e) {
						return (
							f(arguments.length, 1, 'putNull', '(string)', [[e, 'string']]),
							p.sendWithPromise('Obj.putNull', { o: this.id, key: e })
						);
					}),
					(p.Obj.prototype.put = function (e, t) {
						return (
							f(arguments.length, 2, 'put', '(string, PDFNet.Obj)', [
								[e, 'string'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('Obj.put', {
									o: this.id,
									key: e,
									input_obj: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putRect = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'putRect',
								'(string, number, number, number, number)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p
								.sendWithPromise('Obj.putRect', {
									o: this.id,
									key: e,
									x1: t,
									y1: n,
									x2: i,
									y2: r,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.putMatrix = function (e, t) {
						return (
							f(arguments.length, 2, 'putMatrix', '(string, PDFNet.Matrix2D)', [
								[e, 'string'],
								[t, 'Structure', p.Matrix2D, 'Matrix2D'],
							]),
							F('putMatrix', [[t, 1]]),
							p
								.sendWithPromise('Obj.putMatrix', {
									o: this.id,
									key: e,
									mtx: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.eraseFromKey = function (e) {
						return (
							f(arguments.length, 1, 'eraseFromKey', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('Obj.eraseFromKey', { o: this.id, key: e })
						);
					}),
					(p.Obj.prototype.erase = function (e) {
						return (
							f(arguments.length, 1, 'erase', '(PDFNet.DictIterator)', [
								[e, 'Object', p.DictIterator, 'DictIterator'],
							]),
							p.sendWithPromise('Obj.erase', { o: this.id, pos: e.id })
						);
					}),
					(p.Obj.prototype.rename = function (e, t) {
						return (
							f(arguments.length, 2, 'rename', '(string, string)', [
								[e, 'string'],
								[t, 'string'],
							]),
							p.sendWithPromise('Obj.rename', {
								o: this.id,
								old_key: e,
								new_key: t,
							})
						);
					}),
					(p.Obj.prototype.isArray = function () {
						return p.sendWithPromise('Obj.isArray', { o: this.id });
					}),
					(p.Obj.prototype.getAt = function (e) {
						return (
							f(arguments.length, 1, 'getAt', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Obj.getAt', { o: this.id, index: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertName = function (e, t) {
						return (
							f(arguments.length, 2, 'insertName', '(number, string)', [
								[e, 'number'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.insertName', {
									o: this.id,
									pos: e,
									name: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertArray = function (e) {
						return (
							f(arguments.length, 1, 'insertArray', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('Obj.insertArray', { o: this.id, pos: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertBool = function (e, t) {
						return (
							f(arguments.length, 2, 'insertBool', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p
								.sendWithPromise('Obj.insertBool', {
									o: this.id,
									pos: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertDict = function (e) {
						return (
							f(arguments.length, 1, 'insertDict', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Obj.insertDict', { o: this.id, pos: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertNumber = function (e, t) {
						return (
							f(arguments.length, 2, 'insertNumber', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p
								.sendWithPromise('Obj.insertNumber', {
									o: this.id,
									pos: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertString = function (e, t) {
						return (
							f(arguments.length, 2, 'insertString', '(number, string)', [
								[e, 'number'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.insertString', {
									o: this.id,
									pos: e,
									value: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertText = function (e, t) {
						return (
							f(arguments.length, 2, 'insertText', '(number, string)', [
								[e, 'number'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('Obj.insertText', { o: this.id, pos: e, t: t })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertNull = function (e) {
						return (
							f(arguments.length, 1, 'insertNull', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('Obj.insertNull', { o: this.id, pos: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insert = function (e, t) {
						return (
							f(arguments.length, 2, 'insert', '(number, PDFNet.Obj)', [
								[e, 'number'],
								[t, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('Obj.insert', {
									o: this.id,
									pos: e,
									input_obj: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertRect = function (e, t, n, i, r) {
						return (
							f(
								arguments.length,
								5,
								'insertRect',
								'(number, number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
								]
							),
							p
								.sendWithPromise('Obj.insertRect', {
									o: this.id,
									pos: e,
									x1: t,
									y1: n,
									x2: i,
									y2: r,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.insertMatrix = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'insertMatrix',
								'(number, PDFNet.Matrix2D)',
								[
									[e, 'number'],
									[t, 'Structure', p.Matrix2D, 'Matrix2D'],
								]
							),
							F('insertMatrix', [[t, 1]]),
							p
								.sendWithPromise('Obj.insertMatrix', {
									o: this.id,
									pos: e,
									mtx: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackName = function (e) {
						return (
							f(arguments.length, 1, 'pushBackName', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Obj.pushBackName', { o: this.id, name: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackArray = function () {
						return p
							.sendWithPromise('Obj.pushBackArray', { o: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Obj.prototype.pushBackBool = function (e) {
						return (
							f(arguments.length, 1, 'pushBackBool', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('Obj.pushBackBool', { o: this.id, value: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackDict = function () {
						return p
							.sendWithPromise('Obj.pushBackDict', { o: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Obj.prototype.pushBackNumber = function (e) {
						return (
							f(arguments.length, 1, 'pushBackNumber', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('Obj.pushBackNumber', { o: this.id, value: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackString = function (e) {
						return (
							f(arguments.length, 1, 'pushBackString', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Obj.pushBackString', { o: this.id, value: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackText = function (e) {
						return (
							f(arguments.length, 1, 'pushBackText', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('Obj.pushBackText', { o: this.id, t: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackNull = function () {
						return p
							.sendWithPromise('Obj.pushBackNull', { o: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.Obj.prototype.pushBack = function (e) {
						return (
							f(arguments.length, 1, 'pushBack', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p
								.sendWithPromise('Obj.pushBack', {
									o: this.id,
									input_obj: e.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackRect = function (e, t, n, i) {
						return (
							f(
								arguments.length,
								4,
								'pushBackRect',
								'(number, number, number, number)',
								[
									[e, 'number'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
								]
							),
							p
								.sendWithPromise('Obj.pushBackRect', {
									o: this.id,
									x1: e,
									y1: t,
									x2: n,
									y2: i,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.pushBackMatrix = function (e) {
						return (
							f(arguments.length, 1, 'pushBackMatrix', '(PDFNet.Matrix2D)', [
								[e, 'Structure', p.Matrix2D, 'Matrix2D'],
							]),
							F('pushBackMatrix', [[e, 0]]),
							p
								.sendWithPromise('Obj.pushBackMatrix', { o: this.id, mtx: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.Obj.prototype.eraseAt = function (e) {
						return (
							f(arguments.length, 1, 'eraseAt', '(number)', [[e, 'number']]),
							p.sendWithPromise('Obj.eraseAt', { o: this.id, pos: e })
						);
					}),
					(p.Obj.prototype.isStream = function () {
						return p.sendWithPromise('Obj.isStream', { o: this.id });
					}),
					(p.Obj.prototype.getRawStreamLength = function () {
						return p.sendWithPromise('Obj.getRawStreamLength', { o: this.id });
					}),
					(p.Obj.prototype.setStreamData = function (e) {
						f(
							arguments.length,
							1,
							'setStreamData',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise('Obj.setStreamData', {
							obj: this.id,
							data_buf: t,
						});
					}),
					(p.Obj.prototype.setStreamDataWithFilter = function (e, t) {
						f(
							arguments.length,
							2,
							'setStreamDataWithFilter',
							'(ArrayBuffer|TypedArray, PDFNet.Filter)',
							[
								[e, 'ArrayBuffer'],
								[t, 'Object', p.Filter, 'Filter'],
							]
						);
						var n = b(e, !1);
						return (
							0 != t.id && S(t.id),
							p.sendWithPromise('Obj.setStreamDataWithFilter', {
								obj: this.id,
								data_buf: n,
								no_own_filter_chain: t.id,
							})
						);
					}),
					(p.Obj.prototype.getRawStream = function (e) {
						return (
							f(arguments.length, 1, 'getRawStream', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('Obj.getRawStream', { o: this.id, decrypt: e })
								.then(function (e) {
									return D(p.Filter, e);
								})
						);
					}),
					(p.Obj.prototype.getDecodedStream = function () {
						return p
							.sendWithPromise('Obj.getDecodedStream', { o: this.id })
							.then(function (e) {
								return D(p.Filter, e);
							});
					}),
					(p.ObjSet.create = function () {
						return p.sendWithPromise('objSetCreate', {}).then(function (e) {
							return y(p.ObjSet, e);
						});
					}),
					(p.ObjSet.prototype.createName = function (e) {
						return (
							f(arguments.length, 1, 'createName', '(string)', [[e, 'string']]),
							p
								.sendWithPromise('ObjSet.createName', { set: this.id, name: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ObjSet.prototype.createArray = function () {
						return p
							.sendWithPromise('ObjSet.createArray', { set: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ObjSet.prototype.createBool = function (e) {
						return (
							f(arguments.length, 1, 'createBool', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('ObjSet.createBool', {
									set: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ObjSet.prototype.createDict = function () {
						return p
							.sendWithPromise('ObjSet.createDict', { set: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ObjSet.prototype.createNull = function () {
						return p
							.sendWithPromise('ObjSet.createNull', { set: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.ObjSet.prototype.createNumber = function (e) {
						return (
							f(arguments.length, 1, 'createNumber', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('ObjSet.createNumber', {
									set: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ObjSet.prototype.createString = function (e) {
						return (
							f(arguments.length, 1, 'createString', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ObjSet.createString', {
									set: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.ObjSet.prototype.createFromJson = function (e) {
						return (
							f(arguments.length, 1, 'createFromJson', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ObjSet.createFromJson', {
									set: this.id,
									json: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createShallowCopy = function () {
						return p
							.sendWithPromise('SDFDoc.createShallowCopy', { source: this.id })
							.then(function (e) {
								return D(p.SDFDoc, e);
							});
					}),
					(p.SDFDoc.prototype.releaseFileHandles = function () {
						return p.sendWithPromise('SDFDoc.releaseFileHandles', {
							doc: this.id,
						});
					}),
					(p.SDFDoc.prototype.isEncrypted = function () {
						return p.sendWithPromise('SDFDoc.isEncrypted', { doc: this.id });
					}),
					(p.SDFDoc.prototype.initStdSecurityHandlerUString = function (e) {
						return (
							f(
								arguments.length,
								1,
								'initStdSecurityHandlerUString',
								'(string)',
								[[e, 'string']]
							),
							p.sendWithPromise('SDFDoc.initStdSecurityHandlerUString', {
								doc: this.id,
								password: e,
							})
						);
					}),
					(p.SDFDoc.prototype.isModified = function () {
						return p.sendWithPromise('SDFDoc.isModified', { doc: this.id });
					}),
					(p.SDFDoc.prototype.hasRepairedXRef = function () {
						return p.sendWithPromise('SDFDoc.hasRepairedXRef', {
							doc: this.id,
						});
					}),
					(p.SDFDoc.prototype.isFullSaveRequired = function () {
						return p.sendWithPromise('SDFDoc.isFullSaveRequired', {
							doc: this.id,
						});
					}),
					(p.SDFDoc.prototype.getTrailer = function () {
						return p
							.sendWithPromise('SDFDoc.getTrailer', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.getObj = function (e) {
						return (
							f(arguments.length, 1, 'getObj', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('SDFDoc.getObj', { doc: this.id, obj_num: e })
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.importObj = function (e, t) {
						return (
							f(arguments.length, 2, 'importObj', '(PDFNet.Obj, boolean)', [
								[e, 'Object', p.Obj, 'Obj'],
								[t, 'boolean'],
							]),
							p
								.sendWithPromise('SDFDoc.importObj', {
									doc: this.id,
									obj: e.id,
									deep_copy: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.importObjsWithExcludeList = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'importObjsWithExcludeList',
								'(Array<Core.PDFNet.Obj>, Array<Core.PDFNet.Obj>)',
								[
									[e, 'Array'],
									[t, 'Array'],
								]
							),
							(e = Array.from(e, function (e) {
								return e.id;
							})),
							(t = Array.from(t, function (e) {
								return e.id;
							})),
							p
								.sendWithPromise('SDFDoc.importObjsWithExcludeList', {
									doc: this.id,
									obj_list: e,
									exclude_list: t,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.xRefSize = function () {
						return p.sendWithPromise('SDFDoc.xRefSize', { doc: this.id });
					}),
					(p.SDFDoc.prototype.clearMarks = function () {
						return p.sendWithPromise('SDFDoc.clearMarks', { doc: this.id });
					}),
					(p.SDFDoc.prototype.saveMemory = function (e, t) {
						return (
							f(arguments.length, 2, 'saveMemory', '(number, string)', [
								[e, 'number'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('SDFDoc.saveMemory', {
									doc: this.id,
									flags: e,
									header: t,
								})
								.then(function (e) {
									return new Uint8Array(e);
								})
						);
					}),
					(p.SDFDoc.prototype.saveStream = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'saveStream',
								'(PDFNet.Filter, number, string)',
								[
									[e, 'Object', p.Filter, 'Filter'],
									[t, 'number'],
									[n, 'string'],
								]
							),
							p.sendWithPromise('SDFDoc.saveStream', {
								doc: this.id,
								stream: e.id,
								flags: t,
								header: n,
							})
						);
					}),
					(p.SDFDoc.prototype.getHeader = function () {
						return p.sendWithPromise('SDFDoc.getHeader', { doc: this.id });
					}),
					(p.SDFDoc.prototype.getSecurityHandler = function () {
						return p
							.sendWithPromise('SDFDoc.getSecurityHandler', { doc: this.id })
							.then(function (e) {
								return D(p.SecurityHandler, e);
							});
					}),
					(p.SDFDoc.prototype.setSecurityHandler = function (e) {
						return (
							f(
								arguments.length,
								1,
								'setSecurityHandler',
								'(PDFNet.SecurityHandler)',
								[[e, 'Object', p.SecurityHandler, 'SecurityHandler']]
							),
							0 != e.id && S(e.id),
							p.sendWithPromise('SDFDoc.setSecurityHandler', {
								doc: this.id,
								no_own_handler: e.id,
							})
						);
					}),
					(p.SDFDoc.prototype.removeSecurity = function () {
						return p.sendWithPromise('SDFDoc.removeSecurity', { doc: this.id });
					}),
					(p.SDFDoc.prototype.swap = function (e, t) {
						return (
							f(arguments.length, 2, 'swap', '(number, number)', [
								[e, 'number'],
								[t, 'number'],
							]),
							p.sendWithPromise('SDFDoc.swap', {
								doc: this.id,
								obj_num1: e,
								obj_num2: t,
							})
						);
					}),
					(p.SDFDoc.prototype.isLinearized = function () {
						return p.sendWithPromise('SDFDoc.isLinearized', { doc: this.id });
					}),
					(p.SDFDoc.prototype.getLinearizationDict = function () {
						return p
							.sendWithPromise('SDFDoc.getLinearizationDict', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.getHintStream = function () {
						return p
							.sendWithPromise('SDFDoc.getHintStream', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.enableDiskCaching = function (e) {
						return (
							f(arguments.length, 1, 'enableDiskCaching', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('SDFDoc.enableDiskCaching', {
								doc: this.id,
								use_cache_flag: e,
							})
						);
					}),
					(p.SDFDoc.prototype.lock = function () {
						var e = this;
						return p
							.sendWithPromise('SDFDoc.lock', { doc: this.id })
							.then(function () {
								s.push({ name: 'SDFDoc', id: e.id, unlocktype: 'unlock' });
							});
					}),
					(p.SDFDoc.prototype.unlock = function () {
						var e = this;
						return p
							.sendWithPromise('SDFDoc.unlock', { doc: this.id })
							.then(function () {
								_(e);
							});
					}),
					(p.SDFDoc.prototype.lockRead = function () {
						var e = this;
						return p
							.sendWithPromise('SDFDoc.lockRead', { doc: this.id })
							.then(function () {
								s.push({ name: 'SDFDoc', id: e.id, unlocktype: 'unlockRead' });
							});
					}),
					(p.SDFDoc.prototype.unlockRead = function () {
						var e = this;
						return p
							.sendWithPromise('SDFDoc.unlockRead', { doc: this.id })
							.then(function () {
								_(e);
							});
					}),
					(p.SDFDoc.prototype.tryLock = function () {
						var t = this;
						return p
							.sendWithPromise('SDFDoc.tryLock', { doc: this.id })
							.then(function (e) {
								e && s.push({ name: 'SDFDoc', id: t.id, unlocktype: 'unlock' });
							});
					}),
					(p.SDFDoc.prototype.tryLockRead = function () {
						var t = this;
						return p
							.sendWithPromise('SDFDoc.tryLockRead', { doc: this.id })
							.then(function (e) {
								e &&
									s.push({
										name: 'SDFDoc',
										id: t.id,
										unlocktype: 'unlockRead',
									});
							});
					}),
					(p.SDFDoc.prototype.getFileName = function () {
						return p.sendWithPromise('SDFDoc.getFileName', { doc: this.id });
					}),
					(p.SDFDoc.prototype.createIndirectName = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectName', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('SDFDoc.createIndirectName', {
									doc: this.id,
									name: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createIndirectArray = function () {
						return p
							.sendWithPromise('SDFDoc.createIndirectArray', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.createIndirectBool = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectBool', '(boolean)', [
								[e, 'boolean'],
							]),
							p
								.sendWithPromise('SDFDoc.createIndirectBool', {
									doc: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createIndirectDict = function () {
						return p
							.sendWithPromise('SDFDoc.createIndirectDict', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.createIndirectNull = function () {
						return p
							.sendWithPromise('SDFDoc.createIndirectNull', { doc: this.id })
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.createIndirectNumber = function (e) {
						return (
							f(arguments.length, 1, 'createIndirectNumber', '(number)', [
								[e, 'number'],
							]),
							p
								.sendWithPromise('SDFDoc.createIndirectNumber', {
									doc: this.id,
									value: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createIndirectString = function (e) {
						f(
							arguments.length,
							1,
							'createIndirectString',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p
							.sendWithPromise('SDFDoc.createIndirectString', {
								doc: this.id,
								buf_value: t,
							})
							.then(function (e) {
								return D(p.Obj, e);
							});
					}),
					(p.SDFDoc.prototype.createIndirectStringFromUString = function (e) {
						return (
							f(
								arguments.length,
								1,
								'createIndirectStringFromUString',
								'(string)',
								[[e, 'string']]
							),
							p
								.sendWithPromise('SDFDoc.createIndirectStringFromUString', {
									doc: this.id,
									str: e,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createIndirectStreamFromFilter = function (e, t) {
						return (
							void 0 === t && (t = new p.Filter('0')),
							f(
								arguments.length,
								1,
								'createIndirectStreamFromFilter',
								'(PDFNet.FilterReader, PDFNet.Filter)',
								[
									[e, 'Object', p.FilterReader, 'FilterReader'],
									[t, 'Object', p.Filter, 'Filter'],
								]
							),
							0 != t.id && S(t.id),
							p
								.sendWithPromise('SDFDoc.createIndirectStreamFromFilter', {
									doc: this.id,
									data: e.id,
									no_own_filter_chain: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SDFDoc.prototype.createIndirectStream = function (e, t) {
						f(
							arguments.length,
							2,
							'createIndirectStream',
							'(ArrayBuffer|TypedArray, PDFNet.Filter)',
							[
								[e, 'ArrayBuffer'],
								[t, 'Object', p.Filter, 'Filter'],
							]
						);
						var n = b(e, !1);
						return (
							0 != t.id && S(t.id),
							p
								.sendWithPromise('SDFDoc.createIndirectStream', {
									doc: this.id,
									data_buf: n,
									no_own_filter_chain: t.id,
								})
								.then(function (e) {
									return D(p.Obj, e);
								})
						);
					}),
					(p.SecurityHandler.prototype.getPermission = function (e) {
						return (
							f(arguments.length, 1, 'getPermission', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('SecurityHandler.getPermission', {
								sh: this.id,
								p: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.getKeyLength = function () {
						return p.sendWithPromise('SecurityHandler.getKeyLength', {
							sh: this.id,
						});
					}),
					(p.SecurityHandler.prototype.getEncryptionAlgorithmID = function () {
						return p.sendWithPromise(
							'SecurityHandler.getEncryptionAlgorithmID',
							{ sh: this.id }
						);
					}),
					(p.SecurityHandler.prototype.getHandlerDocName = function () {
						return p.sendWithPromise('SecurityHandler.getHandlerDocName', {
							sh: this.id,
						});
					}),
					(p.SecurityHandler.prototype.isModified = function () {
						return p.sendWithPromise('SecurityHandler.isModified', {
							sh: this.id,
						});
					}),
					(p.SecurityHandler.prototype.setModified = function (e) {
						return (
							void 0 === e && (e = !0),
							f(arguments.length, 0, 'setModified', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('SecurityHandler.setModified', {
								sh: this.id,
								is_modified: e,
							})
						);
					}),
					(p.SecurityHandler.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('securityHandlerCreate', { crypt_type: e })
								.then(function (e) {
									return y(p.SecurityHandler, e);
								})
						);
					}),
					(p.SecurityHandler.createFromEncCode = function (e, t, n) {
						return (
							f(
								arguments.length,
								3,
								'createFromEncCode',
								'(string, number, number)',
								[
									[e, 'string'],
									[t, 'number'],
									[n, 'number'],
								]
							),
							p
								.sendWithPromise('securityHandlerCreateFromEncCode', {
									name: e,
									key_len: t,
									enc_code: n,
								})
								.then(function (e) {
									return y(p.SecurityHandler, e);
								})
						);
					}),
					(p.SecurityHandler.createDefault = function () {
						return p
							.sendWithPromise('securityHandlerCreateDefault', {})
							.then(function (e) {
								return y(p.SecurityHandler, e);
							});
					}),
					(p.SecurityHandler.prototype.setPermission = function (e, t) {
						return (
							f(arguments.length, 2, 'setPermission', '(number, boolean)', [
								[e, 'number'],
								[t, 'boolean'],
							]),
							p.sendWithPromise('SecurityHandler.setPermission', {
								sh: this.id,
								perm: e,
								value: t,
							})
						);
					}),
					(p.SecurityHandler.prototype.changeRevisionNumber = function (e) {
						return (
							f(arguments.length, 1, 'changeRevisionNumber', '(number)', [
								[e, 'number'],
							]),
							p.sendWithPromise('SecurityHandler.changeRevisionNumber', {
								sh: this.id,
								rev_num: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.setEncryptMetadata = function (e) {
						return (
							f(arguments.length, 1, 'setEncryptMetadata', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('SecurityHandler.setEncryptMetadata', {
								sh: this.id,
								encrypt_metadata: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.getRevisionNumber = function () {
						return p.sendWithPromise('SecurityHandler.getRevisionNumber', {
							sh: this.id,
						});
					}),
					(p.SecurityHandler.prototype.isUserPasswordRequired = function () {
						return p.sendWithPromise('SecurityHandler.isUserPasswordRequired', {
							sh: this.id,
						});
					}),
					(p.SecurityHandler.prototype.isMasterPasswordRequired = function () {
						return p.sendWithPromise(
							'SecurityHandler.isMasterPasswordRequired',
							{ sh: this.id }
						);
					}),
					(p.SecurityHandler.prototype.isAES = function () {
						return p.sendWithPromise('SecurityHandler.isAES', { sh: this.id });
					}),
					(p.SecurityHandler.prototype.isAESObj = function (e) {
						return (
							f(arguments.length, 1, 'isAESObj', '(PDFNet.Obj)', [
								[e, 'Object', p.Obj, 'Obj'],
							]),
							p.sendWithPromise('SecurityHandler.isAESObj', {
								sh: this.id,
								stream: e.id,
							})
						);
					}),
					(p.SecurityHandler.prototype.isRC4 = function () {
						return p.sendWithPromise('SecurityHandler.isRC4', { sh: this.id });
					}),
					(p.SecurityHandler.prototype.changeUserPasswordUString = function (
						e
					) {
						return (
							f(arguments.length, 1, 'changeUserPasswordUString', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('SecurityHandler.changeUserPasswordUString', {
								sh: this.id,
								password: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.changeUserPasswordBuffer = function (e) {
						f(
							arguments.length,
							1,
							'changeUserPasswordBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise(
							'SecurityHandler.changeUserPasswordBuffer',
							{ sh: this.id, password_buf: t }
						);
					}),
					(p.SecurityHandler.prototype.changeMasterPasswordUString = function (
						e
					) {
						return (
							f(
								arguments.length,
								1,
								'changeMasterPasswordUString',
								'(string)',
								[[e, 'string']]
							),
							p.sendWithPromise('SecurityHandler.changeMasterPasswordUString', {
								sh: this.id,
								password: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.changeMasterPasswordBuffer = function (
						e
					) {
						f(
							arguments.length,
							1,
							'changeMasterPasswordBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise(
							'SecurityHandler.changeMasterPasswordBuffer',
							{ sh: this.id, password_buf: t }
						);
					}),
					(p.SecurityHandler.prototype.initPasswordUString = function (e) {
						return (
							f(arguments.length, 1, 'initPasswordUString', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('SecurityHandler.initPasswordUString', {
								sh: this.id,
								password: e,
							})
						);
					}),
					(p.SecurityHandler.prototype.initPasswordBuffer = function (e) {
						f(
							arguments.length,
							1,
							'initPasswordBuffer',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise('SecurityHandler.initPasswordBuffer', {
							sh: this.id,
							password_buf: t,
						});
					}),
					(p.SignatureHandler.prototype.getName = function () {
						return p.sendWithPromise('SignatureHandler.getName', {
							signature_handler: this.id,
						});
					}),
					(p.SignatureHandler.prototype.reset = function () {
						return p.sendWithPromise('SignatureHandler.reset', {
							signature_handler: this.id,
						});
					}),
					(p.SignatureHandler.prototype.destructor = function () {
						return p.sendWithPromise('SignatureHandler.destructor', {
							signature_handler: this.id,
						});
					}),
					(p.UndoManager.prototype.discardAllSnapshots = function () {
						return p
							.sendWithPromise('UndoManager.discardAllSnapshots', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.DocSnapshot, e);
							});
					}),
					(p.UndoManager.prototype.undo = function () {
						return p
							.sendWithPromise('UndoManager.undo', { self: this.id })
							.then(function (e) {
								return y(p.ResultSnapshot, e);
							});
					}),
					(p.UndoManager.prototype.canUndo = function () {
						return p.sendWithPromise('UndoManager.canUndo', { self: this.id });
					}),
					(p.UndoManager.prototype.getNextUndoSnapshot = function () {
						return p
							.sendWithPromise('UndoManager.getNextUndoSnapshot', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.DocSnapshot, e);
							});
					}),
					(p.UndoManager.prototype.redo = function () {
						return p
							.sendWithPromise('UndoManager.redo', { self: this.id })
							.then(function (e) {
								return y(p.ResultSnapshot, e);
							});
					}),
					(p.UndoManager.prototype.canRedo = function () {
						return p.sendWithPromise('UndoManager.canRedo', { self: this.id });
					}),
					(p.UndoManager.prototype.getNextRedoSnapshot = function () {
						return p
							.sendWithPromise('UndoManager.getNextRedoSnapshot', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.DocSnapshot, e);
							});
					}),
					(p.UndoManager.prototype.takeSnapshot = function () {
						return p
							.sendWithPromise('UndoManager.takeSnapshot', { self: this.id })
							.then(function (e) {
								return y(p.ResultSnapshot, e);
							});
					}),
					(p.ResultSnapshot.prototype.currentState = function () {
						return p
							.sendWithPromise('ResultSnapshot.currentState', { self: this.id })
							.then(function (e) {
								return y(p.DocSnapshot, e);
							});
					}),
					(p.ResultSnapshot.prototype.previousState = function () {
						return p
							.sendWithPromise('ResultSnapshot.previousState', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.DocSnapshot, e);
							});
					}),
					(p.ResultSnapshot.prototype.isOk = function () {
						return p.sendWithPromise('ResultSnapshot.isOk', { self: this.id });
					}),
					(p.ResultSnapshot.prototype.isNullTransition = function () {
						return p.sendWithPromise('ResultSnapshot.isNullTransition', {
							self: this.id,
						});
					}),
					(p.DocSnapshot.prototype.getHash = function () {
						return p.sendWithPromise('DocSnapshot.getHash', { self: this.id });
					}),
					(p.DocSnapshot.prototype.isValid = function () {
						return p.sendWithPromise('DocSnapshot.isValid', { self: this.id });
					}),
					(p.DocSnapshot.prototype.equals = function (e) {
						return (
							f(arguments.length, 1, 'equals', '(PDFNet.DocSnapshot)', [
								[e, 'Object', p.DocSnapshot, 'DocSnapshot'],
							]),
							p.sendWithPromise('DocSnapshot.equals', {
								self: this.id,
								snapshot: e.id,
							})
						);
					}),
					(p.OCRModule.applyOCRJsonToPDF = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'applyOCRJsonToPDF',
								'(PDFNet.PDFDoc, string)',
								[
									[e, 'PDFDoc'],
									[t, 'string'],
								]
							),
							p.sendWithPromise('ocrModuleApplyOCRJsonToPDF', {
								dst: e.id,
								json: t,
							})
						);
					}),
					(p.OCRModule.applyOCRXmlToPDF = function (e, t) {
						return (
							f(
								arguments.length,
								2,
								'applyOCRXmlToPDF',
								'(PDFNet.PDFDoc, string)',
								[
									[e, 'PDFDoc'],
									[t, 'string'],
								]
							),
							p.sendWithPromise('ocrModuleApplyOCRXmlToPDF', {
								dst: e.id,
								xml: t,
							})
						);
					}),
					(p.VerificationOptions.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('verificationOptionsCreate', { in_level: e })
								.then(function (e) {
									return y(p.VerificationOptions, e);
								})
						);
					}),
					(p.VerificationOptions.prototype.addTrustedCertificate = function (
						e,
						t
					) {
						void 0 === t &&
							(t = p.VerificationOptions.CertificateTrustFlag.e_default_trust),
							f(
								arguments.length,
								1,
								'addTrustedCertificate',
								'(ArrayBuffer|TypedArray, number)',
								[
									[e, 'ArrayBuffer'],
									[t, 'number'],
								]
							);
						var n = b(e, !1);
						return p.sendWithPromise(
							'VerificationOptions.addTrustedCertificate',
							{ self: this.id, in_certificate_buf: n, in_trust_flags: t }
						);
					}),
					(p.VerificationOptions.prototype.addTrustedCertificates = function (
						e
					) {
						f(
							arguments.length,
							1,
							'addTrustedCertificates',
							'(ArrayBuffer|TypedArray)',
							[[e, 'ArrayBuffer']]
						);
						var t = b(e, !1);
						return p.sendWithPromise(
							'VerificationOptions.addTrustedCertificates',
							{ self: this.id, in_P7C_binary_DER_certificates_file_data_buf: t }
						);
					}),
					(p.VerificationOptions.prototype.loadTrustList = function (e) {
						return (
							f(arguments.length, 1, 'loadTrustList', '(PDFNet.FDFDoc)', [
								[e, 'FDFDoc'],
							]),
							p.sendWithPromise('VerificationOptions.loadTrustList', {
								self: this.id,
								in_fdf_cert_exchange_data: e.id,
							})
						);
					}),
					(p.VerificationOptions.prototype.enableModificationVerification =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'enableModificationVerification',
									'(boolean)',
									[[e, 'boolean']]
								),
								p.sendWithPromise(
									'VerificationOptions.enableModificationVerification',
									{ self: this.id, in_on_or_off: e }
								)
							);
						}),
					(p.VerificationOptions.prototype.enableDigestVerification = function (
						e
					) {
						return (
							f(arguments.length, 1, 'enableDigestVerification', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise(
								'VerificationOptions.enableDigestVerification',
								{ self: this.id, in_on_or_off: e }
							)
						);
					}),
					(p.VerificationOptions.prototype.enableTrustVerification = function (
						e
					) {
						return (
							f(arguments.length, 1, 'enableTrustVerification', '(boolean)', [
								[e, 'boolean'],
							]),
							p.sendWithPromise('VerificationOptions.enableTrustVerification', {
								self: this.id,
								in_on_or_off: e,
							})
						);
					}),
					(p.VerificationOptions.prototype.setRevocationProxyPrefix = function (
						e
					) {
						return (
							f(arguments.length, 1, 'setRevocationProxyPrefix', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise(
								'VerificationOptions.setRevocationProxyPrefix',
								{ self: this.id, in_str: e }
							)
						);
					}),
					(p.VerificationOptions.prototype.enableOnlineCRLRevocationChecking =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'enableOnlineCRLRevocationChecking',
									'(boolean)',
									[[e, 'boolean']]
								),
								p.sendWithPromise(
									'VerificationOptions.enableOnlineCRLRevocationChecking',
									{ self: this.id, in_on_or_off: e }
								)
							);
						}),
					(p.VerificationOptions.prototype.enableOnlineOCSPRevocationChecking =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'enableOnlineOCSPRevocationChecking',
									'(boolean)',
									[[e, 'boolean']]
								),
								p.sendWithPromise(
									'VerificationOptions.enableOnlineOCSPRevocationChecking',
									{ self: this.id, in_on_or_off: e }
								)
							);
						}),
					(p.VerificationOptions.prototype.enableOnlineRevocationChecking =
						function (e) {
							return (
								f(
									arguments.length,
									1,
									'enableOnlineRevocationChecking',
									'(boolean)',
									[[e, 'boolean']]
								),
								p.sendWithPromise(
									'VerificationOptions.enableOnlineRevocationChecking',
									{ self: this.id, in_on_or_off: e }
								)
							);
						}),
					(p.VerificationResult.prototype.getDigitalSignatureField =
						function () {
							return p
								.sendWithPromise(
									'VerificationResult.getDigitalSignatureField',
									{ self: this.id }
								)
								.then(function (e) {
									return new p.DigitalSignatureField(e);
								});
						}),
					(p.VerificationResult.prototype.getVerificationStatus = function () {
						return p.sendWithPromise(
							'VerificationResult.getVerificationStatus',
							{ self: this.id }
						);
					}),
					(p.VerificationResult.prototype.getDocumentStatus = function () {
						return p.sendWithPromise('VerificationResult.getDocumentStatus', {
							self: this.id,
						});
					}),
					(p.VerificationResult.prototype.getDigestStatus = function () {
						return p.sendWithPromise('VerificationResult.getDigestStatus', {
							self: this.id,
						});
					}),
					(p.VerificationResult.prototype.getTrustStatus = function () {
						return p.sendWithPromise('VerificationResult.getTrustStatus', {
							self: this.id,
						});
					}),
					(p.VerificationResult.prototype.getPermissionsStatus = function () {
						return p.sendWithPromise(
							'VerificationResult.getPermissionsStatus',
							{ self: this.id }
						);
					}),
					(p.VerificationResult.prototype.getTrustVerificationResult =
						function () {
							return p
								.sendWithPromise(
									'VerificationResult.getTrustVerificationResult',
									{ self: this.id }
								)
								.then(function (e) {
									return y(p.TrustVerificationResult, e);
								});
						}),
					(p.VerificationResult.prototype.hasTrustVerificationResult =
						function () {
							return p.sendWithPromise(
								'VerificationResult.hasTrustVerificationResult',
								{ self: this.id }
							);
						}),
					(p.VerificationResult.prototype.getDisallowedChanges = function () {
						return p
							.sendWithPromise('VerificationResult.getDisallowedChanges', {
								self: this.id,
							})
							.then(function (e) {
								for (var t = [], n = 0; n < e.length; ++n) {
									var i = e[n];
									if ('0' === i) return null;
									(i = new p.DisallowedChange(i)),
										t.push(i),
										a.push({ name: i.name, id: i.id });
								}
								return t;
							});
					}),
					(p.VerificationResult.prototype.getDigestAlgorithm = function () {
						return p.sendWithPromise('VerificationResult.getDigestAlgorithm', {
							self: this.id,
						});
					}),
					(p.VerificationResult.prototype.getDocumentStatusAsString =
						function () {
							return p.sendWithPromise(
								'VerificationResult.getDocumentStatusAsString',
								{ self: this.id }
							);
						}),
					(p.VerificationResult.prototype.getDigestStatusAsString =
						function () {
							return p.sendWithPromise(
								'VerificationResult.getDigestStatusAsString',
								{ self: this.id }
							);
						}),
					(p.VerificationResult.prototype.getTrustStatusAsString = function () {
						return p.sendWithPromise(
							'VerificationResult.getTrustStatusAsString',
							{ self: this.id }
						);
					}),
					(p.VerificationResult.prototype.getPermissionsStatusAsString =
						function () {
							return p.sendWithPromise(
								'VerificationResult.getPermissionsStatusAsString',
								{ self: this.id }
							);
						}),
					(p.VerificationResult.prototype.getUnsupportedFeatures = function () {
						return p.sendWithPromise(
							'VerificationResult.getUnsupportedFeatures',
							{ self: this.id }
						);
					}),
					(p.EmbeddedTimestampVerificationResult.prototype.getVerificationStatus =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getVerificationStatus',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getCMSDigestStatus =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getCMSDigestStatus',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestStatus =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getMessageImprintDigestStatus',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getTrustStatus =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getTrustStatus',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getCMSDigestStatusAsString =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getCMSDigestStatusAsString',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestStatusAsString =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getMessageImprintDigestStatusAsString',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getTrustStatusAsString =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getTrustStatusAsString',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.hasTrustVerificationResult =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.hasTrustVerificationResult',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getTrustVerificationResult =
						function () {
							return p
								.sendWithPromise(
									'EmbeddedTimestampVerificationResult.getTrustVerificationResult',
									{ self: this.id }
								)
								.then(function (e) {
									return y(p.TrustVerificationResult, e);
								});
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getCMSSignatureDigestAlgorithm =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getCMSSignatureDigestAlgorithm',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getMessageImprintDigestAlgorithm =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getMessageImprintDigestAlgorithm',
								{ self: this.id }
							);
						}),
					(p.EmbeddedTimestampVerificationResult.prototype.getUnsupportedFeatures =
						function () {
							return p.sendWithPromise(
								'EmbeddedTimestampVerificationResult.getUnsupportedFeatures',
								{ self: this.id }
							);
						}),
					(p.TrustVerificationResult.prototype.wasSuccessful = function () {
						return p.sendWithPromise('TrustVerificationResult.wasSuccessful', {
							self: this.id,
						});
					}),
					(p.TrustVerificationResult.prototype.getResultString = function () {
						return p.sendWithPromise(
							'TrustVerificationResult.getResultString',
							{ self: this.id }
						);
					}),
					(p.TrustVerificationResult.prototype.getTimeOfTrustVerification =
						function () {
							return p.sendWithPromise(
								'TrustVerificationResult.getTimeOfTrustVerification',
								{ self: this.id }
							);
						}),
					(p.TrustVerificationResult.prototype.getTimeOfTrustVerificationEnum =
						function () {
							return p.sendWithPromise(
								'TrustVerificationResult.getTimeOfTrustVerificationEnum',
								{ self: this.id }
							);
						}),
					(p.TrustVerificationResult.prototype.hasEmbeddedTimestampVerificationResult =
						function () {
							return p.sendWithPromise(
								'TrustVerificationResult.hasEmbeddedTimestampVerificationResult',
								{ self: this.id }
							);
						}),
					(p.TrustVerificationResult.prototype.getEmbeddedTimestampVerificationResult =
						function () {
							return p
								.sendWithPromise(
									'TrustVerificationResult.getEmbeddedTimestampVerificationResult',
									{ self: this.id }
								)
								.then(function (e) {
									return y(p.EmbeddedTimestampVerificationResult, e);
								});
						}),
					(p.TrustVerificationResult.prototype.getCertPath = function () {
						return p
							.sendWithPromise('TrustVerificationResult.getCertPath', {
								self: this.id,
							})
							.then(function (e) {
								for (var t = [], n = 0; n < e.length; ++n) {
									var i = e[n];
									if ('0' === i) return null;
									(i = new p.X509Certificate(i)),
										t.push(i),
										a.push({ name: i.name, id: i.id });
								}
								return t;
							});
					}),
					(p.DisallowedChange.prototype.getObjNum = function () {
						return p.sendWithPromise('DisallowedChange.getObjNum', {
							self: this.id,
						});
					}),
					(p.DisallowedChange.prototype.getType = function () {
						return p.sendWithPromise('DisallowedChange.getType', {
							self: this.id,
						});
					}),
					(p.DisallowedChange.prototype.getTypeAsString = function () {
						return p.sendWithPromise('DisallowedChange.getTypeAsString', {
							self: this.id,
						});
					}),
					(p.X509Extension.prototype.isCritical = function () {
						return p.sendWithPromise('X509Extension.isCritical', {
							self: this.id,
						});
					}),
					(p.X509Extension.prototype.getObjectIdentifier = function () {
						return p
							.sendWithPromise('X509Extension.getObjectIdentifier', {
								self: this.id,
							})
							.then(function (e) {
								return y(p.ObjectIdentifier, e);
							});
					}),
					(p.X509Extension.prototype.toString = function () {
						return p.sendWithPromise('X509Extension.toString', {
							self: this.id,
						});
					}),
					(p.X509Extension.prototype.getData = function () {
						return p
							.sendWithPromise('X509Extension.getData', { self: this.id })
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.X501AttributeTypeAndValue.prototype.getAttributeTypeOID =
						function () {
							return p
								.sendWithPromise(
									'X501AttributeTypeAndValue.getAttributeTypeOID',
									{ self: this.id }
								)
								.then(function (e) {
									return y(p.ObjectIdentifier, e);
								});
						}),
					(p.X501AttributeTypeAndValue.prototype.getStringValue = function () {
						return p.sendWithPromise(
							'X501AttributeTypeAndValue.getStringValue',
							{ self: this.id }
						);
					}),
					(p.ByteRange.prototype.getStartOffset = function () {
						return (
							P('getStartOffset', this.yieldFunction),
							p.sendWithPromise('ByteRange.getStartOffset', { self: this })
						);
					}),
					(p.ByteRange.prototype.getEndOffset = function () {
						return (
							P('getEndOffset', this.yieldFunction),
							p.sendWithPromise('ByteRange.getEndOffset', { self: this })
						);
					}),
					(p.ByteRange.prototype.getSize = function () {
						return (
							P('getSize', this.yieldFunction),
							p.sendWithPromise('ByteRange.getSize', { self: this })
						);
					}),
					(p.TimestampingResult.prototype.getStatus = function () {
						return p.sendWithPromise('TimestampingResult.getStatus', {
							self: this.id,
						});
					}),
					(p.TimestampingResult.prototype.getString = function () {
						return p.sendWithPromise('TimestampingResult.getString', {
							self: this.id,
						});
					}),
					(p.TimestampingResult.prototype.hasResponseVerificationResult =
						function () {
							return p.sendWithPromise(
								'TimestampingResult.hasResponseVerificationResult',
								{ self: this.id }
							);
						}),
					(p.TimestampingResult.prototype.getResponseVerificationResult =
						function () {
							return p
								.sendWithPromise(
									'TimestampingResult.getResponseVerificationResult',
									{ self: this.id }
								)
								.then(function (e) {
									return y(p.EmbeddedTimestampVerificationResult, e);
								});
						}),
					(p.TimestampingResult.prototype.getData = function () {
						return p
							.sendWithPromise('TimestampingResult.getData', { self: this.id })
							.then(function (e) {
								return new Uint8Array(e);
							});
					}),
					(p.ActionParameter.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(PDFNet.Action)', [
								[e, 'Object', p.Action, 'Action'],
							]),
							p
								.sendWithPromise('actionParameterCreate', { action: e.id })
								.then(function (e) {
									return y(p.ActionParameter, e);
								})
						);
					});
				(p.Action.prototype.parameterCreateWithField = function (e) {
					return (
						f(
							arguments.length,
							1,
							'parameterCreateWithField',
							'(PDFNet.Field)',
							[[e, 'Structure', p.Field, 'Field']]
						),
						F('parameterCreateWithField', [[e, 0]]),
						p
							.sendWithPromise('Action.parameterCreateWithField', {
								action: this.id,
								field: e,
							})
							.then(function (e) {
								return y(p.ActionParameter, e);
							})
					);
				}),
					(p.Action.prototype.parameterCreateWithAnnot = function (e) {
						return (
							f(
								arguments.length,
								1,
								'parameterCreateWithAnnot',
								'(PDFNet.Annot)',
								[[e, 'Object', p.Annot, 'Annot']]
							),
							p
								.sendWithPromise('Action.parameterCreateWithAnnot', {
									action: this.id,
									annot: e.id,
								})
								.then(function (e) {
									return y(p.ActionParameter, e);
								})
						);
					}),
					(p.Action.prototype.parameterCreateWithPage = function (e) {
						return (
							f(
								arguments.length,
								1,
								'parameterCreateWithPage',
								'(PDFNet.Page)',
								[[e, 'Object', p.Page, 'Page']]
							),
							p
								.sendWithPromise('Action.parameterCreateWithPage', {
									action: this.id,
									page: e.id,
								})
								.then(function (e) {
									return y(p.ActionParameter, e);
								})
						);
					}),
					(p.ActionParameter.prototype.getAction = function () {
						return p
							.sendWithPromise('ActionParameter.getAction', { ap: this.id })
							.then(function (e) {
								return D(p.Action, e);
							});
					}),
					(p.ViewChangeCollection.create = function () {
						return p
							.sendWithPromise('viewChangeCollectionCreate', {})
							.then(function (e) {
								return y(p.ViewChangeCollection, e);
							});
					}),
					(p.RadioButtonGroup.createFromField = function (e) {
						return (
							f(arguments.length, 1, 'createFromField', '(PDFNet.Field)', [
								[e, 'Structure', p.Field, 'Field'],
							]),
							F('createFromField', [[e, 0]]),
							p
								.sendWithPromise('radioButtonGroupCreateFromField', {
									field: e,
								})
								.then(function (e) {
									return y(p.RadioButtonGroup, e);
								})
						);
					}),
					(p.RadioButtonGroup.create = function (e, t) {
						return (
							void 0 === t && (t = ''),
							f(arguments.length, 1, 'create', '(PDFNet.PDFDoc, string)', [
								[e, 'PDFDoc'],
								[t, 'string'],
							]),
							p
								.sendWithPromise('radioButtonGroupCreate', {
									doc: e.id,
									field_name: t,
								})
								.then(function (e) {
									return y(p.RadioButtonGroup, e);
								})
						);
					}),
					(p.RadioButtonGroup.prototype.copy = function () {
						return p
							.sendWithPromise('RadioButtonGroup.copy', { group: this.id })
							.then(function (e) {
								return y(p.RadioButtonGroup, e);
							});
					}),
					(p.RadioButtonGroup.prototype.add = function (e, t) {
						return (
							void 0 === t && (t = ''),
							f(arguments.length, 1, 'add', '(PDFNet.Rect, string)', [
								[e, 'Structure', p.Rect, 'Rect'],
								[t, 'const char* = 0'],
							]),
							F('add', [[e, 0]]),
							p
								.sendWithPromise('RadioButtonGroup.add', {
									group: this.id,
									pos: e,
									onstate: t,
								})
								.then(function (e) {
									return D(p.RadioButtonWidget, e);
								})
						);
					}),
					(p.RadioButtonGroup.prototype.getNumButtons = function () {
						return p.sendWithPromise('RadioButtonGroup.getNumButtons', {
							group: this.id,
						});
					}),
					(p.RadioButtonGroup.prototype.getButton = function (e) {
						return (
							f(arguments.length, 1, 'getButton', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('RadioButtonGroup.getButton', {
									group: this.id,
									index: e,
								})
								.then(function (e) {
									return D(p.RadioButtonWidget, e);
								})
						);
					}),
					(p.RadioButtonGroup.prototype.getField = function () {
						return p
							.sendWithPromise('RadioButtonGroup.getField', { group: this.id })
							.then(function (e) {
								return new p.Field(e);
							});
					}),
					(p.RadioButtonGroup.prototype.addGroupButtonsToPage = function (e) {
						return (
							f(arguments.length, 1, 'addGroupButtonsToPage', '(PDFNet.Page)', [
								[e, 'Object', p.Page, 'Page'],
							]),
							p.sendWithPromise('RadioButtonGroup.addGroupButtonsToPage', {
								group: this.id,
								page: e.id,
							})
						);
					}),
					(p.PDFTronCustomSecurityHandler.create = function (e) {
						return (
							f(arguments.length, 1, 'create', '(number)', [[e, 'number']]),
							p
								.sendWithPromise('pdfTronCustomSecurityHandlerCreate', {
									custom_id: e,
								})
								.then(function (e) {
									return y(p.SecurityHandler, e);
								})
						);
					}),
					(p.WebFontDownloader.isAvailable = function () {
						return p.sendWithPromise('webFontDownloaderIsAvailable', {});
					}),
					(p.WebFontDownloader.enableDownloads = function () {
						return p.sendWithPromise('webFontDownloaderEnableDownloads', {});
					}),
					(p.WebFontDownloader.disableDownloads = function () {
						return p.sendWithPromise('webFontDownloaderDisableDownloads', {});
					}),
					(p.WebFontDownloader.preCacheAsync = function () {
						return p.sendWithPromise('webFontDownloaderPreCacheAsync', {});
					}),
					(p.WebFontDownloader.clearCache = function () {
						return p.sendWithPromise('webFontDownloaderClearCache', {});
					}),
					(p.WebFontDownloader.setCustomWebFontURL = function (e) {
						return (
							f(arguments.length, 1, 'setCustomWebFontURL', '(string)', [
								[e, 'string'],
							]),
							p.sendWithPromise('webFontDownloaderSetCustomWebFontURL', {
								url: e,
							})
						);
					});
				var o,
					f = function (e, t, i, r, n) {
						if (t === (maxNum = n.length)) {
							if (e !== t)
								throw new RangeError(
									e +
										" arguments passed into function '" +
										i +
										"'. Expected " +
										t +
										' argument. Function Signature: ' +
										i +
										r
								);
						} else if (t <= 0) {
							if (e > maxNum)
								throw new RangeError(
									e +
										" arguments passed into function '" +
										i +
										"'. Expected at most " +
										maxNum +
										' arguments. Function Signature: ' +
										i +
										r
								);
						} else if (e < t || e > maxNum)
							throw new RangeError(
								e +
									" arguments passed into function '" +
									i +
									"'. Expected " +
									t +
									' to ' +
									maxNum +
									' arguments. Function Signature: ' +
									i +
									r
							);
						function o(e, t, n) {
							throw new TypeError(
								g(e) +
									" input argument in function '" +
									i +
									"' is of type '" +
									t +
									"'. Expected type '" +
									n +
									"'. Function Signature: " +
									i +
									r
							);
						}
						for (
							e = function (e, t, n) {
								'object' === c(e) && e.name ? o(t, e.name, n) : o(t, c(e), n);
							},
								t = 0;
							t < maxNum;
							t++
						) {
							var s = n[t],
								u = s[0],
								a = s[1];
							if (u instanceof Promise)
								throw new TypeError(
									g(t) +
										" input argument in function '" +
										i +
										"' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('OptionBase' === a) {
								if (u)
									if ('object' === c(u)) {
										if ('function' != typeof u.getJsonString)
											throw new TypeError(
												g(t) +
													" input argument in function '" +
													i +
													"' is an 'oject' which is expected to have the 'getJsonString' function"
											);
									} else o(t, u.name, 'object');
							} else
								'Array' === a
									? u.constructor !== Array && e(u, t, 'Array')
									: 'ArrayBuffer' === a
									? l.isArrayBuffer(u) ||
									  l.isArrayBuffer(u.buffer) ||
									  e(u, t, 'ArrayBuffer|TypedArray')
									: 'ArrayAsBuffer' === a
									? u.constructor === Array ||
									  l.isArrayBuffer(u) ||
									  l.isArrayBuffer(u.buffer) ||
									  e(u, t, 'ArrayBuffer|TypedArray')
									: 'PDFDoc' === a || 'SDFDoc' === a || 'FDFDoc' === a
									? u instanceof p.PDFDoc ||
									  u instanceof p.SDFDoc ||
									  u instanceof p.FDFDoc ||
									  e(u, t, 'PDFDoc|SDFDoc|FDFDoc')
									: 'Structure' === a
									? u instanceof s[2] || !u || u.name === s[3] || e(u, t, s[3])
									: 'OptionObject' === a
									? u instanceof s[2] ||
									  ('object' === c(u) && u.name
											? u.name !== s[4] && o(t, u.name, s[3])
											: o(t, c(u), s[3]))
									: 'Object' === a
									? u instanceof s[2] || e(u, t, s[3])
									: 'const char* = 0' === a
									? 'string' != typeof u && null !== u && o(t, c(u), 'string')
									: c(u) !== a && o(t, c(u), a);
						}
					},
					P = function (e, t) {
						if (void 0 !== t)
							throw Error(
								'Function ' +
									t +
									" recently altered a struct object without yielding. That object is now being accessed by function '" +
									e +
									"'. Perhaps a yield statement is required for " +
									t +
									'?'
							);
					},
					F = function (e, t) {
						for (var n = 0; n < t.length; n++) {
							var i = t[n],
								r = i[0];
							if (r && void 0 !== r.yieldFunction)
								throw Error(
									"Function '" +
										r.yieldFunction +
										"' recently altered a struct object without yielding. That object is now being accessed by the " +
										g(i[1]) +
										" input argument in function '" +
										e +
										"'. Perhaps a yield statement is required for '" +
										r.yieldFunction +
										"'?"
								);
						}
					},
					b = function (e, t) {
						var n = e;
						return (
							t && e.constructor === Array && (n = new Float64Array(e)),
							l.isArrayBuffer(n) ||
								((n = n.buffer),
								e.byteLength < n.byteLength &&
									(n = n.slice(e.byteOffset, e.byteOffset + e.byteLength))),
							n
						);
					},
					y =
						((a = []),
						(s = []),
						(u = n = 0),
						(d = []),
						(h = []),
						l.PDFTron &&
							PDFTron.WebViewer &&
							PDFTron.WebViewer.prototype &&
							PDFTron.WebViewer.prototype.version &&
							PDFTron.skipPDFNetWebViewerWarning,
						function (e, t, n) {
							return '0' === t
								? null
								: ((e = new e(t, n)), a.push({ name: e.name, id: e.id }), e);
						}),
					D = function (e, t, n) {
						return '0' === t ? null : new e(t, n);
					},
					_ = function (e) {
						for (var t = -1, n = s.length - 1; 0 <= n; n--)
							if (s[n].id == e.id) {
								t = n;
								break;
							}
						if (-1 != t)
							for (s.splice(t, 1), n = h.length - 1; 0 <= n && t < h[n]; n--)
								--h[n];
					},
					S = function (e) {
						for (var t = -1, n = a.length - 1; 0 <= n; n--)
							if (a[n].id == e) {
								t = n;
								break;
							}
						if (-1 != t)
							for (a.splice(t, 1), n = d.length - 1; 0 <= n && t < d[n]; n--)
								--d[n];
					},
					O =
						((p.messageHandler = {
							sendWithPromiseReturnId: function () {
								throw Error(
									'PDFNet.initialize must be called and finish resolving before any other PDFNetJS function calls.'
								);
							},
						}),
						(p.userPriority = 2),
						(p.sendWithPromise = function (e, t) {
							var n = this.messageHandler,
								i = n.sendWithPromiseReturnId(e, t, this.userPriority);
							return (
								(n.pdfnetCommandChain =
									0 == n.pdfnetActiveCommands.size
										? i.promise
										: n.pdfnetCommandChain.then(function () {
												return i.promise;
										  })),
								n.pdfnetActiveCommands.add(i.callbackId),
								n.pdfnetCommandChain
							);
						}),
						function (e, t) {
							for (var n in e) t[n] = e[n];
						}),
					A =
						((p.runGeneratorWithoutCleanup = function (e, t) {
							return p.runWithoutCleanup(function () {
								return r(e);
							}, t);
						}),
						(p.runGeneratorWithCleanup = function (e, t) {
							return p.runWithCleanup(function () {
								return r(e);
							}, t);
						}),
						Promise.resolve()),
					W =
						((p.displayAllocatedObjects = function () {
							if (0 != a.length) for (var e = 0; e < a.length; e++);
							return a.length;
						}),
						(p.getAllocatedObjectsCount = function () {
							return a.length;
						}),
						(p.startDeallocateStack = function () {
							return (
								(u += 1), d.push(a.length), h.push(s.length), Promise.resolve()
							);
						}),
						(p.endDeallocateStack = function () {
							if (0 === u) return Promise.resolve();
							var e = d.pop(),
								t = h.pop(),
								n = [],
								i = [],
								r = 0;
							if (void 0 !== t && 0 !== s.length && s.length !== t)
								for (; s.length > t; ) {
									var o = s.pop();
									(o = (o = p.sendWithPromise(o.name + '.' + o.unlocktype, {
										doc: o.id,
									})).catch(function (e) {})),
										n.push(o),
										r++;
								}
							if (void (t = 0) !== e && 0 !== a.length && a.length !== e)
								for (; a.length > e; )
									(r = a.pop()),
										(r = (r = p.sendWithPromise(r.name + '.destroy', {
											auto_dealloc_obj: r.id,
										})).catch(function (e) {})),
										i.push(r),
										t++;
							return (
								--u,
								Promise.all(n).then(function () {
									return Promise.all(i);
								})
							);
						}),
						(p.getStackCount = function () {
							return Promise.resolve(u);
						}),
						(p.deallocateAllObjects = function () {
							var e;
							if (0 == a.length)
								return (e = createPromiseCapability()).resolve(), e.promise;
							for (e = [], d = []; s.length; )
								(objToUnlock = s.pop()),
									(unlockPromise = (unlockPromise = p.sendWithPromise(
										objToUnlock.name + '.' + objToUnlock.unlocktype,
										{ doc: objToUnlock.id }
									)).catch(function (e) {})),
									e.push(unlockPromise);
							for (; a.length; ) {
								var t = a.pop();
								(t = (t = p.sendWithPromise(t.name + '.destroy', {
									auto_dealloc_obj: t.id,
								})).catch(function (e) {})),
									e.push(t);
							}
							return Promise.all(e);
						}),
						(p.Redactor.redact = function (e, t, n, i, r) {
							if (
								(void 0 === (n = void 0 === n ? {} : n).redaction_overlay &&
									(n.redaction_overlay = !0),
								void 0 === n.positive_overlay_color
									? (n.positive_overlay_color = void 0)
									: void 0 !== n.positive_overlay_color.id &&
									  (n.positive_overlay_color = n.positive_overlay_color.id),
								void 0 === n.negative_overlay_color
									? (n.negative_overlay_color = void 0)
									: void 0 !== n.negative_overlay_color.id &&
									  (n.negative_overlay_color = n.negative_overlay_color.id),
								void 0 === n.border && (n.border = !0),
								void 0 === n.use_overlay_text && (n.use_overlay_text = !0),
								void 0 === n.font
									? (n.font = void 0)
									: void 0 !== n.font.id && (n.font = n.font.id),
								void 0 === n.min_font_size && (n.min_font_size = 2),
								void 0 === n.max_font_size && (n.max_font_size = 24),
								void 0 === n.text_color
									? (n.text_color = void 0)
									: void 0 !== n.text_color.id &&
									  (n.text_color = n.text_color.id),
								void 0 === n.horiz_text_alignment &&
									(n.horiz_text_alignment = -1),
								void 0 === n.vert_text_alignment && (n.vert_text_alignment = 1),
								void 0 === n.show_redacted_content_regions &&
									(n.show_redacted_content_regions = !1),
								void 0 === n.redacted_content_color
									? (n.redacted_content_color = void 0)
									: void 0 !== n.redacted_content_color.id &&
									  (n.redacted_content_color = n.redacted_content_color.id),
								void 0 === i && (i = !0),
								void 0 === r && (r = !0),
								arguments.length < 2 || 5 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'redact'. Expected 2 to 5 arguments. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument of function 'redact'. Promises require a 'yield' statement before being accessed."
								);
							if (
								!(
									e instanceof p.PDFDoc ||
									e instanceof p.SDFDoc ||
									e instanceof p.FDFDoc
								)
							) {
								if ('object' == c(e))
									throw new TypeError(
										"1st input argument in function 'redact' is of type '" +
											e.name +
											"'. Expected type 'PDFDoc'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)."
									);
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'redact' is of type '" +
										c(e) +
										"'. Expected type 'PDFDoc'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)."
								);
							}
							if (t instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 2nd input argument in function 'redact'. Promises require a 'yield' statement before being accessed."
								);
							if (!(t instanceof Array)) {
								if ('object' == c(t))
									throw new TypeError(
										"2nd input argument in function 'redact' is of type '" +
											t.name +
											"'. Expected an array of 'Redaction' objects. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean)."
									);
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'redact' is of type '" +
										c(t) +
										"'. Expected type 'Redaction'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean)."
								);
							}
							if (n instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 3rd input argument in function 'redact'. Promises require a 'yield' statement before being accessed."
								);
							if ('object' !== c(n))
								throw new TypeError(
									"3nd input argument in function 'redact' is of type '" +
										n.name +
										"'. Expected a javascript object. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean, boolean)."
								);
							if (i instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 4th input argument in function 'redact'. Promises require a 'yield' statement before being accessed."
								);
							if ('boolean' != typeof i)
								throw new TypeError(
									"4th input argument '" +
										i +
										"' in function 'redact' is of type '" +
										c(i) +
										"'. Expected type 'boolean'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)."
								);
							if (r instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 5th input argument in function 'redact'. Promises require a 'yield' statement before being accessed."
								);
							if ('boolean' != typeof r)
								throw new TypeError(
									"5th input argument '" +
										r +
										"' in function 'redact' is of type '" +
										c(r) +
										"'. Expected type 'boolean'. Function Signature: redact(PDFDoc, Array of Redaction Objects, Object, boolean=true, boolean=true)."
								);
							return p.sendWithPromise('redactorRedact', {
								doc: e.id,
								red_arr: t,
								appearance: n,
								ext_neg_mode: i,
								page_coord_sys: r,
							});
						}),
						(p.Highlights.prototype.getCurrentQuads = function () {
							return p
								.sendWithPromise('Highlights.getCurrentQuads', {
									hlts: this.id,
								})
								.then(function (e) {
									e = new Float64Array(e);
									for (var t, n = [], i = 0; i < e.length; i += 8)
										(t = p.QuadPoint(
											e[i + 0],
											e[i + 1],
											e[i + 2],
											e[i + 3],
											e[i + 4],
											e[i + 5],
											e[i + 6],
											e[i + 7]
										)),
											n.push(t);
									return n;
								});
						}),
						(p.TextSearch.prototype.run = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'run'. Expected 0 arguments. Function Signature: run()"
								);
							return p
								.sendWithPromise('TextSearch.run', { ts: this.id })
								.then(function (e) {
									return (
										(e.highlights = new p.Highlights(e.highlights)),
										'0' != e.highlights.id &&
											a.push({ name: e.highlights.name, id: e.highlights.id }),
										e
									);
								});
						}),
						(p.Iterator.prototype.current = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'fillEncryptDict'. Expected 0 argument."
								);
							var t = this,
								e =
									((this.yieldFunction = 'Iterator.current'),
									p.sendWithPromise('Iterator.current', {
										itr: this.id,
										type: this.type,
									}));
							return (
								(t.yieldFunction = void 0),
								(e =
									'Int' != this.type
										? e.then(function (e) {
												return new p[t.type](e);
										  })
										: e)
							);
						}),
						(p.PDFDoc.prototype.getFileData = function (e) {
							e({ type: 'id', id: this.id });
						}),
						(p.PDFDoc.prototype.getFile = function (e) {
							return null;
						}),
						(p.PDFDoc.createFromURL = function (e, t) {
							if (arguments.length < 1 || 2 < arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'createFromURL'. Expected 1 to 2 arguments. Function Signature: createFromURL(string, Obj)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'createFromURL' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: createFromURL(string)."
								);
							return m(e, t).then(function (e) {
								return p.PDFDoc.createFromBuffer(e);
							});
						}),
						(p.PDFDraw.prototype.exportBuffer = function (e, t, n) {
							if (
								(void 0 === t && (t = 'PNG'),
								void 0 === n && (n = new p.Obj('0')),
								arguments.length < 1 || 3 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'exportBuffer'. Expected 1 to 3 arguments. Function Signature: exportBuffer(Page, string, Obj)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed."
								);
							if (!(e instanceof p.Page)) {
								if ('object' == c(e))
									throw new TypeError(
										"1st input argument in function 'exportBuffer' is of type '" +
											e.name +
											"'. Expected type 'Page'. Function Signature: exportBuffer(Page, string, Obj)."
									);
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'exportBuffer' is of type '" +
										c(e) +
										"'. Expected type 'Page'. Function Signature: exportBuffer(Page, string, Obj)."
								);
							}
							if (t instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'exportBuffer' is of type '" +
										c(t) +
										"'. Expected type 'string'. Function Signature: exportBuffer(Page, string, Obj)."
								);
							if (n instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'exportBuffer'. Promises require a 'yield' statement before being accessed."
								);
							if (n instanceof p.Obj)
								return p
									.sendWithPromise('PDFDraw.exportBuffer', {
										d: this.id,
										page: e.id,
										format: t,
										encoder_params: n.id,
									})
									.then(function (e) {
										return '0' == e ? null : new Uint8Array(e);
									});
							if ('object' == c(n))
								throw new TypeError(
									"3rd input argument in function 'exportBuffer' is of type '" +
										n.name +
										"'. Expected type 'Obj'. Function Signature: exportBuffer(Page, string, Obj)."
								);
							throw new TypeError(
								"3rd input argument '" +
									n +
									"' in function 'exportBuffer' is of type '" +
									c(n) +
									"'. Expected type 'Obj'. Function Signature: exportBuffer(Page, string, Obj)."
							);
						}),
						(p.PDFDraw.prototype.exportStream =
							p.PDFDraw.prototype.exportBuffer),
						(p.Element.prototype.getTextData = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getTextData'. Expected 0 arguments. Function Signature: getTextData()"
								);
							return p.sendWithPromise('Element.getTextData', { e: this.id });
						}),
						(p.Element.prototype.getPathData = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getPathData'. Expected 0 arguments. Function Signature: getPathData()"
								);
							return p
								.sendWithPromise('Element.getPathData', { e: this.id })
								.then(function (e) {
									return (
										(e.operators = new Uint8Array(e.operators)),
										(e.points = new Float64Array(e.points)),
										e
									);
								});
						}),
						(p.PDFDoc.prototype.convertToXod = function (e) {
							return p
								.sendWithPromise('PDFDoc.convertToXod', {
									doc: this.id,
									optionsObject: (e = void 0 === e ? {} : e),
								})
								.then(function (e) {
									return '0' == e ? null : new Uint8Array(e);
								});
						}),
						(p.PDFDoc.prototype.convertToXodStream = function (e) {
							return p
								.sendWithPromise('PDFDoc.convertToXodStream', {
									doc: this.id,
									optionsObject: (e = void 0 === e ? {} : e),
								})
								.then(function (e) {
									return '0' == e ? null : new p.Filter(e);
								});
						}),
						(p.FilterReader.prototype.read = function (e) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'read'. Expected 1 argument. Function Signature: read(number)."
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'read'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'read' is of type '" +
										c(e) +
										"'. Expected type 'number'. Function Signature: read(number)."
								);
							return p
								.sendWithPromise('FilterReader.read', {
									reader: this.id,
									buf_size: e,
								})
								.then(function (e) {
									return '0' == e ? null : new Uint8Array(e);
								});
						}),
						(p.FilterReader.prototype.readAllIntoBuffer = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'readAllIntoBuffer'. Expected 0 arguments. Function Signature: readAllIntoBuffer()"
								);
							return p
								.sendWithPromise('FilterReader.readAllIntoBuffer', {
									reader: this.id,
								})
								.then(function (e) {
									return '0' == e ? null : new Uint8Array(e);
								});
						}),
						(p.bitmapInfo = function (e) {
							O(e, this);
						}),
						(p.PDFDraw.prototype.getBitmap = function (e, t, n) {
							if (3 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getBitmap'. Expected 3 arguments. Function Signature: getBitmap(Page, PixelFormat, boolean)."
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed."
								);
							if (!(e instanceof p.Page)) {
								if ('object' == c(e))
									throw new TypeError(
										"1st input argument in function 'getBitmap' is of type '" +
											e.name +
											"'. Expected type 'Page'. Function Signature: getBitmap(Page, PixelFormat, boolean)."
									);
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'getBitmap' is of type '" +
										c(e) +
										"'. Expected type 'Page'. Function Signature: getBitmap(Page, PixelFormat, boolean)."
								);
							}
							if (t instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'getBitmap' is of type '" +
										c(t) +
										"'. Expected type 'number'. Function Signature: getBitmap(Page, PixelFormat, boolean)."
								);
							if (n instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'getBitmap'. Promises require a 'yield' statement before being accessed."
								);
							if ('boolean' != typeof n)
								throw new TypeError(
									"3rd input argument '" +
										n +
										"' in function 'getBitmap' is of type '" +
										c(n) +
										"'. Expected type 'boolean'. Function Signature: getBitmap(Page, PixelFormat, boolean)."
								);
							return p
								.sendWithPromise('PDFDraw.getBitmap', {
									d: this.id,
									page: e.id,
									pix_fmt: t,
									demult: n,
								})
								.then(function (e) {
									return '0' == e ? null : new p.bitmapInfo(e);
								});
						}),
						(p.Matrix2D.create = function (e, t, n, i, r, o) {
							if (
								(null == e && (e = 0),
								null == t && (t = 0),
								null == n && (n = 0),
								null == i && (i = 0),
								null == r && (r = 0),
								null == o && (o = 0),
								6 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'Matrix2D.create'. Expected 6 or fewer arguments. Function Signature: create(number, number, number, number, number, number)."
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'Matrix2D.create' is of type '" +
										c(e) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							if (t instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 2nd input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'Matrix2D.create' is of type '" +
										c(t) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							if (n instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 3rd input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof n)
								throw new TypeError(
									"3rd input argument '" +
										n +
										"' in function 'Matrix2D.create' is of type '" +
										c(n) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							if (i instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 4th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof i)
								throw new TypeError(
									"4th input argument '" +
										i +
										"' in function 'Matrix2D.create' is of type '" +
										c(i) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							if (r instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 5th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof r)
								throw new TypeError(
									"5th input argument '" +
										r +
										"' in function 'Matrix2D.create' is of type '" +
										c(r) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							if (o instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 6th input argument 'Matrix2D.create'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof o)
								throw new TypeError(
									"6th input argument '" +
										o +
										"' in function 'Matrix2D.create' is of type '" +
										c(o) +
										"'. Expected type 'number'. Function Signature: create(number, number, number, number, number, number)."
								);
							var s = createPromiseCapability(),
								u = new p.Matrix2D({
									m_a: e,
									m_b: t,
									m_c: n,
									m_d: i,
									m_h: r,
									m_v: o,
								});
							return s.resolve(u), s.promise;
						}),
						(p.PDFDoc.prototype.getPDFDoc = function () {
							return p
								.sendWithPromise('GetPDFDoc', { doc: this.id })
								.then(function (e) {
									return '0' == e ? null : new p.PDFDoc(e);
								});
						}),
						(p.TextExtractorLine.prototype.getBBox = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getBBox'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorLine.getBBox'),
								p
									.sendWithPromise('TextExtractorLine.getBBox', { line: this })
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											new p.Rect(
												e.result.x1,
												e.result.y1,
												e.result.x2,
												e.result.y2,
												e.result.mp_rect
											)
										);
									})
							);
						}),
						(p.TextExtractorLine.prototype.getQuad = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getQuad'. Expected 0 arguments. Function Signature: getQuad()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getQuad'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorLine.getQuad'),
								p
									.sendWithPromise('TextExtractorLine.getQuad', { line: this })
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											new p.QuadPoint(
												e.result.p1x,
												e.result.p1y,
												e.result.p2x,
												e.result.p2y,
												e.result.p3x,
												e.result.p3y,
												e.result.p4x,
												e.result.p4y
											)
										);
									})
							);
						}),
						(p.TextExtractorWord.prototype.getBBox = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getBBox'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorWord.getBBox'),
								p
									.sendWithPromise('TextExtractorWord.getBBox', { tew: this })
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											new p.Rect(
												e.result.x1,
												e.result.y1,
												e.result.x2,
												e.result.y2,
												e.result.mp_rect
											)
										);
									})
							);
						}),
						(p.TextExtractorWord.prototype.getQuad = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getQuad'. Expected 0 arguments. Function Signature: getQuad()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getQuad'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorWord.getQuad'),
								p
									.sendWithPromise('TextExtractorWord.getQuad', { tew: this })
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											new p.QuadPoint(
												e.result.p1x,
												e.result.p1y,
												e.result.p2x,
												e.result.p2y,
												e.result.p3x,
												e.result.p3y,
												e.result.p4x,
												e.result.p4y
											)
										);
									})
							);
						}),
						(p.TextExtractorWord.prototype.getGlyphQuad = function (e) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getGlyphQuad'. Expected 1 argument. Function Signature: getGlyphQuad(number)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'getGlyphQuad'. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'getGlyphQuad' is of type '" +
										c(e) +
										"'. Expected type 'number'. Function Signature: getGlyphQuad(number)."
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getGlyphQuad'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorWord.getGlyphQuad'),
								p
									.sendWithPromise('TextExtractorWord.getGlyphQuad', {
										tew: this,
										glyph_idx: e,
									})
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											new p.QuadPoint(
												e.result.p1x,
												e.result.p1y,
												e.result.p2x,
												e.result.p2y,
												e.result.p3x,
												e.result.p3y,
												e.result.p4x,
												e.result.p4y
											)
										);
									})
							);
						}),
						(p.TextExtractorStyle.prototype.getColor = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getColor'. Expected 0 arguments. Function Signature: getColor()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getColor'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorStyle.getColor'),
								p
									.sendWithPromise('TextExtractorStyle.getColor', { tes: this })
									.then(function (e) {
										return (
											(t.yieldFunction = void 0),
											'0' == e ? null : new p.ColorPt(e)
										);
									})
							);
						}),
						(p.TextExtractorWord.prototype.getString = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getString'. Expected 0 arguments. Function Signature: getString()"
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'getString'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							var t = this;
							return (
								(this.yieldFunction = 'TextExtractorWord.getString'),
								p
									.sendWithPromise('TextExtractorWord.getString', { tew: this })
									.then(function (e) {
										return (t.yieldFunction = void 0), e;
									})
							);
						}),
						(p.TextExtractor.prototype.getHighlights = function (e) {
							return (
								f(arguments.length, 1, 'getHighlights', '(Array<object>)', [
									[e, 'Array'],
								]),
								p
									.sendWithPromise('TextExtractor.getHighlights', {
										te: this.id,
										char_ranges: e,
									})
									.then(function (e) {
										return '0' == e ? null : new p.Highlights(e);
									})
							);
						}),
						(p.SecurityHandler.prototype.changeUserPasswordNonAscii = function (
							e
						) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'changeUserPasswordNonAscii'. Expected 1 argument. Function Signature: changeUserPasswordNonAscii(string)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'changeUserPasswordNonAscii'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'changeUserPasswordNonAscii' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: changeUserPasswordNonAscii(string)."
								);
							return p.sendWithPromise(
								'SecurityHandler.changeUserPasswordNonAscii',
								{ sh: this.id, password: e, pwd_length: e.length }
							);
						}),
						(p.SecurityHandler.prototype.changeMasterPasswordNonAscii =
							function (e) {
								if (1 != arguments.length)
									throw new RangeError(
										arguments.length +
											" arguments passed into function 'changeMasterPasswordNonAscii'. Expected 1 argument. Function Signature: changeMasterPasswordNonAscii(string)"
									);
								if (e instanceof Promise)
									throw new TypeError(
										"Received a Promise object in 1st input argument 'changeMasterPasswordNonAscii'. Promises require a 'yield' statement before being accessed."
									);
								if ('string' != typeof e)
									throw new TypeError(
										"1st input argument '" +
											e +
											"' in function 'changeMasterPasswordNonAscii' is of type '" +
											c(e) +
											"'. Expected type 'string'. Function Signature: changeMasterPasswordNonAscii(string)."
									);
								return p.sendWithPromise(
									'SecurityHandler.changeMasterPasswordNonAscii',
									{ sh: this.id, password: e, pwd_length: e.length }
								);
							}),
						(p.SecurityHandler.prototype.initPassword = function (e) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'initPassword'. Expected 1 argument. Function Signature: initPassword(string)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'initPassword'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'initPassword' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: initPassword(string)."
								);
							return p.sendWithPromise('SecurityHandler.initPassword', {
								sh: this.id,
								password: e,
							});
						}),
						(p.SecurityHandler.prototype.initPasswordNonAscii = function (e) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'initPasswordNonAscii'. Expected 1 argument. Function Signature: initPasswordNonAscii(string)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'initPasswordNonAscii'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'initPasswordNonAscii' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: initPasswordNonAscii(string)."
								);
							return p.sendWithPromise('SecurityHandler.initPasswordNonAscii', {
								sh: this.id,
								password: e,
								pwd_length: e.length,
							});
						}),
						(p.Element.prototype.getBBox = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getBBox'. Expected 0 arguments. Function Signature: getBBox()"
								);
							var t = this;
							return (
								(this.yieldFunction = 'Element.getBBox'),
								p
									.sendWithPromise('Element.getBBox', { e: this.id })
									.then(function (e) {
										return (t.yieldFunction = void 0), new p.Rect(e);
									})
							);
						}),
						(p.Matrix2D.prototype.mult = function (e, t) {
							if (2 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'mult'. Expected 2 arguments. Function Signature: mult(number, number)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"1st input argument in function 'mult' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'mult' is of type '" +
										c(e) +
										"'. Expected type 'number'. Function Signature: mult(number, number)."
								);
							if (t instanceof Promise)
								throw new TypeError(
									"2nd input argument in function 'mult' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'mult' is of type '" +
										c(t) +
										"'. Expected type 'number'. Function Signature: mult(number, number)."
								);
							if (void 0 !== this.yieldFunction)
								throw Error(
									'Function ' +
										this.yieldFunction +
										" recently altered a struct object without yielding. That object is now being accessed by function 'mult'. Perhaps a yield statement is required for " +
										this.yieldFunction +
										'?'
								);
							return p.sendWithPromise('Matrix2D.mult', {
								matrix: this,
								x: e,
								y: t,
							});
						}),
						(p.Obj.prototype.getAsPDFText = function () {
							if (0 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'getAsPDFText'. Expected 0 arguments. Function Signature: getAsPDFText()"
								);
							return p.sendWithPromise('Obj.getAsPDFText', { o: this.id });
						}),
						(p.PDFDoc.prototype.initSecurityHandler = function (e) {
							if ((void 0 === e && (e = 0), 1 < arguments.length))
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'initSecurityHandler'. Expected at most 1 arguments. Function Signature: initSecurityHandler(void*)"
								);
							return p.sendWithPromise('PDFDoc.initSecurityHandler', {
								doc: this.id,
								custom_data: e,
							});
						}),
						(p.PDFDoc.prototype.initStdSecurityHandler =
							p.PDFDoc.prototype.initStdSecurityHandlerUString),
						(p.SDFDoc.prototype.initSecurityHandler = function (e) {
							if ((void 0 === e && (e = 0), 1 < arguments.length))
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'initSecurityHandler'. Expected at most 1 arguments. Function Signature: initSecurityHandler(void*)"
								);
							return p.sendWithPromise('SDFDoc.initSecurityHandler', {
								doc: this.id,
								custom_data: e,
							});
						}),
						(p.SDFDoc.prototype.initStdSecurityHandler =
							p.SDFDoc.prototype.initStdSecurityHandlerUString),
						(p.Image.createFromURL = function (t, e, n, i) {
							if (
								(void 0 === n && (n = new p.Obj('0')),
								arguments.length < 2 || 4 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'createFromURL'. Expected 2 to 4 arguments. Function Signature: createFromURL(PDFDoc, string, Obj)"
								);
							if (t instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed."
								);
							if (
								!(
									t instanceof p.PDFDoc ||
									t instanceof p.SDFDoc ||
									t instanceof p.FDFDoc
								)
							) {
								if ('object' == c(t))
									throw new TypeError(
										"1st input argument in function 'createFromURL' is of type '" +
											t.name +
											"'. Expected type 'Page'. Function Signature: createFromURL(PDFDoc, string, Obj)."
									);
								throw new TypeError(
									"1st input argument '" +
										t +
										"' in function 'createFromURL' is of type '" +
										c(t) +
										"'. Expected type 'Page'. Function Signature: createFromURL(PDFDoc, string, Obj)."
								);
							}
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"2nd input argument '" +
										e +
										"' in function 'createFromURL' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: createFromURL(PDFDoc, string, Obj)."
								);
							if (n instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed."
								);
							if (n instanceof p.Obj)
								return m(e, i).then(function (e) {
									return p.Image.createFromMemory2(t, e, n);
								});
							if ('object' == c(n))
								throw new TypeError(
									"3rd input argument in function 'createFromURL' is of type '" +
										n.name +
										"'. Expected type 'Obj'. Function Signature: createFromURL(PDFDoc, string, Obj)."
								);
							throw new TypeError(
								"3rd input argument '" +
									n +
									"' in function 'createFromURL' is of type '" +
									c(n) +
									"'. Expected type 'Obj'. Function Signature: createFromURL(PDFDoc, string, Obj)."
							);
						}),
						(p.PDFDoc.prototype.addStdSignatureHandlerFromURL = function (
							e,
							t
						) {
							if (2 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'addStdSignatureHandlerFromURL'. Expected 2 arguments. Function Signature: addStdSignatureHandlerFromURL(string, string)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"1st input argument in function 'addStdSignatureHandlerFromURL' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'addStdSignatureHandlerFromURL' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromURL(string, string)."
								);
							if (t instanceof Promise)
								throw new TypeError(
									"2nd input argument in function 'addStdSignatureHandlerFromURL' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'addStdSignatureHandlerFromURL' is of type '" +
										c(t) +
										"'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromURL(string, string)."
								);
							var n = this;
							return m(e).then(function (e) {
								return n.addStdSignatureHandlerFromBufferWithDoc(e, t, n);
							});
						}),
						(p.PDFDoc.prototype.addStdSignatureHandlerFromBufferWithDoc =
							function (e, t, n) {
								if (3 != arguments.length)
									throw new RangeError(
										arguments.length +
											" arguments passed into function 'addStdSignatureHandlerFromBuffer'. Expected 3 arguments. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc)"
									);
								if (n instanceof Promise)
									throw new TypeError(
										"1st input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
									);
								if (e instanceof Promise)
									throw new TypeError(
										"2nd input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
									);
								if (!l.isArrayBuffer(e.buffer)) {
									if ('object' == c(e))
										throw new TypeError(
											"2nd input argument in function 'addStdSignatureHandlerFromBuffer' is of type '" +
												e.name +
												"'. Expected type 'ArrayBuffer'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc)."
										);
									throw new TypeError(
										"2nd input argument '" +
											e +
											"' in function 'addStdSignatureHandlerFromBuffer' is of type '" +
											c(e) +
											"'. Expected type 'ArrayBuffer'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc)."
									);
								}
								if (t instanceof Promise)
									throw new TypeError(
										"3rd input argument in function 'addStdSignatureHandlerFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
									);
								if ('string' != typeof t)
									throw new TypeError(
										"3rd input argument '" +
											t +
											"' in function 'addStdSignatureHandlerFromBuffer' is of type '" +
											c(t) +
											"'. Expected type 'string'. Function Signature: addStdSignatureHandlerFromBuffer(ArrayBuffer, string, PDFDoc)."
									);
								return p.sendWithPromise(
									'PDFDoc.addStdSignatureHandlerFromBuffer',
									{ doc: n.id, pkcs12_buffer: e.buffer, pkcs12_pass: t }
								);
							}),
						(p.Filter.createFromMemory = function (e) {
							return (
								l.isArrayBuffer(e) || (e = e.buffer),
								p
									.sendWithPromise('filterCreateFromMemory', { buf: e })
									.then(function (e) {
										return '0' == e
											? null
											: ((e = new p.Filter(e)),
											  a.push({ name: e.name, id: e.id }),
											  e);
									})
							);
						}),
						(p.Filter.createURLFilter = function (e, t) {
							if (arguments.length < 1 || 2 < arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'createURLFilter'. Expected 1 to 2 arguments. Function Signature: createURLFilter(string, Obj)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"Received a Promise object in 1st input argument 'createURLFilter'. Promises require a 'yield' statement before being accessed."
								);
							if ('string' != typeof e)
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'createURLFilter' is of type '" +
										c(e) +
										"'. Expected type 'string'. Function Signature: createURLFilter(string, Obj)."
								);
							return m(e, t).then(function (e) {
								return p.Filter.createFromMemory(e);
							});
						}),
						(p.Filter.createFlateEncode = function (e, t, n) {
							if (
								(void 0 === e && (e = new p.Filter('0')),
								void 0 === t && (t = -1),
								void 0 === n && (n = 256),
								3 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'createFlateEncode'. Expected at most 3 arguments. Function Signature: createFlateEncode(Filter, number, number)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"1st input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if (!(e instanceof p.Filter)) {
								if ('object' == c(e))
									throw new TypeError(
										"1st input argument in function 'createFlateEncode' is of type '" +
											e.name +
											"'. Expected type 'Filter'. Function Signature: createFlateEncode(Filter, number, number)."
									);
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'createFlateEncode' is of type '" +
										c(e) +
										"'. Expected type 'Filter'. Function Signature: createFlateEncode(Filter, number, number)."
								);
							}
							if (t instanceof Promise)
								throw new TypeError(
									"2nd input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof t)
								throw new TypeError(
									"2nd input argument '" +
										t +
										"' in function 'createFlateEncode' is of type '" +
										c(t) +
										"'. Expected type 'number'. Function Signature: createFlateEncode(Filter, number, number)."
								);
							if (n instanceof Promise)
								throw new TypeError(
									"3rd input argument in function 'createFlateEncode' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('number' != typeof n)
								throw new TypeError(
									"3rd input argument '" +
										n +
										"' in function 'createFlateEncode' is of type '" +
										c(n) +
										"'. Expected type 'number'. Function Signature: createFlateEncode(Filter, number, number)."
								);
							return p
								.sendWithPromise('Filter.createFlateEncode', {
									input_filter: e.id,
									compression_level: t,
									buf_sz: n,
								})
								.then(function (e) {
									return '0' == e
										? null
										: ((e = new p.Filter(e)),
										  a.push({ name: e.name, id: e.id }),
										  e);
								});
						}),
						(p.PDFDoc.prototype.importPages = function (e, t) {
							if (
								(void 0 === t && (t = !1),
								arguments.length < 1 || 2 < arguments.length)
							)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'importPages'. Expected 1 to 2 arguments. Function Signature: importPages(Array, boolean)"
								);
							if (e instanceof Promise)
								throw new TypeError(
									"1st input argument in function 'importPages' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if (!(e instanceof Array)) {
								if ('object' == c(e))
									throw new TypeError(
										"1st input argument in function 'importPages' is of type '" +
											e.name +
											"'. Expected type 'Array'. Function Signature: importPages(Array, boolean)."
									);
								throw new TypeError(
									"1st input argument '" +
										e +
										"' in function 'importPages' is of type '" +
										c(e) +
										"'. Expected type 'Array'. Function Signature: importPages(Array, boolean)."
								);
							}
							if (t instanceof Promise)
								throw new TypeError(
									"3rd input argument in function 'importPages' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('boolean' != typeof t)
								throw new TypeError(
									"3rd input argument '" +
										t +
										"' in function 'importPages' is of type '" +
										c(t) +
										"'. Expected type 'boolean'. Function Signature: importPages(Array, boolean)."
								);
							return (
								(e = e.map(function (e) {
									return e.id;
								})),
								p
									.sendWithPromise('PDFDoc.importPages', {
										doc: this.id,
										page_arr: e,
										import_bookmarks: t,
									})
									.then(function (e) {
										return e
											? e.map(function (e) {
													return new p.Page(e);
											  })
											: null;
									})
							);
						}),
						(p.SDFDoc.prototype.applyCustomQuery = function (e) {
							if (1 != arguments.length)
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'applyCustomQuery'. Expected only 1"
								);
							if ('object' != c(e))
								throw new TypeError(
									"input argument '" +
										e +
										"' in function 'applyCustomQuery' must be an object"
								);
							return p
								.sendWithPromise('SDFDoc.applyCustomQuery', {
									doc: this.id,
									query: JSON.stringify(e),
								})
								.then(function (e) {
									return JSON.parse(e);
								});
						}),
						p.PDFDoc.prototype.saveMemoryBuffer),
					C = p.PDFDoc.prototype.saveStream;
				(p.PDFDoc.prototype.saveMemoryBuffer = function (e) {
					var t = this;
					return Promise.resolve(t.documentCompletePromise).then(function () {
						return W.call(t, e);
					});
				}),
					(p.PDFDoc.prototype.saveStream = function (e) {
						var t = this;
						return Promise.resolve(t.documentCompletePromise).then(function () {
							return C.call(t, e);
						});
					}),
					(p.PDFACompliance.createFromUrl = function (t, e, n, i, r, o, s) {
						if (arguments.length < 2 || 7 < arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'createFromUrl'. Expected 7 arguments. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop)"
							);
						if (
							(void 0 === n && (n = ''),
							void 0 === i && (i = p.PDFACompliance.Conformance.e_Level1B),
							void 0 === r && (r = new Int32Array(0)),
							void 0 === o && (o = 10),
							void 0 === s && (s = !1),
							t instanceof Promise)
						)
							throw new TypeError(
								"1st input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('boolean' != typeof t)
							throw new TypeError(
								"1st input argument '" +
									t +
									"' in function 'createFromUrl' is of type '" +
									c(t) +
									"'. Expected type 'number'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (e instanceof Promise)
							throw new TypeError(
								"Received a Promise object in 1st input argument 'createFromURL'. Promises require a 'yield' statement before being accessed."
							);
						if ('string' != typeof e)
							throw new TypeError(
								"2nd input argument '" +
									e +
									"' in function 'createFromURL' is of type '" +
									c(e) +
									"'. Expected type 'string'. Function Signature: createFromURL(PDFDoc, string, Obj)."
							);
						if (n instanceof Promise)
							throw new TypeError(
								"3rd input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('string' != typeof n)
							throw new TypeError(
								"3rd input argument '" +
									n +
									"' in function 'createFromUrl' is of type '" +
									c(n) +
									"'. Expected type 'string'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (i instanceof Promise)
							throw new TypeError(
								"4th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof i)
							throw new TypeError(
								"4th input argument '" +
									i +
									"' in function 'createFromUrl' is of type '" +
									c(i) +
									"'. Expected type 'number'. Function Signature: createFromUrl(convert, url, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (r instanceof Promise)
							throw new TypeError(
								"5th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if (o instanceof Promise)
							throw new TypeError(
								"6th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if (s instanceof Promise)
							throw new TypeError(
								"7th input argument in function 'createFromUrl' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						return m(e).then(function (e) {
							return p.PDFACompliance.createFromBuffer(t, e, n, i, r, o, s);
						});
					}),
					(p.PDFACompliance.createFromBuffer = function (e, t, n, i, r, o, s) {
						void 0 === n && (n = ''),
							void 0 === i && (i = p.PDFACompliance.Conformance.e_Level1B),
							void 0 === r && (r = new Int32Array(0)),
							void 0 === o && (o = 10),
							void 0 === s && (s = !1);
						var u = t;
						if (
							(l.isArrayBuffer(u) || (u = u.buffer),
							arguments.length < 2 || 7 < arguments.length)
						)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'createFromBuffer'. Expected 7 arguments. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)"
							);
						if (e instanceof Promise)
							throw new TypeError(
								"1st input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('boolean' != typeof e)
							throw new TypeError(
								"1st input argument '" +
									e +
									"' in function 'createFromBuffer' is of type '" +
									c(e) +
									"'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (t instanceof Promise)
							throw new TypeError(
								"2nd input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if (!l.isArrayBuffer(u)) {
							if ('object' == c(t) && t.name)
								throw new TypeError(
									"2nd input argument in function 'createFromBuffer' is of type '" +
										t.name +
										"'. Expected ArrayBuffer|TypedArray. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
								);
							throw new TypeError(
								"2nd input argument '" +
									t +
									"' in function 'createFromBuffer' is of type '" +
									c(t) +
									"'. Expected ArrayBuffer|TypedArray. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						}
						if (n instanceof Promise)
							throw new TypeError(
								"3rd input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('string' != typeof n)
							throw new TypeError(
								"3rd input argument '" +
									n +
									"' in function 'createFromBuffer' is of type '" +
									c(n) +
									"'. Expected type 'string'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (i instanceof Promise)
							throw new TypeError(
								"4th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof i)
							throw new TypeError(
								"4th input argument '" +
									i +
									"' in function 'createFromBuffer' is of type '" +
									c(i) +
									"'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (r instanceof Promise)
							throw new TypeError(
								"5th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if (!l.isArrayBuffer(r.buffer)) {
							if ('object' == c(r))
								throw new TypeError(
									"5th input argument in function 'createFromBuffer' is of type '" +
										r.name +
										"'. Expected typed array. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
								);
							throw new TypeError(
								"5th input argument '" +
									r +
									"' in function 'createFromBuffer' is of type '" +
									c(r) +
									"'. Expected typed array. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						}
						if (o instanceof Promise)
							throw new TypeError(
								"6th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof o)
							throw new TypeError(
								"6th input argument '" +
									o +
									"' in function 'createFromBuffer' is of type '" +
									c(o) +
									"'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						if (s instanceof Promise)
							throw new TypeError(
								"7th input argument in function 'createFromBuffer' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('boolean' != typeof s)
							throw new TypeError(
								"7th input argument '" +
									s +
									"' in function 'createFromBuffer' is of type '" +
									c(s) +
									"'. Expected type 'number'. Function Signature: createFromBuffer(convert, buf, pwd, conform, excep, max_ref_objs, first_stop)."
							);
						return p
							.sendWithPromise('pdfaComplianceCreateFromBuffer', {
								convert: e,
								buf: u,
								password: n,
								conform: i,
								excep: r.buffer,
								max_ref_objs: o,
								first_stop: s,
							})
							.then(function (e) {
								return (
									(e = new p.PDFACompliance(e)),
									a.push({ name: e.name, id: e.id }),
									e
								);
							});
					}),
					(p.PDFDoc.prototype.lock = function () {
						if (0 != arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'lock'. Expected 0 arguments. Function Signature: lock()"
							);
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlock' }),
							p.sendWithPromise('PDFDoc.lock', { doc: this.id })
						);
					}),
					(p.PDFDoc.prototype.lockRead = function () {
						if (0 != arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'lockRead'. Expected 0 arguments. Function Signature: lockRead()"
							);
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlockRead' }),
							p.sendWithPromise('PDFDoc.lockRead', { doc: this.id })
						);
					}),
					(p.PDFDoc.prototype.tryLock = function () {
						if (0 != arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'tryLock'. Expected 0 arguments. Function Signature: tryLock()"
							);
						var t = s.length;
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlock' }),
							p
								.sendWithPromise('PDFDoc.tryLock', { doc: this.id })
								.then(function (e) {
									e || s.splice(t, 1);
								})
						);
					}),
					(p.PDFDoc.prototype.timedLock = function (e) {
						if (1 < arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'timedLock'. Expected at most 1 arguments. Function Signature: timedLock(number)"
							);
						if (e instanceof Promise)
							throw new TypeError(
								"1st input argument in function 'timedLock' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof e)
							throw new TypeError(
								"1st input argument '" +
									e +
									"' in function 'timedLock' is of type '" +
									c(e) +
									"'. Expected type 'number'. Function Signature: timedLock(number)."
							);
						var t = s.length;
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlock' }),
							p
								.sendWithPromise('PDFDoc.timedLock', {
									doc: this.id,
									milliseconds: e,
								})
								.then(function (e) {
									e || s.splice(t, 1);
								})
						);
					}),
					(p.PDFDoc.prototype.tryLockRead = function () {
						if (0 != arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'tryLockRead'. Expected 0 arguments. Function Signature: tryLockRead()"
							);
						var t = s.length;
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlockRead' }),
							p
								.sendWithPromise('PDFDoc.tryLockRead', { doc: this.id })
								.then(function (e) {
									e || s.splice(t, 1);
								})
						);
					}),
					(p.PDFDoc.prototype.timedLockRead = function (e) {
						if (1 < arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'timedLockRead'. Expected at most 1 arguments. Function Signature: timedLockRead(number)"
							);
						if (e instanceof Promise)
							throw new TypeError(
								"1st input argument in function 'timedLockRead' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof e)
							throw new TypeError(
								"1st input argument '" +
									e +
									"' in function 'timedLockRead' is of type '" +
									c(e) +
									"'. Expected type 'number'. Function Signature: timedLockRead(number)."
							);
						var t = s.length;
						return (
							s.push({ name: 'PDFDoc', id: this.id, unlocktype: 'unlockRead' }),
							p
								.sendWithPromise('PDFDoc.timedLockRead', {
									doc: this.id,
									milliseconds: e,
								})
								.then(function (e) {
									e || s.splice(t, 1);
								})
						);
					}),
					(p.hasFullApi = !0),
					(p.Optimizer.optimize = function (e, t) {
						if (arguments.length < 1 || 2 < arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'Optimizer.optimize'. Expected 1 to 2 arguments. Function Signature: optimize(PDFDoc, OptimizerSettings)"
							);
						if (e instanceof Promise)
							throw new TypeError(
								"1st input argument in function 'optimize' is a Promise object. Promises require a 'yield' statement before being accessed."
							);
						if (
							!(
								e instanceof p.PDFDoc ||
								e instanceof p.SDFDoc ||
								e instanceof p.FDFDoc
							)
						) {
							if ('object' == c(e))
								throw new TypeError(
									"1st input argument in function 'optimize' is of type '" +
										e.name +
										"'. Expected type 'PDFDoc'. Function Signature: optimize(PDFDoc, OptimizerSettings)."
								);
							throw new TypeError(
								"1st input argument '" +
									e +
									"' in function 'optimize' is of type '" +
									c(e) +
									"'. Expected type 'PDFDoc'. Function Signature: optimize(PDFDoc, OptimizerSettings)."
							);
						}
						if (void 0 === t) t = new p.Optimizer.OptimizerSettings();
						else {
							if (t instanceof Promise)
								throw new TypeError(
									"2nd input argument in function 'optimize' is a Promise object. Promises require a 'yield' statement before being accessed."
								);
							if ('object' !== c(t))
								throw new TypeError(
									"2nd input argument in function 'optimize' is of type '" +
										t.name +
										"'. Expected type 'Object'. Function Signature: optimize(PDFDoc, OptimizerSettings)."
								);
						}
						return p.sendWithPromise('optimizerOptimize', {
							doc: e.id,
							color_image_settings: t.color_image_settings,
							grayscale_image_settings: t.grayscale_image_settings,
							mono_image_settings: t.mono_image_settings,
							text_settings: t.text_settings,
							remove_custom: t.remove_custom,
						});
					}),
					(p.VerificationOptions.prototype.addTrustedCertificateFromURL =
						function (e, t, n) {
							void 0 === t && (t = {}),
								void 0 === n &&
									(n =
										p.VerificationOptions.CertificateTrustFlag.e_default_trust),
								f(
									arguments.length,
									1,
									'addTrustedCertificateFromURL',
									'(string, object, number)',
									[
										[e, 'string'],
										[t, 'object'],
										[n, 'number'],
									]
								);
							var i = this;
							return m(e, t).then(function (e) {
								return i.addTrustedCertificate(e, n);
							});
						}),
					(p.DigitalSignatureField.prototype.certifyOnNextSaveFromURL =
						function (e, t, n) {
							void 0 === n && (n = {}),
								f(
									arguments.length,
									2,
									'certifyOnNextSaveFromURL',
									'(string, string, object)',
									[
										[e, 'string'],
										[t, 'string'],
										[n, 'object'],
									]
								);
							var i = this;
							return m(e, n).then(function (e) {
								return i.certifyOnNextSaveFromBuffer(e, t);
							});
						}),
					(p.DigitalSignatureField.prototype.signOnNextSaveFromURL = function (
						e,
						t,
						n
					) {
						void 0 === n && (n = {}),
							f(
								arguments.length,
								2,
								'signOnNextSaveFromURL',
								'(string, string, object)',
								[
									[e, 'string'],
									[t, 'string'],
									[n, 'object'],
								]
							);
						var i = this;
						return m(e, n).then(function (e) {
							return i.signOnNextSaveFromBuffer(e, t);
						});
					}),
					(p.PDFRasterizer.prototype.rasterize = function (
						e,
						t,
						n,
						i,
						r,
						o,
						s,
						u,
						a
					) {
						return (
							void 0 === u && (u = null),
							void 0 === a && (a = null),
							f(
								arguments.length,
								7,
								'rasterize',
								'(PDFNet.Page, number, number, number, number, boolean, PDFNet.Matrix2D, PDFNet.Rect, PDFNet.Rect)',
								[
									[e, 'Object', p.Page, 'Page'],
									[t, 'number'],
									[n, 'number'],
									[i, 'number'],
									[r, 'number'],
									[o, 'boolean'],
									[s, 'Structure', p.Matrix2D, 'Matrix2D'],
									[u, 'Structure', p.Rect, 'Rect'],
									[a, 'Structure', p.Rect, 'Rect'],
								]
							),
							F('rasterize', [
								[s, 6],
								[u, 7],
								[a, 8],
							]),
							p.sendWithPromise('PDFRasterizer.rasterize', {
								r: this.id,
								page: e.id,
								width: t,
								height: n,
								stride: i,
								num_comps: r,
								demult: o,
								device_mtx: s,
								clip: u,
								scrl_clp_regions: a,
							})
						);
					}),
					(p.ElementBuilder.prototype.createUnicodeTextRun = function (e) {
						return (
							f(arguments.length, 1, 'createUnicodeTextRun', '(string)', [
								[e, 'string'],
							]),
							p
								.sendWithPromise('ElementBuilder.createUnicodeTextRun', {
									b: this.id,
									text_data: e,
								})
								.then(function (e) {
									return D(p.Element, e);
								})
						);
					}),
					(p.DigitalSignatureField.prototype.getCertPathsFromCMS = function () {
						return (
							P('getCertPathsFromCMS', this.yieldFunction),
							p
								.sendWithPromise('DigitalSignatureField.getCertPathsFromCMS', {
									self: this,
								})
								.then(function (e) {
									for (var t = [], n = 0; n < e.length; ++n) {
										for (var i = e[n], r = [], o = 0; o < i.length; ++o) {
											var s = i[o];
											if ('0' === s) return null;
											(s = new p.X509Certificate(s)),
												r.push(s),
												a.push({ name: s.name, id: s.id });
										}
										t.push(r);
									}
									return t;
								})
						);
					}),
					(p.Convert.office2PDF = function (e, t) {
						return p.Convert.office2PDFBuffer(e, t).then(function (e) {
							p.PDFDoc.createFromBuffer(e).then(function (e) {
								return e.initSecurityHandler(), e;
							});
						});
					}),
					(p.PDFDoc.prototype.requirePage = function (e) {
						if (1 !== arguments.length)
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'requirePage'. Expected 1 argument. Function Signature: requirePage(number)"
							);
						if (e instanceof Promise)
							throw new TypeError(
								"Received a Promise object in 1st input argument 'requirePage'. Promises require a 'yield' statement before being accessed."
							);
						if ('number' != typeof e)
							throw new TypeError(
								"1st input argument '" +
									e +
									"' in function 'requirePage' is of type '" +
									c(e) +
									"'. Expected type 'number'. Function Signature: requirePage(number)."
							);
						if (e <= 0)
							throw Error(
								"1st input argument '" +
									e +
									"' in function 'requirePage' is invalid. Expected number between 1 and number of pages in the document."
							);
						return p.sendWithPromise('PDFDoc.RequirePage', {
							docId: this.id,
							pageNum: e,
						});
					}),
					(p.beginOperation = function (e) {
						if (
							(void 0 === e
								? (e = { allowMultipleInstances: !1 })
								: e.allowMultipleInstances,
							0 < n && !e.allowMultipleInstances)
						)
							throw Error(
								"a previous instance of PDFNet.beginOperation() has been called without being terminated by PDFNet.finishOperation(). If this is intentional, pass in an options object with its parameter 'allowMultipleInstances' set to 'true' (ex. optObj={}; optObj.allowMultipleInstances=true; PDFNet.beginOperation(optObj));"
							);
						if (((n += 1), 1 < arguments.length))
							throw new RangeError(
								arguments.length +
									" arguments passed into function 'beginOperation'. Expected 0 to 1 arguments. Function Signature: beginOperation(optObj = {})"
							);
						return p.sendWithPromise('BeginOperation', {});
					}),
					(p.finishOperation = function () {
						if (0 < n) {
							if ((--n, 0 != arguments.length))
								throw new RangeError(
									arguments.length +
										" arguments passed into function 'finishOperation'. Expected 0 arguments. Function Signature: finishOperation()"
								);
							return p.sendWithPromise('FinishOperation', {});
						}
					}),
					(p.runWithCleanup = function (e, t) {
						var n,
							i = !1,
							r = !1;
						return (A = A.then(
							function () {},
							function () {}
						)
							.then(function () {
								return p.initialize(t);
							})
							.then(function () {
								return (i = !0), p.beginOperation();
							})
							.then(function () {
								return (r = !0), p.startDeallocateStack(), e();
							})
							.then(function (e) {
								return (n = e), (r = !1), p.endDeallocateStack();
							})
							.then(function () {
								if (((i = !1), p.finishOperation(), 0 < u))
									throw Error(
										'Detected not yet deallocated stack. You may have called "PDFNet.startDeallocateStack()" somewhere without calling "PDFNet.endDeallocateStack()" afterwards.'
									);
								return n;
							})
							.catch(function (e) {
								throw (
									(r && p.endDeallocateStack(), i && p.finishOperation(), e)
								);
							}));
					}),
					(p.runWithoutCleanup = function (e, t) {
						var n = !1;
						return (A = A.then(
							function () {},
							function () {}
						)
							.then(function () {
								return p.initialize(t);
							})
							.then(function () {
								return (n = !0), p.beginOperation();
							})
							.then(function () {
								return e();
							})
							.then(function (e) {
								return (n = !1), p.finishOperation(), e;
							})
							.catch(function (e) {
								throw (n && p.finishOperation(), e);
							}));
					}),
					(p.initialize = function (t, e) {
						var n, i;
						return (
							o ||
								((n = { emsWorkerError: function (e, t) {} }),
								(o = createPromiseCapability()),
								(i = function (e) {
									l.Core.preloadPDFWorker(e, n),
										l.Core.initPDFWorkerTransports(e, n, t).then(
											function (e) {
												(p.messageHandler = e.messageHandler), o.resolve();
											},
											function (e) {
												o.reject(e);
											}
										);
								}),
								e && 'auto' !== e
									? i(e)
									: l.Core.getDefaultBackendType().then(i, function (e) {
											o.reject(e);
									  })),
							o.promise
						);
					}),
					(l.Core.PDFNet = p);
			},
		]),
		(i = {}),
		(r.m = n),
		(r.c = i),
		(r.d = function (e, t, n) {
			r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
		}),
		(r.r = function (e) {
			'undefined' != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
				Object.defineProperty(e, '__esModule', { value: !0 });
		}),
		(r.t = function (t, e) {
			if (
				(1 & e && (t = r(t)),
				8 & e || (4 & e && 'object' == typeof t && t && t.__esModule))
			)
				return t;
			var n = Object.create(null);
			if (
				(r.r(n),
				Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
				2 & e && 'string' != typeof t)
			)
				for (var i in t)
					r.d(
						n,
						i,
						function (e) {
							return t[e];
						}.bind(null, i)
					);
			return n;
		}),
		(r.n = function (e) {
			var t =
				e && e.__esModule
					? function () {
							return e.default;
					  }
					: function () {
							return e;
					  };
			return r.d(t, 'a', t), t;
		}),
		(r.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t);
		}),
		(r.p = '/core/pdf/'),
		r((r.s = 0));
}.call(this || window);
