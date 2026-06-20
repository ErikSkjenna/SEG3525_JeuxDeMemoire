/* =========================================================
   NeuroTile Sequencer - logique du jeu
   Le prototype utilise Vue 3 comme cadre JavaScript.
   ========================================================= */

const { createApp } = Vue;

createApp({
  data() {
    return {
      page: "play",
      selectedModeId: "easy",
      phase: "idle",
      level: 0,
      score: 0,
      sequence: [],
      playerIndex: 0,
      activeTile: null,
      correctPulse: null,
      wrongPulse: null,
      gameStarted: false,
      isBusy: false,
      bestScores: {
        easy: Number(localStorage.getItem("neurotile-best-easy")) || 0,
        hard: Number(localStorage.getItem("neurotile-best-hard")) || 0,
      },
      modes: [
        {
          id: "easy",
          name: "Easy",
          title: "Mode facile : 4 tuiles statiques",
          icon: "🟦",
          description: "Quatre tuiles fixes. Idéal pour apprendre la mécanique du jeu.",
          learningGoal: "Réduire les distractions pour tester principalement la mémoire de travail.",
        },
        {
          id: "hard",
          name: "Hard",
          title: "Mode difficile : 4 tuiles en mouvement",
          icon: "🌀",
          description: "Quatre tuiles tournent en cercle pendant que tu rejoues la séquence.",
          learningGoal: "Ajouter du mouvement pour tester la mémoire, l'attention et le suivi visuel.",
        },
      ],
      tiles: [
        { id: 0, label: "A", keyword: "focus" },
        { id: 1, label: "B", keyword: "logic" },
        { id: 2, label: "C", keyword: "tempo" },
        { id: 3, label: "D", keyword: "recall" },
      ],
      instructions: {
        idle: {
          title: "Prêt à commencer?",
          text: "Choisis un niveau, puis appuie sur Commencer. Observe la séquence lumineuse et reproduis-la.",
        },
        showing: {
          title: "Observation",
          text: "Regarde attentivement les tuiles. Les clics sont désactivés pendant la démonstration.",
        },
        input: {
          title: "À toi de jouer",
          text: "Clique sur les tuiles dans le même ordre que la séquence montrée.",
        },
        success: {
          title: "Bonne séquence!",
          text: "La prochaine ronde ajoute une tuile de plus. Essaie de garder le rythme en mémoire.",
        },
        mistake: {
          title: "Séquence brisée",
          text: "Tu as choisi la mauvaise tuile. Recommence ou rejoue pour améliorer ton score.",
        },
      },
    };
  },

  computed: {
    selectedMode() {
      return this.modes.find((mode) => mode.id === this.selectedModeId);
    },

    bestScoreForMode() {
      return this.bestScores[this.selectedModeId];
    },

    canPressTiles() {
      return this.phase === "input" && !this.isBusy;
    },

    canReplay() {
      return this.sequence.length > 0 && !this.isBusy && this.phase !== "showing";
    },

    currentInstruction() {
      return this.instructions[this.phase] || this.instructions.idle;
    },

    phaseLabel() {
      const labels = {
        idle: "En attente",
        showing: "Mémorise",
        input: "Réponse",
        success: "Réussi",
        mistake: "Fin de partie",
      };
      return labels[this.phase];
    },
  },

  methods: {
    setPage(pageName) {
      this.page = pageName;
    },

    changeMode(modeId) {
      if (this.isBusy) return;
      this.selectedModeId = modeId;
      this.resetGame();
    },

    resetGame() {
      this.phase = "idle";
      this.level = 0;
      this.score = 0;
      this.sequence = [];
      this.playerIndex = 0;
      this.activeTile = null;
      this.correctPulse = null;
      this.wrongPulse = null;
      this.gameStarted = false;
      this.isBusy = false;
    },

    async startGame() {
      if (this.isBusy) return;
      this.resetGame();
      this.gameStarted = true;

      // Après avoir cliqué sur Commencer, on descend automatiquement vers la zone de jeu.
      this.scrollToGameArea();

      // Petite pause pour laisser le temps au défilement d'orienter l'utilisateur avant la séquence.
      await this.wait(500);
      await this.nextRound();
    },

    scrollToGameArea() {
      this.$nextTick(() => {
        const gameArea = document.getElementById("game-area");
        if (gameArea) {
          gameArea.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },

    async nextRound() {
      this.phase = "success";
      await this.wait(450);

      this.level += 1;
      this.sequence.push(this.randomTileId());
      this.playerIndex = 0;

      await this.showSequence();
    },

    randomTileId() {
      return Math.floor(Math.random() * this.tiles.length);
    },

    async replaySequence() {
      if (!this.canReplay) return;
      this.playerIndex = 0;
      await this.showSequence();
    },

    async showSequence() {
      this.isBusy = true;
      this.phase = "showing";
      this.activeTile = null;
      await this.wait(650);

      for (const tileId of this.sequence) {
        this.activeTile = tileId;
        await this.wait(this.selectedModeId === "hard" ? 520 : 610);
        this.activeTile = null;
        await this.wait(this.selectedModeId === "hard" ? 220 : 280);
      }

      this.phase = "input";
      this.isBusy = false;
    },

    async pressTile(tileId) {
      if (!this.canPressTiles) return;

      const expectedTile = this.sequence[this.playerIndex];

      if (tileId === expectedTile) {
        this.correctPulse = tileId;
        this.activeTile = tileId;
        await this.wait(160);
        this.correctPulse = null;
        this.activeTile = null;
        this.playerIndex += 1;

        if (this.playerIndex === this.sequence.length) {
          this.score = this.sequence.length;
          this.saveBestScore();
          await this.nextRound();
        }
      } else {
        this.wrongPulse = tileId;
        this.activeTile = tileId;
        this.phase = "mistake";
        this.saveBestScore();
        await this.wait(420);
        this.wrongPulse = null;
        this.activeTile = null;
      }
    },

    saveBestScore() {
      const key = this.selectedModeId;
      if (this.score > this.bestScores[key]) {
        this.bestScores[key] = this.score;
        localStorage.setItem(`neurotile-best-${key}`, String(this.score));
      }
    },

    orbitStyle(tileId) {
      const baseAngles = [0, 90, 180, 270];
      return {
        "--start-angle": baseAngles[tileId],
        "--orbit-radius": "clamp(112px, 29vw, 196px)",
        "--orbit-duration": "7.5s",
        "--orbit-delay": "0s",
      };
    },

    wait(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },
  },
}).mount("#app");
