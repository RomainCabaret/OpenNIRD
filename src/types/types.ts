export interface IQuiz {
  id: number;
  question: string;
  answer1: string;
  answer2: string;
  answer3?: string;
  correctAnswer: string;
}

export interface IQuizCorrect {
  id: number;
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswers: string[];
}

export interface IParcours {
  id: number;
  name: string;
  img: string;
  description: string;
  quizList: IQuiz[];
  quizCorrectList: IQuizCorrect[];
  allQuizzes?: [];
}

export interface Level {
  id: number;
  name: string;
  description: string;
  image: string;
  collectibles: number;
  collected: number;
  difficulty: number;
  character: string;
  lat: number;
  lon: number;
}
