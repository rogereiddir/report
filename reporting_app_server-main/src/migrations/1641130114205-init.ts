import {MigrationInterface, QueryRunner} from "typeorm";

export class init1641130114205 implements MigrationInterface {
    name = 'init1641130114205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "seeds" ("id" SERIAL NOT NULL, "email" character varying(250) NOT NULL, "password" character varying(250) NOT NULL, "isp" character varying(250) NOT NULL, "proxy" character varying(500) NOT NULL, "verificationemail" character varying(500), "status" character varying NOT NULL DEFAULT 'idle', "feedback" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" integer, "listId" integer, CONSTRAINT "UQ_a89a127087259c9d86300922cd3" UNIQUE ("email"), CONSTRAINT "PK_3ac799e4ece18bc838823bb6a4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "results" ("id" SERIAL NOT NULL, "start" TIMESTAMP WITH TIME ZONE DEFAULT NULL, "end" TIMESTAMP WITH TIME ZONE DEFAULT NULL, "feedback" text NOT NULL DEFAULT '', "status" character varying(250) NOT NULL DEFAULT 'idle', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "seedId" integer, "processId" integer, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "processes" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "jobId" bigint, "actions" character varying(500) NOT NULL, "status" character varying(250) NOT NULL DEFAULT 'idle', "file" character varying(250) NOT NULL DEFAULT '', "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "listId" integer, CONSTRAINT "PK_566885de50f7d20a6df306c12e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "isp" character varying(250) NOT NULL, "count" integer NOT NULL DEFAULT '0', "status" character varying(250) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "entityId" integer, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(250) NOT NULL, "type" character varying(250), "password" character varying(250) NOT NULL, "access" character varying(250) NOT NULL DEFAULT '{null}', "role" character varying(250) NOT NULL, "status" character varying NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "name" character varying(250) NOT NULL, "code" character varying(250) NOT NULL DEFAULT '', "alias" character varying(250) NOT NULL DEFAULT '', "status" character varying(250) NOT NULL DEFAULT 'Active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE ("name"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "authorizedips" ("id" SERIAL NOT NULL, "ip" character varying(250) NOT NULL, "type" character varying(250) NOT NULL, "status" character varying(250) NOT NULL DEFAULT 'Active', "note" character varying(250) NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityId" integer, CONSTRAINT "PK_e2039e804901b2d266b63891739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "seeds" ADD CONSTRAINT "FK_877fb1d0d08cdd324ee218e02f4" FOREIGN KEY ("entityId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "seeds" ADD CONSTRAINT "FK_8fa81c9b99a885eff139af7e04f" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_728fba7e5fdacd5b6ea2e23f74f" FOREIGN KEY ("seedId") REFERENCES "seeds"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_f3ee10d6b797f9c91d33f1b6042" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processes" ADD CONSTRAINT "FK_362c80731956902cc92bc9439a3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "processes" ADD CONSTRAINT "FK_d0ecbff0654d80bac6a12d6f364" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_d13ad3f1ae1abae672c3edbef90" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lists" ADD CONSTRAINT "FK_55afb11a640cfd18b71c1983a67" FOREIGN KEY ("entityId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_6fd5a6ee62e2059b89dddbcd3bf" FOREIGN KEY ("entityId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "authorizedips" ADD CONSTRAINT "FK_d1c310893dc1455186046e8711b" FOREIGN KEY ("entityId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authorizedips" DROP CONSTRAINT "FK_d1c310893dc1455186046e8711b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_6fd5a6ee62e2059b89dddbcd3bf"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_55afb11a640cfd18b71c1983a67"`);
        await queryRunner.query(`ALTER TABLE "lists" DROP CONSTRAINT "FK_d13ad3f1ae1abae672c3edbef90"`);
        await queryRunner.query(`ALTER TABLE "processes" DROP CONSTRAINT "FK_d0ecbff0654d80bac6a12d6f364"`);
        await queryRunner.query(`ALTER TABLE "processes" DROP CONSTRAINT "FK_362c80731956902cc92bc9439a3"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_f3ee10d6b797f9c91d33f1b6042"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_728fba7e5fdacd5b6ea2e23f74f"`);
        await queryRunner.query(`ALTER TABLE "seeds" DROP CONSTRAINT "FK_8fa81c9b99a885eff139af7e04f"`);
        await queryRunner.query(`ALTER TABLE "seeds" DROP CONSTRAINT "FK_877fb1d0d08cdd324ee218e02f4"`);
        await queryRunner.query(`DROP TABLE "authorizedips"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`DROP TABLE "processes"`);
        await queryRunner.query(`DROP TABLE "results"`);
        await queryRunner.query(`DROP TABLE "seeds"`);
    }

}
