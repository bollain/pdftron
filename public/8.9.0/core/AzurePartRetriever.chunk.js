/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function () {
	(window.wpCoreControlsBundle = window.wpCoreControlsBundle || []).push([
		[3],
		{
			462: function (Ba, va, r) {
				r.r(va);
				var oa = r(0),
					na = r(157);
				Ba = r(456);
				r = r(393);
				Ba = (function (ma) {
					function fa(da, aa, y, x) {
						return ma.call(this, da, aa, y, x) || this;
					}
					Object(oa.c)(fa, ma);
					fa.prototype.mV = function () {
						return { start: this.uU - na.a, stop: this.uU };
					};
					fa.prototype.Ut = function (da) {
						var aa = this;
						this.Ao(this.url, { start: 0, stop: 1 }, function (y, x, h) {
							if (y) return da(y);
							y = h.request.getResponseHeader('Content-Range');
							aa.uU = y.split('/')[1];
							ma.prototype.Ut.call(aa, da);
						});
					};
					return fa;
				})(Ba['default']);
				Object(r.a)(Ba);
				Object(r.b)(Ba);
				va['default'] = Ba;
			},
		},
	]);
}.call(this || window));
