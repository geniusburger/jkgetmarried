<?php

function notify($subject, $message) {
    return mail('questions@jkgetmarried.com', $subject, $message, 'From: fyi@jkgetmarried.com' . "\n");
}

function notifyGuestbookSigned($name, $signature) {
    $message = "New guestbook signature\n\nname:\n" . $name . "\n\nmessage:\n" . $signature . "\n";
    return notify('Guestbook signed by ' . $name, $message);
}