(function(){
    'use strict';

    PlayerController.$inject = ['PlayerService'];

    function PlayerController(PlayerService) {
        var ctrl = this;

        //subscribe on update turn callback
        PlayerService.onUpdateTurn(function(data) {
            document.getElementById('playerTurn').value = data;
        });

        ctrl.$onInit = function() {

        };

        ctrl.$onChanges = function() {

        };
    }

    angular.module('TicTacApp').
        component('playerComponent', {
            templateUrl: '/js/components/player/player.template.html',
            controller: PlayerController,
            controllerAs: '$ctrl',
            bindings: {
                
            }
        });
})();