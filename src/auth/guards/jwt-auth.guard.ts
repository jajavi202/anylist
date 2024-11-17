import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
    override getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        return request;
    }

    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { req, connection } = ctx.getContext();

        if (connection){
            const authHeader = connection.context.authorization;
            if (authHeader) {
                req.headers.authorization = authHeader;
            }
        }

        return super.canActivate(context);
    }
}