# TypeScript with Next.js

> Master TypeScript in Next.js: Pages Router, App Router, Server Components, API Routes, and data fetching patterns

---

## Question 1: How Do You Type Next.js Pages Router with getServerSideProps?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 7 minutes
**Companies:** Vercel, Airbnb, Netflix

### Question
How do you properly type Next.js pages using the Pages Router with `getServerSideProps` and `getStaticProps`?

### Answer

**Key Points:**
1. **NextPage** - Type for page components
2. **GetServerSideProps** - Type for SSR data fetching
3. **GetStaticProps** - Type for SSG data fetching
4. **InferGetServerSidePropsType** - Infer props from data fetching function
5. **Context** - Access params, query, req, res with proper types

### Code Example

```typescript
import { GetServerSideProps, GetStaticProps, NextPage, InferGetServerSidePropsType } from 'next';

// 1. BASIC PAGE WITH getServerSideProps
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserPageProps {
  user: User;
  timestamp: string;
}

const UserPage: NextPage<UserPageProps> = ({ user, timestamp }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <small>Fetched at: {timestamp}</small>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
  const userId = context.params?.id as string;

  // Access query params, cookies, etc.
  const { token } = context.query;
  const cookies = context.req.cookies;

  const user = await fetch(`/api/users/${userId}`).then(r => r.json());

  return {
    props: {
      user,
      timestamp: new Date().toISOString()
    }
  };
};

export default UserPage;

// 2. USING InferGetServerSidePropsType (Recommended)
export const getServerSideProps2 = async (context: GetServerSidePropsContext) => {
  const user = await fetchUser();
  return {
    props: { user, timestamp: Date.now() }
  };
};

// Type is automatically inferred from getServerSideProps return value
type Props = InferGetServerSidePropsType<typeof getServerSideProps2>;

const UserPage2: NextPage<Props> = ({ user, timestamp }) => {
  // user and timestamp are properly typed
  return <div>{user.name}</div>;
};

// 3. getStaticProps WITH PATHS
interface PostProps {
  post: {
    id: string;
    title: string;
    content: string;
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchAllPosts();

  return {
    paths: posts.map(post => ({
      params: { id: post.id }
    })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const postId = context.params?.id as string;
  const post = await fetchPost(postId);

  if (!post) {
    return {
      notFound: true
    };
  }

  return {
    props: { post },
    revalidate: 60 // ISR: revalidate every 60 seconds
  };
};

// 4. ERROR HANDLING IN DATA FETCHING
export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
  try {
    const user = await fetchUser();
    return { props: { user, timestamp: Date.now() } };
  } catch (error) {
    return {
      redirect: {
        destination: '/error',
        permanent: false
      }
    };
  }
};
```

### Resources
- [Next.js TypeScript](https://nextjs.org/docs/basic-features/typescript)

---

## Question 2: How Do You Type Next.js API Routes?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 6 minutes
**Companies:** All Next.js companies

### Question
How do you properly type Next.js API routes with request/response objects and different HTTP methods?

### Answer

**Key Points:**
1. **NextApiRequest** - Typed request object
2. **NextApiResponse** - Typed response with generics for response data
3. **HTTP Methods** - Type-safe method checking
4. **Custom Types** - Create interfaces for request/response bodies
5. **Middleware** - Type middleware functions properly

### Code Example

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

// 1. BASIC API ROUTE
type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ message: 'Hello from API' });
}

// 2. HANDLING DIFFERENT HTTP METHODS
interface User {
  id: number;
  name: string;
  email: string;
}

type GetResponse = { users: User[] };
type PostResponse = { user: User };
type ErrorResponse = { error: string };

export default async function usersHandler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponse | PostResponse | ErrorResponse>
) {
  if (req.method === 'GET') {
    const users = await fetchUsers();
    return res.status(200).json({ users });
  }

  if (req.method === 'POST') {
    const { name, email } = req.body;
    const user = await createUser({ name, email });
    return res.status(201).json({ user });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// 3. TYPED REQUEST BODY
interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PostResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as CreateUserRequest;

  if (!body.name || !body.email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const user = await createUser(body);
  return res.status(201).json({ user });
}

// 4. CUSTOM MIDDLEWARE WITH TYPES
type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => void;

const authMiddleware: MiddlewareFunction = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Attach user to request
  (req as any).user = decodeToken(token);
  next();
};

// 5. GENERIC API HANDLER
type ApiHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>
) => Promise<void> | void;

const createApiHandler = <T>(handler: ApiHandler<T>) => {
  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    try {
      await handler(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' } as T);
    }
  };
};
```

### Resources
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## Question 3: How Do You Type Next.js App Router Components?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Vercel, Modern Next.js projects

### Question
How do you type Next.js 13+ App Router components, including Server Components, layouts, and route handlers?

### Answer

**Key Points:**
1. **Server Components** - Default in App Router, async components supported
2. **Page Props** - `params` and `searchParams` are automatically passed
3. **Layout Props** - Type children and params
4. **Route Handlers** - New API route format in App Router
5. **Metadata** - Type metadata exports

### Code Example

```typescript
// 1. BASIC PAGE COMPONENT (Server Component)
interface PageProps {
  params: { id: string };
  searchParams: { sort?: string; filter?: string };
}

export default async function UserPage({ params, searchParams }: PageProps) {
  // Can use async/await directly in Server Components
  const user = await fetchUser(params.id);
  const sortOrder = searchParams.sort || 'asc';

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Sort: {sortOrder}</p>
    </div>
  );
}

// 2. LAYOUT COMPONENT
interface LayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function Layout({ children, params }: LayoutProps) {
  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}

// 3. ROUTE HANDLERS (App Router API Routes)
import { NextRequest, NextResponse } from 'next/server';

interface User {
  id: number;
  name: string;
}

// GET handler
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  const users: User[] = await fetchUsers(query);

  return NextResponse.json({ users });
}

// POST handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  const user = await createUser(body);

  return NextResponse.json({ user }, { status: 201 });
}

// 4. DYNAMIC ROUTE HANDLER
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await fetchUser(params.id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}

// 5. METADATA
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description'
};

// Dynamic metadata
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const user = await fetchUser(params.id);

  return {
    title: user.name,
    description: `Profile of ${user.name}`
  };
}

// 6. CLIENT COMPONENT
'use client';

import { useState } from 'react';

interface ClientComponentProps {
  initialCount: number;
}

export default function Counter({ initialCount }: ClientComponentProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Resources
- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

**[← Back to TypeScript README](./README.md)**
