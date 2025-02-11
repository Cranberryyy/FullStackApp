from transformers import pipeline
from concurrent.futures import ThreadPoolExecutor
import os

# 打印当前缓存目录路径
print(f"Current cache directory: {os.getenv('TRANSFORMERS_CACHE', 'models/transformers')}")

# 线程池，最多支持 5 个并发请求
executor = ThreadPoolExecutor(max_workers=5)

# 预加载模型
chatbot_model = pipeline("text-generation", model="gpt2")

def get_chatbot_response(message):
    """
    异步调用 AI 模型，生成聊天回复
    """
    future = executor.submit(chatbot_model, message, max_length=100, do_sample=True)
    response = future.result()  # 获取异步结果
    return response[0]['generated_text']
