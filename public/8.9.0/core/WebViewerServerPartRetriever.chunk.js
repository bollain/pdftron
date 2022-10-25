/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
	(window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
		[14],
		{
			467: function (Ba, va, r) {
				function oa() {
					return !1;
				}
				function na(z, w, ea) {
					if (!(w in n)) return !0;
					w = n[w];
					for (var ka = 0; ka < w.length; ka++) {
						var ca = z;
						var ba = w[ka];
						var ia = ea;
						if (ba.name in ca) {
							var ha = '',
								la = !1;
							ca = ca[ba.name];
							switch (ba.type) {
								case 's':
									ha = 'String';
									la = Object(fa.isString)(ca);
									break;
								case 'a':
									ha = 'Array';
									la = Object(fa.isArray)(ca);
									break;
								case 'n':
									ha = 'Number';
									la = Object(fa.isNumber)(ca) && Object(fa.isFinite)(ca);
									break;
								case 'o':
									(ha = 'Object'),
										(la = Object(fa.isObject)(ca) && !Object(fa.isArray)(ca));
							}
							la ||
								ia.reject(
									'Expected response field "' + ba.name + '" to have type ' + ha
								);
							ba = la;
						} else
							ia.reject('Response missing field "' + ba.name + '"'), (ba = !1);
						if (!ba) return !1;
					}
					return !0;
				}
				r.r(va);
				var ma = r(0),
					fa = r(1);
				r.n(fa);
				var da = r(2);
				Ba = r(48);
				var aa = r(22),
					y = r(484),
					x = r(99),
					h = r(393),
					b = r(43),
					e = r(177),
					a = (function () {
						function z() {
							this.request = this.result = null;
							this.state = 0;
							var w = this;
							w.promise = new Promise(function (ea, ka) {
								w.resolve = function () {
									if (0 === w.state || 4 === w.state)
										(w.state = 1),
											(w.result = arguments[0]),
											ea.apply(null, arguments);
								};
								w.reject = function () {
									if (0 === w.state || 4 === w.state)
										(w.state = 2), ka.apply(null, arguments);
								};
							});
						}
						z.prototype.Nt = function () {
							return 1 === (this.state & 1);
						};
						z.prototype.jha = function () {
							return 2 === (this.state & 2);
						};
						z.prototype.bj = function () {
							return !this.jha() && !this.Nt();
						};
						z.prototype.Kga = function () {
							return 4 === (this.state & 4);
						};
						z.prototype.AN = function () {
							this.state |= 4;
						};
						return z;
					})(),
					f = (function () {
						function z() {
							this.wt = {};
							this.Lb = [];
						}
						z.prototype.pop = function () {
							var w = this.Lb.pop();
							this.wt[w.key] = void 0;
							return w;
						};
						z.prototype.push = function (w, ea) {
							ea = { key: w, data: ea };
							this.Lb.push(ea);
							this.wt[w] = ea.data;
						};
						z.prototype.contains = function (w) {
							return !!this.wt[w];
						};
						z.prototype.get = function (w) {
							return this.wt[w];
						};
						z.prototype.set = function (w, ea) {
							var ka = this;
							this.wt[w] = ea;
							this.Lb.forEach(function (ca, ba) {
								ca.key === w && (ka.Lb[ba] = ca);
							});
						};
						z.prototype.remove = function (w) {
							var ea = this;
							this.wt[w] = void 0;
							this.Lb.forEach(function (ka, ca) {
								ka.key === w && ea.Lb.splice(ca, 1);
							});
						};
						z.prototype.length = function () {
							return this.Lb.length;
						};
						return z;
					})(),
					n = {
						pages: [{ name: 'pages', type: 'a' }],
						pdf: [{ name: 'url', type: 's' }],
						docmod: [
							{ name: 'url', type: 's' },
							{ name: 'rID', type: 's' },
						],
						health: [],
						tiles: [
							{ name: 'z', type: 'n' },
							{ name: 'rID', type: 'n' },
							{ name: 'tiles', type: 'a' },
							{ name: 'size', type: 'n' },
						],
						cAnnots: [{ name: 'annots', type: 'a' }],
						annots: [
							{ name: 'url', type: 's' },
							{ name: 'name', type: 's' },
						],
						image: [
							{ name: 'url', type: 's' },
							{ name: 'name', type: 's' },
							{ name: 'p', type: 'n' },
						],
						text: [
							{ name: 'url', type: 's' },
							{ name: 'name', type: 's' },
							{ name: 'p', type: 'n' },
						],
						ApString2Xod: [
							{ name: 'url', type: 's' },
							{ name: 'rID', type: 's' },
						],
					};
				r = (function () {
					function z(w, ea, ka) {
						var ca = this;
						this.gO = this.XT = !1;
						this.uh = this.kG = this.Xu = this.$L = this.zI = this.Zm = null;
						this.Em = new a();
						this.Qp = new a();
						this.eC = !1;
						this.Hf = this.He = this.Ie = this.yf = null;
						this.eg = [];
						this.QC = [];
						this.cache = {};
						this.timeStamp = 0;
						this.ph = [];
						this.lj = [];
						this.FJ = null;
						this.HT = !1;
						this.A_ = this.id = null;
						this.KL = this.rW = oa;
						this.li = 0;
						this.MK = !1;
						this.$X = 1;
						this.hj = {};
						this.ns = 0;
						this.nu = new f();
						ea.endsWith('/') || (ea += '/');
						ka = ka || {};
						this.XT = ka.disableWebsockets || !1;
						this.gO = ka.singleServerMode || !1;
						null != ka.customQueryParameters &&
							Object(b.b)('wvsQueryParameters', ka.customQueryParameters);
						ea.endsWith('blackbox/') || (ea += 'blackbox/');
						this.Zm = ka.uploadData || null;
						this.Xu = ka.uriData || null;
						this.zI = ka.cacheKey || null;
						this.$L = ka.officeOptions || null;
						this.$e = ea;
						this.hJ = w;
						this.Oo(!0);
						this.Es = new y.a(ea, null, this.Yh()).Mca(
							!this.XT,
							function (ba) {
								ca.Cia(ba);
							},
							function () {
								return null;
							},
							function () {
								ca.eC = !1;
							},
							function () {
								ca.Ila();
							}
						);
					}
					z.prototype.r$ = function () {
						var w = this;
						return new Promise(function (ea, ka) {
							var ca = new XMLHttpRequest();
							ca.open('GET', w.$e + 'ck');
							ca.withCredentials = w.Yh();
							ca.onreadystatechange = function () {
								ca.readyState === XMLHttpRequest.DONE &&
									(200 === ca.status ? ea() : ka());
							};
							ca.send();
						});
					};
					z.prototype.yna = function (w) {
						this.rW = w || oa;
						this.KL = oa;
					};
					z.prototype.Z8 = function () {
						this.b_();
						return this.Es.cq(!0);
					};
					z.prototype.b_ = function () {
						Object(ma.b)(this, void 0, void 0, function () {
							return Object(ma.d)(this, function (w) {
								switch (w.label) {
									case 0:
										return (
											(this.Qp = new a()),
											(this.Em = new a()),
											(this.eC = !1),
											(this.id = null),
											(this.HT = !1),
											[4, this.r$()]
										);
									case 1:
										return w.ca(), [2];
								}
							});
						});
					};
					z.prototype.Ila = function () {
						this.rW();
						this.b_();
						this.yf &&
							(this.yf.bj()
								? this.Ah(this.yf.request)
								: this.yf.Nt() &&
								  this.KL(this.yf.result.url, 'pdf') &&
								  ((this.yf = null), this.a_()));
						this.Hf && this.Hf.bj() && this.Ah(this.Hf.request);
						this.Ie && this.Ie.bj()
							? this.Ah(this.Ie.request)
							: this.He && this.He.bj() && this.eW();
						var w;
						for (w = 0; w < this.ph.length; w++)
							this.ph[w] &&
								(this.ph[w].bj()
									? this.Ah(this.ph[w].request)
									: this.ph[w].Nt() &&
									  this.KL(this.ph[w].result.url, 'image') &&
									  ((this.ph[w] = null), this.iF(Object(fa.uniqueId)(), w)));
						for (w = 0; w < this.lj.length; w++)
							this.lj[w] &&
								this.lj[w].bj() &&
								!this.lj[w].Kga() &&
								this.Ah(this.lj[w].request);
						for (w = 0; w < this.eg.length; w++)
							this.eg[w] && this.eg[w].bj() && this.Ah(this.eg[w].request);
					};
					z.prototype.rga = function () {
						return this.eC
							? Promise.resolve()
							: ((this.eC = !0), (this.timeStamp = Date.now()), this.Es.OD());
					};
					z.prototype.$pa = function () {
						var w = this,
							ea,
							ka,
							ca,
							ba,
							ia;
						return new Promise(function (ha, la) {
							if (w.Zm)
								(ea = new FormData()),
									ea.append('file', w.Zm.fileHandle, w.Zm.fileHandle.name),
									(ka = w.Zm.loadCallback),
									(ba = 'upload'),
									(ca = w.Zm.extension);
							else if (w.Xu)
								(ea = { uri: w.Xu.uri, Rta: w.Xu.shareId }),
									(ea = Object.keys(ea)
										.map(function (pa) {
											return (
												pa + '=' + (ea[pa] ? encodeURIComponent(ea[pa]) : '')
											);
										})
										.join('&')),
									(ia = 'application/x-www-form-urlencoded; charset=UTF-8'),
									(ka = w.Xu.loadCallback),
									(ba = 'url'),
									(ca = w.Xu.extension);
							else {
								ha();
								return;
							}
							var ja = new XMLHttpRequest(),
								ra = Object(aa.k)(w.$e, 'AuxUpload');
							ra = Object(e.a)(ra, { type: ba, ext: ca });
							ja.open('POST', ra);
							ja.withCredentials = w.Yh();
							ia && ja.setRequestHeader('Content-Type', ia);
							ja.addEventListener('load', function () {
								if (ja.readyState === ja.DONE && 200 === ja.status) {
									var pa = JSON.parse(ja.response);
									w.hJ = pa.uri;
									ka(pa);
									ha(pa);
								}
							});
							ja.addEventListener('error', function () {
								la(ja.statusText + ' ' + JSON.stringify(ja));
							});
							w.Zm &&
								null != w.Zm.onProgress &&
								(ja.upload.onprogress = function (pa) {
									w.Zm.onProgress(pa);
								});
							ja.send(ea);
						});
					};
					z.prototype.zla = function (w) {
						this.password = w || null;
						this.Em.Nt() || ((this.Em = new a()), this.Ah({ t: 'pages' }));
						return this.Em.promise;
					};
					z.prototype.Ry = function (w) {
						this.FJ = w || null;
						this.Em.Nt() || this.Ah({ t: 'pages' });
						return this.Em.promise;
					};
					z.prototype.tw = function (w) {
						w = Object.assign(w, { uri: encodeURIComponent(this.hJ) });
						this.FJ && (w.ext = this.FJ);
						this.uh && (w.c = this.uh);
						this.password && (w.pswd = this.password);
						this.zI && (w.cacheKey = this.zI);
						this.$L && (w.officeOptions = this.$L);
						return w;
					};
					z.prototype.hma = function () {
						0 < this.nu.length() &&
							10 >= this.ns &&
							this.ima(this.nu.pop().data);
					};
					z.prototype.w8 = function (w) {
						0 < this.nu.length() && this.nu.contains(w) && this.nu.remove(w);
					};
					z.prototype.Ah = function (w) {
						w = this.tw(w);
						this.Es.send(w);
					};
					z.prototype.v_ = function (w, ea) {
						10 < this.ns
							? this.nu.push(w, ea)
							: (this.ns++, (w = this.tw(ea)), this.Es.send(w));
					};
					z.prototype.ima = function (w) {
						this.ns++;
						w = this.tw(w);
						this.Es.send(w);
					};
					z.prototype.Il = function (w) {
						return w;
					};
					z.prototype.qW = function (w) {
						this.gO && w
							? Object(da.j)(
									'Server failed health check. Single server mode ignoring check.'
							  )
							: !this.qsa && w && 3 >= this.li
							? ((this.MK = !0), this.Es.cq())
							: 3 < this.li && (this.gO = !0);
					};
					z.prototype.Cia = function (w) {
						var ea = this,
							ka = w.data,
							ca = w.err,
							ba = w.t;
						switch (ba) {
							case 'upload':
								ca ? this.aqa.reject(ca) : this.aqa.resolve('Success');
								break;
							case 'pages':
								ca
									? this.Em.reject(ca)
									: na(ka, ba, this.Em) && this.Em.resolve(ka);
								break;
							case 'config':
								if (ca) this.Qp.reject(ca);
								else if (na(ka, ba, this.Qp)) {
									this.qW(ka.unhealthy);
									ka.id && (this.id = ka.id);
									if (ka.auth) {
										var ia = Object(b.a)('wvsQueryParameters');
										ia.auth = ka.auth;
										Object(b.b)('wvsQueryParameters', ia);
									}
									ka.serverVersion &&
										((this.kG = ka.serverVersion),
										Object(da.h)(
											'[WebViewer Server] server version: ' + this.kG
										));
									ka.serverID
										? ((this.li =
												ka.serverID === this.A_ && this.MK ? this.li + 1 : 0),
										  (this.A_ = ka.serverID))
										: (this.li = 0);
									this.MK = !1;
									this.Qp.resolve(ka);
								}
								break;
							case 'health':
								ca
									? this.Qp.reject(ca)
									: na(ka, ba, this.Qp) && this.qW(ka.unhealthy);
								break;
							case 'pdf':
								ka.url = Object(e.a)(this.$e + '../' + encodeURI(ka.url));
								ca
									? this.yf.reject(ca)
									: na(ka, ba, this.yf) && this.yf.resolve(ka);
								break;
							case 'ApString2Xod':
								ka.url = Object(e.a)(this.$e + '../data/' + encodeURI(ka.url));
								ca
									? this.hj[ka.rID].reject(ca)
									: na(ka, ba, this.hj[ka.rID]) && this.hj[ka.rID].resolve(ka);
								break;
							case 'docmod':
								ka.url = Object(e.a)(this.$e + '../' + encodeURI(ka.url));
								ca
									? this.hj[ka.rID].reject(ca)
									: na(ka, ba, this.yf) && this.hj[ka.rID].resolve(ka);
								break;
							case 'xod':
								if (ca)
									this.Ie && this.Ie.bj() && this.Ie.reject(ca),
										this.He && this.He.bj() && this.He.reject(ca);
								else if (ka.notFound)
									ka.noCreate ||
										(this.Ie && this.Ie.bj() && this.Ie.resolve(ka)),
										this.He && this.He.bj() && this.He.resolve(ka);
								else {
									ka.url &&
										(ka.url = Object(e.a)(this.$e + '../' + encodeURI(ka.url)));
									if (!this.He || this.He.Nt())
										(this.He = new a()),
											(this.He.request = { t: 'xod', noCreate: !0 });
									this.Ie ||
										((this.Ie = new a()), (this.Ie.request = { t: 'xod' }));
									this.He.resolve(ka);
									this.Ie.resolve(ka);
								}
								break;
							case 'cAnnots':
								ia = this.Hf;
								if (ca) ia.reject(ca);
								else if (na(ka, ba, ia)) {
									ia.AN();
									var ha = [],
										la = ka.annots;
									ka = function (qa) {
										var wa = la[qa].s,
											za = la[qa].e,
											Ha = ja.$e + '../' + encodeURI(la[qa].xfdf),
											Ia =
												'true' === la[qa].hasAppearance
													? Object(e.a)(Ha + '.xodapp')
													: null,
											Aa = Object(fa.range)(wa, za + 1);
										ha[qa] = {
											range: Aa,
											promise: new Promise(function (Ja, Pa) {
												var Ma = new XMLHttpRequest();
												Ma.open('GET', Object(e.a)(Ha));
												Ma.responseType = 'text';
												Ma.withCredentials = ea.Yh();
												Ma.addEventListener('load', function () {
													Ma.readyState === Ma.DONE &&
														200 === Ma.status &&
														Ja({ zr: Ma.response, wl: Ia, range: Aa });
												});
												Ma.addEventListener('error', function () {
													Pa(Ma.statusText + ' ' + JSON.stringify(Ma));
												});
												Ma.send();
											}),
										};
									};
									var ja = this;
									for (ca = 0; ca < la.length; ca++) ka(ca);
									ia.resolve(ha);
								}
								break;
							case 'annots':
								if (ca) this.Hf.reject(ca);
								else if (na(ka, ba, this.Hf)) {
									this.Hf.AN();
									var ra = new XMLHttpRequest();
									ia = this.$e + '../' + encodeURI(ka.url);
									var pa = ka.hasAppearance
										? Object(e.a)(ia + '.xodapp')
										: null;
									ra.open('GET', Object(e.a)(ia));
									ra.responseType = 'text';
									ra.withCredentials = this.Yh();
									ra.addEventListener('load', function () {
										ra.readyState === ra.DONE &&
											200 === ra.status &&
											ea.Hf.resolve({ zr: ra.response, wl: pa });
									});
									ra.addEventListener('error', function () {
										ea.Hf.reject(ra.statusText + ' ' + JSON.stringify(ra));
									});
									ra.send();
								}
								break;
							case 'image':
								this.ns--;
								var sa = this.ph[ka.p];
								ca
									? sa.promise.reject(ca)
									: na(ka, ba, sa) &&
									  ((sa.result = ka),
									  (sa.result.url = Object(e.a)(
											this.$e + '../' + encodeURI(sa.result.url)
									  )),
									  sa.resolve(sa.result));
								break;
							case 'tiles':
								this.ns--;
								sa = ka.rID;
								ia = this.eg[sa];
								this.eg[sa] = null;
								this.QC.push(sa);
								if (ca) ia.reject(ca);
								else if (na(ka, ba, ia)) {
									for (ca = 0; ca < ka.tiles.length; ca++)
										ka.tiles[ca] = Object(e.a)(
											this.$e + '../' + encodeURI(ka.tiles[ca])
										);
									ia.resolve(ka);
								}
								break;
							case 'text':
								sa = this.lj[ka.p];
								if (ca) sa.reject(ca);
								else if (na(ka, ba, sa)) {
									sa.AN();
									var ua = new XMLHttpRequest();
									ka = Object(e.a)(this.$e + '../' + encodeURI(ka.url));
									ua.open('GET', ka);
									ua.withCredentials = this.Yh();
									ua.addEventListener('load', function () {
										ua.readyState === ua.DONE &&
											200 === ua.status &&
											((sa.result = JSON.parse(ua.response)),
											sa.resolve(sa.result));
									});
									ua.addEventListener('error', function (qa) {
										sa.reject(ua.statusText + ' ' + JSON.stringify(qa));
									});
									ua.send();
								}
								break;
							case 'progress':
								'loading' === ka.t &&
									this.trigger(x.a.Events.DOCUMENT_LOADING_PROGRESS, [
										ka.bytes,
										ka.total,
									]);
						}
						this.hma();
						!ba &&
							w.echo &&
							w &&
							'apstring2xod' === w.echo.t &&
							(w = w.echo.reqID) &&
							(2 <= parseInt(this.kG, 10)
								? this.hj[w].reject('Message unhandled by server')
								: this.hj[w].reject());
					};
					z.prototype.tda = function () {
						return Object(ma.b)(this, void 0, void 0, function () {
							return Object(ma.d)(this, function (w) {
								switch (w.label) {
									case 0:
										return [4, this.rga()];
									case 1:
										return w.ca(), [2, this.Qp.promise];
								}
							});
						});
					};
					z.prototype.$ca = function (w) {
						for (
							var ea = this,
								ka = new XMLHttpRequest(),
								ca = Object(e.a)(this.$e + 'aul', { id: this.id }),
								ba = new FormData(),
								ia = {},
								ha = 0;
							ha < w.body.length;
							ha++
						) {
							var la = w.body[ha];
							ia[la.id] = la.mI.w + ';' + la.mI.h;
							ba.append(la.id, la.mI.dataString);
						}
						w = { t: 'apstring2xod', reqID: this.$X++, parts: ia };
						var ja = this.tw(w);
						ba.append('msg', JSON.stringify(ja));
						this.hj[ja.reqID] = new a();
						ka.open('POST', ca);
						ka.withCredentials = this.Yh;
						ca = new Promise(function (ra, pa) {
							ka.onreadystatechange = function () {
								4 === ka.readyState &&
									(200 === ka.status
										? ra()
										: pa(
												'An error occurred while sending down appearance strings to the server'
										  ));
							};
						});
						ka.send(ba);
						return ca.then(function () {
							return ea.hj[ja.reqID].promise;
						});
					};
					z.prototype.b9 = function () {
						var w = this.kG.split('-')[0].split('.'),
							ea = ['1', '5', '9'];
						if (3 !== w.length) throw Error('Invalid WVS version length.');
						if (3 !== ea.length) throw Error('Invalid version length.');
						for (var ka = 0; ka < w.length; ++ka) {
							if (ea.length === ka || w[ka] > ea[ka]) return -1;
							if (w[ka] !== ea[ka]) return 1;
						}
						return 0;
					};
					z.prototype.Mp = function () {
						return 0 >= this.b9();
					};
					z.prototype.OJ = function () {
						this.Hf ||
							((this.Hf = new a()),
							this.Mp()
								? (this.Hf.request = { t: 'cAnnots' })
								: (this.Hf.request = { t: 'annots' }),
							this.Ah(this.Hf.request));
						return this.Hf.promise;
					};
					z.prototype.iF = function (w, ea) {
						this.ph[ea] ||
							((this.ph[ea] = new a()),
							(this.ph[ea].request = { t: 'image', p: ea }),
							this.v_(w, this.ph[ea].request));
						return this.ph[ea].promise;
					};
					z.prototype.Ala = function (w) {
						this.lj[w] ||
							((this.lj[w] = new a()),
							(this.lj[w].request = { t: 'text', p: w }),
							this.Ah(this.lj[w].request));
						return this.lj[w].promise;
					};
					z.prototype.Bla = function (w, ea, ka, ca, ba) {
						var ia = this.eg.length;
						this.QC.length && (ia = this.QC.pop());
						this.eg[ia] = new a();
						this.eg[ia].request = {
							t: 'tiles',
							p: ea,
							z: ka,
							r: ca,
							size: ba,
							rID: ia,
						};
						this.v_(w, this.eg[ia].request);
						return this.eg[ia].promise;
					};
					z.prototype.a_ = function () {
						this.yf ||
							((this.yf = new a()),
							(this.yf.request = { t: 'pdf' }),
							this.HT
								? this.yf.resolve({ url: this.hJ })
								: this.Ah(this.yf.request));
						return this.yf.promise;
					};
					z.prototype.yV = function (w) {
						var ea = this,
							ka = new XMLHttpRequest(),
							ca = Object(e.a)(this.$e + 'aul', { id: this.id }),
							ba = new FormData(),
							ia = {};
						w.annots && (ia.annots = 'xfdf');
						w.watermark && (ia.watermark = 'png');
						w.redactions && (ia.redactions = 'redact');
						ia = { t: 'docmod', reqID: this.$X++, parts: ia };
						w.print && (ia.print = !0);
						var ha = this.tw(ia);
						ba.append('msg', JSON.stringify(ha));
						return Promise.all(
							[w.annots, w.watermark, w.redactions].map(function (la) {
								return Promise.resolve(la);
							})
						).then(function (la) {
							var ja = la[0],
								ra = la[1];
							la = la[2];
							ja && ba.append('annots', ja);
							ra && ba.append('watermark', ra);
							la && ba.append('redactions', la);
							ea.hj[ha.reqID] = new a();
							ka.open('POST', ca);
							ka.withCredentials = ea.Yh;
							ja = new Promise(function (pa, sa) {
								ka.onreadystatechange = function () {
									4 === ka.readyState &&
										(200 === ka.status
											? pa()
											: sa(
													'An error occurred while sending down annotation data to the server'
											  ));
								};
							});
							ka.send(ba);
							return ja.then(function () {
								return ea.hj[ha.reqID].promise;
							});
						});
					};
					z.prototype.eW = function () {
						this.He ||
							((this.He = new a()),
							(this.He.request = { t: 'xod', noCreate: !0 }),
							this.Ah(this.He.request));
						return this.He.promise;
					};
					z.prototype.Cla = function () {
						this.Ie ||
							((this.Ie = new a()),
							(this.Ie.request = { t: 'xod' }),
							this.Ah(this.Ie.request));
						return this.Ie.promise;
					};
					z.prototype.Jo = function () {
						return !0;
					};
					z.prototype.request = function () {};
					z.prototype.uZ = function () {};
					z.prototype.abort = function () {
						for (var w = 0; w < this.eg.length; w++)
							this.eg[w] &&
								(this.eg[w].resolve(null),
								(this.eg[w] = null),
								this.QC.push(w));
						this.close();
					};
					z.prototype.wF = function (w) {
						this.uh = this.uh || {};
						this.uh.headers = w;
					};
					z.prototype.Oo = function (w) {
						this.uh = this.uh || {};
						this.uh.internal = this.uh.internal || {};
						this.uh.internal.withCredentials = w;
					};
					z.prototype.Yh = function () {
						return this.uh && this.uh.internal
							? this.uh.internal.withCredentials
							: null;
					};
					z.prototype.getFileData = function () {
						return Promise.reject();
					};
					return z;
				})();
				Object(Ba.a)(r);
				Object(h.a)(r);
				Object(h.b)(r);
				va['default'] = r;
			},
			484: function (Ba, va, r) {
				var oa = r(0),
					na = r(2),
					ma = r(22),
					fa = r(43),
					da = r(177),
					aa = r(77),
					y = (function () {
						function h(b, e, a, f, n, z) {
							void 0 === a && (a = null);
							void 0 === f && (f = null);
							void 0 === n && (n = null);
							void 0 === z && (z = null);
							this.HX = !1;
							this.li = 0;
							this.ES = this.wqa(b);
							this.url = e ? this.ES + '/' + e : this.ES + '/ws';
							this.ZI = a;
							this.qy = f;
							this.rw = n;
							this.fN = z;
						}
						h.prototype.wqa = function (b) {
							var e = b.indexOf('://'),
								a = 'ws://';
							0 > e ? (e = 0) : (5 === e && (a = 'wss://'), (e += 3));
							var f = b.lastIndexOf('/');
							0 > f && (f = b.length);
							return a + b.slice(e, f);
						};
						h.prototype.send = function (b) {
							this.ap.readyState === WebSocket.CLOSED ||
								this.HX ||
								this.ap.send(JSON.stringify(b));
						};
						h.prototype.OD = function () {
							return Object(oa.b)(this, void 0, void 0, function () {
								var b,
									e = this;
								return Object(oa.d)(this, function () {
									b = Object(fa.a)('wvsQueryParameters');
									b.bcid = Object(ma.l)(8);
									Object(fa.b)('wvsQueryParameters', b);
									return [
										2,
										new Promise(function (a, f) {
											var n = Object(da.a)(e.url);
											e.ap = new WebSocket(n);
											e.ap.onopen = function () {
												e.qy && e.qy();
												a();
											};
											e.ap.onerror = function (z) {
												e.HX = !0;
												f(z);
											};
											e.ap.onclose = function (z) {
												var w = z.code;
												return Object(oa.b)(e, void 0, void 0, function () {
													var ea = this;
													return Object(oa.d)(this, function (ka) {
														switch (ka.label) {
															case 0:
																return (
																	this.rw && this.rw(),
																	3e3 === w
																		? [3, 3]
																		: 8 > this.li++
																		? [
																				4,
																				new Promise(function (ca) {
																					return setTimeout(function () {
																						return Object(oa.b)(
																							ea,
																							void 0,
																							void 0,
																							function () {
																								return Object(oa.d)(
																									this,
																									function (ba) {
																										switch (ba.label) {
																											case 0:
																												return (
																													this.fN(),
																													[4, this.OD()]
																												);
																											case 1:
																												return (
																													ba.ca(), ca(), [2]
																												);
																										}
																									}
																								);
																							}
																						);
																					}, 3e3);
																				}),
																		  ]
																		: [3, 2]
																);
															case 1:
																return ka.ca(), [3, 3];
															case 2:
																f(aa.a), (ka.label = 3);
															case 3:
																return [2];
														}
													});
												});
											};
											e.ap.onmessage = function (z) {
												z &&
													z.data &&
													((z = JSON.parse(z.data)),
													z.hb
														? e.send({ hb: !0 })
														: z.end
														? close()
														: e.ZI(z));
											};
										}),
									];
								});
							});
						};
						h.prototype.cq = function (b) {
							void 0 === b && (b = !1);
							this.li = 0;
							b ? this.ap.close(3e3) : this.ap.close();
							return Promise.resolve();
						};
						return h;
					})(),
					x = (function () {
						function h(b, e, a, f, n, z, w) {
							void 0 === f && (f = null);
							void 0 === n && (n = null);
							void 0 === z && (z = null);
							void 0 === w && (w = null);
							this.li = this.hF = this.id = 0;
							this.Ex = !1;
							this.request = null;
							b = this.Zja(b);
							this.url = e ? b + '/' + e + 'pf' : b + '/pf';
							this.dG = a;
							this.ZI = f;
							this.qy = n;
							this.rw = z;
							this.fN = w;
						}
						h.prototype.Zja = function (b) {
							var e = b.lastIndexOf('/');
							0 > e && (e = b.length);
							return b.slice(0, e);
						};
						h.prototype.a$ = function (b) {
							b = b.split('\n');
							for (
								b[b.length - 1] && b.pop();
								0 < b.length && 3 > b[b.length - 1].length;

							)
								']' === b.pop() && (this.id = 0);
							0 < b.length && 3 > b[0].length && b.shift();
							for (var e = 0; e < b.length; ++e)
								b[e].endsWith(',') && (b[e] = b[e].substr(0, b[e].length - 1));
							return b;
						};
						h.prototype.k_ = function () {
							return Object(oa.b)(this, void 0, void 0, function () {
								var b = this;
								return Object(oa.d)(this, function (e) {
									switch (e.label) {
										case 0:
											return 8 > this.li++
												? [
														4,
														new Promise(function (a) {
															return setTimeout(function () {
																b.fN();
																b.OD();
																a();
															}, 3e3);
														}),
												  ]
												: [3, 2];
										case 1:
											e.ca(), (e.label = 2);
										case 2:
											return [2];
									}
								});
							});
						};
						h.prototype.aka = function (b) {
							Object(oa.b)(this, void 0, void 0, function () {
								var e, a;
								return Object(oa.d)(this, function (f) {
									switch (f.label) {
										case 0:
											(e = null), (a = 0), (f.label = 1);
										case 1:
											if (!(a < b.length)) return [3, 6];
											e = JSON.parse(b[a]);
											if (!e) return [3, 5];
											if (!e.end) return [3, 2];
											close();
											return [3, 5];
										case 2:
											if (!e.id || Number(e.id) === this.id) return [3, 4];
											Object(na.j)('Reconnecting, new server detected');
											this.cq();
											return [4, this.k_()];
										case 3:
											return f.ca(), [3, 5];
										case 4:
											e.hb && Number(e.id) === this.id
												? this.send({ hb: !0 })
												: this.Ex || this.ZI(e),
												(f.label = 5);
										case 5:
											return ++a, [3, 1];
										case 6:
											return [2];
									}
								});
							});
						};
						h.prototype.zia = function (b) {
							Object(oa.b)(this, void 0, void 0, function () {
								var e, a, f;
								return Object(oa.d)(this, function (n) {
									switch (n.label) {
										case 0:
											if (!(3 <= b.readyState)) return [3, 2];
											try {
												e = b.responseText.length;
											} catch (z) {
												return Object(na.h)('caught exception'), [2];
											}
											if (0 < e)
												try {
													(a = this.a$(b.responseText)),
														0 === this.id &&
															0 < a.length &&
															((f = JSON.parse(a.shift())),
															(this.id = f.id),
															(this.li = 0)),
														this.aka(a);
												} catch (z) {}
											return this.Ex ? [3, 2] : [4, this.AU()];
										case 1:
											n.ca(), (n.label = 2);
										case 2:
											return [2];
									}
								});
							});
						};
						h.prototype.AU = function () {
							return Object(oa.b)(this, void 0, void 0, function () {
								var b = this;
								return Object(oa.d)(this, function () {
									return [
										2,
										new Promise(function (e, a) {
											function f() {
												return Object(oa.b)(b, void 0, void 0, function () {
													return Object(oa.d)(this, function (z) {
														switch (z.label) {
															case 0:
																a(), this.cq(), (z.label = 1);
															case 1:
																return this.Ex && 8 > this.li
																	? [4, this.k_()]
																	: [3, 3];
															case 2:
																return z.ca(), [3, 1];
															case 3:
																return [2];
														}
													});
												});
											}
											b.request = new XMLHttpRequest();
											b.request.withCredentials = b.dG;
											var n = Object(da.a)(
												b.url,
												0 !== b.id
													? { id: String(b.id), uc: String(b.hF) }
													: { uc: String(b.hF) }
											);
											b.hF++;
											b.request.open('GET', n, !0);
											b.request.setRequestHeader('Cache-Control', 'no-cache');
											b.request.setRequestHeader(
												'X-Requested-With',
												'XMLHttpRequest'
											);
											b.request.onreadystatechange = function () {
												b.zia(b.request);
											};
											b.request.addEventListener('error', f);
											b.request.addEventListener('timeout', f);
											b.request.addEventListener('load', function () {
												b.qy && b.qy();
												e();
											});
											b.request.send();
										}),
									];
								});
							});
						};
						h.prototype.OD = function () {
							var b = Object(fa.a)('wvsQueryParameters');
							b.bcid = Object(ma.l)(8);
							Object(fa.b)('wvsQueryParameters', b);
							this.hF = this.id = 0;
							this.Ex = !1;
							return this.AU();
						};
						h.prototype.send = function (b) {
							var e = this,
								a = new XMLHttpRequest();
							a.withCredentials = this.dG;
							var f = Object(da.a)(this.url, { id: String(this.id) }),
								n = new FormData();
							n.append('data', JSON.stringify(b));
							a.addEventListener('error', function () {
								e.cq();
							});
							a.open('POST', f);
							a.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
							a.send(n);
						};
						h.prototype.cq = function () {
							this.id = 0;
							this.Ex = !0;
							this.rw && this.rw();
							this.request.abort();
							return Promise.resolve();
						};
						return h;
					})();
				Ba = (function () {
					function h(b, e, a) {
						this.gT = b;
						this.target = e;
						this.dG = a;
					}
					h.prototype.Mca = function (b, e, a, f, n) {
						void 0 === b && (b = !0);
						void 0 === e && (e = null);
						void 0 === a && (a = null);
						void 0 === f && (f = null);
						void 0 === n && (n = null);
						return b
							? new y(this.gT, this.target, e, a, f, n)
							: new x(this.gT, this.target, this.dG, e, a, f, n);
					};
					return h;
				})();
				va.a = Ba;
			},
		},
	]);
}.call(this || window));
