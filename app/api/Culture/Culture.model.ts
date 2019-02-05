import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Package, Attribute } from "@decorators";
import { RId, RShorttext } from "@types";
import { PageModel } from "@api/Page/Page.model";

@Package({ name: "Culture" })
@ObjectType()
@Entity({ name: "Culture" })
export default class CultureModel extends BaseEntity {
  @Attribute(new RId())
  @Field(type => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  readonly Id: number;

  private _langCode: string;
  private _countryCode: string;
  private _pages: PageModel[];

  @Attribute(new RShorttext())
  @Field({ nullable: true })
  @Column()
  get LangCode(): string {
    return this._langCode;
  }
  set LangCode(val: string) {
    this._langCode = val;
  }

  @Attribute(new RShorttext())
  @Field({ nullable: true })
  @Column()
  get CountryCode(): string {
    return this._countryCode;
  }
  set CountryCode(val: string) {
    this._countryCode = val;
  }

  @Field(type => [PageModel], { nullable: true })
  @OneToMany(type => PageModel, page => page.Culture)
  get Pages(): PageModel[] {
    return this._pages;
  }
  set Pages(val: PageModel[]) {
    this._pages = val;
  }

  @Attribute(new RShorttext())
  @Field({ nullable: true })
  get CultureInfo(): string {
    return `${this._langCode.toLowerCase()}-${this._countryCode.toUpperCase()}`;
  }
}
