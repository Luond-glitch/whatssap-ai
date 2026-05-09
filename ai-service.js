const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class AIService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async analyzeMessage(messageText) {
        const prompt = `
        Analyze this message and return a JSON response:
        Message: "${messageText}"
        
        Determine:
        1. intent: (reminder, question, conversation)
        2. has_deadline: (true/false)
        3. extracted_date: (if deadline mentioned, extract date in YYYY-MM-DD format)
        4. extracted_time: (if time mentioned, extract in HH:MM format)
        5. task_description: (brief description of any task)
        6. reply: (a helpful response appropriate to the message)
        
        Return ONLY valid JSON.`;
        
        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    }
    
    async generateReply(messageText, context) {
        const prompt = `
        You are a helpful WhatsApp assistant. 
        User said: "${messageText}"
        Previous context: ${context || 'None'}
        
        Generate a natural, helpful response. Keep it brief (1-2 sentences).
        `;
        
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }
}

module.exports = new AIService();
