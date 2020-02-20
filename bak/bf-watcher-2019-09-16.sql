-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+01:00";


--
-- Database: `bf-watcher`
--

DROP DATABASE IF EXISTS `bf-watcher`;
CREATE DATABASE `bf-watcher`;
USE `bf-watcher`;


CREATE TABLE `ava***REMOVED***ble` (
  `id` varchar(64) DEFAULT NULL,
  `site` varchar(64) DEFAULT NULL,
  `price` int(64) DEFAULT NULL,
  `rooms` float DEFAULT NULL,
  `area` float DEFAULT NULL,
  `url` varchar(360) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `info` JSON DEFAULT NULL
);

CREATE TABLE `removed` (
  `id` varchar(64) DEFAULT NULL,
  `site` varchar(64) DEFAULT NULL,
  `price` int(64) DEFAULT NULL,
  `rooms` float DEFAULT NULL,
  `area` float DEFAULT NULL,
  `url` varchar(360) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `removed` datetime DEFAULT NULL,
  `info` JSON DEFAULT NULL
);



--
-- Indexes for table `ava***REMOVED***ble`
--
ALTER TABLE `ava***REMOVED***ble`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

ALTER TABLE `removed`
 ADD PRIMARY KEY (`id`),
 ADD UNIQUE KEY `id` (`id`);