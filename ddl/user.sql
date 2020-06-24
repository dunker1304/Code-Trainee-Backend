-- 16/06/2020
ALTER TABLE `User` MODIFY display_name VARCHAR(300) CHARACTER SET utf8  COLLATE utf8_unicode_ci;
ALTER TABLE `User` ADD COLUMN `is_login_local` tinyint(1)  DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `is_login_google` tinyint(1)  DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `google_id`  varchar(50)   DEFAULT  NULL ;
ALTER TABLE `User` ADD COLUMN `status` tinyint(1) UNSIGNED DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `secret`varchar(50)   DEFAULT Null ;

-- 24/06/2020 datmv
alter table `Question` drop column `other_require`;
alter table `Question` drop column `limit_code_characters`;