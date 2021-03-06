'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

require('angular');

require('angular-ui-router');

require('ui-router-extras/release/modular/ct-ui-router-extras.core');

require('ui-router-extras/release/modular/ct-ui-router-extras.future');

require('oclazyload');

exports['default'] = function (angularModule, futureRoutes) {

	angularModule.requires.push('ui.router', 'ct.ui.router.extras.core', 'ct.ui.router.extras.future', 'oc.lazyLoad');

	// RouterConfig
	return ['$ocLazyLoadProvider', '$stateProvider', '$futureStateProvider', function ($ocLazyLoadProvider, $stateProvider, $futureStateProvider) {

		$futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState', function ($q, $ocLazyLoad, futureState) {
			return $q.when(System['import'](futureState.src).then(function (loaded) {
				// this is the angular module
				if (loaded.name) {
					return $ocLazyLoad.load(loaded);
				}

				// this is the ES6 default export
				if (loaded.default) {
					return $ocLazyLoad.load(loaded.default);
				}

				var keys = Object.keys(loaded);
				return $ocLazyLoad.load(loaded[keys[0] === '__esModule' ? keys[1] : keys[0]]);
			})).then(angular.noop);
		}]);

		futureRoutes.forEach(function (r) {
			$futureStateProvider.futureState(r);
		});
	}];
};

module.exports = exports['default'];
