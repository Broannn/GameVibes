import { gameData } from '../data/games';

interface Game {
  id: string;
  title: string;
  year: number;
  description: string;
  coverImage: string;
  tracks: Array<{
    emotions: {
      joy: number;
      wonder: number;
      anxiety: number;
      sadness: number;
      dynamism: number;
    };
  }>;
}

// Calcule la similarité émotionnelle entre deux jeux
const calculateEmotionalSimilarity = (game1: Game, game2: Game): number => {
  const emotions1 = game1.tracks.reduce(
    (acc, track) => ({
      joy: acc.joy + track.emotions.joy,
      wonder: acc.wonder + track.emotions.wonder,
      anxiety: acc.anxiety + track.emotions.anxiety,
      sadness: acc.sadness + track.emotions.sadness,
      dynamism: acc.dynamism + track.emotions.dynamism,
    }),
    { joy: 0, wonder: 0, anxiety: 0, sadness: 0, dynamism: 0 }
  );

  const emotions2 = game2.tracks.reduce(
    (acc, track) => ({
      joy: acc.joy + track.emotions.joy,
      wonder: acc.wonder + track.emotions.wonder,
      anxiety: acc.anxiety + track.emotions.anxiety,
      sadness: acc.sadness + track.emotions.sadness,
      dynamism: acc.dynamism + track.emotions.dynamism,
    }),
    { joy: 0, wonder: 0, anxiety: 0, sadness: 0, dynamism: 0 }
  );

  // Normaliser les valeurs
  Object.keys(emotions1).forEach((key) => {
    emotions1[key as keyof typeof emotions1] /= game1.tracks.length;
    emotions2[key as keyof typeof emotions2] /= game2.tracks.length;
  });

  // Calculer la distance euclidienne entre les profils émotionnels
  const distance = Math.sqrt(
    Object.keys(emotions1).reduce((sum, key) => {
      const diff = emotions1[key as keyof typeof emotions1] - emotions2[key as keyof typeof emotions2];
      return sum + diff * diff;
    }, 0)
  );

  // Convertir la distance en score de similarité (0 à 1)
  return 1 / (1 + distance);
};

// Calcule la similarité temporelle entre deux jeux
const calculateTemporalSimilarity = (year1: number, year2: number): number => {
  const yearDiff = Math.abs(year1 - year2);
  return Math.max(0, 1 - yearDiff / 5); // 5 ans de différence max
};

// Calcule la similarité thématique basée sur la description
const calculateThematicSimilarity = (desc1: string, desc2: string): number => {
  const words1 = new Set(desc1.toLowerCase().split(/\W+/));
  const words2 = new Set(desc2.toLowerCase().split(/\W+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
};

export const getSimilarGames = (currentGame: Game, maxRecommendations: number = 4): Game[] => {
  const otherGames = gameData.filter(game => game.id !== currentGame.id);
  
  const gameScores = otherGames.map(game => {
    const emotionalSimilarity = calculateEmotionalSimilarity(currentGame, game);
    const temporalSimilarity = calculateTemporalSimilarity(currentGame.year, game.year);
    const thematicSimilarity = calculateThematicSimilarity(currentGame.description, game.description);

    // Pondération des différents critères
    const totalScore = (
      emotionalSimilarity * 0.5 + // L'émotion est le critère le plus important
      temporalSimilarity * 0.2 +  // La période de sortie a une importance moyenne
      thematicSimilarity * 0.3    // La thématique a une importance significative
    );

    return {
      game,
      score: totalScore
    };
  });

  // Trier par score et prendre les N meilleurs
  return gameScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations)
    .map(item => item.game);
};