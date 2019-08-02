
(function(){

    var xhr;
	
	// Angad
	var playerOneColor = '#0000FF';
	var playerTwoColor = '#FF0000';

    // click event handler for game board cells
    function cellOnClick()
    {
        var playerTurn = document.getElementById('playerTurn').value;
		
		var data = {
            'row': parseInt(this.id[4]),
            'col': parseInt(this.id[5]),
            'color': playerTurn
        };

        xhr = new XMLHttpRequest();

        // callback for responses
        xhr.onreadystatechange = clickResponse;

        // prep ajax request
        xhr.open('PUT', 'game/', true);
        xhr.setRequestHeader('Content-Type', 'text/json');

        // send ajax request
        xhr.send(JSON.stringify(data));
    }


    // response for click event ajax call
    function clickResponse()
    {
        var response, cell, svg = document.getElementById('gameboard').contentDocument;
		
		var playerTurn = document.getElementById('playerTurn').value;

        // if the state is complete
        if (xhr.readyState === 4){
            // if the request succeeded in HTTP terms
            if (xhr.status === 200){
                // parse the response

                response = JSON.parse(xhr.responseText);

                // if the response indicates success, change the cell appearance
                if (response['set'] === true){
                    cell = svg.getElementById(
                        'cell' + response['row'].toString() + response['col'].toString()
                    );

                    if (cell !== null){
                        //cell.setAttribute('fill', '#00FF00');
                        cell.setAttribute('fill', colorByPlayer(playerTurn));
						updateTurn();
                    }
                }
            }
            else{
                console.log('There was an error interacting with the game service.');
            }
        }
    }


    // init function
    function initializeGameBoard()
    {
        var svg = document.getElementById('gameboard').contentDocument,
            row, col, cell;
		
		// attach a click event callback to every clickable game board cell. Cells are named
        // 'cellXY' where X and Y are the row and column respectively from the top corner.
        //
        //  00 | 01 | 02
        // ----+----+----
        //  10 | 11 | 12
        // ----+----+----
        //  20 | 21 | 22


        for (row = 0; row < 3; row++){
            for (col = 0; col < 3; col++){
                cell = svg.getElementById('cell' + row.toString() + col.toString());

                if (cell !== null){
                    cell.addEventListener('click', cellOnClick);
                }
            }
        }
		
		// Angad
		getSelections();

    }
	
	// Angad
	function getSelections(){
		var responseData;
		
		xhr = new XMLHttpRequest();
		
		xhr.onreadystatechange = onLoadResponse;
		
        xhr.open("GET","game/",true);
		xhr.send();
	}
	
	// Angad
	function onLoadResponse(){
		var svg = document.getElementById('gameboard').contentDocument;
		
		if (xhr.readyState === 4){
            if (xhr.status === 200){
				responseData = JSON.parse(xhr.responseText);
				for (i=0;i<responseData['selectedValues'].length;i++) {
					var selColor = '';
					
					cell = svg.getElementById(
						'cell' + responseData['selectedValues'][i]['row_col']['row_col_val'].toString()
					);
					
					selColor = responseData['selectedValues'][i]['row_col']['color'];

					if (cell !== null){
						//cell.setAttribute('fill', '#00FF00');
						cell.setAttribute('fill', colorByPlayer(selColor));
					}
					
					// update player selections
					savePlayerSelection(selColor, responseData['selectedValues'][i]['row_col']['row_col_val']);
				}
				
				// restore white on unselected ones
				for (j=0;j<responseData['unSelectedValues'].length;j++) {
					cell = svg.getElementById(
						'cell' + responseData['unSelectedValues'][j]['row_col'].toString()
					);

					if (cell !== null){
						cell.setAttribute('fill', '#FFFFFF');
					}
				}
				
				//update turn
				var next_color = document.getElementById('playerTurn');
				next_color.value = responseData['nextTurn']['next_color'];
				
				// update turn text
				var p1YourTurnText = document.getElementById('p1YourTurnText');
				p1YourTurnText.innerHTML = '';
				var p2YourTurnText = document.getElementById('p2YourTurnText');
				p2YourTurnText.innerHTML = '';
				var nextTurnId = '';
				nextTurnId = 'p'+responseData['nextTurn']['next_color']+'YourTurnText';
				var nextTurnElem = document.getElementById(nextTurnId);
				nextTurnElem.innerHTML = 'Turn!';
				
				//update dateModified
				var dateModified = document.getElementById('dateModified');
				dateModified.innerHTML = responseData['nextTurn']['date_modified'];
			}
		}
	}
	
	
	// Angad - refresh every second
	setInterval(function refreshGameTwo(){
		var responseData;
		
		xhr = new XMLHttpRequest();
		
        // callback for responses
        xhr.onreadystatechange = onLoadResponse;
		
		xhr.open("GET","game/index.php?t=" + Math.random(),true);
		xhr.send();
	},1000);
	
	// Angad - get clear button
	var clearButton = document.getElementById("clearButton");
	if (clearButton.addEventListener) {
		clearButton.addEventListener("click", clearDB, false);
	} else {
		clearButton.attachEvent("onclick", clearDB);
	}
	
	// Angad
	function clearDB(){
		var responseData;
		
		xhr = new XMLHttpRequest();
		
        // callback for responses
        xhr.onreadystatechange = clearRowCols;
		
		xhr.open("DELETE","game/",true);
		xhr.send();
	}
	
	// Angad
	function clearRowCols(){
		var svg = document.getElementById('gameboard').contentDocument;
		
		if (xhr.readyState === 4){
            if (xhr.status === 200){
				responseData = JSON.parse(xhr.responseText);
				for (j=0;j<responseData['unSelectedValues'].length;j++) {
					cell = svg.getElementById(
						'cell' + responseData['unSelectedValues'][j]['row_col'].toString()
					);

					if (cell !== null){
						cell.setAttribute('fill', '#FFFFFF');
					}
				}
				
				// clear player selections
				var player1Sel = document.getElementById('player1Selections');
				player1Sel.value = '';
				var player2Sel = document.getElementById('player2Selections');
				player2Sel.value = '';
				var notices = document.getElementById('notices');
				notices.innerHTML = '';
			}
		}
	}
	
	//Angad
	function colorByPlayer(playerTurn){
		var playerColor = '';
		if(playerTurn==1){
			playerColor = playerOneColor;
		} else if(playerTurn==2){
			playerColor = playerTwoColor;
		}
		return playerColor;
	}
	
	//Angad
	function updateTurn(){
		var turn = document.getElementById('playerTurn');
		if(turn==1) {
			turn.value = 2;
		} else if(turn==1) {
			turn.value = 1;
		}
	}
	
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
	
	// sum of indexes needs to be 15 to win
	
	// Angad
	function calcWinner(playerId, rowColStr){
		var rowColArr = rowColStr.split(',');
		if(rowColArr.length>=3){
			var arr = ['','10','22','01','02','11','20','21','00','12'];
			var i1 = arr.indexOf(rowColArr[0]);
			var i2 = arr.indexOf(rowColArr[1]);
			var i3 = arr.indexOf(rowColArr[2]);
			var sum = parseInt(i1)+parseInt(i2)+parseInt(i3);
			if(sum==15){
				var win = document.getElementById('notices');
				win.innerHTML = 'Player '+playerId+' Wins!';
			}
		}
	}
	
	function savePlayerSelection(playerId, rowCol){
		var playerElemId = 'player'+playerId+'Selections';
		var playerCurrVal = document.getElementById(playerElemId).value;
		var playerNewVal = document.getElementById(playerElemId);
		if(playerCurrVal==''){
			playerNewVal.value = rowCol;
		} else {
			var currArr = playerCurrVal.split(',');
			var exists = currArr.indexOf(rowCol);
			if(exists == -1){
				playerNewVal.value = playerCurrVal+','+rowCol;
			}
			calcWinner(playerId, playerCurrVal+','+rowCol);
		}
	}


    window.onload = initializeGameBoard;

})();
