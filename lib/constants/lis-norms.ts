// eFondaMental Platform - LIS (Lecture d'Intentions Sociales) Normative Data
// Social cognition test assessing theory of mind through film scenarios
// Reference: French normative study

// ============================================================================
// Types
// ============================================================================

export interface LisFilmItem {
  id: string;           // e.g., 'lis_a1'
  ordre: number;        // Display order
  text: string;         // Explanation text
  normativeValue: number; // Expected response from healthy controls
}

export interface LisFilm {
  filmId: string;       // A, B, C, D, E, F
  title: string;        // Film title in French
  question: string;     // Main question for the film
  items: LisFilmItem[];
}

// ============================================================================
// Response Scale
// ============================================================================

export const LIS_RESPONSE_SCALE = {
  options: [
    { value: 1, label: 'Très peu probable' },
    { value: 2, label: 'Peu probable' },
    { value: 3, label: 'Probable' },
    { value: 4, label: 'Très probable' }
  ],
  min: 1,
  max: 4
};

// ============================================================================
// Film Scenarios with Normative Values
// ============================================================================

export const LIS_FILMS: LisFilm[] = [
  // Film A: L'amende
  {
    filmId: 'A',
    title: "L'amende",
    question: "Pourquoi l'homme parle-t-il de son fils au policier ?",
    items: [
      {
        id: 'lis_a1',
        ordre: 1,
        text: "1. parce qu'ils se connaissent et qu'il veut lui donner des nouvelles",
        normativeValue: 1.0
      },
      {
        id: 'lis_a2',
        ordre: 2,
        text: "2. pour l'attendrir, pour que le policier ne le sanctionne pas",
        normativeValue: 3.8
      },
      {
        id: 'lis_a3',
        ordre: 3,
        text: "3. parce que l'homme est tellement inquiet pour son fils qu'il en parle à tous les gens qu'il rencontre",
        normativeValue: 2.6
      },
      {
        id: 'lis_a4',
        ordre: 4,
        text: "4. parce qu'il est fier de son fils",
        normativeValue: 1.466667
      },
      {
        id: 'lis_a5',
        ordre: 5,
        text: "5. parce qu'il n'a pas remarqué qu'il parle à un policier",
        normativeValue: 1.0
      }
    ]
  },
  // Film B: Le hoquet
  {
    filmId: 'B',
    title: 'Le hoquet',
    question: 'Pourquoi le mari fait-il un mouvement brusque ?',
    items: [
      {
        id: 'lis_b1',
        ordre: 1,
        text: "1. pour faire peur à sa femme afin que son hoquet s'arrête",
        normativeValue: 3.066667
      },
      {
        id: 'lis_b2',
        ordre: 2,
        text: '2. pour faire une blague à sa femme',
        normativeValue: 1.066667
      },
      {
        id: 'lis_b3',
        ordre: 3,
        text: "3. parce qu'il est énervé",
        normativeValue: 3.733333
      },
      {
        id: 'lis_b4',
        ordre: 4,
        text: '4. parce que ça lui arrive de temps en temps sans raison',
        normativeValue: 1.2
      },
      {
        id: 'lis_b5',
        ordre: 5,
        text: "5. parce qu'il est en colère contre elle",
        normativeValue: 3.266667
      }
    ]
  },
  // Film C: La blessure
  {
    filmId: 'C',
    title: 'La blessure',
    question: "Pourquoi la femme insiste-t-elle tant pour emmener l'homme se faire soigner ?",
    items: [
      {
        id: 'lis_c1',
        ordre: 1,
        text: '1. parce que sa blessure est grave',
        normativeValue: 1.066667
      },
      {
        id: 'lis_c2',
        ordre: 2,
        text: "2. parce qu'elle est du genre à paniquer",
        normativeValue: 1.066667
      },
      {
        id: 'lis_c3',
        ordre: 3,
        text: "3. parce qu'elle veut être seule avec lui",
        normativeValue: 3.866667
      },
      {
        id: 'lis_c4',
        ordre: 4,
        text: "4. parce qu'elle se moque de lui",
        normativeValue: 1.933333
      },
      {
        id: 'lis_c5',
        ordre: 5,
        text: "5. parce qu'elle est tombée amoureuse de lui",
        normativeValue: 2.4
      }
    ]
  },
  // Film D: Le col remonté
  {
    filmId: 'D',
    title: 'Le col remonté',
    question: "Pourquoi l'homme met-il ses lunettes de soleil et relève-t-il le col de son manteau ?",
    items: [
      {
        id: 'lis_d1',
        ordre: 1,
        text: "1. parce qu'il va sortir dehors et qu'il fait froid",
        normativeValue: 1.2
      },
      {
        id: 'lis_d2',
        ordre: 2,
        text: '2. parce que ses yeux sont fragiles',
        normativeValue: 1.266667
      },
      {
        id: 'lis_d3',
        ordre: 3,
        text: '3. pour se donner un genre',
        normativeValue: 1.866667
      },
      {
        id: 'lis_d4',
        ordre: 4,
        text: '4. pour passer inaperçu',
        normativeValue: 3.4
      },
      {
        id: 'lis_d5',
        ordre: 5,
        text: "5. pour qu'on ne le reconnaisse pas",
        normativeValue: 3.8
      }
    ]
  },
  // Film E: Les cafés
  {
    filmId: 'E',
    title: 'Les cafés',
    question: 'Pourquoi la serveuse repart-elle avec ses cafés ?',
    items: [
      {
        id: 'lis_e1',
        ordre: 1,
        text: "1. parce qu'elle a eu peur",
        normativeValue: 3.066667
      },
      {
        id: 'lis_e2',
        ordre: 2,
        text: "2. parce qu'elle s'est trompée de table",
        normativeValue: 1.133333
      },
      {
        id: 'lis_e3',
        ordre: 3,
        text: '3. pour ne pas déranger le couple dans un moment pareil',
        normativeValue: 3.733333
      },
      {
        id: 'lis_e4',
        ordre: 4,
        text: '4. parce que ses cafés sont déjà froids',
        normativeValue: 1.0
      },
      {
        id: 'lis_e5',
        ordre: 5,
        text: "5. parce que les cafés se sont renversés dans le sursaut, elle doit aller en faire d'autres",
        normativeValue: 1.933333
      }
    ]
  },
  // Film F: La salle de bain
  {
    filmId: 'F',
    title: 'La salle de bain',
    question: 'Pourquoi enferme-t-il la femme dans la salle de bain ?',
    items: [
      {
        id: 'lis_f1',
        ordre: 1,
        text: "1. pour être certain qu'elle ne se sauve pas pendant son absence",
        normativeValue: 1.0
      },
      {
        id: 'lis_f2',
        ordre: 2,
        text: "2. parce qu'il est en retard",
        normativeValue: 1.133333
      },
      {
        id: 'lis_f3',
        ordre: 3,
        text: '3. pour que la femme qui arrive ne la voit pas',
        normativeValue: 4.0
      },
      {
        id: 'lis_f4',
        ordre: 4,
        text: "4. pour que la femme qui arrive ne sache pas qu'il dormait avec elle",
        normativeValue: 3.666667
      },
      {
        id: 'lis_f5',
        ordre: 5,
        text: "5. pour qu'elle se lave",
        normativeValue: 1.066667
      }
    ]
  }
];

// ============================================================================
// Flattened Normative Values Map (for easy lookup)
// ============================================================================

export const LIS_NORMATIVE_VALUES: Record<string, number> = {};

// Populate the map from films
LIS_FILMS.forEach(film => {
  film.items.forEach(item => {
    LIS_NORMATIVE_VALUES[item.id] = item.normativeValue;
  });
});

// ============================================================================
// All Item IDs (in order)
// ============================================================================

export const LIS_ITEM_IDS = [
  // Film A
  'lis_a1', 'lis_a2', 'lis_a3', 'lis_a4', 'lis_a5',
  // Film B
  'lis_b1', 'lis_b2', 'lis_b3', 'lis_b4', 'lis_b5',
  // Film C
  'lis_c1', 'lis_c2', 'lis_c3', 'lis_c4', 'lis_c5',
  // Film D
  'lis_d1', 'lis_d2', 'lis_d3', 'lis_d4', 'lis_d5',
  // Film E
  'lis_e1', 'lis_e2', 'lis_e3', 'lis_e4', 'lis_e5',
  // Film F
  'lis_f1', 'lis_f2', 'lis_f3', 'lis_f4', 'lis_f5'
] as const;

export type LisItemId = typeof LIS_ITEM_IDS[number];

// ============================================================================
// Metadata
// ============================================================================

export const LIS_METADATA = {
  totalItems: 30,
  totalFilms: 6,
  itemsPerFilm: 5,
  responseScale: LIS_RESPONSE_SCALE,
  scoringDescription: 'Total deviation from normative values. Lower = better social cognition.',
  perfectScore: 0,
  interpretation: {
    lowerIsBetter: true,
    description: 'A score of 0 indicates perfect agreement with normative responses. Higher scores indicate greater difficulty reading social intentions.'
  }
};
