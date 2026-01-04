/*
SQLyog Ultimate v13.1.1 (64 bit)
MySQL - 10.4.32-MariaDB : Database - db_tagihan_perumahan
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_tagihan_perumahan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `db_tagihan_perumahan`;

/*Table structure for table `1nf_notifikasi` */

DROP TABLE IF EXISTS `1nf_notifikasi`;

CREATE TABLE `1nf_notifikasi` (
  `id` int(10) NOT NULL,
  `nama` varchar(15) DEFAULT NULL,
  `email` varchar(15) DEFAULT NULL,
  `password` varchar(15) DEFAULT NULL,
  `posisi` varchar(15) DEFAULT NULL,
  `nohp` int(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `1nf_notifikasi` */

insert  into `1nf_notifikasi`(`id`,`nama`,`email`,`password`,`posisi`,`nohp`) values 
(1,'Andi','andi@mail.com','hashed_andi','Penghuni',2147483647);

/*Table structure for table `1nf_pembayaran` */

DROP TABLE IF EXISTS `1nf_pembayaran`;

CREATE TABLE `1nf_pembayaran` (
  `id` int(10) NOT NULL,
  `id_rumah` varchar(15) DEFAULT NULL,
  `id_kategori` varchar(15) DEFAULT NULL,
  `id_periode` varchar(15) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `1nf_pembayaran` */

insert  into `1nf_pembayaran`(`id`,`id_rumah`,`id_kategori`,`id_periode`,`status`) values 
(1,'1','1','1','Sukses');

/*Table structure for table `1nf_pengguna` */

DROP TABLE IF EXISTS `1nf_pengguna`;

CREATE TABLE `1nf_pengguna` (
  `id` int(10) NOT NULL,
  `nama` varchar(15) DEFAULT NULL,
  `email` varchar(15) DEFAULT NULL,
  `password` varchar(15) DEFAULT NULL,
  `posisi` varchar(15) DEFAULT NULL,
  `nohp` int(12) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `1nf_pengguna` */

insert  into `1nf_pengguna`(`id`,`nama`,`email`,`password`,`posisi`,`nohp`) values 
(1,'Andi','andi@mail.com','hashed_andi','Penghuni',2147483647);

/*Table structure for table `1nf_rumah` */

DROP TABLE IF EXISTS `1nf_rumah`;

CREATE TABLE `1nf_rumah` (
  `id` int(10) NOT NULL,
  `blok_rumah` varchar(15) DEFAULT NULL,
  `nomor_rumah` varchar(15) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `1nf_rumah` */

insert  into `1nf_rumah`(`id`,`blok_rumah`,`nomor_rumah`,`status`) values 
(1,'A','01','Aktif');

/*Table structure for table `1nf_tagihan` */

DROP TABLE IF EXISTS `1nf_tagihan`;

CREATE TABLE `1nf_tagihan` (
  `id` int(10) NOT NULL,
  `id_tagihan` varchar(15) DEFAULT NULL,
  `bank` varchar(15) DEFAULT NULL,
  `nomor_va` int(20) DEFAULT NULL,
  `jumlah` varchar(15) DEFAULT NULL,
  `waktu_pembayaran` datetime DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `1nf_tagihan` */

insert  into `1nf_tagihan`(`id`,`id_tagihan`,`bank`,`nomor_va`,`jumlah`,`waktu_pembayaran`,`status`) values 
(1,'1','BCA',111111,'150000','2025-01-05 10:00:00','Lunas');

/*Table structure for table `2nf_kategori_tagihan` */

DROP TABLE IF EXISTS `2nf_kategori_tagihan`;

CREATE TABLE `2nf_kategori_tagihan` (
  `id` int(10) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `jumlah` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `2nf_kategori_tagihan` */

insert  into `2nf_kategori_tagihan`(`id`,`nama`,`jumlah`) values 
(1,'IPL',150000);

/*Table structure for table `2nf_periode_penagihan` */

DROP TABLE IF EXISTS `2nf_periode_penagihan`;

CREATE TABLE `2nf_periode_penagihan` (
  `id` int(10) NOT NULL,
  `id_periode` varchar(50) DEFAULT NULL,
  `id_rumah` varchar(15) DEFAULT NULL,
  `id_kategori` varchar(15) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `2nf_periode_penagihan` */

insert  into `2nf_periode_penagihan`(`id`,`id_periode`,`id_rumah`,`id_kategori`,`status`) values 
(1,'1','1','1','Aktif');

/*Table structure for table `2nf_tagihan` */

DROP TABLE IF EXISTS `2nf_tagihan`;

CREATE TABLE `2nf_tagihan` (
  `id` int(10) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `tanggal_awal` date DEFAULT NULL,
  `tanggal_akhir` date DEFAULT NULL,
  `jatuh_tempo` date DEFAULT NULL,
  `aktif` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `2nf_tagihan` */

insert  into `2nf_tagihan`(`id`,`nama`,`tanggal_awal`,`tanggal_akhir`,`jatuh_tempo`,`aktif`) values 
(1,'Januari 2025','2025-01-01','2025-01-31','2025-01-10','1');

/*Table structure for table `kategori_tagihan` */

DROP TABLE IF EXISTS `kategori_tagihan`;

CREATE TABLE `kategori_tagihan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `kategori_tagihan` */

insert  into `kategori_tagihan`(`id`,`nama`,`jumlah`) values 
(1,'IPL',150000.00);

/*Table structure for table `notifikasi` */

DROP TABLE IF EXISTS `notifikasi`;

CREATE TABLE `notifikasi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_pengguna` int(11) NOT NULL,
  `judul_notifikasi` varchar(100) DEFAULT NULL,
  `pesan` text DEFAULT NULL,
  `status_pengguna` tinyint(4) DEFAULT NULL COMMENT '0 = unread 1 = read',
  `masuk_notif` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'waktu notifikasi',
  PRIMARY KEY (`id`),
  KEY `notifications_ibfk_1` (`id_pengguna`),
  CONSTRAINT `notifikasi_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `notifikasi` */

/*Table structure for table `pembayaran` */

DROP TABLE IF EXISTS `pembayaran`;

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_tagihan` int(11) DEFAULT NULL,
  `id_tagihan_komunal` int(11) DEFAULT NULL,
  `id_orderan` varchar(50) NOT NULL,
  `id_transaksi` varchar(50) DEFAULT NULL,
  `bank` varchar(15) DEFAULT NULL,
  `nomor_va` int(18) NOT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `waktu_expire` datetime DEFAULT NULL,
  `waktu_pembayaran` datetime DEFAULT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_ibfk_1` (`id_tagihan`),
  KEY `fk_bayar_komunal` (`id_tagihan_komunal`),
  CONSTRAINT `fk_bayar_komunal` FOREIGN KEY (`id_tagihan_komunal`) REFERENCES `tagihan_komunal` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_tagihan`) REFERENCES `tagihan` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pembayaran` */

insert  into `pembayaran`(`id`,`id_tagihan`,`id_tagihan_komunal`,`id_orderan`,`id_transaksi`,`bank`,`nomor_va`,`jumlah`,`waktu_expire`,`waktu_pembayaran`,`status`) values 
(8,13,NULL,'',NULL,NULL,0,150000.00,NULL,'2026-01-04 22:36:20','Lunas'),
(9,12,NULL,'',NULL,NULL,0,150000.00,NULL,'2026-01-04 23:49:00','Lunas'),
(10,11,NULL,'',NULL,NULL,0,150000.00,NULL,'2026-01-04 23:49:06','Lunas'),
(11,10,NULL,'',NULL,NULL,0,150000.00,NULL,'2026-01-05 00:08:02','Lunas'),
(12,14,NULL,'',NULL,NULL,0,150000.00,NULL,'2026-01-05 00:08:04','Lunas');

/*Table structure for table `pengeluaran` */

DROP TABLE IF EXISTS `pengeluaran`;

CREATE TABLE `pengeluaran` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(100) NOT NULL,
  `kategori` varchar(50) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pengeluaran` */

insert  into `pengeluaran`(`id`,`judul`,`kategori`,`jumlah`,`tanggal`,`created_at`) values 
(4,'Gaji Satpam Shift Pagi','Gaji',3500000.00,'2026-01-02','2026-01-05 00:08:56');

/*Table structure for table `pengguna` */

DROP TABLE IF EXISTS `pengguna`;

CREATE TABLE `pengguna` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varbinary(255) DEFAULT NULL,
  `posisi` varchar(15) DEFAULT NULL,
  `nohp` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pengguna` */

insert  into `pengguna`(`id`,`nama`,`email`,`password`,`posisi`,`nohp`) values 
(11,'Reza',NULL,NULL,'Penghuni','081212121212'),
(12,'Adil',NULL,NULL,'Penghuni','08121212131'),
(13,'Adib',NULL,NULL,'Penghuni','0852145123'),
(14,'Luthfi',NULL,NULL,'Penghuni','081321331231'),
(15,'Toni',NULL,NULL,'Penghuni','0898123121');

/*Table structure for table `penghuni_rumah` */

DROP TABLE IF EXISTS `penghuni_rumah`;

CREATE TABLE `penghuni_rumah` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID Riwayat',
  `id_rumah` int(11) NOT NULL COMMENT 'FK ke houses',
  `id_pengguna` int(11) NOT NULL COMMENT 'FK ke users',
  `kuasa` varchar(20) NOT NULL,
  `aktif` tinyint(4) DEFAULT NULL COMMENT '1 = now 0 = old',
  `mulai_tinggal` date NOT NULL,
  `akhir_tinggal` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house_occupants_ibfk_1` (`id_pengguna`),
  KEY `house_occupants_ibfk_2` (`id_rumah`),
  CONSTRAINT `penghuni_rumah_ibfk_1` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `penghuni_rumah_ibfk_2` FOREIGN KEY (`id_rumah`) REFERENCES `rumah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `penghuni_rumah` */

insert  into `penghuni_rumah`(`id`,`id_rumah`,`id_pengguna`,`kuasa`,`aktif`,`mulai_tinggal`,`akhir_tinggal`) values 
(9,16,11,'Pemilik Tetap',1,'2026-01-02',NULL),
(10,17,12,'Pemilik Tetap',1,'2026-01-02',NULL),
(11,18,13,'Penyewa',1,'2026-01-04',NULL),
(12,19,14,'Penyewa',1,'2026-01-04',NULL),
(13,21,15,'Penyewa',1,'2026-01-05',NULL);

/*Table structure for table `periode_penagihan` */

DROP TABLE IF EXISTS `periode_penagihan`;

CREATE TABLE `periode_penagihan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `tanggal_awal` date NOT NULL,
  `tanggal_akhir` date NOT NULL,
  `jatuh_tempo` date DEFAULT NULL,
  `aktif` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `periode_penagihan` */

insert  into `periode_penagihan`(`id`,`nama`,`tanggal_awal`,`tanggal_akhir`,`jatuh_tempo`,`aktif`) values 
(1,'IPL - Maret 2026','2026-03-01','2026-03-31',NULL,1),
(2,'IPL - Maret 2026','2026-03-01','2026-03-31',NULL,1),
(3,'IPL - Januari 2026','2026-01-01','2026-01-31',NULL,1);

/*Table structure for table `peserta_tagihan_komunal` */

DROP TABLE IF EXISTS `peserta_tagihan_komunal`;

CREATE TABLE `peserta_tagihan_komunal` (
  `id` int(11) NOT NULL,
  `id_tagihan_komunal` int(11) DEFAULT NULL,
  `id_rumah` int(11) DEFAULT NULL,
  `jumlah_iuran` double DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_tagihan_komunal` (`id_tagihan_komunal`),
  CONSTRAINT `peserta_tagihan_komunal_ibfk_1` FOREIGN KEY (`id_tagihan_komunal`) REFERENCES `tagihan_komunal` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `peserta_tagihan_komunal` */

/*Table structure for table `rumah` */

DROP TABLE IF EXISTS `rumah`;

CREATE TABLE `rumah` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `blok_rumah` varchar(12) NOT NULL COMMENT 'Blok',
  `no_rumah` varchar(12) NOT NULL COMMENT 'Nomor',
  `status_rumah` varchar(15) NOT NULL COMMENT 'Status rumah',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `rumah` */

insert  into `rumah`(`id`,`blok_rumah`,`no_rumah`,`status_rumah`) values 
(16,'B','1','Dihuni'),
(17,'A','1','Dihuni'),
(18,'C','1','Dihuni'),
(19,'D','1','Dihuni'),
(20,'F','1','Kosong'),
(21,'F','2','Dihuni'),
(22,'F','3','Kosong'),
(23,'F','4','Kosong'),
(24,'F','5','Kosong'),
(25,'F','6','Kosong'),
(26,'F','7','Kosong'),
(27,'F','8','Kosong'),
(28,'F','9','Kosong'),
(29,'F','10','Kosong');

/*Table structure for table `tagihan` */

DROP TABLE IF EXISTS `tagihan`;

CREATE TABLE `tagihan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_periode` int(11) NOT NULL,
  `id_rumah` int(11) NOT NULL COMMENT 'FK ke houses',
  `id_kategori` int(11) NOT NULL COMMENT 'FK ke categories',
  `status` varchar(15) DEFAULT NULL COMMENT 'Status bayar',
  `jumlah` decimal(10,2) DEFAULT NULL,
  `nomor_va` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cat_id` (`id_kategori`),
  KEY `bills_ibfk_1` (`id_periode`),
  KEY `bills_ibfk_3` (`id_rumah`),
  CONSTRAINT `tagihan_ibfk_1` FOREIGN KEY (`id_periode`) REFERENCES `periode_penagihan` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tagihan_ibfk_2` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_tagihan` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tagihan_ibfk_3` FOREIGN KEY (`id_rumah`) REFERENCES `rumah` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tagihan` */

insert  into `tagihan`(`id`,`id_periode`,`id_rumah`,`id_kategori`,`status`,`jumlah`,`nomor_va`) values 
(10,3,16,1,'Lunas',150000.00,'88002026010016'),
(11,3,17,1,'Lunas',150000.00,'88002026010017'),
(12,3,18,1,'Lunas',150000.00,'88002026010018'),
(13,3,19,1,'Lunas',150000.00,'88002026010019'),
(14,3,21,1,'Lunas',150000.00,'88002026010021');

/*Table structure for table `tagihan_komunal` */

DROP TABLE IF EXISTS `tagihan_komunal`;

CREATE TABLE `tagihan_komunal` (
  `id` int(11) NOT NULL,
  `nama_kegiatan` varchar(50) DEFAULT NULL,
  `id_periode` int(11) DEFAULT NULL,
  `jumlah` decimal(10,2) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `opsional` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_periode` (`id_periode`),
  CONSTRAINT `tagihan_komunal_ibfk_1` FOREIGN KEY (`id_periode`) REFERENCES `periode_penagihan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `tagihan_komunal` */

/*Table structure for table `unf` */

DROP TABLE IF EXISTS `unf`;

CREATE TABLE `unf` (
  `ID` int(10) NOT NULL,
  `nama_penghuni` varchar(100) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `nohp` int(15) DEFAULT NULL,
  `blok_rumah` varchar(10) DEFAULT NULL,
  `no_rumah` varchar(10) DEFAULT NULL,
  `periode_tagihan` date DEFAULT NULL,
  `jatuh_tempo` date DEFAULT NULL,
  `jenis_tagihan` varchar(15) DEFAULT NULL,
  `jumlah` double DEFAULT NULL,
  `status_tagihan` tinyint(10) DEFAULT NULL,
  `bank` varchar(15) DEFAULT NULL,
  `no_va` int(20) DEFAULT NULL,
  `waktu_bayar` datetime DEFAULT NULL,
  `notifikasi` text DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `unf` */

insert  into `unf`(`ID`,`nama_penghuni`,`email`,`nohp`,`blok_rumah`,`no_rumah`,`periode_tagihan`,`jatuh_tempo`,`jenis_tagihan`,`jumlah`,`status_tagihan`,`bank`,`no_va`,`waktu_bayar`,`notifikasi`) values 
(1,'Andi','andi@mail.com',2147483647,'A','01','0000-00-00','2025-01-10','IPL',150000,0,'BCA',111111,'2025-01-05 10:00:00','Tagihan IPL diterbitkan'),
(2,'Andi','andi@mail.com',2147483647,'A','01','0000-00-00','2025-01-10','Komunal',75000,0,'BCA',222222,'2025-01-06 11:00:00','Tagihan Komunal diterbitkan');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
