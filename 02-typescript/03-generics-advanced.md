# TypeScript Generics and Advanced Types

> Master generics, constraints, conditional types, mapped types, utility types, and advanced TypeScript patterns for production code

---

## Question 1: Explain TypeScript Generics and Their Real-World Use Cases

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Google, Meta, Microsoft, Amazon, Airbnb

### Question
What are TypeScript generics? Explain how they work and provide real-world use cases where generics solve actual problems.

### Answer

**Generics** enable you to create reusable components that work with multiple types while maintaining type safety. They're like parameters for types.

**Key Points:**

1. **Type Variables** - Capture the type provided and use it throughout the function/class
2. **Reusability** - Write code once, use with any type
3. **Type Safety** - Maintain type checking across operations
4. **Flexibility** - Allow consumers to specify types they need
5. **No Type Assertions** - Avoid `any` and unsafe type casting

### Code Example

```typescript
// 1. BASIC GENERIC FUNCTION
function identity<T>(arg: T): T {
  return arg;
}

const str = identity<string>('hello');    // type: string
const num = identity<number>(42);          // type: number
const bool = identity<boolean>(true);      // type: boolean

// Type inference works too
const auto = identity('inferred');         // type: string (inferred)

// 2. GENERIC INTERFACE
interface Box<T> {
  value: T;
  getValue: () => T;
}

const stringBox: Box<string> = {
  value: 'hello',
  getValue: function() { return this.value; }
};

const numberBox: Box<number> = {
  value: 42,
  getValue: function() { return this.value; }
};

// 3. GENERIC CONSTRAINTS
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);  // Safe: we know T has length
  return arg;
}

logLength('hello');           // ✅ string has length
logLength([1, 2, 3]);         // ✅ array has length
logLength({ length: 10 });    // ✅ object with length property
// logLength(42);             // ❌ Error: number doesn't have length

// 4. MULTIPLE TYPE PARAMETERS
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const p1 = pair('name', 'John');      // [string, string]
const p2 = pair('age', 30);           // [string, number]
const p3 = pair(1, { data: 'test' }); // [number, object]

// 5. REAL-WORLD: API RESPONSE HANDLER
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Type-safe API calls
const user = await fetchData<User>('/api/users/1');
console.log(user.name);  // ✅ TypeScript knows this is a string

const posts = await fetchData<Post[]>('/api/posts');
console.log(posts[0].title);  // ✅ TypeScript knows posts is an array

// 6. REAL-WORLD: GENERIC STORAGE CLASS
class Storage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return this.items;
  }

  findById(id: number, idKey: keyof T): T | undefined {
    return this.items.find(item => item[idKey] === id);
  }
}

const userStorage = new Storage<User>();
userStorage.add({ id: 1, name: 'John', email: 'john@example.com' });
userStorage.add({ id: 2, name: 'Jane', email: 'jane@example.com' });

const users = userStorage.getAll();  // type: User[]
```

### Common Mistakes

```typescript
// ❌ WRONG: Using 'any' instead of generics
function badIdentity(arg: any): any {
  return arg;
}

const result = badIdentity('hello');  // type: any (no type safety!)

// ✅ CORRECT: Use generics
function goodIdentity<T>(arg: T): T {
  return arg;
}

const result2 = goodIdentity('hello');  // type: string (type safe!)

// ❌ WRONG: Accessing properties without constraints
function printLength<T>(arg: T): void {
  console.log(arg.length);  // Error: Property 'length' doesn't exist on type 'T'
}

// ✅ CORRECT: Use constraints
interface Lengthy {
  length: number;
}

function printLengthSafe<T extends Lengthy>(arg: T): void {
  console.log(arg.length);  // ✅ Safe
}

// ❌ WRONG: Over-constraining
function processArray<T extends any[]>(arr: T): void {
  // Now we can only use arrays, losing generic flexibility
}

// ✅ CORRECT: Constrain only what's needed
function processItems<T>(items: T[]): void {
  // Works with any array type
}
```

### Follow-up Questions
1. What are generic constraints and when would you use them?
2. How do generics work with React components (props)?
3. What are default type parameters in generics?

### Resources
- [TypeScript Generics Documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Advanced Generics Patterns](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

## Question 2: What Are Generic Constraints and How Do You Use Them?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Microsoft, Amazon, Shopify

### Question
Explain generic constraints in TypeScript. Why are they needed and how do you implement them?

### Answer

**Generic constraints** allow you to restrict the types that can be used with a generic. Instead of accepting ANY type, you specify that the type must have certain properties or extend a specific type.

**Key Points:**

1. **Syntax** - Use `extends` keyword: `<T extends Type>`
2. **Safety** - Access properties/methods safely within generic code
3. **Documentation** - Makes requirements clear to users
4. **Flexibility** - Still generic, but with minimum requirements
5. **Common Use** - API contracts, utility functions, React props

### Code Example

```typescript
// 1. BASIC CONSTRAINT
interface HasId {
  id: number;
}

function printId<T extends HasId>(obj: T): void {
  console.log(obj.id);  // ✅ Safe: we know T has id
}

printId({ id: 1, name: 'John' });     // ✅ Works
printId({ id: 2, age: 25 });          // ✅ Works
// printId({ name: 'John' });         // ❌ Error: no id property

// 2. CONSTRAINING TO PRIMITIVE TYPES
function toArray<T extends string | number>(value: T): T[] {
  return [value];
}

toArray('hello');   // ✅ string[]
toArray(42);        // ✅ number[]
// toArray(true);   // ❌ Error: boolean not allowed

// 3. KEYOF CONSTRAINT (very common pattern)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

const name = getProperty(person, 'name');    // type: string
const age = getProperty(person, 'age');      // type: number
// getProperty(person, 'salary');            // ❌ Error: 'salary' doesn't exist

// 4. MULTIPLE CONSTRAINTS
interface Identifiable {
  id: number;
}

interface Nameable {
  name: string;
}

function process<T extends Identifiable & Nameable>(item: T): string {
  return `${item.id}: ${item.name}`;
}

process({ id: 1, name: 'Item 1' });                    // ✅ Works
process({ id: 2, name: 'Item 2', extra: 'data' });     // ✅ Works
// process({ id: 1 });                                 // ❌ Error: missing name
// process({ name: 'Item' });                          // ❌ Error: missing id

// 5. REAL-WORLD: CRUD OPERATIONS
interface Entity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

class Repository<T extends Entity> {
  private items: Map<number, T> = new Map();

  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const now = new Date();
    const newItem = {
      ...item,
      id: this.items.size + 1,
      createdAt: now,
      updatedAt: now
    } as T;

    this.items.set(newItem.id, newItem);
    return newItem;
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  update(id: number, updates: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;

    const updated = {
      ...item,
      ...updates,
      updatedAt: new Date()
    };

    this.items.set(id, updated);
    return updated;
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }
}

// Usage with specific entity
interface User extends Entity {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

const userRepo = new Repository<User>();
const user = userRepo.create({
  name: 'John',
  email: 'john@example.com',
  role: 'user'
});
// TypeScript automatically adds id, createdAt, updatedAt

// 6. CONSTRUCTOR CONSTRAINT
function createInstance<T>(Constructor: new () => T): T {
  return new Constructor();
}

class Dog {
  bark() {
    return 'Woof!';
  }
}

const dog = createInstance(Dog);
dog.bark();  // ✅ Works, type is Dog

// 7. ARRAY ELEMENT CONSTRAINT
function getFirst<T extends any[]>(arr: T): T[0] {
  return arr[0];
}

const first = getFirst([1, 2, 3]);     // type: number
const name = getFirst(['a', 'b']);     // type: string
```

### Common Mistakes

```typescript
// ❌ WRONG: Not using constraint when needed
function merge<T, U>(obj1: T, obj2: U) {
  return { ...obj1, ...obj2 };  // Only works with objects
}

merge({ a: 1 }, { b: 2 });   // ✅ Works
merge('hello', 'world');     // ❌ Runtime error, but TypeScript allows it

// ✅ CORRECT: Constrain to objects
function mergeSafe<T extends object, U extends object>(obj1: T, obj2: U) {
  return { ...obj1, ...obj2 };
}

// mergeSafe('hello', 'world');  // ❌ Compile error caught early

// ❌ WRONG: Over-constraining unnecessarily
function length<T extends string>(str: T): number {
  return str.length;  // We constrained to string, so it's not really generic
}

// ✅ CORRECT: Use proper constraint
function lengthSafe<T extends { length: number }>(item: T): number {
  return item.length;  // Works with strings, arrays, anything with length
}
```

### Follow-up Questions
1. How do you use `keyof` with generics?
2. What's the difference between `T extends U` and `T & U`?
3. Can you have default values for generic type parameters?

### Resources
- [Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [Using Type Parameters in Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints)

---

## Question 3: Explain Conditional Types in TypeScript

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐
**Time:** 12 minutes
**Companies:** Google, Meta, Microsoft

### Question
What are conditional types in TypeScript? How and when would you use them in production code?

### Answer

**Conditional types** allow you to create types that depend on a condition. They use a ternary-like syntax: `T extends U ? X : Y`.

**Key Points:**

1. **Syntax** - `Type extends Condition ? TrueType : FalseType`
2. **Type-level Logic** - Make decisions about types at compile time
3. **Distributive** - Over union types automatically
4. **Built-in Utilities** - TypeScript's built-in utility types use them
5. **Advanced Patterns** - Extract, exclude, filter types

### Code Example

```typescript
// 1. BASIC CONDITIONAL TYPE
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;    // type: true
type B = IsString<number>;    // type: false
type C = IsString<'hello'>;   // type: true

// 2. REAL-WORLD: FUNCTION RETURN TYPE BASED ON INPUT
type ApiResponse<T> = T extends 'json' ? object : string;

function callApi<T extends 'json' | 'text'>(
  endpoint: string,
  format: T
): Promise<ApiResponse<T>> {
  return fetch(endpoint).then(res =>
    format === 'json' ? res.json() : res.text()
  ) as Promise<ApiResponse<T>>;
}

const jsonData = await callApi('/api/data', 'json');   // type: object
const textData = await callApi('/api/data', 'text');   // type: string

// 3. DISTRIBUTIVE CONDITIONAL TYPES (with unions)
type ToArray<T> = T extends any ? T[] : never;

type StringOrNumberArray = ToArray<string | number>;
// Distributes to: ToArray<string> | ToArray<number>
// Results in: string[] | number[]

// 4. INFER KEYWORD (extract types from other types)
type ReturnTypeCustom<T> = T extends (...args: any[]) => infer R ? R : never;

function greet(): string {
  return 'hello';
}

function getNumber(): number {
  return 42;
}

type GreetReturn = ReturnTypeCustom<typeof greet>;      // string
type NumberReturn = ReturnTypeCustom<typeof getNumber>;  // number

// 5. EXTRACT ARRAY ELEMENT TYPE
type ElementType<T> = T extends (infer E)[] ? E : T;

type NumArray = number[];
type Num = ElementType<NumArray>;  // number

type Str = ElementType<string>;    // string (not an array, returns itself)

// 6. REAL-WORLD: FLATTEN NESTED TYPES
type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
    ? T[keyof T]
    : T;

type Arr = Flatten<number[]>;              // number
type Obj = Flatten<{ a: string; b: number }>;  // string | number
type Prim = Flatten<string>;               // string

// 7. COMPLEX EXAMPLE: DEEP READONLY
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface Config {
  database: {
    host: string;
    port: number;
    credentials: {
      username: string;
      password: string;
    };
  };
  cache: {
    ttl: number;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
// All nested properties are readonly

const config: ReadonlyConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    credentials: {
      username: 'admin',
      password: 'secret'
    }
  },
  cache: {
    ttl: 3600
  }
};

// config.database.host = 'newhost';  // ❌ Error: readonly
// config.database.credentials.password = 'new';  // ❌ Error: readonly

// 8. PRACTICAL: EXCLUDE NULLABLE TYPES
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

// 9. FUNCTION PARAMETER TYPES
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never;

function myFunction(name: string, age: number, active: boolean) {
  return { name, age, active };
}

type MyFunctionParams = Parameters<typeof myFunction>;
// [name: string, age: number, active: boolean]
```

### Common Mistakes

```typescript
// ❌ WRONG: Forgetting distributive behavior
type WrapInArray<T> = T extends any ? T[] : never;
type Result = WrapInArray<string | number>;
// Result: string[] | number[] (distributes)
// You might expect: (string | number)[]

// ✅ CORRECT: Use tuple to prevent distribution
type WrapInArrayCorrect<T> = [T] extends [any] ? T[] : never;
type Result2 = WrapInArrayCorrect<string | number>;
// Result: (string | number)[]

// ❌ WRONG: Not handling never type
type ExtractString<T> = T extends string ? T : never;
type Test = ExtractString<never>;  // never (might be unexpected)

// ✅ CORRECT: Check for never explicitly if needed
type ExtractStringSafe<T> = [T] extends [never]
  ? 'no-type'
  : T extends string
    ? T
    : never;
```

### Follow-up Questions
1. What is the `infer` keyword and how does it work?
2. How are TypeScript's built-in utility types implemented using conditional types?
3. What are distributive conditional types?

### Resources
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

---

## Question 4: What Are Mapped Types in TypeScript?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Time:** 10 minutes
**Companies:** Meta, Microsoft, Airbnb

### Question
Explain mapped types in TypeScript. How do they work and what are common use cases?

### Answer

**Mapped types** allow you to create new types by transforming properties of an existing type. They iterate over the keys of a type and apply transformations.

**Key Points:**

1. **Syntax** - `{ [K in keyof T]: Transformation }`
2. **Transformation** - Modify property types, add modifiers (readonly, optional)
3. **Built-in Utilities** - `Partial`, `Required`, `Readonly`, `Pick` use mapped types
4. **Key Remapping** - Change property names with `as`
5. **Common Use** - DTOs, API responses, form states

### Code Example

```typescript
// 1. BASIC MAPPED TYPE
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; }

const user: ReadonlyUser = { id: 1, name: 'John' };
// user.name = 'Jane';  // ❌ Error: readonly

// 2. MAKING PROPERTIES OPTIONAL
type Partial<T> = {
  [K in keyof T]?: T[K];
};

type PartialUser = Partial<User>;
// { id?: number; name?: string; }

const partialUser: PartialUser = { name: 'John' };  // ✅ id is optional

// 3. MAKING PROPERTIES REQUIRED
type Required<T> = {
  [K in keyof T]-?: T[K];  // -? removes optional modifier
};

interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; }

// 4. NULLABLE TO NON-NULLABLE
type NonNullable<T> = {
  [K in keyof T]: Exclude<T[K], null | undefined>;
};

interface Data {
  name: string | null;
  age: number | undefined;
  email: string;
}

type CleanData = NonNullable<Data>;
// { name: string; age: number; email: string; }

// 5. KEY REMAPPING (TypeScript 4.1+)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number; }

// 6. REAL-WORLD: API RESPONSE TYPES
type ApiResponse<T> = {
  [K in keyof T]: {
    data: T[K];
    loading: boolean;
    error: Error | null;
  };
};

interface Entities {
  users: User[];
  posts: Post[];
}

type EntitiesState = ApiResponse<Entities>;
// {
//   users: { data: User[]; loading: boolean; error: Error | null; };
//   posts: { data: Post[]; loading: boolean; error: Error | null; };
// }

// 7. CONDITIONAL PROPERTY TRANSFORMATION
type StringifyProperties<T> = {
  [K in keyof T]: T[K] extends string ? T[K] : string;
};

interface Mixed {
  name: string;
  age: number;
  active: boolean;
}

type StringifiedMixed = StringifyProperties<Mixed>;
// { name: string; age: string; active: string; }

// 8. PICK SPECIFIC PROPERTIES
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type UserNameAndEmail = Pick<User, 'name' | 'email'>;
// { name: string; email: string; }

// 9. OMIT SPECIFIC PROPERTIES
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; }

// 10. REAL-WORLD: FORM STATE
interface FormFields {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

type MyFormState = FormState<FormFields>;
// {
//   username: { value: string; error: string | null; touched: boolean; };
//   email: { value: string; error: string | null; touched: boolean; };
//   ...
// }

const formState: MyFormState = {
  username: { value: '', error: null, touched: false },
  email: { value: '', error: null, touched: false },
  password: { value: '', error: null, touched: false },
  confirmPassword: { value: '', error: null, touched: false }
};

// 11. REMOVE SPECIFIC TYPE FROM UNION
type Exclude<T, U> = T extends U ? never : T;

type PrimitiveTypes = string | number | boolean | null | undefined;
type NonNullableTypes = Exclude<PrimitiveTypes, null | undefined>;
// string | number | boolean

// 12. EXTRACT SPECIFIC TYPE FROM UNION
type Extract<T, U> = T extends U ? T : U;

type StringAndNumber = Extract<PrimitiveTypes, string | number>;
// string | number
```

### Common Mistakes

```typescript
// ❌ WRONG: Modifying the original type
interface User {
  id: number;
  name: string;
}

// This doesn't work - you can't modify interface in place
// User = Readonly<User>;  // Error

// ✅ CORRECT: Create new type
type ReadonlyUser = Readonly<User>;

// ❌ WRONG: Not using keyof
type BadMap<T> = {
  [K in T]: string;  // Error: T is not assignable to string | number | symbol
};

// ✅ CORRECT: Use keyof T
type GoodMap<T> = {
  [K in keyof T]: string;
};
```

### Follow-up Questions
1. How do you combine mapped types with conditional types?
2. What's the difference between `Partial<T>` and `Partial<T> & Required<Pick<T, 'id'>>`?
3. How would you create a `DeepPartial<T>` type?

### Resources
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Key Remapping in Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)

---

## Question 5: Explain TypeScript Utility Types

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** All major companies

### Question
What are TypeScript's built-in utility types? Explain the most commonly used ones with examples.

### Answer

**Utility types** are built-in TypeScript types that help with common type transformations. They're implemented using mapped types and conditional types.

**Key Utility Types:**

1. **Partial<T>** - All properties optional
2. **Required<T>** - All properties required
3. **Readonly<T>** - All properties readonly
4. **Pick<T, K>** - Select subset of properties
5. **Omit<T, K>** - Exclude properties
6. **Record<K, T>** - Create object type with keys K and values T
7. **Exclude<T, U>** - Exclude types from union
8. **Extract<T, U>** - Extract types from union
9. **NonNullable<T>** - Remove null and undefined
10. **ReturnType<T>** - Extract function return type

### Code Example

```typescript
// 1. Partial<T> - Make all properties optional
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

function updateTodo(todo: Todo, updates: Partial<Todo>): Todo {
  return { ...todo, ...updates };
}

const todo: Todo = {
  title: 'Learn TypeScript',
  description: 'Study utility types',
  completed: false
};

const updated = updateTodo(todo, { completed: true });
// Only need to provide properties we're updating

// 2. Required<T> - Make all properties required
interface Config {
  host?: string;
  port?: number;
  timeout?: number;
}

const requiredConfig: Required<Config> = {
  host: 'localhost',
  port: 3000,
  timeout: 5000
  // All properties must be provided
};

// 3. Readonly<T> - Make all properties readonly
interface Point {
  x: number;
  y: number;
}

const point: Readonly<Point> = { x: 10, y: 20 };
// point.x = 5;  // ❌ Error: readonly

// 4. Pick<T, K> - Select specific properties
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type UserPreview = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string; }

// Perfect for API responses where you don't want to expose sensitive data
function getUserPreview(user: User): UserPreview {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

// 5. Omit<T, K> - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; createdAt: Date; }

// Great for creating DTOs
type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
// { name: string; email: string; password: string; }

// 6. Record<K, T> - Create object type
type Role = 'admin' | 'user' | 'guest';
type Permissions = 'read' | 'write' | 'delete';

type RolePermissions = Record<Role, Permissions[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Another example: Cache
type Cache = Record<string, any>;

const cache: Cache = {
  'user:1': { name: 'John' },
  'user:2': { name: 'Jane' },
  'config': { theme: 'dark' }
};

// 7. Exclude<T, U> - Remove types from union
type AllTypes = string | number | boolean | null | undefined;
type PrimitiveTypes = Exclude<AllTypes, null | undefined>;
// string | number | boolean

type EventType = 'click' | 'scroll' | 'mousemove' | 'keypress';
type ClickEvent = Exclude<EventType, 'scroll' | 'mousemove'>;
// 'click' | 'keypress'

// 8. Extract<T, U> - Extract types from union
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number }
  | { kind: 'triangle'; base: number; height: number };

type CircleOrSquare = Extract<Shape, { kind: 'circle' | 'square' }>;
// { kind: 'circle'; radius: number } | { kind: 'square'; sideLength: number }

// 9. NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;  // string

function processValue(value: MaybeString): NonNullable<MaybeString> {
  if (value === null || value === undefined) {
    return 'default';
  }
  return value;
}

// 10. ReturnType<T> - Extract function return type
function createUser() {
  return {
    id: 1,
    name: 'John',
    email: 'john@example.com'
  };
}

type User = ReturnType<typeof createUser>;
// { id: number; name: string; email: string; }

// 11. Parameters<T> - Extract function parameter types
function greet(name: string, age: number) {
  return `Hello ${name}, you are ${age} years old`;
}

type GreetParams = Parameters<typeof greet>;
// [name: string, age: number]

function callGreet(params: GreetParams) {
  return greet(...params);
}

// 12. REAL-WORLD COMBINATION
interface ApiUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Creating user (exclude auto-generated fields)
type CreateUser = Omit<ApiUser, 'id' | 'createdAt' | 'updatedAt'>;

// Updating user (all fields optional, exclude id)
type UpdateUser = Partial<Omit<ApiUser, 'id' | 'createdAt' | 'updatedAt'>>;

// Public user (exclude sensitive data)
type PublicUser = Omit<ApiUser, 'password'>;

// User state in frontend
type UserState = Readonly<PublicUser>;

const createUserDto: CreateUser = {
  username: 'john',
  email: 'john@example.com',
  password: 'secret',
  role: 'user'
};

const updateUserDto: UpdateUser = {
  email: 'newemail@example.com'
  // Only updating email, everything else optional
};
```

### Common Mistakes

```typescript
// ❌ WRONG: Using Partial when you need specific optionals
interface User {
  id: number;
  name: string;
  email: string;
}

type UpdateUser = Partial<User>;  // Makes ALL optional, including id

// ✅ CORRECT: Use Omit + Partial for specific behavior
type UpdateUserCorrect = Partial<Omit<User, 'id'>> & Pick<User, 'id'>;
// id is required, name and email are optional

// ❌ WRONG: Trying to use utility types on unions incorrectly
type Status = 'pending' | 'success' | 'error';
type PickStatus = Pick<Status, 'pending'>;  // Error: Status is not an object

// ✅ CORRECT: Use Extract for unions
type PickStatusCorrect = Extract<Status, 'pending'>;
```

### Follow-up Questions
1. How would you implement `Partial<T>` from scratch?
2. When would you use `Record<K, T>` vs a regular object type?
3. How do you combine multiple utility types for complex transformations?

### Resources
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

---

## Questions 6-15: Advanced Generic Patterns

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐⭐
**Consolidated advanced generics coverage**

### Q6-8: Generic Constraints & Conditional Types

```typescript
// Generic constraints with extends
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Multiple generic constraints
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

// Conditional types with generics
type ArrayOrSingle<T> = T extends any[] ? T : T[];
type Result1 = ArrayOrSingle<number>; // number[]
type Result2 = ArrayOrSingle<number[]>; // number[]

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrArrOrNumArr = ToArray<string | number>;
// string[] | number[] (distributed)
```

### Q9-11: Generic Utility Type Construction

```typescript
// Custom Readonly deep
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

// Recursive Pick
type DeepPick<T, K extends string> = K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
    ? { [P in K1]: DeepPick<T[K1], K2> }
    : never
  : K extends keyof T
  ? { [P in K]: T[P] }
  : never;

// Mutable (opposite of Readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Optional to Required
type OptionalToRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
```

### Q12-15: Real-World Generic Patterns

```typescript
// Generic API Response
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// Generic Repository Pattern
interface Repository<T> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: string) { /* ... */ }
  async findAll() { /* ... */ }
  async create(item: Omit<User, 'id'>) { /* ... */ }
  async update(id: string, item: Partial<User>) { /* ... */ }
  async delete(id: string) { /* ... */ }
}

// Generic State Management
type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

type Actions =
  | Action<'INCREMENT'>
  | Action<'DECREMENT'>
  | Action<'SET_VALUE', number>;

function reducer(state: number, action: Actions): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'SET_VALUE':
      return action.payload; // Type-safe!
    default:
      return state;
  }
}
```

### Resources
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Advanced Generic Patterns](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

---

**[← Back to TypeScript README](./README.md)**

**Progress:** 15 of 15 generics questions completed ✅
