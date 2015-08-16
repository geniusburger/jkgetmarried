<?php

if (!class_exists('Table')) {
    require_once '../../php/Table.php';
}

class Gallery extends Table {

    const TABLE = "gallery";
    const DIR = "../../public_html/images/gallery";
    const TOOL_CMD = "exiftool.exe";
    const READ_CMD = " -k ";
    const CLEAN_CMD = " -all= -overwrite_original ";
    const CLEAN_LINES = 17;
    private $extensions = array();

    public function __construct($connection) {
        parent::__construct($connection);
        $this->extensions = array('jpg', 'bmp', 'png', 'gif');
    }

    // 17 lines

    private function clean($name) {
        $output = array();
        $file = escapeshellarg(self::DIR . '/' . $name);
        exec(self::TOOL_CMD . self::READ_CMD . $file, $output);
        if(count($output) > self::CLEAN_LINES) {
            exec(self::TOOL_CMD . self::CLEAN_CMD . $file);
            return 1;
        }
        return 0;
    }

    public function scan() {
        ini_set('max_execution_time', 180); //180 seconds = 3 minutes
        $count = 0;
        $deleted = 0;
        $cleaned = 0;
        if (is_dir(self::DIR)) {
            if ($dh = opendir(self::DIR)) {
                try {
                    $records = $this->read(false);
                    while (($file = readdir($dh)) !== false) {
                        if( $this->isImage($file)) {

                            $cleaned += $this->clean($file);

                            foreach ($records as $key => $img) {
                                if($img['name'] == $file) {
                                    unset($records[$key]);
                                    continue 2;
                                }
                            }

                            // TODO use tool to automatically remove meta data from files, is that possible?
                            $this->insert($file);
                            $count++;
                        }
                    }

                    foreach ($records as $img) {
                        $this->delete($img['name']);
                        $deleted++;
                    }

                    if(($deleted + $count) > 0) {
                        $this->write();
                    }
                } finally {
                    closedir($dh);
                }
            }
        }
        return array('added' => $count, 'deleted' => $deleted, 'cleaned' => $cleaned);
    }

    private function write() {
        $records = $this->read(true);
        $maxRatio = 0;
        $file = null;
        try {
            $file = fopen("../js/gallery.js", "w") or die("Unable to open file!");
            fwrite($file, "gallery = {" . PHP_EOL . "\timages : [" . PHP_EOL);
            $recordLen = count($records) - 1;
            for ($i=0; $i <= $recordLen; $i++) {
                $img = $records[$i];
                list($width, $height) = getimagesize(self::DIR . '/' . $img['name']);
                $ratio = $height / $width;
                if( $ratio > $maxRatio) {
                    $maxRatio = $ratio;
                }
                $end = ",";
                if($recordLen == $i) {
                    $end = "";
                }
                fwrite($file, "\t\t{"
                    . "name: '" . $this->sanitizeJs($img['name']) . "'"
                    . ", caption: '" . $this->sanitizeJs($img['caption']) . "'"
                    . ", width: " . $width
                    . ", height: " . $height
                    . "}" . $end . PHP_EOL);
            }
            fwrite($file, "\t]," . PHP_EOL . "\tmaxRatio: " . $maxRatio . PHP_EOL . "};" . PHP_EOL);
        } finally {
            if( !is_null($file)) {
                fclose($file);
            }
        }
    }

    private function sanitizeJs($text) {
        return str_replace("'", "\\'", $text);
    }

    private function exists($name) {
        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('SELECT 1 FROM ' . self::TABLE . ' WHERE name = ?');
            $stmt->bind_param('s', $name);
            $stmt->execute();
            $stmt->bind_result($exists);
            $stmt->fetch();
            return $exists == 1;
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

    private function isImage($name) {
        // get extension
        $parts = explode('.', $name);
        $size = sizeof($parts);
        if($size > 1) {
            $ext = array_pop($parts);
            if( in_array(strtolower($ext), $this->extensions)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param string $name The file name
     * @return bool <code>true</code> if successful
     */
    public function insert($name) {
        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('INSERT INTO ' . self::TABLE . ' (name) VALUES (?)');
            $stmt->bind_param('s', $name);
            return $stmt->execute();
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

    private function delete($name) {
        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('DELETE FROM ' . self::TABLE . ' WHERE name = ?');
            $stmt->bind_param('s', $name);
            return $stmt->execute();
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

    /**
     * @return bool <code>true</code> if successful
     */
    public function update() {
        $name = $this->params->getRequired('name');
        $show = strtolower($this->params->getRequired('show')) === 'true' ? 1 : 0;
        $caption = $this->params->getOptional('caption');

        $stmt = NULL;
        try {
            $stmt = $this->con->prepare('UPDATE ' . self::TABLE . ' SET visible = ?, caption = ? WHERE name = ?');
            $stmt->bind_param('iss', $show, $caption, $name);
            $success = $stmt->execute();
            if($success) {
                $this->write();
            }
            return $success;
        } finally {
            if( !is_null($stmt)) {
                $stmt->close();
            }
        }
    }

    public function read($shownOnly) {
        $resultSet = $this->con->query('SELECT name, visible, caption, updated_dtm FROM ' . self::TABLE . ($shownOnly ? ' WHERE visible = 1' : '') . ' ORDER BY name ASC');
        $results = array();
        while($row = mysqli_fetch_array($resultSet))
        {
            $results[] = array(
                'name' => $row['name'],
                'show' => $row['visible'] == 1,
                'caption' => $row['caption'],
                'isNew' => $row['updated_dtm'] == null
            );
        }
        return $results;
    }
} 