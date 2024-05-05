import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1714925942155 implements MigrationInterface {
    name = 'Migration1714925942155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`verification_code\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`phone\` varchar(20) NOT NULL, \`type\` tinyint NOT NULL COMMENT '1: Register, 2: Change device', \`code\` varchar(6) NOT NULL, \`retry_count\` tinyint NOT NULL COMMENT 'Max: 5' DEFAULT '0', \`status\` tinyint NOT NULL COMMENT '1: active, 0: inactive' DEFAULT '1', \`expire_at\` timestamp NOT NULL, \`expire_retry\` timestamp NULL, \`use_at\` timestamp NOT NULL, \`retry_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification_member\` (\`notification_id\` bigint UNSIGNED NOT NULL, \`member_id\` bigint UNSIGNED NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT '0', \`status\` tinyint NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, INDEX \`IDX_cb4c97a9fb681dffbab667a381\` (\`notification_id\`), INDEX \`IDX_7f54c7fbfd93ce1a813a577d59\` (\`member_id\`), INDEX \`IDX_9171a018eefba6b3d13cecc531\` (\`is_read\`), INDEX \`IDX_436946491934c9ef01d7e65270\` (\`status\`), PRIMARY KEY (\`notification_id\`, \`member_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`base_model\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL COMMENT '0:Inactive, 1: Active, 2:Pending' DEFAULT '1', \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_6858b0bfee6d486b76e323b3e9\` (\`id\`), INDEX \`IDX_dc62b8b705c2883e1c45d4529c\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL COMMENT '0:Inactive, 1: Active, 2:Pending' DEFAULT '1', \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`type\` tinyint NULL, \`title\` varchar(500) NULL, \`url\` varchar(500) NULL, \`redirect_id\` bigint UNSIGNED NULL, \`redirect_type\` tinyint NULL, \`target_type\` tinyint NOT NULL DEFAULT '1', \`uuid\` varchar(255) NULL, \`image\` varchar(255) NULL, \`created_by\` bigint UNSIGNED NULL, \`deleted_by\` bigint UNSIGNED NULL, \`updated_by\` bigint UNSIGNED NULL, \`deleted_at\` timestamp(6) NULL, INDEX \`IDX_705b6c7cdf9b2c2ff7ac7872cb\` (\`id\`), INDEX \`IDX_c62fbe823d612cc7ad7b5c3dd9\` (\`status\`), INDEX \`IDX_0720aa499ee315c39d8925c959\` (\`redirect_id\`), INDEX \`IDX_2bcdb87dc74b6ded01c685068a\` (\`redirect_type\`), INDEX \`IDX_63bd010e6972c79cb402177b14\` (\`target_type\`), INDEX \`IDX_354c58d3c73d8e063e7c46b18d\` (\`created_by\`), INDEX \`IDX_fc085407f2bdd335ef1186704b\` (\`deleted_by\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`member\` (\`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT, \`status\` tinyint NOT NULL COMMENT '0:Inactive, 1: Active, 2:Pending' DEFAULT '1', \`createAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL COMMENT 'FullName or name', \`phone\` varchar(20) NOT NULL COMMENT 'Your phone member', \`birthday\` varchar(20) NULL COMMENT 'Birthday member', \`refresh_token\` varchar(500) NULL COMMENT 'JWT token for authentication', \`change_phone_code\` varchar(20) NULL COMMENT 'Code for change phone number', \`is_super_admin\` tinyint NULL COMMENT '1: Active, 0:A Active' DEFAULT '0', \`role_id\` tinyint NULL COMMENT 'Role for admin', \`password\` varchar(255) NULL, INDEX \`IDX_97cbbe986ce9d14ca5894fdc07\` (\`id\`), INDEX \`IDX_edd000cc7aef7da0776ef763ce\` (\`status\`), UNIQUE INDEX \`IDX_d73619f5e63108e8d57e8e1859\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_d73619f5e63108e8d57e8e1859\` ON \`member\``);
        await queryRunner.query(`DROP INDEX \`IDX_edd000cc7aef7da0776ef763ce\` ON \`member\``);
        await queryRunner.query(`DROP INDEX \`IDX_97cbbe986ce9d14ca5894fdc07\` ON \`member\``);
        await queryRunner.query(`DROP TABLE \`member\``);
        await queryRunner.query(`DROP INDEX \`IDX_fc085407f2bdd335ef1186704b\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_354c58d3c73d8e063e7c46b18d\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_63bd010e6972c79cb402177b14\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bcdb87dc74b6ded01c685068a\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_0720aa499ee315c39d8925c959\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_c62fbe823d612cc7ad7b5c3dd9\` ON \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_705b6c7cdf9b2c2ff7ac7872cb\` ON \`notification\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_dc62b8b705c2883e1c45d4529c\` ON \`base_model\``);
        await queryRunner.query(`DROP INDEX \`IDX_6858b0bfee6d486b76e323b3e9\` ON \`base_model\``);
        await queryRunner.query(`DROP TABLE \`base_model\``);
        await queryRunner.query(`DROP INDEX \`IDX_436946491934c9ef01d7e65270\` ON \`notification_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_9171a018eefba6b3d13cecc531\` ON \`notification_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_7f54c7fbfd93ce1a813a577d59\` ON \`notification_member\``);
        await queryRunner.query(`DROP INDEX \`IDX_cb4c97a9fb681dffbab667a381\` ON \`notification_member\``);
        await queryRunner.query(`DROP TABLE \`notification_member\``);
        await queryRunner.query(`DROP TABLE \`verification_code\``);
    }

}
