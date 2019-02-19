import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "test" })
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly Id: number;

  @Column()
  Text: string;

  @Column()
  Index: number;

  constructor(text: string, index: number) {
    super();
    this.Text = text;
    this.Index = index;
  }
}
