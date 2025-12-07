import { FunctionDeclaration, GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { useAppStore } from '../store';
import { ShapeType } from '../types';

// Function Definition for Gemini to call
const updateDisplayFunction: FunctionDeclaration = {
  name: 'updateDisplay',
  parameters: {
    type: Type.OBJECT,
    description: 'Update the particle system shape and color based on the user request.',
    properties: {
      shape: {
        type: Type.STRING,
        enum: Object.values(ShapeType),
        description: 'The geometric shape to form.',
      },
      color: {
        type: Type.STRING,
        description: 'The hex color code for the particles (e.g., #FF0000).',
      },
    },
    required: ['shape'],
  },
};

let session: any = null;
let audioContext: AudioContext | null = null;
let inputProcessor: ScriptProcessorNode | null = null;
let stream: MediaStream | null = null;

export const connectToGemini = async () => {
  if (!process.env.API_KEY) {
    console.error("API Key not found");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config = {
    responseModalities: [Modality.AUDIO],
    tools: [{ functionDeclarations: [updateDisplayFunction] }],
    systemInstruction: "你现在是贾维斯(Jarvis)，斯塔克工业的高级人工智能助手。你的任务是协助用户控制全息粒子系统。用户会通过语音要求改变形状或颜色。请务必调用 `updateDisplay` 函数来响应用户的请求。保持回复简短、专业、富有科技感。如果用户提到圣诞节，建议使用红色/绿色的花朵或爱心。如果提到新年，建议使用金色的烟花。使用中文回答用户的中文指令。",
  };

  try {
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config,
      callbacks: {
        onopen: async () => {
            console.log("Gemini Connected");
            useAppStore.getState().setIsAiConnected(true);
            await startAudioStream(sessionPromise);
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle Function Calls
          if (message.toolCall) {
            for (const fc of message.toolCall.functionCalls) {
              if (fc.name === 'updateDisplay') {
                const args = fc.args as any;
                console.log("Gemini Command:", args);
                
                // Update State
                if (args.shape) useAppStore.getState().setShape(args.shape as ShapeType);
                if (args.color) useAppStore.getState().setColor(args.color);

                // Send success response
                sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: {
                        id: fc.id,
                        name: fc.name,
                        response: { result: "Display updated successfully" }
                    }
                }));
              }
            }
          }
          
          // Handle Audio Output (Optional - for this demo we focus on control, not playback to keep it simple, 
          // but strictly we should play the response. For brevity in this code block, we just log.)
        },
        onclose: () => {
            console.log("Gemini Disconnected");
            useAppStore.getState().setIsAiConnected(false);
            stopAudioStream();
        },
        onerror: (err) => {
            console.error("Gemini Error", err);
            useAppStore.getState().setIsAiConnected(false);
            stopAudioStream();
        }
      }
    });
    
    session = await sessionPromise;

  } catch (error) {
    console.error("Connection failed", error);
    useAppStore.getState().setIsAiConnected(false);
  }
};

export const disconnectGemini = () => {
    if (session) {
        // session.close(); // No close method on session object directly in some versions, but we can close stream
        stopAudioStream();
        session = null;
    }
    useAppStore.getState().setIsAiConnected(false);
};

// Audio Streaming Helpers
const startAudioStream = async (sessionPromise: Promise<any>) => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        
        inputProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        inputProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Send raw PCM
            const b64 = float32ToBase64(inputData);
            
            sessionPromise.then(s => s.sendRealtimeInput({
                media: {
                    mimeType: "audio/pcm;rate=16000",
                    data: b64
                }
            }));
        };
        
        source.connect(inputProcessor);
        inputProcessor.connect(audioContext.destination); // Connect to destination to keep it alive
    } catch (e) {
        console.error("Mic Error", e);
    }
};

const stopAudioStream = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (inputProcessor) inputProcessor.disconnect();
    if (audioContext) audioContext.close();
    stream = null;
    inputProcessor = null;
    audioContext = null;
};

// Convert Float32 Audio to Base64 PCM 16-bit for Gemini
function float32ToBase64(buffer: Float32Array) {
    const l = buffer.length;
    const buf = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        let s = Math.max(-1, Math.min(1, buffer[i]));
        buf[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    let binary = '';
    const bytes = new Uint8Array(buf.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}