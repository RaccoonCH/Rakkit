import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { hashSync } from "bcrypt";
import { Attribute, Package } from "@decorators";
import { RId, RShorttext, RPassword } from "@types";

@Package({ name: "User", description: "User package" })
@ObjectType()
@Entity({ name: "User" })
export class UserModel extends BaseEntity {
  @Attribute(new RShorttext("Enter the name here"))
  @Field()
  @Column({ unique: true })
  get Name(): string {
    return this._name;
  }
  set Name(val: string) {
    this._name = val;
  }

  @Attribute(new RShorttext())
  @Field()
  @Column({ unique: true })
  get Email(): string {
    return this._email;
  }
  set Email(val: string) {
    this._email = val;
  }

  @Attribute(new RPassword())
  @Field()
  @Column()
  get Password(): string {
    return this._password;
  }
  set Password(val: string) {
    this._password = val;
  }

  @Attribute(new RShorttext())
  @Field()
  @Column()
  get Role(): string {
    return this._role;
  }
  set Role(val: string) {
    this._role = val;
  }

  @Attribute(new RId())
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly Id: number;
  private _name: string;
  private _email: string;
  private _role: string;
  private _password: string;

  constructor(name: string, email: string, password: string, confirm: string, role = "default") {
    if (password === confirm) {
      super();
      this.Name = name;
      this.Email = email;
      this.Role = role;
      this.Password = password ? hashSync(password, 10) : "";
    } else {
      throw new Error("password:match");
    }
  }
}
