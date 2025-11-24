import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Fallback to empty string if undefined
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (productName: string, features: string): Promise<string> => {
  if (!apiKey) return "Vui lòng cấu hình API Key để sử dụng tính năng AI.";

  try {
    const prompt = `
      Bạn là một chuyên gia marketing cho một trang web thương mại điện tử.
      Hãy viết một mô tả sản phẩm hấp dẫn, chuyên nghiệp và ngắn gọn (khoảng 100-150 từ) bằng tiếng Việt cho sản phẩm sau:
      - Tên sản phẩm: ${productName}
      - Đặc điểm chính: ${features}
      
      Hãy tập trung vào lợi ích khách hàng, sử dụng biểu tượng cảm xúc (emoji) phù hợp để làm cho văn bản sinh động.
      Không cần tiêu đề, chỉ cần nội dung mô tả.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Không thể tạo mô tả lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi tạo mô tả tự động.";
  }
};

export const askAiAboutProduct = async (productName: string, description: string, question: string): Promise<string> => {
    if (!apiKey) return "Vui lòng cấu hình API Key.";

    try {
        const prompt = `
          Khách hàng đang xem sản phẩm: "${productName}".
          Mô tả sản phẩm: "${description}".
          
          Khách hàng hỏi: "${question}"
          
          Hãy trả lời câu hỏi của khách hàng một cách thân thiện, hữu ích và ngắn gọn như một nhân viên tư vấn bán hàng chuyên nghiệp.
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
    
        return response.text || "Tôi không có câu trả lời cho vấn đề này.";
      } catch (error) {
        console.error("Gemini Error:", error);
        return "Xin lỗi, tôi đang gặp sự cố kết nối.";
      }
}
