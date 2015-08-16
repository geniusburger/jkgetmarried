<?php

require_once 'Table.php';

class RequestLog {

    /**
     * @property mysqli
     */
    protected  $con;

    /**
     * @param mysqli $connection
     */
    public function __construct($connection) {
        $this->con = $connection;
    }

    private static function arrayToString($array) {
        $string = '';
        if( isset($array)) {
            foreach ($array as $key => $value) {
                if( !empty($string)) {
                    $string .= ',' . PHP_EOL;
                }
                $string .= $key . '=' . $value;
            }
        }
        return $string;
    }

    public function log() {

        $server = self::arrayToString($_SERVER);
        $post = self::arrayToString($_POST);

        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('INSERT INTO request_log (server, post) VALUES (?, ?)');
            $stmt->bind_param('ss', $server, $post);
            return $stmt->execute();
        } catch (Exception $e) {
            // ignore the error when logging
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

} 