<?php

class Response {

    public static function send($results) {
        echo json_encode(self::build($results));
    }

    /**
     * @param mixed $results
     * @return array JSON result
     */
    private static function build($results) {

        if( is_bool($results)) {
            return array('result' => $results ? 'success' : 'fail', 'type' => 'bool');
        }

        if( is_int($results)) {
            return array('result' => 'success', 'data' => $results, 'type' => 'int');
        }

        if( is_array($results)) {
            return array('result' => 'success', 'data' => $results, 'type' => 'array');
        }

        if( is_string($results)) {
            return array('result' => 'error', 'error' => $results, 'type' => 'string');
        }

        return array('result' => 'error', 'error' => 'Unknown error');
    }
} 