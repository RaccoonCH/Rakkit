import { Field, ObjectType, Int, Float } from "../../../src";

@ObjectType()
export class Recipe {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(type => [Int])
  ratings: number[];

  @Field()
  creationDate: Date;

  constructor(
    title: string,
    creationDate: Date,
    ratings: number[],
    description?: string
  ) {
    this.title = title;
    this.creationDate = creationDate;
    this.ratings = ratings;
    this.description = description;
  }

  @Field(type => Float, { nullable: true })
  get cachedAverageRating() {
    console.log(`Called 'cachedAverageRating' for recipe '${this.title}'`);
    return this.averageRating;
  }

  @Field(type => Float, { nullable: true })
  get averageRating(): number | null {
    const ratingsCount = this.ratings.length;
    if (ratingsCount === 0) {
      return null;
    }
    const ratingsSum = this.ratings.reduce((a, b) => a + b, 0);
    return ratingsSum / ratingsCount;
  }
}
