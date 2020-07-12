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

-- 09/07/2020 dunk
alter table `TrainingHistory` rename column `points` to `status` 
alter table `TrainingHistory` modify column `status` varchar(255)