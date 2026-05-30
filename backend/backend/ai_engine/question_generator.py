import random

def generate_questions():
    questions = [
        "What is Stack?",
        "Explain Queue",
        "What is Binary Search?"
    ]
    return random.sample(questions, 2)