(function(){
    'use strict';
    
    angular.module('TicTacApp').
        service('PlayerService', PlayerService);
    
    PlayerService.$inject = ['$http', 'GameService'];
    function PlayerService($http, GameService) {
        var service = this,
            playerColors = {
                'PlayerOneColor': '#0000FF',
                'PlayerTwoColor': '#FF0000'
            };

        service.callbacks = [];

        // register listeners
        service.onUpdateTurn = function(callback){
            service.callbacks.push(callback);
        };

        service.GetPlayerColors = function() {
            return playerColors;
        };

        service.GetColorByPlayer = function(playerTurn) {
            var playerColor = '';

            switch (parseInt(playerTurn)) {
                case 1:
                    playerColor = playerColors.PlayerOneColor;
                    break;
                case 2:
                    playerColor = playerColors.PlayerTwoColor;
                    break;
            }

            return playerColor;
        };

        service.UpdateTurn = function(currTurn) {
            var i=0, ret;

            switch (parseInt(currTurn)) {
                case 1:
                    ret = 2;
                    break;
                case 2:
                    ret = 1;
                    break;
            }

            //notify if there are any listeners
            for(i=0; i<service.callbacks.length; i++) {
                service.callbacks[i](ret);
            }

            return ret;
        };

        // TODO - remove DOM manipulation
        service.SavePlayerSelection = function(playerId, rowCol) {
            var playerElemId = 'player'+playerId+'Selections',
                playerCurrVal = document.getElementById(playerElemId).value,
                playerNewVal = document.getElementById(playerElemId);

            if(playerCurrVal=='') {
                playerNewVal.value = rowCol;
            }
            else {
                var currArr = playerCurrVal.split(','),
                    exists = currArr.indexOf(rowCol);

                if(exists == -1){
                    playerNewVal.value = playerCurrVal+','+rowCol;
                }

                GameService.CalcWinner(playerId, playerCurrVal+','+rowCol);
            }
        };
    }
})();