import http from "../../utils/http";


// API functions - updated according to your new routes
export const getAllChatsApi = async () => {
    const response = await http.get('/gemini/allchat');
    return response.data;
}

export const createNewChatApi = async (message) => {
  try {
    const response = await http.post('/gemini/createnewchat', {
      message: message
    });
    return response.data;
  } catch (error) {
    console.error('Create new chat API error:', error);
    throw error;
  }
};

export const getChatByIdApi = async (chatId) => {
    const response = await http.get(`/gemini/getchat/${chatId}`);
    return response.data;
}

export const sendMessageApi = async (chatId, message) => {
    const response = await http.post(`/gemini/sendmessage/${chatId}/message`, { message });
    return response.data;
}

export const deleteChatApi = async (chatId) => {
    const response = await http.delete(`/gemini/deletechat/${chatId}`);
    return response.data;
}

// 2. FIXED chatApi.js - Handle empty or undefined chunks properly
export const sendMessageStreamApi = (chatId, message, onChunk, onComplete, onError) => {
  const baseURL = import.meta.env.VITE_BACKEND_PORT;
  const url = `${baseURL}/gemini/sendmessage/${chatId}/stream`;
  
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = ""; // Track the complete message
      
      function readStream() {
        return reader.read().then(({ done, value }) => {
          if (done) {
            console.log('✅ Stream completed. Full message:', fullMessage);
            onComplete?.({ fullMessage });
            resolve({ fullMessage });
            return;
          }
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log('📨 Received chunk data:', data);
                
                if (data.error) {
                  console.error('❌ Stream error:', data.error);
                  onError?.(data.error);
                  reject(new Error(data.error));
                  return;
                }
                
                if (data.done) {
                  console.log('✅ Stream done signal received');
                  onComplete?.(data);
                  resolve(data);
                  return;
                }
                
                // ✅ SAFETY CHECK: Handle content properly
                if (data.content !== undefined && data.content !== null) {
                  const contentChunk = String(data.content); // Ensure it's a string
                  fullMessage += contentChunk;
                  console.log('📝 Adding chunk:', { chunk: contentChunk, total: fullMessage.length });
                  onChunk?.(contentChunk);
                } else if (data.content === "") {
                  // Even empty strings should be processed
                  onChunk?.("");
                } else {
                  console.warn('⚠️ Received chunk with no content:', data);
                }
              } catch (parseError) {
                console.warn('⚠️ Failed to parse SSE data:', line, parseError);
              }
            }
          }
          
          return readStream();
        });
      }
      return readStream();
    })
    .catch(error => {
      console.error('❌ Streaming error:', error);
      onError?.(error.message);
      reject(error);
    });
  });
};