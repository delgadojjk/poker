(function() {
  'use strict';

  angular
    .module('PokerApp')
    .factory('RulesService', RulesService);

  RulesService.$inject=[];
  function RulesService () {

    var SCORES_LOOKUP = {
      '1,1,1,1,1': { rank: 0, name: 'High Card'},
      '2,1,1,1': { rank: 1, name: 'One Pair'},
      '2,2,1': { rank: 2, name: 'Two Pairs'},
      '3,1,1': { rank: 3, name: 'Three of a Kind'},
      'S': { rank: 4, name: 'Straight'},
      'F': { rank: 5, name: 'Flush'},
      '3,2': { rank: 6, name: 'Full House'},
      '4,1': { rank: 7, name: 'Four of a Kind'},
      'SF': { rank: 8, name: 'Straight Flush'},
      'RF': { rank: 9, name: 'Royal Flush'}
    };
    var LETTTERS_TO_VALUES = {J: 11, Q: 12, K: 13, A: 14};

    var service = {
      scoreHand: scoreHand
    };

    return service;

    function scoreHand (cards) {
      var frequencies = _calcFrequencies(cards);
      var score = _getScore(frequencies);
      var sortedValues = _getSortedValues(frequencies);

      var scoreLookup = score.join(',');

      if (score.length === 5) {
        if (_isFlush(cards)) {
          scoreLookup = 'F';
        }
        if (sortedValues[0] - sortedValues[4] === 4) { // checking for Straight
          if (scoreLookup === 'F') {
            // Already Straight Flush, checking if higher rank
            if (sortedValues[0] === 14) {
              // Highest card is Ace
              scoreLookup = 'RF';
            } else {
              // Doesn't start with Ace, sets at Straight Flush
              scoreLookup = 'SF';
            }
          } else {
            // Not flush, sets at Straight
            scoreLookup = 'S';
          }
        }
      }

      return {
        score: SCORES_LOOKUP[scoreLookup],
        sortedValues: sortedValues
      };
    }

    function _calcFrequencies (cards) {
      var frequencies = {};
      cards.forEach(function (card) {
        if (!frequencies[card.number]) {
          frequencies[card.number] = 0;
        }
        frequencies[card.number] += 1;
      });
      return _mapAndSortFrequencies(frequencies);
    }

    function _mapAndSortFrequencies (frequencies) {
      return Object.keys(frequencies).map(function (value) {
        var mappedValue = LETTTERS_TO_VALUES[value] || parseInt(value);
        return [frequencies[value], mappedValue];
      })
      .sort(function (a, b) {
        if (a[0] === b[0]) {
          return (a[1] > b[1]) ? -1 : (a[1] < b[1]) ? 1 : 0;
        } else {
          return (a[0] > b[0]) ? -1 : 1;
        }
      });
    }

    function _getScore (frequencies) {
      return frequencies.map(function (freq) {
        return freq[0];
      });
    }

    function _getSortedValues (frequencies) {
      return frequencies.map(function (freq) {
        return freq[1];
      }).sort(function(a, b) {
        return b - a;
      });
    }

    function _isFlush (cards) {
      var baseSuit = cards[0].suit;
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].suit !== baseSuit) {
          return false;
        }
      }
      return true;
    }
  }
})();