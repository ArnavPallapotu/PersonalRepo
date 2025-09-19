import os
from typing import List
from litellm import completion

DEFAULT_API_BASE = "http://localhost:11434"

class TroubleBot:
    def __init__(self, model="ollama/llama3", api_base=DEFAULT_API_BASE, context_files: List[str]=None):
        self.model = model
        self.context = ""
        self.api_base = api_base
        if context_files:
            self.load_context(context_files)

    def load_context(self, files: List[str]):
        context_chunks = []
        for file in files:
            if os.path.exists(file):
                with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                    context_chunks.append(f"\n---\n{file}:\n" + f.read())
        self.context = "\n".join(context_chunks)

    def ask(self, question: str) -> str:
        prompt = f"""You are a helpful troubleshooting chatbot for computer science students in del norte high school (DNHS).
        Use the following context to answer the question.
        \n\nContext:\n{self.context}
        \n\nQuestion: {question}
        \nAnswer:"""
        response = completion(
            model=self.model,
            api_base=self.api_base,
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        return response['choices'][0]['message']['content']
