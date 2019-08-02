(function(){
    'use strict';
    
    angular.module('TicTacApp').
        service('GameService', GameService);
    
    GameService.$inject = ['$http', 'UniqueArrayFilter'];
    function GameService($http, UniqueArrayFilter) {
        var service = this;

        service.gameboardLocked = false;
        service.callbacks = [];

        service.IsGameboardLocked = function() {
            return service.gameboardLocked;
        };

        service.ResetGameboard = function() {
            service.gameboardLocked = false;
        };

        // register listeners
        service.onGetSelections = function(callback) {
            service.callbacks.push(callback);
        };

        service.GetSelections = function() {
            return $http.get('game').
                then(function(response) {
                    var i = 0;

                    //notify if there are any listeners
                    for(i=0; i<service.callbacks.length; i++) {
                        service.callbacks[i](response.data);
                    }

                    return response.data;
                }).
                catch(function(error){
                    console.log(error);
                    return false;
                });
        };

        service.CellOnClick = function(data) {
            return $http.put(
                    'game', JSON.stringify(data)
                ).
                then(function(response) {
                    return response.data;
                }).
                catch(function(error){
                    console.log(error);
                    return false;
                });
        };

        service.ClearDB = function(data) {
            return $http.delete(
                    'game', true
                ).
                then(function(response) {
                    return response.data;
                }).
                catch(function(error){
                    console.log(error);
                    return false;
                });
        };

        // our layout
        //  00 | 01 | 02
        // ----+----+----
        //  10 | 11 | 12
        // ----+----+----
        //  20 | 21 | 22

        //Le Magic Square\\ 
        //------------//
        //  8 | 3 | 4 //
        //----+---+---//
        //  1 | 5 | 9 //
        //----+---+---//
        //  6 | 7 | 2 //
        //------------//

        // TODO - remove DOM manipulation
        // 
        // sum of indexes needs to be 15 to win
        service.CalcWinner = function(playerId, rowColStr) {
            var rowColArr = rowColStr.split(',');
            rowColArr = UniqueArrayFilter(rowColArr);

            if(rowColArr.length >= 3) {
                var arr = ['','10','22','01','02','11','20','21','00','12'],
                    i1 = arr.indexOf(rowColArr[0]),
                    i2 = arr.indexOf(rowColArr[1]),
                    i3 = arr.indexOf(rowColArr[2]),
                    sum = parseInt(i1) + parseInt(i2) + parseInt(i3);

                if(sum == 15) {
                    var win = document.getElementById('notices');
                    win.innerHTML = 'Player '+playerId+' Wins!';

                    service.gameboardLocked = true;
                }
            }
        };
    }
})();