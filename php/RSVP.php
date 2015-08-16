<?php

require_once 'Table.php';

class RSVP extends Table {

    const TABLE = "rsvp";

    /**
     * @return bool <code>true</code> if successful
     */
    public function respond() {
        $name = $this->params->getRequired('name');
        $going = $this->params->getRequired('going');
        $food = $this->params->getRequired('food');
        $message = $this->params->getOptional('message');

        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('INSERT INTO ' . self::TABLE . '(name, going, food, message) VALUES (?, ?, ?, ?)');
            $stmt->bind_param('ssss', $name, $going, $food, $message);
            return $stmt->execute();
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }
} 