-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema task_db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `task_db` ;

-- -----------------------------------------------------
-- Schema task_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `task_db` DEFAULT CHARACTER SET utf8 ;
USE `task_db` ;

-- -----------------------------------------------------
-- Table `task_db`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_db`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `task_db`.`tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `task_db`.`tasks` ( 
  `id` INT NOT NULL AUTO_INCREMENT, 
  `titulo` VARCHAR(255) NOT NULL, 
  `descripcion` LONGTEXT NULL, 
  `fecha_hora` DATETIME NULL, 
  `prioridad` ENUM('alta', 'media', 'baja') NOT NULL, 
  `categoria` VARCHAR(100) NOT NULL, 
  `user_id` INT NOT NULL, 
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (`id`), 
  INDEX `fk_tasks_users_idx` (`user_id` ASC) VISIBLE, 
  CONSTRAINT `fk_tasks_users` 
    FOREIGN KEY (`user_id`) 
    REFERENCES `task_db`.`users` (`id`) 
    ON DELETE NO ACTION 
    ON UPDATE NO ACTION
) ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;