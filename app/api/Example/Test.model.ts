import { Field, ObjectType, ID } from "rakkitql";
import { OneToMany, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ExampleModel } from "./Example.model";

@ObjectType()
@Entity("test")
export class Test {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly Id: number;

  @Field(type => ExampleModel, { nullable: true })
  @OneToMany(type => ExampleModel, example => example.test)
  examples: ExampleModel[];

  @Field(type => String, { nullable: true })
  @Column()
  text: String;
}
