(function(){
    'use strict';

    BoardController.$inject = ['GameService', 'PlayerService', '$element'];

    function BoardController(GameService, PlayerService, $element) {
        var ctrl = this;

        // handleSelectedValues - sets colors for selected values
        ctrl.handleSelectedValues = function(selectedValues) {
            var i, cell, selColor;

            for (i=0; i<selectedValues.length; i++) {
                selColor = '';

                cell = document.getElementById(
                    'cell' +
                    selectedValues[i]['row_col']['row_col_val'].toString()
                );

                selColor = selectedValues[i]['row_col']['color'];

                if (cell !== null){
                    //cell.setAttribute('fill', '#00FF00');
                    cell.setAttribute('fill',
                        PlayerService.GetColorByPlayer(selColor));
                }

                // update player selections
                PlayerService.SavePlayerSelection(selColor,
                    selectedValues[i]['row_col']['row_col_val']);
            }
        };

        // handleUnSelectedValues - restores white on unselected ones
        ctrl.handleUnSelectedValues = function(unSelectedValues) {
            var j, cell;

            for (j=0; j<unSelectedValues.length; j++) {
                cell = document.getElementById(
                    'cell' +
                    unSelectedValues[j]['row_col'].toString()
                );

                if (cell !== null){
                    cell.setAttribute('fill', '#FFFFFF');
                }
            }
        };

        // handleTurn
        ctrl.handleTurn = function(nextTurn) {
            var next_color = document.getElementById('playerTurn'),
                p1YourTurnText = document.getElementById('p1YourTurnText'),
                p2YourTurnText = document.getElementById('p2YourTurnText'),
                nextTurnId = 'p' + nextTurn['next_color'] + 'YourTurnText',
                nextTurnElem = document.getElementById(nextTurnId),
                dateModified = document.getElementById('dateModified');

            //update turn
            next_color.value = nextTurn['next_color'];

            // update turn text
            p1YourTurnText.innerHTML = '';
            p2YourTurnText.innerHTML = '';
            nextTurnElem.innerHTML = 'Turn!';

            //update dateModified
            dateModified.innerHTML = nextTurn['date_modified'];
        };

        // handleClickResponse
        ctrl.handleClickResponse = function(data) {
            var playerTurn = document.getElementById('playerTurn').value,
                cell;

            if (data['set'] === true){
                cell = document.getElementById(
                    'cell' + data['row'].toString() + data['col'].toString()
                );

                if (cell !== null) {
                    cell.setAttribute('fill',
                        PlayerService.GetColorByPlayer(playerTurn));

                    PlayerService.UpdateTurn(
                        document.getElementById('playerTurn').value);
                }
            }
        };

        ctrl.cellOnClick = function(id) {
            if (!GameService.IsGameboardLocked()) {
                var cell = document.getElementById(id.toString()),
                    playerTurn = document.getElementById('playerTurn').value,
                    data = {
                        'row': parseInt(cell.id[4]),
                        'col': parseInt(cell.id[5]),
                        'color': playerTurn
                    };

                GameService.CellOnClick(data).
                    then(function(responseData) {
                        ctrl.handleClickResponse(responseData);
                    });
            }
        };

        //subscribe on update turn callback
        GameService.onGetSelections(function(data) {
            ctrl.handleSelectedValues(data['selectedValues']);

            ctrl.handleUnSelectedValues(data['unSelectedValues']);

            ctrl.handleTurn(data['nextTurn']);
        });

        // TODO - Maybe this func can be passed in as a binding,
        // from parent component.
        // Then we can get rid-off the require.
        // 
        // init function
        ctrl.init = function() {
            ctrl.gameComponent.initializeGameBoard();
        };

        ctrl.$onInit = function() {
            ctrl.init();
        };

        ctrl.$onChanges = function() {

        };
    }

    angular.module('TicTacApp').
        component('boardComponent', {
            templateUrl: '/img/gameboard.svg',
            controller: BoardController,
            controllerAs: '$ctrl',
            bindings: {
                
            },
            require: {
                gameComponent: '^^gameComponent'
            }
        });

})();