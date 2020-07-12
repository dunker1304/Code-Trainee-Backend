drop database if exists `CodeTrainee`;
CREATE DATABASE IF NOT EXISTS `CodeTrainee`;

USE `CodeTrainee`;
CREATE TABLE `UserAuthority` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `user_id` int,
  `role_id` int,
  UNIQUE (`user_id`, `role_id`),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `Category` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(150),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `Comment` (
  `id` int AUTO_INCREMENT primary key,
  `question_id` int,
  `content` varchar(10000),
  `sender_id` int,
  `parent_id` int default null,
  `is_deleted` int,
  `like` int DEFAULT '0',
  `dislike` int DEFAULT '0',
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `TrainingHistory` (
  `id` int not NULL AUTO_INCREMENT primary key,
  `user_id` int,
  `question_id` int,
  `time_needed` int COMMENT 'time in miliseconds',
  `points` int default 0,
  `answer` varchar(10000),
  `program_language_id` int DEFAULT NULL,
  `is_finished` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `ProgramLanguage` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `name` varchar(150),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `CodeSnippet` (
  `id` int AUTO_INCREMENT primary key,
  `question_id` int,
  `program_language_id` int,
  `function_name` varchar(150),
  `return_type` varchar(150),
  unique (`question_id`, `program_language_id`),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
create table `Parameter` (
	`id` int not null auto_increment primary key,
  `param_name` varchar(150),
  `param_type` varchar(150),
  `param_order` int,
  `snippet_id` int,
  `created_by` int,
	`created_at` datetime,
	`updated_at` datetime
);
CREATE TABLE `Question` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `points` int DEFAULT 0,
  `level` varchar(150) DEFAULT 'easy',
  `is_deleted` int,
  `is_approved` int,
  `other_require` varchar(1000),
  `limit_code_characters` int,
  `like` int DEFAULT 0,
  `dislike` int DEFAULT 0,
  `content` varchar(5000),
  `title` varchar(1000),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `QuestionCategory` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `question_id` int,
  `category_id` int,
  unique (`question_id`, `category_id`),
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `name` varchar(150),
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
);
CREATE TABLE `TestCase` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `question_id` int,
  `is_hidden` int,
  `input` varchar(1000),
  `expected_output` varchar(1000),
  `execute_time_limit` int comment "time in miliseconds",
  `created_by` int,
  `created_at` datetime,
  `updated_at` datetime
  );
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT primary key,
  `username` varchar(150) not null,
  `password` varchar(150) not null,
  `display_name` varchar(300),
  `email` varchar(150) not null,
  `phone` varchar(50),
  `image_link` varchar(150),
  `DoB` datetime DEFAULT NULL,
  `created_at` datetime,
  `updated_at` datetime,
  UNIQUE (`email`),
  unique (`username`)
);
CREATE TABLE `DeletedUser` (
	`id` int not null auto_increment primary key,
  `user_id` int,
  `note` varchar(1000),
  `created_by` int,
	`created_at` datetime,
	`updated_at` datetime
);
CREATE TABLE `WishList` (
	`id` int not null auto_increment primary key,
  `user_id` int,
  `question_id` int,
	`created_at` datetime,
	`updated_at` datetime,
	unique(`user_id`, `question_id`)
);
alter table UserAuthority add foreign key (user_id) references User (id);
alter table UserAuthority add foreign key (role_id) references Role (id);
alter table Comment add foreign key (question_id) references Question (id);
alter table Comment add foreign key (sender_id) references User (id);
alter table QuestionCategory add foreign key (question_id) references Question (id);
alter table QuestionCategory add foreign key (category_id) references Category (id);
alter table TrainingHistory add foreign key (question_id) references Question (id);
alter table TrainingHistory add foreign key (user_id) references User (id);
alter table TrainingHistory add foreign key (program_language_id) references ProgramLanguage (id);
alter table TestCase add foreign key (question_id) references Question (id);
alter table Parameter add foreign key (snippet_id) references CodeSnippet (id);
alter table CodeSnippet add foreign key (question_id) references Question (id);
alter table CodeSnippet add foreign key (program_language_id) references ProgramLanguage (id);
alter table WishList add foreign key (user_id) references User (id);
alter table WishList add foreign key (question_id) references Question (id);