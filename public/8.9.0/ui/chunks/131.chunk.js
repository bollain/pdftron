(window.webpackJsonp = window.webpackJsonp || []).push([
	[131],
	{
		1352: function (_, a, t) {
			_.exports = (function (_) {
				'use strict';
				var a = (function (_) {
						return _ && 'object' == typeof _ && 'default' in _
							? _
							: { default: _ };
					})(_),
					t = {
						name: 'tzl',
						weekdays:
							'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
						months:
							'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split(
								'_'
							),
						weekStart: 1,
						weekdaysShort: 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
						monthsShort:
							'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
						weekdaysMin: 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
						ordinal: function (_) {
							return _;
						},
						formats: {
							LT: 'HH.mm',
							LTS: 'HH.mm.ss',
							L: 'DD.MM.YYYY',
							LL: 'D. MMMM [dallas] YYYY',
							LLL: 'D. MMMM [dallas] YYYY HH.mm',
							LLLL: 'dddd, [li] D. MMMM [dallas] YYYY HH.mm',
						},
					};
				return a.default.locale(t, null, !0), t;
			})(t(30));
		},
	},
]);
//# sourceMappingURL=131.chunk.js.map
