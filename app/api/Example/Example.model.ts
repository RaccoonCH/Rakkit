import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Field, ObjectType } from "rakkitql";
import { Package } from "@decorators";
import { Test } from "./Test.model";

@Package({ name: "Example" })
@ObjectType()
@Entity({ name: "Example" })
export class ExampleModel extends BaseEntity {
  @Field(type => Test, { nullable: true })
  @ManyToOne(type => Test, test => test.examples)
  test: Test;

  @Field(type => Number)
  @PrimaryGeneratedColumn()
  readonly Id: number;
  private _name: string;
  private _text: string;

  constructor (name: string, text: string) {
    super();
    this.Name = name;
    this.Text = text;
  }

  @Field()
  @Column()
  get Name(): string {
    return this._name;
  }
  set Name(val: string) {
    this._name = val;
  }

  @Field()
  @Column()
  get Text(): string {
    return this._text;
  }
  set Text(val: string) {
    this._text = val;
  }
}
