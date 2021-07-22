import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { Bigint } from "typeorm-static";
 
@Entity()
export class Session  {
  @Index()
  @Column("bigint", { transformer: Bigint })
  public expiresAt = Date.now();
 
  @PrimaryColumn("varchar", { length: 255 })
  public id = "";
 
  @Column("text")
  public json = "";
}