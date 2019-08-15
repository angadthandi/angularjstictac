<?php


class GameModel
{
    protected $m_db = false;

    const FILE_NAME = "gametwoplayer.db";


    public function __construct()
    {
        $dbMissing = false;

        // check for an existing database file
        if (!file_exists(__DIR__ . DIRECTORY_SEPARATOR . static::FILE_NAME)){
            $dbMissing = true;
        }

        // create the PDO object to connect to the database
        $this->m_db = new PDO('sqlite:' . __DIR__ . DIRECTORY_SEPARATOR . static::FILE_NAME);
        $this->m_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // if the database file was missing, create the default set of tables and data
        if ($dbMissing){
            $this->bootstrapDatabase();
        }

        $this->m_db->exec('PRAGMA foreign_keys = ON;');
    }


    // Given an empty database, create the default tables and data. To start with, the database
    // contains a single table:
    //  ____________________________________________
    // |                                            |
    // | GameBoard                                  |
    // |____________________________________________|
    // |           |                     |          |
    // | id        | INTEGER PRIMARY KEY | NOT NULL |
    // | row_num   | INTEGER             | NOT NULL |
    // | col_num   | INTEGER             | NOT NULL |
    // | value     | INTEGER             | NULL     |
    // | color     | INTEGER             | NULL     |
    // |___________|_____________________|__________|
	//
    // Add another table for time and turn:
    //  ____________________________________________
    // |                                            |
    // | LastUpdate                                 |
    // |____________________________________________|
    // |           		|               |          |
    // | date_modified  | DATETIME      | NULL     |
    // | next_color     | INTEGER       | NULL     |
    // |________________|_______________|__________|
    //
    protected function bootstrapDatabase()
    {
        $this->m_db->exec('PRAGMA encoding = "UTF-16le";');
        $this->m_db->exec('PRAGMA application_id = 342;');
        $this->m_db->exec('PRAGMA foreign_keys = OFF;');

        // create the GameBoard table if it does not exist
		// color : 1 - blue, 2- red
        $this->m_db->exec(
            "CREATE TABLE IF NOT EXISTS GameBoard (
                id INTEGER PRIMARY KEY ASC AUTOINCREMENT NOT NULL,
                row_num INTEGER NOT NULL,
                col_num  INTEGER NOT NULL,
                value INTEGER NULL,
                color INTEGER NULL
            );"
        );
		
		// Angad
		$this->m_db->exec("CREATE UNIQUE INDEX IF NOT EXISTS uq_GameBoard ON GameBoard(row_num, col_num);");
		
		$this->m_db->exec(
            "CREATE TABLE IF NOT EXISTS LastUpdate (
                date_modified DATETIME NULL,
                next_color INTEGER NULL
            );"
        );


        // clear out the GameBoard table (sanity check in case the boostrapDatabase function is
        // called against an existing database)

        $this->m_db->exec("DELETE FROM GameBoard;");
        $this->m_db->exec("DELETE FROM LastUpdate;");


        // Insert standard game board rows
		// Angad
		$arr = array(0,1,2);
		foreach($arr as $val){
			for($i=0; $i<=2; $i++){
				$this->m_db->exec("INSERT INTO GameBoard (row_num, col_num, value, color) VALUES ($val, $arr[$i], NULL, NULL);");
			}
		}
		
		$date_modified = date('Y-m-d H:i:s');
		$this->m_db->exec("INSERT INTO LastUpdate (date_modified, next_color) VALUES ('".$date_modified."', 1);");
    }


    // Set a row/column cell value
    public function set($row, $col, $value, $color)
    {
		// Angad - check if the row col is already selected
		$arr = array();
		$dbRes = $this->m_db->query("SELECT row_num, col_num FROM GameBoard WHERE row_num = ".$row." AND col_num = ".$col." AND value = 1");
		foreach ($dbRes as $val) {
			$arr['row_col'] = $val['row_num'].$val['col_num'];
		}
		if(!empty($arr)){
			// Angad - if same row selected again - return false
			return false;
		} else {
			$ret = $this->m_db->exec(
				"UPDATE GameBoard SET value = " . $value
				. " , color = ".$color." WHERE row_num = " . $row . " AND col_num = " . $col
			);
			
			$next_color = 0;
			if($color==1){
				$next_color = 2;
			} else if($color==2){
				$next_color = 1;
			}
			$ret = $this->m_db->exec(
				"UPDATE LastUpdate SET date_modified = '" . date('Y-m-d H:i:s') . "' , next_color = ".$next_color
			);
		}

        return ($ret !== false);
    }


    /**
	 * Angad
	 * get already selected columns on page load / ajax refresh
	**/
    public function getSelections()
    {
        $result = array();
		$dbRes = $this->m_db->query("SELECT row_num, col_num, color FROM GameBoard WHERE value = 1");
		if(!empty($dbRes)){
			foreach ($dbRes as $row) {
				$result[]['row_col'] = array('row_col_val'=>$row['row_num'].$row['col_num'], 'color'=>$row['color']);
			}
			return $result;
		} else{
			return false;
		}
    }

    /**
	 * Angad
	 * get UN-selected columns on page load / ajax refresh
	**/
    public function getUnSelected()
    {
        $result = array();
		$dbRes = $this->m_db->query("SELECT row_num, col_num FROM GameBoard WHERE value != 1");
		if(!empty($dbRes)){
			foreach ($dbRes as $row) {
				$result[]['row_col'] = $row['row_num'].$row['col_num'];
			}
			return $result;
		} else{
			return false;
		}
    }
	
	// Angad - Set all row/column cell values to 0
    public function clearDB()
    {
        $value = 0;
		$ret = $this->m_db->exec(
			"UPDATE GameBoard SET value = " . $value . " , color = " . $value
		);
		
		$ret2 = $this->m_db->exec(
			"UPDATE LastUpdate SET date_modified = '' , next_color = 1"
		);

        return ($ret2 !== false);
    }
	
	// Angad - next turn
    public function nextTurn()
    {
		$result = array();
		$dbRes = $this->m_db->query("SELECT date_modified, next_color FROM LastUpdate");
		if(!empty($dbRes)){
			foreach ($dbRes as $row) {
				$date_modified = '';
				if(!empty($row['date_modified'])){
					$date_modified = date('M d, Y h:i:s A', strtotime($row['date_modified']));
				}
				$result['date_modified'] = $date_modified;
				$result['next_color'] = $row['next_color'];
			}
			return $result;
		} else{
			return false;
		}
    }
}


?>
