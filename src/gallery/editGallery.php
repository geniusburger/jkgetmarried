<?php

require_once '../../php/JkException.php';
require_once '../../php/Database.php';
require_once '../../php/Validator.php';
require_once '../../php/GuestBook.php';
require_once '../../php/Response.php';
require_once 'Gallery.php';

$db = NULL;

try {
    $db = new Database('root', '');
    $con = $db->getConnection();

    if( strtolower($_SERVER['REQUEST_METHOD']) != 'post' || empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        header('HTTP/1.0 404 Not Found');
        readfile('../../public_html/404.shtml');
        return;
    }

    $action = (new Validator($_POST))->getRequired('action');
    switch($action) {
        case 'save':
            Response::send((new Gallery($con))->update());
            break;
        case 'scan':
            Response::send((new Gallery($con))->scan());
            break;
        case 'read':
            Response::send((new Gallery($con))->read(false));
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