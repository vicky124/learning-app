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
              code: 'flowchart LR\n  Source[".java source file"] -->|"javac (compiler)"| Bytecode[".class file<br/>(portable bytecode)"]\n  Bytecode -->|"loaded by"| ClassLoader["Class Loader"]\n  ClassLoader --> JVM["JVM Execution Engine"]\n  JVM -->|"interpreted at first"| Interp["bytecode interpreter"]\n  JVM -->|"hot paths recompiled"| JIT["JIT compiler<br/>(native machine code)"]\n  Interp --> OS["runs on this OS/CPU"]\n  JIT --> OS',
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
            {
              type: 'heading',
              text: 'Why bytecode + JIT can beat ahead-of-time compilation',
            },
            {
              type: 'p',
              text: 'A C++ compiler must optimize for *every possible* execution. The JIT optimizes for the execution that is *actually happening*: it profiles which branches are taken, which concrete classes show up at a virtual call site, and which methods are hot, then compiles speculatively for exactly that shape — inlining a "virtual" interface call that in practice only ever sees one implementation, eliminating allocations that never escape a method, and removing bounds checks it can prove redundant. If a speculation later turns out wrong (a new subclass gets loaded), the JVM **deoptimizes** back to the interpreter and recompiles. The price is **warm-up**: a freshly started JVM runs slowly until profiling and compilation catch up, which is why startup time and memory footprint — not peak throughput — are the JVM\'s historical weak spots (see the JIT & startup topic).',
            },
            {
              type: 'code',
              language: 'java',
              title: 'the smallest Java program today (compact source file, JDK 25+)',
              code: `// Hello.java -- no class declaration, no "public static", no String[] args.
// Finalized in JDK 25 (JEP 512 "Compact Source Files and Instance Main Methods").
void main() {
    IO.println("Hello, JVM!");   // java.lang.IO: simple console I/O helper
}

// Run directly from source -- the launcher compiles in memory, no javac step:
//   java Hello.java
// Since JDK 22 the source launcher can also run multi-file programs.`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '"The JVM" is a specification, not one product. **HotSpot** (in OpenJDK) is the dominant implementation; vendors such as Eclipse Temurin, Amazon Corretto, Azul Zulu, Microsoft Build of OpenJDK, Red Hat and Oracle ship OpenJDK-based builds that are functionally near-identical — the real differences are support timelines, patch cadence and licensing. Eclipse OpenJ9 is an alternative JVM with a different GC and JIT, and GraalVM adds an alternative JIT compiler plus Native Image ahead-of-time compilation.',
            },
          ],
        },
        {
          id: 'jdk-releases-and-lts',
          title: 'Java Releases & LTS: What Changed from 8 to Today',
          summary:
            'Java ships a new feature release every six months and designates one every two years as Long-Term Support. Knowing which features landed in which LTS — and how preview features graduate — is how you decide what you can use, and how to plan upgrades.',
          keyPoints: [
            'Since Java 10 (2018) there is a **feature release every March and September**. As of October 2026 the latest release is **JDK 27** (GA 15 September 2026); the latest **LTS is JDK 25** (September 2025).',
            'LTS releases since 2021 come every two years: **8, 11, 17, 21, 25** — the next on that cadence would be JDK 29 (September 2027). Most production fleets standardize on an LTS; non-LTS releases get only six months of updates from OpenJDK.',
            'New language/API features usually arrive as **preview** (`--enable-preview`, may change or be withdrawn) or **incubator** (`jdk.incubator.*` modules) first, then become final — e.g. virtual threads previewed in 19–20 and went final in 21.',
            'Features can be **withdrawn**: String Templates previewed in JDK 21–22 and were removed in JDK 23 for redesign. Never ship production code on preview APIs unless you accept rewriting it.',
            'Upgrading LTS-to-LTS (17 → 21 → 25) is now routine; most of the pain was the 8 → 11 jump (module system encapsulation, removed Java EE modules like JAXB, `sun.misc` internals).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Release', 'Year', 'Headline features you will meet in real code'],
              rows: [
                ['Java 8 (LTS)', '2014', 'Lambdas, Streams, `Optional`, `java.time`, default methods'],
                ['Java 11 (LTS)', '2018', 'Module system (from 9), `var` (10), `HttpClient`, single-file source launch, Java EE modules removed, ZGC (experimental)'],
                ['Java 17 (LTS)', '2021', 'Records (16), sealed classes, pattern matching for `instanceof` (16), text blocks (15), switch expressions (14), helpful NPE messages (14)'],
                ['Java 21 (LTS)', '2023', 'Virtual threads, pattern matching for `switch`, record patterns, sequenced collections, generational ZGC'],
                ['JDK 22–24', '2024–25', 'Unnamed variables `_`, FFM API (Panama) final, Stream Gatherers, Class-File API, AOT class loading & linking cache, `synchronized` no longer pins virtual threads, Security Manager permanently disabled'],
                ['Java 25 (LTS)', '2025', 'Scoped values final, compact source files & instance `main`, module import declarations, flexible constructor bodies, compact object headers (product option), generational Shenandoah, AOT method profiling'],
                ['JDK 26', 'Mar 2026', 'HTTP/3 in `HttpClient`, warnings on reflective mutation of `final` fields ("prepare to make final mean final"), Applet API removed, G1 throughput improvements'],
                ['JDK 27', 'Sep 2026', 'G1 default in all environments, compact object headers on by default, post-quantum hybrid key exchange for TLS 1.3; structured concurrency still in preview'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  JEP["JEP draft"] --> Inc["Incubator<br/>jdk.incubator.* module"]\n  JEP --> Prev["Preview<br/>needs --enable-preview"]\n  Inc --> Prev\n  Prev -->|"feedback, often 2-6 rounds"| Prev\n  Prev --> Final["Final / standard<br/>in a numbered release"]\n  Prev -->|"design rejected"| Withdrawn["Withdrawn<br/>e.g. String Templates"]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'using a preview feature (compile AND run need the flag)',
              code: `# preview features are tied to ONE exact release -- bytecode compiled with
# --enable-preview on JDK 27 will refuse to run on JDK 28
javac --release 27 --enable-preview -d out src/Main.java
java --enable-preview -cp out Main

# or straight from source
java --enable-preview Main.java`,
            },
            {
              type: 'heading',
              text: 'Upgrade strategy that works in practice',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Compile with `--release N` (not just `-source/-target`) so `javac` also checks you only use APIs that exist in release N.',
                'Run `jdeps --jdk-internals` on your jars to find uses of JDK internals that strong encapsulation (JDK 16/17) now blocks.',
                'Upgrade build plugins, bytecode-manipulating libraries (ByteBuddy, ASM, Mockito, Lombok, Spring) **first** — they are the usual blockers because they must understand the new class-file version.',
                'Run your test suite on the new JDK in CI before switching production; watch for new warnings (e.g. dynamic agent loading, final-field mutation, native access).',
                'Roll out gradually and compare GC logs and latency percentiles — defaults (GC choice, heap ergonomics, object header size) do change between releases.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A practical policy: production on the latest LTS (today JDK 25), CI also building on the latest feature release (JDK 27) so incompatibilities surface early. The "it\'s not LTS so it\'s unstable" belief is wrong — non-LTS releases are equally production-quality; they just stop receiving free updates after six months.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Java 8 is still common in legacy estates, but staying there means no virtual threads, no records, no modern GCs (generational ZGC, current G1 improvements), worse container awareness defaults in old builds, and steadily shrinking library support — many major frameworks (Spring Framework 6+, Spring Boot 3+, Jakarta EE 11, JUnit 6) require Java 17 as a minimum.',
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
              code: 'flowchart TD\n  Box["Integer x = 100;<br/>(autoboxing)"] --> Check{"value between<br/>-128 and 127?"}\n  Check -->|"yes"| Cached["Integer.valueOf() returns a<br/>SHARED cached object"]\n  Check -->|"no"| NewObj["a brand-new Integer<br/>object is allocated"]\n  Cached --> SameRef["two cached Integers with the<br/>same value ARE == equal<br/>(same object, by coincidence)"]\n  NewObj --> DiffRef["two new Integers with the<br/>same value are NOT == equal<br/>(different objects)"]',
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
            {
              type: 'heading',
              text: 'What boxing really costs',
            },
            {
              type: 'p',
              text: 'An `int` is 4 bytes stored inline. An `Integer` is a separate heap object: an object header (12 bytes on a typical 64-bit JVM with compressed class pointers, 8 bytes with compact object headers) plus the 4-byte value, padded to 16 bytes — **plus** a 4–8 byte reference to point at it. An `int[1_000_000]` is ~4 MB of contiguous memory the CPU can stream through; a `List<Integer>` of the same size is ~20 MB scattered across the heap, with a pointer chase (and likely cache miss) per element. In hot paths that difference dominates: it is the reason `IntStream`, `LongStream`, `mapToInt` and primitive-specialized functional interfaces (`IntPredicate`, `ToIntFunction`) exist.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'avoiding accidental boxing in hot code',
              code: `// BAD: Long sum is unboxed and re-boxed on every iteration -- millions of garbage objects
Long sum = 0L;
for (long i = 0; i < 10_000_000; i++) {
    sum += i;              // sum = Long.valueOf(sum.longValue() + i)
}

// GOOD: primitive accumulator
long total = 0;
for (long i = 0; i < 10_000_000; i++) total += i;

// GOOD: primitive streams avoid Stream<Integer>
int sumOfSquares = IntStream.rangeClosed(1, 1_000).map(n -> n * n).sum();

// Ternary trap: mixing Integer and int unboxes -- NPE if the Integer is null
Integer cached = null;
int value = flag ? cached : 0;   // NullPointerException when flag is true`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Project **Valhalla** is working on *value classes* — objects without identity that the JVM may flatten into arrays and fields like primitives, aiming to close the boxing gap ("codes like a class, works like an int"). As of JDK 27 it is not part of a GA release; treat it as future direction, not something to design around today.',
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
            '`this(...)` calls another constructor in the same class (constructor chaining); `super(...)` calls the parent class\'s constructor. Historically it had to be the very first statement; since **JDK 25 (flexible constructor bodies, JEP 513)** you may run validation and compute arguments *before* it, as long as that code does not use `this`.',
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
              code: 'flowchart TD\n  New["new Circle(\'red\', 2.0)"] --> SuperCall["1. super(color) runs FIRST<br/>Shape must be initialized before Circle"]\n  SuperCall --> ShapeFields["2. Shape\'s field initializers run"]\n  ShapeFields --> ShapeBody["3. Shape constructor body runs"]\n  ShapeBody --> CircleFields["4. Circle\'s field initializers run"]\n  CircleFields --> CircleBody["5. Circle constructor body runs<br/>this.radius = radius"]\n  CircleBody --> Ready["object is now fully<br/>and safely constructed"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Prefer constructing objects in a fully valid state and marking fields `final` wherever the value never needs to change after construction — this rules out an entire class of bugs where an object is used before it is fully initialized, and pairs naturally with immutability (see the Records topic for a modern, terser way to express this).',
            },
            {
              type: 'code',
              language: 'java',
              title: 'flexible constructor bodies (JDK 25+): validate before super()',
              code: `public class PositiveBigInteger extends BigInteger {

    public PositiveBigInteger(long value) {
        // Before JDK 25 this was illegal -- you had to call super() first and
        // validate afterwards (wasting work), or hide checks in a static helper.
        if (value <= 0) {
            throw new IllegalArgumentException("must be positive: " + value);
        }
        super(Long.toString(value));   // "prologue" above may not touch 'this'
    }
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never call an overridable method from a constructor, and never let `this` escape (registering it as a listener, starting a thread with it, publishing it to a static field). The superclass constructor runs **before** subclass fields are initialized, so an overridden method invoked from it sees `null`/`0` subclass fields; and an escaped `this` can be observed by another thread half-built. `javac -Xlint:this-escape` (JDK 21+) warns about exactly this.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When a constructor grows beyond three or four parameters, or many are optional, use a static factory (`Duration.ofSeconds(5)`) or a builder instead of telescoping overloads. Static factories can have descriptive names, cache instances, and return a subtype — `List.of(...)` returns different hidden implementations depending on size.',
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
            {
              type: 'heading',
              text: 'How dynamic dispatch actually works',
            },
            {
              type: 'p',
              text: 'A call like `s.area()` compiles to an `invokevirtual` (or `invokeinterface`) bytecode. Conceptually the JVM looks up `area` in the receiver\'s class via a per-class **virtual method table** (vtable). In practice HotSpot rarely pays even that: it profiles each call site, and if only one or two receiver classes are ever seen (monomorphic/bimorphic), the JIT inlines the target directly behind a cheap type check. Call sites that see many types (megamorphic) fall back to a table lookup and block inlining — one reason deep, heavily-polymorphic hierarchies on hot paths can be measurably slower than a `switch` over a sealed type.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'composition over inheritance: the fragile base class problem',
              code: `// Inheritance couples you to the parent's IMPLEMENTATION, not just its API.
class CountingSet<E> extends HashSet<E> {
    int added = 0;
    @Override public boolean add(E e) { added++; return super.add(e); }
    @Override public boolean addAll(Collection<? extends E> c) {
        added += c.size();
        return super.addAll(c);   // HashSet.addAll calls add() internally...
    }
}
// new CountingSet<>().addAll(List.of("a", "b")) -> added == 4, not 2!

// Composition: wrap and forward -- immune to the parent's internal call graph
final class CountingSet2<E> {
    private final Set<E> delegate = new HashSet<>();
    private int added = 0;
    boolean add(E e) { added++; return delegate.add(e); }
    boolean addAll(Collection<? extends E> c) { added += c.size(); return delegate.addAll(c); }
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Design rule from *Effective Java*: "design and document for inheritance or else prohibit it." Make classes `final` by default; open them up deliberately (or use `sealed` to allow a known set of subclasses). Use inheritance for genuine is-a relationships inside code you control; use composition plus interfaces everywhere else.',
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
              code: 'flowchart TD\n  A["interface A { default String hi() ... }"] --> C["class C implements A, B"]\n  B["interface B { default String hi() ... }"] --> C\n  C --> Conflict{"both A and B supply<br/>a default hi() -- ambiguous!"}\n  Conflict --> ErrorState["compiler ERROR:<br/>C must override hi() itself"]\n  ErrorState --> FixState["fix: @Override String hi()<br/>call A.super.hi() or B.super.hi()<br/>to pick one explicitly"]',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Default methods were added in Java 8 primarily for **API evolution** — so `Collection` could gain `stream()` and `forEach()` without breaking every existing implementation in the world. They are not a license to build stateful "traits": an interface still cannot hold instance state, and a default method that calls other abstract methods quietly becomes part of every implementor\'s contract. Class methods also always win over interface defaults ("class wins" rule), so a superclass method with the same signature silently takes precedence.',
            },
            {
              type: 'table',
              headers: ['Need', 'Reach for', 'Why'],
              rows: [
                ['A capability many unrelated types share', '`interface`', 'Multiple implementation, no hierarchy coupling'],
                ['Shared state + template method skeleton', '`abstract class`', 'Fields, constructors, protected hooks'],
                ['A closed set of variants you switch over', '`sealed interface` + records', 'Compiler-checked exhaustiveness'],
                ['A single behavior passed as a value', '`@FunctionalInterface`', 'Lambdas and method references'],
              ],
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
        // pattern matching for instanceof (Java 16+): test + cast + bind in one step
        return o instanceof Point p && x == p.x && y == p.y;
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
              code: 'flowchart TD\n  A["override equals() only"] --> B{"put object in<br/>HashMap / HashSet?"}\n  B -- yes --> C["hashCode() still uses<br/>Object identity (default)"]\n  C --> D["equal objects land in<br/>DIFFERENT hash buckets"]\n  D --> E["contains() / get() with an<br/>equal-but-different instance<br/>returns false / null -- BUG"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Modern IDEs and `record` types (see the Records topic) generate a correct `equals`/`hashCode`/`toString` triple automatically — for a hand-written mutable class, always generate or override all three together, never just one, and never base `hashCode()` on mutable fields that change after the object is placed in a hash-based collection.',
            },
            {
              type: 'heading',
              text: 'The full `equals` contract, and the `instanceof` vs `getClass()` debate',
            },
            {
              type: 'list',
              items: [
                '**Reflexive**: `x.equals(x)` is true. **Symmetric**: `x.equals(y)` iff `y.equals(x)`. **Transitive**: `x = y` and `y = z` implies `x = z`. **Consistent**: repeated calls give the same answer if nothing changed. **Non-null**: `x.equals(null)` is false.',
                'Using `instanceof` lets a subclass instance equal a superclass instance. If the subclass adds a field that participates in equality (`ColorPoint extends Point`), symmetry breaks: `point.equals(colorPoint)` is true but `colorPoint.equals(point)` is false. There is no way to extend an instantiable class, add a value component, and keep the contract.',
                'Using `getClass() != o.getClass()` keeps symmetry but breaks substitutability — a Hibernate proxy subclass of `User` will never equal the real `User`.',
                'The clean resolution: make value classes `final` (records are), and prefer composition over subclassing value types.',
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'the mutable-key bug in action',
              code: `class MutableKey {
    String name;
    MutableKey(String n) { name = n; }
    @Override public boolean equals(Object o) { return o instanceof MutableKey k && name.equals(k.name); }
    @Override public int hashCode() { return name.hashCode(); }
}

Set<MutableKey> set = new HashSet<>();
MutableKey key = new MutableKey("a");
set.add(key);
key.name = "b";               // hash changes AFTER insertion
set.contains(key);            // false -- looked up in the bucket for "b", entry lives under "a"
set.size();                   // 1 -- the entry is now unreachable via lookup: a silent leak`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'JPA/Hibernate entities are the hardest case: the database id is null before persist and assigned after, so an id-based `hashCode` changes mid-life. Common, defensible choices: equality on an immutable natural/business key, or id-based `equals` with a constant `hashCode()` (e.g. `getClass().hashCode()`) — slower in large hash sets, but correct across the entity lifecycle.',
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
              code: 'flowchart LR\n  Compile["compile time:<br/>List&lt;String&gt;, List&lt;Integer&gt;<br/>fully type-checked"] -->|"type erasure"| Runtime["runtime (.class bytecode):<br/>both are just List<br/>(raw type, T erased to Object)"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Because of erasure, `list instanceof List<String>` will not compile — the JVM has no way to check the erased type parameter at runtime. Only the raw type check `list instanceof List<?>` (or plain `List`) is legal.',
            },
            {
              type: 'heading',
              text: 'Why erasure? And how to work around it',
            },
            {
              type: 'p',
              text: 'Generics arrived in Java 5 (2004) into an ecosystem with a decade of compiled, non-generic code. Erasure was chosen for **migration compatibility**: a generic `List<String>` compiles to the same `List` bytecode as pre-generics code, so old and new libraries interoperate without recompilation. The compiler inserts the casts you used to write by hand (`(String) list.get(0)`), and generates **bridge methods** so overriding still works after erasure. C#, by contrast, reified generics at the cost of a hard break between old and new collections.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'type tokens, heap pollution and @SafeVarargs',
              code: `// Workaround 1: pass a Class<T> "type token" when you need T at runtime
static <T> T fromJson(String json, Class<T> type) { /* ... */ return null; }
User u = fromJson(payload, User.class);

// Workaround 2: "super type token" -- capture a full generic type via an anonymous
// subclass, because generic SUPERCLASS info IS kept in the class file
// (Jackson's TypeReference, Guava's TypeToken, Spring's ParameterizedTypeReference)
List<User> users = mapper.readValue(payload, new TypeReference<List<User>>() {});

// Heap pollution: raw types defeat the compiler's guarantees
List<String> strings = new ArrayList<>();
List raw = strings;           // raw type -- unchecked warning
raw.add(42);                  // compiles!
String s = strings.get(0);    // ClassCastException far away from the actual bug

// Generic varargs create a T[] under the hood -> unchecked warning.
// @SafeVarargs promises you never store into or leak that array.
@SafeVarargs
static <T> List<T> listOf(T... items) { return List.of(items); }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Treat every "unchecked" compiler warning as a potential `ClassCastException` waiting to happen in a different file. Never use raw types in new code; if you must suppress a warning, put `@SuppressWarnings("unchecked")` on the smallest possible scope (a single local variable declaration) with a comment proving why it is safe.',
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
              code: 'flowchart TD\n  T["Throwable"] --> Err["Error<br/>(OutOfMemoryError, StackOverflowError)<br/>not meant to be caught"]\n  T --> Exc["Exception"]\n  Exc --> RTE["RuntimeException (UNCHECKED)<br/>NullPointerException<br/>IllegalArgumentException<br/>IndexOutOfBoundsException"]\n  Exc --> Checked["checked exceptions<br/>IOException<br/>SQLException<br/>(must catch or declare throws)"]',
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
            {
              type: 'heading',
              text: 'Production-grade exception handling',
            },
            {
              type: 'list',
              items: [
                '**Helpful NullPointerExceptions** (default since JDK 15): the message now names the exact null expression — `Cannot invoke "String.length()" because "user.address.street" is null` — so don\'t catch-and-rethrow NPEs with less information.',
                '**Suppressed exceptions**: when try-with-resources closes a resource and `close()` also throws, that exception is attached via `addSuppressed` to the primary one. Always log with the full throwable (`log.error("msg", e)`) so suppressed and cause chains appear.',
                '**Cost**: creating an exception fills in the stack trace by walking the stack — relatively expensive. Using exceptions for normal control flow in hot loops is a real performance bug. For high-frequency, expected failures, return a result type instead.',
                '**Catch `Exception`, not `Throwable`** at boundaries. Catching `Error` (`OutOfMemoryError`, `StackOverflowError`) and continuing usually leaves the JVM in an undefined state; let it die and restart.',
                '**`InterruptedException`**: never swallow it. Either propagate it, or restore the flag with `Thread.currentThread().interrupt()` so code higher up can still see the cancellation request.',
                '**Lambdas and checked exceptions** don\'t mix: `java.util.function` interfaces declare no `throws`. Wrap in `UncheckedIOException` (built for exactly this) or handle inside the lambda.',
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'checked exceptions inside streams, and multi-catch',
              code: `List<String> contents = paths.stream()
    .map(p -> {
        try {
            return Files.readString(p);
        } catch (IOException e) {
            throw new UncheckedIOException(e);   // designed for exactly this case
        }
    })
    .toList();

// multi-catch (Java 7+): one handler for unrelated exception types
try {
    process();
} catch (TimeoutException | ConnectException e) {
    retryLater(e);
}

// restore interruption status instead of swallowing it
try {
    queue.take();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    throw new CancellationException("worker interrupted");
}`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A `return` (or a throw) inside `finally` silently discards any exception thrown in the `try` block. The compiler permits it, and the original failure vanishes without a trace. Keep `finally` blocks to cleanup only — or better, use try-with-resources.',
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
            {
              type: 'heading',
              text: 'Inside `HashMap`',
            },
            {
              type: 'list',
              items: [
                'Backing store: an array of buckets ("table") whose length is always a power of two. Index = `(hash ^ (hash >>> 16)) & (n - 1)` — the XOR spreads high bits into the low bits that the mask actually uses, defending against poor `hashCode()` implementations.',
                'Collisions chain in a linked list per bucket. Since Java 8, when one bucket exceeds 8 entries (and the table has at least 64 buckets) it is **treeified** into a red-black tree, so a pathological or attacker-chosen set of colliding keys degrades to O(log n) instead of O(n).',
                'When size exceeds `capacity × loadFactor` (default 0.75) the table doubles and every entry is redistributed — an O(n) pause. If you know the size up front, presize: `HashMap.newHashMap(expectedSize)` (JDK 19+) does the load-factor math for you.',
                'Iteration is **fail-fast**: structurally modifying the map while iterating (other than through the iterator) throws `ConcurrentModificationException` on a best-effort basis. It is a bug detector, not a thread-safety mechanism.',
              ],
            },
            {
              type: 'heading',
              text: 'Sequenced collections and immutable factories',
            },
            {
              type: 'code',
              language: 'java',
              title: 'Java 21 SequencedCollection / SequencedMap, and List.of',
              code: `// Java 21 finally gave "ordered" collections a common interface
List<String> list = new ArrayList<>(List.of("a", "b", "c"));
list.getFirst();        // "a"   (was list.get(0))
list.getLast();         // "c"   (was list.get(list.size() - 1))
list.reversed();        // a reversed VIEW, not a copy

LinkedHashMap<String, Integer> scores = new LinkedHashMap<>();
scores.put("ann", 3);
scores.putFirst("bob", 5);              // move/insert at the front
scores.firstEntry();                    // bob=5
scores.pollLastEntry();                 // removes and returns ann=3

// Unmodifiable factories (Java 9+): compact, null-hostile, truly immutable
List<String> fixed = List.of("x", "y");
Map<String, Integer> m = Map.of("one", 1, "two", 2);
// fixed.add("z");      -> UnsupportedOperationException
// List.of("a", null);  -> NullPointerException
// Map.of iteration order is deliberately randomized per JVM run

// Copy vs view: unmodifiableList is a VIEW -- changes to the source show through
List<String> view = Collections.unmodifiableList(list);
List<String> snapshot = List.copyOf(list);   // real immutable copy`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`Arrays.asList(array)` returns a fixed-size list **backed by the array** — `set()` writes through to the array, `add()`/`remove()` throw `UnsupportedOperationException`. And `Collectors.toList()` makes no promise about mutability, whereas `Stream.toList()` (Java 16+) is guaranteed unmodifiable. Know which one you hold before you mutate it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Default to `ArrayList`, `HashMap`, `HashSet` and `ArrayDeque`. Benchmarks almost never favor `LinkedList`: its 24+ byte node per element and pointer chasing lose to `ArrayList`\'s contiguous memory even for many middle-insertion workloads, thanks to CPU caches and `System.arraycopy`.',
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
              code: 'flowchart LR\n  Enclosing["enclosing scope:<br/>int threshold = 10;"] -.->|"captured BY VALUE<br/>at creation time"| Lambda["lambda: n -> n > threshold"]\n  Lambda -->|"compiled to implement"| FI["functional interface<br/>Predicate&lt;Integer&gt;"]\n  FI --> Method["its one abstract method:<br/>boolean test(Integer n)"]',
            },
            {
              type: 'heading',
              text: 'How lambdas are compiled: `invokedynamic`, not anonymous classes',
            },
            {
              type: 'p',
              text: 'An anonymous class produces a separate `Outer$1.class` file that must be loaded and verified. A lambda instead compiles its body into a private synthetic method on the enclosing class and emits an `invokedynamic` instruction. The first time that instruction runs, a bootstrap method (`LambdaMetafactory`) spins up an implementation class at runtime and links the call site; afterwards it is as cheap as a normal call. A **non-capturing** lambda is typically a cached singleton (no allocation per evaluation); a **capturing** lambda allocates a small object holding the captured values — usually eliminated by escape analysis when inlined.',
            },
            {
              type: 'table',
              headers: ['Interface', 'Signature', 'Typical use'],
              rows: [
                ['`Function<T,R>`', '`R apply(T t)`', 'transform a value'],
                ['`BiFunction<T,U,R>`', '`R apply(T t, U u)`', 'combine two values'],
                ['`Predicate<T>`', '`boolean test(T t)`', 'filter / condition'],
                ['`Supplier<T>`', '`T get()`', 'lazy creation, defaults'],
                ['`Consumer<T>`', '`void accept(T t)`', 'side effect per element'],
                ['`UnaryOperator<T>`', '`T apply(T t)`', 'same-type transform'],
                ['`IntFunction`, `ToIntFunction`, `IntPredicate`, ...', 'primitive-specialized', 'avoid boxing in hot paths'],
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'this inside a lambda, composition, and unnamed parameters',
              code: `class Widget {
    String name = "widget";
    Runnable lambda = () -> System.out.println(this.name);   // 'this' = enclosing Widget
    Runnable anon = new Runnable() {
        public void run() { System.out.println(this); }       // 'this' = the anonymous Runnable
    };
}

// functional composition
Predicate<String> nonBlank = Predicate.not(String::isBlank);
Function<String, String> normalize = ((Function<String, String>) String::trim).andThen(String::toLowerCase);
Comparator<User> byAgeThenName = Comparator.comparingInt(User::age).thenComparing(User::name);

// unnamed variables (Java 22+): say "I deliberately ignore this"
map.forEach((_, value) -> process(value));`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The old comparator idiom `(a, b) -> a - b` (also used in the first example above for string lengths) overflows for large or negative `int`s and silently sorts wrongly — e.g. `Integer.MIN_VALUE - 1` wraps to a large positive number. Use `Integer.compare(a, b)` or `Comparator.comparingInt(...)` instead.',
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
              code: 'flowchart LR\n  Source["source: List&lt;Order&gt;"] -->|".stream()"| S0["Stream"]\n  S0 -->|".filter(o -> o.isPaid())<br/>(intermediate, LAZY)"| S1["Stream"]\n  S1 -->|".map(Order::total)<br/>(intermediate, LAZY)"| S2["Stream"]\n  S2 -->|".collect(toList())<br/>(TERMINAL -- triggers execution)"| Result["List&lt;Double&gt;"]',
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
    .toList();                             // Java 16+: unmodifiable, shorter than collect(toList())

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
            {
              type: 'heading',
              text: 'How a pipeline executes: vertical, not horizontal',
            },
            {
              type: 'p',
              text: 'A stream does not run `filter` over the whole list, then `map` over the result. Each element travels **through the entire pipeline** before the next one starts — `filter(e1) → map(e1) → sink`, then `filter(e2) → map(e2) → sink`. No intermediate collections are built. The exceptions are **stateful** operations: `sorted()` must see every element before emitting the first, and `distinct()` must remember everything seen so far — both are barriers that buffer, cost memory, and defeat short-circuiting upstream of them.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'collectors worth knowing, and Stream Gatherers (Java 24+)',
              code: `// counting per group, with a sorted result map
Map<String, Long> ordersPerCustomer = orders.stream()
    .collect(Collectors.groupingBy(Order::customerId, TreeMap::new, Collectors.counting()));

// toMap: ALWAYS give a merge function if keys can collide -> otherwise IllegalStateException
Map<String, Order> latestByCustomer = orders.stream()
    .collect(Collectors.toMap(Order::customerId, o -> o,
        (a, b) -> a.placedAt().isAfter(b.placedAt()) ? a : b));

// partition into two buckets in one pass
Map<Boolean, List<Order>> paidVsUnpaid = orders.stream()
    .collect(Collectors.partitioningBy(Order::isPaid));

// teeing: two collectors over the same stream, then combine (Java 12+)
double avg = orders.stream().collect(Collectors.teeing(
    Collectors.summingDouble(Order::total),
    Collectors.counting(),
    (sum, n) -> n == 0 ? 0 : sum / n));

// Gatherers: custom INTERMEDIATE operations (final in Java 24)
List<List<Integer>> windows = Stream.of(1, 2, 3, 4, 5)
    .gather(Gatherers.windowSliding(3))     // [[1,2,3],[2,3,4],[3,4,5]]
    .toList();

List<Integer> runningTotals = Stream.of(1, 2, 3, 4)
    .gather(Gatherers.scan(() -> 0, Integer::sum))   // [1, 3, 6, 10]
    .toList();

// bounded-concurrency mapping on virtual threads, order preserved
List<Price> prices = skus.stream()
    .gather(Gatherers.mapConcurrent(16, sku -> pricingClient.fetch(sku)))
    .toList();`,
            },
            {
              type: 'heading',
              text: 'Parallel streams: when they help and when they hurt',
            },
            {
              type: 'table',
              headers: ['Factor', 'Good for parallel', 'Bad for parallel'],
              rows: [
                ['Source', '`ArrayList`, arrays, `IntStream.range` (split cheaply)', '`LinkedList`, `Stream.iterate`, I/O-backed sources'],
                ['Work per element', 'CPU-heavy, tens of microseconds+', 'trivial arithmetic on small data'],
                ['Operations', 'stateless `map`/`filter`, associative `reduce`', '`sorted`, `limit` on ordered streams, `findFirst`'],
                ['Side effects', 'none', 'writing to shared collections, blocking I/O'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'All parallel streams in a JVM share the **common `ForkJoinPool`** (default parallelism = CPU count − 1). One request doing blocking I/O inside `parallelStream()` can starve every other parallel stream — and `CompletableFuture.supplyAsync` without an executor — in the whole application. In server code, parallel streams are rarely the right tool; measure with JMH before and after.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`peek()` exists for debugging, not logic: since Java 9 the runtime may skip executing the pipeline entirely when it can compute the result otherwise (e.g. `count()` on a sized source), so side effects in `peek` or `map` may never run.',
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
              code: 'flowchart LR\n  Find["findById(\'u42\')"] --> Opt{"Optional&lt;User&gt;"}\n  Opt -->|"present"| Map1[".map(User::name)"]\n  Map1 --> Map2[".map(String::toUpperCase)"]\n  Map2 --> Merge(("join"))\n  Opt -->|"empty -- skips<br/>the map steps entirely"| Merge\n  Merge --> OrElse[".orElse(\'UNKNOWN USER\')"]',
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
            {
              type: 'code',
              language: 'java',
              title: 'orElse vs orElseGet, flatMap, and stream()',
              code: `// orElse evaluates its argument EAGERLY -- even when a value is present
User u1 = findById(id).orElse(createGuestUser());        // createGuestUser() ALWAYS runs
User u2 = findById(id).orElseGet(this::createGuestUser); // runs only when empty

// flatMap when the mapping function itself returns an Optional
Optional<String> city = findById(id)
    .flatMap(User::address)          // Optional<Address> address()
    .map(Address::city);

// Optional.stream() (Java 9+): drop empties from a stream of lookups
List<User> found = ids.stream()
    .map(this::findById)
    .flatMap(Optional::stream)
    .toList();

// primitive specializations avoid boxing
OptionalInt maxAge = users.stream().mapToInt(User::age).max();`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '`Optional` only documents nullness at return sites. For whole-codebase null-safety, teams increasingly adopt **JSpecify** annotations (`@NullMarked`, `@Nullable`) checked at build time by tools such as NullAway or IDE inspections — JUnit 6 and recent Spring versions annotate their APIs with JSpecify. Language-level null-restricted types are being explored in the OpenJDK Valhalla project but are not in a GA release.',
            },
          ],
        },
        {
          id: 'records-and-sealed-classes',
          title: 'Records & Sealed Classes — Modern Data Modeling',
          summary:
            'Records (previewed in Java 14–15, final in Java 16) eliminate the boilerplate of an immutable data-holding class, and sealed classes/interfaces (Java 17 standard) let you declare a closed, exhaustively-checkable set of permitted subtypes — together they make Java\'s data modeling look far more like a modern algebraic-data-type language.',
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
            {
              type: 'heading',
              text: 'Record pitfalls a senior reviewer catches',
            },
            {
              type: 'list',
              items: [
                '**Shallow immutability**: `record Team(List<String> members)` stores whatever list you pass. If the caller keeps a reference and mutates it, your "immutable" record changes. Defensively copy in the compact constructor: `members = List.copyOf(members);`.',
                '**Arrays break equality**: a record with an `int[]` component uses array *identity* in `equals`/`hashCode`, so two records with equal contents are not equal. Prefer `List<Integer>` or override both methods.',
                '**JPA entities**: records cannot be JPA entities (no no-arg constructor, final fields, no proxies). They are excellent for DTOs, projections, query results, events, and value objects inside entities (as embeddables, depending on provider support).',
                '**Serialization**: records serialize via their canonical constructor, so validation runs on deserialization too — safer than classic Java serialization, which bypasses constructors. Jackson supports records natively.',
                'Records can implement interfaces, declare static fields and methods, nested types, and additional constructors (which must delegate to the canonical one) — but not extra instance fields.',
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'defensive copying and "wither" methods',
              code: `public record Team(String name, List<String> members) {
    public Team {
        Objects.requireNonNull(name, "name");
        members = List.copyOf(members);   // reassigning the PARAMETER before the implicit field assignment
    }

    // records have no setters -- return a modified copy instead
    public Team withMember(String m) {
        var copy = new ArrayList<>(members);
        copy.add(m);
        return new Team(name, copy);
    }
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Sealing is enforced by both the compiler **and** the JVM (the `PermittedSubclasses` class-file attribute), so it cannot be bypassed by compiling a rogue subclass separately. Permitted subclasses must live in the same module (or the same package, in the unnamed module). Use `non-sealed` to reopen one branch of a hierarchy deliberately for extension.',
            },
          ],
        },
        {
          id: 'pattern-matching',
          title: 'Pattern Matching: `instanceof`, `switch` & Record Patterns',
          summary:
            'Since Java 21, `switch` can match on types and deconstruct records, with guards and compiler-checked exhaustiveness over sealed hierarchies. Combined with records and sealed types this enables data-oriented programming — modeling data as closed sets of immutable variants and writing operations over them as total functions.',
          keyPoints: [
            '**Type patterns** for `instanceof` (final in Java 16): `if (obj instanceof String s && !s.isBlank())` tests, casts and binds in one step; the binding is in scope only where the match is definitely true (flow scoping).',
            '**Pattern matching for `switch`** (final in Java 21): `case Circle c ->`, `case null ->`, guarded patterns with `when`, and exhaustiveness checking for sealed types and enums.',
            '**Record patterns** (final in Java 21) deconstruct a record into its components, and nest: `case Line(Point(var x1, var y1), Point p2) ->`.',
            '**Unnamed patterns and variables** (final in Java 22): `_` for components you do not care about — `case Order(_, var total) ->`.',
            '**Primitive types in patterns** (`case int i when i > 0`, `instanceof byte b`) are still in preview as of JDK 27 — don\'t use them in production code yet.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'a sealed domain model and a total function over it',
              code: `sealed interface PaymentResult permits Approved, Declined, Pending {}
record Approved(String txId, BigDecimal amount) implements PaymentResult {}
record Declined(String reason, int code) implements PaymentResult {}
record Pending(Duration retryAfter) implements PaymentResult {}

String describe(PaymentResult r) {
    return switch (r) {
        case Approved(var txId, var amount) when amount.signum() == 0 -> "zero-amount auth " + txId;
        case Approved(var txId, _)        -> "approved " + txId;
        case Declined(_, int code) when code >= 500 -> "processor error, retry";
        case Declined(var reason, _)      -> "declined: " + reason;
        case Pending(var wait)            -> "retry in " + wait.toSeconds() + "s";
        // no default: adding a new PaymentResult subtype makes this a COMPILE error
    };
}`,
            },
            {
              type: 'heading',
              text: 'Rules that trip people up',
            },
            {
              type: 'list',
              items: [
                '**Dominance**: cases are tested top to bottom, and the compiler rejects a case that can never match because an earlier one covers it (`case CharSequence cs` before `case String s` is an error). Put specific and guarded cases first.',
                '**Null**: a classic `switch` throws `NullPointerException` on a null selector. With patterns you can add `case null ->` (or `case null, default ->`); without it, the NPE behavior is preserved.',
                '**Exhaustiveness** is checked for switch *expressions* and for pattern switch *statements*. If a sealed hierarchy gains a subtype at runtime that the compiled code did not know about (separate compilation), the JVM throws `MatchException` rather than falling through silently.',
                '**Avoid `default` on sealed switches**: it compiles today, but it silences the compiler when someone adds a new variant — exactly the safety net you wanted.',
                'Guards (`when`) do not count toward exhaustiveness: `case Declined d when d.code() > 500` still needs an unguarded `Declined` case somewhere.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  Sel["switch (result)"] --> N{"null?"}\n  N -->|"yes, case null present"| CN["case null branch"]\n  N -->|"yes, no case null"| NPE["NullPointerException"]\n  N -->|"no"| C1{"matches case 1<br/>type + guard?"}\n  C1 -->|"yes"| B1["run case 1"]\n  C1 -->|"no"| C2{"matches case 2?"}\n  C2 -->|"yes"| B2["run case 2"]\n  C2 -->|"no ... all cases fail"| ME["MatchException<br/>(only if a new subtype<br/>appeared after compilation)"]',
            },
            {
              type: 'heading',
              text: 'Pattern matching vs polymorphism (the expression problem)',
            },
            {
              type: 'table',
              headers: ['', 'Virtual method on each subclass', 'Sealed type + pattern switch'],
              rows: [
                ['Adding a new **operation**', 'Touch every subclass', 'Write one new function'],
                ['Adding a new **variant**', 'Write one new class', 'Compiler flags every switch to update'],
                ['Best when', 'Variants open-ended, operations stable (plugins, frameworks)', 'Variants closed, operations grow (ASTs, protocol messages, results, events)'],
                ['Logic lives', 'With the data', 'In the operation, separate from data'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Data-oriented programming in Java, in four rules: model data immutably with records, model alternatives with sealed interfaces, make illegal states unrepresentable (validate in compact constructors), and write behavior as exhaustive switches. It is a complement to OOP, not a replacement: keep polymorphism for open extension points.',
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
            'A single `+` expression is optimized by the compiler — since Java 9 (JEP 280) `javac` emits an `invokedynamic` to `StringConcatFactory`, which sizes the result once (before Java 9 it was a `StringBuilder` chain). The O(n²) trap is specifically about concatenation *across loop iterations*, not a single expression.',
            'Since Java 9, **compact strings** store Latin-1-only text as one byte per character instead of two (UTF-16), roughly halving memory for typical ASCII-heavy workloads — transparent to your code.',
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
              code: 'flowchart TB\n  S1["String s1 = \'abc\'"] --> Pool[("String Constant Pool")]\n  S2["String s2 = \'abc\'"] --> Pool\n  S3["String s3 = new String(\'abc\')"] --> Heap[("regular Heap<br/>(separate object)")]\n  Pool -.->|"s1 == s2 -> true<br/>same pooled object"| EqTrue["=="]\n  Heap -.->|"s1 == s3 -> false<br/>different objects,<br/>same content"| EqFalse["=="]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Always compare `String`s with `.equals()`, never `==` — literal interning makes `==` appear to "work" for string literals specifically, and that habit then silently breaks for any string built at runtime (from user input, concatenation, `new String(...)`, etc.).',
            },
            {
              type: 'heading',
              text: 'Modern string features and internals',
            },
            {
              type: 'code',
              language: 'java',
              title: 'text blocks, formatted, and useful modern String methods',
              code: `// Text blocks (Java 15+): multi-line literals, incidental indentation stripped
String query = """
    SELECT id, name
    FROM users
    WHERE status = ?
    """;

String json = """
    {"name": "%s", "age": %d}
    """.formatted(name, age);

"  hi  ".strip();            // Unicode-aware trim (Java 11+); trim() only strips <= U+0020
"".isBlank();                // true (Java 11+)
"a\\nb\\nc".lines().count();   // 3 (Java 11+)
"ab".repeat(3);              // "ababab" (Java 11+)
String.join(", ", names);    // simple joining without a StringBuilder`,
            },
            {
              type: 'list',
              items: [
                '**Why immutable?** Security (a validated file path or class name cannot be changed after the check), safe sharing across threads, hash-code caching, and making the string pool possible at all.',
                '**The pool lives on the heap** (since Java 7, not PermGen), so interned strings are garbage-collected when unreachable. Calling `intern()` on high-cardinality runtime data still bloats the pool\'s hash table — prefer your own deduplicating map if you must canonicalize.',
                '**G1 string deduplication** (`-XX:+UseStringDeduplication`, also supported by other collectors in recent JDKs) makes duplicate `String` objects share one backing array during GC — a cheap win for apps holding many duplicate strings (parsed CSV/JSON).',
                '**`substring` copies** since Java 7u6. Older JVMs shared the parent\'s char array, which caused memory leaks when a tiny substring kept a huge string alive.',
                '**String Templates** (`STR."Hello \\{name}"`) previewed in JDK 21–22 and were **withdrawn** in JDK 23 — don\'t use them; `formatted()` / `String.format` and text blocks are the current tools.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never hold passwords or secrets in a `String` if you can avoid it: it is immutable (you cannot wipe it), may be interned, and lingers in heap dumps until GC. Security APIs use `char[]` (e.g. `PBEKeySpec`, `Console.readPassword`) so you can zero it after use. Also beware `toLowerCase()`/`toUpperCase()` without a `Locale` — in the Turkish locale `"TITLE".toLowerCase()` produces a dotless ı; use `Locale.ROOT` for protocol/identifier strings.',
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
              code: 'flowchart TB\n  subgraph JVM["JVM Memory"]\n    subgraph Heap["Heap (shared across threads)"]\n      Young["Young Generation<br/>(Eden + Survivor spaces)<br/>new, short-lived objects"]\n      Old["Old Generation<br/>(Tenured)<br/>long-lived, survived GCs"]\n    end\n    subgraph Stacks["Per-thread Stacks"]\n      S1["Thread 1 stack<br/>frame: main()<br/>frame: process()<br/> locals + refs"]\n      S2["Thread 2 stack<br/>(independent frames)"]\n    end\n    Meta["Metaspace (native memory)<br/>class metadata, method bytecode"]\n  end\n  S1 -.->|"object references point into"| Heap\n  S2 -.->|"object references point into"| Heap',
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
            {
              type: 'heading',
              text: 'The heap is not the whole process: native memory',
            },
            {
              type: 'table',
              headers: ['Region', 'Holds', 'Sized by', 'Typical failure'],
              rows: [
                ['Java heap', 'objects and arrays', '`-Xms` / `-Xmx`, or `-XX:MaxRAMPercentage`', '`OutOfMemoryError: Java heap space`'],
                ['Metaspace', 'class metadata', '`-XX:MaxMetaspaceSize` (unbounded by default)', '`OutOfMemoryError: Metaspace` (classloader leaks)'],
                ['Thread stacks', 'frames of platform threads', '`-Xss` (commonly 1 MB reserved per thread on 64-bit Linux)', '`StackOverflowError`, or OOM "unable to create native thread"'],
                ['Code cache', 'JIT-compiled machine code', '`-XX:ReservedCodeCacheSize`', 'JIT stops compiling, sudden slowdown'],
                ['Direct buffers', '`ByteBuffer.allocateDirect`, Netty, NIO', '`-XX:MaxDirectMemorySize`', '`OutOfMemoryError: Direct buffer memory`'],
                ['GC & JVM internals', 'card tables, remembered sets, symbol tables', 'collector-dependent', 'container OOM-kill with a "healthy" heap'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'In Kubernetes, a container memory limit applies to the **whole process**, not just the heap. Setting `-Xmx` equal to the container limit guarantees eventual OOM-kills (exit code 137) with no Java stack trace. The JVM is container-aware (since JDK 10, backported to 8u191) and by default caps the heap at **25% of the container limit** — usually too conservative for a dedicated service. A common starting point is `-XX:MaxRAMPercentage=70` to `75`, then verify with Native Memory Tracking (`-XX:NativeMemoryTracking=summary` + `jcmd <pid> VM.native_memory summary`).',
            },
            {
              type: 'heading',
              text: 'Object layout, compressed pointers and allocation',
            },
            {
              type: 'list',
              items: [
                '**Object header**: a mark word (identity hash, lock state, GC age) plus a class pointer. Traditionally 12 bytes on 64-bit HotSpot with compressed class pointers; **compact object headers** shrink it to 8 bytes (experimental in JDK 24, a product option `-XX:+UseCompactObjectHeaders` in JDK 25, and on by default in JDK 27). For workloads full of small objects that can cut heap usage by double-digit percentages.',
                '**Compressed oops**: below roughly 32 GB of heap, references are stored as 32-bit offsets instead of 64-bit pointers. Crossing that threshold makes every reference twice as big — a 31 GB heap can hold more live data than a 33 GB one.',
                '**TLABs** (thread-local allocation buffers): each thread bump-allocates in its own chunk of Eden, so `new` is usually just a pointer increment — no lock, often cheaper than `malloc`.',
                '**Escape analysis**: if the JIT proves an object never escapes a method (or an inlined call chain), it can **scalar-replace** it — store its fields in registers and never allocate it on the heap at all. "Objects always live on the heap" is the language model; the optimized machine code may never create them.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'inspecting memory of a running JVM',
              code: `jcmd <pid> GC.heap_info                 # heap regions and usage
jcmd <pid> VM.native_memory summary     # needs -XX:NativeMemoryTracking=summary at startup
jcmd <pid> GC.class_histogram | head    # which classes dominate the heap right now
jcmd <pid> GC.heap_dump /tmp/heap.hprof # full dump -> analyze in Eclipse MAT / VisualVM

# start-up flags worth having in production
java -XX:MaxRAMPercentage=75 \\
     -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps \\
     -Xlog:gc*:file=/logs/gc.log:time,uptime:filecount=5,filesize=20m \\
     -jar app.jar`,
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
            '**G1 (Garbage First)** is the default collector — it divides the heap into regions and prioritizes collecting the ones with the most garbage first, aiming for a pause-time target (`-XX:MaxGCPauseMillis`, default 200 ms). Until JDK 26 the JVM silently picked Serial GC on small machines (under 2 CPUs or under ~1.8 GB RAM); **JDK 27 makes G1 the default in all environments** (JEP 523).',
            '**ZGC** and **Shenandoah** are concurrent, low-latency collectors that do almost all work (including compaction) while the application runs, keeping pauses typically under a millisecond regardless of heap size, at the cost of some throughput and extra CPU/memory headroom. Both are now **generational**: ZGC has been generational-only since JDK 24, and generational Shenandoah became a product feature in JDK 25.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  New["new Object()"] --> Eden["Eden space<br/>(Young Gen)"]\n  Eden -->|"survives a minor GC"| Survivor["Survivor space"]\n  Survivor -->|"survives several<br/>minor GCs"| Old["Old Generation<br/>(Tenured)"]\n  Eden -->|"most objects die here<br/>(unreachable, reclaimed)"| Reclaimed1["reclaimed"]\n  Survivor -->|"dies before promotion"| Reclaimed2["reclaimed"]\n  Old -->|"major/full GC<br/>(rare, expensive)"| Reclaimed3["reclaimed"]',
            },
            {
              type: 'table',
              headers: ['Collector', 'Flag', 'Best for', 'Trade-off'],
              rows: [
                ['Serial GC', '`-XX:+UseSerialGC`', 'Tiny heaps, CLI tools, 1-CPU containers', 'Stop-the-world, single-threaded — least overhead, pauses grow with heap'],
                ['Parallel GC', '`-XX:+UseParallelGC`', 'Batch jobs, throughput over latency', 'Stop-the-world but multi-threaded — best raw throughput, long pauses on big heaps'],
                ['G1 (default since Java 9)', '`-XX:+UseG1GC`', 'General-purpose services, heaps from ~1 GB to tens of GB', 'Region-based, mostly-concurrent marking, pause target; good balance'],
                ['ZGC (generational)', '`-XX:+UseZGC`', 'Latency-sensitive services, large heaps (to multi-TB)', 'Sub-ms pauses independent of heap size; needs CPU and heap headroom'],
                ['Shenandoah', '`-XX:+UseShenandoahGC`', 'Same niche as ZGC (not in every vendor build)', 'Concurrent compaction, sub-ms pauses; generational mode since JDK 25'],
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

// FIX 2 (usually best): a BOUNDED cache with size and time-based eviction,
// e.g. the Caffeine library
private static final Cache<String, Session> sessions = Caffeine.newBuilder()
    .maximumSize(100_000)
    .expireAfterAccess(Duration.ofMinutes(30))
    .build();

// CAUTION with WeakHashMap: entries vanish when the KEY OBJECT becomes
// unreachable. With String keys that are literals or interned, the key
// never becomes unreachable (leak persists); with freshly-built String keys
// the entry can disappear immediately. WeakHashMap fits identity-keyed
// metadata (e.g. extra data attached to objects you don't own), not caches.`,
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
            {
              type: 'heading',
              text: 'How a collector finds live objects',
            },
            {
              type: 'list',
              items: [
                '**Marking**: starting from GC roots (thread stacks, static fields, JNI handles), the collector traverses the object graph and marks everything reachable. Cost scales with **live** data, not with garbage — which is why a young collection over mostly-dead objects is cheap.',
                '**Copying/compacting**: survivors are evacuated to fresh regions, leaving whole regions empty to reuse. This eliminates fragmentation and is what makes bump-pointer allocation possible.',
                '**Write barriers and card tables / remembered sets**: to collect the young generation without scanning the whole old generation, the JVM tracks old-to-young pointers via a small piece of code run on every reference store. Concurrent collectors also use **load barriers** (ZGC) or similar to let the app run while objects move.',
                '**Safepoints**: stop-the-world phases need all threads paused at known points. Time-to-safepoint (a thread stuck in a long counted loop) can add latency that GC logs attribute to "pause" even though the collector itself was quick.',
              ],
            },
            {
              type: 'heading',
              text: 'Choosing and tuning, in order',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Start with defaults (G1) and a correctly sized heap — most "GC problems" are an undersized heap or an allocation-heavy hot path, not the wrong collector.',
                'Turn on GC logging (`-Xlog:gc*`) and measure pause percentiles and allocation rate under realistic load; JDK Flight Recorder shows *which code* allocates.',
                'If p99/p999 latency is dominated by GC pauses and you have CPU headroom, try generational ZGC (`-XX:+UseZGC`). If the job is pure batch throughput, try Parallel GC.',
                'Reduce allocation before tuning flags: avoid boxing, reuse buffers in hot loops, presize collections. Fewer allocated bytes per request beats any flag.',
                'Avoid cargo-cult flags copied from old blog posts (`-XX:+UseConcMarkSweepGC` — CMS was removed in JDK 14; `-XX:NewRatio` fiddling with G1 defeats its adaptive sizing).',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`System.gc()` is a hint that, on most collectors, triggers a full stop-the-world collection — and libraries sometimes call it (RMI historically did periodically). Never call it in application code; `-XX:+DisableExplicitGC` exists for a reason, though be aware it also affects code that uses it to reclaim direct buffers.',
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
            'The **Platform classloader** (which replaced the old Extension classloader and the `jre/lib/ext` mechanism in Java 9) loads certain platform-provided modules; the **Application (System) classloader** loads classes from the application classpath — your own compiled code and its declared dependencies.',
            'The **delegation model**: before a classloader loads a class itself, it asks its parent to try first — a request only "falls" to a lower classloader if every ancestor fails to find the class.',
            'This delegation is what prevents a malicious or accidental `java.lang.String` defined in application code from ever shadowing the real JDK one — the bootstrap loader always gets first chance and already has it loaded.',
            'A class is uniquely identified at runtime by **both** its fully-qualified name *and* the classloader that loaded it — the same class name loaded by two different classloaders is treated as two distinct, incompatible types, the root cause of many `ClassCastException`s in plugin/application-server environments.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  App["Application (System) ClassLoader<br/>loads YOUR code from the classpath"] -->|"delegates first"| Platform["Platform/Extension ClassLoader<br/>loads certain platform modules"]\n  Platform -->|"delegates first"| Boot["Bootstrap ClassLoader (native)<br/>loads java.lang.*, java.util.*, core JDK classes"]\n  Boot -.->|"class found? use it.<br/>not found? fall back down"| Platform\n  Platform -.->|"class found? use it.<br/>not found? fall back down"| App\n  App -.->|"only loads it itself<br/>if no ancestor found it"| Loaded["class loaded"]',
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
            {
              type: 'heading',
              text: 'Loading, linking, initialization',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  L["Loading<br/>find bytes, create Class object"] --> V["Verification<br/>bytecode is type-safe"]\n  V --> P["Preparation<br/>static fields get default values"]\n  P --> R["Resolution<br/>symbolic refs to real refs<br/>(often lazy)"]\n  R --> I["Initialization<br/>static initializers and<br/>static field assignments run"]',
            },
            {
              type: 'list',
              items: [
                '**Initialization** happens exactly once, on first active use (instance creation, static method call, non-constant static field access), and the JVM guarantees it is thread-safe — which is why the *initialization-on-demand holder* idiom is a correct lazy singleton with no explicit locking.',
                'An exception thrown in a static initializer surfaces as `ExceptionInInitializerError` the first time, and as `NoClassDefFoundError: Could not initialize class X` on every later attempt — a confusing production symptom whose root cause is in the *first* error in the log.',
                '`ClassNotFoundException` (checked) means a class requested by name at runtime (`Class.forName`, a classloader) was not found; `NoClassDefFoundError` means a class present at compile time is missing or failed to initialize at runtime — usually a classpath/dependency-version problem.',
                '**Classloader leaks**: a class is unloaded only when its classloader becomes unreachable. One lingering reference (a `ThreadLocal` on a pooled thread, a JDBC driver registered in `DriverManager`, a static cache in a parent loader) pins the whole loader and every class it loaded — the classic Metaspace leak on application-server redeploys.',
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'thread-safe lazy initialization courtesy of class initialization',
              code: `public final class Config {
    private Config() { /* expensive load */ }

    private static final class Holder {        // not initialized until first getInstance()
        static final Config INSTANCE = new Config();
    }

    public static Config getInstance() {
        return Holder.INSTANCE;                // JVM guarantees one, safely published, instance
    }
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The **Java Platform Module System** (Java 9) adds a layer above packages: a `module-info.java` declares what a module `requires` and which packages it `exports`. Its biggest practical effect is **strong encapsulation of JDK internals** (enforced by default since JDK 16/17): reflective access into non-exported packages fails unless explicitly opened with `--add-opens`. Many applications still run on the classpath (the "unnamed module") rather than fully modularizing, and that is fine — but tools like `jlink` (custom minimal runtimes) need modules.',
            },
          ],
        },
        {
          id: 'jit-compilation-and-startup',
          title: 'JIT Compilation, Warm-up & Startup (AOT Cache, Native Image)',
          summary:
            'HotSpot starts by interpreting bytecode, profiles it, and progressively compiles hot code with two JIT compilers. That design gives excellent peak performance but slow warm-up — and the modern answers (Project Leyden\'s AOT cache, CRaC, GraalVM Native Image) trade flexibility for startup in different ways.',
          keyPoints: [
            '**Tiered compilation**: code starts in the interpreter, gets compiled quickly by **C1** (client compiler) with profiling, and the hottest methods are recompiled by **C2** (server compiler) with aggressive, profile-guided optimizations.',
            'Key C2 optimizations: **inlining** (the mother of all optimizations — it enables the rest), escape analysis/scalar replacement, loop unrolling, intrinsics (hand-written machine code for things like `System.arraycopy`, `Math` and crypto), and lock elision.',
            'JIT code is **speculative**; when an assumption breaks (a new subclass loads, an "impossible" branch is taken), the JVM **deoptimizes** to the interpreter and recompiles later.',
            '**AOT cache** (Project Leyden, JDK 24+): a training run records loaded/linked classes (and since JDK 25 method profiles) into a cache file that later runs reuse — faster startup and warm-up with no change in program semantics.',
            '**GraalVM Native Image** compiles the whole app ahead of time into a standalone executable — millisecond startup and small footprint, but a closed-world assumption (reflection, proxies, resources must be declared) and typically lower peak throughput than a warmed-up C2.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  T0["Tier 0<br/>interpreter"] -->|"invocation and<br/>loop counters"| T3["Tier 3<br/>C1 + full profiling"]\n  T3 -->|"hot + profile ready"| T4["Tier 4<br/>C2 optimized code"]\n  T4 -->|"speculation failed"| D["deoptimize"]\n  D --> T0\n  T0 -.->|"trivial methods"| T1["Tier 1<br/>C1, no profiling"]',
            },
            {
              type: 'heading',
              text: 'Why your micro-benchmark is lying',
            },
            {
              type: 'p',
              text: 'Timing a loop with `System.nanoTime()` measures a mixture of interpreter, C1 and C2 code, plus whatever the JIT eliminated: if the result of a computation is never used, C2 can delete the computation entirely (dead-code elimination), and constant inputs can be folded at compile time. Use **JMH** (the OpenJDK micro-benchmark harness): it forks fresh JVMs, runs warm-up iterations, and provides `Blackhole` to defeat dead-code elimination.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'a minimal JMH benchmark',
              code: `@State(Scope.Benchmark)
@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Warmup(iterations = 5)
@Measurement(iterations = 5)
@Fork(2)
public class ConcatBenchmark {
    String a = "hello", b = "world";

    @Benchmark
    public String plus() {
        return a + " " + b;          // returning the value prevents dead-code elimination
    }

    @Benchmark
    public void builder(Blackhole bh) {
        bh.consume(new StringBuilder().append(a).append(' ').append(b).toString());
    }
}`,
            },
            {
              type: 'heading',
              text: 'Startup options compared',
            },
            {
              type: 'table',
              headers: ['Approach', 'Startup / warm-up', 'Peak throughput', 'Constraints'],
              rows: [
                ['Plain JVM (JIT)', 'Slowest; seconds for large frameworks', 'Best (profile-guided C2)', 'None'],
                ['AOT cache (JDK 24+), CDS', 'Noticeably faster startup; JDK 25 profiles also speed warm-up', 'Same as JIT', 'Training run; same JDK and classpath at runtime'],
                ['CRaC (checkpoint/restore)', 'Near-instant: restore a warmed-up process snapshot', 'Same as JIT, already warm', 'Linux, supporting JDK builds, app must handle checkpoint (sockets, secrets)'],
                ['GraalVM Native Image', 'Milliseconds, low RSS', 'Usually lower than C2; PGO narrows the gap', 'Closed world: reflection config, longer builds, no dynamic class loading'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating and using an AOT cache',
              code: `# JDK 25+: one-step training run that writes the cache on exit
java -XX:AOTCacheOutput=app.aot -jar app.jar     # exercise typical startup paths, then stop

# production runs reuse it (same JDK build, same jars)
java -XX:AOTCache=app.aot -jar app.jar

# JDK 24 needed two steps:
#   java -XX:AOTMode=record -XX:AOTConfiguration=app.aotconf -jar app.jar
#   java -XX:AOTMode=create -XX:AOTConfiguration=app.aotconf -XX:AOTCache=app.aot -jar app.jar`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Warm-up matters operationally: a freshly deployed instance running interpreted code can blow your latency SLO for its first minutes. Mitigations — synthetic warm-up traffic before the readiness probe passes, gradual traffic shifting, an AOT cache, and adequate CPU during startup (JIT compiler threads compete with your app; a 1-CPU container limit makes warm-up dramatically slower).',
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
              code: 'sequenceDiagram\n  participant T1 as Thread 1\n  participant T2 as Thread 2\n  T1->>T1: data = 42 (plain write)\n  T1->>T1: volatile write: ready = true\n  Note over T1,T2: happens-before edge\n  T2->>T2: volatile read: while(!ready)\n  T2->>T2: reads data -- GUARANTEED to see 42\n  Note right of T2: the volatile write/read pair makes<br/>EVERYTHING written before it visible too',
            },
            {
              type: 'heading',
              text: 'Why the JMM exists: reordering at every layer',
            },
            {
              type: 'p',
              text: 'Three layers may reorder or cache your memory operations: `javac` (rarely), the **JIT** (hoisting a field read out of a loop — exactly what makes the non-volatile `while (!ready)` loop spin forever), and the **CPU** (store buffers, out-of-order execution; ARM and other weakly-ordered architectures reorder far more than x86). The JMM is a contract: write *data-race-free* programs — every shared mutable access ordered by happens-before — and you get **sequential consistency**, as if all threads interleaved on one CPU. Write a data race and almost anything is permitted. Code that "works on my x86 laptop" can fail on ARM servers (AWS Graviton, Apple silicon) precisely because x86 hides many races.',
            },
            {
              type: 'heading',
              text: 'Safe publication and `final` fields',
            },
            {
              type: 'list',
              items: [
                '**Publishing** an object means making a reference to it visible to another thread. If the reference is written to a plain field with no happens-before edge, another thread may see the reference but **stale field values** inside the object (e.g. defaults of `0`/`null`) — a partially constructed object.',
                'Safe publication idioms: store the reference in a `volatile` field or an `AtomicReference`; in a field guarded by a lock; in a `final` field of a properly constructed object; via static initialization; or through a thread-safe collection (`ConcurrentHashMap`, `BlockingQueue`) — the concurrent collections document their happens-before guarantees.',
                '**`final` field semantics**: once a constructor completes (without `this` escaping), any thread that sees the object reference is guaranteed to see the correct values of its `final` fields, even if the reference itself was published racily. This is why immutable objects with all-`final` fields are thread-safe "for free".',
              ],
            },
            {
              type: 'code',
              language: 'java',
              title: 'double-checked locking: broken without volatile',
              code: `class Registry {
    private static volatile Registry instance;   // volatile is ESSENTIAL here

    static Registry get() {
        Registry local = instance;                // single volatile read on the fast path
        if (local == null) {
            synchronized (Registry.class) {
                local = instance;
                if (local == null) {
                    instance = local = new Registry();
                }
            }
        }
        return local;
    }
}
// Without volatile, "instance = new Registry()" can become visible to another
// thread BEFORE the constructor's writes -- that thread skips the lock and
// uses a half-built object. Prefer the holder idiom (see Class Loading) or an enum.`,
            },
            {
              type: 'table',
              headers: ['Tool', 'Visibility', 'Atomic compound ops', 'Blocks threads'],
              rows: [
                ['plain field', 'no guarantee', 'no', 'no'],
                ['`volatile`', 'yes', 'no (single read/write only)', 'no'],
                ['`AtomicInteger` / `AtomicReference`', 'yes', 'yes (CAS: `incrementAndGet`, `compareAndSet`, `updateAndGet`)', 'no (lock-free)'],
                ['`LongAdder`', 'yes (on `sum()`)', 'increments only', 'no — striped cells, scales under heavy contention'],
                ['`synchronized` / `Lock`', 'yes', 'yes (any code in the block)', 'yes'],
                ['`VarHandle`', 'per access mode', 'yes (CAS, getAndAdd)', 'no — low-level, for library authors'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For hot counters updated by many threads (metrics, request counts), `LongAdder` vastly outperforms `AtomicLong`: instead of every thread fighting over one cache line with CAS retries, it spreads increments across per-thread cells and sums them on read.',
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
              code: 'stateDiagram-v2\n  [*] --> New : new Thread(task)\n  New --> Runnable : start()\n  Runnable --> Running : scheduler assigns a CPU\n  Running --> Runnable : time slice ends / yield()\n  Running --> Blocked : waiting to enter a<br/>synchronized block\n  Blocked --> Runnable : lock acquired\n  Running --> Waiting : wait() / join() / park()\n  Waiting --> Runnable : notify() / notifyAll() / unpark()\n  Running --> Terminated : run() completes<br/>(normally or via exception)\n  Terminated --> [*]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting `finally { lock.unlock(); }` with an explicit `Lock` is a severe bug: if the critical section throws, the lock is never released and every other thread waiting on it blocks forever. `synchronized` doesn\'t have this failure mode — the intrinsic lock is always released automatically, even on an exception, which is one real advantage it has over explicit locks despite being less flexible.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The diagram above is conceptual. The actual `Thread.State` enum has six values: `NEW`, `RUNNABLE` (covers both "ready" and "running" — and also a thread blocked in native I/O!), `BLOCKED` (waiting for a monitor), `WAITING`, `TIMED_WAITING` (`sleep`, `wait(ms)`, `parkNanos`), and `TERMINATED`. These are what you see in thread dumps.',
            },
            {
              type: 'heading',
              text: 'Interruption: Java\'s cooperative cancellation',
            },
            {
              type: 'p',
              text: 'There is no safe way to forcibly kill a thread — `Thread.stop()` was deprecated for decades and since JDK 20 simply throws `UnsupportedOperationException`. Instead, `thread.interrupt()` sets a flag; blocking methods (`sleep`, `wait`, `join`, `BlockingQueue.take`, `Future.get`) respond by throwing `InterruptedException` and clearing the flag; CPU-bound loops must poll `Thread.currentThread().isInterrupted()` themselves. Executors use interruption for `shutdownNow()` and `Future.cancel(true)`, so code that swallows `InterruptedException` makes services impossible to shut down cleanly.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'modern thread creation, interruption, and condition waiting',
              code: `// Thread builders (Java 21+): named, configured threads in one expression
Thread worker = Thread.ofPlatform().name("indexer-", 0).daemon(true).start(this::indexLoop);
Thread light  = Thread.ofVirtual().name("req-handler").start(() -> handle(request));

void indexLoop() {
    while (!Thread.currentThread().isInterrupted()) {
        try {
            Doc d = queue.take();          // throws InterruptedException when interrupted
            index(d);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();   // preserve the flag, then exit the loop
            return;
        }
    }
}

// wait/notify: ALWAYS wait in a loop (spurious wakeups, and the condition may
// have changed again before you reacquire the lock)
synchronized void awaitReady() throws InterruptedException {
    while (!ready) {
        wait();
    }
}
synchronized void markReady() {
    ready = true;
    notifyAll();                           // prefer notifyAll unless you can prove notify is safe
}`,
            },
            {
              type: 'table',
              headers: ['', '`synchronized`', '`ReentrantLock`'],
              rows: [
                ['Release on exception', 'Automatic', 'Manual, in `finally`'],
                ['Try with timeout / interruptible acquire', 'No', '`tryLock(timeout)`, `lockInterruptibly()`'],
                ['Multiple wait conditions', 'One per monitor (`wait`/`notify`)', 'Many `Condition` objects'],
                ['Fairness', 'No', 'Optional (slower)'],
                ['Virtual threads', 'No longer pins since JDK 24', 'Never pinned'],
                ['Read/write split', 'No', '`ReentrantReadWriteLock`, or `StampedLock` for optimistic reads'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Lock on a **private final** object (`private final Object lock = new Object();`), not on `this` or a public object: anyone holding a reference to your instance can `synchronized` on it too and interfere with your locking. And never synchronize on boxed values or string literals — they are shared/cached across the whole JVM.',
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
              code: 'flowchart LR\n  Submit["submit tasks"] --> Queue["task queue"]\n  Queue --> W1["worker thread 1"]\n  Queue --> W2["worker thread 2"]\n  Queue --> W3["worker thread N"]\n  W1 --> Done1["Future/CompletableFuture<br/>completes"]\n  W2 --> Done2["completes"]\n  W3 --> Done3["completes"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Java 21 introduced **virtual threads** (Project Loom) — extremely lightweight threads managed by the JVM rather than mapped 1:1 to OS threads, letting you write simple blocking-style code (`Thread.sleep`, blocking I/O) at massive concurrency (hundreds of thousands of threads) without the memory/context-switch cost of platform threads. `Executors.newVirtualThreadPerTaskExecutor()` is the entry point — see the dedicated Virtual Threads topic.',
            },
            {
              type: 'heading',
              text: 'Configuring pools for production',
            },
            {
              type: 'code',
              language: 'java',
              title: 'a bounded ThreadPoolExecutor, and ExecutorService as AutoCloseable',
              code: `// The Executors.newFixedThreadPool / newCachedThreadPool factories hide dangerous defaults:
//  - fixed pool: UNBOUNDED LinkedBlockingQueue -> memory grows without limit under overload
//  - cached pool: UNBOUNDED thread count -> thousands of platform threads under a spike
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8, 8,                                        // core and max threads
    60, TimeUnit.SECONDS,                        // idle keep-alive (for threads above core)
    new ArrayBlockingQueue<>(1_000),             // BOUNDED queue = backpressure
    Thread.ofPlatform().name("pricing-", 0).factory(),
    new ThreadPoolExecutor.CallerRunsPolicy());  // when full, the caller runs the task (slows producers)

// Java 19+: ExecutorService is AutoCloseable; close() = shutdown + await termination
try (ExecutorService exec = Executors.newFixedThreadPool(4)) {
    exec.submit(this::jobA);
    exec.submit(this::jobB);
}   // blocks here until both jobs finish

// CompletableFuture: pass YOUR executor; never block the common pool with I/O
CompletableFuture<User> user = CompletableFuture
    .supplyAsync(() -> userClient.fetch(id), ioExecutor)
    .orTimeout(2, TimeUnit.SECONDS)                       // Java 9+
    .exceptionally(ex -> User.anonymous());

// wait for many, then gather results
List<CompletableFuture<Price>> futures = skus.stream()
    .map(s -> CompletableFuture.supplyAsync(() -> pricing.fetch(s), ioExecutor))
    .toList();
CompletableFuture.allOf(futures.toArray(CompletableFuture[]::new)).join();
List<Price> prices = futures.stream().map(CompletableFuture::join).toList();`,
            },
            {
              type: 'table',
              headers: ['Method', 'Function returns', 'Use when'],
              rows: [
                ['`thenApply`', 'a plain value `U`', 'synchronous transform (like `map`)'],
                ['`thenCompose`', 'a `CompletionStage<U>`', 'next step is itself async (like `flatMap`)'],
                ['`thenCombine`', 'combines two results', 'two independent futures both needed'],
                ['`handle` / `whenComplete`', 'sees value or exception', 'recover from or observe failures'],
                ['`...Async` variants', 'same, on another executor', 'callback is slow; avoid running it on the completing thread'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Exceptions inside a `CompletableFuture` chain are wrapped in `CompletionException` (from `join()`) or `ExecutionException` (from `get()`) — unwrap `getCause()` before checking types. And a future nobody joins or attaches a handler to fails **silently**: an exception in a fire-and-forget `runAsync` disappears without a log line. Likewise, `submit()` on an executor captures exceptions in the returned `Future`; if you never call `get()`, you never see them (`execute()` lets them reach the thread\'s uncaught exception handler).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Pool sizing heuristic: CPU-bound work wants roughly as many threads as cores; I/O-bound work on platform threads wants `cores × (1 + wait time / compute time)` — often hundreds, which is exactly where virtual threads are now the better answer. Whatever you choose, bound the queue and decide explicitly what happens when it is full.',
            },
          ],
        },
        {
          id: 'virtual-threads',
          title: 'Virtual Threads (Project Loom) in Depth',
          summary:
            'Virtual threads (final in Java 21) are cheap, JVM-scheduled threads that make the simple thread-per-request, blocking style scale to hundreds of thousands of concurrent tasks — they improve throughput for I/O-bound work, not the speed of CPU-bound code.',
          keyPoints: [
            'A virtual thread is a `java.lang.Thread` whose stack lives on the heap as a growable chunk; it is **mounted** onto a small pool of platform **carrier threads** (a `ForkJoinPool`, by default sized to the CPU count) while running and **unmounted** when it blocks.',
            'When a virtual thread blocks on I/O, `sleep`, a `BlockingQueue` or a `java.util.concurrent` lock, the JDK parks it and frees the carrier — so blocking code no longer wastes an OS thread.',
            'Creating one costs roughly a few hundred bytes to a few KB, versus ~1 MB of reserved stack and an OS thread for a platform thread: **never pool virtual threads** — create one per task.',
            '**Pinning**: a virtual thread that cannot unmount holds its carrier. Since **JDK 24 (JEP 491)** blocking inside `synchronized` no longer pins; remaining cases include blocking inside native/JNI frames and some class-initialization paths.',
            'Little\'s Law explains the win: concurrency = throughput × latency. With 100 ms of I/O per request, 10,000 requests/second needs 1,000 requests in flight — trivial with virtual threads, expensive with platform threads.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph VT["Virtual threads (millions possible)"]\n    V1["VT 1<br/>running"]\n    V2["VT 2<br/>blocked on socket<br/>(stack parked on heap)"]\n    V3["VT 3<br/>running"]\n    V4["VT 4<br/>runnable, waiting<br/>for a carrier"]\n  end\n  subgraph Carriers["Carrier threads (ForkJoinPool, about one per core)"]\n    C1["carrier 1"]\n    C2["carrier 2"]\n  end\n  V1 -->|"mounted"| C1\n  V3 -->|"mounted"| C2\n  C1 --> OS["OS threads / CPU cores"]\n  C2 --> OS',
            },
            {
              type: 'code',
              language: 'java',
              title: 'thread-per-task on virtual threads',
              code: `// 10,000 concurrent blocking calls -- on platform threads this would need
// 10,000 OS threads; here it needs about as many carriers as you have cores
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> results = IntStream.range(0, 10_000)
        .mapToObj(i -> executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));      // parks, frees the carrier
            return httpClient.send(requestFor(i), BodyHandlers.ofString()).body();
        }))
        .toList();
    for (Future<String> f : results) {
        process(f.get());
    }
}

// Spring Boot 3.2+: one property switches request handling to virtual threads
//   spring.threads.virtual.enabled=true`,
            },
            {
              type: 'heading',
              text: 'Limit the resource, not the threads',
            },
            {
              type: 'p',
              text: 'With platform threads, the pool size silently acted as a concurrency limit protecting downstream systems. With virtual threads, 50,000 requests can all reach your database at once — and exhaust its connection pool or crash it. Make limits explicit: a `Semaphore` around a scarce resource, a properly sized connection pool (requests then wait for a connection, which is cheap on a virtual thread), or rate limiters.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'bounding access to a downstream service',
              code: `private final Semaphore inventoryPermits = new Semaphore(50);   // at most 50 concurrent calls

Stock checkStock(String sku) throws InterruptedException {
    inventoryPermits.acquire();          // a waiting virtual thread costs almost nothing
    try {
        return inventoryClient.get(sku);
    } finally {
        inventoryPermits.release();
    }
}`,
            },
            {
              type: 'table',
              headers: ['Concern', 'Platform threads', 'Virtual threads'],
              rows: [
                ['Creation cost', 'High (OS thread, ~1 MB reserved stack)', 'Very low (heap-allocated stack chunks)'],
                ['Practical count', 'Thousands', 'Millions'],
                ['Pooling', 'Required', 'Anti-pattern — one per task'],
                ['Best for', 'CPU-bound work, long-lived background threads', 'I/O-bound, high-concurrency request handling'],
                ['`ThreadLocal`', 'Fine in pools (careful with leaks)', 'Works, but millions of copies can blow memory — prefer `ScopedValue`'],
                ['Scheduling', 'OS, preemptive', 'JVM, unmount on blocking; not time-sliced'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Virtual threads do **not** make CPU-bound code faster — there are still only as many carriers as cores, and a virtual thread doing a long computation keeps its carrier busy (they are not preempted on a time slice). Use a platform-thread pool sized to the core count for heavy computation, and keep virtual threads for waiting.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Diagnosing pinning and stalls: JDK Flight Recorder emits a `jdk.VirtualThreadPinned` event when a virtual thread blocks while pinned, and `jcmd <pid> Thread.dump_to_file -format=json dump.json` produces a thread dump that includes virtual threads (classic `jstack` output does not show them all). Also audit libraries that cache expensive objects in `ThreadLocal`s assuming a small, fixed pool of threads.',
            },
          ],
        },
        {
          id: 'structured-concurrency-scoped-values',
          title: 'Structured Concurrency & Scoped Values',
          summary:
            'Structured concurrency treats a group of concurrent subtasks as one unit of work with a clear lifetime — if one fails, the others are cancelled, and none outlives its parent. Scoped values are the immutable, bounded-lifetime replacement for `ThreadLocal` that fits this model. Scoped values are final in Java 25; structured concurrency is still a preview API as of JDK 27.',
          keyPoints: [
            '**Unstructured** concurrency (`ExecutorService.submit`, `CompletableFuture`) lets tasks outlive the code that started them: if one subtask fails, siblings keep running and leak; cancellation and error propagation are manual.',
            '**`StructuredTaskScope`** (preview: JDK 21 onward, reworked in JDK 25, seventh preview in JDK 27) forks subtasks — each on its own virtual thread by default — and joins them in the same block; the scope cannot be exited while children are still running.',
            'A **Joiner** policy decides the outcome: e.g. all must succeed (fail fast and cancel the rest), or the first success wins (cancel the losers). Thread dumps show the parent/child task tree.',
            '**`ScopedValue`** (final in Java 25, JEP 506) binds a value for the dynamic extent of a call: readable by everything called within it — including subtasks forked in a structured scope — immutable, and automatically unbound when the scope ends.',
            'Compared with `ThreadLocal`: no `set()`, no leaks from forgetting `remove()`, no expensive copying into child threads (`InheritableThreadLocal`), and cheaper lookups.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'java',
              title: 'structured fan-out (preview API, JDK 25+ shape)',
              code: `// requires --enable-preview; the API changed between previews, so check your JDK's Javadoc
Response handle(String userId) throws InterruptedException {
    try (var scope = StructuredTaskScope.open()) {        // default: all must succeed
        Subtask<User>        user   = scope.fork(() -> userService.find(userId));
        Subtask<List<Order>> orders = scope.fork(() -> orderService.recent(userId));

        scope.join();          // waits for both; if either throws, the other is CANCELLED
                               // and join() throws, with the failure as the cause
        return new Response(user.get(), orders.get());
    }                          // scope closed: no subtask can outlive this block
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  H["handle(userId)<br/>opens scope"] --> F1["fork: find user"]\n  H --> F2["fork: recent orders"]\n  F1 --> J{"join()"}\n  F2 --> J\n  J -->|"both succeed"| R["build Response"]\n  J -->|"one fails"| C["cancel the sibling<br/>(interrupt)"]\n  C --> E["join() throws<br/>scope closes cleanly"]',
            },
            {
              type: 'code',
              language: 'java',
              title: 'ScopedValue instead of ThreadLocal (final in Java 25)',
              code: `public final class RequestContext {
    public static final ScopedValue<Principal> PRINCIPAL = ScopedValue.newInstance();
}

// framework/edge code binds the value for the duration of the call
void serve(Request req) {
    Principal p = authenticate(req);
    ScopedValue.where(RequestContext.PRINCIPAL, p)
               .run(() -> controller.handle(req));    // bound only inside run()
}

// anywhere deeper in the call stack (or in forked structured subtasks)
void audit(String action) {
    Principal who = RequestContext.PRINCIPAL.get();   // throws NoSuchElementException if unbound
    log.info("{} performed {}", who.getName(), action);
}

// rebinding for a nested scope -- the outer value is restored afterwards
ScopedValue.where(RequestContext.PRINCIPAL, systemPrincipal).run(this::runAsSystem);`,
            },
            {
              type: 'table',
              headers: ['', '`ThreadLocal`', '`ScopedValue`'],
              rows: [
                ['Mutability', '`set()` anytime', 'Immutable within a binding; rebind in a nested scope'],
                ['Lifetime', 'Until `remove()` or thread death — leaks on pooled threads', 'Exactly the `run()`/`call()` extent'],
                ['Inheritance to children', '`InheritableThreadLocal` copies values', 'Shared automatically with structured subtasks, no copy'],
                ['Cost with millions of virtual threads', 'One map entry per thread', 'Designed for it'],
                ['Status', 'Since Java 1.2', 'Final in Java 25'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Because `StructuredTaskScope` is still a preview API (its shape changed significantly in JDK 25 and has continued to evolve), it requires `--enable-preview` and code written against one JDK may not compile on the next. Use it in experiments and internal tooling; for production today, `ExecutorService` with try-with-resources plus explicit cancellation, or a framework abstraction, is the stable choice.',
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
              code: 'sequenceDiagram\n  participant T1 as Thread 1\n  participant T2 as Thread 2\n  T1->>T1: acquires Lock A\n  T2->>T2: acquires Lock B\n  T1->>T2: waits for Lock B (held by T2)\n  T2->>T1: waits for Lock A (held by T1)\n  Note over T1,T2: DEADLOCK -- each waits forever<br/>for a lock the other already holds',
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
            'JUnit (Jupiter API, shared by JUnit 5 and JUnit 6; JUnit 6 is the current line and requires Java 17) is the standard testing framework for Java — a small set of annotations and assertion methods cover the vast majority of unit-testing needs, from a single assertion to a fully parameterized test matrix.',
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
              code: 'flowchart LR\n  BA["@BeforeAll<br/>(once, static)"] --> BE1["@BeforeEach"]\n  BE1 --> T1["@Test method 1"]\n  T1 --> AE1["@AfterEach"]\n  AE1 --> BE2["@BeforeEach"]\n  BE2 --> T2["@Test method 2"]\n  T2 --> AE2["@AfterEach"]\n  AE2 --> AA["@AfterAll<br/>(once, static)"]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Keep each test focused on one behavior and independent of test execution order — `@BeforeEach` resetting shared fixture state (rather than reusing mutated state across tests) is what makes tests reliable regardless of the order the runner happens to execute them in.',
            },
            {
              type: 'code',
              language: 'java',
              title: 'more Jupiter features worth knowing',
              code: `@Test
void groupedAssertionsReportAllFailures() {
    assertAll("user",
        () -> assertEquals("Ada", user.name()),
        () -> assertTrue(user.age() > 0),
        () -> assertNotNull(user.email()));
}

@Test
@Timeout(value = 2, unit = TimeUnit.SECONDS)
void finishesQuickly() { /* ... */ }

@Test
void usesTempFiles(@TempDir Path dir) throws IOException {
    Files.writeString(dir.resolve("a.txt"), "hello");   // deleted automatically afterwards
}

@ParameterizedTest
@MethodSource("invalidEmails")
void rejectsInvalidEmails(String email) {
    assertThrows(ValidationException.class, () -> Email.parse(email));
}
static Stream<String> invalidEmails() { return Stream.of("", "a@", "@b.com", "no-at-sign"); }

@RepeatedTest(3)
void repeated() { /* ... */ }`,
            },
            {
              type: 'list',
              items: [
                '**JUnit 6** (September 2025) raised the baseline to Java 17, unified the version numbers of Platform, Jupiter and Vintage, adopted JSpecify nullability annotations, and removed the JUnit 4 runner module — Jupiter test code written for JUnit 5 largely carries over unchanged.',
                '**Test naming and style**: describe behavior (`rejectsExpiredToken`), one reason to fail per test, Arrange-Act-Assert structure. Use AssertJ (`assertThat(list).containsExactly(...)`) for readable fluent assertions on collections and objects.',
                '**Test slices of the pyramid**: many fast unit tests, fewer integration tests with real infrastructure (Testcontainers), few end-to-end tests. Parallel test execution is available in Jupiter (`junit.jupiter.execution.parallel.enabled`) but only works if tests share no mutable state.',
              ],
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
            {
              type: 'code',
              language: 'java',
              title: 'argument captors, strict stubs and BDD style',
              code: `@Test
void sendsWelcomeEmailWithUserAddress() {
    ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);

    service.register(new User("ada@example.com"));

    verify(mailer).send(captor.capture());            // capture what was actually passed
    assertEquals("ada@example.com", captor.getValue().to());
    verifyNoMoreInteractions(mailer);
}

// BDD flavour
given(repository.findById("u1")).willReturn(Optional.of(user));
then(repository).should(times(1)).findById("u1");

// spy: real object, selectively stubbed -- use sparingly
List<String> spyList = spy(new ArrayList<>());
doReturn("stubbed").when(spyList).get(0);   // doReturn avoids calling the real get(0)`,
            },
            {
              type: 'list',
              items: [
                '`MockitoExtension` uses **strict stubs**: an unused stubbing fails the test (`UnnecessaryStubbingException`), which keeps tests honest.',
                'Mockito uses a bytecode agent (ByteBuddy) with the **inline mock maker** (default since Mockito 5) so final classes and methods can be mocked. Since JDK 21, loading agents dynamically prints a warning; configure Mockito as an explicit `-javaagent` in your build to avoid it and to be ready for future JDKs that restrict dynamic loading.',
                'You cannot mock `static` methods or constructors with plain `when`; `mockStatic` / `mockConstruction` exist but are a design smell — prefer injecting a collaborator.',
                'Prefer **fakes** (a real in-memory implementation) or **Testcontainers** (a real database in Docker) for repository-style dependencies — they catch SQL, mapping and transaction bugs that a mock never will. Mocks verify interactions; they do not verify that the dependency actually works.',
              ],
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
    <!-- version omitted: managed by the spring-boot-starter-parent / BOM -->
  </dependency>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>6.0.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>`,
            },
            {
              type: 'code',
              language: 'groovy',
              title: 'the equivalent in Gradle (Groovy DSL)',
              code: `dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.junit.jupiter:junit-jupiter:6.0.0'
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Validate["validate"] --> Compile["compile"]\n  Compile --> TestPhase["test"]\n  TestPhase --> Package["package<br/>(JAR / WAR)"]\n  Package --> Verify["verify"]\n  Verify --> Install["install<br/>(local repo)"]\n  Install --> Deploy["deploy<br/>(remote repo)"]',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Both tools resolve the same underlying problem — reproducible builds and consistent dependency versions across every developer machine and CI runner — which matters more than the syntax choice itself: without a build tool, "works on my machine" regularly means someone has a different, uncoordinated set of JARs on their manual classpath.',
            },
            {
              type: 'list',
              items: [
                '**Dependency scopes**: Maven `compile`/`provided`/`runtime`/`test`; Gradle `implementation` (not exposed to consumers), `api` (exposed, via `java-library`), `compileOnly`, `runtimeOnly`, `testImplementation`. Prefer `implementation` — it keeps your transitive surface small and speeds incremental builds.',
                '**Version conflicts**: both tools pick one version when two paths disagree (Maven: nearest-wins; Gradle: highest version). Use a BOM / platform (`dependencyManagement`, Gradle `platform(...)`) to align families such as Spring or Jackson, and inspect with `mvn dependency:tree` or `gradle dependencies`.',
                '**Wrappers**: commit `mvnw` / `gradlew` so every machine and CI runner uses the same tool version.',
                '**Maven 4** has been in release-candidate builds for a long time (it adds a new build/consumer POM split and build improvements); check the official release page for GA status before adopting it. Gradle supports the Kotlin DSL (`build.gradle.kts`) as the recommended default for new builds.',
                '**Reproducibility and supply chain**: pin versions, verify checksums/signatures where supported, run a dependency vulnerability scan (OWASP Dependency-Check, Dependabot/Renovate), and generate an SBOM (CycloneDX) in CI.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Compile with `--release` matching your target JDK (Maven `maven.compiler.release`, Gradle `java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }`). Gradle toolchains and Maven toolchains decouple the JDK that runs the build from the JDK you compile and test against.',
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
            {
              question: 'What are virtual threads, how are they scheduled, and when would you NOT use them?',
              answer:
                'A virtual thread (final in Java 21) is a `Thread` whose stack is stored on the heap and which is multiplexed onto a small pool of carrier platform threads by a `ForkJoinPool` scheduler. When it blocks in a JDK-aware operation (socket I/O, `sleep`, `BlockingQueue`, `java.util.concurrent` locks) it is unmounted and its carrier runs another virtual thread, so blocking costs almost nothing. That makes the simple thread-per-request style scale to very high concurrency for I/O-bound workloads (Little\'s Law: concurrency = throughput × latency). Do not use them for CPU-bound work (still limited by cores, no time-slice preemption), do not pool them (create one per task), and be careful about implicit concurrency limits that disappear: a fixed platform thread pool used to protect your database; now you need a `Semaphore` or connection pool bound. Pinning (a virtual thread holding its carrier while blocked) used to be a major issue with `synchronized`; since JDK 24 that case is fixed, though native frames can still pin. Also audit heavy `ThreadLocal` use, since millions of threads means millions of copies.',
            },
            {
              question: 'Compare `synchronized`, `ReentrantLock`, `volatile` and atomics. How do you choose?',
              answer:
                '`volatile` gives visibility and ordering for single reads/writes but no atomic read-modify-write. Atomics (`AtomicInteger`, `AtomicReference`, `LongAdder`) give lock-free atomic updates via compare-and-swap and are ideal for counters and single-variable state; `LongAdder` scales better under heavy write contention. `synchronized` gives mutual exclusion plus visibility, is released automatically, and since JDK 24 no longer pins virtual threads; it is the simplest correct choice for guarding multi-field invariants. `ReentrantLock` adds `tryLock` with timeout, interruptible acquisition, multiple `Condition`s and optional fairness, at the price of manual `finally { unlock(); }`. Choose the weakest tool that covers the invariant: confine data to one thread if possible, then immutability, then atomics for one variable, then `synchronized`, then `ReentrantLock`/`StampedLock` when you need its extra features. Invariants spanning several variables need a single lock, not several atomics.',
            },
            {
              question: 'How does `ConcurrentHashMap` achieve thread safety in modern Java, and what pitfalls remain?',
              answer:
                'Since Java 8 it no longer uses segments: it locks individual bins (synchronizing on the first node of a bucket) for writes, uses CAS to insert into empty bins, and performs reads without locking via `volatile` semantics; contended bins can be treeified like `HashMap`. Resizing is cooperative: multiple threads help transfer bins. Atomic compound operations (`computeIfAbsent`, `merge`, `compute`) run atomically per key, but the mapping function must be short, must not block and must not modify the map (it can deadlock or throw `IllegalStateException`) because it runs while the bin is locked. Pitfalls: `check-then-act` sequences made of separate calls (`if (!map.containsKey(k)) map.put(k, v)`) are still races — use `putIfAbsent`/`computeIfAbsent`; `size()` is an estimate under concurrent updates; iterators are weakly consistent; and it rejects null keys and values.',
            },
            {
              question: 'Explain how HashMap works internally, including resize and treeification.',
              answer:
                'It holds an array of buckets whose length is a power of two. The key\'s `hashCode()` is spread (`h ^ (h >>> 16)`) and masked with `length - 1` to pick a bucket. Collisions form a linked list; since Java 8, a bucket that grows past 8 nodes (with table capacity at least 64) is converted into a red-black tree, bounding worst-case lookup to O(log n) — a defense against hash-collision denial-of-service. When the entry count exceeds capacity × load factor (0.75 by default) the table doubles and entries are redistributed (an O(n) pause), so presizing (`HashMap.newHashMap(n)` in JDK 19+) avoids repeated resizes. Keys must be effectively immutable with consistent `equals`/`hashCode`, and the map is not thread-safe: concurrent writers can lose updates or corrupt structure, so use `ConcurrentHashMap` instead.',
            },
            {
              question: 'What changed about garbage collection defaults and options in recent Java versions?',
              answer:
                'G1 has been the default collector since Java 9, but the JVM used to fall back to Serial GC automatically on machines it judged "small" (fewer than 2 CPUs or under about 1.8 GB of memory), which hurt containers; JDK 27 makes G1 the default everywhere (JEP 523). CMS was removed in JDK 14. ZGC went generational (JDK 21 as an option) and is generational-only from JDK 24; generational Shenandoah became a product feature in JDK 25 (availability depends on the vendor build). G1 has had steady throughput work, for example reduced synchronization in JDK 26. Practical guidance: keep G1 unless measured p99 latency is dominated by GC pauses (then try generational ZGC) or the job is batch (then Parallel GC); size the heap properly in containers with `-XX:MaxRAMPercentage`; and turn on `-Xlog:gc*` before tuning anything.',
            },
            {
              question: 'Your Java service in Kubernetes is OOM-killed (exit 137) but heap usage looked fine. How do you investigate?',
              answer:
                'The container limit covers the entire process, not only the Java heap. Non-heap consumers include metaspace, thread stacks (thousands of platform threads at ~1 MB reserved each), the JIT code cache, direct/NIO buffers (Netty, gRPC), GC data structures, and native libraries or glibc arena fragmentation. I would enable Native Memory Tracking (`-XX:NativeMemoryTracking=summary`, then `jcmd <pid> VM.native_memory summary`) and compare against RSS, check thread counts, cap direct memory (`-XX:MaxDirectMemorySize`), and set `-XX:MaxRAMPercentage` to leave headroom (typically 70–75%, not 100%). Also examine whether the leak is a classloader leak (growing metaspace) or a growing native buffer pool. `-XX:+HeapDumpOnOutOfMemoryError` only helps for Java-heap OOMs; a kernel OOM-kill produces no dump, so monitor RSS and add alerts before the limit.',
            },
            {
              question: 'How would you diagnose a production Java service that is slow, spiking CPU, or hung?',
              answer:
                'Start from observation, not guesses. For CPU spikes, take 3 thread dumps a few seconds apart (`jcmd <pid> Thread.print`, or `Thread.dump_to_file -format=json` to include virtual threads) and look for hot or repeated stacks; use JDK Flight Recorder (`jcmd <pid> JFR.start duration=60s filename=rec.jfr`) for low-overhead profiling of CPU, allocation, lock contention and GC, then open it in JDK Mission Control. For a hang, thread dumps show `BLOCKED` threads and `jcmd` reports detected deadlocks with the lock cycle. For latency, correlate GC logs (pause times, allocation rate, humongous allocations in G1) with request latency; if the GC is healthy look at lock contention events and downstream calls. For memory growth, take a class histogram, then a heap dump analyzed in Eclipse MAT looking for dominator trees and GC-root paths. Reproduce with realistic load, change one variable at a time, and verify with JMH when micro-optimizing.',
            },
            {
              question: 'What is the JIT\'s role, and why does Java have a warm-up period?',
              answer:
                'HotSpot starts in the bytecode interpreter, counts invocations and loop back-edges, compiles warm methods with C1 (with profiling), then recompiles the hottest with C2 using the collected profile for aggressive optimizations like inlining, escape analysis, loop transformations and intrinsics. Because these optimizations are speculative they can be undone by deoptimization if assumptions break. Consequently a new JVM is slow initially, which affects autoscaling, serverless, and benchmark validity. Remedies: AOT cache (Project Leyden, JDK 24+, with method profiles added in JDK 25), Class Data Sharing, CRaC checkpoint/restore, warm-up traffic before declaring readiness, or GraalVM Native Image if you can accept closed-world constraints and lower peak throughput.',
            },
            {
              question: 'Explain pattern matching for `switch` with sealed types. Why is it preferable to a visitor or an `instanceof` chain?',
              answer:
                'A sealed interface declares its permitted subtypes (enforced by the compiler and the JVM), so a `switch` expression over it can be checked for exhaustiveness: omitting a case is a compile error and no `default` is needed. Record patterns deconstruct components in the case label (`case Circle(var r) ->`), `when` guards add conditions, and `case null` handles nulls explicitly. Compared with a visitor, there is no `accept` boilerplate and the operation lives in one function; compared with an `instanceof` chain, the compiler verifies completeness and flags dominated or unreachable cases. When a new variant is added, every switch without `default` fails to compile, which is exactly the safety you want. Trade-offs: it suits closed hierarchies with growing operations; for open extension points (plugins), virtual methods remain better. Separate compilation can still produce a `MatchException` at runtime if a subtype is added without recompiling the switch.',
            },
            {
              question: 'What does Java\'s memory model guarantee about safe publication and `final` fields?',
              answer:
                'Without a happens-before edge, a thread that obtains a reference to an object may see stale or default values for its fields, even though the reference itself arrived. Safe publication means establishing that edge: storing the reference in a `volatile` or atomic reference, under a common lock, in a static initializer, or through a concurrent collection or queue. `final` fields get a special guarantee: after the constructor finishes (provided `this` did not escape during construction), every thread that sees the reference also sees the final fields\' correct values, even if the reference was published through a data race. This is why immutable classes with all-final fields are inherently thread-safe, and why leaking `this` from a constructor (registering a listener, starting a thread) is dangerous. Double-checked locking needs a `volatile` field for exactly these reasons.',
            },
            {
              question: 'Why can\'t you rely on `hashCode()` of a mutable field-based key, and what are the options for JPA entities?',
              answer:
                'A hash container stores an entry in the bucket for the key\'s hash at insertion time. If a field participating in `hashCode` later changes, lookups compute a different bucket and the entry becomes unreachable though still present (a silent leak, and `contains` returns false). For plain value types, make them immutable (records are ideal). For JPA entities the generated id is null until persisted, so id-based hashing changes lifecycle mid-life. Options: use an immutable business/natural key, assign the id client-side (UUID/ULID) at construction so it never changes, or use id-based `equals` with a stable constant `hashCode` such as `getClass().hashCode()` (correct but degrades large hash sets). Also use `instanceof`-style comparisons that tolerate Hibernate proxies rather than `getClass()` comparisons.',
            },
            {
              question: 'Which Java versions matter for a modern project, and how do you plan upgrades?',
              answer:
                'Production should target an LTS release; as of October 2026 that is Java 25 (LTS releases are 8, 11, 17, 21, 25, then every two years), while JDK 27 is the newest feature release. Many frameworks (Spring Framework 6/Boot 3, JUnit 6) already require Java 17 or newer, so Java 8 holds back dependencies and security posture. Upgrade strategy: compile with `--release`, run `jdeps --jdk-internals` to find encapsulation breakers, upgrade build plugins and bytecode libraries (ASM, ByteBuddy, Lombok, Mockito) first, run the full test suite on the new JDK in CI, review startup flags removed or deprecated (e.g. CMS-era flags), watch new warnings (dynamic agent loading, reflective mutation of final fields in JDK 26), then canary-deploy while comparing GC logs and latency. Keep CI on the latest feature release too so breakages surface early, and avoid shipping preview features.',
            },
            {
              question: 'What is the difference between `Stream.toList()`, `Collectors.toList()` and `List.copyOf()`?',
              answer:
                '`Collectors.toList()` returns an unspecified, in practice mutable `ArrayList` with no guarantees, and permits nulls. `Stream.toList()` (Java 16+) returns an unmodifiable list that also allows nulls; it is shorter and signals intent. `List.copyOf(coll)` makes an unmodifiable snapshot, rejects null elements, and returns the same instance if the argument is already an immutable list. `Collections.unmodifiableList(list)` is not a copy but a read-only *view*: later changes to the backing list show through. Knowing which you hold prevents both accidental `UnsupportedOperationException` and accidental aliasing of a supposedly immutable collection exposed from a record or API.',
            },
          ],
        },
      ],
    },
  ],
}
