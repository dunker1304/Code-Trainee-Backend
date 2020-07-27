-- 16/06/2020 quynhkt
ALTER TABLE `User` MODIFY display_name VARCHAR(300) CHARACTER SET utf8  COLLATE utf8_unicode_ci;
ALTER TABLE `User` ADD COLUMN `is_login_local` tinyint(1)  DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `is_login_google` tinyint(1)  DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `google_id`  varchar(50)   DEFAULT  NULL ;
ALTER TABLE `User` ADD COLUMN `status` tinyint(1) UNSIGNED DEFAULT 0  ;
ALTER TABLE `User` ADD COLUMN `secret`varchar(50)   DEFAULT Null ;

-- 24/06/2020 datmv
alter table `Question` drop column `other_require`;
alter table `Question` drop column `limit_code_characters`;
alter table `CodeSnippet` drop column `function_name`;
alter table `CodeSnippet` drop column `return_type`;
drop table `Parameter`;
alter table `CodeSnippet` ADD COLUMN `sample_code` varchar(10000)   DEFAULT Null ;
drop table `deleteduser`;
ALTER TABLE `User` ADD COLUMN `is_deleted` tinyint(1) UNSIGNED DEFAULT 0  ;
ALTER TABLE `ProgramLanguage` ADD COLUMN `code` int UNSIGNED;
alter table `CodeSnippet` ADD COLUMN `is_active` tinyint(1) UNSIGNED  DEFAULT 0 ;
alter table `TestCase` drop column `execute_time_limit`;

-- 30/06/2020 datmv
rename table `Question` to `Exercise`;
rename table `QuestionCategory` to `ExerciseTag`;
rename table `Category` to `Tag`;
alter table `TrainingHistory` rename column `question_id` to `exercise_id`;
alter table `WishList` rename column `question_id` to `exercise_id`;
alter table `CodeSnippet` rename column `question_id` to `exercise_id`;
alter table `TestCase` rename column `question_id` to `exercise_id`;
alter table `ExerciseTag` rename column `question_id` to `exercise_id`;
alter table `ExerciseTag` rename column `category_id` to `tag_id`;
alter table `Comment` rename column `question_id` to `exercise_id`;

-- 4/7/2020 quynhkt
ALTER TABLE TestCase CHANGE `question_id` `exercise_id` INT

-- 8/7/2020 quynhkt
CREATE TABLE TypeWishList (
id INT AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR(300) NOT NULL ,
`created_by` INT ,
FOREIGN KEY (created_by) REFERENCES `User`(id)

)

-- 09/07/2020 dunk
alter table `TrainingHistory` rename column `points` to `status` 
alter table `TrainingHistory` modify column `status` varchar(255)

-- 15/7/2020
ALTER TABLE `Comment` MODIFY content VARCHAR(10000)  CHARACTER SET utf8;
ALTER TABLE `Comment` MODIFY title VARCHAR(300)  CHARACTER SET utf8;

-- 26/07
CREATE TABLE ExerciseVote (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) DEFAULT NULL,
  exercise_id int(11) DEFAULT NULL,
  status_vote tinyint(1) DEFAULT '0',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY exercise_id (exercise_id),
  KEY user_id (user_id),
  CONSTRAINT ExerciseVote_ibfk_1 FOREIGN KEY (exercise_id) REFERENCES Exercise (id),
  CONSTRAINT ExerciseVote_ibfk_2 FOREIGN KEY (user_id) REFERENCES User (id)
)