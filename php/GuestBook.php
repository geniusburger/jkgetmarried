<?php

require_once 'Table.php';

class GuestBook extends Table {

    const TABLE = "guestbook";

    /**
     * @return bool <code>true</code> if successful
     */
    public function sign() {
        $name = $this->params->getRequired('name');
        $message = $this->params->getRequired('message');

        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('INSERT INTO ' . self::TABLE . '(name, message) VALUES (?, ?)');
            $stmt->bind_param('ss', $name, $message);
            $results = $stmt->execute();
            if( is_bool($results) && $results == TRUE) {
                return notifyGuestbookSigned($name, $message);
            } else {
                return $results;
            }
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

    public function read() {
        $resultSet = $this->con->query('SELECT name, message, inserted_dtm FROM ' . self::TABLE . ' ORDER BY inserted_dtm DESC');
        $results = array();
        while($row = mysqli_fetch_array($resultSet))
        {
            $results[] = array(
                'name' => $row['name'],
                'date' => $row['inserted_dtm'],
                'message' => $row['message']
            );
        }
        return $results;
    }
} 