(function(){
    'use strict';

    GameController.$inject = ['GameService', '$timeout'];

    function GameController(GameService, $timeout) {
        var ctrl = this;
        ctrl.defaultFetchInterval = 1000;

        ctrl.watchForUpdates = function() {
            // Call the update check after the timeout elapses
            var watchForUpdatesPromise =
                $timeout(ctrl.initializeGameBoard, ctrl.defaultFetchInterval);

            // Have the promise set the next watch after the check is done
            watchForUpdatesPromise.finally(
                function(result){
                    ctrl.watchForUpdates();
                }
            );
        };

        // clearDB
        ctrl.clearDB = function() {
            GameService.ClearDB().
                then(function(responseData) {
                    ctrl.clearRowCols(responseData);

                    GameService.ResetGameboard();
                });
        };

        // clearRowCols
        ctrl.clearRowCols = function(data) {
            var player1Sel = document.getElementById('player1Selections'),
                player2Sel = document.getElementById('player2Selections'),
                notices = document.getElementById('notices'),
                cell, j;

            for (j=0; j<data['unSelectedValues'].length; j++) {
                cell = document.getElementById(
                    'cell' +
                    data['unSelectedValues'][j]['row_col'].toString()
                );

                if (cell !== null){
                    cell.setAttribute('fill', '#FFFFFF');
                }
            }

            // clear player selections
            player1Sel.value = '';
            player2Sel.value = '';
            notices.innerHTML = '';
        };

        // init function
        ctrl.initializeGameBoard = function() {
            return GameService.GetSelections();
        };

        ctrl.$onInit = function() {
            ctrl.watchForUpdates();
        };

        ctrl.$onChanges = function() {

        };
    }

    angular.module('TicTacApp').
        component('gameComponent', {
            templateUrl: '/js/components/game/game.template.html',
            controller: GameController,
            controllerAs: '$ctrl',
            bindings: {
                
            }
        });

})();