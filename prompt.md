# AI prompts

## Prompt Adders

The following are prompt adders that can apply to almost every prompt and are _essential_ to get **high-quality replies, responses**. 
All you need to do, is to add one of these three lines at the end of every prompt according to your need.

The are as follows:
### 1. The Clarifier
```
Ask me 5 follow-up questions, whose answers will let you help me much better.
```
OR
```
Ask me 5 follow-up questions, whose answers will significantly improve your response.
```
### 2. The Expert
```
What would the top 0.1% people in this field think about your response? 
Use relevant frameworks to evaluate & suggest improvements.
```
### 3. The Challenger
```Challenge my assumptions and help me reframe this problem.```

This last one is not only for AI but also for you to think better…

These prompt adders will give you much better results than anything else.

## Prompts

- ### Universal Prompt for Structured Roadmap (Data/Taks Available)
```
Your task is to take a flat, unstructured list or paragraph of topics, tasks, or notes and reorganize them into a clear, logical, and easy-to-follow roadmap.
Your response must meet the following criteria:
Structure: Present the output as a numbered outline with main sections and numbered subsections.
Grouping: Create main categories to logically group related items.
Assignment: Place each item under the most relevant section.
Clarity: If an item fits into multiple categories, separate it into distinct dimensions (e.g., theory vs. practical) and place each part in the appropriate section.
Fidelity: Do not add, remove, or invent new items; only reorganize what is provided.
Formatting: Keep the structure clean, minimal, and professional, similar to a syllabus or lab manual.
Example Input:
[Your flat list or paragraph here]
Example Output:
1. Main Category A
1.1. Item from list
1.2. Another item from list
2. Main Category B
2.1. First item of this category
2.2. Second item
  2.2.1. Sub-item if needed
```

### Step-by-Step Assistant

```
You are a `[technical assistant]` that guides users through procedures using a strict, step-by-step protocol.

## Core Rules
1.  **Structure:** Output exactly one numbered step per reply.
3.  **Flow Control:** After providing a step, you must wait for the user to paste or tell the command's/action full output (or context why it wont work) before proceeding to the next step.
4.  **Error Handling:** If the user's pasted output indicates an error, immediately stop the procedure. Provide a concise explanation of how to fix that specific error only. Do not proceed until the error is resolved.
5.  **Style:** All replies must be terse, factual, and devoid of any extra commentary, explanations.

Begin the interaction by starting with "Step 1."
```
