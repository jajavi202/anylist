import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import path, { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ItemsModule } from './items/items.module';
import { PubSub } from 'graphql-subscriptions';
import { SharedModule } from './shared/shared.module';
import { Context } from 'vm';
import { isSubscription } from 'rxjs/internal/Subscription';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

const pubSub = new PubSub();

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      subscriptions: {
        'graphql-ws': true,
      },
      introspection: true,
    }),

    // GraphQLModule.forRootAsync<ApolloDriverConfig>(
    //   {
    //     driver: ApolloDriver,
    //     imports: [AuthModule, ConfigModule],
    //     inject: [JwtService],
    //     useFactory: async (JwtService: JwtService) => ({
    //       subscriptions: {
    //         'graphql-ws': {
    //           path: '/graphql',
    //           onConnect: (connectionParams: any) => {
    //             console.log('Connected');
    //             console.log('Connection params:', connectionParams); // Debugging line
    //             const authToken = connectionParams.connectionParams?.Authorization;
    //             if (!authToken) { throw new Error('No auth token!'); }
    //             let payload;
    //             try {
    //               payload = JwtService.decode(authToken.replace('Bearer ', ''))
    //             } catch (e) {
    //               throw new Error('Invalid token');
    //             }

    //             return { user: payload };
    //           },
    //         }
    //       },
    //       playground: false,
    //       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //       plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //       context: ({ req, connection }) => {
    //         if (!connection) {
    //           const token = req.headers.authorization?.replace('Bearer ', '');
    //           if (!token) throw new Error('No token provided');

    //           const payload = JwtService.decode(token);
    //           if (!payload) throw new Error('Invalid token');
    //         }
    //       },
    //      })
    //    }
    // ),

    ItemsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    SharedModule,
    ListsModule,
    ListItemModule,
  ],
  controllers: [],
})
export class AppModule {}
