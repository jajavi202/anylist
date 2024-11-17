import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => String)
    @IsString()
    @IsEmail()
    email: string;

    @Field(() => String)
    @IsString()
    password: string;
}