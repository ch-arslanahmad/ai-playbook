# Building an MCP Server

An MCP server can have:

- Tools (required)
- Resources
- Prompts

In practice, tools are required as they do the processing of the input and provide output while resources provide read-only data and prompts provide user-triggered message templates.

Python is the most popular language with MCP with most mature support.

When using Python you must also use Pydantic for validation. See [Pydantic validation patterns](https://github.com/ch-arslanahmad/pods/blob/main/docs/learning.md#pydantic) for Field validators, model classes, and error handling.

> [!note]
> However, note that it is better to make something a `tool` rather than a MCP server (local/remote) due to latency & speed & complexity. Hence, if it is a single action, create a `tool` or equivalent thing in your specific platform, as MCP servers is suitable for combination of related multiple tools and resources.
> For example, a `gh` cli is better (in most cases) than `GitHub` MCP due to speed and efficiency, while MCP adds overhead in token usage, latency, speed & complexity.

#### Tools

```python
@mcp.tool()
def create_entry(content: str) -> str:
    id = db.insert(content)  # actual DB write
    return id
```

`@mcp.tool()` defines it as a tool, The function IS the tool

These functions are actually that do some action.

#### Resources

Resources are read-only data the LLM can fetch.

```python

@mcp.resource("entry://{entry_id}")
def get_entry(id: str) -> str:
    """Fetch a single entry by ID."""
    return db.fetch(id)  # returns the content

```

It also includes a URI endpoint, which are like web REST APIs however due to not being HTTP, they have their own defined namespace like, `entry://`.

You use URI when the resource is not in the web, like in our case locally in the DB.

The difference between tool & resource is:

- **Tool** → MCP server executes an operation (write, compute, mutate) with the AI's input
- **Resource** → AI reads data the MCP server fetches (fetch, read, retrieve)

### Prompts

MCP prompts are **user-triggered message templates**. The user selects a prompt from the client UI (not the LLM), fills in any arguments, and the server returns pre-structured messages that get injected into the conversation.

**Flow:**

1. Client calls `prompts/list` → server returns available prompts
2. User selects a prompt and fills in args
3. Client calls `prompts/get` with the args
4. Server returns messages (role + content pairs)
5. Messages get injected into the conversation as context for the LLM

```python
@mcp.prompt()
def weather(city: str, unit: str = "celsius") -> str:
    """Check weather for a city."""
    return f"What's the current weather in {city} in {unit}?"
```

The prompt doesn't _do_ anything, it generates text that becomes conversation context. The LLM then decides what to do with it (like calling a tool).

**Key distinction:** Tools are LLM-driven (`tools/call`), prompts are user-driven (`prompts/get`). Most MCP servers only expose tools, prompts are rare in practice.

## MCP Design Tips

### Error Handling (Beyond Validation)

Pydantic handles bad input types, but real failures happen at runtime:

```python
@mcp.tool()
def search_docs(query: str) -> list[dict]:
    try:
        results = db.query(query)
        if not results:
            return {"error": "No results found", "query": query}
        return results
    except ConnectionError:
        return {"error": "Database unavailable, try again later"}
    except Exception as e:
        return {"error": f"Search failed: {str(e)}"}
```

Always return error messages as structured data instead of crashing. The LLM can read `{"error": "..."}` and either retry or tell the user what went wrong.

### Metadata & Descriptions

Without good descriptions, metadata, names, the AI can't figure out when to use your tool or resource. Always provide:

```python
mcp = FastMCP(
    name="mcp-server-name",
    instructions="...", # instructions for the AI to use tools, resources
    description="...",  # short description of the MCP server
    version="1.0.0",
    host="0.0.0.0",
)
```

```python
@mcp.tool()
def search_docs(query: str, limit: int = 10) -> list[dict]:
    """Search documentation. query: search term, limit: max results."""
```

### Resources vs Tools vs Prompts

| Concept      | Purpose                         | Invoker | Example                                         |
| ------------ | ------------------------------- | ------- | ----------------------------------------------- |
| **Tool**     | Executes an operation           | LLM     | `search_users("john")`                          |
| **Resource** | Data the AI can read            | LLM     | `file:///logs/app.log`                          |
| **Prompt**   | User-triggered message template | User    | `/weather london` → "What's weather in London?" |

## Related

- [mcp.md](mcp.md) - How to use and configure MCP servers
- [skills.md](skills.md) - Skills system
