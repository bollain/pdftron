(window.webpackJsonp = window.webpackJsonp || []).push([
	[52],
	{
		1273: function (u, t, n) {
			u.exports = (function (u) {
				'use strict';
				var t = (function (u) {
					return u && 'object' == typeof u && 'default' in u
						? u
						: { default: u };
				})(u);
				function n(u, t, n, i) {
					var a = {
							s: 'muutama sekunti',
							m: 'minuutti',
							mm: '%d minuuttia',
							h: 'tunti',
							hh: '%d tuntia',
							d: 'päivä',
							dd: '%d päivää',
							M: 'kuukausi',
							MM: '%d kuukautta',
							y: 'vuosi',
							yy: '%d vuotta',
							numbers:
								'nolla_yksi_kaksi_kolme_neljä_viisi_kuusi_seitsemän_kahdeksan_yhdeksän'.split(
									'_'
								),
						},
						e = {
							s: 'muutaman sekunnin',
							m: 'minuutin',
							mm: '%d minuutin',
							h: 'tunnin',
							hh: '%d tunnin',
							d: 'päivän',
							dd: '%d päivän',
							M: 'kuukauden',
							MM: '%d kuukauden',
							y: 'vuoden',
							yy: '%d vuoden',
							numbers:
								'nollan_yhden_kahden_kolmen_neljän_viiden_kuuden_seitsemän_kahdeksan_yhdeksän'.split(
									'_'
								),
						},
						_ = i && !t ? e : a,
						s = _[n];
					return u < 10 ? s.replace('%d', _.numbers[u]) : s.replace('%d', u);
				}
				var i = {
					name: 'fi',
					weekdays:
						'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split(
							'_'
						),
					weekdaysShort: 'su_ma_ti_ke_to_pe_la'.split('_'),
					weekdaysMin: 'su_ma_ti_ke_to_pe_la'.split('_'),
					months:
						'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split(
							'_'
						),
					monthsShort:
						'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split(
							'_'
						),
					ordinal: function (u) {
						return u + '.';
					},
					weekStart: 1,
					yearStart: 4,
					relativeTime: {
						future: '%s päästä',
						past: '%s sitten',
						s: n,
						m: n,
						mm: n,
						h: n,
						hh: n,
						d: n,
						dd: n,
						M: n,
						MM: n,
						y: n,
						yy: n,
					},
					formats: {
						LT: 'HH.mm',
						LTS: 'HH.mm.ss',
						L: 'DD.MM.YYYY',
						LL: 'D. MMMM[ta] YYYY',
						LLL: 'D. MMMM[ta] YYYY, [klo] HH.mm',
						LLLL: 'dddd, D. MMMM[ta] YYYY, [klo] HH.mm',
						l: 'D.M.YYYY',
						ll: 'D. MMM YYYY',
						lll: 'D. MMM YYYY, [klo] HH.mm',
						llll: 'ddd, D. MMM YYYY, [klo] HH.mm',
					},
				};
				return t.default.locale(i, null, !0), i;
			})(n(30));
		},
	},
]);
//# sourceMappingURL=52.chunk.js.map
