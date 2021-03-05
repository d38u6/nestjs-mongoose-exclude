# nestjs-mongoose-exclude

Sanitize your [nestjs](https://nestjs.com/) response - Exclude selected properties from a [mongoose](https://mongoosejs.com/) document

# Idea

I wanted to find an easy way to exclude selected properties from my mongoose model. Unfortunately, [class-transformer](https://www.npmjs.com/package/class-transformer) library doesn't work correctly with mongoose models and documents.
So I wrote this little package to do this, is it strongly inspired by [class-transformer](https://www.npmjs.com/package/class-transformer).
The package contains a decorator that will let you mark properties to exclude and interceptor which you can use on your routes. [See an example](#Example). Package it is fully tested

# Example

You have the class-based schema `User`:

```typescript
@Schema()
export class User implements IUser {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;
}
```

If you want to exclude password from your response, you can simply add `ExcludeProperty` decorator:

```typescript
@Schema()
export class User implements IUser {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  @ExcludeProperty()
  password: string;
}
```

then your need to add an interceptor to your routes.
If you have something like this:

```typescript
@Get('/me')
  currentUser(@CurrentUser() user: User): UserResponse {
    return user;
  }
```

simply add `SanitizeMongooseModelInterceptor` to route:

```typescript
@UseInterceptors(new SanitizeMongooseModelInterceptor())
@Get('/me')
  currentUser(@CurrentUser() user: User): UserResponse {
    return user;
  }
```

Of course, you can add the interceptor to all routes inside your controller, instead of adding the interceptor before the route add it before the controller:

```typescript
@UseInterceptors(new SanitizeMongooseModelInterceptor())
@Controller('/users')
export class UsersController {
  @Get('/me')
  currentUser(@CurrentUser() user: User): UserResponse {
    return user;
  }
}
```

# Decorator and model name

You can pass your model name. like a decorator paramter:

```typescript
@ExcludeProperty(modelName: string)
```

by default model name it is referent to the class name:

```typescript
@Schema()
export class User implements IUser {
// for this example it is User.name
```

Remember that the model name you provided to the decorator must match with the name you registered:
your module file:

```typescript
MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
```

and your schema:

```typescript
@Schema()
export class User implements IUser {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  @ExcludeProperty()
  password: string;
}
```

or if you want to use a custom model name:

```typescript
MongooseModule.forFeature([{ name: 'UserModel', schema: UserSchema }]),
```

and your schema:

```typescript
@Schema()
export class User implements IUser {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  @ExcludeProperty('UserModel')
  password: string;
}
```

# Interceptor options

You can change this, provide it to them transform options object:

```typescript
TransformOptions {
  excludeMongooseId: boolean;
  excludeMongooseV: boolean;
}
```

So for example, you don't want to exclude mongoose id from a response then:

```typescript
@UseInterceptors(new SanitizeMongooseModelInterceptor({excludeMongooseId: false}))
```
