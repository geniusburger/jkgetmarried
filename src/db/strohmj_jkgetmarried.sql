
CREATE TABLE IF NOT EXISTS `guestbook` (
  `guestbook_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `inserted_dtm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dtm` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`guestbook_id`)
);

DROP TRIGGER IF EXISTS `guestbook_updated_dtm`;
DELIMITER //
CREATE TRIGGER `guestbook_updated_dtm` BEFORE UPDATE ON `guestbook`
 FOR EACH ROW SET NEW.updated_dtm = CURRENT_TIMESTAMP
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `honeymoon` (
  `honeymoon_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `message` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `inserted_dtm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dtm` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`honeymoon_id`)
);

DROP TRIGGER IF EXISTS `honeymoon_updated_dtm`;
DELIMITER //
CREATE TRIGGER `honeymoon_updated_dtm` BEFORE UPDATE ON `honeymoon`
 FOR EACH ROW SET NEW.updated_dtm = CURRENT_TIMESTAMP
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `rsvp` (
  `rsvp_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `going` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `food` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `inserted_dtm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dtm` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`rsvp_id`)
);

DROP TRIGGER IF EXISTS `rsvp_updated_dtm`;
DELIMITER //
CREATE TRIGGER `rsvp_updated_dtm` BEFORE UPDATE ON `rsvp`
 FOR EACH ROW SET NEW.updated_dtm = CURRENT_TIMESTAMP
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `request_log` (
  `request_log_id` int(11) NOT NULL AUTO_INCREMENT,
  `server` varchar(5000) COLLATE utf8_unicode_ci NOT NULL,
  `post` varchar(1000) COLLATE utf8_unicode_ci NOT NULL,
  `inserted_dtm` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_log_id`)
);
