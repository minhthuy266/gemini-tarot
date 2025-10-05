import { GoogleGenAI, Type } from "@google/genai";
import type { TarotCardData, Spread, SpreadInterpretation, CardInterpretation, Position } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper function to generate image URL from card name
const getImageUrlForCard = (cardName: string): string => {
  const baseUrl = "https://www.trustedtarot.com/img/cards/";
  const slug = cardName.toLowerCase().replace(/\s+/g, '-');
  return `${baseUrl}${slug}.png`;
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    cards: {
      type: Type.ARRAY,
      description: "Một mảng các đối tượng diễn giải lá bài, mỗi đối tượng tương ứng với một lá bài được rút theo đúng thứ tự.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "Tên của lá bài tarot."
          },
          upright_meaning: {
            type: Type.STRING,
            description: "Ý nghĩa của lá bài khi nó ở vị trí xuôi, được diễn giải trong bối cảnh vị trí của nó trong lượt giải. Cung cấp một diễn giải súc tích, sâu sắc khoảng 2-3 câu."
          },
          reversed_meaning: {
            type: Type.STRING,
            description: "Ý nghĩa của lá bài khi nó ở vị trí ngược, được diễn giải trong bối cảnh vị trí của nó trong lượt giải. Cung cấp một diễn giải súc tích, sâu sắc khoảng 2-3 câu."
          },
          description: {
            type: Type.STRING,
            description: "Mô tả hình ảnh ngắn gọn về hình ảnh Rider-Waite cổ điển trên lá bài."
          }
        },
        required: ["name", "upright_meaning", "reversed_meaning", "description"],
      }
    },
    summary: {
      type: Type.STRING,
      description: "Một bản tóm tắt tổng thể, mạch lạc của toàn bộ lượt giải bài, kết nối các ý nghĩa của các lá bài với nhau để kể một câu chuyện. Dài khoảng 3-5 câu."
    }
  },
  required: ["cards", "summary"],
};

export const getCardOfTheDayInterpretation = async (card: { name: string; isReversed: boolean }): Promise<{ card: TarotCardData, interpretation: string }> => {
    try {
        const singleCardSchema = {
             type: Type.OBJECT,
             properties: {
                 name: { type: Type.STRING },
                 upright_meaning: { type: Type.STRING },
                 reversed_meaning: { type: Type.STRING },
                 description: { type: Type.STRING },
                 daily_interpretation: { type: Type.STRING }
             },
             required: ["name", "upright_meaning", "reversed_meaning", "description", "daily_interpretation"]
        };

        const prompt = `
            Cung cấp thông tin chi tiết cho lá bài tarot sau đây bằng tiếng Việt: ${card.name}.
            
            Hãy cung cấp những điều sau đây ở định dạng JSON:
            1. Tên lá bài (name): Tên chính xác bằng tiếng Anh như đã cung cấp.
            2. Ý nghĩa xuôi (upright_meaning): Ý nghĩa chung của lá bài khi xuôi (2-3 câu).
            3. Ý nghĩa ngược (reversed_meaning): Ý nghĩa chung của lá bài khi ngược (2-3 câu).
            4. Mô tả (description): Mô tả ngắn gọn về hình ảnh Rider-Waite.
            5. Diễn giải trong ngày (daily_interpretation): Một thông điệp ngắn gọn, sâu sắc (3-4 câu) cho "Lá Bài Của Ngày", dựa trên việc lá bài được rút ${card.isReversed ? 'ngược' : 'xuôi'}.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleCardSchema
            }
        });

        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        const cardDetails = JSON.parse(cleanedJsonText);

        const populatedCard: TarotCardData = {
            ...cardDetails,
            image_url: getImageUrlForCard(card.name),
            position_meaning: "Lá Bài Của Ngày",
            position_description: "Năng lượng chủ đạo cho ngày hôm nay.",
            isReversed: card.isReversed,
        };

        return { card: populatedCard, interpretation: cardDetails.daily_interpretation };

    } catch (error) {
        console.error("Error fetching card of the day interpretation:", error);
        throw new Error("Không thể nhận diễn giải cho Lá Bài Của Ngày.");
    }
};

const cardDetailSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        upright_meaning: { type: Type.STRING },
        reversed_meaning: { type: Type.STRING },
        description: { type: Type.STRING },
    },
    required: ["name", "upright_meaning", "reversed_meaning", "description"]
};

export const getCardDetails = async (cardName: string): Promise<CardInterpretation> => {
    try {
        const prompt = `
            Cung cấp thông tin chi tiết cho lá bài tarot sau đây bằng tiếng Việt: ${cardName}.
            
            Hãy cung cấp những điều sau đây ở định dạng JSON:
            1. Tên lá bài (name): Tên chính xác bằng tiếng Anh như đã cung cấp.
            2. Ý nghĩa xuôi (upright_meaning): Ý nghĩa chung của lá bài khi xuôi (2-4 câu).
            3. Ý nghĩa ngược (reversed_meaning): Ý nghĩa chung của lá bài khi ngược (2-4 câu).
            4. Mô tả (description): Mô tả ngắn gọn về hình ảnh Rider-Waite (2-3 câu).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: cardDetailSchema
            }
        });
        
        const jsonText = response.text.trim();
        const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
        return JSON.parse(cleanedJsonText) as CardInterpretation;

    } catch (error) {
        console.error(`Error fetching details for ${cardName}:`, error);
        throw new Error(`Không thể nhận chi tiết cho lá bài ${cardName}.`);
    }
};


export const getSpreadInterpretation = async (drawnCards: { name: string; isReversed: boolean }[], spread: Spread, theme: string, question: string): Promise<{ cards: TarotCardData[], summary: string }> => {
  try {
    const isFreestyle = spread.name === "Tự Do (Freestyle)";
    let cardPositions: string;
    let positionDescriptions: string;
    let populatedPositions: Position[];

    if (isFreestyle) {
      cardPositions = drawnCards.map((card, index) =>
        `Lá bài ${index + 1}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`
      ).join('\n');
      
      positionDescriptions = "Đây là một lượt giải tự do không có vị trí định trước. Hãy diễn giải các lá bài như một dòng chảy năng lượng hoặc một câu chuyện nối tiếp nhau, liên kết chúng lại với nhau.";

      populatedPositions = drawnCards.map((_, index) => ({
        meaning: `Lá bài ${index + 1}`,
        description: "Diễn giải cho lá bài này trong bối cảnh chung của lượt giải."
      }));
    } else {
      cardPositions = drawnCards.map((card, index) =>
        `Lá bài ${index + 1} (${spread.positions[index].meaning}): ${card.name} ${card.isReversed ? '(Ngược)' : ''}`
      ).join('\n');

      positionDescriptions = spread.positions.map((pos, index) =>
        `Vị trí ${index + 1} - ${pos.meaning}: ${pos.description}`
      ).join('\n');
      
      populatedPositions = spread.positions;
    }
    
    const questionContext = question
      ? `Người dùng đã hỏi một câu hỏi cụ thể: "${question}". Hãy đảm bảo rằng các diễn giải và tóm tắt trả lời trực tiếp cho câu hỏi này trong khi vẫn xem xét chủ đề đã chọn.`
      : `Lượt giải này không có một câu hỏi cụ thể, vì vậy hãy tập trung hoàn toàn vào chủ đề đã chọn.`;

    const prompt = `
      Thực hiện một lượt giải bài tarot bằng tiếng Việt sử dụng kiểu trải bài "${spread.name}".
      
      Chủ đề trọng tâm của lượt giải bài này là về "${theme}". 
      ${questionContext}

      Đây là mô tả về các vị trí trong kiểu trải bài này:
      ${positionDescriptions}

      Đây là các lá bài đã được rút cho mỗi vị trí (một số có thể bị ngược):
      ${cardPositions}

      Vui lòng cung cấp những điều sau đây ở định dạng JSON:
      1. Một đối tượng cho mỗi lá bài đã được rút. Đối với mỗi lá bài, hãy cung cấp tên lá bài **chính xác bằng tiếng Anh như đã cung cấp**, mô tả hình ảnh, và cả ý nghĩa xuôi và ngược. QUAN TRỌNG: Khi diễn giải ý nghĩa, hãy tập trung vào ý nghĩa phù hợp (xuôi hoặc ngược dựa trên cách nó được rút ra) và giải thích nó ${isFreestyle ? "trong sự liên kết với các lá bài khác để tạo thành một câu chuyện" : "trong bối cảnh vị trí cụ thể của lá bài trong lượt giải"}, chủ đề đã chọn và câu hỏi của người dùng (nếu có).
      2. Một bản tóm tắt tổng thể cho toàn bộ lượt giải bài, kết hợp ý nghĩa của các lá bài để tạo thành một câu chuyện mạch lạc và trả lời trực tiếp câu hỏi của người dùng (nếu có).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const interpretation = JSON.parse(cleanedJsonText) as SpreadInterpretation;

    const populatedCards: TarotCardData[] = interpretation.cards.map((card, index) => ({
        ...card,
        image_url: getImageUrlForCard(drawnCards[index].name),
        position_meaning: populatedPositions[index].meaning,
        position_description: populatedPositions[index].description,
        isReversed: drawnCards[index].isReversed,
    }));

    return { cards: populatedCards, summary: interpretation.summary };

  } catch (error) {
    console.error("Error fetching spread interpretation:", error);
    throw new Error("Không thể nhận diễn giải từ Gemini API. Vui lòng kiểm tra API key và kết nối mạng của bạn.");
  }
};