(window.webpackJsonp = window.webpackJsonp || []).push([
	[108],
	{
		1329: function (_, t, n) {
			_.exports = (function (_) {
				'use strict';
				var t = (function (_) {
						return _ && 'object' == typeof _ && 'default' in _
							? _
							: { default: _ };
					})(_),
					n =
						'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split(
							'_'
						),
					e =
						'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split(
							'_'
						),
					r =
						'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split(
							'_'
						),
					s =
						'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split(
							'_'
						),
					o = /D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;
				function i(_, t, n) {
					var e, r;
					return 'm' === n
						? t
							? 'минута'
							: 'минуту'
						: _ +
								' ' +
								((e = +_),
								(r = {
									mm: t ? 'минута_минуты_минут' : 'минуту_минуты_минут',
									hh: 'час_часа_часов',
									dd: 'день_дня_дней',
									MM: 'месяц_месяца_месяцев',
									yy: 'год_года_лет',
								}[n].split('_')),
								e % 10 == 1 && e % 100 != 11
									? r[0]
									: e % 10 >= 2 &&
									  e % 10 <= 4 &&
									  (e % 100 < 10 || e % 100 >= 20)
									? r[1]
									: r[2]);
				}
				var m = function (_, t) {
					return o.test(t) ? n[_.month()] : e[_.month()];
				};
				(m.s = e), (m.f = n);
				var u = function (_, t) {
					return o.test(t) ? r[_.month()] : s[_.month()];
				};
				(u.s = s), (u.f = r);
				var M = {
					name: 'ru',
					weekdays:
						'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split(
							'_'
						),
					weekdaysShort: 'вск_пнд_втр_срд_чтв_птн_сбт'.split('_'),
					weekdaysMin: 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
					months: m,
					monthsShort: u,
					weekStart: 1,
					yearStart: 4,
					formats: {
						LT: 'H:mm',
						LTS: 'H:mm:ss',
						L: 'DD.MM.YYYY',
						LL: 'D MMMM YYYY г.',
						LLL: 'D MMMM YYYY г., H:mm',
						LLLL: 'dddd, D MMMM YYYY г., H:mm',
					},
					relativeTime: {
						future: 'через %s',
						past: '%s назад',
						s: 'несколько секунд',
						m: i,
						mm: i,
						h: 'час',
						hh: i,
						d: 'день',
						dd: i,
						M: 'месяц',
						MM: i,
						y: 'год',
						yy: i,
					},
					ordinal: function (_) {
						return _;
					},
					meridiem: function (_) {
						return _ < 4 ? 'ночи' : _ < 12 ? 'утра' : _ < 17 ? 'дня' : 'вечера';
					},
				};
				return t.default.locale(M, null, !0), M;
			})(n(30));
		},
	},
]);
//# sourceMappingURL=108.chunk.js.map
