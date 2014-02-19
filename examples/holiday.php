<?php
/* Holiday PHP handling */

//print_r($_POST);
if ($_GET['action'] == 'save') {
	$device = $_GET['device'];
	$HOLIDAY_DATA_FILE = "holiday{$device}.json";
	echo $HOLIDAY_DATA_FILE . "\n";
	print_r($_GET);
	$json = json_encode($_POST);
	//echo $json;
	//print_r($_POST['_h_0']['_f_0']);
	$json2 = json_encode($_POST["_h_0"]["_f_0"]);
	//echo $json2;
	$result = file_put_contents ( $HOLIDAY_DATA_FILE , $json );
	if ($result > 0) {
		echo '{"result":"ok", "bytesWritten": '.$result.'}';
	}
	else {
		echo '{"error":"error"}';
	}
}
else if ($_GET['action'] == 'upload') {
	$json = json_encode($_POST);
	//echo $json;
	//print_r($_POST['_h_0']['_f_0']);
	$json2 = json_encode($_POST["_h_0"]["_f_0"]);
	echo $json2;
}
?>