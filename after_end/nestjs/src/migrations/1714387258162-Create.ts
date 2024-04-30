import { MigrationInterface, QueryRunner } from "typeorm";

export class Create1714387258162 implements MigrationInterface {
    name = 'Create1714387258162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL DEFAULT '', \`isAdmin\` tinyint NOT NULL DEFAULT 0, \`email\` varchar(255) NOT NULL, \`storageLabel\` varchar(255) NULL, \`password\` varchar(255) NOT NULL DEFAULT '', \`oauthId\` varchar(255) NOT NULL DEFAULT '', \`shouldChangePassword\` tinyint NOT NULL DEFAULT 0, \`memoriesEnabled\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`status\` varchar(255) NOT NULL DEFAULT 'active', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_b309cf34fa58137c416b32cea3\` (\`storageLabel\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_token\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deviceType\` varchar(255) NOT NULL DEFAULT '', \`deviceOS\` varchar(255) NOT NULL DEFAULT '', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`api_keys\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`key\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`system_config\` (\`key\` varchar(255) NOT NULL, \`value\` varchar(255) NULL, PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`renameTagId\` varchar(255) NULL COMMENT 'The new renamed tagId', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_token\` ADD CONSTRAINT \`FK_d37db50eecdf9b8ce4eedd2f918\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`api_keys\` ADD CONSTRAINT \`FK_6c2e267ae764a9413b863a29342\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tags\` ADD CONSTRAINT \`FK_92e67dc508c705dd66c94615576\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // 插入初始管理用户
        await queryRunner.query(`
            INSERT INTO users (
                id, name, email, password, isAdmin, status
            ) 
            VALUES (
                '1', 'Admin', 'admin@localhost', '$2b$10$3cO00PhmoBlUsZz2h2JJkOjFBvnGdr62e7.Llc9/c9t7T8Ia.VTB2', 1, 'active'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tags\` DROP FOREIGN KEY \`FK_92e67dc508c705dd66c94615576\``);
        await queryRunner.query(`ALTER TABLE \`api_keys\` DROP FOREIGN KEY \`FK_6c2e267ae764a9413b863a29342\``);
        await queryRunner.query(`ALTER TABLE \`user_token\` DROP FOREIGN KEY \`FK_d37db50eecdf9b8ce4eedd2f918\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`system_config\``);
        await queryRunner.query(`DROP TABLE \`api_keys\``);
        await queryRunner.query(`DROP TABLE \`user_token\``);
        await queryRunner.query(`DROP INDEX \`IDX_b309cf34fa58137c416b32cea3\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
