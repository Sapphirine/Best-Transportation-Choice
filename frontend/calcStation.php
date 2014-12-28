<?php
/*
####################################################
# Columbia University
# Department of Electrical Engineering
# Big Data - Final Project
# Fall 2014
# Andre Cunha
# Joseph Machado 
# Xia Shang
# Zhao Pan
####################################################
*/
	header( 'Cache-Control: no-cache' );
	header( 'Content-type: application/xml; charset="utf-8"', true );

function Exec_BD($query,$dbase){
	$host = 127.0.0.1;
	$login = 'root';
	$password = 'password';
	
	$link = mysql_connect($host,$login,$password) or die(mysql_error());
	
	mysql_select_db("$dbase") or die(mysql_error());
	$result = mysql_query($query) or die(mysql_error()." ".$query);
	mysql_close($link);
	return $result;
}

	$dbase = 'MTA_private';
	$destination = $_REQUEST['destination'];
	$direction = $_REQUEST['direction'];
	$steps = $_REQUEST['steps'];
	
	$output = array();
	
	$sql = "SELECT id, station_name, avg_delay, grade
			FROM MTA WHERE longitude = '$destination'";
			
	$res = Exec_BD($sql,$dbase);
	while ( $row = mysql_fetch_assoc( $res ) ) {
		$output = array(
			'station_name'	=> $row['station_name'],
			'avg_delay' => $row['avg_delay'],
			'grade' => $row['grade']
		);
			
		for ($i= 1; $i <= $steps; $i++){
		  if (strpos($direction,'south') !== false) {
		      $id = $row['id'] + $i;
		      $sql_south = "SELECT station_name, avg_delay, grade
			FROM MTA WHERE id = '$id'";
			
		      $res_south = Exec_BD($sql_south,$dbase);
		      while ( $row = mysql_fetch_assoc( $res ) ) {
			$output = array(
			  'station_name'	=> $row['station_name'],
			  'avg_delay' => $row['avg_delay'],
			  'grade' => $row['grade']
			);
		      
		      }
		      
		  }else{
		      $id = $row['id'] - $i;
		      $sql_south = "SELECT station_name, avg_delay, grade
			FROM MTA WHERE id = '$id'";
			
		      $res_south = Exec_BD($sql_south,$dbase);
		      while ( $row = mysql_fetch_assoc( $res ) ) {
			$output = array(
			  'station_name'	=> $row['station_name'],
			  'avg_delay' => $row['avg_delay'],
			  'grade' => $row['grade']
			);
		      
		      }
		  
		  }
			
		}
	}
	echo( json_encode( $output ) );
	
?>
