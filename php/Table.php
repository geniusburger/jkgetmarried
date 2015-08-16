<?php

class Table {

    /**
     * @property mysqli
     */
    protected  $con;

    /**
     * @property Validator
     */
    protected $params;

    /**
     * @param mysqli $connection
     */
    public function __construct($connection) {
        $this->con = $connection;
        $this->params = new Validator($_POST);
    }
} 