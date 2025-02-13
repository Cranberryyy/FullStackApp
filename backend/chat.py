from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from concurrent.futures import ThreadPoolExecutor
import os

# LangChain Imports
from langchain_community.llms import HuggingFacePipeline
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
# from langchain.output_parsers import CommaSeparatedListOutputParser
from langchain_core.output_parsers import StrOutputParser

# 打印当前缓存目录路径
print(f"Current cache directory: {os.getenv('TRANSFORMERS_CACHE', 'models/transformers')}")

# 线程池，最多支持 5 个并发请求
# executor = ThreadPoolExecutor(max_workers=5)

# 预加载模型
chatbot_model = pipeline("text-generation", model="gpt2")
qa_model = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

# 初始化 LangChain 与本地 GPT-2 模型
model_name = "gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)
hf_pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_new_tokens=50,   # 只允许最多生成 20 个 token，避免过长
    temperature=0.3,      # 保持适度的随机性
    top_p=0.9,            # 控制采样范围，减少模式化输出
)


llm = HuggingFacePipeline(pipeline=hf_pipeline)

# ✅ 使用 ChatPromptTemplate 组织 Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are Chatbot-GPT2, a helpful and smart AI assistant. 
    Follow these rules:
    1. **Answer the question accurately based on knowledge.** Do not generate random numbers.
    2. Keep responses **short and polite**.
    3. If you do not know the answer, say **"I'm not sure."**
    4. **Do NOT be "Human:" or generate additional questions.** 
    5. **Only provide an answer. Do not continue the conversation.**
    6. **Never repeat "AI: AI:" or start responses with "AI: AI:"**.

    Example conversation:
    Human: What is 2+2?
    AI: 4.

    Let's start!"""),

    ("human", "{question}"),
])



output_parser = StrOutputParser()

def get_chatbot_response(message):
    """
    异步调用 AI 模型，生成聊天回复
    """
    future = executor.submit(chatbot_model, message, max_length=100, do_sample=True)
    response = future.result()  # 获取异步结果
    return response[0]['generated_text']

def get_qa_response(question, context):
    """
    异步调用 QA 模型，生成回答
    """
    future = executor.submit(qa_model, question=question, context=context)
    response = future.result()  # 获取异步结果
    return response['answer']

def get_langchain_response(message):
    """
    使用 LangChain 生成响应并解析为列表
    """
    final_prompt = prompt.invoke({"question": message})
    response = llm.invoke(final_prompt)
    parsed_response = response.strip().split("\n")[0]
    # parsed_response = output_parser.invoke(response)

    return parsed_response

# 测试调用
message = "Which city is the capital city of China?"
result = get_langchain_response(message)
print("解析后的结果:", result)
