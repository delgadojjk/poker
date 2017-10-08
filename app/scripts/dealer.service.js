(function(){
	
	'use strict';

	angular.module('PokerApp')
	.factory('DealerService', DealerService);

	DealerService.$inject=['$http','$q','ServerPath'];

	function DealerService($http,$q,ServerPath){	
		var service=this;
		var token='';

		service.deck=function(){
			console.log("Desde DealerService");
			return $http.post(ServerPath+'/deck')
			       .then(function (response){
			       	token=response.data;
			       	 return token;
			       })
			       .catch(function(){
			       	return $q.reject('Please Try again. Could not shuffle deck.');
			       });

		};


		service.getCardSet=function(){
			if (!token){
				return $q.reject('It is necessary to shuffle the deck before dealing cards.');
			}
			return $http.get(ServerPath + '/deck/' +token+'/deal/10')
				   .then(function(response){
				   	return [response.data.slice(0,5),response.data.slice(5,10)];
				   })
				   .catch(function(error){
				   	   return $q.reject('error error.status '+error.status);	
				   });
		};



		return service;

	}
})();