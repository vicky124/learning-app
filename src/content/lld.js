export const lldSection = {
  id: 'lld',
  label: 'LLD',
  icon: '🧩',
  groups: [
    {
      id: 'lld-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-lld',
          title: 'What LLD Actually Is',
          summary:
            'Low-Level Design is the bridge between "what the system should do" and "what code gets written" — interviewers use it to test object-oriented thinking under ambiguity, not pattern trivia.',
          keyPoints: [
            'LLD answers: what classes/modules exist, how do they relate, what are their contracts, and how are responsibilities distributed.',
            'The real signal being tested is whether you can take a fuzzy prompt and produce a class model that survives "what if we now need X" follow-ups.',
            'A strong answer also produces real, compiling, edge-case-aware code for at least one core piece — not just a diagram.',
            'HLD asks which services/DBs/queues exist and how they talk; LLD asks which classes/functions exist and how they call each other.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Low-Level Design answers: **what classes/modules exist, and what does each one own? What are the relationships between them** (composition, inheritance, association)? **What are the interfaces/contracts** between components? How do responsibilities get distributed so the system stays extensible without becoming a spaghetti of `if/else`?',
            },
            {
              type: 'p',
              text: 'Interviewers use LLD rounds to test **object-oriented thinking under ambiguity** — not whether you know the GoF pattern names by rote, but whether you can take a fuzzy prompt ("design a parking lot"), extract entities and behaviors, and produce a class model that survives a few "what if we now need X" follow-ups, and then write real, compiling, edge-case-aware code for at least one core piece of it.',
            },
            {
              type: 'table',
              headers: ['', 'HLD', 'LLD'],
              rows: [
                ['Question', 'Which services/DBs/queues exist, how do they talk?', 'Which classes/functions exist, how do they call each other?'],
                ['Output', 'Architecture diagram, API contracts, tech choices', 'Class diagrams, sequence diagrams, interfaces, DB schema (table/column level), working code'],
                ['Interview signal', 'System thinking, scaling, tradeoffs', 'OOP fundamentals, SOLID, patterns, extensibility, correctness, concurrency'],
                ['Typical duration', '45-60 min, diagram-heavy', '45-60 min, ~50% whiteboard design + ~50% live coding'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    A["System / Architecture\n(HLD)"] --> B["Service / Module\nboundary"] --> C["Class Diagram\n(LLD)"] --> D["Method Body\n(working code)"]`,
            },
            {
              type: 'p',
              text: 'LLD lives at the two rightmost stops on that zoom: the class diagram tells you the shape of the solution, the method body proves the shape actually works. An answer that only produces one of the two is an incomplete answer.',
            },
            {
              type: 'heading',
              text: 'How LLD rounds are actually graded',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Requirement gathering (10%)** — did you ask clarifying questions instead of assuming?',
                '**Entity/class identification (20%)** — right nouns become classes, right verbs become methods, no god classes.',
                '**Relationships & OOP correctness (20%)** — composition vs aggregation vs inheritance used correctly; SOLID respected.',
                '**Pattern application (15%)** — patterns used because they fit, not shoehorned in to show off.',
                '**Code quality (20%)** — compiles/runs mentally, handles edge cases (null, empty, concurrent access, capacity limits), uses appropriate data structures for the complexity budget.',
                '**Extensibility discussion (10%)** — you can answer "how would this change if we added X" without a redesign.',
                '**Communication (5%)** — you narrate tradeoffs as you go, not just at the end.',
              ],
            },
          ],
        },
        {
          id: 'oop-fundamentals',
          title: 'OOP Fundamentals: The Four Pillars, With Diagrams',
          summary:
            'Every later topic — SOLID, patterns, case studies — quietly assumes fluency in these four ideas; interviewers notice immediately when a candidate uses "abstraction" and "encapsulation" interchangeably.',
          keyPoints: [
            'Encapsulation hides internal **state** behind a controlled interface so invariants can never be violated from outside.',
            'Abstraction hides internal **complexity** behind a simple contract — the caller knows *what*, not *how*.',
            'Inheritance models "is-a" and lets a subtype reuse a supertype\'s shape; polymorphism lets different subtypes respond to the same call differently.',
            'Runtime (dynamic) polymorphism — the same method call resolving to different code depending on the actual object — is what makes Strategy, Observer, and virtually every GoF pattern work.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'These four pillars are usually taught as abstract definitions and then never revisited — but every design decision later in this guide is really just one of these four applied deliberately. Getting sloppy about the distinction between them, especially encapsulation vs. abstraction, is one of the fastest ways to sound junior in an interview even when your final design is fine.',
            },
            {
              type: 'heading',
              text: 'Encapsulation — hiding state',
            },
            {
              type: 'p',
              text: 'Encapsulation bundles data with the methods that operate on it, and restricts direct access to that data so an object\'s internal invariants can never be violated from the outside. A `BankAccount` with a public `balance` field is not encapsulated — any caller can set it to a negative number. A `BankAccount` that keeps `balance` private and only allows mutation through `deposit()`/`withdraw()` methods that validate the amount is encapsulated: the invariant "balance never goes negative" is enforced in exactly one place.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Encapsulation: the invariant lives with the data',
              code: `class BankAccount:
    def __init__(self, opening_balance: int):
        self._balance = opening_balance  # "private" by convention

    def withdraw(self, amount: int) -> None:
        if amount <= 0:
            raise ValueError("amount must be positive")
        if amount > self._balance:
            raise ValueError("insufficient funds")
        self._balance -= amount

    @property
    def balance(self) -> int:
        return self._balance  # read-only from outside`,
            },
            {
              type: 'heading',
              text: 'Abstraction — hiding complexity',
            },
            {
              type: 'p',
              text: 'Abstraction is about the **contract**, not the data: it lets a caller depend on *what* an object does without knowing *how*. `PaymentStrategy.pay(amount)` is an abstraction — the caller never sees the HTTP calls, retries, or signature verification happening inside `UpiPayment.pay()`. Encapsulation and abstraction are often confused because they usually appear together, but they solve different problems: encapsulation protects an object\'s **state**; abstraction simplifies an object\'s **interface**. A class can have one without the other — a class with all-public fields but a single well-named method is abstracted but not encapsulated, and vice versa.',
            },
            {
              type: 'heading',
              text: 'Inheritance & polymorphism',
            },
            {
              type: 'p',
              text: 'Inheritance lets a subclass reuse a superclass\'s fields/methods and models an "is-a" relationship (`Circle` is-a `Shape`). Polymorphism is the payoff: code written against the supertype (`Shape`) automatically works correctly for any subtype, and calling `shape.area()` runs *different* code depending on whether `shape` is actually a `Circle` or a `Rectangle` at runtime — this is **runtime/dynamic polymorphism**, resolved via a vtable/method-dispatch table, and it is the mechanism underneath nearly every design pattern in this guide.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Shape {
        <<abstract>>
        +area() float
        +perimeter() float
    }
    class Circle {
        -radius float
        +area() float
        +perimeter() float
    }
    class Rectangle {
        -width float
        -height float
        +area() float
        +perimeter() float
    }
    Shape <|-- Circle
    Shape <|-- Rectangle`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Runtime polymorphism — same call, different code',
              code: `shapes: list[Shape] = [Circle(radius=2), Rectangle(width=3, height=4)]
for s in shapes:
    # s.area() dispatches to Circle.area() or Rectangle.area()
    # depending on the *actual* object, not the declared type
    print(s.area())`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Compile-time (static) polymorphism — method **overloading**, same name with different parameter lists resolved at compile time — is the other kind, but it is far less relevant to LLD interviews (and Python doesn\'t support it natively at all). When an interviewer says "polymorphism" in an LLD context, they almost always mean runtime/dynamic polymorphism via inheritance or interface implementation.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Interview-favorite one-liner for the encapsulation-vs-abstraction question: **encapsulation hides data, abstraction hides complexity**. If you can only remember one distinction, remember that one.',
            },
          ],
        },
        {
          id: 'uml-class-diagram-literacy',
          title: 'Reading UML: Class & Sequence Diagram Notation',
          summary:
            'Every diagram later in this guide assumes you can read the difference between a hollow diamond and a filled one — this is the five-minute primer that makes the rest of the guide legible.',
          keyPoints: [
            'Six relationship types, each with its own line/arrowhead: association, aggregation, composition, inheritance, realization, dependency.',
            'Composition (filled diamond) means the part dies with the whole; aggregation (hollow diamond) means the part can outlive it.',
            'Multiplicities (1, 0..1, *, 1..*) on association ends state cardinality precisely — always draw them, interviewers notice when you skip them.',
            'Sequence diagrams show messages over time: a solid arrow is a call, a dashed arrow is a return, and a vertical bar is "this object is currently executing."',
          ],
          blocks: [
            {
              type: 'p',
              text: 'UML class diagrams are the whiteboard language of LLD interviews. The notation is small enough to memorize completely, and doing so pays off immediately: every diagram in this guide (and everything you\'ll draw live in an interview) is built from exactly these primitives.',
            },
            {
              type: 'table',
              headers: ['Relationship', 'Meaning', 'Notation', 'Example'],
              rows: [
                ['Association', '"Uses/knows about" — neither owns the other\'s lifecycle', 'plain line, optional arrowhead', '`Driver` drives `Car`'],
                ['Aggregation', '"Has-a", whole-part, but the part can exist independently', 'line with a **hollow** diamond at the whole', '`Department` has `Professor`s'],
                ['Composition', '"Has-a", strong ownership — the part dies when the whole is destroyed', 'line with a **filled** diamond at the whole', '`House` owns its `Room`s'],
                ['Inheritance', '"Is-a" — subtype extends supertype', 'line with a **hollow triangle** arrow at the parent', '`Circle` inherits `Shape`'],
                ['Realization', 'A class implements an interface\'s contract', '**dashed** line with a hollow triangle arrow', '`UpiPayment` implements `PaymentStrategy`'],
                ['Dependency', '"Uses temporarily" — e.g. a method parameter or local variable', 'dashed line with an open arrow', '`OrderService.checkout(logger: Logger)`'],
              ],
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class PaymentStrategy {
        <<interface>>
        +pay(amount) Receipt
    }
    class UpiPayment
    class OrderService {
        -PaymentStrategy strategy
        +checkout(cart) Receipt
    }
    class Cart {
        -List~Item~ items
    }
    class Item
    class Logger
    class Warehouse
    class Shelf

    PaymentStrategy <|.. UpiPayment : realization
    OrderService --> PaymentStrategy : association
    OrderService ..> Logger : dependency
    Cart "1" *-- "many" Item : composition
    Warehouse "1" o-- "many" Shelf : aggregation`,
            },
            {
              type: 'heading',
              text: 'Multiplicity, precisely',
            },
            {
              type: 'list',
              items: [
                '`1` — exactly one.',
                '`0..1` — zero or one (optional).',
                '`*` or `0..*` — zero or more.',
                '`1..*` — one or more (at least one required).',
                '`n..m` — a bounded range, e.g. `2..4`.',
              ],
            },
            {
              type: 'heading',
              text: 'Class box notation',
            },
            {
              type: 'list',
              items: [
                '`+` public, `-` private, `#` protected.',
                '`<<interface>>` / `<<abstract>>` stereotypes mark a class as non-instantiable.',
                'Underlined members are `static`/class-level (not per-instance).',
                '`~List~T~~` in Mermaid is how generic types like `List<T>` are written, since `<` `>` are reserved for arrows.',
              ],
            },
            {
              type: 'heading',
              text: 'Sequence diagrams: the other half',
            },
            {
              type: 'p',
              text: 'Where a class diagram shows static structure ("what exists"), a sequence diagram shows a single flow over time ("what happens, in order, for one request"). This is what the process topic below asks you to walk through *before* writing code — it is usually where a hidden design flaw first becomes visible.',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Client
    participant OrderService
    participant PaymentStrategy

    Client->>OrderService: checkout(cart)
    activate OrderService
    OrderService->>PaymentStrategy: pay(amount)
    activate PaymentStrategy
    PaymentStrategy-->>OrderService: Receipt
    deactivate PaymentStrategy
    OrderService-->>Client: Receipt
    deactivate OrderService`,
            },
            {
              type: 'list',
              items: [
                'A **solid arrow with a filled head** (`->>`) is a synchronous call.',
                'A **dashed arrow** (`-->>`) is a return value coming back.',
                'A vertical **activation bar** marks the span during which that object is actively executing/on the call stack.',
                '`alt`/`opt`/`loop` fragments (boxed regions) express branching and repetition — useful for showing a retry or a "seat already locked" branch without a second diagram.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In a live interview, always narrate multiplicities and relationship types out loud as you draw ("Group has-many Expense, composition, an expense doesn\'t make sense without its group") — this single habit signals fluency faster than almost anything else you can do on the whiteboard.',
            },
          ],
        },
        {
          id: 'interfaces-abstract-vs-composition',
          title: 'Interfaces vs Abstract Classes, and Composition over Inheritance',
          summary:
            'Two of the most-asked "explain the difference" LLD questions, and the design habit — favor composition — that resolves most inheritance-related design mistakes before they happen.',
          keyPoints: [
            'Interface = pure "can-do" contract, no state, a class can implement many; abstract class = "is-a" with shared state/partial implementation, a class can extend only one (in most languages).',
            'Rule of thumb: shared code + shared state across subtypes → abstract class; a capability unrelated classes can plug into → interface.',
            'Deep/rigid inheritance hierarchies break the moment a subtype doesn\'t *fully* satisfy the parent\'s contract (an LSP violation waiting to happen).',
            'Composition assembles behavior from small, independently swappable parts at runtime — Strategy is composition\'s canonical answer to "the algorithm needs to vary."',
          ],
          blocks: [
            {
              type: 'p',
              text: 'An abstract class can hold shared state and partial implementation (concrete methods plus abstract ones subclasses must fill in) — but a class can extend only one in almost every mainstream language. An interface defines a pure contract with no state of its own, and a class can implement as many interfaces as it needs. This single constraint (single inheritance vs. multiple implementation) is *the* deciding factor in practice.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Payable {
        <<interface>>
        +calculatePay() Money
    }
    class AbstractEmployee {
        <<abstract>>
        #String name
        #String employeeId
        +getDetails() String
        +calculatePay() Money*
    }
    class SalariedEmployee {
        -Money monthlySalary
        +calculatePay() Money
    }
    class ContractEmployee {
        -Money hourlyRate
        -int hoursWorked
        +calculatePay() Money
    }
    AbstractEmployee <|-- SalariedEmployee
    AbstractEmployee <|-- ContractEmployee
    Payable <|.. SalariedEmployee
    Payable <|.. ContractEmployee`,
            },
            {
              type: 'table',
              headers: ['', 'Interface', 'Abstract class'],
              rows: [
                ['Holds state?', 'No (contract only)', 'Yes — fields, shared logic'],
                ['A class can have how many?', 'Many (implements)', 'One (extends), in most languages'],
                ['Constructor?', 'No', 'Yes — can run shared init logic'],
                ['Use when...', 'Unrelated classes share a *capability* (`Comparable`, `PaymentStrategy`)', 'Related classes share meaningful *code/state* (`AbstractEmployee`)'],
              ],
            },
            {
              type: 'heading',
              text: 'Composition over inheritance',
            },
            {
              type: 'p',
              text: 'Inheritance is evaluated once, at compile time, and applies to the *entire* object. Composition assembles an object\'s behavior from smaller parts that can each be swapped independently, at runtime. The classic illustration: modeling ducks by inheritance forces every subclass to either implement `fly()` in a way that makes sense, or override it with something awkward (`RubberDuck.fly()` throwing an exception) — the "gorilla holding the banana" problem, where inheriting the one method you wanted drags in the whole hierarchy\'s assumptions with it.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Duck {
        -FlyBehavior flyBehavior
        -QuackBehavior quackBehavior
        +performFly()
        +performQuack()
    }
    class FlyBehavior {
        <<interface>>
        +fly()
    }
    class FlyWithWings
    class FlyNoWay
    class QuackBehavior {
        <<interface>>
        +quack()
    }
    class Quack
    class MuteQuack

    Duck o-- FlyBehavior
    Duck o-- QuackBehavior
    FlyBehavior <|.. FlyWithWings
    FlyBehavior <|.. FlyNoWay
    QuackBehavior <|.. Quack
    QuackBehavior <|.. MuteQuack`,
            },
            {
              type: 'p',
              text: 'Every `Duck` composes a `FlyBehavior` and a `QuackBehavior` instead of inheriting them — a `RubberDuck` is simply constructed with `FlyNoWay()` and `MuteQuack()`, no exception-throwing override required, and behavior can even be swapped at runtime (`duck.setFlyBehavior(FlyWithWings())` after finding a magic potion). This is literally the Strategy pattern, and it\'s why "favor composition over inheritance" and "program to an interface, not an implementation" are usually taught as the same principle.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'This is also exactly the shape of a classic Liskov Substitution violation: if `FlyingBird.fly()` is inherited by `Penguin`, either `Penguin` breaks the contract (throws, or does nothing) or every caller of `fly()` now has to special-case penguins. Composition sidesteps the problem entirely by not forcing the capability onto types that don\'t have it.',
            },
          ],
        },
        {
          id: 'solid-principles',
          title: 'SOLID — The Foundation Interviewers Actually Probe',
          summary:
            'Every SOLID violation an interviewer plants in a prompt has a name and a fix — recognizing the violation out loud is worth more than reciting the acronym.',
          keyPoints: [
            'SRP: a class should have one reason to change — split god classes by responsibility.',
            'OCP: extend via new classes (Strategy), don\'t modify a growing switch statement.',
            'LSP: a subtype must be safely substitutable for its base type — no surprising broken contracts.',
            'ISP: don\'t force clients to depend on methods they don\'t use — split fat interfaces.',
            'DIP: depend on abstractions, injected at construction, not concrete implementations instantiated inline.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**S — Single Responsibility Principle.** A class should have one reason to change. Classic violation: an `Order` class that also formats an invoice PDF and sends emails. Split into `Order`, `InvoiceFormatter`, `NotificationService`.',
                '**O — Open/Closed Principle.** Open for extension, closed for modification. Instead of a `switch` on `paymentType` inside `processPayment`, define a `PaymentStrategy` interface and add new payment types as new classes.',
                '**L — Liskov Substitution Principle.** Subtypes must be substitutable for their base type without breaking correctness. Classic violation: `Square extends Rectangle` overriding `setWidth`/`setHeight` in a way that breaks callers who assume independent width/height.',
                '**I — Interface Segregation Principle.** Don\'t force clients to depend on methods they don\'t use. A fat `Worker` interface with `work()` and `eat()` breaks `RobotWorker`. Split into `Workable` and `Eatable`.',
                '**D — Dependency Inversion Principle.** High-level modules shouldn\'t depend on low-level modules; both depend on abstractions. `OrderService` should depend on a `PaymentGateway` interface, not a concrete `StripeGateway`, and get the concrete instance injected.',
              ],
            },
            {
              type: 'heading',
              text: 'SRP: a concrete before / after',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class OrderGod {
        +calculateTotal()
        +validate()
        +persist()
        +formatInvoicePdf()
        +sendConfirmationEmail()
    }
    note for OrderGod "Violation: 5 unrelated\nreasons to change"`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Order {
        +calculateTotal() Money
    }
    class OrderValidator {
        +validate(order) bool
    }
    class OrderRepository {
        +save(order)
    }
    class InvoiceFormatter {
        +toPdf(order) bytes
    }
    class NotificationService {
        +sendConfirmation(order)
    }
    OrderValidator ..> Order
    OrderRepository ..> Order
    InvoiceFormatter ..> Order
    NotificationService ..> Order`,
            },
            {
              type: 'p',
              text: 'Each extracted class now changes for exactly one reason: a new tax rule touches `Order`, a new PDF layout touches `InvoiceFormatter`, a new DB touches `OrderRepository`. None of those changes ripple into the others.',
            },
            {
              type: 'heading',
              text: 'LSP: a concrete violation and fix',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Rectangle {
        -width float
        -height float
        +setWidth(w)
        +setHeight(h)
        +area() float
    }
    class Square {
        +setWidth(w)
        +setHeight(h)
    }
    Rectangle <|-- Square
    note for Square "Violation: setWidth() also\nforces height = w to stay\na square — breaks any caller\nthat sets width/height independently"`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Shape {
        <<interface>>
        +area() float
    }
    class Rectangle {
        -width float
        -height float
        +area() float
    }
    class Square {
        -side float
        +area() float
    }
    Shape <|.. Rectangle
    Shape <|.. Square`,
            },
            {
              type: 'p',
              text: 'The fix isn\'t "make `Square` smarter" — it\'s recognizing that `Square` was never really a behavioral subtype of `Rectangle` in the first place (a mutable rectangle is not substitutable for a mutable square and vice versa). Making both independently implement a shared `Shape` interface removes the false is-a relationship entirely.',
            },
            {
              type: 'heading',
              text: 'OCP, ISP & DIP together, in one payment example',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class PaymentStrategy {
        <<interface>>
        +pay(amount: Money) Receipt
    }
    class CreditCardPayment {
        +pay(amount: Money) Receipt
    }
    class UpiPayment {
        +pay(amount: Money) Receipt
    }
    class WalletPayment {
        +pay(amount: Money) Receipt
    }
    class OrderService {
        -PaymentStrategy strategy
        +checkout(order: Order) Receipt
    }
    PaymentStrategy <|.. CreditCardPayment
    PaymentStrategy <|.. UpiPayment
    PaymentStrategy <|.. WalletPayment
    OrderService --> PaymentStrategy : depends on abstraction`,
            },
            {
              type: 'p',
              text: 'This single diagram demonstrates O, L, I, and D simultaneously — which is exactly why "design a payment system with multiple payment methods" is such a common warm-up prompt.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'DIP done correctly via constructor injection',
              code: `class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: Money) -> Receipt: ...

class UpiPayment(PaymentStrategy):
    def __init__(self, vpa: str):
        self.vpa = vpa

    def pay(self, amount: Money) -> Receipt:
        # call UPI gateway SDK here
        return Receipt(transaction_id="upi_123", status="SUCCESS")

class OrderService:
    # depends on the abstraction, injected at construction — never
    # instantiates a concrete gateway itself. This is what makes
    # OrderService trivially unit-testable with a FakePaymentStrategy.
    def __init__(self, strategy: PaymentStrategy):
        self.strategy = strategy

    def checkout(self, amount: Money) -> Receipt:
        if amount.amount <= 0:
            raise ValueError("amount must be positive")
        return self.strategy.pay(amount)`,
            },
          ],
        },
        {
          id: 'lld-process',
          title: 'The Repeatable LLD Process',
          summary:
            'Use the same eleven-step process in every LLD interview — it is what turns a vague prompt into a class diagram, a sequence walkthrough, and working code, in that order.',
          keyPoints: [
            'Clarify scope and explicit out-of-scope items before designing anything.',
            'Nouns become candidate classes, verbs become candidate methods — then assign responsibilities via SRP.',
            'Walk through 2-3 core flows as sequence diagrams before writing code — this is where hidden design flaws surface.',
            'Write real code for the core 20% the interviewer asks for, narrating edge cases out loud.',
            'Close with extensibility, concurrency, and persistence discussion even if not explicitly asked.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    A[Clarify scope\n& actors] --> B[Nouns -> classes\nVerbs -> methods]
    B --> C[Relationships &\nresponsibilities]
    C --> D[Class diagram\nwith multiplicities]
    D --> E[Sequence walkthrough\nof 2-3 core flows]
    E --> F[Code the core\n20%, out loud]
    F --> G[Extensibility,\nconcurrency, persistence]`,
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Clarify scope** — list explicit requirements and explicitly out-of-scope items. ("Should this support multiple parking floors? Multiple vehicle types? Payment? Multiple attendants concurrently?")',
                '**Identify actors and use cases** — who interacts with the system, and how (a quick use-case list, not necessarily a formal UML diagram).',
                '**Identify nouns → candidate classes, verbs → candidate methods.**',
                '**Define relationships** — inheritance ("is-a"), composition ("owns, dies with parent"), aggregation ("has, survives independently"), association.',
                '**Assign responsibilities** — apply SRP; watch for god classes.',
                '**Draw the class diagram**, including multiplicities (1, 0..1, 1..*, *) — interviewers notice when you skip these.',
                '**Walk through 2-3 core flows as sequence diagrams** — this is where hidden design flaws surface (e.g., you realize `ParkingSpot` needs a way to notify `Floor` when it frees up).',
                '**Write real code for the core 20%** — usually the interviewer will ask you to implement one specific class/method fully (e.g., "now code the `allocateSpot` method"). Handle edge cases out loud: empty input, capacity exceeded, concurrent access, not-found.',
                '**Discuss extensibility** — "how would this change if we added X?" Show OCP in action.',
                '**Discuss concurrency/edge cases** if relevant (e.g., two users grabbing the last parking spot, double-booking the same seat).',
                '**Discuss persistence** briefly — which fields would be columns, what would need an index, would this entity be its own table or embedded (a natural bridge to a DB-schema follow-up).',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Run through this same eleven-step order for every LLD prompt you practice, even ones you already know cold — the process itself, narrated out loud, is a large part of what is being graded, independent of the specific design you land on.',
            },
          ],
        },
        {
          id: 'creational-patterns',
          title: 'Creational Patterns: Factory, Abstract Factory, Builder, Singleton',
          summary:
            'Group patterns by intent, not by the GoF catalog — interviewers care that you reach for the right one, not that you can recite all 23.',
          keyPoints: [
            'Factory Method — signal: the exact subclass to create depends on a runtime value.',
            'Abstract Factory — signal: families of related objects that must stay consistent with each other.',
            'Builder — signal: a constructor with more than ~4 parameters, several optional.',
            'Singleton — signal: exactly one instance must exist for the process lifetime; always flag the testability cost.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Factory Method** — signal: "the exact subclass to create depends on a runtime value." Delegate creation to a factory instead of scattering `new X()` calls and `if/elif` chains across the codebase.',
                '**Abstract Factory** — signal: "families of related objects that must stay consistent with each other." E.g., a `UIFactory` producing matching `Button`/`Checkbox` for a light theme vs a dark theme — you never want a light `Button` paired with a dark `Checkbox`.',
                '**Builder** — signal: "a constructor with more than ~4 parameters, several of them optional." Prefer over telescoping constructors or a giant config dict with no validation.',
                '**Singleton** — signal: "exactly one instance must exist for the process lifetime" (connection pool, logger, config loader). Know how to make it thread-safe, and know the interviewer wants to hear you flag the testability cost.',
              ],
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class NotificationChannel {
        <<interface>>
        +send(message)
    }
    class EmailChannel
    class SmsChannel
    class PushChannel
    class NotificationFactory {
        +create(channel: String) NotificationChannel
    }
    NotificationChannel <|.. EmailChannel
    NotificationChannel <|.. SmsChannel
    NotificationChannel <|.. PushChannel
    NotificationFactory ..> NotificationChannel : creates`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Factory Method via a registry',
              code: `class NotificationFactory:
    _registry = {}

    @classmethod
    def register(cls, channel, ctor):
        cls._registry[channel] = ctor

    @classmethod
    def create(cls, channel: str):
        if channel not in cls._registry:
            raise ValueError(f"unknown channel: {channel}")
        return cls._registry[channel]()`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class UIFactory {
        <<interface>>
        +createButton() Button
        +createCheckbox() Checkbox
    }
    class LightUIFactory
    class DarkUIFactory
    class Button { <<interface>> }
    class Checkbox { <<interface>> }
    class LightButton
    class DarkButton
    class LightCheckbox
    class DarkCheckbox

    UIFactory <|.. LightUIFactory
    UIFactory <|.. DarkUIFactory
    Button <|.. LightButton
    Button <|.. DarkButton
    Checkbox <|.. LightCheckbox
    Checkbox <|.. DarkCheckbox
    LightUIFactory ..> LightButton : creates
    LightUIFactory ..> LightCheckbox : creates
    DarkUIFactory ..> DarkButton : creates
    DarkUIFactory ..> DarkCheckbox : creates`,
            },
            {
              type: 'p',
              text: 'The point of Abstract Factory is the guarantee it gives for free: because `LightUIFactory` only ever produces `LightButton`/`LightCheckbox`, it is *structurally impossible* to accidentally pair a light button with a dark checkbox — the consistency constraint is enforced by which factory you hold, not by a runtime check.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class HttpRequestBuilder {
        -method String
        -headers Map
        -body bytes
        +method(m) HttpRequestBuilder
        +header(k, v) HttpRequestBuilder
        +body(b) HttpRequestBuilder
        +build() HttpRequest
    }
    class HttpRequest {
        +method String
        +headers Map
        +body bytes
    }
    HttpRequestBuilder ..> HttpRequest : builds`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Builder with validation on build()',
              code: `class HttpRequestBuilder:
    def __init__(self):
        self._method = "GET"
        self._headers = {}
        self._body = None

    def method(self, m):
        self._method = m
        return self

    def header(self, k, v):
        self._headers[k] = v
        return self

    def body(self, b):
        self._body = b
        return self

    def build(self):
        if self._method in ("POST", "PUT") and self._body is None:
            raise ValueError(f"{self._method} requires a body")
        return HttpRequest(self._method, self._headers, self._body)

# request = HttpRequestBuilder().method("POST").header("Content-Type", "application/json").body(payload).build()`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class ConfigManager {
        -ConfigManager instance$
        -Map settings
        -ConfigManager()
        +getInstance()$ ConfigManager
        +get(key: String) String
    }`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For Singleton, know the standard thread-safety options (eager init, double-checked locking, initialization-on-demand holder, or a class-level lock) — but volunteer the downside unprompted: Singletons hurt unit testing because they hide global state, and dependency injection of the single instance is usually the better fit.',
            },
          ],
        },
        {
          id: 'structural-patterns',
          title: 'Structural Patterns: Adapter, Decorator, Facade, Composite, Proxy',
          summary:
            'Structural patterns are about reshaping relationships between existing objects/interfaces without changing what each one does internally.',
          keyPoints: [
            'Adapter translates one interface into another the client expects.',
            'Decorator adds behavior dynamically, avoiding a subclass explosion for every combination.',
            'Facade gives a simple interface over a complex subsystem.',
            'Composite treats individual objects and compositions of them uniformly.',
            'Proxy controls access to an object — lazy loading, access control, caching, remote calls.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Adapter** — translate one interface into another the client expects (wrapping a legacy `XmlPaymentGateway` behind your `PaymentStrategy` interface).',
                '**Decorator** — add behavior dynamically without subclassing explosion (`CoffeeWithMilk`, `CoffeeWithSugar` wrapping a `Coffee`; Java I/O streams; Python function decorators are a real-world instance of this pattern).',
                '**Facade** — a simple interface over a complex subsystem (`OrderFacade.placeOrder()` internally calling inventory, payment, shipping).',
                '**Composite** — treat individual objects and compositions uniformly (filesystem `File`/`Directory`, org chart, UI component trees).',
                '**Proxy** — control access to an object (lazy loading, access control, caching, remote proxy — e.g., an ORM\'s lazy-loaded relationship is a Proxy).',
              ],
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class PaymentStrategy {
        <<interface>>
        +pay(amount) Receipt
    }
    class XmlPaymentGateway {
        +submitXmlPayment(xml) XmlResponse
    }
    class XmlGatewayAdapter {
        -XmlPaymentGateway legacyGateway
        +pay(amount) Receipt
    }
    PaymentStrategy <|.. XmlGatewayAdapter
    XmlGatewayAdapter --> XmlPaymentGateway : translates calls to`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Beverage {
        <<abstract>>
        +cost() int
        +description() String
    }
    class Espresso {
        +cost() int
        +description() String
    }
    class AddOnDecorator {
        <<abstract>>
        #Beverage wrapped
    }
    class WithMilk {
        +cost() int
        +description() String
    }
    class WithExtraShot {
        +cost() int
        +description() String
    }
    Beverage <|-- Espresso
    Beverage <|-- AddOnDecorator
    AddOnDecorator <|-- WithMilk
    AddOnDecorator <|-- WithExtraShot
    AddOnDecorator o-- Beverage : wraps`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Decorator — pricing composed from independent add-ons',
              code: `class Beverage(ABC):
    @abstractmethod
    def cost(self) -> int: ...
    @abstractmethod
    def description(self) -> str: ...

class Espresso(Beverage):
    def cost(self): return 150
    def description(self): return "Espresso"

class AddOnDecorator(Beverage):
    def __init__(self, wrapped: Beverage):
        self._wrapped = wrapped

class WithMilk(AddOnDecorator):
    def cost(self): return self._wrapped.cost() + 30
    def description(self): return self._wrapped.description() + " + Milk"

class WithExtraShot(AddOnDecorator):
    def cost(self): return self._wrapped.cost() + 50
    def description(self): return self._wrapped.description() + " + Extra Shot"

# drink = WithExtraShot(WithMilk(Espresso()))
# drink.cost() -> 230, avoiding a MilkExtraShotEspresso subclass`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Decorator clearly wins over inheritance whenever behaviors need to combine in arbitrary combinations at runtime — a coffee that is both `WithMilk` and `WithExtraShot` and `WithWhippedCream` would need one subclass per combination under inheritance (combinatorial explosion); Decorator lets any combination be assembled at runtime by wrapping.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class OrderFacade {
        +placeOrder(cart) Receipt
    }
    class InventoryService {
        +reserve(items)
    }
    class PaymentService {
        +charge(amount)
    }
    class ShippingService {
        +schedule(order)
    }
    OrderFacade --> InventoryService
    OrderFacade --> PaymentService
    OrderFacade --> ShippingService`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class FileSystemNode {
        <<abstract>>
        +getSize() int
    }
    class File {
        +getSize() int
    }
    class Directory {
        -List~FileSystemNode~ children
        +getSize() int
        +add(node)
    }
    FileSystemNode <|-- File
    FileSystemNode <|-- Directory
    Directory o-- "many" FileSystemNode : children`,
            },
            {
              type: 'p',
              text: '`Directory.getSize()` simply sums `child.getSize()` over its children — it doesn\'t care whether each child is a `File` (base case) or another `Directory` (recursive case). This uniform treatment of leaf and composite nodes is the entire point of the pattern.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Image {
        <<interface>>
        +display()
    }
    class RealImage {
        -String filename
        +display()
    }
    class ProxyImage {
        -RealImage realImage
        -String filename
        +display()
    }
    Image <|.. RealImage
    Image <|.. ProxyImage
    ProxyImage --> RealImage : lazily creates on first display()`,
            },
          ],
        },
        {
          id: 'behavioral-patterns',
          title: 'Behavioral Patterns: Strategy, Observer, State, Command & More',
          summary:
            'Behavioral patterns govern how objects communicate and change over time — this is where most "code smell → pattern" interview signals live.',
          keyPoints: [
            'Strategy: interchangeable algorithms chosen externally and static once chosen.',
            'Observer: pub/sub within a process — foundation of event-driven UI and reactive systems.',
            'Command: encapsulate a request as an object — the basis for undo/redo and job queues.',
            'State: object behavior changes with internal state, and each state controls its own legal transitions.',
            'Chain of Responsibility, Template Method, Visitor, Mediator, and Memento round out the common set.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Strategy** — interchangeable algorithms (payment methods, sorting strategies, pricing rules, spot-allocation policies).',
                '**Observer** — pub/sub within a process (`StockTicker` notifying `Display` subscribers). Foundation of event-driven UI and reactive systems.',
                '**State** — object behavior changes with internal state (`Order`: `Placed → Shipped → Delivered → Cancelled`, each state class controlling allowed transitions).',
                '**Command** — encapsulate a request as an object (undo/redo, job queues, remote procedure invocation, macro recording).',
                '**Chain of Responsibility** — pass a request along a chain until handled (middleware pipelines, approval workflows, logging levels, input validation pipelines).',
                '**Template Method** — skeleton algorithm in a base class, steps overridden by subclasses (`DataExporter.export()` calling `fetch_data()`, `format()`, `write()` where subclasses override `format()`).',
                '**Visitor** — add operations to a class hierarchy without modifying it (AST traversal in a compiler, computing different reports over the same object tree).',
                '**Mediator** — centralize how a set of objects interact instead of each referencing every other (air traffic control tower pattern; chat room routing messages between users without users knowing about each other directly).',
                '**Memento** — capture and restore an object\'s internal state without violating encapsulation (undo stacks, save/checkpoint systems).',
              ],
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class SortStrategy {
        <<interface>>
        +sort(list) List
    }
    class QuickSort {
        +sort(list) List
    }
    class MergeSort {
        +sort(list) List
    }
    class Sorter {
        -SortStrategy strategy
        +setStrategy(s)
        +sort(list) List
    }
    SortStrategy <|.. QuickSort
    SortStrategy <|.. MergeSort
    Sorter --> SortStrategy`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Subject {
        <<interface>>
        +attach(observer)
        +detach(observer)
        +notify()
    }
    class StockTicker {
        -List~Observer~ observers
        -float price
        +setPrice(p)
    }
    class Observer {
        <<interface>>
        +update(price)
    }
    class PriceDisplay {
        +update(price)
    }
    class AlertService {
        +update(price)
    }
    Subject <|.. StockTicker
    Observer <|.. PriceDisplay
    Observer <|.. AlertService
    StockTicker o-- "many" Observer`,
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class Command {
        <<interface>>
        +execute()
        +undo()
    }
    class AddTextCommand {
        +execute()
        +undo()
    }
    class DeleteTextCommand {
        +execute()
        +undo()
    }
    class TextEditor {
        +applyCommand(cmd: Command)
        +undoLast()
    }
    class CommandHistory {
        -Stack~Command~ history
        +push(cmd)
        +pop() Command
    }
    Command <|.. AddTextCommand
    Command <|.. DeleteTextCommand
    TextEditor --> CommandHistory
    CommandHistory o-- "many" Command`,
            },
            {
              type: 'p',
              text: 'The reason Command works so cleanly for undo/redo: because the request itself is an object with both `execute()` and `undo()`, `TextEditor` never needs to know *what* it\'s undoing — it just pops the last `Command` off a stack and calls `undo()`. The same shape (encapsulate the action, not just its parameters) is what makes job queues and macro recording easy too — a queued job is just a serialized `Command`.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class OrderState {
        <<interface>>
        +next(order)
        +cancel(order)
    }
    class PlacedState
    class ShippedState
    class DeliveredState
    class CancelledState
    OrderState <|.. PlacedState
    OrderState <|.. ShippedState
    OrderState <|.. DeliveredState
    OrderState <|.. CancelledState
    class Order {
        -OrderState state
        +next()
        +cancel()
    }
    Order --> OrderState
    PlacedState --> ShippedState : next()
    ShippedState --> DeliveredState : next()
    PlacedState --> CancelledState : cancel()`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'State pattern — Order lifecycle',
              code: `class OrderState(ABC):
    @abstractmethod
    def next(self, order: "Order"): ...
    @abstractmethod
    def cancel(self, order: "Order"): ...

class PlacedState(OrderState):
    def next(self, order):
        order.state = ShippedState()
    def cancel(self, order):
        order.state = CancelledState()

class ShippedState(OrderState):
    def next(self, order):
        order.state = DeliveredState()
    def cancel(self, order):
        raise IllegalStateTransition("cannot cancel a shipped order")

class Order:
    def __init__(self):
        self.state: OrderState = PlacedState()
    def next(self):
        self.state.next(self)
    def cancel(self):
        self.state.cancel(self)`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Notice the State pattern is doing the validation for you — illegal transitions become impossible to represent instead of being checked with scattered `if order.status == "shipped": raise ...` guards. This is the exact kind of detail that separates a senior answer from a junior one.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Strategy vs State, precisely: both hold a reference to an interface implementation, so they look structurally identical. Strategy: the client chooses the algorithm and it typically doesn\'t change on its own. State: the object transitions between states on its own based on internal logic/events. If the choice is external and static, it\'s Strategy; if the object drives its own transitions, it\'s State.',
            },
          ],
        },
        {
          id: 'concurrency-patterns',
          title: 'Concurrency Patterns Every LLD Round Should Surface',
          summary:
            'Naming the right concurrency pattern for a given contention profile — even without full implementation — is one of the highest-signal things you can do unprompted.',
          keyPoints: [
            'Optimistic locking suits rare contention; pessimistic locking suits frequent, high-value contention.',
            'Compare-and-swap gives lock-free updates for simple counters.',
            'Read-write locks help when reads vastly outnumber writes.',
            'Distributed locks need a TTL/lease so a crashed holder can\'t deadlock the resource forever.',
            'Idempotency keys are the other half of correctness — retries can double-process even with perfect locking.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Optimistic locking** (version column, retry on conflict) — good when contention is rare (most e-commerce inventory updates).',
                '**Pessimistic locking** (`SELECT ... FOR UPDATE`, `synchronized`, mutex) — good when contention is frequent and retries would be wasteful (seat booking at the exact moment tickets go on sale).',
                '**Compare-and-swap / atomic operations** — lock-free updates for simple counters (`AtomicInteger`, Redis `INCR`).',
                '**Read-write locks** — when reads vastly outnumber writes and reads don\'t need to block each other (a config cache updated rarely, read constantly).',
                '**Distributed locks** (Redis Redlock, Zookeeper/etcd) — when the resource is shared across multiple processes/machines, not just threads in one process. Always pair with a TTL/lease so a crashed lock-holder doesn\'t deadlock the resource forever.',
                '**Idempotency keys** — not a lock, but the other half of correctness: even with perfect locking, retries (client timeout + resend) can cause double-processing unless the operation itself is idempotent.',
              ],
            },
            {
              type: 'heading',
              text: 'The race condition, made concrete',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant T1 as Thread A
    participant T2 as Thread B
    participant Counter as shared counter (starts at 5)

    T1->>Counter: read value -> 5
    T2->>Counter: read value -> 5
    T1->>Counter: write 5 + 1 = 6
    T2->>Counter: write 5 + 1 = 6
    Note over Counter: Lost update! Two increments happened, but the final value is 6, not 7.`,
            },
            {
              type: 'p',
              text: 'This "read, then act, then write" shape — not any single line — is what makes an operation non-atomic. The fix is always one of: make the whole sequence atomic under a lock (pessimistic), detect the collision and retry (optimistic), or replace it with a hardware-supported atomic primitive (compare-and-swap / `INCR`) that has no read-then-write gap at all.',
            },
            {
              type: 'heading',
              text: 'Optimistic locking in action',
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant Client
    participant DB

    Client->>DB: read row (value=5, version=1)
    Note over Client,DB: another client updates the row to version=2 in between
    Client->>DB: UPDATE ... SET value=6, version=2 WHERE id=X AND version=1
    DB-->>Client: 0 rows affected (version mismatch)
    Client->>DB: re-read row (value=6, version=2)
    Client->>DB: UPDATE ... SET value=7, version=3 WHERE id=X AND version=2
    DB-->>Client: 1 row affected — success`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When an interviewer asks "what if two requests hit this at the same time?", first name which of these patterns fits the contention profile before writing any code — that single sentence is often worth more than the lock implementation itself.',
            },
          ],
        },
        {
          id: 'anti-patterns',
          title: 'Common Anti-Patterns to Call Out',
          summary:
            'Naming these unprompted, and proposing the fix, is one of the strongest signals you can send in an LLD interview.',
          keyPoints: [
            'God Class — one class doing validation, persistence, business rules, and notification.',
            'Anemic Domain Model — entities that are pure data bags with all logic in a separate Service class.',
            'Primitive Obsession — raw int/String for money, currency, IDs instead of small value types.',
            'Feature Envy and Shotgun Surgery both point to a missing abstraction.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `classDiagram
    class OrderGod {
        +validate()
        +calculateTotal()
        +persistToDb()
        +sendConfirmationEmail()
        +generateInvoicePdf()
    }
    note for OrderGod "God Class: one class,\nfive unrelated reasons to change"`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**God Class** — one class doing validation + persistence + business rules + notification. Fix: extract by responsibility (SRP).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Anemic Domain Model** — entities that are just data bags (getters/setters) with all logic living in a separate `*Service` or `*Manager` class. Sometimes fine (transaction-script style), but in an OOP-focused interview, pushing behavior into the entities themselves is usually the better answer (`Order.cancel()` instead of `OrderManager.cancelOrder(order)`).',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Primitive Obsession** — passing raw `int`/`String` for money, currency, IDs everywhere instead of wrapping them in small value types (`Money`, `UserId`) that can enforce invariants (no negative amounts) and prevent parameter-order bugs.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Feature Envy** — a method that mostly operates on another object\'s data belongs on that other object.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Shotgun Surgery** — adding one feature requires touching a dozen classes; usually a missing abstraction (often solved by Strategy/Template Method).',
            },
          ],
        },
        {
          id: 'case-study-parking-lot',
          title: 'Case Study: Parking Lot System',
          summary:
            'A favorite warm-up because it cleanly exercises Singleton, Strategy, vehicle/spot compatibility modeling, and a concrete concurrency race condition.',
          keyPoints: [
            'ParkingLot is a Singleton — justify it (one lot per building), don\'t apply it by reflex.',
            'Spot allocation and pricing are both Strategy so algorithms can be swapped without touching ParkingLot.',
            'Vehicle-to-spot compatibility is modeled explicitly rather than as scattered if-statements.',
            'The classic race: two attendants scanning the same spot as free — needs a lock or DB-level SELECT ... FOR UPDATE.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Requirements gathered: multiple floors, multiple spot sizes (compact/large/handicapped), multiple vehicle types (motorcycle/car/bus), entry/exit gates that issue and settle tickets, pricing based on duration, and support for "lot is full" handling.',
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class ParkingLot {
        -List~Floor~ floors
        -ParkingLot instance
        +getInstance() ParkingLot
        +parkVehicle(vehicle) Ticket
        +unparkVehicle(ticket) Receipt
    }
    class Floor {
        -int floorNumber
        -List~ParkingSpot~ spots
        +findAvailableSpot(vehicleType) ParkingSpot
    }
    class ParkingSpot {
        -String spotId
        -SpotType type
        -bool isOccupied
        +assignVehicle(vehicle)
        +removeVehicle()
    }
    class Vehicle {
        <<abstract>>
        -String licensePlate
        -VehicleType type
    }
    class Ticket {
        -String ticketId
        -DateTime entryTime
        -ParkingSpot spot
        -Vehicle vehicle
    }
    class PricingStrategy {
        <<interface>>
        +calculateFee(ticket) Money
    }
    ParkingLot "1" o-- "many" Floor
    Floor "1" o-- "many" ParkingSpot
    ParkingSpot --> Vehicle : occupied by
    ParkingLot --> Ticket : issues
    Ticket --> ParkingSpot
    Ticket --> Vehicle
    ParkingLot --> PricingStrategy`,
            },
            {
              type: 'heading',
              text: 'Key design decisions worth saying out loud',
            },
            {
              type: 'list',
              items: [
                '`ParkingLot` is a **Singleton** — there\'s exactly one lot per building (justify it, don\'t just apply it by reflex).',
                'Spot allocation uses a **Strategy** so "nearest spot" vs "best-fit spot" algorithms can be swapped.',
                'Pricing uses **Strategy** so weekday/weekend or member/non-member pricing plugs in without touching `ParkingLot`.',
                'Vehicle-to-spot compatibility is modeled explicitly (a motorcycle can use a compact spot, a bus needs a large spot) rather than as scattered `if` statements — this is the detail that separates a strong answer from a mediocre one.',
                'Concurrency: two attendants scanning the same spot as free needs a lock/atomic compare-and-swap on `ParkingSpot.isOccupied`, or a DB-level `SELECT ... FOR UPDATE` if persisted. Always mention this even if you don\'t implement it live.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'Concurrency-safe spot assignment (excerpt)',
              code: `@dataclass
class ParkingSpot:
    spot_id: str
    spot_type: SpotType
    _lock: threading.Lock = field(default_factory=threading.Lock)
    _vehicle: Optional["Vehicle"] = None

    def try_assign(self, vehicle: "Vehicle") -> bool:
        # the lock makes check-then-act atomic; without it two threads
        # can both read _vehicle as None and both "win" the same spot
        with self._lock:
            if self._vehicle is not None:
                return False
            self._vehicle = vehicle
            return True

class Floor:
    def try_park(self, vehicle: "Vehicle") -> Optional[ParkingSpot]:
        # smallest-fit first: prefer COMPACT before LARGE so we don't
        # waste large spots on motorcycles
        for spot_type in COMPATIBLE_SPOTS[vehicle.vehicle_type]:
            for spot in self.spots_by_type.get(spot_type, []):
                if spot.try_assign(vehicle):
                    return spot
        return None`,
            },
            {
              type: 'p',
              text: 'The reason to present code like this (rather than pseudocode) is that it demonstrates three things at once: correct handling of the classic parking-lot race condition (two cars for one spot), a smallest-fit allocation policy stated as an explicit, arguable design decision, and a Singleton implemented safely with a class-level lock — all things interviewers specifically probe with "what if two cars arrive at the same time?"',
            },
          ],
        },
        {
          id: 'case-study-rate-limiter',
          title: 'Case Study: Rate Limiter',
          summary:
            'Knowing the five standard algorithms and their tradeoffs matters more than memorizing one implementation — but Token Bucket is the one to have fully working.',
          keyPoints: [
            'Fixed Window Counter is simplest but allows a 2x burst at window boundaries.',
            'Token Bucket refills at a fixed rate and allows controlled bursts — most common in production (e.g., AWS API Gateway).',
            'Leaky Bucket processes at a fixed output rate regardless of burst, smoothing traffic for downstream systems.',
            'Always mention where state lives, clock choice (monotonic, not wall-clock), fail-open vs fail-closed, and eviction of stale per-client state.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Fixed Window Counter** — simplest, but allows bursts at window boundaries (2x traffic at the edge).',
                '**Sliding Window Log** — store timestamps per user, precise but memory-heavy at scale.',
                '**Sliding Window Counter** — weighted average of current + previous window, good accuracy/memory tradeoff.',
                '**Token Bucket** — tokens refill at a fixed rate, requests consume tokens; allows controlled bursts. Most commonly used in production (e.g., AWS API Gateway).',
                '**Leaky Bucket** — requests processed at a fixed output rate regardless of burst; smooths traffic for downstream systems.',
              ],
            },
            {
              type: 'mermaid',
              code: `classDiagram
    class RateLimiter {
        <<interface>>
        +allow_request(client_id) bool
    }
    class TokenBucketLimiter {
        -Map~String,Bucket~ buckets
        +allow_request(client_id) bool
    }
    class Bucket {
        -float tokens
        -int capacity
        -float refill_rate
        -float last_refill_ts
        +try_consume() bool
    }
    RateLimiter <|.. TokenBucketLimiter
    TokenBucketLimiter --> Bucket`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Token bucket refill + consume (excerpt)',
              code: `def try_consume(self, cost: int = 1) -> bool:
    with self.lock:
        now = time.monotonic()
        elapsed = now - self.last_refill_ts
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill_ts = now
        if self.tokens >= cost:
            self.tokens -= cost
            return True
        return False`,
            },
            {
              type: 'p',
              text: 'Design talking points: where does state live (in-process map vs Redis for a distributed rate limiter shared across app servers), what happens under clock skew across nodes (use `time.monotonic()`/monotonic clocks, never wall-clock, to avoid going backward on NTP adjustment), how the limiter degrades gracefully (fail-open vs fail-closed) if the store backing it is unavailable, and how you\'d evict stale per-client buckets so the bucket map doesn\'t grow unboundedly (an LRU eviction or periodic sweep of buckets untouched for N minutes).',
            },
          ],
        },
        {
          id: 'case-study-elevator',
          title: 'Case Study: Elevator System',
          summary:
            'A favorite precisely because naive designs collapse the moment you ask "what if 3 people request the elevator from different floors going different directions at once?"',
          keyPoints: [
            'Each Elevator keeps two sorted sets of pending stops (up/down) so it services one direction fully before reversing — SCAN/LOOK disk scheduling, repurposed.',
            'ElevatorController.assignBestElevator scores each elevator and picks the minimum-cost one — itself a Strategy, swappable for a smarter dispatch algorithm.',
            'Internal and external requests are modeled the same way, so the core step() logic doesn\'t care who requested a stop.',
            'Each Elevator owns its own state exclusively, so the controller only needs a lock around request assignment, not around movement.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `classDiagram
    class ElevatorController {
        -List~Elevator~ elevators
        +requestElevator(floor, direction)
        +assignBestElevator(request) Elevator
    }
    class Elevator {
        -int id
        -int currentFloor
        -Direction direction
        -ElevatorState state
        -TreeSet~int~ upStops
        -TreeSet~int~ downStops
        +addStop(floor, direction)
        +step()
    }
    class Direction {
        <<enumeration>>
        UP
        DOWN
        IDLE
    }
    class ElevatorState {
        <<enumeration>>
        MOVING
        STOPPED
        DOORS_OPEN
    }
    ElevatorController "1" o-- "many" Elevator
    Elevator --> Direction
    Elevator --> ElevatorState`,
            },
            {
              type: 'list',
              items: [
                'Each `Elevator` keeps two sorted sets of pending stops (`upStops`, `downStops`) so it services all requests in its current direction before reversing — this is the classic **SCAN/LOOK disk-scheduling algorithm** repurposed, and naming that connection out loud is a strong signal.',
                '`ElevatorController.assignBestElevator` scores each elevator (distance to the request floor, whether it\'s already heading that direction, current load) and picks the minimum-cost one — this is effectively a **Strategy** for elevator assignment, swappable for a smarter dispatch algorithm later.',
                'Internal vs external requests are modeled the same way (a `Stop` with a floor and a direction) so the core `step()` logic doesn\'t care who requested it.',
                'Concurrency: multiple `Elevator` instances run independently; the controller only needs a lock around request assignment, not around each elevator\'s internal movement loop, since each elevator owns its own state exclusively — an important "where do I even need a lock" observation.',
              ],
            },
          ],
        },
        {
          id: 'case-study-splitwise',
          title: 'Case Study: Splitwise (Expense Sharing & Debt Simplification)',
          summary:
            'Tests graph thinking layered on top of OOP — the interesting part is not the class diagram but the greedy debt-simplification algorithm.',
          keyPoints: [
            'Split is a Strategy interface (EqualSplit, ExactSplit, PercentSplit) so new splitting rules plug in without touching Expense or Group.',
            'Debt simplification reduces N pairwise debts to the minimum number of settling transactions.',
            'The greedy approach: repeatedly match the largest creditor with the largest debtor via a max-heap/min-heap pair.',
            'This is O(N log N) and a variant of the classic minimum cash-flow problem — state both the complexity and why the greedy choice works.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `classDiagram
    class Expense {
        -String id
        -Money amount
        -User paidBy
        -List~Split~ splits
    }
    class Split {
        <<interface>>
        +getShare(totalAmount) Money
    }
    class EqualSplit
    class ExactSplit
    class PercentSplit
    class Group {
        -List~User~ members
        -List~Expense~ expenses
        +addExpense(expense)
        +simplifyDebts() List~Transaction~
    }
    class Balance {
        -Map~User,Money~ netBalance
    }
    Split <|.. EqualSplit
    Split <|.. ExactSplit
    Split <|.. PercentSplit
    Expense "1" o-- "many" Split
    Group "1" o-- "many" Expense
    Group --> Balance`,
            },
            {
              type: 'p',
              text: 'The core algorithm — debt simplification — reduces N pairwise debts to the minimum number of settling transactions: compute each user\'s net balance (total paid minus total owed), then greedily match the largest creditor with the largest debtor repeatedly (a min-heap/max-heap pair, or sort-and-two-pointer) until all balances are zero.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Greedy debt simplification',
              code: `import heapq

def simplify_debts(net_balance: dict[str, int]) -> list[tuple[str, str, int]]:
    # net_balance[user] > 0 means user is owed money; < 0 means user owes.
    creditors = [(-amt, user) for user, amt in net_balance.items() if amt > 0]
    debtors = [(amt, user) for user, amt in net_balance.items() if amt < 0]
    heapq.heapify(creditors)  # max-heap via negation
    heapq.heapify(debtors)    # min-heap (most negative first)

    transactions = []
    while creditors and debtors:
        neg_credit, creditor = heapq.heappop(creditors)
        debt, debtor = heapq.heappop(debtors)
        credit = -neg_credit
        settled = min(credit, -debt)

        transactions.append((debtor, creditor, settled))

        remaining_credit = credit - settled
        remaining_debt = debt + settled
        if remaining_credit > 0:
            heapq.heappush(creditors, (-remaining_credit, creditor))
        if remaining_debt < 0:
            heapq.heappush(debtors, (remaining_debt, debtor))
    return transactions`,
            },
            {
              type: 'p',
              text: 'This greedy approach is provably optimal in count of transactions among "always fully settle the larger side" strategies commonly taught, and it\'s O(N log N) — worth stating both the complexity and why the greedy choice works (it\'s a variant of the classic "minimum cash flow" problem).',
            },
          ],
        },
        {
          id: 'case-study-bookmyshow',
          title: 'Case Study: BookMyShow (Movie Ticket Booking with Seat Locking)',
          summary:
            'The hard part isn\'t the class diagram — it\'s preventing two users from booking the same seat, without holding a seat hostage forever if a user abandons checkout.',
          keyPoints: [
            'A short-TTL lock in a fast store (Redis SETNX/SET NX EX) reserves a seat during checkout, not a DB row lock held for minutes.',
            'If payment succeeds, the lock converts into a permanent DB row inside a transaction with a unique constraint on (show_id, seat_id).',
            'The lock is a latency/UX optimization (fail fast); the DB unique constraint is the actual correctness guarantee.',
            'If the TTL expires before payment, the seat silently becomes available again — no manual cleanup process needed.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `classDiagram
    class Movie {
        -String id
        -String title
        -int durationMins
    }
    class Screen {
        -String id
        -List~Seat~ seats
    }
    class Seat {
        -String id
        -SeatType type
    }
    class Show {
        -String id
        -DateTime startTime
    }
    class Booking {
        -String id
        -List~Seat~ seats
        -BookingStatus status
    }
    class User {
        -String id
        -String name
    }
    Show "many" --> "1" Movie
    Show "many" --> "1" Screen
    Screen "1" o-- "many" Seat
    Booking "many" --> "1" Show
    Booking "many" --> "many" Seat
    Booking "many" --> "1" User`,
            },
            {
              type: 'mermaid',
              code: `sequenceDiagram
    participant UserA
    participant UserB
    participant BookingService
    participant SeatLockStore as Seat Lock (Redis, TTL)
    participant PaymentService
    participant DB

    UserA->>BookingService: selectSeats([A1, A2])
    BookingService->>SeatLockStore: SETNX lock:A1 userA EX 300
    SeatLockStore-->>BookingService: OK (locked)
    BookingService-->>UserA: seats held for 5 min

    UserB->>BookingService: selectSeats([A1])
    BookingService->>SeatLockStore: SETNX lock:A1 userB EX 300
    SeatLockStore-->>BookingService: FAIL (already locked)
    BookingService-->>UserB: seat unavailable

    UserA->>BookingService: confirmPayment()
    BookingService->>PaymentService: charge(userA)
    PaymentService-->>BookingService: success
    BookingService->>DB: persist booking (A1, A2 -> userA), status=CONFIRMED
    BookingService->>SeatLockStore: DEL lock:A1, lock:A2`,
            },
            {
              type: 'p',
              text: 'Key design decisions: the lock is a short-TTL entry in a fast store (Redis `SETNX`/`SET NX EX`), not a DB row lock held across the entire checkout flow — checkout can take minutes (entering card details) and you cannot hold a pessimistic DB lock that long without starving other requests. If payment succeeds, the lock is converted into a permanent DB row (`booking` table) inside a transaction with a unique constraint on `(show_id, seat_id)` as the final correctness backstop — the lock is an optimization for good UX (fail fast, show "seat taken" immediately), the DB unique constraint is what actually guarantees no double-booking even if the lock layer has a bug or an expired-but-not-yet-cleaned-up entry.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If the TTL expires before payment, the seat silently becomes available again — no manual cleanup process needed, which is precisely why TTL-based locks are preferred here over an explicit "release" call that a crashed client would never send.',
            },
          ],
        },
        {
          id: 'practice-prompts',
          title: 'Common LLD Interview Prompts to Practice',
          summary:
            'Run each of these through the eleven-step process until it is automatic — the process transfers even when the specific prompt does not.',
          keyPoints: [
            'Splitwise, elevator, chess/tic-tac-toe, library management, vending machine, and LRU/LFU cache are asked constantly.',
            'Notification system, URL shortener, and movie ticket booking test the same Strategy/Observer/locking ideas from other angles.',
            'Logging framework, in-memory KV store with TTL, and text editor with undo/redo test Command + Memento.',
            'Practicing breadth across these prompts matters more than perfecting any single one.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                'Splitwise / expense sharing',
                'Elevator system',
                'Chess / tic-tac-toe game',
                'Library management system',
                'Vending machine',
                'LRU / LFU cache',
                'Notification system (multi-channel)',
                'URL shortener (LLD depth, not just HLD)',
                'Movie ticket booking (BookMyShow)',
                'Logging framework',
                'In-memory key-value store with TTL',
                'Food delivery order lifecycle',
                'ATM machine',
                'Hotel booking system',
                'Ride-sharing matching (LLD depth)',
                'Text editor with undo/redo (Command + Memento)',
                'Traffic light controller',
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'lld-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: '30 Low-Level Design interview questions with full-depth answers, spanning OOP fundamentals, UML notation, patterns, and the five case studies.',
          qa: [
            {
              question: 'What\'s the difference between aggregation and composition?',
              answer:
                'Both are "has-a" relationships. In composition, the child\'s lifecycle is bound to the parent — if the parent is destroyed, so is the child (e.g., a `House` and its `Room`s). In aggregation, the child can exist independently (e.g., a `University` has `Department`s, but a `Department` could theoretically be reassigned; more classically, a `Car` and its `Engine` — the engine can exist without the car in inventory).',
            },
            {
              question: 'What is the difference between association, aggregation, and composition, and how do you show multiplicity on a UML diagram?',
              answer:
                'Association is the loosest "uses/knows about" relationship — neither side owns the other\'s lifecycle (a `Driver` associated with a `Car`). Aggregation is a "has-a" whole-part relationship where the part can still exist independently of the whole (hollow diamond at the whole). Composition is a stronger "has-a" where the part\'s lifecycle is bound to the whole — destroy the whole and the parts go with it (filled diamond at the whole). Multiplicity is written at each end of the relationship line as `1`, `0..1`, `*`/`0..*`, `1..*`, or a bounded range like `2..4`, and states exactly how many instances of one class relate to one instance of the other — e.g. `Group "1" o-- "many" Expense` means one group aggregates many expenses. Always draw multiplicities explicitly; omitting them is a common tell of a rushed diagram.',
            },
            {
              question: 'What is the difference between encapsulation and abstraction? People often use these interchangeably.',
              answer:
                'Encapsulation hides an object\'s internal **state** and bundles it with the methods that are allowed to mutate it, so invariants can\'t be violated from outside (a `BankAccount` with a private `balance` and a validating `withdraw()` method). Abstraction hides an object\'s internal **complexity** behind a simple contract, so callers depend on *what* it does, not *how* (`PaymentStrategy.pay(amount)` hides the HTTP calls and retries inside). They usually appear together but are independent: a class can expose all-public fields (not encapsulated) behind one well-named method (abstracted), or vice versa. Shorthand: encapsulation hides data, abstraction hides complexity.',
            },
            {
              question: 'Explain polymorphism, and the difference between compile-time and runtime polymorphism.',
              answer:
                'Polymorphism lets the same method call resolve to different code depending on the actual (runtime) type of the object it\'s called on. Runtime/dynamic polymorphism — calling `shape.area()` on a variable declared as `Shape` but actually holding a `Circle` or `Rectangle`, and getting the correct implementation each time — is resolved via method dispatch (a vtable, conceptually) and is what makes Strategy, Observer, and most GoF patterns work at all. Compile-time/static polymorphism is method **overloading**: multiple methods with the same name but different parameter lists, resolved by the compiler based on the declared argument types, not the runtime object. In an LLD interview, "polymorphism" almost always means the runtime kind — that\'s the one that matters for extensibility.',
            },
            {
              question: 'Why prefer composition over inheritance?',
              answer:
                'Inheritance creates tight coupling to a parent\'s implementation and can violate LSP if subclasses don\'t truly satisfy the parent\'s contract. Composition lets you assemble behavior from smaller, independently testable units and change it at runtime (e.g., swapping a `Strategy`), whereas inheritance hierarchies are fixed at compile time and get brittle as they deepen ("gorilla holding the banana" problem — you wanted the banana, you got the gorilla and the whole jungle).',
            },
            {
              question: 'How would you make a Singleton thread-safe?',
              answer:
                'Options: (1) eager initialization (instance created at class load, trades startup cost for simplicity), (2) double-checked locking with a volatile field in Java, (3) initialization-on-demand holder idiom (nested static class, JVM class-loading guarantees thread safety for free), (4) in Python, module-level objects are singletons by import semantics, or use a class-level lock as shown in the parking lot design. Always mention that Singletons hurt unit testing (global state, hidden dependencies) and dependency injection is often a better fit.',
            },
            {
              question: 'Design a class hierarchy for a payment system that needs to support adding new payment methods without modifying existing code. Which principle does this test?',
              answer:
                'Open/Closed Principle via the Strategy pattern. Define a `PaymentStrategy` interface with `pay(amount)`. Each payment method (`CreditCard`, `UPI`, `Wallet`) implements it. `OrderService` holds a reference to `PaymentStrategy` (injected), so adding `CryptoPayment` means adding a new class, not editing `OrderService`.',
            },
            {
              question: 'When would you use the Observer pattern vs a message queue?',
              answer:
                'Observer is in-process, synchronous (or same-runtime-async), and tightly coupled to the object lifecycle — good for UI event handling or in-app pub/sub. A message queue (Kafka/SQS) is for cross-process, durable, decoupled communication where the publisher shouldn\'t know or care who/how many consumers exist, and where you need persistence, retries, and back-pressure. If your "observer" needs to survive a process restart or scale across machines, you actually need a queue.',
            },
            {
              question: 'What is the difference between the Strategy and State patterns? They look structurally identical.',
              answer:
                'Structurally similar (both hold a reference to an interface implementation), but intent differs. Strategy: the client chooses the algorithm and it typically doesn\'t change on its own (e.g., pick a sorting algorithm). State: the object transitions between states on its own based on internal logic/events, and each state controls what transitions are legal next (e.g., `Order` moving `Placed → Shipped`). The key interview tell: if the algorithm choice is external and static, it\'s Strategy; if the object drives its own transitions, it\'s State.',
            },
            {
              question: 'How do you handle a "God Class" you\'re asked to refactor?',
              answer:
                'Identify the distinct responsibilities mixed inside it (e.g., validation, persistence, notification, business rules). Extract each into its own class following SRP, then have the original class (or a new orchestrator) compose them. Use the Facade pattern if you still want one entry point for callers. Watch for shared mutable state that makes extraction non-trivial — that\'s usually the real reason the class grew that way.',
            },
            {
              question: 'Design an LRU cache. What\'s the time complexity requirement and how do you hit it?',
              answer:
                'O(1) get and put. Use a `HashMap<Key, Node>` for O(1) lookup combined with a doubly linked list to maintain recency order in O(1) (move-to-front on access, evict from tail on capacity overflow) — the HashMap stores pointers directly to the linked list nodes so you avoid O(n) traversal. In Java, `LinkedHashMap` with `removeEldestEntry` gives this for free; in Python, `collections.OrderedDict` (`move_to_end` + `popitem(last=False)`) is the idiomatic shortcut — but implementing the doubly-linked-list version by hand (a `Node` class with `prev`/`next` pointers, a dummy head/tail, and `_remove`/`_insert_front` helpers) is what most interviewers actually want to see.',
            },
            {
              question: 'How would you extend the parking lot design to support dynamic pricing (e.g., surge pricing during peak hours)?',
              answer:
                'Because pricing is already behind a `PricingStrategy` interface, add a `SurgePricing` implementation that wraps or composes a base strategy and applies a multiplier based on time-of-day/occupancy — Decorator pattern is a clean fit here (`SurgePricingDecorator(basePricing)`). No changes needed to `ParkingLot` or `Ticket`.',
            },
            {
              question: 'What\'s the difference between an interface and an abstract class, and when do you choose one over the other?',
              answer:
                'An abstract class can hold shared state and partial implementation (template methods); a class can extend only one. An interface defines a pure contract (in most languages, no state, possibly default methods) and a class can implement many. Choose abstract class when subclasses share meaningful common code/state (is-a with shared implementation); choose interface when you\'re defining a capability multiple unrelated classes can plug into (can-do, e.g., `Comparable`, `Serializable`, `PaymentStrategy`).',
            },
            {
              question: 'How do you prevent two threads from booking the same parking spot/seat simultaneously?',
              answer:
                'At the data layer: pessimistic locking (`SELECT ... FOR UPDATE`) or optimistic locking (version column, retry on conflict) on the spot/seat row. In-memory: synchronize on a per-resource lock (a per-spot `threading.Lock`, as in the parking lot design), or a distributed lock via Redis `SETNX`/Redlock if multiple app instances share the resource. Always prefer the smallest possible lock scope (per-spot, not global) to avoid throughput collapse.',
            },
            {
              question: 'In the Decorator vs Inheritance debate, when does Decorator clearly win?',
              answer:
                'When you need to combine behaviors in arbitrary combinations at runtime — e.g., a coffee that\'s both `WithMilk` and `WithExtraShot` and `WithWhippedCream`. Inheritance would need a subclass per combination (combinatorial explosion). Decorator lets you wrap the base object in any combination of decorators, each adding one concern, decided at runtime.',
            },
            {
              question: 'How would you design a notification system that supports Email, SMS, and Push, with per-user channel preferences and retry on failure?',
              answer:
                '`NotificationChannel` interface (`send(message)`) implemented by `EmailChannel`, `SmsChannel`, `PushChannel` — Strategy/Factory to pick channels per user preference. A `NotificationService` reads user preferences, resolves the relevant channel(s) (Composite if it should fan out to multiple), and wraps each send in a retry policy (Decorator or a `RetryTemplate` using exponential backoff). For durability, the actual delivery attempt should be queued (not fired synchronously) so a downstream outage doesn\'t block the caller — this is the point where LLD hands off to HLD (queue choice, dead-letter handling).',
            },
            {
              question: 'What are code smells that suggest a missing design pattern?',
              answer:
                'Long `if/else` or `switch` chains on a type field → Strategy or State. Constructors with many optional parameters → Builder. Classes instantiating concrete dependencies directly (`new StripeClient()` inline) → Dependency Injection / Factory. Deep conditional nesting for validation/approval steps → Chain of Responsibility. Multiple classes needing to react to one object\'s changes → Observer.',
            },
            {
              question: 'How do you test classes that depend on Singletons or static state?',
              answer:
                'This is exactly why Singletons are discouraged in testable design — static/global state leaks across tests and can\'t be swapped for a mock. Fix: depend on an injected interface instead of calling `Singleton.getInstance()` directly inside business logic; the singleton itself can still be the one concrete instance wired at composition-root/startup time, but consumers should receive it via constructor injection so tests can substitute a fake.',
            },
            {
              question: 'In the elevator system, why model stop requests as two sorted sets (upStops/downStops) instead of one queue?',
              answer:
                'A single FIFO queue processes requests in arrival order, which produces wasteful zig-zag movement (go to floor 9, then back down to floor 2, then up to floor 7). Two sorted sets let the elevator service every pending stop in its current direction of travel before reversing (the SCAN/LOOK algorithm), which is both more efficient and matches real elevator behavior riders expect ("it\'s going up, it\'ll get my floor on the way").',
            },
            {
              question: 'How would you design the debt-simplification algorithm in Splitwise to run incrementally, instead of recomputing from scratch on every new expense?',
              answer:
                'Recomputing full simplification on every expense is O(N log N) each time and can also produce a different set of settling transactions each time (annoying if users have already started paying each other back based on a prior simplification). A more production-realistic approach maintains running net balances incrementally (O(1) update per new expense/split) and only triggers full re-simplification on demand (e.g., a "settle up" button) or on a schedule, rather than after every single expense — trading perfect minimality for stability and lower compute cost.',
            },
            {
              question: 'Why use a short-TTL cache lock instead of a database row lock for seat selection in a ticket-booking flow?',
              answer:
                'A DB pessimistic lock (`SELECT ... FOR UPDATE`) held across an entire checkout (which can take minutes while a user enters payment details) ties up a DB connection and a row lock for that whole window, which doesn\'t scale — you\'d exhaust the connection pool under real traffic. A TTL-based lock in a fast external store (Redis) gives the same "reserve while I decide" UX without holding a DB transaction open, self-heals if the user abandons checkout (TTL expiry), and the DB is only touched briefly at the final commit, protected by a unique constraint as the correctness backstop.',
            },
            {
              question: 'What\'s the difference between the Template Method pattern and the Strategy pattern?',
              answer:
                'Template Method uses inheritance: a base class defines the algorithm\'s skeleton and calls abstract "hook" methods that subclasses override to fill in specific steps — the control flow lives in the base class. Strategy uses composition: the entire algorithm is swapped out as one interchangeable object, and the client holds a reference to whichever implementation it\'s configured with — the control flow lives in the client/context. Rule of thumb: if you\'re overriding one step of a larger fixed algorithm, it\'s Template Method; if you\'re swapping the whole algorithm, it\'s Strategy.',
            },
            {
              question: 'How would you extend the Rate Limiter\'s `TokenBucketRateLimiter` (the in-process Python version) to avoid unbounded memory growth from millions of distinct client IDs?',
              answer:
                'The bucket dict grows forever as new client IDs appear and never shrinks. Fix options: (1) wrap it in an LRU cache with a max size, evicting the least-recently-used client\'s bucket (acceptable — a fresh bucket for a returning client just starts full, which is a safe default, not an exploit); (2) a periodic background sweep that removes buckets whose `last_refill_ts` is older than some threshold (e.g., 10 minutes of inactivity); (3) at real scale, move the state out of process entirely into Redis with per-key TTLs, which gives you eviction for free and also solves the multi-server consistency problem simultaneously.',
            },
            {
              question: 'How do you decide whether behavior belongs on the entity itself (e.g., `Order.cancel()`) or in a separate service class (`OrderService.cancel(order)`)?',
              answer:
                'If the behavior only needs the entity\'s own state to decide what\'s valid (e.g., "can this order transition to cancelled given its current status?"), put it on the entity — this keeps invariants co-located with the data they protect and avoids an anemic domain model. If the behavior needs to coordinate across multiple entities/external systems (e.g., cancelling an order also needs to reverse a payment charge and restock inventory), that orchestration belongs in a service, which then calls `order.cancel()` for the part that\'s purely the order\'s own concern. The dividing line is "single-entity invariant" vs "cross-entity workflow."',
            },
            {
              question: 'Walk through why the parking lot\'s `try_assign` uses a lock per spot instead of one global lock for the whole `ParkingLot`.',
              answer:
                'A single global lock would serialize every park/unpark operation across the entire lot, even when two requests are targeting completely unrelated spots on different floors — this destroys concurrency under real load (imagine a 1000-spot lot handling dozens of simultaneous entries). A per-spot lock only creates contention when two threads genuinely compete for the same spot, which is exactly the correctness property you need and nothing more — this is the general LLD principle of minimizing lock scope to the smallest unit that has a real invariant to protect.',
            },
            {
              question: 'How would you add support for reserved/pre-booked parking spots (e.g., monthly subscribers) to the existing design without breaking the walk-in flow?',
              answer:
                'Add a `ReservationService` that, independent of live allocation, marks certain `ParkingSpot`s as `reserved_for: UserId` ahead of time. `Floor.try_park` for walk-ins simply filters out spots that are currently reserved (checking a `reserved_for` field alongside `is_occupied`), while a separate `park_reserved(user, spot)` path on `ParkingLot` bypasses the general allocation search entirely and assigns the user directly to their specific held spot. This is a good example of extending via a new, narrow code path rather than complicating the existing `try_park` search logic with reservation-aware branching.',
            },
            {
              question: 'In the BookMyShow design, why put a unique constraint on `(show_id, seat_id)` in the database if the Redis lock already prevents double-booking?',
              answer:
                'Because the lock layer and the database are two different systems that can disagree — a lock could expire a moment before payment commits (a slow payment gateway call outliving the TTL), or the lock service itself could have a bug, a network partition, or be bypassed by a different code path entirely (an internal admin tool, a batch import). The database unique constraint is the single source of truth that makes double-booking structurally impossible regardless of what happened upstream — the lock is purely a latency/UX optimization ("fail fast, don\'t even attempt payment for a seat someone else is holding"), never the actual correctness guarantee.',
            },
            {
              question: 'What would you change about the LRU cache implementation to make it thread-safe for concurrent `get`/`put` calls?',
              answer:
                'Wrap the critical sections (the linked-list pointer manipulation plus the dict mutation) in a single `threading.Lock` acquired for the duration of each `get`/`put` call — because both operations mutate shared structure (the list and the map together), a lock per-operation is needed rather than per-node, since `get` still needs to move a node, which is a write to the list even though it\'s conceptually a "read." At higher throughput, you\'d shard the cache into N independent LRU segments (hash the key to a segment) each with its own lock, trading strict global LRU ordering for much lower lock contention — the same idea Java\'s `ConcurrentHashMap` uses internally.',
            },
            {
              question: 'What does "program to an interface, not an implementation" mean concretely when you\'re sketching a class diagram?',
              answer:
                'It means a dependent class should hold a reference typed as an interface/abstract type (`PaymentStrategy`), never as a concrete class (`UpiPayment`) — even if, today, there\'s only one implementation. Concretely on a diagram: the arrow from `OrderService` should point at `PaymentStrategy` (association to the interface), with a separate realization arrow from each concrete class to that same interface — never a direct association from `OrderService` straight to `UpiPayment`. The payoff is exactly DIP/OCP: new implementations can be added, and existing ones swapped (including for a test double), without touching `OrderService` at all.',
            },
            {
              question: 'When would you deliberately choose an anemic domain model over a rich one, even in an OOP-focused interview?',
              answer:
                'When the "business logic" is really just orchestration across multiple services/external systems rather than a single entity\'s own invariant — e.g., a checkout flow that calls inventory, payment, and shipping in sequence doesn\'t belong on any one entity, so a transaction-script style service naturally owns it, with the entities themselves staying closer to data holders. It\'s also a reasonable pragmatic choice in simple CRUD-heavy systems where the "domain logic" is thin and forcing rich behavior onto entities would be over-engineering. The general rule from this guide still applies as a default, though: if a rule can be checked using only one entity\'s own state, put it on that entity first, and only fall back to a service when the logic genuinely spans multiple entities.',
            },
          ],
        },
      ],
    },
  ],
}
