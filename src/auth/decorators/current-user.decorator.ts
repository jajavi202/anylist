import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { ValidRoles } from "../enums/valid-roles.enum";


export const CurrentUser = createParamDecorator((roles: ValidRoles[] = [], context: ExecutionContext ) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (!user) throw new InternalServerErrorException('Not user inside request');
    if (roles.length === 0) return user;
    for (const role of roles) {
        if (user.roles.includes(role)) return user;
    }

    throw new ForbiddenException('User Role is Invalid');
});