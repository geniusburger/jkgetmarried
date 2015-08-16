<?php

include 'creds.php';

class Database {

    /**
     * @property mysqli $connection
     */
    private $connection;

    public function __construct() {
        global $creds;
        $this->connection = mysqli_connect( $creds['host'], $creds['user'], $creds['pass'], $creds['name']);
        ob_clean();
        if (mysqli_connect_errno()) {
            throw new JkException("Failed to connect to DB: " . mysqli_connect_error());
        }
    }

    /**
     * @return mysqli
     */
    public function getConnection() {
        return $this->connection;
    }

    public function close() {
        mysqli_close($this->connection);
    }
} 