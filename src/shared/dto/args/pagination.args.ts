import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsOptional, IsInt, Min, Max } from "class-validator";

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;

  @Field(() => Int, { defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  take: number = 10;
}