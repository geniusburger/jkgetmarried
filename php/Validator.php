<?php

class Validator {

    private $objectToValidate;

    public function __construct(&$objectToValidate) {
        $this->objectToValidate = $objectToValidate;
    }

    private static function sanitize($raw) {
        return htmlspecialchars(trim($raw));
    }

    public function getRequired($property) {
        $value = $this->objectToValidate[$property];
        if( isset($value)) {
            $value = self::sanitize($value);
            if( !empty($value)) {
                return $value;
            }
        }
        throw new JkException('Missing required property');
    }

    public function getOptional($property) {
        $value = $this->objectToValidate[$property];
        if( isset($value)) {
            $value = self::sanitize($value);
            if( empty($value)) {
                return NULL;
            }
            return $value;
        }
        return NULL;
    }
} 