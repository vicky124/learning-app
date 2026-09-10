export const javaSection = {
  id: 'java',
  label: 'Java',
  icon: '☕',
  groups: [
    {
      id: 'java-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-java',
          title: 'What Is Java, and What Does "Write Once, Run Anywhere" Actually Mean?',
          summary:
            'Java is a statically-typed, object-oriented language that compiles to portable bytecode run by the JVM — that one architectural choice (compile to an intermediate form, not native machine code) is what makes Java code portable across operating systems.',
          keyPoints: [
            'Java source (`.java`) is compiled by `javac` into **bytecode** (`.class` files) — a portable instruction set, not native machine code for any specific CPU.',
            'The **JVM (Java Virtual Machine)** is what actually executes bytecode on a given OS/CPU — a different JVM build exists per platform, but the bytecode itself never changes.',
            '"Write once, run anywhere" (WORA) means the same `.class` file runs unmodified on any machine with a compatible JVM — the JVM is the portability boundary, not the source code.',
            'The JVM further compiles hot bytecode paths to real native machine code at runtime via the **JIT (Just-In-Time) compiler** — so Java is not purely interpreted in practice, despite starting that way.',
            'JDK (Java Development Kit) = JRE + development tools (`javac`, debugger, etc.); JRE (Java Runtime Environment) = JVM + standard library, enough to run compiled Java but not compile it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Most languages either compile straight to native machine code (C, C++, Rust — fast, but a separate binary is needed per OS/CPU) or are interpreted line-by-line from source (classic Python, Ruby — portable, but slower). Java takes a third path: **compile once to a portable intermediate representation (bytecode), then let a platform-specific virtual machine execute that bytecode.** The source code compiles identically everywhere; only the JVM itself differs per platform, and JVMs exist for Windows, Linux, macOS, and beyond.',
            },
            {
              type: 'heading',
              text: 'From source to a running program',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Source[".java source file"] -->|"javac (compiler)"| Bytecode[".class file\\n(portable bytecode)"]\n  Bytecode -->|"loaded by"| ClassLoader["Class Loader"]\n  ClassLoader --> JVM["JVM Execution Engine"]\n  JVM -->|"interpreted at first"| Interp["bytecode interpreter"]\n  JVM -->|"hot paths recompiled"| JIT["JIT compiler\\n(native machine code)"]\n  Interp --> OS["runs on this OS/CPU"]\n  JIT --> OS',
            },
            {
              type: 'list',
              items: [
                '**Compile time**: `javac MyApp.java` produces `MyApp.class` — bytecode, not an executable for any real CPU.',
                '**Class loading**: the JVM loads `.class` files on demand (see the dedicated class-loading topic) and verifies the bytecode is well-formed and safe before running it.',
                '**Execution**: the JVM interprets bytecode instruction-by-instruction at first; frequently-executed ("hot") methods get compiled to real native machine code on the fly by the JIT compiler, so long-running Java programs end up running mostly-native code despite starting from portable bytecode.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'JDK vs JRE vs JVM: the **JVM** executes bytecode. The **JRE** is the JVM plus the standard library classes — enough to *run* compiled Java. The **JDK** is the JRE plus development tools (`javac`, `javadoc`, debugger, `jar`) — what you need to *write and compile* Java. Modern JDK distributions (since Java 11) no longer ship a separate JRE package; you install the JDK either way.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This same bytecode-then-JIT architecture is why the JVM is also a serious deployment target for other languages — Kotlin, Scala, and Clojure all compile to the same JVM bytecode and can call Java libraries directly, since the JVM doesn\'t care what source language produced the `.class` file.',
            },
          ],
        },
        {
          id: 'primitives-and-references',
          title: 'Primitive Types vs Reference Types, and Autoboxing',
          summary:
            'Java has exactly eight primitive types that are not objects and live directly on the stack (or inline in an object), plus reference types that are pointers to objects on the heap — a distinction that shapes performance, equality, and collection APIs throughout the language.',
          keyPoints: [
            'The eight primitives: `byte`, `short`, `int`, `long`, `float`, `double`, `char`, `boolean` — fixed-size, not objects, no methods, default to a zero-like value as fields.',
            'Everything else is a reference type: classes, interfaces, arrays, and the boxed wrapper classes (`Integer`, `Double`, `Boolean`, ...).',
            'Autoboxing/unboxing automatically converts between a primitive and its wrapper (`int` ↔ `Integer`) wherever the compiler needs the other form — most visibly, generics require an object type, so `List<int>` is illegal but `List<Integer>` works via autoboxing.',
            'Wrapper objects are compared with `==` by *reference*, not value — a classic pitfall when autoboxing hides the fact that you\'re now comparing objects, not primitives.',
            'Integer caching (`Integer.valueOf` caches -128 to 127) means small boxed integers happen to be `==`-equal by reference, while larger ones are not — a trap, not a guarantee to rely on.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Primitive', 'Wrapper class', 'Size', 'Default value'],
              rows: [
                ['`int`', '`Integer`', '32-bit', '`0`'],
                ['`long`', '`Long`', '64-bit', '`0L`'],
                ['`double`', '`Double`', '64-bit', '`0.0`'],
                ['`boolean`', '`Boolean`', '1 bit (JVM-dependent)', '`false`'],
                ['`char`', '`Character`', '16-bit (UTF-16 code unit)', '`\\u0000`'],
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'autoboxing in practice, and the == pitfall',
              code: `int a = 5;
Integer boxedA = a;           // autoboxing: int -> Integer
int backToPrimitive = boxedA; // auto-unboxing: Integer -> int

List<Integer> nums = new ArrayList<>();
nums.add(5);                  // autoboxes 5 to Integer.valueOf(5)

Integer x = 100;
Integer y = 100;
System.out.println(x == y);   // true  -- both fall in the cached -128..127 range

Integer p = 200;
Integer q = 200;
System.out.println(p == q);   // false -- outside the cache, two distinct Integer objects!
System.out.println(p.equals(q)); // true -- always compare wrapper VALUES with .equals()`,
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  Box["Integer x = 100;\\n(autoboxing)"] --> Check{"value between\\n-128 and 127?"}\n  Check -->|"yes"| Cached["Integer.valueOf() returns a\\nSHARED cached object"]\n  Check -->|"no"| NewObj["a brand-new Integer\\nobject is allocated"]\n  Cached --> SameRef["two cached Integers with the\\nsame value ARE == equal\\n(same object, by coincidence)"]\n  NewObj --> DiffRef["two new Integers with the\\nsame value are NOT == equal\\n(different objects)"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Always compare boxed wrapper types with `.equals()`, never `==` — `==` on reference types compares object identity, and the small-integer cache makes `==` appear to work correctly for small values while silently breaking for larger ones. This is one of the most common real-world Java bugs.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Unboxing a `null` wrapper throws `NullPointerException` at the point of unboxing — `Integer count = null; int x = count;` blows up. This is a common source of NPEs when a `Map<String, Integer>` lookup returns `null` for a missing key and the result is used directly in arithmetic.',
            },
          ],
        },
        {
          id: 'classes-objects-constructors',
          title: 'Classes, Objects & Constructors',
          summary:
            'A class is a blueprint; an object is an instance of that blueprint allocated on the heap — constructors are the special methods responsible for bringing a new object into a valid initial state.',
          keyPoints: [
            'A class defines fields (state) and methods (behavior); `new ClassName(...)` allocates an object on the heap and returns a reference to it.',
            'A constructor has the same name as the class, no return type, and runs exactly once, at object creation, to establish initial state.',
            'If no constructor is written, Java supplies a no-arg default constructor; writing any constructor removes that implicit default.',
            '`this(...)` calls another constructor in the same class (constructor chaining); `super(...)` calls the parent class\'s constructor and must be the first statement if used explicitly.',
            'Instance initializer blocks and field initializers run in the order they appear, before the constructor body — a detail that matters when initialization order is subtle.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'constructors, overloading, and chaining',
              code: `public class Rectangle {
    private final double width;
    private final double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    // overloaded constructor delegates to the main one via this(...)
    public Rectangle(double side) {
        this(side, side);   // a square is a rectangle with equal sides
    }

    public double area() {
        return width * height;
    }
}

Rectangle r1 = new Rectangle(3, 4);   // area 12
Rectangle square = new Rectangle(5);  // area 25, via chained constructor`,
            },
            {
              type: 'p',
              text: 'When a class extends another, the subclass constructor must ensure the superclass is initialized first — either implicitly (Java inserts a call to the parent\'s no-arg constructor automatically) or explicitly via `super(...)` as the very first statement. This guarantees an object is never observed in a state where its inherited fields haven\'t been set up yet.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  New["new Circle(\'red\', 2.0)"] --> SuperCall["1. super(color) runs FIRST\\nShape must be initialized before Circle"]\n  SuperCall --> ShapeFields["2. Shape\'s field initializers run"]\n  ShapeFields --> ShapeBody["3. Shape constructor body runs"]\n  ShapeBody --> CircleFields["4. Circle\'s field initializers run"]\n  CircleFields --> CircleBody["5. Circle constructor body runs\\nthis.radius = radius"]\n  CircleBody --> Ready["object is now fully\\nand safely constructed"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer constructing objects in a fully valid state and marking fields `final` wherever the value never needs to change after construction — this rules out an entire class of bugs where an object is used before it is fully initialized, and pairs naturally with immutability (see the Records topic for a modern, terser way to express this).',
            },
          ],
        },
        {
          id: 'oop-four-pillars',
          title: 'The Four Pillars of OOP, in Java',
          summary:
            'Encapsulation, inheritance, polymorphism, and abstraction are the four ideas Java\'s class system is built around — each has a specific, concrete Java syntax expressing it, not just an abstract concept.',
          keyPoints: [
            '**Encapsulation**: bundling state and behavior together and controlling access via `private` fields + `public` getters/methods, so internal representation can change without breaking callers.',
            '**Inheritance**: `extends` lets a subclass reuse and specialize a superclass\'s fields/methods — Java supports single inheritance of classes (one direct superclass) but multiple inheritance of interfaces.',
            '**Polymorphism**: a superclass-typed reference can hold any subclass instance, and calling an overridden method invokes the subclass\'s version at runtime (dynamic dispatch) — the mechanism behind most extensible Java designs.',
            '**Abstraction**: exposing only the essential interface while hiding implementation details, via `abstract` classes and `interface`s — callers depend on *what* an object can do, not *how*.',
            'Access modifiers (`private`, package-private/default, `protected`, `public`) are the concrete tool encapsulation is built from — each widens visibility by one more scope.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'all four pillars in one small example',
              code: `abstract class Shape {                 // abstraction: defines WHAT a shape can do
    protected String color;             // encapsulation: state hidden behind protected access

    public Shape(String color) {
        this.color = color;
    }

    public abstract double area();      // subclasses supply HOW

    public String describe() {
        return color + " shape with area " + area();
    }
}

class Circle extends Shape {            // inheritance: reuses Shape's fields/methods
    private final double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {              // polymorphism: this version runs, not Shape's
        return Math.PI * radius * radius;
    }
}

Shape s = new Circle("red", 2.0);       // Shape reference, Circle object
System.out.println(s.describe());       // dynamic dispatch calls Circle.area()`,
            },
            {
              type: 'heading',
              text: 'The inheritance relationship',
            },
            {
              type: 'mermaid',
              code: 'classDiagram\n  class Shape {\n    <<abstract>>\n    #String color\n    +area() double\n    +describe() String\n  }\n  class Circle {\n    -double radius\n    +area() double\n  }\n  class Square {\n    -double side\n    +area() double\n  }\n  Shape <|-- Circle\n  Shape <|-- Square',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Java deliberately disallows multiple inheritance of *classes* (no `class C extends A, B`) to avoid the "diamond problem" — ambiguity when two parent classes define conflicting state or method implementations. Interfaces sidestep this because, until default methods, they carried no state and no implementation to conflict.',
            },
          ],
        },
        {
          id: 'interfaces-vs-abstract-classes',
          title: 'Interfaces vs Abstract Classes',
          summary:
            'Both let you define a contract implemented differently by different classes, but they answer different questions — "what can this do" (interface) vs "what is this, partially implemented" (abstract class) — and default methods (Java 8+) narrowed the practical gap between them considerably.',
          keyPoints: [
            'An abstract class can hold state (instance fields), constructors, and a mix of implemented and unimplemented methods; a class can extend only one abstract class.',
            'An interface traditionally held only method signatures (plus `public static final` constants); a class can implement any number of interfaces — Java\'s answer to needing "multiple inheritance of type".',
            'Since Java 8, interfaces can have `default` methods (a body, inherited unless overridden) and `static` methods — closing much of the historical gap with abstract classes.',
            'Since Java 9, interfaces can also have `private` methods, for sharing code between default methods without exposing it publicly.',
            'Rule of thumb: use an interface to define a capability/role (`Comparable`, `Runnable`) that unrelated classes can share; use an abstract class when subclasses share actual state or a common partial implementation, and are genuinely related by an "is-a" hierarchy.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Abstract class', 'Interface'],
              rows: [
                ['Instance fields (state)', 'Yes', 'No (only constants)'],
                ['Constructors', 'Yes', 'No'],
                ['Multiple inheritance', 'No — single `extends`', 'Yes — multiple `implements`'],
                ['Method bodies', 'Any method can have one', 'Only `default`/`static`/`private` methods'],
                ['Access modifiers on members', 'Any (`private`, `protected`, ...)', 'Implicitly `public` (abstract methods)'],
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'default methods narrowing the gap',
              code: `interface Greeter {
    String name();                                  // abstract — must be implemented

    default String greet() {                        // default — has a body, inherited as-is
        return "Hello, " + name() + "!";
    }

    static Greeter of(String n) {                    // static — a factory, called on the interface itself
        return () -> n;
    }
}

Greeter g = Greeter.of("Ada");
System.out.println(g.greet());                        // Hello, Ada! -- uses the default method`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'If a class implements two interfaces that both define the *same* default method signature, the class is forced to override it explicitly (calling `Interface.super.method()` if it wants one of the originals) — the compiler refuses to silently pick one, which is exactly the diamond-problem ambiguity that abstract-class multiple inheritance would otherwise cause.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  A["interface A { default String hi() ... }"] --> C["class C implements A, B"]\n  B["interface B { default String hi() ... }"] --> C\n  C --> Conflict{"both A and B supply\\na default hi() -- ambiguous!"}\n  Conflict --> ErrorState["compiler ERROR:\\nC must override hi() itself"]\n  ErrorState --> FixState["fix: @Override String hi()\\ncall A.super.hi() or B.super.hi()\\nto pick one explicitly"]',
            },
          ],
        },
        {
          id: 'equals-hashcode-tostring',
          title: 'The `equals()`, `hashCode()`, and `toString()` Contracts',
          summary:
            'Every Java object inherits these three methods from `Object` with default implementations that are rarely what you want — overriding one without the other correctly is one of the most commonly-tested Java pitfalls.',
          keyPoints: [
            'Default `Object.equals()` is reference equality (`==`); default `Object.hashCode()` is derived from the object\'s identity; default `toString()` prints `ClassName@hexHashCode`.',
            'The hashCode contract: if `a.equals(b)` is `true`, then `a.hashCode() == b.hashCode()` **must** hold — hash-based collections (`HashMap`, `HashSet`) silently break if this is violated.',
            'The reverse is not required: equal hash codes do not imply equal objects (hash collisions are expected and handled) — only equal objects must produce equal hashes.',
            'Overriding `equals()` without `hashCode()` is a classic bug: two "equal" objects can end up in different hash buckets, so `set.contains(equalButDifferentInstance)` silently returns `false`.',
            '`toString()` is for developer-facing debugging/logging output, not for user-facing display or serialization — override it on most domain classes so logs are actually readable.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a correctly-implemented equals/hashCode pair',
              code: `public class Point {
    private final int x, y;

    public Point(int x, int y) { this.x = x; this.y = y; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Point)) return false;
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y);   // combines field hashes consistently with equals()
    }

    @Override
    public String toString() {
        return "Point(" + x + ", " + y + ")";
    }
}

Set<Point> visited = new HashSet<>();
visited.add(new Point(1, 2));
visited.contains(new Point(1, 2));   // true -- ONLY because hashCode is also overridden correctly`,
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  A["override equals() only"] --> B{"put object in\\nHashMap / HashSet?"}\n  B -- yes --> C["hashCode() still uses\\nObject identity (default)"]\n  C --> D["equal objects land in\\nDIFFERENT hash buckets"]\n  D --> E["contains() / get() with an\\nequal-but-different instance\\nreturns false / null -- BUG"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Modern IDEs and `record` types (see the Records topic) generate a correct `equals`/`hashCode`/`toString` triple automatically — for a hand-written mutable class, always generate or override all three together, never just one, and never base `hashCode()` on mutable fields that change after the object is placed in a hash-based collection.',
            },
          ],
        },
        {
          id: 'generics-and-type-erasure',
          title: 'Generics & Type Erasure',
          summary:
            'Generics give compile-time type safety for containers and algorithms without casting, but Java implements them via type erasure — the generic type information does not exist at runtime, which explains several counter-intuitive generics limitations.',
          keyPoints: [
            'A generic class/method (`class Box<T>`, `<T> T firstOf(List<T> list)`) lets the compiler catch type mismatches at compile time instead of at runtime via `ClassCastException`.',
            'Type erasure means `List<String>` and `List<Integer>` are the *same* class at runtime (`List`) — the type parameter is erased to its bound (`Object` if unbounded) after compilation.',
            'Consequences of erasure: you cannot do `new T()`, `new T[]`, `instanceof T`, or overload two methods that differ only by generic type parameter — the runtime cannot distinguish them.',
            'Bounded type parameters (`<T extends Comparable<T>>`) restrict what a generic type can be, letting you call methods on it that a plain `T extends Object` wouldn\'t allow.',
            'Wildcards (`? extends T` for read-only producers, `? super T` for write-only consumers) express variance — summarized by the mnemonic **PECS: Producer Extends, Consumer Super**.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a generic class and a bounded generic method',
              code: `class Box<T> {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

Box<String> box = new Box<>();
box.set("hello");
String s = box.get();          // no cast needed -- compiler already knows it's a String

// bounded type parameter: T must be Comparable to itself
static <T extends Comparable<T>> T max(List<T> list) {
    T best = list.get(0);
    for (T item : list) {
        if (item.compareTo(best) > 0) best = item;
    }
    return best;
}

// PECS: producer extends, consumer super
static void copy(List<? extends Number> source, List<? super Number> dest) {
    for (Number n : source) {   // source only ever PRODUCES values -- extends
        dest.add(n);             // dest only ever CONSUMES values -- super
    }
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Compile["compile time:\\nList<String>, List<Integer>\\nfully type-checked"] -->|"type erasure"| Runtime["runtime (.class bytecode):\\nboth are just List\\n(raw type, T erased to Object)"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Because of erasure, `list instanceof List<String>` will not compile — the JVM has no way to check the erased type parameter at runtime. Only the raw type check `list instanceof List<?>` (or plain `List`) is legal.',
            },
          ],
        },
        {
          id: 'exception-handling',
          title: 'Exception Handling: Checked vs Unchecked',
          summary:
            'Java is one of the few mainstream languages with checked exceptions, forcing callers to handle or explicitly declare certain failure modes at compile time — a distinctly Java design choice that remains genuinely debated among practitioners.',
          keyPoints: [
            'All exceptions extend `Throwable`, which splits into `Error` (serious JVM-level problems, not meant to be caught — `OutOfMemoryError`) and `Exception`.',
            '**Checked exceptions** (`Exception` but not `RuntimeException`, e.g. `IOException`) must be either caught or declared with `throws` — the compiler enforces this.',
            '**Unchecked exceptions** (`RuntimeException` and its subclasses, e.g. `NullPointerException`, `IllegalArgumentException`) require no such declaration — they usually represent programming errors rather than recoverable external conditions.',
            'try-with-resources (`try (AutoCloseable r = ...)`) guarantees `close()` is called even on exception, replacing manual `finally`-block cleanup for anything implementing `AutoCloseable`.',
            'Wrapping a low-level exception in a more meaningful one (`throw new ServiceException("...", e)`) preserves the original as the *cause*, keeping the full stack trace available for debugging.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TD\n  T["Throwable"] --> Err["Error\\n(OutOfMemoryError, StackOverflowError)\\nnot meant to be caught"]\n  T --> Exc["Exception"]\n  Exc --> RTE["RuntimeException (UNCHECKED)\\nNullPointerException\\nIllegalArgumentException\\nIndexOutOfBoundsException"]\n  Exc --> Checked["checked exceptions\\nIOException\\nSQLException\\n(must catch or declare throws)"]',
            },
            {
              type: 'code',
              language: 'java',
              title: 'checked vs unchecked, and try-with-resources',
              code: `// checked: caller MUST catch this or declare "throws IOException"
public String readFirstLine(String path) throws IOException {
    try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
        return reader.readLine();
    }   // reader.close() is guaranteed here, even if readLine() throws
}

// unchecked: no declaration required -- represents a programmer error, not a
// recoverable external condition the caller is forced to think about
public int divide(int a, int b) {
    if (b == 0) {
        throw new IllegalArgumentException("divisor cannot be zero");
    }
    return a / b;
}

// wrapping preserves the original cause and stack trace
try {
    readFirstLine("config.txt");
} catch (IOException e) {
    throw new ConfigLoadException("Failed to load config", e);   // e is the "cause"
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The checked-exceptions design was meant to force callers to handle recoverable failures explicitly. In practice it is controversial: it scales poorly with functional-style code (lambdas can\'t easily throw checked exceptions) and tends to get "solved" by swallowing or blindly wrapping exceptions. Many modern Java libraries (Spring, most reactive libraries) deliberately favor unchecked exceptions even for genuinely recoverable conditions.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never catch an exception and silently discard it (`catch (Exception e) {}`) — it hides real failures and makes debugging production issues far harder. At minimum, log it; ideally, only catch what you can meaningfully handle at that point in the code.',
            },
          ],
        },
        {
          id: 'collections-framework',
          title: 'The Collections Framework',
          summary:
            'A small set of interfaces (List, Set, Map, Queue) and their standard implementations cover nearly every data-structure need in Java — picking the right implementation is mostly about the Big-O of the operations you\'ll actually perform.',
          keyPoints: [
            '`List` — ordered, duplicates allowed, indexed access; `ArrayList` (array-backed, fast random access) vs `LinkedList` (node-based, fast insert/remove at known position, slow random access).',
            '`Set` — no duplicates; `HashSet` (hash table, O(1) average, no order), `LinkedHashSet` (insertion order preserved), `TreeSet` (sorted, O(log n), backed by a red-black tree).',
            '`Map` — key→value; `HashMap` (O(1) average, no order), `LinkedHashMap` (insertion/access order), `TreeMap` (sorted by key, O(log n)).',
            '`Queue`/`Deque` — `ArrayDeque` (array-backed double-ended queue, generally preferred over the legacy `Stack`/`LinkedList` for stack/queue use), `PriorityQueue` (heap-backed, O(log n) insert/remove-min).',
            'All the "unsorted, unordered" hash-based structures require correct `equals()`/`hashCode()` on stored elements/keys (see that dedicated topic) to behave correctly.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Implementation', 'Get/contains', 'Insert/remove', 'Ordering'],
              rows: [
                ['`ArrayList`', 'O(1) by index', 'O(n) (shift elements), O(1) amortized at end', 'insertion order'],
                ['`LinkedList`', 'O(n)', 'O(1) at known node, O(n) to find it', 'insertion order'],
                ['`HashMap` / `HashSet`', 'O(1) average', 'O(1) average', 'none (unspecified)'],
                ['`LinkedHashMap` / `LinkedHashSet`', 'O(1) average', 'O(1) average', 'insertion order'],
                ['`TreeMap` / `TreeSet`', 'O(log n)', 'O(log n)', 'sorted by key/natural order or Comparator'],
                ['`ArrayDeque`', 'O(1) at both ends', 'O(1) at both ends', 'insertion order'],
                ['`PriorityQueue`', 'O(1) peek min', 'O(log n)', 'heap order (min at head)'],
              ],
            },
            {
              type: 'mermaid',
              code: 'classDiagram\n  class Collection {<<interface>>}\n  class List {<<interface>>}\n  class Set {<<interface>>}\n  class Queue {<<interface>>}\n  class Map {<<interface>>}\n  Collection <|-- List\n  Collection <|-- Set\n  Collection <|-- Queue\n  List <|.. ArrayList\n  List <|.. LinkedList\n  Set <|.. HashSet\n  Set <|.. TreeSet\n  Queue <|.. ArrayDeque\n  Queue <|.. PriorityQueue\n  Map <|.. HashMap\n  Map <|.. TreeMap',
            },
            {
              type: 'code',
              language: 'java',
              title: 'choosing an implementation by access pattern',
              code: `List<String> names = new ArrayList<>();       // frequent random access/iteration
Deque<Integer> stack = new ArrayDeque<>();     // stack via push()/pop(), no legacy Stack
Map<String, User> byId = new HashMap<>();      // O(1) average lookup by key
Set<String> seen = new LinkedHashSet<>();      // uniqueness + predictable iteration order
Queue<Task> byPriority = new PriorityQueue<>(Comparator.comparingInt(Task::priority));`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`Map` deliberately does not extend `Collection` in the type hierarchy (it maps pairs, not single elements) — a frequent quiz question. Its `keySet()`, `values()`, and `entrySet()` views each return a genuine `Collection`/`Set` over the map\'s current contents.',
            },
          ],
        },
        {
          id: 'lambdas-and-functional-interfaces',
          title: 'Lambdas & Functional Interfaces',
          summary:
            'A lambda is a concise, inline implementation of a "functional interface" (one with exactly one abstract method) — Java\'s way of treating behavior as a passable value without the ceremony of a full anonymous class.',
          keyPoints: [
            'A **functional interface** has exactly one abstract method (default/static methods don\'t count) — `Runnable`, `Comparator<T>`, and the `java.util.function` package (`Function`, `Predicate`, `Supplier`, `Consumer`) are the standard ones.',
            'A lambda `(args) -> expression` (or `{ block }`) is compiled to an instance implementing that single method — syntactic sugar over what used to require an anonymous inner class.',
            'A lambda captures variables from its enclosing scope by value, and those captured variables must be effectively final (never reassigned after being captured).',
            'Method references (`ClassName::methodName`, `instance::methodName`) are an even terser form of a lambda that just forwards to an existing method.',
            '`@FunctionalInterface` is an optional but recommended annotation that makes the compiler enforce "exactly one abstract method," catching accidental interface changes that would break lambda compatibility.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'lambdas replacing anonymous classes',
              code: `// the old way: an anonymous class implementing Comparator
Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.length() - b.length();
    }
});

// the same thing, as a lambda
Collections.sort(names, (a, b) -> a.length() - b.length());

// even terser with a method reference
names.sort(Comparator.comparingInt(String::length));

// standard functional interfaces from java.util.function
Function<Integer, Integer> square = x -> x * x;
Predicate<String> isBlank = String::isBlank;
Supplier<List<String>> newList = ArrayList::new;
Consumer<String> printer = System.out::println;`,
            },
            {
              type: 'code',
              language: 'java',
              title: 'variable capture must be effectively final',
              code: `int threshold = 10;
Predicate<Integer> aboveThreshold = n -> n > threshold;   // OK: threshold never reassigned

int counter = 0;
// counter++;   // if this line existed, the lambda below would fail to compile:
Runnable r = () -> System.out.println(counter);  // captured value must be effectively final`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Lambdas capture by **value**, not by reference — a lambda sees a snapshot of the captured variable at the time it was created, which is exactly why Java requires captured local variables to be effectively final (there is no way to observe a "later" mutation, so the language forbids the ambiguity entirely).',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Enclosing["enclosing scope:\\nint threshold = 10;"] -.->|"captured BY VALUE\\nat creation time"| Lambda["lambda: n -> n > threshold"]\n  Lambda -->|"compiled to implement"| FI["functional interface\\nPredicate&lt;Integer&gt;"]\n  FI --> Method["its one abstract method:\\nboolean test(Integer n)"]',
            },
          ],
        },
        {
          id: 'streams-api',
          title: 'The Streams API',
          summary:
            'A Stream is a lazy, declarative pipeline over a source of data — intermediate operations (map, filter) build up a plan without doing any work, and nothing actually runs until a terminal operation triggers a single pass through the data.',
          keyPoints: [
            'A stream is created from a source (`collection.stream()`, `Stream.of(...)`, `IntStream.range(...)`) and is consumed exactly once — it cannot be reused after a terminal operation.',
            '**Intermediate operations** (`map`, `filter`, `sorted`, `distinct`, `limit`) are lazy — they just describe a transformation and return a new stream, doing no actual work yet.',
            '**Terminal operations** (`collect`, `forEach`, `reduce`, `count`, `anyMatch`) trigger the entire pipeline to actually run, pulling elements through all the intermediate steps in one pass.',
            'Laziness means short-circuiting operations (`findFirst`, `anyMatch`, `limit`) can stop processing early — a stream over an infinite source with `limit(5)` still terminates.',
            '`Collectors` (`toList()`, `groupingBy()`, `joining()`, `summarizingInt()`) are the standard way to turn a stream back into a concrete collection or summary value at the end of a pipeline.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Source["source: List<Order>"] -->|".stream()"| S0["Stream"]\n  S0 -->|".filter(o -> o.isPaid())\\n(intermediate, LAZY)"| S1["Stream"]\n  S1 -->|".map(Order::total)\\n(intermediate, LAZY)"| S2["Stream"]\n  S2 -->|".collect(toList())\\n(TERMINAL -- triggers execution)"| Result["List<Double>"]',
            },
            {
              type: 'code',
              language: 'java',
              title: 'a realistic pipeline',
              code: `List<Order> orders = fetchOrders();

double totalPaid = orders.stream()
    .filter(Order::isPaid)                 // intermediate: lazy filter
    .map(Order::total)                     // intermediate: lazy transform
    .mapToDouble(Double::doubleValue)
    .sum();                                // terminal: runs the whole pipeline, once

Map<String, List<Order>> byCustomer = orders.stream()
    .collect(Collectors.groupingBy(Order::customerId));   // terminal: collects into a Map

List<String> names = orders.stream()
    .map(Order::customerName)
    .distinct()
    .sorted()
    .limit(10)
    .collect(Collectors.toList());

boolean anyOverdue = orders.stream()
    .anyMatch(Order::isOverdue);           // terminal, short-circuits on first match`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A stream can only be consumed once — calling a second terminal operation on a stream that already ran one throws `IllegalStateException: stream has already been operated upon or closed`. If you need to run the pipeline twice, re-create the stream from the source both times.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer streams for genuinely declarative transformations (filter/map/collect); prefer a plain loop when the logic involves complex branching, early-exit with multiple conditions, or mutating external state — forcing everything into a stream pipeline for its own sake often reads worse than a straightforward loop.',
            },
          ],
        },
        {
          id: 'optional-and-null-safety',
          title: '`Optional` & Null-Safety Patterns',
          summary:
            '`Optional<T>` is a container that explicitly represents "a value, or the deliberate absence of one" in a method\'s return type — making the possibility of absence visible in the type signature instead of an undocumented `null` a caller might forget to check.',
          keyPoints: [
            '`Optional.of(value)` wraps a non-null value (throws if `null` is passed); `Optional.empty()` represents absence; `Optional.ofNullable(x)` handles either case.',
            '`.map()`, `.filter()`, and `.flatMap()` on `Optional` chain transformations that only apply if a value is present — mirroring the Streams API\'s lazy-pipeline style.',
            '`.orElse(default)`, `.orElseGet(supplier)`, and `.orElseThrow()` are the standard ways to unwrap an `Optional` at the end of a chain, each with a different fallback strategy.',
            '`Optional` is intended for **method return types**, specifically to signal "this might not have a value" — it is explicitly discouraged as a field type, a method parameter type, or inside collections, where it adds overhead without clear benefit.',
            'Calling `.get()` on an empty `Optional` throws `NoSuchElementException` — `Optional` does not eliminate the possibility of a runtime failure, it just forces the *possibility* of absence to be visible and (with the fluent API) easy to handle correctly.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'Optional as a return type, and chaining',
              code: `public Optional<User> findById(String id) {
    User u = database.lookup(id);
    return Optional.ofNullable(u);          // explicitly signals "might not exist"
}

// the caller is nudged toward handling absence, rather than risking an NPE
String displayName = findById("u42")
    .map(User::name)
    .map(String::toUpperCase)
    .orElse("UNKNOWN USER");

User user = findById("u42")
    .orElseThrow(() -> new UserNotFoundException("u42"));

findById("u42").ifPresentOrElse(
    u -> System.out.println("found: " + u.name()),
    () -> System.out.println("not found")
);`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Find["findById(\'u42\')"] --> Opt{"Optional&lt;User&gt;"}\n  Opt -->|"present"| Map1[".map(User::name)"]\n  Map1 --> Map2[".map(String::toUpperCase)"]\n  Map2 --> Merge(("join"))\n  Opt -->|"empty -- skips\\nthe map steps entirely"| Merge\n  Merge --> OrElse[".orElse(\'UNKNOWN USER\')"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Calling `.get()` unconditionally defeats the entire purpose of `Optional` — it just moves the NPE-equivalent crash (`NoSuchElementException`) to a different method name. Prefer `.orElse()`, `.orElseThrow()` with a meaningful exception, or `.ifPresent()`/`.ifPresentOrElse()`.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Do not use `Optional` as a field type or constructor/method parameter type — it was designed and optimized specifically for return values, is not `Serializable`, and adds an unnecessary wrapper allocation in places a plain nullable reference (with clear documentation, or `@Nullable`) already communicates the same thing.',
            },
          ],
        },
        {
          id: 'records-and-sealed-classes',
          title: 'Records & Sealed Classes — Modern Data Modeling',
          summary:
            'Records (Java 14+/16 standard) eliminate the boilerplate of an immutable data-holding class, and sealed classes/interfaces (Java 17 standard) let you declare a closed, exhaustively-checkable set of permitted subtypes — together they make Java\'s data modeling look far more like a modern algebraic-data-type language.',
          keyPoints: [
            '`record Point(int x, int y) {}` auto-generates a canonical constructor, private final fields, accessor methods (`x()`, `y()`, not `getX()`), plus correct `equals()`, `hashCode()`, and `toString()`.',
            'Records are implicitly `final` and immutable — there is no way to reassign a record component after construction, matching the immutable-by-default style records are meant to encourage.',
            'A compact canonical constructor (`public Point { if (x < 0) throw ...; }`, no parameter list repeated) lets you validate/normalize fields without restating all the boilerplate assignment.',
            '`sealed class Shape permits Circle, Square {}` restricts which classes may extend/implement it — every permitted subtype must be `final`, `sealed`, or `non-sealed`.',
            'Combined with a `switch` expression on a sealed type, the compiler can verify exhaustiveness (every permitted subtype handled) without needing a `default` branch — the closest Java gets to algebraic data types with pattern matching.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a record with validation, vs the equivalent hand-written class',
              code: `// before records: ~30 lines of constructor, getters, equals, hashCode, toString
public record Point(int x, int y) {
    public Point {                          // compact canonical constructor
        if (x < 0 || y < 0) {
            throw new IllegalArgumentException("coordinates must be non-negative");
        }
    }

    public double distanceFromOrigin() {    // records can still have regular methods
        return Math.sqrt(x * x + y * y);
    }
}

Point p = new Point(3, 4);
p.x();                 // 3 -- accessor, not getX()
p.toString();           // "Point[x=3, y=4]" -- auto-generated
p.equals(new Point(3, 4));  // true -- auto-generated, compares components`,
            },
            {
              type: 'code',
              language: 'java',
              title: 'sealed interfaces with exhaustive pattern matching',
              code: `sealed interface Shape permits Circle, Square, Triangle {}

record Circle(double radius) implements Shape {}
record Square(double side) implements Shape {}
record Triangle(double base, double height) implements Shape {}

static double area(Shape shape) {
    return switch (shape) {                        // exhaustive -- no default needed
        case Circle c -> Math.PI * c.radius() * c.radius();
        case Square s -> s.side() * s.side();
        case Triangle t -> 0.5 * t.base() * t.height();
        // compiler ERROR if a permitted subtype is left unhandled
    };
}`,
            },
            {
              type: 'mermaid',
              code: 'classDiagram\n  class Shape {\n    <<sealed interface>>\n  }\n  class Circle {\n    <<record>>\n    double radius\n  }\n  class Square {\n    <<record>>\n    double side\n  }\n  class Triangle {\n    <<record>>\n    double base\n    double height\n  }\n  Shape <|.. Circle\n  Shape <|.. Square\n  Shape <|.. Triangle\n  note for Shape "permits ONLY these three -- no other class may implement Shape"',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Reach for a record whenever a class\'s entire purpose is to hold a fixed set of immutable values (a DTO, a value object, a tuple-like return type) — reach for sealed classes/interfaces whenever you have a genuinely fixed, closed set of variants and want the compiler to catch a missed case at compile time instead of at runtime.',
            },
          ],
        },
        {
          id: 'strings-and-immutability',
          title: 'Strings: Immutability, the String Pool & `StringBuilder`',
          summary:
            'A `String` in Java is immutable by design — every "modifying" operation returns a new `String` — which enables safe sharing via the string constant pool but makes naive repeated concatenation a real performance trap.',
          keyPoints: [
            'Every `String` method that looks like it modifies the string (`.concat()`, `.replace()`, `.toUpperCase()`, `.substring()`) actually returns a brand-new `String` object, leaving the original untouched.',
            'String literals are interned in the **string constant pool** — identical literals reuse the same object, so `"abc" == "abc"` is `true`, but `new String("abc") == "abc"` is `false` (a new heap object, not pooled unless `.intern()` is called).',
            'Immutability is what makes `String` safe as a `HashMap` key and safe to share across threads with no synchronization — its hash code is even cached after first computation, since it can never change.',
            'Repeated `+=` concatenation in a loop is O(n²) — each `+` allocates and copies a new string; `StringBuilder` mutates an internal buffer in place, giving O(n) for building a string incrementally.',
            'Java\'s `+` operator on strings inside a single expression is compiled to use `StringBuilder` automatically — the O(n²) trap is specifically about concatenation *across loop iterations*, not a single expression.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'immutability, pooling, and the StringBuilder fix',
              code: `String a = "hello";
String b = a.concat(" world");   // a brand-new String; "a" itself is untouched
System.out.println(a);            // still "hello"

String s1 = "abc";
String s2 = "abc";
System.out.println(s1 == s2);              // true -- same pooled literal object

String s3 = new String("abc");
System.out.println(s1 == s3);              // false -- s3 is a distinct heap object
System.out.println(s1.equals(s3));         // true -- always use .equals() for VALUE comparison

// O(n^2): a new String allocated and copied on every iteration
String result = "";
for (String word : words) {
    result += word;
}

// O(n): StringBuilder mutates one internal buffer
StringBuilder sb = new StringBuilder();
for (String word : words) {
    sb.append(word);
}
String result2 = sb.toString();`,
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  S1["String s1 = \'abc\'"] --> Pool[("String Constant Pool")]\n  S2["String s2 = \'abc\'"] --> Pool\n  S3["String s3 = new String(\'abc\')"] --> Heap[("regular Heap\\n(separate object)")]\n  Pool -.->|"s1 == s2 -> true\\nsame pooled object"| EqTrue["=="]\n  Heap -.->|"s1 == s3 -> false\\ndifferent objects,\\nsame content"| EqFalse["=="]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Always compare `String`s with `.equals()`, never `==` — literal interning makes `==` appear to "work" for string literals specifically, and that habit then silently breaks for any string built at runtime (from user input, concatenation, `new String(...)`, etc.).',
            },
          ],
        },
        {
          id: 'jvm-memory-model',
          title: 'JVM Memory: Heap, Stack & Metaspace',
          summary:
            'The JVM divides memory into distinct regions with very different lifetimes and access patterns — knowing which region a given piece of data lives in explains most memory-related bugs and performance questions.',
          keyPoints: [
            'The **heap** holds every object (anything created with `new`) — shared across all threads, and the region the garbage collector manages.',
            'Each thread has its own **stack**, a LIFO structure of stack frames — one frame per active method call, holding local variables, primitive values, and object *references* (not the objects themselves).',
            'The **metaspace** (replacing PermGen since Java 8) holds class metadata — loaded class definitions, method bytecode, the constant pool — and grows dynamically from native memory rather than a fixed heap region.',
            'A `StackOverflowError` happens when a thread\'s call stack exceeds its bounded size (commonly from unbounded/runaway recursion); an `OutOfMemoryError: Java heap space` happens when the heap is exhausted and the GC cannot reclaim enough.',
            'Local primitives and object references live on the stack; the actual objects they reference always live on the heap — this is why a method\'s local `int` disappears when it returns, but an object it created can outlive the method if something else still references it.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph JVM["JVM Memory"]\n    subgraph Heap["Heap (shared across threads)"]\n      Young["Young Generation\\n(Eden + Survivor spaces)\\nnew, short-lived objects"]\n      Old["Old Generation\\n(Tenured)\\nlong-lived, survived GCs"]\n    end\n    subgraph Stacks["Per-thread Stacks"]\n      S1["Thread 1 stack\\nframe: main()\\nframe: process()\\n locals + refs"]\n      S2["Thread 2 stack\\n(independent frames)"]\n    end\n    Meta["Metaspace (native memory)\\nclass metadata, method bytecode"]\n  end\n  S1 -.->|"object references point into"| Heap\n  S2 -.->|"object references point into"| Heap',
            },
            {
              type: 'code',
              language: 'java',
              title: 'what lives where',
              code: `void process() {
    int count = 0;                 // primitive: lives on THIS thread's stack frame
    User user = new User("Ada");   // reference "user" on the stack; the User OBJECT on the heap
    helper(user);                  // a new stack frame is pushed for helper()
}   // frame popped here -- "count" and the "user" REFERENCE disappear;
    // the User OBJECT itself stays on the heap if anything else still references it`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'PermGen (pre-Java 8) had a fixed maximum size and was a notorious source of `OutOfMemoryError: PermGen space`, especially in application servers that reloaded classes repeatedly. Metaspace uses native (off-heap) memory and grows dynamically by default, which mostly eliminated that specific failure mode — though it can still be bounded with `-XX:MaxMetaspaceSize` if unbounded class loading is itself a symptom of a leak.',
            },
          ],
        },
        {
          id: 'garbage-collection',
          title: 'Garbage Collection: Generational GC & Collectors',
          summary:
            'The JVM automatically reclaims heap memory for objects nothing references anymore, based on the empirically-observed "generational hypothesis" — most objects die young — which shapes how the heap is organized and collected.',
          keyPoints: [
            'GC reclaims objects that are **unreachable** — no live reference chain from a GC root (stack variables, static fields, active threads) reaches them — not objects that are merely unused for a while.',
            'The **generational hypothesis**: most objects become garbage very quickly (a request-scoped object, a loop-local temporary); few survive long. The heap is split into a Young Generation (collected often, cheaply) and an Old Generation (collected rarely, more expensively).',
            'A **minor GC** collects the Young Generation only (fast, frequent); a **major/full GC** collects the Old Generation (or the whole heap) and is far more expensive — the source of most GC-pause complaints.',
            '**G1 (Garbage First)** is the modern default collector — divides the heap into regions and prioritizes collecting the ones with the most garbage first, aiming for predictable, bounded pause times.',
            '**ZGC** and **Shenandoah** are low-latency collectors designed for sub-millisecond pause times even on very large (multi-GB to TB-scale) heaps, trading some throughput for that latency guarantee — relevant when GC pauses themselves (not overall throughput) are the problem being solved.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  New["new Object()"] --> Eden["Eden space\\n(Young Gen)"]\n  Eden -->|"survives a minor GC"| Survivor["Survivor space"]\n  Survivor -->|"survives several\\nminor GCs"| Old["Old Generation\\n(Tenured)"]\n  Eden -->|"most objects die here\\n(unreachable, reclaimed)"| Reclaimed1["reclaimed"]\n  Survivor -->|"dies before promotion"| Reclaimed2["reclaimed"]\n  Old -->|"major/full GC\\n(rare, expensive)"| Reclaimed3["reclaimed"]',
            },
            {
              type: 'table',
              headers: ['Collector', 'Best for', 'Trade-off'],
              rows: [
                ['Serial GC', 'Small heaps, single-core/CLI tools', 'Stop-the-world, single-threaded — simplest, least overhead for tiny workloads'],
                ['Parallel GC', 'Throughput-focused batch workloads', 'Stop-the-world but multi-threaded — maximizes throughput, pauses can be longer'],
                ['G1 (default since Java 9)', 'General-purpose server apps', 'Region-based, aims for predictable pause targets, good balance of throughput/latency'],
                ['ZGC / Shenandoah', 'Very large heaps, latency-sensitive services', 'Sub-millisecond pauses even at huge heap sizes, at some throughput cost'],
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'GC only reclaims UNREACHABLE objects -- a "live" reference is still a leak',
              code: `// MISTAKE: a static cache that never removes entries keeps every value
// reachable forever. The GC is working correctly -- these objects are
// NOT unreachable, even though the application is logically "done" with
// them. This is the classic Java "memory leak" (a reachability leak,
// not a C-style leak): no one forgot to free anything, a live reference
// simply still points at data nobody needs anymore.
public class SessionCache {
    private static final Map<String, Session> cache = new HashMap<>();

    public static void store(String id, Session session) {
        cache.put(id, session);   // entries are NEVER removed
    }
}

// FIX 1: remove entries once you know you're done with them
public static void invalidate(String id) {
    cache.remove(id);
}

// FIX 2: let entries become collectible automatically once nothing else
// in the application still references the key -- WeakHashMap holds its
// keys with weak references, so the GC is free to reclaim an entry the
// moment the key becomes otherwise unreachable
private static final Map<String, Session> cache = new WeakHashMap<>();`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A GC pause "matters" specifically when it is visible to a user or violates an SLA — a batch job that runs for hours generally cares about total throughput, not a 50ms pause; a low-latency trading system or an interactive API with a strict p99 latency target cares a great deal, which is exactly the case ZGC/Shenandoah are built for.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'GC only reclaims **unreachable** objects — it does not detect or fix logical memory leaks where a live reference (e.g., an ever-growing static `List`, or listeners never unregistered) keeps objects reachable forever. That kind of leak is a design bug GC cannot help with; heap-dump analysis (not GC tuning) is the right diagnostic tool.',
            },
          ],
        },
        {
          id: 'class-loading',
          title: 'Class Loading: The Classloader Hierarchy',
          summary:
            'Classes are loaded lazily, on first use, by a hierarchy of classloaders that delegate upward before trying to load anything themselves — a design that keeps core Java classes tamper-resistant and enables powerful runtime plugin/isolation patterns.',
          keyPoints: [
            'The **Bootstrap classloader** (native code, no Java parent) loads the core JDK classes (`java.lang.*`, `java.util.*`) from the runtime\'s core modules.',
            'The **Platform/Extension classloader** loads certain platform-provided modules; the **Application (System) classloader** loads classes from the application classpath — your own compiled code and its declared dependencies.',
            'The **delegation model**: before a classloader loads a class itself, it asks its parent to try first — a request only "falls" to a lower classloader if every ancestor fails to find the class.',
            'This delegation is what prevents a malicious or accidental `java.lang.String` defined in application code from ever shadowing the real JDK one — the bootstrap loader always gets first chance and already has it loaded.',
            'A class is uniquely identified at runtime by **both** its fully-qualified name *and* the classloader that loaded it — the same class name loaded by two different classloaders is treated as two distinct, incompatible types, the root cause of many `ClassCastException`s in plugin/application-server environments.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  App["Application (System) ClassLoader\\nloads YOUR code from the classpath"] -->|"delegates first"| Platform["Platform/Extension ClassLoader\\nloads certain platform modules"]\n  Platform -->|"delegates first"| Boot["Bootstrap ClassLoader (native)\\nloads java.lang.*, java.util.*, core JDK classes"]\n  Boot -.->|"class found? use it.\\nnot found? fall back down"| Platform\n  Platform -.->|"class found? use it.\\nnot found? fall back down"| App\n  App -.->|"only loads it itself\\nif no ancestor found it"| Loaded["class loaded"]',
            },
            {
              type: 'p',
              text: 'Loading a class actually happens lazily — the JVM does not load every class up front, only when a class is first actively used (instantiated, statically referenced, or its static initializers need to run). At that point, the request goes to a classloader, which (per the delegation model) asks its parent first, all the way up to the bootstrap loader, before attempting to find and define the class itself.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'inspecting the delegation chain, and the classic plugin-system bug',
              code: `System.out.println(String.class.getClassLoader());
// null -- core JDK classes are loaded by the native bootstrap loader,
// which Java represents as "null" since it isn't a real Java object

System.out.println(MyApp.class.getClassLoader());
// jdk.internal.loader.ClassLoaders$AppClassLoader@... -- loaded from your classpath

System.out.println(MyApp.class.getClassLoader().getParent());
// the platform classloader, one level up the delegation chain

// MISTAKE: assuming "the same class name" means "the same class"
Class<?> pluginClassA = pluginLoaderA.loadClass("com.example.Plugin");
Class<?> pluginClassB = pluginLoaderB.loadClass("com.example.Plugin");

System.out.println(pluginClassA == pluginClassB);
// false! Same fully-qualified name, but two DIFFERENT classloaders
// loaded it independently -- the JVM treats these as distinct types

Object instanceFromA = pluginClassA.getDeclaredConstructor().newInstance();
// pluginClassB.cast(instanceFromA);
// throws ClassCastException -- "com.example.Plugin cannot be cast to
// com.example.Plugin" (same-looking message, different classloaders)

// FIX: share the type across plugins by loading it with a COMMON
// ancestor classloader (e.g. a shared "API" classloader both plugin
// loaders delegate to), so every plugin sees the identical Class object`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Application servers, plugin systems, and hot-reload tooling deliberately break strict delegation (each plugin gets its own classloader with limited or reordered delegation) specifically to isolate plugins from each other\'s dependency versions — the classic "two plugins each need a different version of the same library" problem. This is also exactly why a `ClassCastException` between what looks like "the same class" is possible: the two instances were loaded by different classloaders and the JVM correctly treats them as different types.',
            },
          ],
        },
        {
          id: 'jmm-and-volatile',
          title: 'The Java Memory Model, `volatile` & Happens-Before',
          summary:
            'The Java Memory Model (JMM) is a formal specification of what visibility and ordering guarantees are promised across threads — without it, compiler/CPU optimizations that are perfectly safe for a single thread can silently break multi-threaded correctness.',
          keyPoints: [
            'Without synchronization, one thread\'s write to a shared variable is **not guaranteed to ever become visible** to another thread — the JIT and CPU are free to cache, reorder, or delay writes since nothing told them another thread cares.',
            '`volatile` guarantees that a read of a variable always sees the most recent write from any thread, and prevents the compiler/CPU from reordering operations around it — it provides visibility, but **not** atomicity for compound operations (`count++` on a `volatile int` is still a data race).',
            '"Happens-before" is the JMM\'s formal ordering relationship: if action A happens-before action B, every effect of A is guaranteed visible to B. A `volatile` write happens-before every subsequent `volatile` read of that same variable by any thread.',
            'Acquiring a lock (`synchronized`) happens-before every subsequent acquisition of that same lock — this is the actual guarantee that makes `synchronized` blocks safe: not just mutual exclusion, but visibility of everything written inside the block.',
            'Thread start (`Thread.start()` happens-before the new thread\'s first action) and thread completion (a thread\'s last action happens-before `Thread.join()` returning) are also part of the happens-before graph — this is why passing data to a thread before starting it, and reading results after joining it, is always safe without extra synchronization.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'why plain fields need volatile for cross-thread visibility',
              code: `class Flag {
    private boolean ready = false;   // NOT volatile: a bug waiting to happen

    void writer() { ready = true; }
    void reader() {
        while (!ready) {
            // may loop FOREVER on some JVMs/CPUs -- the write to "ready" is
            // never guaranteed to become visible to this thread without
            // volatile or another synchronization mechanism
        }
        System.out.println("ready seen");
    }
}

class FixedFlag {
    private volatile boolean ready = false;   // guarantees visibility across threads

    void writer() { ready = true; }
    void reader() {
        while (!ready) { /* will correctly observe the write */ }
        System.out.println("ready seen");
    }
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`volatile` gives visibility, not atomicity. `volatile int counter; counter++;` is still a race condition — the increment is really read-then-write, two separate operations, and two threads can interleave between them and lose an update. Use `AtomicInteger` (or a lock) for compound read-modify-write operations, not `volatile` alone.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant T1 as Thread 1\n  participant T2 as Thread 2\n  T1->>T1: data = 42 (plain write)\n  T1->>T1: volatile write: ready = true\n  Note over T1,T2: happens-before edge\n  T2->>T2: volatile read: while(!ready)\n  T2->>T2: reads data -- GUARANTEED to see 42\n  Note right of T2: the volatile write/read pair makes\\nEVERYTHING written before it visible too',
            },
          ],
        },
        {
          id: 'threads-and-synchronization',
          title: 'Threads & Synchronization',
          summary:
            'Java has had built-in threading since its first release — `Thread` and `Runnable` are the foundational APIs, and `synchronized` (backed by an intrinsic lock every object carries) is the original mechanism for coordinating access to shared state.',
          keyPoints: [
            'A `Thread` can be created by extending `Thread` (overriding `run()`) or, more commonly, by implementing `Runnable` and passing it to a `Thread` — preferred because it doesn\'t burn Java\'s single-inheritance slot and separates "what to run" from "how it runs".',
            '`start()` actually begins a new OS thread and (eventually) calls `run()` on it; calling `run()` directly just executes it synchronously on the current thread — a common beginner mistake.',
            'Every Java object carries an **intrinsic lock** (monitor); a `synchronized` method or block acquires the lock on `this` (or a specified object) for its duration, giving mutual exclusion and, per the JMM, a happens-before relationship on release/acquire.',
            'A `synchronized` instance method locks on the instance (`this`); a `synchronized` static method locks on the `Class` object itself — mixing the two for the same logical resource is a common source of bugs, since they use different locks.',
            '`java.util.concurrent.locks.ReentrantLock` offers what `synchronized` cannot: tryLock with a timeout, interruptible lock acquisition, and fairness policies — at the cost of needing an explicit `finally { lock.unlock(); }`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'Runnable over Thread, and synchronized in practice',
              code: `Runnable task = () -> System.out.println("running on: " + Thread.currentThread().getName());
Thread t = new Thread(task);
t.start();          // starts a NEW thread and calls run() on it
// task.run();       // would run SYNCHRONOUSLY on the current thread -- not what you want

class Counter {
    private int count = 0;

    public synchronized void increment() {   // locks on "this"
        count++;                              // safe: only one thread in here at a time
    }

    public synchronized int get() {
        return count;
    }
}

// ReentrantLock: more control, needs explicit unlock
private final ReentrantLock lock = new ReentrantLock();
void safeUpdate() {
    lock.lock();
    try {
        // critical section
    } finally {
        lock.unlock();   // MUST be in finally -- an exception must not leave the lock held
    }
}`,
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n  [*] --> New : new Thread(task)\n  New --> Runnable : start()\n  Runnable --> Running : scheduler assigns a CPU\n  Running --> Runnable : time slice ends / yield()\n  Running --> Blocked : waiting to enter a\\nsynchronized block\n  Blocked --> Runnable : lock acquired\n  Running --> Waiting : wait() / join() / park()\n  Waiting --> Runnable : notify() / notifyAll() / unpark()\n  Running --> Terminated : run() completes\\n(normally or via exception)\n  Terminated --> [*]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting `finally { lock.unlock(); }` with an explicit `Lock` is a severe bug: if the critical section throws, the lock is never released and every other thread waiting on it blocks forever. `synchronized` doesn\'t have this failure mode — the intrinsic lock is always released automatically, even on an exception, which is one real advantage it has over explicit locks despite being less flexible.',
            },
          ],
        },
        {
          id: 'java-util-concurrent',
          title: '`java.util.concurrent`: Executors & `CompletableFuture`',
          summary:
            'Manually managing raw `Thread` objects doesn\'t scale — the `java.util.concurrent` package provides higher-level abstractions (thread pools, futures, concurrent collections) that are what real-world concurrent Java code actually uses.',
          keyPoints: [
            '`ExecutorService` manages a pool of worker threads and a task queue — you submit tasks (`Runnable`/`Callable`) and the pool handles thread lifecycle, reuse, and scheduling, instead of you creating a raw `Thread` per task.',
            '`Executors.newFixedThreadPool(n)`, `newCachedThreadPool()`, `newSingleThreadExecutor()`, and (Java 21+) `newVirtualThreadPerTaskExecutor()` are the standard factory methods for common pool shapes.',
            'A `Future<T>` represents the eventual result of an asynchronous computation; `.get()` blocks until it\'s ready (optionally with a timeout).',
            '`CompletableFuture<T>` extends this with a fluent, composable API — chaining (`.thenApply`, `.thenCompose`), combining multiple futures (`.thenCombine`, `allOf`), and non-blocking callback-style completion instead of always blocking on `.get()`.',
            'The `java.util.concurrent` collections (`ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue` implementations) are thread-safe without requiring external synchronization, generally with far better throughput under contention than a manually `synchronized`-wrapped standard collection.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'ExecutorService and CompletableFuture',
              code: `ExecutorService pool = Executors.newFixedThreadPool(4);

Future<Integer> future = pool.submit(() -> {
    Thread.sleep(100);
    return 42;
});
Integer result = future.get();      // blocks until the task completes

pool.shutdown();                    // stop accepting new tasks, let queued ones finish

// CompletableFuture: composable, non-blocking chains
CompletableFuture<String> pipeline = CompletableFuture
    .supplyAsync(() -> fetchUserId())
    .thenApply(id -> fetchUserName(id))
    .thenApply(name -> "Hello, " + name)
    .exceptionally(ex -> "fallback: " + ex.getMessage());

pipeline.thenAccept(System.out::println);   // runs when the whole chain completes

// combining two independent async computations
CompletableFuture<Integer> a = CompletableFuture.supplyAsync(() -> fetchA());
CompletableFuture<Integer> b = CompletableFuture.supplyAsync(() -> fetchB());
CompletableFuture<Integer> sum = a.thenCombine(b, Integer::sum);`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Submit["submit tasks"] --> Queue["task queue"]\n  Queue --> W1["worker thread 1"]\n  Queue --> W2["worker thread 2"]\n  Queue --> W3["worker thread N"]\n  W1 --> Done1["Future/CompletableFuture\\ncompletes"]\n  W2 --> Done2["completes"]\n  W3 --> Done3["completes"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Java 21 introduced **virtual threads** (Project Loom) — extremely lightweight threads managed by the JVM rather than mapped 1:1 to OS threads, letting you write simple blocking-style code (`Thread.sleep`, blocking I/O) at massive concurrency (hundreds of thousands of threads) without the memory/context-switch cost of platform threads. `Executors.newVirtualThreadPerTaskExecutor()` is the entry point.',
            },
          ],
        },
        {
          id: 'concurrency-pitfalls',
          title: 'Concurrency Pitfalls: Race Conditions & Deadlock',
          summary:
            'Concurrent code introduces two recurring failure modes — a race condition (an unsynchronized interleaving produces a wrong result) and deadlock (threads permanently blocked waiting on each other) — that are notoriously hard to reproduce in testing and worth recognizing by pattern.',
          keyPoints: [
            'A **race condition** occurs when the correctness of a result depends on the unpredictable timing/interleaving of multiple threads accessing shared state — classic example: two threads both read a counter, both increment it locally, both write back, and one increment is lost.',
            'The fix for a race condition is making the read-modify-write sequence atomic — via `synchronized`, an explicit `Lock`, or an atomic class (`AtomicInteger`, `AtomicReference`) built on lock-free CPU compare-and-swap instructions.',
            '**Deadlock** occurs when two or more threads each hold a lock the other needs, and each waits forever for the other to release it — the canonical case is two threads acquiring the same two locks in opposite order.',
            'The standard prevention strategy is **consistent lock ordering** — if every thread that needs both Lock A and Lock B always acquires A before B, the circular-wait condition that causes deadlock cannot occur.',
            'Other classic concurrency bugs worth naming: **livelock** (threads actively responding to each other but making no real progress, e.g. both repeatedly backing off and retrying in lockstep) and **starvation** (a thread perpetually loses out to others for a resource, e.g. under an unfair lock policy).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a race condition and the atomic fix',
              code: `class UnsafeCounter {
    private int count = 0;
    public void increment() { count++; }   // read, add 1, write -- NOT atomic
}
// two threads calling increment() concurrently can both read the same old value,
// both compute oldValue + 1, both write it back -- one increment is silently lost

class SafeCounter {
    private final AtomicInteger count = new AtomicInteger(0);
    public void increment() { count.incrementAndGet(); }   // atomic compare-and-swap loop
}`,
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant T1 as Thread 1\n  participant T2 as Thread 2\n  T1->>T1: acquires Lock A\n  T2->>T2: acquires Lock B\n  T1->>T2: waits for Lock B (held by T2)\n  T2->>T1: waits for Lock A (held by T1)\n  Note over T1,T2: DEADLOCK -- each waits forever\\nfor a lock the other already holds',
            },
            {
              type: 'code',
              language: 'java',
              title: 'deadlock-prone code, and the consistent-ordering fix',
              code: `// DEADLOCK-PRONE: transferMoney(A, B, ...) and transferMoney(B, A, ...) called
// concurrently can lock in opposite order and deadlock
void transferMoney(Account from, Account to, double amount) {
    synchronized (from) {
        synchronized (to) {
            from.debit(amount);
            to.credit(amount);
        }
    }
}

// FIXED: always acquire locks in a consistent, well-defined order (e.g. by account ID)
void transferMoneySafe(Account a, Account b, double amount) {
    Account first  = a.id() < b.id() ? a : b;
    Account second = a.id() < b.id() ? b : a;
    synchronized (first) {
        synchronized (second) {
            a.debit(amount);
            b.credit(amount);
        }
    }
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Race conditions and deadlocks are famously hard to catch in testing because they depend on precise thread timing — code can pass every test and still fail intermittently in production under real load. Favor higher-level, already-correct concurrency utilities (`java.util.concurrent`) over hand-rolled locking whenever possible; when locking is unavoidable, keep critical sections small and lock ordering consistent and documented.',
            },
          ],
        },
        {
          id: 'junit5-testing',
          title: 'JUnit 5 Fundamentals',
          summary:
            'JUnit 5 is the standard testing framework for Java — a small set of annotations and assertion methods cover the vast majority of unit-testing needs, from a single assertion to a fully parameterized test matrix.',
          keyPoints: [
            '`@Test` marks a method as a test case; `Assertions.assertEquals(expected, actual)`, `assertTrue`, `assertThrows`, and friends verify outcomes and fail the test with a clear message if they don\'t hold.',
            'Lifecycle annotations: `@BeforeEach`/`@AfterEach` run before/after every test method; `@BeforeAll`/`@AfterAll` run once for the whole test class (and must be `static` by default).',
            '`@ParameterizedTest` with a source annotation (`@ValueSource`, `@CsvSource`, `@MethodSource`) runs the same test logic once per supplied input, instead of copy-pasting near-identical test methods.',
            '`assertThrows(ExceptionType.class, () -> ...)` is the standard way to assert that a specific code path throws — it also returns the caught exception for further assertions on its message/state.',
            '`@DisplayName` gives a test a human-readable name in reports; `@Disabled` skips a test with a documented reason; `@Nested` groups related tests into a nested class for a more organized test report.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a JUnit 5 test class',
              code: `class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();   // fresh instance before EVERY test
    }

    @Test
    @DisplayName("adding two positive numbers returns their sum")
    void addsPositiveNumbers() {
        assertEquals(5, calculator.add(2, 3));
    }

    @Test
    void divisionByZeroThrows() {
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> calculator.divide(10, 0)
        );
        assertEquals("divisor cannot be zero", ex.getMessage());
    }

    @ParameterizedTest
    @CsvSource({
        "2, 3, 5",
        "0, 0, 0",
        "-1, 1, 0"
    })
    void addsVariousInputs(int a, int b, int expected) {
        assertEquals(expected, calculator.add(a, b));
    }
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  BA["@BeforeAll\\n(once, static)"] --> BE1["@BeforeEach"]\n  BE1 --> T1["@Test method 1"]\n  T1 --> AE1["@AfterEach"]\n  AE1 --> BE2["@BeforeEach"]\n  BE2 --> T2["@Test method 2"]\n  T2 --> AE2["@AfterEach"]\n  AE2 --> AA["@AfterAll\\n(once, static)"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Keep each test focused on one behavior and independent of test execution order — `@BeforeEach` resetting shared fixture state (rather than reusing mutated state across tests) is what makes tests reliable regardless of the order the runner happens to execute them in.',
            },
          ],
        },
        {
          id: 'mockito-basics',
          title: 'Mockito Basics: Mocking Dependencies',
          summary:
            'Mockito lets a unit test replace a real dependency with a lightweight fake object whose behavior you control — isolating the class under test from the actual behavior (and cost, flakiness, or side effects) of its collaborators.',
          keyPoints: [
            '`mock(SomeClass.class)` creates a fake implementation of a class/interface where every method does nothing (returns null/0/false) until you explicitly configure it.',
            '`when(mock.method(args)).thenReturn(value)` stubs a specific call to return a specific value; `thenThrow(...)` stubs it to throw instead — for testing error-handling paths without needing a real failure.',
            '`verify(mock).method(args)` asserts that a specific interaction actually happened — the tool for testing that a class under test correctly *called* a dependency (e.g., that a repository\'s `save()` was actually invoked), not just what it returned.',
            '`@Mock` plus `@ExtendWith(MockitoExtension.class)` (JUnit 5) auto-creates and injects mocks into fields, removing the boilerplate of manually calling `mock()` for every dependency.',
            'A unit test using mocks tests the class **in isolation** — it verifies the class under test behaves correctly given specific responses from its dependencies, not that the real dependencies themselves work (that\'s what integration tests are for).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'mocking a repository dependency',
              code: `@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository repository;   // fake -- no real database involved

    @InjectMocks
    private OrderService service;         // real OrderService, with the mock injected in

    @Test
    void placingAnOrderSavesIt() {
        Order order = new Order("item-1", 2);
        when(repository.save(any(Order.class))).thenReturn(order);

        Order result = service.placeOrder(order);

        assertEquals(order, result);
        verify(repository).save(order);   // asserts save() was actually called with this order
    }

    @Test
    void repositoryFailureIsPropagatedAsServiceException() {
        when(repository.save(any())).thenThrow(new DataAccessException("db down"));

        assertThrows(OrderServiceException.class, () -> service.placeOrder(new Order("item-1", 2)));
    }
}`,
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant TestCase as OrderServiceTest\n  participant Service as OrderService (real)\n  participant MockRepo as OrderRepository (mock)\n  TestCase->>MockRepo: when(save(any())).thenReturn(order)\n  TestCase->>Service: placeOrder(order)\n  Service->>MockRepo: save(order)\n  MockRepo-->>Service: order (the stubbed return value)\n  Service-->>TestCase: result\n  TestCase->>MockRepo: verify(save(order))\n  Note over TestCase,MockRepo: no real database was ever touched',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Over-mocking — stubbing so many internal collaborators that the test just re-describes the implementation step by step — produces brittle tests that break on any refactor even when behavior is unchanged. Mock at the boundary of what the unit genuinely doesn\'t own (a database, an external HTTP client), not every internal collaborator.',
            },
          ],
        },
        {
          id: 'build-tools-maven-gradle',
          title: 'Build Tools: Maven vs Gradle',
          summary:
            'A Java build tool manages far more than "compiling code" — dependency resolution, a standard project layout, the compile/test/package lifecycle, and plugin-based extensibility are all part of the job, and Maven and Gradle are the two dominant answers.',
          keyPoints: [
            'A build tool resolves and downloads **dependencies** (and their transitive dependencies) from a repository (Maven Central being the default for both tools), manages **classpaths** for compiling/testing/running, and packages the result (a JAR/WAR) — all driven by a declarative or scripted configuration file rather than manual `javac`/`java` invocations.',
            '**Maven** uses declarative XML (`pom.xml`) and a fixed, convention-based lifecycle (`validate → compile → test → package → verify → install → deploy`) — predictable and consistent across projects, at the cost of being verbose and less flexible for unusual build logic.',
            '**Gradle** uses a Groovy or Kotlin DSL (`build.gradle` / `build.gradle.kts`) — a real programming language for the build script, enabling custom logic directly, plus incremental builds and a build cache that make repeated builds significantly faster than Maven\'s by default.',
            'Both resolve **transitive dependencies** automatically (your dependency\'s dependencies get pulled in too) and both support a plugin ecosystem for extending the build (code generation, static analysis, containerization, etc.).',
            'Neither replaces the JDK\'s own `javac`/`java` — they orchestrate calling them (and everything else in the pipeline) consistently and reproducibly across machines and CI, which is the actual problem a build tool solves.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Maven', 'Gradle'],
              rows: [
                ['Config format', 'Declarative XML (`pom.xml`)', 'Groovy/Kotlin DSL (`build.gradle[.kts]`)'],
                ['Build lifecycle', 'Fixed, convention-based phases', 'Flexible task graph, fully customizable'],
                ['Incremental builds', 'Limited', 'Strong — incremental + build cache by default'],
                ['Learning curve', 'Lower — one way to do most things', 'Higher — more powerful, more ways to do things'],
                ['Common in', 'Enterprise/Spring-heavy codebases historically', 'Android (official build tool), many modern JVM projects'],
              ],
            },
            {
              type: 'code',
              language: 'xml',
              title: 'a minimal Maven pom.xml dependency declaration',
              code: `<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>`,
            },
            {
              type: 'code',
              language: 'groovy',
              title: 'the equivalent in Gradle (Groovy DSL)',
              code: `dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web:3.2.0'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Validate["validate"] --> Compile["compile"]\n  Compile --> TestPhase["test"]\n  TestPhase --> Package["package\\n(JAR / WAR)"]\n  Package --> Verify["verify"]\n  Verify --> Install["install\\n(local repo)"]\n  Install --> Deploy["deploy\\n(remote repo)"]',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Both tools resolve the same underlying problem — reproducible builds and consistent dependency versions across every developer machine and CI runner — which matters more than the syntax choice itself: without a build tool, "works on my machine" regularly means someone has a different, uncoordinated set of JARs on their manual classpath.',
            },
          ],
        },
      ],
    },
    {
      id: 'java-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Common Java interview questions, with the reasoning an interviewer is actually listening for.',
          qa: [
            {
              question: 'What does "write once, run anywhere" actually mean, mechanically?',
              answer:
                'Java source is compiled by `javac` into bytecode (`.class` files) — a portable instruction set, not native machine code for any particular CPU. That bytecode is identical no matter what platform compiled it. Each platform (Windows, Linux, macOS) has its own JVM build capable of executing that same bytecode, so the portability boundary is the JVM, not the source or the compiled artifact — you compile once and the same `.class` files run unmodified anywhere a compatible JVM exists.',
            },
            {
              question: 'What is the difference between the JDK, JRE, and JVM?',
              answer:
                'The JVM is the virtual machine that actually executes bytecode. The JRE is the JVM plus the standard library classes — enough to run already-compiled Java programs, but not to compile new ones. The JDK is the JRE plus development tools (`javac`, `javadoc`, a debugger, `jar`) — what\'s needed to write and compile Java code. Since Java 11, JDK distributions no longer ship a separate slimmed-down JRE package; installing the JDK is the standard path either way.',
            },
            {
              question: 'Why does overriding `equals()` without `hashCode()` cause bugs, specifically?',
              answer:
                'The `hashCode` contract requires that if two objects are equal per `equals()`, they must produce the same hash code. Hash-based collections (`HashMap`, `HashSet`) use an object\'s hash code to pick which bucket to store or look it up in. If `equals()` is overridden to compare by value but `hashCode()` is left as the default identity-based implementation, two "equal" objects can land in different buckets — so `set.add(a); set.contains(b)` can return `false` even though `a.equals(b)` is `true`, because `contains()` never even looks in the bucket where `a` actually lives.',
            },
            {
              question: 'What is type erasure, and what specific limitations does it cause for generics?',
              answer:
                'Java implements generics via type erasure: generic type parameters exist only at compile time for type-checking purposes and are erased (replaced with their bound, `Object` if unbounded) in the compiled bytecode. `List<String>` and `List<Integer>` are the same runtime class, `List`. Concrete consequences: you cannot instantiate a generic type parameter directly (`new T()`), create a generic array (`new T[]`), use `instanceof` against a parameterized type (`obj instanceof List<String>`), or overload two methods that differ only in generic type parameter — the runtime has no way to distinguish any of these because the type information simply isn\'t there anymore.',
            },
            {
              question: 'Explain checked vs unchecked exceptions, and when you would choose to make a custom exception checked.',
              answer:
                'Checked exceptions (subclasses of `Exception` other than `RuntimeException`) must be either caught or declared in a method\'s `throws` clause — the compiler enforces handling. Unchecked exceptions (`RuntimeException` and its subclasses) require no such declaration and typically represent programming errors (`NullPointerException`, `IllegalArgumentException`) rather than conditions a caller is expected to specifically plan for. A reasonable rule: make an exception checked only when the failure is genuinely recoverable and a caller should be forced to consciously decide how to handle it (e.g., a file genuinely might not exist); make it unchecked when it represents a bug or a condition most callers can\'t meaningfully recover from at that call site. In practice, many modern codebases lean unchecked even for recoverable conditions, since checked exceptions interact poorly with lambdas and streams.',
            },
            {
              question: 'What is the difference between `ArrayList` and `LinkedList`, and when would you pick one over the other?',
              answer:
                '`ArrayList` is backed by a resizable array — O(1) indexed access (`get(i)`), but O(n) insertion/removal in the middle since subsequent elements must shift. `LinkedList` is a doubly-linked list of nodes — O(1) insertion/removal once you already have a reference to the position, but O(n) to reach an arbitrary index since it has to walk the list. In practice, `ArrayList` is the right default for nearly all use cases — it has better cache locality and lower per-element memory overhead — and `LinkedList` is only clearly better when you specifically need frequent insertion/removal at both ends combined with sequential (not random) access, which `ArrayDeque` often serves better anyway.',
            },
            {
              question: 'How do Streams achieve laziness, and why does it matter?',
              answer:
                'Intermediate stream operations (`map`, `filter`, `sorted`, etc.) don\'t process any elements when called — they just build up a description of the pipeline and return a new Stream wrapping that description. Nothing actually executes until a terminal operation (`collect`, `forEach`, `reduce`, `anyMatch`, ...) is invoked, at which point the entire pipeline runs in a single pass, pulling each element through all the intermediate steps before moving to the next. This matters for two reasons: short-circuiting operations like `findFirst`, `anyMatch`, or `limit` can stop processing early instead of transforming the entire source first, and it means a stream built from an expensive or even infinite source (`Stream.iterate`) is safe to use as long as a short-circuiting terminal operation eventually bounds it.',
            },
            {
              question: 'What is the purpose of `Optional`, and what is it explicitly NOT meant to be used for?',
              answer:
                '`Optional<T>` makes the possibility of "no value" visible in a method\'s return type, nudging callers to handle absence explicitly (via `.map()`, `.orElse()`, `.orElseThrow()`, etc.) instead of risking an undocumented `null` that\'s easy to forget to check. It is explicitly not intended as a field type, a constructor/method parameter type, or something stored inside collections — its design and performance characteristics (an extra wrapper allocation, not `Serializable`) are specifically for return values signaling absence, and using it elsewhere is generally considered a misuse of the API.',
            },
            {
              question: 'What do records generate automatically, and what do you still have to write yourself?',
              answer:
                'A `record` auto-generates: private final fields for each declared component, a canonical constructor, accessor methods named after each component (`x()`, not `getX()`), and correct `equals()`/`hashCode()`/`toString()` implementations based on all components. You still write any additional business logic methods, static factory methods, and — if you want validation or normalization — a compact canonical constructor (`public Point { if (x < 0) throw ...; }`) that runs before the implicit field assignments. Records are also implicitly final and cannot extend another class (though they can implement interfaces), since their whole purpose is a fixed, immutable data shape.',
            },
            {
              question: 'How does the JVM organize heap memory for garbage collection, and why?',
              answer:
                'The heap is divided based on the "generational hypothesis" — the empirical observation that most objects die young and few survive long. New objects are allocated in the Young Generation (specifically the Eden space); objects that survive a few minor garbage collections get promoted into the Old Generation. Minor GCs (Young Gen only) are frequent and cheap because most objects there are already garbage and get reclaimed quickly with little live-object copying; major/full GCs (which include the Old Generation) are rarer but far more expensive, since the Old Generation tends to be much larger and contains mostly-live objects. This split lets the collector spend most of its effort where it pays off most — collecting short-lived garbage cheaply — instead of scanning the entire heap on every collection.',
            },
            {
              question: 'What is the difference between a minor GC and a major/full GC, in terms of impact?',
              answer:
                'A minor GC collects only the Young Generation, is typically fast (often single-digit milliseconds), and happens frequently as new objects are allocated. A major or full GC collects the Old Generation (and, depending on the collector, potentially the whole heap), is significantly more expensive since the Old Generation is larger and mostly live, and is the actual source of noticeable "GC pause" complaints in production. Choosing and tuning a garbage collector (G1, ZGC, etc.) is largely about minimizing the frequency and duration of these expensive major collections for a given application\'s latency requirements.',
            },
            {
              question: 'Explain the classloader delegation model and why it matters for security and correctness.',
              answer:
                'When a classloader is asked to load a class, it first delegates the request to its parent classloader, which in turn delegates to its own parent, all the way up to the bootstrap classloader — only if every ancestor fails to find the class does the request fall back down to be handled by a lower-level loader. This means core JDK classes (loaded by the bootstrap loader) are always found first and can never be shadowed by an application-defined class of the same name, which prevents a malicious or accidental class named e.g. `java.lang.String` in application code from ever being used in place of the real one. It also explains a specific class of `ClassCastException`: a class is identified at runtime by both its fully-qualified name and the classloader that loaded it, so the "same" class loaded by two different classloaders (common in plugin systems and application servers) is treated as two distinct, incompatible types.',
            },
            {
              question: 'What does `volatile` guarantee, and what does it NOT guarantee?',
              answer:
                '`volatile` guarantees visibility (a read always sees the most recent write from any thread) and prevents the compiler/CPU from reordering operations around that variable, establishing a happens-before relationship between a volatile write and every subsequent volatile read of it. It does NOT guarantee atomicity for compound operations — `volatile int counter; counter++;` is still a data race, because increment is really a read followed by a separate write, and two threads can interleave between those two steps. For an atomic read-modify-write, use `AtomicInteger`/`AtomicReference` (built on lock-free compare-and-swap) or synchronize the whole operation with a lock.',
            },
            {
              question: 'What is a happens-before relationship, and can you give two concrete examples the JMM guarantees?',
              answer:
                'Happens-before is the Java Memory Model\'s formal ordering guarantee: if action A happens-before action B, every effect of A (including plain, non-volatile writes) is guaranteed visible to B — without such a relationship, there is no guarantee a write by one thread is ever observed by another, regardless of how "obviously" sequential the code looks. Two concrete guarantees: (1) a `volatile` write happens-before every subsequent `volatile` read of that same variable by any thread; (2) releasing a lock (exiting a `synchronized` block) happens-before any later acquisition of that same lock by another thread — which is the actual mechanism that makes `synchronized` blocks safe for more than just mutual exclusion, since it also guarantees visibility of everything written inside.',
            },
            {
              question: 'What causes deadlock, and what is the standard prevention strategy?',
              answer:
                'Deadlock happens when two or more threads each hold a lock the other needs and each blocks forever waiting for the other to release it — the canonical case is two threads acquiring the same two locks in opposite order (Thread 1 locks A then waits for B; Thread 2 locks B then waits for A). The standard prevention strategy is consistent lock ordering: if every code path that needs both locks always acquires them in the same fixed order (e.g., by comparing a stable ID and always locking the lower one first), the circular-wait condition required for deadlock can never occur. Other mitigations include using `tryLock()` with a timeout to fail and retry rather than blocking forever, and keeping critical sections as small as possible to reduce the window where contention can occur.',
            },
            {
              question: 'What is the difference between `Runnable` and `Callable`, and between `Thread.start()` and `Thread.run()`?',
              answer:
                '`Runnable` represents a task with no return value and cannot throw checked exceptions (`void run()`); `Callable<V>` returns a value and can throw checked exceptions (`V call() throws Exception`), which is why `ExecutorService.submit()` accepting a `Callable` returns a `Future<V>` you can actually get a result from. Separately, `Thread.start()` creates and begins execution on a genuinely new OS thread, which will eventually call `run()` on that new thread; calling `Thread.run()` directly does not start a new thread at all — it just executes the method body synchronously on the current thread, which is a common beginner mistake that silently defeats the entire purpose of using a `Thread`.',
            },
            {
              question: 'Why is `ConcurrentHashMap` generally preferred over a `synchronized`-wrapped `HashMap`?',
              answer:
                'A `Collections.synchronizedMap(new HashMap<>())` synchronizes on a single lock for the entire map, meaning only one thread can read or write anywhere in the map at a time, regardless of which keys are involved — a significant bottleneck under contention. `ConcurrentHashMap` uses much finer-grained internal locking (historically per-segment, and lock-free reads via `volatile`/CAS in modern implementations), allowing many threads to read and even write concurrently as long as they aren\'t touching the same internal bucket. It also provides atomic compound operations (`computeIfAbsent`, `merge`) that would otherwise require external synchronization to implement correctly, and its iterators are weakly consistent rather than throwing `ConcurrentModificationException`.',
            },
            {
              question: 'What is the difference between `String`, `StringBuilder`, and `StringBuffer`?',
              answer:
                '`String` is immutable — every apparent modification produces a new object. `StringBuilder` is a mutable, resizable character buffer for efficiently building a string incrementally (e.g., inside a loop), with no thread-safety guarantees. `StringBuffer` is functionally the same as `StringBuilder` but with all its methods `synchronized`, making it thread-safe at the cost of synchronization overhead on every call — largely a legacy class at this point, since sharing a mutable string builder across threads is rare, and `StringBuilder` (unsynchronized) is preferred whenever the object stays confined to one thread, which is the overwhelmingly common case.',
            },
            {
              question: 'What is the difference between `HashMap` and `TreeMap`, and what does it cost to get TreeMap\'s ordering?',
              answer:
                '`HashMap` provides O(1) average-case get/put by hashing keys into buckets, with no guaranteed iteration order. `TreeMap` maintains keys in sorted order (natural ordering, or a supplied `Comparator`) by storing them in a red-black tree, which costs O(log n) for get/put/remove instead of O(1) average. Choose `TreeMap` specifically when you need sorted iteration, range queries (`headMap`, `tailMap`, `subMap`), or nearest-key lookups (`floorKey`, `ceilingKey`) — otherwise `HashMap`\'s O(1) average performance makes it the default choice.',
            },
            {
              question: 'Explain the PECS principle for generic wildcards, with an example of each.',
              answer:
                'PECS stands for "Producer Extends, Consumer Super." If a generic parameter is a source you only ever read values FROM (a producer), use `? extends T` — e.g., `List<? extends Number> source` lets you safely call `.get()` and treat results as `Number`, but you can\'t add to it since the compiler doesn\'t know the exact subtype. If a generic parameter is a destination you only ever write values TO (a consumer), use `? super T` — e.g., `List<? super Integer> dest` lets you safely call `.add(anInteger)`, since any supertype of `Integer` can legally hold one, but reading from it only guarantees you get back an `Object`. This is exactly the shape of `Collections.copy(List<? super T> dest, List<? extends T> src)` in the standard library.',
            },
            {
              question: 'What is the difference between `==` and `.equals()` for objects, and why does this matter more for Strings specifically?',
              answer:
                '`==` compares references — whether two variables point to the literal same object in memory. `.equals()` (when properly overridden, as `String` and most standard library classes do) compares logical/value equality. For Strings specifically, this is a classic trap because of string literal interning: identical string literals (`"abc" == "abc"`) happen to share the same pooled object and so `==` "works" by coincidence, but any string built at runtime (via concatenation, `new String(...)`, user input, `substring()`, etc.) is a separate heap object even if its contents are identical — so relying on `==` habitually, then hitting a runtime-constructed string, produces a bug that\'s easy to miss in casual testing.',
            },
            {
              question: 'What does `try-with-resources` do, and what interface must a resource implement to use it?',
              answer:
                'A resource used in `try (Resource r = ...) { ... }` must implement `AutoCloseable` (or its more specific subtype `Closeable`). The compiler guarantees `close()` is called on the resource when the block exits, whether normally or via an exception — equivalent to, but far less error-prone than, manually calling `close()` in a `finally` block. Multiple resources can be declared in one try-with-resources statement, separated by semicolons, and they are closed in reverse order of declaration; if both the try block and a `close()` call throw, the try block\'s exception is the one propagated, with the close exception attached as a suppressed exception rather than silently discarded.',
            },
            {
              question: 'What is method overloading vs method overriding, and how does the JVM resolve each?',
              answer:
                'Overloading is having multiple methods with the same name but different parameter lists in the same class (or a subclass) — resolved at **compile time** based on the static (declared) types of the arguments, a form of static/early binding. Overriding is a subclass providing its own implementation of a method with the identical signature inherited from a superclass — resolved at **runtime** based on the actual object\'s type, a form of dynamic/late binding (this is the mechanism behind runtime polymorphism: calling a method on a superclass-typed reference invokes the subclass\'s overridden version). A frequent gotcha: overloaded method resolution does not consider the runtime type of arguments at all, only their compile-time declared type — passing a `null` literal to overloaded methods, or relying on autoboxing to disambiguate an overload, can pick a different overload than intuition suggests.',
            },
            {
              question: 'Why can a lambda only capture effectively final local variables?',
              answer:
                'A lambda captures variables from its enclosing scope by value, at the moment it is created — it doesn\'t hold a live reference into the enclosing method\'s stack frame (which, for a local variable, may not even exist anymore by the time the lambda actually runs, e.g. if it outlives the method call). Because there is no mechanism for the lambda to observe a later reassignment of that variable, Java requires captured local variables to be effectively final (assigned exactly once) specifically to prevent code that would misleadingly suggest the lambda sees live updates it actually cannot. Fields and array/collection contents are different — a lambda can freely mutate an object\'s fields or a collection\'s contents, since only reassignment of the local variable itself is restricted, not mutation of what it points to.',
            },
          ],
        },
      ],
    },
  ],
}
