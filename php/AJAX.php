<?php

require_once 'JkException.php';
require_once 'notify.php';
require_once 'Database.php';
require_once 'RSVP.php';
require_once 'Validator.php';
require_once 'GuestBook.php';
require_once 'Response.php';
require_once 'RequestLog.php';

$db = NULL;

try {
    $db = new Database();
    $con = $db->getConnection();

    (new RequestLog($con))->log();

    if( strtolower($_SERVER['REQUEST_METHOD']) != 'post' || empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        header('HTTP/1.0 404 Not Found');
        readfile('../public_html/404.shtml');
        return;
    }

    $action = (new Validator($_POST))->getRequired('action');
    switch($action) {
        case 'rsvp':
            Response::send((new RSVP($con))->respond());
            break;
        case 'sign':
            Response::send((new Guestbook($con))->sign());
            break;
        case 'read':
            Response::send((new Guestbook($con))->read());
            break;
        default:
            Response::send('unsupported action');
            break;
    }
} catch (JkException $e) {
    Response::send($e->getMessage());
} catch (Exception $e) {
    Response::send('error');
} finally {
    if( !is_null($db)) {
        $db->close();
    }
}