import type { Spread } from './types';

export const TAROT_DECK = [
  // Major Arcana
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Heirophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
  // Wands
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
  "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
  "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
  // Cups
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
  "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
  "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
  // Swords
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
  "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
  "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
  // Pentacles
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
  "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
  "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

export const SPREADS: Spread[] = [
  {
    name: "Một Lá Bài",
    cardCount: 1,
    description: "Một lượt rút nhanh để có câu trả lời tập trung hoặc nguồn cảm hứng hàng ngày.",
    positions: [
      { meaning: "Lá Bài Chính", description: "Bản chất cốt lõi của câu hỏi của bạn hoặc năng lượng chi phối trong ngày." }
    ],
    themes: ['Tổng quan', 'Tình yêu', 'Sự nghiệp', 'Tài chính']
  },
  {
    name: "Ba Lá Bài",
    cardCount: 3,
    description: "Khám phá quá khứ, hiện tại và tương lai của một tình huống.",
    positions: [
      { meaning: "Quá khứ", description: "Những ảnh hưởng trong quá khứ tác động đến tình hình hiện tại." },
      { meaning: "Hiện tại", description: "Tình hình hiện tại và những thách thức hoặc cơ hội trước mắt." },
      { meaning: "Tương lai", description: "Kết quả tiềm năng nếu mọi việc tiếp tục theo con đường hiện tại." }
    ],
    themes: ['Tổng quan', 'Tình yêu', 'Sự nghiệp', 'Tài chính']
  },
  {
    name: "Tự Do (Freestyle)",
    cardCount: 78, // Số lá tối đa, giao diện người dùng sẽ kiểm soát việc kết thúc
    description: "Rút bao nhiêu lá bài tùy thích để khám phá câu hỏi của bạn một cách tự do, không bị giới hạn bởi các vị trí cố định.",
    positions: [ // Một vị trí chung chung để làm mẫu
      { meaning: "Lá Bài", description: "Diễn giải cho lá bài này trong bối cảnh chung của lượt giải." }
    ],
    themes: ['Tổng quan', 'Tình yêu', 'Sự nghiệp', 'Tài chính']
  },
  {
    name: "La Bàn Tình Yêu",
    cardCount: 5,
    description: "Làm sáng tỏ động lực trong mối quan hệ của bạn với người khác.",
    positions: [
        { meaning: "Bạn", description: "Vai trò và cảm xúc của bạn trong mối quan hệ." },
        { meaning: "Người Ấy", description: "Vai trò và cảm xúc của người kia." },
        { meaning: "Sợi Dây Liên Kết", description: "Năng lượng kết nối hai bạn ở hiện tại." },
        { meaning: "Thử Thách", description: "Trở ngại chính cần phải vượt qua." },
        { meaning: "Hướng Đi Tương Lai", description: "Kết quả hoặc hướng phát triển tiềm năng của mối quan hệ." }
    ],
    themes: ['Tình yêu']
  },
  {
    name: "Con Đường Sự Nghiệp",
    cardCount: 5,
    description: "Nhận lời khuyên và định hướng cho con đường công danh sự nghiệp.",
    positions: [
        { meaning: "Hiện Tại", description: "Tình hình công việc hiện tại của bạn." },
        { meaning: "Điểm Mạnh", description: "Kỹ năng và tài năng bạn nên phát huy." },
        { meaning: "Trở Ngại", description: "Những thách thức đang cản bước bạn." },
        { meaning: "Lời Khuyên", description: "Hành động bạn nên thực hiện để phát triển." },
        { meaning: "Tiềm Năng", description: "Vị trí hoặc thành tựu bạn có thể đạt được." }
    ],
    themes: ['Sự nghiệp']
  },
  {
    name: "Ngã Rẽ Cuộc Đời",
    cardCount: 7,
    description: "Một cái nhìn chi tiết về một tình huống để giúp bạn đưa ra quyết định sáng suốt.",
    positions: [
      { meaning: "Tình hình Quá khứ", description: "Các sự kiện trong quá khứ dẫn đến tình huống hiện tại." },
      { meaning: "Vấn đề Hiện tại", description: "Bản chất cốt lõi của vấn đề bạn đang đối mặt." },
      { meaning: "Điều đang đến", description: "Những gì sẽ sớm xảy ra trong tương lai gần." },
      { meaning: "Lời khuyên Tốt nhất", description: "Hướng hành động được đề xuất cho bạn." },
      { meaning: "Ảnh hưởng từ Môi trường", description: "Những yếu tố bên ngoài tác động đến bạn." },
      { meaning: "Hy vọng & Nỗi sợ", description: "Điều bạn mong muốn và lo sợ nhất về kết quả." },
      { meaning: "Kết quả Cuối cùng", description: "Kết quả có khả năng xảy ra nhất nếu bạn đi theo lời khuyên." }
    ],
    themes: ['Tổng quan']
  },
  {
    name: "Thập tự Celtic",
    cardCount: 10,
    description: "Một lượt giải bài toàn diện để phân tích sâu sắc một vấn đề.",
    positions: [
      { meaning: "Hiện tại / Trái tim của vấn đề", description: "Bản chất cốt lõõi của tình huống hoặc câu hỏi." },
      { meaning: "Thách thức", description: "Trở ngại hoặc xung đột ngay trước mắt cần phải vượt qua." },
      { meaning: "Nền tảng / Gốc rễ", description: "Những sự kiện trong quá khứ xa xôi hoặc các vấn đề cốt lõi làm nền tảng cho tình huống." },
      { meaning: "Quá khứ gần đây", description: "Những sự kiện hoặc cảm xúc vừa mới trôi qua, ảnh hưởng đến hiện tại." },
      { meaning: "Kết quả tiềm năng / Vương miện", description: "Kết quả tốt nhất có thể đạt được hoặc những mục tiêu cần hướng tới." },
      { meaning: "Tương lai gần", description: "Những gì có khả năng xảy ra trong tương lai gần." },
      { meaning: "Bạn / Người hỏi", description: "Quan điểm, thái độ hoặc vai trò của bạn trong tình huống." },
      { meaning: "Môi trường / Ảnh hưởng bên ngoài", description: "Con người, nơi chốn hoặc hoàn cảnh ảnh hưởng đến tình huống." },
      { meaning: "Hy vọng và Nỗi sợ", description: "Hy vọng và nỗi sợ hãi sâu sắc nhất của bạn liên quan đến kết quả." },
      { meaning: "Kết quả cuối cùng", description: "Kết quả có khả năng xảy ra nhất, tổng hợp tất cả các lá bài khác." }
    ],
    themes: ['Tổng quan', 'Tình yêu', 'Sự nghiệp']
  }
];