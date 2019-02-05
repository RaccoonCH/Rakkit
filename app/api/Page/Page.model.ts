import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Package, Attribute } from "@decorators";
import { RId, RShorttext, RObject } from "@types";
import CultureModel from "@api/Culture/Culture.model";

@Package({ name: "Page" })
@InputType("PageInput")
@ObjectType()
@Entity({ name: "Page" })
export class PageModel extends BaseEntity {
  @Attribute(new RId())
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  readonly Id: number;

  private _title: string;
  private _model: string;
  private _content: string;
  private _url: string;
  private _culture: CultureModel;

  @Attribute(new RShorttext())
  @Field()
  @Column()
  get Title(): string {
    return this._title;
  }
  set Title(val: string) {
    this._title = val;
  }

  @Attribute(new RShorttext(), { isInHeader: false })
  @Field()
  @Column("simple-json")
  get Model(): string {
    return this._model;
  }
  set Model(val: string) {
    this._model = val;
  }

  @Attribute(new RShorttext(), { isInHeader: false })
  @Field()
  @Column("simple-json")
  get Content(): string {
    return this._content;
  }
  set Content(val: string) {
    this._content = val;
  }

  @Attribute(new RObject("CultureInfo"))
  @Field(type => CultureModel, { nullable: true })
  @ManyToOne(type => CultureModel, cultureModel => cultureModel.Pages)
  get Culture(): CultureModel {
    return this._culture;
  }
  set Culture(val: CultureModel) {
    this._culture = val;
  }

  @Attribute(new RShorttext())
  @Field()
  @Column()
  get Url(): string {
    return this._url;
  }
  set Url(val: string) {
    this._url = val;
  }
}
