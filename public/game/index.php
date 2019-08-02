<?php

require_once(__DIR__ . "/../../app/GameService.inc.php");


// Prepare our output stream to return JSON instead of HTML

header("Pragma: no-cache");
header("Expires: 0");
header("Cache-Control: no-cache");
header("Content-Disposition: inline; filename=\"game.json\"");
header('Content-type: text/json; charset=UTF-8');


$request = new HttpRequest();
$request->verb = $_SERVER['REQUEST_METHOD'];

$game = new GameService();

switch($request->verb) {
    case HttpRequest::GET:
        $request->parameters = $_GET;

        $response = $game->read($request);

        break;
    case HttpRequest::POST:
        $request->parameters = json_decode(file_get_contents('php://input'), true);

        $response = $game->create($request);

        break;
    case HttpRequest::PUT:
        $request->parameters = json_decode(file_get_contents('php://input'), true);

        $response = $game->update($request);

        break;
    case HttpRequest::DELETE:
        $request->parameters = $_REQUEST;

        $response = $game->delete($request);

        break;
    default:
        $request = array();
}

// Convert the handler responses (PHP Arrays and Arrays of Arrays) to JSON and output it.
echo json_encode($response);//, JSON_PRETTY_PRINT);

?>