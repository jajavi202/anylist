import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class SignInInput {
    @Field(() => String)
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @Field(() => String)
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    password: string;

}