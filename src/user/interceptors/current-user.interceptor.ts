// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { UsersService } from '../users.service';

// @Injectable()
// export class CurrentUserInterceptor implements NestInterceptor {
//   constructor(private userSerivce: UsersService) {}

//   async intercept(context: ExecutionContext, handler: CallHandler<any>) {
//     const request = context.switchToHttp().getRequest();
//     const { userId } = request.session || {};

//     if (userId) {
//       const user = await this.userSerivce.findOne(userId);
//       request.currentUser = user;
//     }

//     return handler.handle();
//   }
// }
