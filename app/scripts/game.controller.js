(function () {
	
	angular.module('PokerApp')

	.controller('GameController', GameController);

	GameController.$inject=['DealerService','RulesService'];
	function GameController(DealerService,RulesService) {
		var game= this;		
		game.shuffle = function(){
			game.message="Shuffling deck";
		    game.error='';		
			console.log("ENTRO game.message");		
			return DealerService.deck()
				   .catch(function(error){
				   	game.error=error;
				   })
				   .finally(function(){
				   	game.message='';
				   });
		};


		game.deal= function(){
			game.message='Dealing Card';
			game.error='';
			game.hand1 = null;
      		game.hand2 = null;
      		game.message='';
      		game.winner='';

			
			return DealerService.getCardSet()
				   .then(function(cards){
				   	//console.log( JSON.stringify(cards[0]));

				    var hands = cards.map(function (cards1, idx) {
			          var hand = RulesService.scoreHand(cards1);
			          hand['cards'] = cards1;
			          hand['playerName'] = 'Player ' + (idx + 1);
			          return hand;
			        });

				  				   	
				   	game.hand1 = hands[0];
        			game.hand2 = hands[1];
        			console.log( JSON.stringify(game.hand1));

        			var winnerHand = _getWinner(hands);

        			game.winner = winnerHand.playerName + ' wins!';

				   })
				   .catch(function(error){
				   	game.error=error;
				   })
				   .finally(function(){
				   	game.message='';
				   });
		};


		function _getWinner (hands) {
		      return hands.sort(function (a, b) {
		        if (a.score.rank === b.score.rank) {
		          return (a.score.sortedValues > b.score.sortedValues) ? -1 : 1;
		        } else {
		          return (a.score.rank > b.score.rank) ? -1 : 1;
		        }
		      })[0];
    	}


		game.shuffle();
			
	}

})();