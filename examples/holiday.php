<?php
/* Holiday PHP handling */

// print_r($_POST);
$HOLIDAY_DATA_FILE = 'holiday.json';

$json = json_encode($_POST);
//echo $json;
$result = file_put_contents ( $HOLIDAY_DATA_FILE , $json );
$output = "{'result':{$result}}";
echo $output;
?>