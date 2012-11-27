-- MySQL dump 10.13  Distrib 5.1.61, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: dms_development
-- ------------------------------------------------------
-- Server version	5.1.61-rel13.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `document_histories`
--

DROP TABLE IF EXISTS `document_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_histories`
--

LOCK TABLES `document_histories` WRITE;
/*!40000 ALTER TABLE `document_histories` DISABLE KEYS */;
INSERT INTO `document_histories` VALUES (1,'103420121342000125','add inquiry','weidongshao@gmail.com','10.0.2.2',3,'2012-03-20 01:38:44','2012-03-20 01:38:44'),(2,'103420121342000125','add inquiry','weidongshao@gmail.com','10.0.2.2',3,'2012-03-20 02:59:04','2012-03-20 02:59:04'),(3,'222520121250037596','translation missing: zh-CN.doc.add inquiry','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 16:42:21','2012-03-24 16:42:21'),(4,'220120121012010018','translation missing: zh-CN.doc.print','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 16:51:01','2012-03-24 16:51:01'),(5,'220120121012010018','translation missing: zh-CN.doc.print','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 16:52:06','2012-03-24 16:52:06'),(6,'220120121012010018','translation missing: zh-CN.doc.print','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 16:53:40','2012-03-24 16:53:40'),(7,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 17:27:12','2012-03-24 17:27:12'),(8,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 17:27:13','2012-03-24 17:27:13'),(9,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 17:27:15','2012-03-24 17:27:15'),(10,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 17:27:54','2012-03-24 17:27:54'),(11,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 19:23:54','2012-03-24 19:23:54'),(12,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 19:26:49','2012-03-24 19:26:49'),(13,'220120121012010018','增加涉案标记','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 19:27:33','2012-03-24 19:27:33'),(14,'220120121012010018','增加涉案标记','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:25:59','2012-03-24 20:25:59'),(15,'220120121012010018','撤消涉案标记','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:26:02','2012-03-24 20:26:02'),(16,'220120121012010018','增加涉案标记','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:28:15','2012-03-24 20:28:15'),(17,'220120121012010018','撤消涉案标记','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:28:27','2012-03-24 20:28:27'),(18,'220120121012010018','借出','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:31:50','2012-03-24 20:31:50'),(19,'220120121012010018','归还','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:31:52','2012-03-24 20:31:52'),(20,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:33:23','2012-03-24 20:33:23'),(21,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:33:37','2012-03-24 20:33:37'),(22,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:33:43','2012-03-24 20:33:43'),(23,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-24 20:33:57','2012-03-24 20:33:57'),(24,'220120121012010018','借出','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 03:38:26','2012-03-25 03:38:26'),(25,'220120121012010018','借出','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 03:38:27','2012-03-25 03:38:27'),(26,'220120121012010018','归还','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:08:19','2012-03-25 04:08:19'),(27,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:08:56','2012-03-25 04:08:56'),(28,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:12:37','2012-03-25 04:12:37'),(29,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:15:03','2012-03-25 04:15:03'),(30,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:15:04','2012-03-25 04:15:04'),(31,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:15:07','2012-03-25 04:15:07'),(32,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:16:01','2012-03-25 04:16:01'),(33,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:16:05','2012-03-25 04:16:05'),(34,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:16:07','2012-03-25 04:16:07'),(35,'220120121012010018','出证','liang_nanhong@customs.gov.cn','10.0.2.2',5,'2012-03-25 04:16:09','2012-03-25 04:16:09');
/*!40000 ALTER TABLE `document_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pages` int(11) DEFAULT NULL,
  `folder_id` int(11) DEFAULT NULL,
  `doc_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `org` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `org_applied` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `modified` tinyint(1) DEFAULT NULL,
  `checkedout` tinyint(1) DEFAULT NULL,
  `inquired` tinyint(1) DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `edc_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_documents_on_doc_id` (`doc_id`),
  KEY `index_documents_on_folder_id` (`folder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (6,'222520121252011021',14,3,'JK3Y','2225','2225',NULL,0,0,NULL,'230012111','2012-03-19 16:03:47','2012-03-19 16:03:47','2012-03-19'),(7,'222520121252011022',11,3,'JK3Y','2225','2225',NULL,0,0,NULL,'230012112','2012-03-19 16:03:47','2012-03-19 16:03:47','2012-03-19'),(8,'222520121252011023',13,3,'JK3Y','2225','2225',NULL,0,0,NULL,'230012113','2012-03-19 16:03:47','2012-03-20 10:00:58','2012-03-19'),(9,'222520121252011024',11,3,'JK3Y','2225','2225',NULL,0,0,NULL,'230012114','2012-03-19 16:03:47','2012-03-19 16:03:47','2012-03-19'),(10,'222520121252011025',11,3,'JK3Y','2225','2225',NULL,0,0,NULL,'230012115','2012-03-19 16:03:47','2012-03-19 16:03:47','2012-03-19'),(11,'220120121012010255',NULL,NULL,NULL,NULL,NULL,NULL,0,0,NULL,NULL,'2012-03-19 23:33:59','2012-03-19 23:33:59','2012-03-19'),(12,'103420121342000125',NULL,NULL,NULL,NULL,NULL,NULL,0,1,NULL,NULL,'2012-03-19 23:34:32','2012-03-23 11:34:46','2012-03-19'),(13,'220120121012010018',5,3,NULL,NULL,NULL,NULL,0,0,NULL,NULL,'2012-03-21 05:19:34','2012-03-25 04:08:19','2012-03-21'),(14,'103420121342000023',NULL,3,NULL,'1034',NULL,NULL,0,0,NULL,NULL,'2012-03-21 05:30:27','2012-03-21 05:31:20','2012-03-21'),(15,'222520121250025733',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010038','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(16,'222520121250025787',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010037','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(17,'222520121250027805',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010043','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(18,'222520121250027824',5,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010039','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(19,'222520121250032558',4,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010021','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(20,'222520121250032909',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010040','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(21,'222520121250032926',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010028','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(22,'222520121250033082',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010027','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(23,'222520121250033084',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010041','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(24,'222520121250033086',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010042','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(25,'222520121250033091',2,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010045','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(26,'222520121250033110',10,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010024','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(27,'222520121250033136',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010023','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(28,'222520121250033192',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010030','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(29,'222520121250033196',2,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010029','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(30,'222520121250033301',11,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010022','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(31,'222520121250033302',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010034','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(32,'222520121250037594',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010044','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(33,'222520121250037595',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010031','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(34,'222520121250037596',6,13,'JK3Y','2225','2225',NULL,0,1,NULL,'230010032','2012-03-21 16:30:29','2012-03-24 16:42:21','2012-03-21'),(35,'222520121250037813',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010033','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(36,'222520121250039465',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010026','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(37,'222520121250039466',8,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010025','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(38,'222520121250043280',6,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010036','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21'),(39,'222520121250043281',7,13,'JK3Y','2225','2225',NULL,0,0,NULL,'230010035','2012-03-21 16:30:29','2012-03-21 16:30:29','2012-03-21');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `folders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `folder_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doc_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `org` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `box` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `edc_date` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_folders_on_folder_id` (`folder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES (3,'2225JK3Y201200000122','JK3Y','2225','20120319222324000010','230012111','2012-03-19','2012-03-19 16:03:47','2012-03-19 16:03:47'),(12,'A099JK3Y201200000005','JK3Y','A099','20120320001620000014','230122011','2012-03-20','2012-03-21 15:16:11','2012-03-21 15:16:11'),(13,'2225JK3Y201200000022','JK3Y','2225','20120321235319000234','230010038','2012-03-21','2012-03-21 16:30:29','2012-03-21 16:30:29');
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `qdocs`
--

DROP TABLE IF EXISTS `qdocs`;
/*!50001 DROP VIEW IF EXISTS `qdocs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `qdocs` (
  `id` int(11),
  `doc_id` varchar(255),
  `pages` int(11),
  `folder_id` int(11),
  `doc_type` varchar(255),
  `org` varchar(255),
  `org_applied` varchar(255),
  `modified` tinyint(1),
  `checkedout` tinyint(1),
  `inquired` tinyint(1),
  `label` varchar(255),
  `serial_number` varchar(255),
  `created_at` datetime,
  `updated_at` datetime
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `query_histories`
--

DROP TABLE IF EXISTS `query_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `query_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `doc_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `org` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `doc_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `print` tinyint(1) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_query_histories_on_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `query_histories`
--

LOCK TABLES `query_histories` WRITE;
/*!40000 ALTER TABLE `query_histories` DISABLE KEYS */;
INSERT INTO `query_histories` VALUES (1,3,'222520121252011024','2225','JK3Y','10.0.2.2',0,'2012-03-19 23:09:58','2012-03-19 23:09:58','weidongshao@gmail.com'),(2,3,'222520121252011024','2225','JK3Y','10.0.2.2',0,'2012-03-19 23:12:12','2012-03-19 23:12:12','weidongshao@gmail.com'),(3,3,'222520121252011024','2225','JK3Y','10.0.2.2',0,'2012-03-19 23:16:13','2012-03-19 23:16:13','weidongshao@gmail.com'),(4,3,'222520121252011025','2225','JK3Y','10.0.2.2',0,'2012-03-19 23:20:36','2012-03-19 23:20:36','weidongshao@gmail.com'),(5,3,'222520121252011024','2225','JK3Y','10.0.2.2',0,'2012-03-19 23:35:39','2012-03-19 23:35:39','weidongshao@gmail.com'),(6,3,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-21 05:20:15','2012-03-21 05:20:15','weidongshao@gmail.com'),(7,3,'222520121252011024','2225','JK3Y','10.0.2.2',0,'2012-03-21 05:49:52','2012-03-21 05:49:52','weidongshao@gmail.com'),(8,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 12:42:44','2012-03-22 12:42:44','yhb@1.com'),(9,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 12:46:26','2012-03-22 12:46:26','yhb@1.com'),(10,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 16:21:14','2012-03-22 16:21:14','yhb@1.com'),(11,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 16:23:34','2012-03-22 16:23:34','yhb@1.com'),(12,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 16:26:24','2012-03-22 16:26:24','yhb@1.com'),(13,2,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-22 16:41:44','2012-03-22 16:41:44','yhb@1.com'),(14,3,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-23 02:21:18','2012-03-23 02:21:18','weidongshao@gmail.com'),(15,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 16:44:59','2012-03-24 16:44:59','liang_nanhong@customs.gov.cn'),(16,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 16:45:20','2012-03-24 16:45:20','liang_nanhong@customs.gov.cn'),(17,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 16:47:56','2012-03-24 16:47:56','liang_nanhong@customs.gov.cn'),(18,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 17:26:48','2012-03-24 17:26:48','liang_nanhong@customs.gov.cn'),(19,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 17:35:07','2012-03-24 17:35:07','liang_nanhong@customs.gov.cn'),(20,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 17:38:03','2012-03-24 17:38:03','liang_nanhong@customs.gov.cn'),(21,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-24 20:32:33','2012-03-24 20:32:33','liang_nanhong@customs.gov.cn'),(22,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-25 03:18:09','2012-03-25 03:18:09','liang_nanhong@customs.gov.cn'),(23,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-25 04:08:26','2012-03-25 04:08:26','liang_nanhong@customs.gov.cn'),(24,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-25 04:14:51','2012-03-25 04:14:51','liang_nanhong@customs.gov.cn'),(25,5,'220120121012010018',NULL,NULL,'10.0.2.2',0,'2012-03-25 04:15:58','2012-03-25 04:15:58','liang_nanhong@customs.gov.cn');
/*!40000 ALTER TABLE `query_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `display_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `resource_id` int(11) DEFAULT NULL,
  `resource_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_roles_on_name_and_resource_type_and_resource_id` (`name`,`resource_type`,`resource_id`),
  KEY `index_roles_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',NULL,NULL,NULL,NULL,'2012-03-19 07:02:29','2012-03-19 07:02:29'),(2,'角色2','角色2',NULL,NULL,NULL,'2012-03-19 09:08:13','2012-03-19 09:08:13'),(3,'角色3','角色3',NULL,NULL,NULL,'2012-03-19 09:33:00','2012-03-19 09:33:00'),(4,'Admin2','Admin2',NULL,NULL,NULL,'2012-03-24 21:18:48','2012-03-24 21:18:48');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_web_links`
--

DROP TABLE IF EXISTS `roles_web_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles_web_links` (
  `role_id` int(11) DEFAULT NULL,
  `web_link_id` int(11) DEFAULT NULL,
  KEY `index_roles_web_links_on_role_id_and_web_link_id` (`role_id`,`web_link_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_web_links`
--

LOCK TABLES `roles_web_links` WRITE;
/*!40000 ALTER TABLE `roles_web_links` DISABLE KEYS */;
INSERT INTO `roles_web_links` VALUES (2,2),(2,7),(2,11),(2,14),(3,3),(3,4),(3,6),(3,7),(3,10),(3,11),(3,14),(4,27),(4,28),(4,29),(4,30),(4,31),(4,33),(4,34),(4,35),(4,37);
/*!40000 ALTER TABLE `roles_web_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schema_migrations`
--

DROP TABLE IF EXISTS `schema_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schema_migrations` (
  `version` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  UNIQUE KEY `unique_schema_migrations` (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schema_migrations`
--

LOCK TABLES `schema_migrations` WRITE;
/*!40000 ALTER TABLE `schema_migrations` DISABLE KEYS */;
INSERT INTO `schema_migrations` VALUES ('20120318120803'),('20120318120853'),('20120318120911'),('20120318124833'),('20120318124856'),('20120318124912'),('20120318124924'),('20120318213858'),('20120318220024'),('20120323162153');
/*!40000 ALTER TABLE `schema_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `special_documents`
--

DROP TABLE IF EXISTS `special_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `special_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doc_id` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pages` int(11) DEFAULT NULL,
  `folder_id` int(11) DEFAULT NULL,
  `doc_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_special_documents_on_folder_id` (`folder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `special_documents`
--

LOCK TABLES `special_documents` WRITE;
/*!40000 ALTER TABLE `special_documents` DISABLE KEYS */;
INSERT INTO `special_documents` VALUES (3,'221020121102220010',6,12,'JK3Y',NULL,'230122011','2012-03-21 15:16:11','2012-03-21 15:16:11'),(4,'221020121102220012',5,12,'JK3Y',NULL,'230122012','2012-03-21 15:16:11','2012-03-21 15:16:11');
/*!40000 ALTER TABLE `special_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `encrypted_password` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `reset_password_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `reset_password_sent_at` datetime DEFAULT NULL,
  `remember_created_at` datetime DEFAULT NULL,
  `sign_in_count` int(11) DEFAULT '0',
  `current_sign_in_at` datetime DEFAULT NULL,
  `last_sign_in_at` datetime DEFAULT NULL,
  `current_sign_in_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `last_sign_in_ip` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_email` (`email`),
  UNIQUE KEY `index_users_on_reset_password_token` (`reset_password_token`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'electronic_doc_producer@concordunity.com','$2a$10$MiKGnm2or8urcTpAkfqPR.r5e20A2l.2mWDtByBVljh/A7xGdgRhy',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'2012-03-19 07:02:29','2012-03-20 00:20:53'),(2,'yhb@1.com','$2a$10$D6TOCqmRbWmclpeeuKTBFOlXxxAaG5MjjAV6.EpmGsS03l4ZXb4pe',NULL,NULL,NULL,45,'2012-03-24 19:26:47','2012-03-24 19:18:37','10.0.2.2','10.0.2.2','2012-03-19 08:58:33','2012-03-24 19:26:47'),(3,'weidongshao@gmail.com','$2a$10$Ylh3oByEe4HCRLOnkAvb6eQZzz3vhxEag4A0uM/6V.MyIoza8E6wq',NULL,NULL,NULL,31,'2012-03-24 18:03:20','2012-03-24 17:58:04','10.0.2.2','10.0.2.2','2012-03-19 09:35:11','2012-03-24 18:03:20'),(4,'wangshen@concordunity.com','$2a$10$NTDy4VUvSKl5NpTyD0rK1uyvM6tAEvij1jB8BCj0.HZcXJaXU4qGe',NULL,NULL,NULL,25,'2012-03-21 16:30:28','2012-03-21 15:16:11','10.0.2.2','10.0.2.2','2012-03-19 15:55:46','2012-03-21 16:30:28'),(5,'liang_nanhong@customs.gov.cn','$2a$10$htOahmPQCgN6CYlWFuDnhuyDhp5lt8Q0SunLuATfqzpziUdfDyAG6',NULL,NULL,NULL,42,'2012-03-25 04:23:15','2012-03-25 04:16:15','10.0.2.2','10.0.2.2','2012-03-20 00:20:53','2012-03-25 04:23:15'),(6,'w@w.com','$2a$10$MR5zyfxYAOaXIUK6eXQJmOeKgRLykBB4rkhlBAZjGUUOhWecz.ubW',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'2012-03-23 17:02:46','2012-03-23 17:02:46'),(8,'yyhb@1.com','$2a$10$M59jpvWLueBzemgzyQTckOT4XB2E3gxf6WrL34Vu0VUyCaTKYpCJu',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'2012-03-23 18:20:22','2012-03-23 18:20:22'),(11,'yhb@333.com','$2a$10$jY/dnrFCw0XbMldR77vOmupY5JKsY7JWOT8/VtMjDNRVFBmppGJd.',NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,'2012-03-24 20:42:55','2012-03-24 20:42:55'),(13,'zzz@zzz.com','$2a$10$.Ik1msktXnsQI0IeVNAuW.gf4Q9GTYdPsI2eltmOGd8OEDqmiwDBG',NULL,NULL,NULL,1,'2012-03-24 21:17:22','2012-03-24 21:17:22','10.0.2.2','10.0.2.2','2012-03-24 21:11:06','2012-03-24 21:17:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_roles` (
  `user_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  KEY `index_users_roles_on_user_id_and_role_id` (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (1,1),(1,1),(2,2),(3,2),(4,1),(5,1),(6,2),(8,3),(11,2),(13,2);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_links`
--

DROP TABLE IF EXISTS `web_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `web_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `menu1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `menu2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `controller` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_web_links_on_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_links`
--

LOCK TABLES `web_links` WRITE;
/*!40000 ALTER TABLE `web_links` DISABLE KEYS */;
INSERT INTO `web_links` VALUES (27,'aQueryDocByBarcode','æŒ‰æŠ¥å…³å•å·å•ç¥¨æŸ¥é˜…',NULL,NULL,'Document','query','0000-00-00 00:00:00','0000-00-00 00:00:00'),(28,'aQueryDocsByBarcodes','æŒ‰æŠ¥å…³å•å·æ‰¹é‡æŸ¥é˜…',NULL,NULL,'Document','multi_query','0000-00-00 00:00:00','0000-00-00 00:00:00'),(29,'aQueryDocsByConditions','ç‰¹å®šæ¡ä»¶ç»„åˆæŸ¥é˜…',NULL,NULL,'Document','search_docs','0000-00-00 00:00:00','0000-00-00 00:00:00'),(30,'aManageQueries','æŸ¥é˜…åŽ†å²',NULL,NULL,'query_history','list','0000-00-00 00:00:00','0000-00-00 00:00:00'),(31,'aPerformanceStatis','ç»©æ•ˆç»Ÿè®¡',NULL,NULL,'report','report','0000-00-00 00:00:00','0000-00-00 00:00:00'),(32,'aUsabilityStatis','ä½¿ç”¨ç»Ÿè®¡',NULL,NULL,'report','stats','0000-00-00 00:00:00','0000-00-00 00:00:00'),(33,'aOperateInvolved','æ·»åŠ /æ’¤é”€æ¶‰æ¡ˆæ ‡å¿—',NULL,NULL,'Document','inquire','0000-00-00 00:00:00','0000-00-00 00:00:00'),(34,'aOperateLended','ç”µå­æ¡£æ¡ˆå€Ÿé˜…/å½’è¿˜',NULL,NULL,'Document','checkout','0000-00-00 00:00:00','0000-00-00 00:00:00'),(35,'aOperateTestified','å‡ºè¯å¤„ç†',NULL,NULL,'Document','print','0000-00-00 00:00:00','0000-00-00 00:00:00'),(36,'aManageUsers','ç”¨æˆ·ç®¡ç†',NULL,NULL,'auth','manage_user','0000-00-00 00:00:00','0000-00-00 00:00:00'),(37,'aManageRoles','è§’è‰²æƒé™ç®¡ç†',NULL,NULL,'auth','manage_role','0000-00-00 00:00:00','0000-00-00 00:00:00'),(38,'aOperateHistory','å•è¯æ“ä½œåŽ†å²',NULL,NULL,'DocumentHistory','dh_report','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `web_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `qdocs`
--

/*!50001 DROP TABLE IF EXISTS `qdocs`*/;
/*!50001 DROP VIEW IF EXISTS `qdocs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = latin1 */;
/*!50001 SET character_set_results     = latin1 */;
/*!50001 SET collation_connection      = latin1_swedish_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `qdocs` AS select `documents`.`id` AS `id`,`documents`.`doc_id` AS `doc_id`,`documents`.`pages` AS `pages`,`documents`.`folder_id` AS `folder_id`,`documents`.`doc_type` AS `doc_type`,`documents`.`org` AS `org`,`documents`.`org_applied` AS `org_applied`,`documents`.`modified` AS `modified`,`documents`.`checkedout` AS `checkedout`,`documents`.`inquired` AS `inquired`,`documents`.`label` AS `label`,`documents`.`serial_number` AS `serial_number`,`documents`.`created_at` AS `created_at`,`documents`.`updated_at` AS `updated_at` from `documents` where ((`documents`.`inquired` = 0) and (`documents`.`checkedout` = 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-03-25 14:00:34
