import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1703654066024 implements MigrationInterface {
  name = 'Migration1703654066024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE 
      "base_model" 
      ("id" BIGSERIAL NOT NULL, 
      "status" smallint NOT NULL DEFAULT '1', 
      "createAt" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "updateAt" TIMESTAMP NOT NULL, CONSTRAINT 
      "PK_6858b0bfee6d486b76e323b3e9b" PRIMARY KEY 
      ("id")); COMMENT ON COLUMN 
      "base_model"."status" IS '0:Inactive, 1: Active, 2:Pending'`,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_6858b0bfee6d486b76e323b3e9" ON 
      "base_model" 
      ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_dc62b8b705c2883e1c45d4529c" ON 
      "base_model" 
      ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE 
      "member" 
      ("id" BIGSERIAL NOT NULL, 
      "name" character varying(255) NOT NULL, 
      "status" smallint NOT NULL DEFAULT '1', 
      "createAt" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "updateAt" TIMESTAMP NOT NULL, 
      "phone" character varying(20) NOT NULL, 
      "birthday" character varying(20), 
      "refresh_token" character varying(500), 
      "change_phone_code" character varying(20), 
      "code" character varying(20), CONSTRAINT 
      "UQ_d73619f5e63108e8d57e8e1859d" UNIQUE 
      ("phone"), CONSTRAINT 
      "UQ_87dbb39d7c7c430faa5bf1af3bb" UNIQUE 
      ("code"), CONSTRAINT 
      "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY 
      ("id")); COMMENT ON COLUMN 
      "member"."status" IS '0:Inactive, 1: Active, 2:Pending'; COMMENT ON COLUMN 
      "member"."phone" IS 'Your phone member'; COMMENT ON COLUMN 
      "member"."birthday" IS 'Birthday member'; COMMENT ON COLUMN 
      "member"."refresh_token" IS 'JWT token for authentication'; COMMENT ON COLUMN 
      "member"."change_phone_code" IS 'Code for change phone number'; COMMENT ON COLUMN 
      "member"."code" IS 'Code for member'`,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_97cbbe986ce9d14ca5894fdc07" ON 
      "member" 
      ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_edd000cc7aef7da0776ef763ce" ON 
      "member" 
      ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE 
      "notification" 
      ("id" BIGSERIAL NOT NULL, 
      "status" smallint NOT NULL DEFAULT '1', 
      "createAt" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "updateAt" TIMESTAMP NOT NULL, 
      "type" smallint, 
      "title" character varying(500), 
      "url" character varying(500), 
      "redirect_id" bigint, 
      "redirect_type" smallint, 
      "target_type" smallint NOT NULL DEFAULT '1', 
      "uuid" uuid, 
      "image" character varying(255), 
      "created_by" bigint, 
      "deleted_by" bigint, 
      "updated_by" bigint, 
      "deleted_at" TIMESTAMP, CONSTRAINT 
      "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY 
      ("id")); COMMENT ON COLUMN 
      "notification"."status" IS '0:Inactive, 1: Active, 2:Pending'`,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_705b6c7cdf9b2c2ff7ac7872cb" ON 
      "notification" 
      ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_c62fbe823d612cc7ad7b5c3dd9" ON 
      "notification" 
      ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_0720aa499ee315c39d8925c959" ON 
      "notification" 
      ("redirect_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_2bcdb87dc74b6ded01c685068a" ON 
      "notification" 
      ("redirect_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_63bd010e6972c79cb402177b14" ON 
      "notification" 
      ("target_type") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_354c58d3c73d8e063e7c46b18d" ON 
      "notification" 
      ("created_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_fc085407f2bdd335ef1186704b" ON 
      "notification" 
      ("deleted_by") `,
    );
    await queryRunner.query(
      `CREATE TABLE 
      "notification_member" 
      ("notification_id" bigint NOT NULL, 
      "member_id" bigint NOT NULL, 
      "is_read" smallint NOT NULL DEFAULT '0', 
      "status" smallint NOT NULL DEFAULT '1', 
      "createdAt" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
      "deleted_at" TIMESTAMP, CONSTRAINT 
      "PK_4b810225964c5c05ee4ba9df572" PRIMARY KEY 
      ("notification_id", 
      "member_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_cb4c97a9fb681dffbab667a381" ON 
      "notification_member" 
      ("notification_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_7f54c7fbfd93ce1a813a577d59" ON 
      "notification_member" 
      ("member_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_9171a018eefba6b3d13cecc531" ON 
      "notification_member" 
      ("is_read") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_436946491934c9ef01d7e65270" ON 
      "notification_member" 
      ("status") `,
    );
    await queryRunner.query(
      `CREATE TABLE 
      "verification_code" 
      ("id" BIGSERIAL NOT NULL, 
      "phone" character varying(20) NOT NULL, 
      "type" smallint NOT NULL, 
      "code" character varying(6) NOT NULL, 
      "retry_count" smallint NOT NULL DEFAULT '0', 
      "status" smallint NOT NULL DEFAULT '1', 
      "expire_at" TIMESTAMP NOT NULL, 
      "expire_retry" TIMESTAMP, 
      "use_at" TIMESTAMP NOT NULL, 
      "retry_at" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "update_at" TIMESTAMP NOT NULL DEFAULT now(), 
      "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT 
      "PK_d702c086da466e5d25974512d46" PRIMARY KEY 
      ("id")); COMMENT ON COLUMN 
      "verification_code"."type" IS '1: Register, 2: Change device'; COMMENT ON COLUMN 
      "verification_code"."retry_count" IS 'Max: 5'; COMMENT ON COLUMN 
      "verification_code"."status" IS '1: active, 0: inactive'`,
    );
    await queryRunner.query(
      `CREATE TABLE 
      "user" 
      ("id" BIGSERIAL NOT NULL, 
      "status" smallint NOT NULL DEFAULT '1', 
      "createAt" TIMESTAMP NOT NULL DEFAULT 
      ('now'::text)::timestamp(6) with time zone, 
      "updateAt" TIMESTAMP NOT NULL, 
      "role_id" smallint NOT NULL, 
      "email" character varying(255) NOT NULL, 
      "name" character varying(255) NOT NULL, 
      "phone" character varying(10) NOT NULL, 
      "password" character varying(255) NOT NULL, 
      "is_super_admin" smallint NOT NULL DEFAULT '0', 
      "refresh_token" character varying(500), CONSTRAINT 
      "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY 
      ("id")); COMMENT ON COLUMN 
      "user"."status" IS '0:Inactive, 1: Active, 2:Pending'; COMMENT ON COLUMN 
      "user"."role_id" IS 'Role của admin'; COMMENT ON COLUMN 
      "user"."name" IS 'FullName or name'; COMMENT ON COLUMN 
      "user"."is_super_admin" IS '1: Active, 0:A Active'; COMMENT ON COLUMN 
      "user"."refresh_token" IS 'JWT token'`,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_cace4a159ff9f2512dd4237376" ON 
      "user" 
      ("id") `,
    );
    await queryRunner.query(
      `CREATE INDEX 
      "IDX_3d44ccf43b8a0d6b9978affb88" ON 
      "user" 
      ("status") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_3d44ccf43b8a0d6b9978affb88"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_cace4a159ff9f2512dd4237376"`,
    );
    await queryRunner.query(`DROP TABLE 
    "user"`);
    await queryRunner.query(`DROP TABLE 
    "verification_code"`);
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_436946491934c9ef01d7e65270"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_9171a018eefba6b3d13cecc531"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_7f54c7fbfd93ce1a813a577d59"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_cb4c97a9fb681dffbab667a381"`,
    );
    await queryRunner.query(`DROP TABLE 
    "notification_member"`);
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_fc085407f2bdd335ef1186704b"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_354c58d3c73d8e063e7c46b18d"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_63bd010e6972c79cb402177b14"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_2bcdb87dc74b6ded01c685068a"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_0720aa499ee315c39d8925c959"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_c62fbe823d612cc7ad7b5c3dd9"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_705b6c7cdf9b2c2ff7ac7872cb"`,
    );
    await queryRunner.query(`DROP TABLE 
    "notification"`);
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_edd000cc7aef7da0776ef763ce"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_97cbbe986ce9d14ca5894fdc07"`,
    );
    await queryRunner.query(`DROP TABLE 
    "member"`);
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_dc62b8b705c2883e1c45d4529c"`,
    );
    await queryRunner.query(
      `DROP INDEX 
      "public"."IDX_6858b0bfee6d486b76e323b3e9"`,
    );
    await queryRunner.query(`DROP TABLE 
    "base_model"`);
  }
}
