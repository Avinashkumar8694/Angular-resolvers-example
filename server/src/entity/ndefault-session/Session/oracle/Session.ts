import { Column, Entity, Index, PrimaryColumn } from "typeorm";


@Entity()
export class Session {
  @Index()
  @Column("number")
  public expiresAt = Date.now();

  @PrimaryColumn('varchar2', { length: 255 })
  public id = "";

  @Column('char')
  public json = '';
}