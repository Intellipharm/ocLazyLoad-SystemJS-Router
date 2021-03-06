import 'angular';
import 'angular-ui-router';
import 'ui-router-extras/release/modular/ct-ui-router-extras.core';
import 'ui-router-extras/release/modular/ct-ui-router-extras.future';
import 'oclazyload';

export default function(angularModule, futureRoutes) {

	angularModule.requires.push(
		'ui.router',
		'ct.ui.router.extras.core',
		'ct.ui.router.extras.future',
		'oc.lazyLoad'
	)

	// RouterConfig
	return ['$ocLazyLoadProvider', '$stateProvider', '$futureStateProvider',
		function($ocLazyLoadProvider, $stateProvider, $futureStateProvider) {

			$futureStateProvider.stateFactory('load', ['$q', '$ocLazyLoad', 'futureState',
				function($q, $ocLazyLoad, futureState) {
					return $q.when(System.import(futureState.src).then((loaded) => {
						if (loaded.name) {
							return $ocLazyLoad.load(loaded)
						} else {
							var keys = Object.keys(loaded)
							return $ocLazyLoad.load(loaded[keys[0] === '__esModule' ? keys[1] : keys[0]])
						}
					})).then(angular.noop);
				}
			]);

			futureRoutes.forEach(function(r) {
				$futureStateProvider.futureState(r);
			});
		}
	];
}
