import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Subscription,
  ID,
  FlatArgs,
  IContext
} from "../../../src";

import { Recipe } from "./recipe.type";
import { CommentInput } from "./comment.input";
import { Comment } from "./comment.type";
import { NewCommentPayload } from "./newComment.interface";
import { Topic } from "./topics";
import { sampleRecipes } from "./recipe.samples";
import { NewCommentsInput } from "./recipe.resolver.input";

@Resolver()
export class RecipeResolver {
  private readonly recipes: Recipe[] = sampleRecipes.slice();

  @Query(returns => Recipe, { nullable: true })
  async recipe(@Arg("id", type => ID) id: string) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  @Mutation(returns => Boolean)
  async addNewComment(
    @Arg("comment")
    input: CommentInput,
    context: IContext
  ): Promise<boolean> {
    const recipe = this.recipes.find(r => r.id === input.recipeId);
    if (!recipe) {
      return false;
    }
    const comment: Comment = {
      content: input.content,
      nickname: input.nickname,
      date: new Date()
    };
    recipe.comments.push(comment);
    await context.gql.pubSub.publish(Topic.NewComment, {
      content: comment.content,
      nickname: comment.nickname,
      dateString: comment.date.toISOString(),
      recipeId: input.recipeId
    });
    return true;
  }

  @Subscription(returns => Comment, {
    topics: Topic.NewComment,
    filter: ({ payload, args }) => {
      return payload.recipeId === args.recipeId;
    }
  })
  newComments(
    @FlatArgs()
    recipeId: NewCommentsInput,
    payload: NewCommentPayload,
    context: IContext
  ): Comment {
    return {
      content: payload.content,
      date: new Date(payload.dateString), // limitation of Redis payload serialization
      nickname: payload.nickname
    };
  }
}
