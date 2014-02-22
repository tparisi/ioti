<?php
/* Holiday PHP handling */

//print_r($_POST);
$action = $_GET['action'];
if ($action == 'save') {
	$device = $_GET['device'];
	$HOLIDAY_DATA_FILE = "../data/holiday{$device}.json";
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
else if ($action == 'upload') {

	$data = $_POST["lights"];

	print_r($data);
	
	$url = "http://holiday-ac3064.local/device/light/setlights";

	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
	echo ($query . "\n");
	// Make the REST call, returning the result
	$response = curl_exec($curl);
	if (!$response) {
		echo ("Failure: " . $response . "\n");
	}
	else {
		echo ("Success: " . $response . "\n");
	}
}
?>