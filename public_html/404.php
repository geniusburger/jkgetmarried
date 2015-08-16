<?php
    $path = $_SERVER['DOCUMENT_ROOT'];
    $path .= '/404.shtml';
    include $path;
    http_response_code(404);
?>