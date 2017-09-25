const NO_IMAGE = 'http://54.186.103.202/default-user.jpg';

angular
	.module('app.controllers', ['ng-token-auth', 'ngMap', 'ionic.native', 'ngMessages'])

	.controller('appController', ['$auth', '$scope', '$state', 'Message',
		function($auth, $scope, $state, Message) {
			$scope.messageCount = 0;
			$scope.user = $auth.user;
			$scope.logout = () => $auth.signOut().then($state.go('login'));
			$scope.$on('$ionicView.afterEnter', () => {
				Message.getMessages()
					.success(() => $scope.messageCount = Message.unviewedCount());
			});

	    setInterval(() => {
	      console.log('update notification task executing every 30 seconds');
				Message.getMessages()
					.success(() => $scope.messageCount = Message.unviewedCount());
	    }, 30000);  //120000 --> 2min //30000 --> 30segs
	}])

	.controller('pendingController', ['$auth', '$scope', '$state', 'Assistance', 
		function($auth, $scope, $state, Assistance) {
			$scope.pending = Assistance.all();
			$scope.$on('$ionicView.afterEnter', () => {
				Assistance.getAssistances()
					.success(() => {$scope.pending = Assistance.pending()});
			});
			$scope.openAssistanceDetail = (assistance) => {
				$state.go("assistances.assistanceDetails", {id: assistance.id})
			};
	}])

	.controller('acceptedController', ['$auth', '$scope', '$state', 'Assistance', 
		function($auth, $scope, $state, Assistance) {
			$scope.accepted = Assistance.all();
			$scope.$on('$ionicView.afterEnter', () => {
				Assistance.getAssistances()
					.success(() => $scope.accepted = Assistance.accepted());
			});
			$scope.openAssistanceDetail = (assistance) => {
				$state.go("assistances.assistanceDetails", {id: assistance.id})
			};
	}])

	.controller('assistanceDetailsController', ['$scope', '$state', '$auth', '$ionicPopup', '$ionicLoading', 'assistance', 'Assistance', // 'assistanceId',
		function ($scope, $state, $auth, $ionicPopup, $ionicLoading, assistance, Assistance) {//, assistanceId
			$scope.assistance = assistance;
			$scope.mins = 30;
			$scope.acceptAssistance = (assistance) => {
				$ionicPopup.show({
					cssClass: 'shipment-popup',
					templateUrl: 'templates/acceptAssignmentDialog.html',
					title: 'Aceptar asignación',
					scope: $scope,
					buttons: [
						{ text: 'Cancelar', type: 'button-dark' },
						{ text: '<b>Aceptar</b>', type: 'button-calm',
							onTap: () => {
								$scope.confirmAssistance();
							}
						}
					]
				});
			};
			$scope.confirmAssistance = () => {
				$ionicLoading.show({
					template: '<p class="item-icon-left">Aceptando asistencia...<ion-spinner icon="crescent"/></p>'
				});
				Assistance
					.accept($scope.assistance.id, $auth.user.id, $scope.mins)
					.success(() => { $state.go('tabs.accepted'); $scope.assistance.state = 'accepted'; })
					.finally(() => $ionicLoading.hide());
			};
			$scope.sumMins = () => {
				if ($scope.mins < 60) {
					$scope.mins = $scope.mins + 5;
				}
			};
			$scope.lessMins = () => {
				if ($scope.mins > 0) {
					$scope.mins = $scope.mins - 5;
				}
			};
	}])

	.controller('messagesController', ['$auth', '$scope', 'Message', 
		function($auth, $scope, Message) {
			$scope.messages = Message.all();
			$scope.$on('$ionicView.afterEnter', () => {
				Message.getMessages()
					.success(() => $scope.messages = Message.all());
				Message.markAllAsViewed();
			});
			$scope.messageDetails = (message) => {
				Message.markAsRead(message.id)
					.success(() => {});
			}
	}])

	.controller('splashCtrl', ['$auth', 'Fetcher', '$state', '$timeout', '$ionicHistory',
	function($auth, Fetcher, $state, $timeout, $ionicHistory) {
		$ionicHistory.nextViewOptions({
			disableAnimate: true,
			disableBack: true
		});
		$auth.validateUser()
			.then(() => Fetcher.initApp())
			.then(() => $state.go('tabs.help'))
			.catch(() => $timeout(() => $state.go('login',{}, {reload: true}), 1200));
	}])

	.controller('loginCtrl', ['$scope', '$auth', '$state', '$ionicLoading', 'Fetcher', '$ionicPopup',
	function ($scope, $auth, $state, $ionicLoading, Fetcher, $ionicPopup) {
		$scope.user = {
			email: "",
			password: ""
		};

		$scope.login = () => {
			$ionicLoading.show({
				template: '<p class="item-icon-left">Iniciando sesión...<ion-spinner icon="crescent"/></p>'
			});
			$auth.submitLogin($scope.user)
				.then((data) => {
					Fetcher.initApp();
					$state.go("tabs.help")
				})
				.catch((err) => {
					console.error("login error", err);
					$ionicPopup.alert({
						cssClass: 'shipment-alert',
						title: 'Error al iniciar sesión',
						template: 'Email o contraseña incorrecto. Intente de nuevo',
						okType: 'button-positive button-clear'
					});
				})
				.finally(() => $ionicLoading.hide());
		};
	}])
