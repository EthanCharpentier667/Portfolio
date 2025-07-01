import team from '../data/TeamMateData'

const planetData = [
  {
    name: "Wolf3D",
    size: 0.7,
    distance: 9,
    speed: 0.2,
    color: "#ff6b6b",
    hasRings: false,
    hasAtmosphere: false,
    materialType: 'matrix',
    rotationSpeed: 0.015,
    icon: "🎮",
    description: "Conception d'un jeu en CSFML, reproduisant le jeu Wolfenstein 3D.",
    theme: {
      primary: '#ff6b6b',
      secondary: '#ff9999',
      accent: '#ffcccc',
      emissive: '#330000'
    },
    shaderVars: {
      noiseScale: 12.0,
      animSpeed: 0.55,
      rimPower: 3,
      emissiveStrength: 0.3
    },
    projectDetails: {
      technologies: ['C', 'CSFML', 'Makefile', 'Github', 'Linux'],
      features: [
        'Moteur de rendu 3D from scratch (CSFML)',
        'Système de collision avancé',
        'Interface utilisateur immersive',
        'Gestion des textures et sprites',
        'Système audio intégré'
      ],
      challenges: [
        'Algorithme de raycasting',
        'Optimisation des performances',
        'Gestion mémoire en C',
        'Architecture modulaire'
      ],
      stats: {
        'Partenaires': '2',
        'FPS moyen': '60 FPS',
        'Temps de développement': '6 semaines',
        'Note du projet': 'Meilleur projet'
      }
    },
    satellites: [
      team[0],
      team[1],
    ],
    link: "https://github.com/EthanCharpentier667/Wolf3D-action",
    image: "/images/projects/3.png",
    texture: "/planets/mars.png",
    status: 'done'
  },
  {
    name: 'Tardis',
    distance: 7.5,
    size: 0.6,
    color: '#60a5fa',
    speed: 0.23,
    icon: '🚆',
    description: 'Analyse de données de retards ferroviaires et développement d’un modèle prédictif avec scikit-learn. Création d’un tableau de bord interactif avec Streamlit pour visualiser les retards et fournir des prédictions en temps réel.',
    hasRings: false,
    ringColor: "#60a5fa",
    hasAtmosphere: true,
    materialType: 'none',
    rotationSpeed: 0.018,
    theme: {
      primary: '#60a5fa',
      secondary: '#93c5fd',
      accent: '#dbeafe',
      emissive: '#001133'
    },
    shaderVars: {
      noiseScale: 12.0,
      animSpeed: 1,
      rimPower: 1,
      emissiveStrength: 0.1
    },
    projectDetails: {
      technologies: [
        'Python', 
        'Streamlit', 
        'Scikit-learn', 
        'Pandas', 
        'Matplotlib', 
        'Seaborn'
      ],
      features: [
        'Prétraitement des données (nettoyage, transformation)',
        'Analyse exploratoire complète avec visualisations interactives',
        'Modèle de machine learning pour prédire les retards',
        'Tableau de bord Streamlit responsive avec filtres dynamiques',
        'Export CSV automatisé et prédictions en temps réel'
      ],
      challenges: [
        'Nettoyage de données complexes et bruitées',
        'Sélection de variables pertinentes pour le modèle',
        'Évaluation de plusieurs modèles (Régression, Arbres, Forêts)',
        'Intégration complète du modèle dans l’interface Streamlit',
        'Conformité aux contraintes sans fichiers annexes ni sérialisation'
      ],
      stats: {
        'Lignes de code': '2,500+',
        'Précision du modèle': '99%',
        'Délais moyens traités': '1M+',
        'Temps de développement': '6 semaines'
      }
    },
    satellites: [
      team[2],
      team[3],
    ],
    link: 'https://github.com/Matt4401/TardisV2.01/',
    image: '/images/projects/tardis.png',
    texture: '/planets/jupiter.png',
    status: 'done'
  },
  {
    name: 'Portfolio 3D',
    distance: 5.5,
    size: 0.5,
    color: '#60a5fa',
    speed: 0.4,
    icon: '🌟',
    description: 'Portfolio interactif en 3D avec React Three Fiber',
    hasRings: false,
    hasAtmosphere: true,
    materialType: 'none',
    rotationSpeed: 0.012,
    theme: {
      primary: '#60a5fa',
      secondary: '#93c5fd',
      accent: '#dbeafe',
      emissive: '#001133'
    },
    shaderVars: {
      noiseScale: 12.0,
      animSpeed: 2,
      rimPower: 3,
      emissiveStrength: 0.1
    },
    projectDetails: {
      technologies: ['React', 'Three.js', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      features: [
        'Interface 3D immersive',
        'Animations fluides',
        'Design responsive',
        'Performance optimisée',
        'Navigation intuitive'
      ],
      challenges: [
        'Optimisation Three.js',
        'Responsive 3D design',
        'Performance mobile',
        'Expérience utilisateur'
      ],
      stats: {
        'Lignes de code': '12,000+',
        'Performance': '95/100',
        'Compatibilité': '99%',
        'Temps de développement': '3 mois'
      }
    },
    link: 'https://github.com/tonrepo/portfolio3d',
    image: '/images/projects/1.png',
    texture: '/planets/neptune.png',
    status: 'in-progress'
  },
  {
    name: "Obake",
    size: 0.4,
    distance: 6.5,
    speed: 0.3,
    color: "#a855f7",
    icon: "👻",
    description: "Jeu 3D réalisé en 42h lors d'une game jam sur le thème de l'illusion. Le joueur dispose de 5 minutes et d’indices pour découvrir l’illusion cachée.",
    hasRings: false,
    hasAtmosphere: true,
    materialType: "tech",
    rotationSpeed: 0.017,
    theme: {
      primary: "#a855f7",
      secondary: "#c084fc",
      accent: "#e9d5ff",
      emissive: "#2e1065"
    },
    shaderVars: {
      noiseScale: 10.0,
      animSpeed: 0.9,
      rimPower: 2.5,
      emissiveStrength: 0.15
    },
    projectDetails: {
      technologies: ["Unity", "C#", "Blender", "Git"],
      features: [
        "Jeu en 3D à la première personne",
        "Enigmes basées sur la perception",
        "Système de chronomètre et feedback visuel",
        "Ambiance sonore immersive"
      ],
      challenges: [
        "Conception en temps limité (42h)",
        "Narration visuelle non explicite",
        "Level design centré sur la surprise"
      ],
      stats: {
        "Temps de développement": "42 heures",
        "Taille de l'équipe": "4 personnes",
        "Note de la jam": "Top 10 originalité"
      }
    },
    satellites: [
      team[1],
      team[4],
    ],
    link: "https://github.com/EthanCharpentier667/Obake",
    image: "/images/projects/5.png",
    texture: "/planets/saturn.png",
    status: 'done'
  },
  {
    name: "Launcher",
    size: 0.5,
    distance: 10,
    speed: 0.25,
    color: "#f59e0b",
    icon: "🛰️",
    description: "Un launcher tout-en-un pour télécharger et exécuter tous mes jeux depuis une seule application.",
    hasRings: true,
    ringColor: "#fcd34d",
    hasAtmosphere: false,
    materialType: "metal",
    rotationSpeed: 0.014,
    theme: {
      primary: "#f59e0b",
      secondary: "#fbbf24",
      accent: "#fef3c7",
      emissive: "#78350f"
    },
    shaderVars: {
      noiseScale: 11.0,
      animSpeed: 0.7,
      rimPower: 1,
      emissiveStrength: 0.1
    },
    projectDetails: {
      technologies: ["Electron", "JavaScript", "Node.js", "GitHub API"],
      features: [
        "Téléchargement automatique des jeux",
        "Interface utilisateur fluide et ergonomique",
        "Intégration GitHub pour les mises à jour",
        "Lancement direct des jeux installés"
      ],
      challenges: [
        "Gestion des installations et MAJ locales",
        "Sécurité d'exécution des jeux",
        "Interface multi-plateforme"
      ],
      stats: {
        "Jeux supportés": "5+",
        "Taille du projet": "90 Mo",
        "Compatibilité": "Windows/Linux"
      }
    },
    link: "https://echarpentier.eu/launcher-installer",
    image: "/images/projects/6.png",
    texture: "/planets/venus.png",
    status: 'in-progress'
  }
]

export default planetData
