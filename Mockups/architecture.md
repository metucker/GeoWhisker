
```mermaind
graph TD
  subgraph Client
    C1((User Interface))
    C2[Graphing Library]
  end
  subgraph Server
    S1[API]
    S2[Database]
  end
  subgraph Database
    D1((User Information))
    D2((Community Cat Information))
  end

  C1 -->|Requests| S1
  C2 -->|Requests| S1
  S1 -->|Queries/Updates| S2
  S1 -->|Queries| D1
  S1 -->|Queries| D2
  S2 -->|Data| S1
  S2 -->|Data| C2
```