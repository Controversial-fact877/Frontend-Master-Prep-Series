# React Component Patterns

> Composition, render props, HOC, compound components, controlled vs uncontrolled, and modern React patterns.

---

## Question 1: Composition vs Inheritance in React

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8-10 minutes
**Companies:** Meta, Google, Airbnb

### Question
Why does React favor composition over inheritance? Demonstrate composition patterns.

### Answer

**React Recommendation: Use composition, not inheritance**

```jsx
// ❌ Inheritance (Don't do this in React)
class BaseButton extends React.Component {
  handleClick() {
    // base logic
  }
}

class PrimaryButton extends BaseButton {
  // Inherits from BaseButton
}

// ✅ Composition (React way)
function Button({ variant, children, onClick }) {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

// Usage
<Button variant="primary">Click Me</Button>
```

**Composition Patterns:**

```jsx
// 1. Children Prop (most common)
function Dialog({ children }) {
  return (
    <div className="dialog">
      {children}
    </div>
  );
}

<Dialog>
  <h1>Title</h1>
  <p>Content</p>
</Dialog>

// 2. Specialized Components
function WelcomeDialog() {
  return (
    <Dialog>
      <h1>Welcome</h1>
      <p>Thank you for visiting</p>
    </Dialog>
  );
}

// 3. Slots Pattern
function Layout({ header, sidebar, content }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

<Layout
  header={<Header />}
  sidebar={<Sidebar />}
  content={<Content />}
/>
```

### Resources
- [React Composition](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

---

## Question 2: What Are Higher-Order Components (HOCs)?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐⭐
**Time:** 8 minutes
**Companies:** Meta, Netflix, Uber

### Question
What are Higher-Order Components? When would you use them and what are modern alternatives?

### Answer

**HOC** - A function that takes a component and returns a new component with additional props or behavior.

**Key Points:**
1. **Pure function** - Doesn't modify the original component
2. **Reuse logic** - Share behavior across components
3. **Convention** - Prefix with `with` (withAuth, withLoading)
4. **Modern alternative** - Custom hooks are often better
5. **Use sparingly** - Can create wrapper hell

### Code Example

```jsx
// HOC Pattern
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// Usage
function UserList({ users }) {
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

const UserListWithLoading = withLoading(UserList);

// In parent component
<UserListWithLoading isLoading={loading} users={users} />

// Real-world: Authentication HOC
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;
    if (!user) return <Redirect to="/login" />;

    return <Component {...props} user={user} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);

// Modern Alternative: Custom Hook (Preferred)
function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Redirect to="/login" />;

  return <div>Welcome {user.name}</div>;
}
```

### Resources
- [Higher-Order Components](https://react.dev/reference/react/Component#alternatives)

---

## Question 3: What is the Render Props Pattern?

**Difficulty:** 🟡 Medium
**Frequency:** ⭐⭐⭐
**Time:** 7 minutes
**Companies:** Airbnb, Stripe

### Question
What is the render props pattern? How does it work and when should you use it?

### Answer

**Render Props** - A pattern where a component accepts a function prop that returns React elements.

**Key Points:**
1. **Function as child** - Pass render logic as a prop
2. **Share state/logic** - Without HOCs
3. **Flexible** - Consumer controls rendering
4. **Modern alternative** - Custom hooks
5. **Children as function** - Common variant

### Code Example

```jsx
// Render Props Pattern
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return render(position);
}

// Usage
<Mouse
  render={({ x, y }) => (
    <div>Mouse position: {x}, {y}</div>
  )}
/>

// Children as Function Variant
function Mouse({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return children(position);
}

// Usage
<Mouse>
  {({ x, y }) => <div>Position: {x}, {y}</div>}
</Mouse>

// Modern Alternative: Custom Hook (Simpler!)
function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}

// Usage (much cleaner)
function MouseTracker() {
  const { x, y } = useMouse();
  return <div>Position: {x}, {y}</div>;
}
```

### Resources
- [Render Props](https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop)

---

## Question 4: What Are Compound Components?

**Difficulty:** 🔴 Hard
**Frequency:** ⭐⭐⭐
**Time:** 10 minutes
**Companies:** Design system teams, Airbnb

### Question
What are compound components? How do they work and when would you use this pattern?

### Answer

**Compound Components** - Components that work together to form a complete UI, sharing implicit state.

**Key Points:**
1. **Implicit state sharing** - Via Context
2. **Flexible composition** - Users control structure
3. **Encapsulation** - Implementation hidden
4. **Common in** - Design systems, complex UI
5. **Examples** - Select, Tabs, Accordion components

### Code Example

```jsx
// Compound Component Pattern
const TabsContext = createContext();

function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      className={isActive ? 'tab active' : 'tab'}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabPanel({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;

  return <div className="tab-panel">{children}</div>;
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage - Very flexible!
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Tab value="profile">Profile</Tabs.Tab>
    <Tabs.Tab value="settings">Settings</Tabs.Tab>
    <Tabs.Tab value="billing">Billing</Tabs.Tab>
  </Tabs.List>

  <Tabs.Panel value="profile">
    <ProfileContent />
  </Tabs.Panel>
  <Tabs.Panel value="settings">
    <SettingsContent />
  </Tabs.Panel>
  <Tabs.Panel value="billing">
    <BillingContent />
  </Tabs.Panel>
</Tabs>

// Real-world: Accordion
function Accordion({ children }) {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (id) => {
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, children }) {
  const { openItems, toggleItem } = useContext(AccordionContext);
  const isOpen = openItems.includes(id);

  return (
    <div className="accordion-item">
      <button onClick={() => toggleItem(id)}>
        {isOpen ? '−' : '+'}
      </button>
      {isOpen && <div className="content">{children}</div>}
    </div>
  );
}
```

### Resources
- [Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks)

---

**[← Back to React README](./README.md)**
