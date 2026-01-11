# eFondaMental - Analyse Détaillée des Questionnaires

**Date**: 11 Janvier 2026  
**Objectif**: Analyse complète de tous les questionnaires utilisés dans l'application eFondaMental, avec questions et réponses en français tel qu'elles apparaissent dans le code source.

---

## Table des Matières

1. [Questionnaires d'Auto-évaluation](#1-questionnaires-dauto-évaluation)
2. [Questionnaires Diagnostiques DSM5](#2-questionnaires-diagnostiques-dsm5)
3. [Échelles Cliniques Hétéro-administrées](#3-échelles-cliniques-hétéro-administrées)
4. [Évaluations Infirmières](#4-évaluations-infirmières)
5. [Questionnaires de Suivi](#5-questionnaires-de-suivi)
6. [Évaluation Sociale](#6-évaluation-sociale)
7. [Questionnaires Schizophrénie](#7-questionnaires-schizophrénie)

---

## 1. Questionnaires d'Auto-évaluation

### 1.1 ASRM - Auto-Questionnaire Altman (Manie)

**Code**: `ASRM_FR`  
**Cible**: Patient (auto-évaluation)  
**Période de référence**: 7 derniers jours

#### Questions et Réponses (tel qu'elles apparaissent en français)

**Question 1: Humeur (Bonheur/Joie)**
- Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d'habitude. (0 point)
- Je me sens parfois plus heureux(se) ou plus joyeux(se) que d'habitude. (1 point)
- Je me sens souvent plus heureux(se) ou plus joyeux(se) que d'habitude. (2 points)
- Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude la plupart du temps. (3 points)
- Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude tout le temps. (4 points)

**Question 2: Confiance en soi**
- Je ne me sens pas plus sûr(e) de moi que d'habitude. (0 point)
- Je me sens parfois plus sûr(e) de moi que d'habitude. (1 point)
- Je me sens souvent plus sûr(e) de moi que d'habitude. (2 points)
- Je me sens plus sûr(e) de moi que d'habitude la plupart du temps. (3 points)
- Je me sens extrêmement sûr(e) de moi tout le temps. (4 points)

**Question 3: Besoin de sommeil**
- Je n'ai pas besoin de moins de sommeil que d'habitude. (0 point)
- J'ai parfois besoin de moins de sommeil que d'habitude. (1 point)
- J'ai souvent besoin de moins de sommeil que d'habitude. (2 points)
- J'ai fréquemment besoin de moins de sommeil que d'habitude. (3 points)
- Je peux passer toute la journée et toute la nuit sans dormir et ne pas être fatigué(e). (4 points)

**Question 4: Discours (Loquacité)**
- Je ne parle pas plus que d'habitude. (0 point)
- Je parle parfois plus que d'habitude. (1 point)
- Je parle souvent plus que d'habitude. (2 points)
- Je parle fréquemment plus que d'habitude. (3 points)
- Je parle sans arrêt et je ne peux être interrompu(e). (4 points)

**Question 5: Niveau d'activité**
- Je n'ai pas été plus actif(ve) que d'habitude (socialement, sexuellement, au travail, à la maison ou à l'école). (0 point)
- J'ai parfois été plus actif(ve) que d'habitude. (1 point)
- J'ai souvent été plus actif(ve) que d'habitude. (2 points)
- J'ai fréquemment été plus actif(ve) que d'habitude. (3 points)
- Je suis constamment actif(ve), ou en mouvement tout le temps. (4 points)

#### Formule de Scoring

**Score Total** = Somme des 5 questions (Plage: 0-20)

#### Interprétation Clinique (Perspective Psychiatre Senior)

L'ASRM est un outil d'auto-évaluation bref et sensible pour les symptômes maniaques et hypomaniaques.

**Interprétation des scores:**
- **0-5**: Pas de symptômes maniaques significatifs
- **6-10**: Hypomanie possible (nécessite une évaluation clinique)
- **11-15**: Hypomanie probable ou manie légère
- **≥16**: Manie probable (nécessite une évaluation clinique urgente)

**Utilité clinique:**
- Détection précoce des épisodes maniaques/hypomaniaques
- Surveillance de l'élévation de l'humeur chez les patients ambulatoires
- Auto-surveillance entre les visites cliniques
- Distinction entre trouble bipolaire et dépression unipolaire

**Limites:**  
Les patients en plein épisode maniaque peuvent manquer de discernement et sous-rapporter les symptômes. Une corroboration familiale/soignant est recommandée pour les scores suggérant une manie.

---

### 1.2 QIDS-SR16 - Inventaire Rapide des Symptômes Dépressifs

**Code**: `QIDS_SR16_FR`  
**Cible**: Patient (auto-évaluation)  
**Période de référence**: 7 derniers jours

#### Questions et Réponses (tel qu'elles apparaissent en français)

**Question 1: Endormissement**
- Je ne mets jamais plus de 30 minutes à m'endormir. (0 point)
- Moins d'une fois sur deux, je mets au moins 30 minutes à m'endormir. (1 point)
- Plus d'une fois sur deux, je mets au moins 30 minutes à m'endormir. (2 points)
- Plus d'une fois sur deux, je mets plus d'une heure à m'endormir. (3 points)

**Question 2: Sommeil pendant la nuit**
- Je ne me réveille pas la nuit. (0 point)
- J'ai un sommeil agité, léger et quelques réveils brefs chaque nuit. (1 point)
- Je me réveille au moins une fois par nuit, mais je me rendors facilement. (2 points)
- Plus d'une fois sur deux, je me réveille plus d'une fois par nuit et reste éveillé(e) 20 minutes ou plus. (3 points)

**Question 3: Réveil avant l'heure prévue**
- La plupart du temps, je me réveille 30 minutes ou moins avant le moment où je dois me lever. (0 point)
- Plus d'une fois sur deux, je me réveille plus de 30 minutes avant le moment où je dois me lever. (1 point)
- Je me réveille presque toujours une heure ou plus avant le moment où je dois me lever, mais je finis par me rendormir. (2 points)
- Je me réveille au moins une heure avant le moment où je dois me lever et je n'arrive pas à me rendormir. (3 points)

**Question 4: Sommeil excessif**
- Je ne dors pas plus de 7 à 8 heures par nuit, et je ne fais pas de sieste dans la journée. (0 point)
- Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises. (1 point)
- Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises. (2 points)
- Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises. (3 points)

**Question 5: Tristesse**
- Je ne me sens pas triste. (0 point)
- Je me sens triste moins de la moitié du temps. (1 point)
- Je me sens triste plus de la moitié du temps. (2 points)
- Je me sens triste presque tout le temps. (3 points)

**Question 6: Diminution de l'appétit**
- J'ai le même appétit que d'habitude. (0 point)
- Je mange un peu moins souvent ou en plus petite quantité que d'habitude. (1 point)
- Je mange beaucoup moins que d'habitude et seulement en me forçant. (2 points)
- Je mange rarement sur un jour entier de 24 heures et seulement en me forçant énormément ou quand on me persuade de manger. (3 points)

**Question 7: Augmentation de l'appétit**
- J'ai le même appétit que d'habitude. (0 point)
- J'éprouve le besoin de manger plus souvent que d'habitude. (1 point)
- Je mange régulièrement plus souvent et/ou en plus grosse quantité que d'habitude. (2 points)
- J'éprouve un grand besoin de manger plus que d'habitude pendant et entre les repas. (3 points)

**Question 8: Perte de poids (au cours des 15 derniers jours)**
- Mon poids n'a pas changé. (0 point)
- J'ai l'impression d'avoir perdu un peu de poids. (1 point)
- J'ai perdu 1 kg ou plus. (2 points)
- J'ai perdu plus de 2 kg. (3 points)

**Question 9: Prise de poids (au cours des 15 derniers jours)**
- Mon poids n'a pas changé. (0 point)
- J'ai l'impression d'avoir pris un peu de poids. (1 point)
- J'ai pris 1 kg ou plus. (2 points)
- J'ai pris plus de 2 kg. (3 points)

**Question 10: Concentration/Prise de décisions**
- Il n'y a aucun changement dans ma capacité habituelle à me concentrer ou à prendre des décisions. (0 point)
- Je me sens parfois indécis(e) ou je trouve parfois que ma concentration est limitée. (1 point)
- La plupart du temps, j'ai du mal à me concentrer ou à prendre des décisions. (2 points)
- Je n'arrive pas me concentrer assez pour lire ou je n'arrive pas à prendre des décisions même si elles sont insignifiantes. (3 points)

**Question 11: Opinion de moi-même**
- Je considère que j'ai autant de valeur que les autres et que je suis aussi méritant(e) que les autres. (0 point)
- Je me critique plus que d'habitude. (1 point)
- Je crois fortement que je cause des problèmes aux autres. (2 points)
- Je pense presque tout le temps à mes petits et mes gros défauts. (3 points)

**Question 12: Idées de mort ou de suicide** ⚠️
*Aide: En cas d'idéation suicidaire, alerter immédiatement le clinicien.*

- Je ne pense pas au suicide ni à la mort. (0 point)
- Je pense que la vie est sans intérêt ou je me demande si elle vaut la peine d'être vécue. (1 point)
- Je pense au suicide ou à la mort plusieurs fois par semaine pendant plusieurs minutes. (2 points)
- Je pense au suicide ou à la mort plusieurs fois par jours en détail, j'ai envisagé le suicide de manière précise ou j'ai réellement tenté de mettre fin à mes jours. (3 points)

**Question 13: Enthousiasme général**
- Il n'y pas de changement par rapport à d'habitude dans la manière dont je m'intéresse aux gens ou à mes activités. (0 point)
- Je me rends compte que je m'intéresse moins aux gens et à mes activités. (1 point)
- Je me rends compte que je n'ai d'intérêt que pour une ou deux des activités que j'avais auparavant. (2 points)
- Je n'ai pratiquement plus d'intérêt pour les activités que j'avais auparavant. (3 points)

**Question 14: Énergie**
- J'ai autant d'énergie que d'habitude. (0 point)
- Je me fatigue plus facilement que d'habitude. (1 point)
- Je dois faire un gros effort pour commencer ou terminer mes activités quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail). (2 points)
- Je ne peux vraiment pas faire mes activités quotidiennes parce que je n'ai simplement plus d'énergie. (3 points)

**Question 15: Impression de ralentissement**
- Je pense, je parle et je bouge aussi vite que d'habitude. (0 point)
- Je trouve que je réfléchis plus lentement ou que ma voix est étouffée ou monocorde. (1 point)
- Il me faut plusieurs secondes pour répondre à la plupart des questions et je suis sûr(e) que je réfléchis plus lentement. (2 points)
- Je suis souvent incapable de répondre aux questions si je ne fais pas de gros efforts. (3 points)

**Question 16: Impression d'agitation**
- Je ne me sens pas agité(e). (0 point)
- Je suis souvent agité(e), je me tords les mains ou j'ai besoin de changer de position quand je suis assis(e). (1 point)
- J'éprouve le besoin soudain de bouger et je suis plutôt agité(e). (2 points)
- Par moments, je suis incapable de rester assis(e) et j'ai besoin de faire les cent pas. (3 points)

#### Formule de Scoring

**Score Total** = Somme des scores les PLUS ÉLEVÉS parmi les items dans chaque domaine:
- **Sommeil**: Maximum parmi items 1-4
- **Appétit/Poids**: Maximum parmi items 6-9
- **Psychomoteur**: Maximum parmi items 15-16
- **Items directs**: 5, 10, 11, 12, 13, 14

**Plage de score**: 0-27

#### Interprétation Clinique

Le QIDS-SR16 est une mesure validée de la sévérité dépressive correspondant aux critères DSM-5 de l'épisode dépressif majeur.

**Plages de sévérité:**
- **0-5**: Pas de dépression
- **6-10**: Dépression légère
- **11-15**: Dépression modérée
- **16-20**: Dépression sévère
- **≥21**: Dépression très sévère

**Utilité clinique:**
- Évaluation efficace de tous les 9 symptômes critères DSM-5
- Sensible aux changements induits par le traitement
- Idéal pour les mesures répétées en essais cliniques et en pratique
- Facilite les soins basés sur la mesure

**Considérations spéciales:**  
L'item 12 (idéation suicidaire) doit déclencher une évaluation clinique immédiate si coté ≥1. Dans le trouble bipolaire, les symptômes dépressifs sont souvent l'état d'humeur prédominant et contribuent significativement à l'altération fonctionnelle et au risque suicidaire.

---

### 1.3 MDQ - Questionnaire des Troubles de l'Humeur

**Code**: `MDQ_FR`  
**Cible**: Patient (auto-évaluation)  
**Période de référence**: Au cours de votre vie

#### Questions et Réponses (tel qu'elles apparaissent en français)

**Partie 1: Y a-t-il eu une période où vous n'étiez pas comme d'habitude et où...**

**1.1** … vous vous sentiez si bien et si remonté que d'autres pensaient que vous n'étiez pas comme d'habitude ou que vous alliez vous attirer des ennuis
- Oui (1 point) / Non (0 point)

**1.2** … vous étiez si irritable que vous criiez après les gens ou provoquiez des bagarres ou des disputes
- Oui (1 point) / Non (0 point)

**1.3** … vous vous sentiez beaucoup plus sûr(e) de vous que d'habitude
- Oui (1 point) / Non (0 point)

**1.4** … vous dormiez beaucoup moins que d'habitude et cela ne vous manquait pas vraiment
- Oui (1 point) / Non (0 point)

**1.5** … vous étiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d'habitude
- Oui (1 point) / Non (0 point)

**1.6** … des pensées traversaient rapidement votre tête et vous ne pouviez pas les ralentir
- Oui (1 point) / Non (0 point)

**1.7** … vous étiez si facilement distrait(e) que vous aviez des difficultés à vous concentrer ou à poursuivre la même idée
- Oui (1 point) / Non (0 point)

**1.8** … vous aviez beaucoup plus d'énergie que d'habitude
- Oui (1 point) / Non (0 point)

**1.9** … vous étiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d'habitude
- Oui (1 point) / Non (0 point)

**1.10** … vous étiez beaucoup plus sociable ou extraverti(e), par ex. vous téléphoniez à vos amis la nuit
- Oui (1 point) / Non (0 point)

**1.11** … vous étiez beaucoup plus intéressé(e) par le sexe que d'habitude
- Oui (1 point) / Non (0 point)

**1.12** … vous faisiez des choses inhabituelles ou jugées excessives, imprudentes ou risquées
- Oui (1 point) / Non (0 point)

**1.13** … vous dépensiez de l'argent d'une manière si inadaptée que cela vous attirait des ennuis pour vous ou votre famille
- Oui (1 point) / Non (0 point)

**Question 2**: Si ≥2 réponses ''oui'' à la Q1, ces réponses sont-elles apparues durant la même période ?
- Oui / Non

**Question 3**: À quel point ces problèmes ont-ils eu un impact sur votre fonctionnement ?
- Pas de problème (0 point)
- Problème mineur (1 point)
- Problème moyen (2 points)
- Problème sérieux (3 points)

#### Formule de Scoring

**Critères de dépistage positif** (TOUS doivent être remplis):
1. ≥7 réponses "oui" dans la Partie 1
2. "Oui" à la Partie 2 (co-occurrence)
3. ≥"Problème moyen" dans la Partie 3

#### Interprétation Clinique

Le MDQ est un outil de dépistage largement utilisé pour les troubles du spectre bipolaire (Bipolaire I, Bipolaire II, et cyclothymie).

**Performance du dépistage:**
- **Sensibilité**: ~70% pour le bipolaire I
- **Spécificité**: ~90% dans les populations psychiatriques
- **VPP varie** selon la prévalence dans la population

**Utilité clinique:**
- Dépistage rapide à vie en soins primaires, psychiatriques et en milieu de toxicomanie
- Identifie les patients nécessitant une évaluation diagnostique complète
- N'est pas un outil diagnostique (nécessite une confirmation par entretien clinique)

**Limites:**
- Sensibilité plus faible pour le Bipolaire II et la cyclothymie
- Repose sur le discernement et le rappel du patient
- N'évalue pas l'état d'humeur actuel
- Taux de faux positifs élevé dans le trouble de la personnalité borderline

**Action clinique:**  
Un dépistage MDQ positif doit entraîner:
1. Évaluation psychiatrique complète
2. Histoire collatérale de la famille/amis
3. Revue des patterns d'humeur longitudinaux
4. Évaluation des conditions comorbides

---

## 2. Questionnaires Diagnostiques DSM5

### 2.1 DSM5 - Troubles de l'Humeur

**Code**: `DSM5_HUMEUR`  
**Cible**: Professionnel de santé  
**Objectif**: Évaluation diagnostique structurée selon les critères DSM-5

#### Sections Principales et Questions Clés (en français)

**SECTION 1: Présence et Type de Trouble de l'Humeur**

**Question principale:** Le patient a-t-il un trouble de l'humeur?
- Oui
- Non
- Ne sais pas

**Type de trouble** (si Oui):
- Bipolaire de type 1
- Bipolaire de type 2
- Bipolaire non spécifié
- Trouble Dépressif Majeur
- Trouble dysthymique
- Trouble de l'humeur dû à une affection médicale générale
- Trouble de l'humeur induit par l'utilisation d'une substance
- Trouble dépressif non spécifié
- Trouble Cyclothymique
- Autre

**SECTION 2: CARACTÉRISTIQUES DU PREMIER EPISODE**

**Type du premier épisode:**
- Episode Dépressif Majeur sans caractéristiques psychotiques
- Episode Dépressif Majeur avec caractéristiques psychotiques
- Hypomanie
- Manie sans caractéristiques psychotiques
- Manie avec caractéristiques psychotiques
- Ne sais pas

**Survenue en post-partum (dans les 6 premiers mois)**
- Oui / Non / Ne sais pas

**Le patient a t'il présenté une période initiale cyclothymique (période >2ans)**
- Oui / Non / Ne sais pas

**SECTION 3: CARACTÉRISTIQUES DU TROUBLE VIE ENTIERE**

- Nombre d'épisodes dépressifs majeurs (nombre)
- Age du premier EDM (nombre)
- Au moins un EDM avec caractéristiques psychotiques (Oui/Non/Ne sais pas)
- Nombre d'épisodes maniaques (nombre)
- Age du premier épisode maniaque (nombre)
- Au moins un épisode maniaque avec caractéristiques psychotiques (Oui/Non/Ne sais pas)
- Nombre d'épisodes hypomaniaques (nombre)
- Age du premier épisode hypomaniaque (nombre)
- Nombre d'épisodes mixtes (nombre)

**Cycles rapides** (≥4 épisodes/an): Oui / Non / Ne sais pas

**Pattern saisonnier**: Oui / Non / Ne sais pas

#### Interprétation Clinique

Cette évaluation complète assure:
1. **Précision diagnostique**: Différencie BP-I, BP-II, cyclothymie
2. **Spécification du cours**: Suit la trajectoire de la maladie
3. **Information pronostique**: Cycles rapides, caractéristiques psychotiques informent le traitement
4. **Planification du traitement**: Les spécifications d'épisode guident la sélection de médicaments

**Distinctions diagnostiques clés:**
- **BP-I**: ≥1 épisode maniaque (avec ou sans dépression)
- **BP-II**: ≥1 épisode hypomaniaque + ≥1 épisode dépressif majeur (pas de manie complète)
- **Cyclothymie**: 2+ années de fluctuations d'humeur sous-syndromales

---

### 2.2 DSM5 - Trouble Psychotique

**Code**: `DSM5_PSYCHOTIC`  
**Cible**: Professionnel de santé

#### Questions Clés (en français)

1. **Présence de symptômes psychotiques**: Oui / Non / Ne sais pas
2. **Relation aux épisodes d'humeur**: Uniquement pendant les épisodes / Aussi en dehors des épisodes
3. **Durée quand l'humeur est normale** (nombre de semaines)
4. **Symptômes négatifs présents**: Oui / Non
5. **Altération fonctionnelle**: Légère / Modérée / Sévère

#### Interprétation Clinique

**Essentiel pour le diagnostic:**
- **Bipolaire avec caractéristiques psychotiques**: Psychose UNIQUEMENT pendant les épisodes d'humeur
- **Schizoaffectif**: Psychose ≥2 semaines SANS symptômes d'humeur
- **Schizophrénie**: Pas d'épisodes d'humeur répondant aux critères de dépression majeure/manie

**Implications thérapeutiques:**  
La distinction entre ces conditions détermine:
- Sélection et durée de l'antipsychotique
- Nécessité d'un stabilisateur de l'humeur
- Pronostic et stratégies de prévention de rechute

---

### 2.3 DSM5 - Troubles Comorbides

**Code**: `DSM5_COMORBID`  
**Cible**: Professionnel de santé

#### Domaines Évalués

**1. Troubles Anxieux**
- Trouble Anxieux Généralisé (TAG)
- Trouble Panique
- Anxiété sociale
- Phobies spécifiques
- Trouble Obsessionnel-Compulsif (TOC)
- État de Stress Post-Traumatique (ESPT)

**2. Troubles Liés aux Substances**
- Alcool
- Cannabis
- Stimulants
- Opiacés
- Sédatifs

**3. Troubles Alimentaires**
- Anorexie
- Boulimie
- Hyperphagie boulimique

**4. Troubles Somatiques**

**5. TDAH (Trouble Déficit de l'Attention / Hyperactivité)**

#### Interprétation Clinique

La comorbidité dans le trouble bipolaire est la règle, pas l'exception:
- **50-60%** ont ≥1 trouble anxieux
- **40-60%** ont un trouble lié à l'utilisation de substances
- **TDAH** chez ~10-20%

**Impact clinique:**
- Les comorbidités aggravent les résultats (plus d'épisodes, hospitalisations, risque suicidaire)
- Compliquent le traitement
- Nécessitent une approche thérapeutique intégrée

---

## 3. Échelles Cliniques Hétéro-administrées

### 3.1 MADRS - Échelle de Dépression de Montgomery-Åsberg

**Code**: `MADRS`  
**Cible**: Cotation par le clinicien  
**Items**: 10 questions (0-6 points chacune)

#### Questions avec Aide à la Cotation (en français)

**1 - Tristesse apparente**
*Aide: Correspond au découragement, à la dépression et au désespoir (plus qu'un simple cafard passager) reflétés par la parole, la mimique et la posture. Coter selon la profondeur et l'incapacité à se dérider.*

- 0 - Pas de tristesse
- 1
- 2 - Semble découragé mais peut se dérider sans difficulté
- 3
- 4 - Paraît triste et malheureux la plupart du temps
- 5
- 6 - Semble malheureux tout le temps. Extrêmement découragé

**2 - Tristesse exprimée**
*Aide: Correspond à l'expression d'une humeur dépressive, que celle-ci soit apparente ou non. Inclut le cafard, le découragement ou le sentiment de détresse sans espoir. Coter selon l'intensité, la durée à laquelle l'humeur est dite être influencée par les événements.*

- 0 - Tristesse occasionnelle en rapport avec les circonstances
- 1
- 2 - Triste ou cafardeux, mais se déride sans difficulté
- 3
- 4 - Sentiment envahissant de tristesse ou de dépression ; l'humeur est encore influencée par les circonstances extérieures
- 5
- 6 - Tristesse, désespoir ou découragement permanents ou sans fluctuations

**3 - Tension intérieure**
*Aide: Correspond aux sentiments de malaise mal défini, d'irritabilité, d'agitation intérieure, de tension nerveuse allant jusqu'à la panique, l'effroi ou l'angoisse.*

- 0 - Calme. Tension intérieure seulement passagère
- 1
- 2 - Sentiments occasionnels d'irritabilité et de malaise mal défini
- 3
- 4 - Sentiments continuels de tension intérieure ou panique intermittente que le malade ne peut maîtriser qu'avec difficulté
- 5
- 6 - Effroi ou angoisse sans relâche. Panique envahissante

**4 - Réduction du sommeil**
*Aide: Correspond à une réduction de la durée ou de la profondeur du sommeil par comparaison avec le sommeil du patient lorsqu'il n'est pas malade.*

- 0 - Dort comme d'habitude
- 1
- 2 - Légère difficulté à s'endormir ou sommeil légèrement réduit, léger ou agité
- 3
- 4 - Sommeil réduit ou interrompu au moins deux heures
- 5
- 6 - Moins de deux ou trois heures de sommeil

**5 - Réduction de l'appétit**
*Aide: Correspond au sentiment d'une perte de l'appétit comparé à l'appétit habituel.*

- 0 - Appétit normal ou augmenté
- 1
- 2 - Appétit légèrement réduit
- 3
- 4 - Pas d'appétit. Nourriture sans goût
- 5
- 6 - Ne mange que si on le persuade

**6 - Difficultés de concentration**
*Aide: Correspond aux difficultés à rassembler ses pensées allant jusqu'à l'incapacité à se concentrer.*

- 0 - Pas de difficultés de concentration
- 1
- 2 - Difficultés occasionnelles à rassembler ses pensées
- 3
- 4 - Difficultés à se concentrer et à maintenir son attention, ce qui réduit la capacité à lire ou à soutenir une conversation
- 5
- 6 - Incapable de lire ou de converser sans grande difficulté

**7 - Lassitude**
*Aide: Correspond à une difficulté à se mettre en train ou une lenteur à commencer et à accomplir les activités quotidiennes.*

- 0 - Guère de difficultés à se mettre en route. Pas de lenteur
- 1
- 2 - Difficultés à commencer des activités
- 3
- 4 - Difficultés à commencer des activités routinières qui sont poursuivies avec effort
- 5
- 6 - Grande lassitude. Incapable de faire quoi que ce soit sans aide

**8 - Incapacité à ressentir**
*Aide: Correspond à l'expérience subjective d'une réduction d'intérêt pour le monde environnant, ou les activités qui donnent normalement du plaisir.*

- 0 - Intérêt normal pour le monde environnant et pour les gens
- 1
- 2 - Capacité réduite à prendre du plaisir à ses intérêts habituels
- 3
- 4 - Perte d'intérêt pour le monde environnant. Perte de sentiment pour les amis et les connaissances
- 5
- 6 - Sentiment d'être paralysé émotionnellement, incapacité de ressentir de la colère, du chagrin ou du plaisir et impossibilité complète ou même douloureuse de ressentir quelque chose pour les proches parents et amis

**9 - Pensées pessimistes**
*Aide: Correspond aux idées de culpabilité, d'infériorité, d'auto-accusation, de pêché, de remords ou de ruine.*

- 0 - Pas de pensée pessimiste
- 1
- 2 - Idées intermittentes d'échec, d'auto-accusation ou d'autodépréciation
- 3
- 4 - Auto-accusations persistantes ou idées de culpabilité ou péché précises mais encore rationnelles. Pessimisme croissant à propos du futur
- 5
- 6 - Idées délirantes de ruine, de remords ou péché inexpiable. Auto-accusations absurdes ou inébranlables

**10 - Idées de suicide**
*Aide: Correspond au sentiment que la vie ne vaut pas le peine d'être vécue, qu'une mort naturelle serait la bienvenue, idées de suicide et préparatifs au suicide.*

- 0 - Jouit de la vie ou la prend comme elle vient
- 1
- 2 - Fatigué de la vie, idées de suicide seulement passagères
- 3
- 4 - Il vaudrait mieux être mort. Les idées de suicide sont courantes et le suicide est considéré comme une solution possible mais sans projet ou intention précis
- 5
- 6 - Projets explicites de suicide si l'occasion se présente. Préparatifs de suicide

#### Formule de Scoring

**Total** = Somme des 10 items (0-60)

#### Interprétation Clinique

Le MADRS est l'étalon-or pour évaluer la sévérité dépressive en essais cliniques et en pratique.

**Plages de sévérité:**
- **0-6**: Normal/absence de symptômes
- **7-19**: Dépression légère
- **20-34**: Dépression modérée
- **35-60**: Dépression sévère

**Avantages par rapport au HDRS (Hamilton):**
- Meilleure sensibilité au changement
- Se concentre sur les symptômes dépressifs centraux
- Moins contaminé par les symptômes anxieux/somatiques
- Idéal pour la surveillance de la dépression bipolaire

---

### 3.2 YMRS - Échelle de Manie de Young

**Code**: `YMRS`  
**Cible**: Cotation par le clinicien  
**Items**: 11 questions

#### Questions (en français)

**Items cotés 0-4:**

**1. Elévation de l'humeur**
- Absente (0)
- Légèrement ou possiblement élevée lorsqu'on l'interroge (1)
- Elévation subjective nette; optimiste, plein d'assurance; gai; contenu approprié (2)
- Elevée, au contenu approprié, plaisantin (3)
- Euphorique; rires inappropriés; chante (4)

**2. Activité motrice et énergie augmentées**
- Absentes (0)
- Subjectivement élevées (1)
- Animé; expression gestuelle plus élevée (2)
- Energie excessive; parfois hyperactif; agité (peut être calmé) (3)
- Excitation motrice; hyperactivité continuelle (ne peut être calmé) (4)

**3. Intérêt sexuel**
- Normal, non augmenté (0)
- Augmentation légère ou possible (1)
- Clairement augmenté lorsqu'on l'interroge (2)
- Parle spontanément de la sexualité; élabore sur des thèmes sexuels; se décrit comme étant hyper sexuel (3)
- Agissements sexuels manifestes (envers les patients, les membres de l'équipe, ou l'évaluateur) (4)

**4. Sommeil**
- Ne rapporte pas de diminution de sommeil (0)
- Dort jusqu'à une heure de moins que d'habitude (1)
- Sommeil réduit de plus d'une heure par rapport à d'habitude (2)
- Rapporte un moins grand besoin de sommeil (3)
- Nie le besoin de sommeil (4)

**7. Langage - troubles de la pensée**
- Absent (0)
- Circonstanciel; légère distractivité; pensées rapides (1)
- Distractivité; perd le fil de ses idées; change fréquemment de sujet; pensées accélérées (2)
- Fuite des idées; réponses hors sujet; difficile à suivre; fait des rimes; écholalie (3)
- Incohérent; communication impossible (4)

**10. Apparence**
- Soignée et habillement adéquat (0)
- Légèrement négligé (1)
- Peu soigné; modérément débraillé; trop habillé (2)
- Débraillé; à moitié nu; maquillage criard (3)
- Complètement négligé; orné; accoutrement bizarre (4)

**11. Introspection**
- Présente; admet être malade; reconnaît le besoin de traitement (0)
- Eventuellement malade (1)
- Admet des changements de comportement, mais nie la maladie (2)
- Admet de possibles changements de comportement, mais nie la maladie (3)
- Nie tout changement de comportement (4)

**Items cotés 0-8 (double poids):**

**5. Irritabilité**
- Absente (0)
- Subjectivement augmentée (2)
- Irritable par moment durant l'entretien; épisodes récents d'énervement ou de colère dans le service (4)
- Fréquemment irritable durant l'entretien; brusque; abrupt (6)
- Hostile, non coopératif; évaluation impossible (8)

**6. Discours (débit et quantité)**
- Pas augmenté (0)
- Se sent bavard (2)
- Augmentation du débit et de la quantité par moment; prolixe par moment (4)
- Soutenu; augmentation consistante du débit ou de la quantité; difficile à interrompre (6)
- Sous pression; impossible à interrompre; discours continu (8)

**8. Contenu**
- Normal (0)
- Projets discutables; intérêts nouveaux (2)
- Projet(s) particulier(s); hyper religieux (4)
- Idées de grandeur ou de persécution; idées de référence (6)
- Délires; hallucinations (8)

**9. Comportement agressif et perturbateur**
- Absent, coopératif (0)
- Sarcastique; parle fort par moment, sur la défensive (2)
- Exigeant; fait des menaces dans le service (4)
- Menace l'évaluateur; crie; évaluation difficile (6)
- Agressif physiquement; destructeur; évaluation impossible (8)

#### Formule de Scoring

**Total** = Somme de tous les items (0-60)

#### Interprétation Clinique

Le YMRS est l'échelle clinique la plus largement utilisée pour la sévérité de la manie.

**Plages de sévérité:**
- **0-12**: Euthymie/rémission
- **13-19**: Hypomanie
- **20-25**: Manie légère
- **26-37**: Manie modérée
- **≥38**: Manie sévère

**Utilité clinique:**
- Distingue l'hypomanie de la manie
- Surveille la réponse au traitement antimaniaque
- Identifie les caractéristiques mixtes (YMRS + MADRS élevés)
- Quatre items (5, 6, 8, 9) sont à double poids pour souligner les symptômes perturbateurs

---

### 3.3 CGI - Impression Clinique Globale

**Code**: `CGI`  
**Cible**: Cotation par le clinicien

#### Trois Cotations Indépendantes (en français)

**CGI - 1ère partie: Gravité de la maladie (CGI-S)**
*Question: En fonction de votre expérience clinique totale avec ce type de patient, quel est le niveau de gravité des troubles mentaux actuels du patient*

- 0 - Non évalué
- 1 - Normal, pas du tout malade
- 2 - A la limite
- 3 - Légèrement malade
- 4 - Modérément malade
- 5 - Manifestement malade
- 6 - Gravement malade
- 7 - Parmi les patients les plus malades

**CGI - 2ème partie: Amélioration globale (CGI-I)**
*Question: Évaluer l'amélioration totale qu'elle soit ou non, selon votre opinion, due entièrement au traitement médicamenteux. Comparé à son état au début du traitement, de quelle façon le patient a-t-il changé*

- 0 - Non évalué
- 1 - Très fortement amélioré
- 2 - Fortement amélioré
- 3 - Légèrement amélioré
- 4 - Pas de changement
- 5 - Légèrement aggravé
- 6 - Fortement aggravé
- 7 - Très fortement aggravé

**CGI - 3ème partie: Index thérapeutique**

**Effet thérapeutique**
*Aide: Important = amélioration marquée : disparition complète ou presque complète de tous les symptômes. Modéré = amélioration nette : disparition partielle des symptômes. Minime = très légère amélioration qui ne modifie pas le fonctionnement du patient.*

- 0 - Non évalué
- 1 - Important
- 2 - Modéré
- 3 - Minime
- 4 - Nul ou aggravation

**Effets secondaires**
- 0 - Aucun
- 1 - N'interfèrent pas significativement avec le fonctionnement du patient
- 2 - Interfèrent significativement avec le fonctionnement du patient
- 3 - Dépassent l'effet thérapeutique

#### Interprétation Clinique

Le CGI est un outil d'évaluation pragmatique et holistique utilisé mondialement dans les essais cliniques et en pratique.

**Avantages:**
- Rapide (1-2 minutes)
- Capture le jugement clinique global
- Intègre toutes les informations disponibles (symptômes, fonction, qualité de vie)
- Sensible aux changements cliniques significatifs

---

### 3.4 EGF - Échelle Globale de Fonctionnement

**Code**: `EGF`  
**Cible**: Cotation par le clinicien  
**Plage de score**: 1-100

#### Guide de Cotation (en français)

**100-91**: Niveau supérieur de fonctionnement dans une grande variété d'activité. N'êtes jamais débordé par les problèmes rencontrés. Êtes recherché par autrui en raison de ses nombreuses qualités. Absence de symptômes.

**90-81**: Symptômes absents ou minimes (p. ex. anxiété légère avant un examen), fonctionnement satisfaisant dans tous les domaines, intéressé et impliqué dans une grande variété d'activités, socialement efficace, en général satisfait de la vie, pas plus de problèmes ou de préoccupations que les soucis de tous les jours (p.ex conflit occassionnel avec des membres de la famille).

**80-71**: Si des symptômes sont présents, ils sont transitoires et il s'agit de réactions prévisibles à des facteurs de stress (p. ex. des difficultés de concentration après une dispute familiale) ; pas plus qu'un handicap léger du fonctionnement social, professionnel ou scolaire (p. ex. fléchissement temporaire du travail scolaire).

**70-61**: Quelques symptômes légers (p. ex. humeur dépressive et insomnie légère) ou une certaine difficulté dans le fonctionnement social, professionnel ou scolaire (p. ex. école buissonnière épisodique ou vol en famille) mais fonctionne assez bien de façon générale et entretient plusieurs relations interpersonnelles positives.

**60-51**: Symptômes d'intensité moyenne (p. ex. émoussement affectif, prolixité circonlocutoire, attaques de panique épisodiques) ou difficultés d'intensité moyenne dans le fonctionnement social, professionnel ou scolaire (p. ex. peu d'amis, conflits avec les collègues de travail).

**50-41**: Symptômes importants (p. ex. idéation suicidaire, rituels obsessionnels sévères, vols répétés dans les grands magasins) ou handicap important dans le fonctionnement social, professionnel ou scolaire (p. ex. absence d'amis, incapacité à garder un emploi).

**40-31**: Existence d'une certaine altération du sens de la réalité ou de la communication (p. ex. discours par moments illogique, obscur ou inadapté) ou handicap majeur dans plusieurs domaines, p. ex. le travail, l'école, les relations familiales, le jugement, la pensée ou l'humeur.

**30-21**: Le comportement est notablement influencé par des idées délirantes ou des hallucinations ou trouble grave de la communication ou de jugement ou incapable de fonctionner dans tous les domaines.

**21-11**: Existence d'un certain danger d'auto ou d'hétéro-agression ou incapacité temporaire à maintenir une hygiène corporelle minimum ou altération massive de la communication.

**10-1**: Danger persistant d'hétéro-agression grave ou incapacité durable à maintenir une hygiène corporelle minimum ou geste suicidaire avec attente précise de la mort.

#### Interprétation Clinique

Dans le trouble bipolaire:
- **Intérepisode EGF**: Souvent 60-70 (symptômes sous-syndromaux persistants, déficits fonctionnels)
- **Pendant la dépression**: 40-50 (altération sérieuse)
- **Pendant la manie**: 30-40 (problèmes de test de réalité, incapacité de travailler)

---

## 4. Évaluations Infirmières

### 4.1 Évaluation du Tabagisme

**Code**: `TOBACCO`  
**Cible**: Évaluation infirmière

#### Questions (en français)

**Tabac**
- Non fumeur
- Fumeur actuel
- Ex-fumeur
- Statut inconnu

**Si Fumeur actuel:**
- Nombre de paquet année (nombre)
- Age de début du tabagisme (sélection: Ne sais pas, <5, 5 à 89, >89)
- Substitution: Oui / Non
- Si Oui, méthodes de substitution utilisées (choix multiples):
  - Cigarette électronique
  - Champix
  - Patch
  - Nicorette

**Si Ex-fumeur:**
- Nombre de paquet année (nombre)
- Age de début du tabagisme (sélection)
- Age de fin du tabac (sélection)
- Substitution: Oui / Non
- Si Oui, méthodes de substitution utilisées (choix multiples)

#### Interprétation Clinique

La prévalence du tabagisme dans le trouble bipolaire est 2-3× supérieure à la population générale (~50-60%).

**Signification clinique:**
- **Interactions médicamenteuses**: Le tabagisme induit le CYP1A2, affectant les niveaux de clozapine, olanzapine
- **Risque cardiovasculaire**: Déjà élevé dans le bipolaire; le tabagisme aggrave le risque
- **Barrière au traitement**: Le sevrage nicotinique peut mimer/déclencher des symptômes d'humeur

---

### 4.2 Test de Fagerström pour la Dépendance Nicotinique

**Code**: `FAGERSTROM`  
**Cible**: Évaluation infirmière  
**Conditionnel**: Uniquement si fumeur actuel

#### Questions (en français)

**1. Combien de temps après votre réveil fumez-vous votre première cigarette ?**
- Dans les 5 minutes (3 points)
- De 6 à 30 minutes (2 points)
- De 31 à 60 minutes (1 point)
- Après 60 minutes (0 point)

**2. Trouvez-vous difficile de vous abstenir de fumer dans les endroits où c'est interdit ?**
- Oui (1 point)
- Non (0 point)

**3. À quelle cigarette de la journée vous serait-il le plus difficile de renoncer ?**
- La première (1 point)
- N'importe quelle autre (0 point)

**4. Combien de cigarettes fumez-vous par jour ?**
- 10 ou moins (0 point)
- 11–20 (1 point)
- 21–30 (2 points)
- 31 ou plus (3 points)

**5. Fumez-vous à un rythme plus soutenu le matin que l'après-midi ?**
- Oui (1 point)
- Non (0 point)

**6. Fumez-vous lorsque vous êtes si malade que vous devez rester au lit presque toute la journée ?**
- Oui (1 point)
- Non (0 point)

#### Formule de Scoring

**Total**: 0-10 points

#### Interprétation Clinique

**Niveaux de dépendance:**
- **0-2**: Dépendance très faible
- **3-4**: Dépendance faible
- **5**: Dépendance moyenne
- **6-7**: Dépendance élevée
- **8-10**: Dépendance très élevée

**Usage clinique:**
- **Score ≥5**: Le patient a probablement besoin de pharmacothérapie (pas seulement de conseil) pour le sevrage
- **Score ≥6**: Risque de rechute élevé; envisager une thérapie combinée

---

### 4.3 Paramètres Physiques

**Code**: `PHYSICAL_PARAMS`  
**Cible**: Évaluation infirmière

#### Mesures (en français)

1. **Taille (en cm)** - Plage: 110-210 cm
2. **Poids (en kg)** - Plage: 30-200 kg
3. **IMC (Indice de Masse Corporelle)** - Calculé automatiquement: Poids(kg) / (Taille(m))²
4. **Périmètre abdominal (en cm)** - Plage: 40-160 cm

#### Interprétation Clinique

**Catégories IMC:**
- **<18.5**: Insuffisance pondérale
- **18.5-24.9**: Normal
- **25-29.9**: Surpoids
- **30-34.9**: Obésité Classe I
- **35-39.9**: Obésité Classe II
- **≥40**: Obésité Classe III (obésité morbide)

**Périmètre abdominal (critère du syndrome métabolique):**
- **Hommes**: ≥102 cm (≥94 cm chez les Européens)
- **Femmes**: ≥88 cm (≥80 cm chez les Européennes)

---

### 4.4 Pression artérielle & Fréquence cardiaque

**Code**: `BLOOD_PRESSURE`  
**Cible**: Évaluation infirmière

#### Mesures (en français)

**Pression artérielle couché (en mm de Mercure)**
- Pression Systolique (mmHg)
- Pression Diastolique (mmHg)
- Tension couché (format: Systolique/Diastolique, calculé automatiquement)
- Fréquence cardiaque couché (battements par minute)

**Pression artérielle debout (en mm de Mercure)**
- Pression Systolique (mmHg)
- Pression Diastolique (mmHg)
- Tension debout (format: Systolique/Diastolique, calculé automatiquement)
- Fréquence cardiaque debout (battements par minute)

#### Interprétation Clinique

**Hypotension orthostatique:**  
Chute de ≥20 mmHg systolique ou ≥10 mmHg diastolique en position debout.

**Signification clinique:**
- **Effet secondaire médicamenteux**: Fréquent avec quétiapine, clozapine, antidépresseurs tricycliques
- **Risque de chute**: Spécialement chez les personnes âgées
- **Symptôme**: Vertiges, syncope

---

### 4.5 Dépistage des Apnées du Sommeil (STOP-Bang)

**Code**: `SLEEP_APNEA`  
**Cible**: Évaluation infirmière

#### Questions (en français)

**Question initiale:**
Avez-vous été diagnostiqué comme souffrant d'apnées du sommeil ? (examen du sommeil, polysomnographie)
- Oui
- Non
- NSP (Ne Sais Pas)

**Si diagnostiqué = Oui:**
- Êtes-vous appareillé ? (Utilisez-vous un appareil CPAP pour traiter vos apnées du sommeil ?)
  - Oui / Non

**Si diagnostiqué = Non ou NSP (Questions STOP-Bang):**

**1. Ronflements ?** Ronflez-vous fort (suffisamment fort pour qu'on vous entende à travers une porte fermée ou que votre partenaire vous donne des coups de coude parce que vous ronflez la nuit) ?
- Oui / Non

**2. Fatigue ?** Vous sentez-vous souvent fatigué(e), épuisé(e) ou somnolent(e) pendant la journée (comme par exemple s'endormir au volant) ?
- Oui / Non

**3. Observation ?** Quelqu'un a-t-il observé que vous arrêtiez de respirer ou que vous vous étouffiez/suffoquiez pendant votre sommeil ?
- Oui / Non

**4. Tension ?** Êtes-vous atteint(e) d'hypertension artérielle ou êtes-vous traité(e) pour ce problème ?
- Oui / Non

**5. Indice de Masse Corporelle supérieur à 35 kg/m² ?**
- Oui / Non

**6. Âge supérieur à 50 ans ?**
- Oui / Non

**7. Tour de cou supérieur à 40 cm ?**
- Oui / Non

**8. Sexe masculin ?**
- Oui / Non

#### Formule de Scoring

**Total**: 0-8 points (1 point par "oui")

#### Interprétation Clinique

**Stratification du risque:**
- **0-2 points**: Risque faible
- **3-4 points**: Risque intermédiaire
- **5-8 points**: Risque élevé

**Signification clinique dans le trouble bipolaire:**
- **Prévalence de l'AOS**: ~25% chez les patients bipolaires (vs. ~5-10% population générale)
- **Relation bidirectionnelle**: L'AOS aggrave l'humeur, les épisodes d'humeur perturbent le sommeil
- **Risque de mauvais diagnostic**: La fatigue/altération cognitive de l'AOS mime la dépression

---

## 5. Questionnaires de Suivi

### 5.1 Suivi des recommandations

**Code**: `SUIVI_RECOMMANDATIONS`  
**Cible**: Professionnel de santé

#### Questions (en français)

**Suivi des recommandations faites au cours de la première évaluation pour le traitement médicamenteux**
- Complètement suivi
- Partiellement suivi
- Non suivi

**Si Partiellement suivi ou Non suivi:**
Précisez pourquoi les recommandations n'ont pas été suivies
- Refus du patient
- Désaccord du médecin pratiquant le suivi
- Problème de tolérance
- Problème de rechute
- Autres

**Suivi des recommandations faites au cours de la première évaluation pour les traitements non médicamenteux**
- Complètement suivi
- Partiellement suivi
- Non suivi

**Si Partiellement suivi ou Non suivi:**
Précisez pourquoi les recommandations n'ont pas été suivies
- Refus du patient
- Désaccord avec le médecin pratiquant le suivi
- Impossible à mettre en place
- Autres

#### Interprétation Clinique

**La non-adhésion médicamenteuse** est la principale cause de rechute dans le trouble bipolaire (50-60% non-adhérents).

**Raisons courantes:**
- **Manque de discernement** (spécialement après la manie)
- **Effets secondaires** (prise de poids, sédation, tremblements, émoussement cognitif)
- **Manque des "hauts"** (les patients peuvent préférer l'hypomanie légère)
- **Régimes complexes** (doses quotidiennes multiples réduisent l'adhésion)
- **Barrières de coût/accès**

---

### 5.2 Recours aux soins

**Code**: `RECOURS_AUX_SOINS`  
**Cible**: Professionnel de santé

#### Questions Principales (en français)

**Recours aux systèmes de soins pour troubles psychiatriques depuis la dernière visite selon le suivi habituel**
- Oui / Non

**Si Oui, consultations chez:**
- Un médecin généraliste (Oui/Non, si Oui: Nombre de consultations)
- Un médecin psychiatre (Oui/Non, si Oui: Nombre de consultations)
- Un psychologue (Oui/Non, si Oui: Nombre de consultations)
- Un ou plusieurs médecins spécialistes en lien avec la pathologie ou son traitement (Oui/Non, si Oui: Nombre)
- Autres en lien avec la pathologie ou son traitement (diététicien, infirmier…) (Oui/Non, si Oui: Nombre)

**Recours aux soins non programmé et/ou en urgence**
- Oui / Non

**Si Oui:**
- Passage aux urgences pour troubles psychiatrique sans hospitalisation (Oui/Non, si Oui: Nombre de passages)
- Consultations chez un médecin généraliste (Oui/Non, si Oui: Nombre)
- Consultations chez un médecin psychiatre (Oui/Non, si Oui: Nombre)
- Consultations chez un psychologue (Oui/Non, si Oui: Nombre)

#### Interprétation Clinique

L'utilisation des soins de santé suit la sévérité de la maladie et l'engagement du système.

**Indicateurs d'utilisation élevée:**
- **Visites multiples aux urgences**: Suggère une gestion ambulatoire inadéquate, crises aiguës ou usage de substances
- **Hospitalisations**: Épisodes sévères, tentatives de suicide ou échec du traitement
- **Interruptions de soins**: Non-adhésion, perte d'assurance, insatisfaction

---

## 6. Évaluation Sociale

### 6.1 Évaluation Sociale - Déterminants Sociaux de la Santé

**Code**: `SOCIAL_DEFINITION`  
**Cible**: Travailleur social ou professionnel de santé

#### Domaines Évalués (en français)

**1. Statut marital**
- Célibataire
- Marié / Concubin / Pacsé
- Séparé
- Divorcé
- Veuf(ve)

**2. Éducation**
- CP, CE1, CE2, CM1, CM2, Certificat d'études
- 6ème, 5ème, 4ème, 3ème
- 2nde, 1ère
- BEP, CAP, BAC
- BAC+1, BAC+2, BAC+3, BAC+4, BAC+5
- Doctorat

**3. Statut professionnel actuel**
- Sans emploi
- Actif
- Au foyer
- Retraité
- Étudiant
- Pension
- Autres

**Si Actif:**
- Depuis combien de temps travaillez-vous de manière consécutive (sans interruption > 6 mois)
  - < 1 an, 1 an, 2 ans, 3 ans, 4 ans, 5 ans, 6 ans, 7 ans, 8 ans, 9 ans, Entre 10 et 20 ans, Entre 20 et 30 ans, > 30 ans
- Est-ce un emploi temps plein (Oui/Non)
- Donner la classe professionnelle (liste détaillée de 18 catégories professionnelles)

**4. Source principale de revenus**
- Salaire
- RMI/RSA
- AAH (Allocation Adulte Handicapé)
- Pension d'invalidité
- Allocations de chômage
- APL
- Autres

**5. Logement principal**
- Locataire (loyer auto financé)
- Locataire (loyer payé par un tiers)
- Propriétaire
- Institution
- Vit avec ses parents
- Foyer Hôtel
- Foyer éducateur
- Résidence post-cure
- Appartement thérapeutique
- Logement associatif
- Autre

**6. Mode de vie**
- Seul
- Chez ses parents
- Dans son propre foyer familial
- Chez les enfants
- Chez de la famille
- Colocation
- Collectivité
- Autres

**7. Nombre de personnes vivant sous le même toit** (nombre: 0-99)

**8. Personne avec laquelle vous passez le plus de temps**
- Conjoint, Mère, Père, Colocataire, Ami(e), Concubin, Frère-Sœur, Grand-parent, Autres apparentés, Enfant, Autre

**9. Mesures de protection**
- Aucune
- Tutelle
- Curatelle
- Sauvegarde de justice
- Autres

**10. Dettes / Difficultés financières**
- Pas d'endettement
- Endettement gérable
- Endettement important / difficultés financières
- En recouvrement de dettes

#### Interprétation Clinique

Les déterminants sociaux impactent profondément les résultats du trouble bipolaire.

**Facteurs de risque pour un mauvais pronostic:**
- **Isolement social** (vivre seul, pas de partenaire): Adhésion médicamenteuse réduite, risque suicidaire plus élevé
- **Faible éducation**: Littératie en santé moindre, difficulté à naviguer dans le système de soins
- **Chômage/invalidité**: Perte de structure, stress financier, estime de soi réduite
- **Logement instable**: Difficulté avec le stockage des médicaments, rendez-vous de suivi
- **Endettement**: Stresseur chronique, peut déclencher des épisodes d'humeur

---

## 7. Questionnaires Schizophrénie

### 7.1 Diagnostic Schizophrénie

**Code**: `SZ_DIAGNOSTIC`  
**Cible**: Professionnel de santé (dépistage schizophrénie)

#### Questions Principales (en français)

**Date de recueil des informations** (date, par défaut: aujourd'hui)

**Nom du medecin evaluateur** (texte)

**Diagnostic de trouble schizophrenique pose prealablement**
- Oui
- Non
- Ne sais pas

**Si oui, preciser:**
- Schizophrenie
- Trouble schizophreniforme
- Trouble schizo-affectif
- Trouble psychotique bref

**Diagnostic de trouble schizophrenique evoque au terme du screening**
- Oui
- Non
- Differe

**Si diagnostic recuse lors du screening (= Non), preciser le diagnostic le plus probable:**
- Borderline
- Autres troubles de la personnalite
- Trouble bipolaire
- EDM / Unipolaire
- Addiction
- Autres
- Ne sais pas

**Bilan programme**
- Oui
- Non

**Si non, preciser:**
- Diagnostic recuse
- Etat clinique non compatible lors de la visite de screening
- Consultation specialisee de screening suffisante pour donner un avis
- Patient non disponible
- Refus du patient
- Autre

**Si Oui (Date de l'evaluation en Centre Expert)** (date)

**Lettre d'information remise au patient**
- Oui / Non

#### Interprétation Clinique

Différencie la schizophrénie du trouble schizoaffectif et du trouble bipolaire avec caractéristiques psychotiques.

---

### 7.2 Orientation Centre Expert Schizophrénie

**Code**: `SZ_ORIENTATION`  
**Cible**: Professionnel de santé

#### Questions (en français)

**Patient souffrant d'un trouble evocateur d'une schizophrenie**
- Oui / Non

**Etat psychique compatible avec l'evaluation**
- Oui / Non

**Prise en charge a 100% ou accord du patient pour assumer les frais**
- Oui / Non

**Accord du patient pour une evaluation dans le cadre du centre expert**
- Oui / Non

#### Interprétation Clinique

Évalue l'éligibilité pour une évaluation spécialisée en schizophrénie (analogue au questionnaire d'orientation bipolaire).

---

### 7.3 Dossier Infirmier Schizophrénie

**Code**: `SZ_DOSSIER_INFIRMIER`  
**Cible**: Évaluation infirmière (évaluation initiale schizophrénie)

#### Sections (en français)

**Section 1: Parametres physiques**
- Taille en cm (50-250 cm)
- Poids en kg (20-300 kg)
- BMI (calculé, aide: 18,5 a 25 : normal, 25 a 30 : surpoids, 30 a 35 : obesite, Au-dela de 40 : obesite morbide)
- Perimetre abdominal en cm (0-250 cm, aide: A mesurer au niveau de l'ombilic)

**Section 2: Pression Arterielle Couche en mm de Mercure**
- Pression Systolique (40-300)
- Pression Diastolique (30-300)
- Tension couche (texte calculé)

**Section 3: ECG**
- ECG realise (Oui/Non)

**Si ECG realise = Oui:**
- Mesure du QT (en seconde) - Aide: Valeur typique entre 0.30 et 0.50 secondes
- Mesure du RR (en seconde) - Aide détaillée fournie
- QT calcule (calculé via formule de Bazett, aide avec interprétations cliniques)
- ECG envoye a un cardiologue (Oui/Non)
- Demande de consultation ou d'avis aupres d'un cardiologue (Oui/Non)

#### Interprétation Clinique

Similaire à l'évaluation infirmière pour le trouble bipolaire. Surveille les paramètres physiques, la pression artérielle et l'ECG pour l'évaluation initiale de la schizophrénie.

---

## 8. Questionnaires de Qualité de Vie et Effets Secondaires

### 8.1 EQ-5D-5L - Qualité de Vie

**Code**: `EQ5D5L`  
**Cible**: Patient (auto-évaluation)  
**Version**: 5L (User Text)

#### Questions (en français)

**Partie 1: Système descriptif (5 dimensions)**

**1. Mobilité**
- Je n'ai aucun problème pour me déplacer à pied (1 point)
- J'ai des problèmes légers pour me déplacer à pied (2 points)
- J'ai des problèmes modérés pour me déplacer à pied (3 points)
- J'ai des problèmes sévères pour me déplacer à pied (4 points)
- Je suis incapable de me déplacer à pied (5 points)

**2. Autonomie de la personne**
- Je n'ai aucun problème pour me laver ou m'habiller tout seul (1 point)
- J'ai des problèmes légers pour me laver ou m'habiller tout seul (2 points)
- J'ai des problèmes modérés pour me laver ou m'habiller tout seul (3 points)
- J'ai des problèmes sévères pour me laver ou m'habiller tout seul (4 points)
- Je suis incapable de me laver ou de m'habiller tout(e) seul(e) (5 points)

**3. Activités courantes** (exemples : travail, études, travaux domestiques, activités familiales ou loisirs)
- Je n'ai aucun problème pour accomplir mes activités courantes (1 point)
- J'ai des problèmes légers pour accomplir mes activités courantes (2 points)
- J'ai des problèmes modérés pour accomplir mes activités courantes (3 points)
- J'ai des problèmes sévères pour accomplir mes activités courantes (4 points)
- Je suis incapable d'accomplir mes activités courantes (5 points)

**4. Douleurs, gêne**
- Je n'ai ni douleur, ni gêne (1 point)
- J'ai des douleurs ou une gêne légère(s) (2 points)
- J'ai des douleurs ou une gêne modérée(s) (3 points)
- J'ai des douleurs ou une gêne sévère(s) (4 points)
- J'ai des douleurs ou une gêne extrême(s) (5 points)

**5. Anxiété, dépression**
- Je ne suis ni anxieux(se), ni déprimé(e) (1 point)
- Je suis légèrement anxieux(se) ou déprimé(e) (2 points)
- Je suis modérément anxieux(se) ou déprimé(e) (3 points)
- Je suis sévèrement anxieux(se) ou déprimé(e) (4 points)
- Je suis extrêmement anxieux(se) ou déprimé(e) (5 points)

**Partie 2: Échelle Visuelle Analogique (EVA)**

Nous aimerions savoir dans quelle mesure votre santé est bonne ou mauvaise AUJOURD'HUI. Votre état de santé aujourd'hui [valeur entre 0 et 100] ?

*Aide: Cette échelle est numérotée de 0 à 100. 100 correspond à la meilleure santé que vous puissiez imaginer. 0 correspond à la pire santé que vous puissiez imaginer.*

#### Formule de Scoring

**Système descriptif**: Chaque dimension cotée 1-5, créant un profil d'état de santé à 5 chiffres (ex: 11111 = santé parfaite, 55555 = pire état de santé).

**Valeur d'index**: Des algorithmes spécifiques à la population convertissent les profils en un score d'index unique (généralement échelle 0-1, où 1 = santé parfaite).

**Score EVA**: 0-100 (cotation directe du patient).

#### Interprétation Clinique

L'EQ-5D-5L est une mesure standardisée de la qualité de vie liée à la santé utilisée mondialement.

**Dans le trouble bipolaire:**
- **Patients euthymiques**: Index EQ-5D souvent 0.7-0.8 (altéré vs. population générale ~0.9)
- **Patients déprimés**: Index 0.3-0.5
- **Patients maniaques**: Variable (peuvent coter haut en raison du manque de discernement)

**Utilité clinique:**
- **Analyses coût-efficacité**: L'EQ-5D génère des QALYs (années de vie ajustées sur la qualité) pour l'évaluation économique
- **Réponse au traitement**: L'amélioration de l'index reflète la récupération fonctionnelle, pas seulement symptomatique
- **Perspective du patient**: L'EVA capture la perception subjective de la santé

---

### 8.2 PRISE-M - Inventaire des Effets Secondaires des Médicaments

**Code**: `PRISE_M`  
**Cible**: Patient (auto-évaluation)  
**Conditionnel**: Uniquement si actuellement sous traitement médicamenteux

#### Consignes (en français)

*Pour tous les symptômes ci-dessous, cochez la case qui correspond à ce que vous avez ressenti au cours de la semaine écoulée. si, et seulement si, vous pensez que se sont des effets secondaires dus à votre traitement médicamenteux actuel.*

#### Question de Filtrage

**Prenez-vous actuellement un traitement médicamenteux ?**
- Oui / Non

*Si Non, le questionnaire s'arrête ici.*

#### Questions par Domaine (si sous traitement)

**Cotation pour chaque item:**
- Absent (0 point)
- Tolérable (1 point)
- Pénible (2 points)

**1 - Troubles gastro-intestinaux**
- Diarrhée
- Constipation
- Bouche sèche
- Nausée, vomissement

**2 - Troubles cardiaques**
- Palpitations
- Vertiges
- Douleurs dans la poitrine

**3 - Problèmes cutanés**
- Augmentation de la transpiration
- Démangeaisons
- Sécheresse de la peau

**4 - Troubles neurologiques**
- Mal à la tête
- Tremblements
- Mauvais contrôle moteur
- Étourdissements

**5 - Vision/Audition**
- Vision floue
- Acouphènes (bourdonnements dans les oreilles)

**6 - Troubles uro-génitaux**
- Difficultés pour uriner
- Mictions douloureuses
- Mictions fréquentes
- Règles irrégulières (pour les femmes)

**7 - Problèmes de sommeil**
- Difficultés pour s'endormir
- Augmentation du temps de sommeil

**8 - Fonction sexuelle**
- Perte de désir sexuel
- Difficulté à atteindre l'orgasme / dysfonction érectile

**9 - Autres**
- Anxiété
- Difficultés de concentration
- Malaise général

#### Formule de Scoring

**Score Total** = Somme de tous les items cotés (Plage: 0-54)

#### Interprétation Clinique

Le PRISE-M évalue systématiquement les effets secondaires perçus par le patient liés aux médicaments.

**Utilité clinique:**
- **Prédicteur d'adhésion**: Score élevé (score total >15) prédit la non-adhésion
- **Revue de médication**: Guide les ajustements de dose ou les changements
- **Communication patient-clinicien**: Les patients peuvent ne pas rapporter spontanément les effets secondaires

**Effets secondaires courants des médicaments bipolaires:**
- **Lithium**: Tremblements, polyurie, prise de poids, bouche sèche, émoussement cognitif
- **Valproate**: Prise de poids, tremblements, perte de cheveux, sédation, troubles GI
- **Lamotrigine**: Généralement bien toléré; éruption cutanée (rare mais grave)
- **Olanzapine/quetiapine**: Sédation, prise de poids, syndrome métabolique
- **Aripiprazole**: Akathisie (agitation), insomnie, nausées

**Effets secondaires pénibles (score = 2):**  
Doivent déclencher une discussion clinique immédiate:
- **Dysfonction sexuelle**: Très pénible, souvent non divulguée; envisager un changement de médication
- **Prise de poids**: Risque métabolique, image corporelle; conseil diététique, revue de médication
- **Sédation**: Altère la fonction; ajuster le timing ou la dose
- **Tremblements**: Embarrassant, limitant fonctionnellement; réduire la dose, ajouter un bêta-bloquant

---

## 9. Échelles d'Évaluation du Traitement

### 9.1 ALDA - Échelle d'Alda (Réponse au Lithium)

**Code**: `ALDA`  
**Cible**: Cotation par le clinicien (rétrospective)  
**Objectif**: Évaluer la réponse prophylactique au lithium

#### Questions (en français)

**Dépistage:**

**Le patient est-il actuellement traité par lithium ?**
- Oui / Non

*Si Non, le questionnaire s'arrête ici.*

**Critère A: Degré d'amélioration clinique globale**

*Aide: Si le Score A est inférieur à 7, le Score Total sera automatiquement de 0.*

- 0 - Aucun changement, ni péjoration
- 1 - Amélioration minime. Réduction de l'activité de maladie de 0-10%
- 2 - Amélioration légère. Réduction de l'activité de maladie de 10-20%
- 3 - Amélioration légère. Réduction de l'activité de maladie de 20-35%
- 4 - Amélioration modérée. Réduction de l'activité de maladie de 35-50%
- 5 - Bonne modérée. Réduction de l'activité de maladie de 50-65%
- 6 - Bonne réponse. Réduction de l'activité de maladie de 65-80%
- 7 - Bonne réponse. Réduction de l'activité de maladie de 80-90%
- 8 - Très bonne réponse. l'activité de la maladie réduite de plus de 90%
- 9 - Très bonnes réponse, aucune récurrence mais le patient peut encore avoir des symptômes résiduels minimes (anxiété passagère, perturbation du sommeil, dysphorie, irritabilité) n'exigeant aucune intervention
- 10 - Réponse complète, aucune récurrence mais le patient peut encore avoir des symptômes résiduels et récupération fonctionnelle totale

**Critère B: Facteurs pouvant confondre l'évaluation de la réponse**

**B1: Nombre d'épisodes avant le traitement**
- 4 épisodes ou plus (0 point)
- 2 ou 3 épisodes (1 point)
- 1 épisode (2 points)

**B2: Fréquence des épisodes avant le traitement**
- Moyenne à élevée, incluant les cycles rapides (0 point)
- Faible, rémissions spontanées de 3 ans ou plus en moyenne (1 point)
- 1 seul épisode, risque de récurrence ne peut être établi (2 points)

**B3: Durée du traitement**
- 2 ans ou plus (0 point)
- 1-2 ans (1 point)
- moins d'un an (2 points)

**B4: Compliance durant la/les période(s) de stabilité**
- Excellente, documentée par des taux dans les limites thérapeutiques (0 point)
- Bonne, plus de 80% des taux dans les limites thérapeutiques (1 point)
- Pauvre, répétitivement hors traitements, moins de 80% des taux dans les limites thérapeutiques (2 points)

**B5: Usage de médication additionnelle durant la phase de stabilité**
- Aucun hormis de rares somnifères (1 par semaine ou moins); pas d'autres stabilisateurs pour contrôler les symptômes thymiques (0 point)
- Antidépresseurs ou antipsychotiques à faible dose comme une sécurité, ou recours prolongé à des somnifères (1 point)
- Usage prolongé ou systématique d'un antidépresseur ou antipsychotique (2 points)

#### Formule de Scoring

**Logique de scoring:**
- **Si Critère A < 7**: Score total automatiquement = 0 (non-répondeur)
- **Si Critère A ≥ 7**: Score total = A - B (plage: 0-10)

où **B** = somme de B1 + B2 + B3 + B4 + B5 (plage: 0-10)

#### Interprétation Clinique

L'échelle d'Alda catégorise la qualité de la réponse au lithium, cruciale pour la planification du traitement.

**Catégories de réponse:**
- **Score Total 0-3**: Mauvais/non-répondeur
- **Score Total 4-6**: Répondeur partiel
- **Score Total 7-10**: Excellent répondeur

**Signification clinique:**
- **Excellents répondeurs** (~30% des patients BP): Le lithium doit être maintenu à vie
- **Répondeurs partiels**: Peuvent bénéficier de lithium + traitement adjuvant
- **Non-répondeurs**: Envisager des stabilisateurs alternatifs (valproate, lamotrigine, antipsychotiques)

**Prédicteurs de bonne réponse au lithium:**
- BP-I classique avec cycles maniaco-dépressifs clairs
- Absence de cycles rapides
- Pas d'usage de substances comorbide
- Histoire familiale de réponse au lithium

**Limites:**  
Évaluation rétrospective; nécessite une durée d'essai adéquate (≥2 ans) et une compliance.

---

### 9.2 ETAT_PATIENT - État du Patient (Symptômes DSM-IV)

**Code**: `ETAT_PATIENT`  
**Cible**: Cotation par le clinicien

#### Structure du Questionnaire

Le questionnaire évalue systématiquement la présence de symptômes dépressifs et maniaques selon les critères DSM-IV.

**Cotation pour chaque item:**
- Oui (1 point)
- Non (0 point)
- Ne sais pas (9 = donnée manquante)

#### Questions - Symptômes Dépressifs Actuels (en français)

**1. Humeur dépressive la majeure partie de la journée**
- Oui / Non / Ne sais pas

**Si Oui:**
- 1a. Impression subjective d'hyper-réactivité émotionnelle (Oui/Non/Ne sais pas)
- 1b. Impression subjective d'hypo-réactivité ou d'anesthésie (Oui/Non/Ne sais pas)

**2. Diminution marquée d'intérêt ou de plaisir dans toutes ou presque les activités habituelles, presque toute la journée**
- Oui / Non / Ne sais pas

**3. Perte ou gain de poids significatif, ou diminution ou augmentation de l'appétit**
- Oui / Non / Ne sais pas

**Si Oui:**
- 3a. Perte de poids (Oui/Non/Ne sais pas)
- 3b. Gain de poids (Oui/Non/Ne sais pas)

**4. Insomnie ou hypersomnie**
- Oui / Non / Ne sais pas

**Si Oui:**
- 4a. Insomnie (Oui/Non/Ne sais pas)
- 4b. Hypersomnie (Oui/Non/Ne sais pas)

**5. Agitation ou ralentissement psychomoteur**
- Oui / Non / Ne sais pas

**Si Oui:**
- 5a. Agitation (Oui/Non/Ne sais pas)
- 5b. Ralentissement (Oui/Non/Ne sais pas)

**6. Fatigue ou perte d'énergie**
- Oui / Non / Ne sais pas

**7. Sentiment de dévalorisation ou de culpabilité excessive ou inappropriée**
- Oui / Non / Ne sais pas

**8. Diminution de l'aptitude à penser ou se concentrer ou indécision chaque jour**
- Oui / Non / Ne sais pas

**Si Oui:**
- 8a. Impression d'accélération idéïque (Oui/Non/Ne sais pas)
- 8b. Impression de ralentissement idéïque (Oui/Non/Ne sais pas)

**9. Pensées récurrentes de mort, idéation suicidaire récurrente sans plan spécifique, ou tentative de suicide ou plan précis pour se suicider**
- Oui / Non / Ne sais pas

#### Questions - Symptômes Maniaques Actuels (en français)

**10. Humeur élevée, expansive ou irritable de façon anormale et persistante**
- Oui / Non / Ne sais pas

**11. Augmentation de l'estime de soi ou idées de grandeur**
- Oui / Non / Ne sais pas

**12. Réduction du besoin de sommeil**
- Oui / Non / Ne sais pas

**13. Plus grande communicabilité que d'habitude ou désir de parler constamment**
- Oui / Non / Ne sais pas

**14. Fuite des idées ou sensations subjectives que les pensées défilent**
- Oui / Non / Ne sais pas

**15. Distractibilité**
- Oui / Non / Ne sais pas

**16. Augmentation de l'activité orientée vers un but ou agitation psychomotrice**
- Oui / Non / Ne sais pas

**17. Engagement excessif dans des activités agréables mais à potentiel élevé de conséquences dommageables**
- Oui / Non / Ne sais pas

#### Formule de Scoring

Pas de score total. **Compte de symptômes** détermine si les critères DSM sont remplis:
- **Épisode Dépressif Majeur**: ≥5 symptômes dépressifs (incluant #1 ou #2), ≥2 semaines
- **Épisode Maniaque**: ≥3 symptômes maniaques (≥4 si l'humeur est seulement irritable), ≥1 semaine
- **Épisode Hypomaniaque**: ≥3 symptômes maniaques, ≥4 jours, pas d'altération marquée

#### Interprétation Clinique

C'est une **liste de vérification diagnostique**, pas une mesure de sévérité. Elle évalue systématiquement la présence/absence des critères d'épisode d'humeur DSM-IV.

**Usage clinique:**
- Confirme le type d'épisode actuel
- Documente le profil symptomatique pour le diagnostic différentiel
- Suit les changements symptomatiques dans le temps
- Identifie les caractéristiques mixtes (≥3 symptômes dépressifs + ≥3 symptômes maniaques simultanément)

**Caractéristiques mixtes:**  
La présence de symptômes de polarité opposée significatifs (ex: agitation, pensées accélérées pendant la dépression) a des implications diagnostiques et thérapeutiques (les antidépresseurs peuvent être risqués).

---

## Questionnaires Additionnels Identifiés dans le Code

Les questionnaires suivants ont également été identifiés mais n'ont pas été détaillés dans cette analyse:

1. **EQ-5D-5L** - Qualité de vie (5 dimensions, échelle visuelle analogique)
2. **PRISE-M** - Inventaire des effets secondaires médicamenteux
3. **FAST** - Évaluation du fonctionnement (6 domaines, 24 items)
4. **ETAT_PATIENT** - État du patient (symptômes DSM-IV)
5. **ALDA** - Échelle d'Alda (réponse au lithium)
6. **DIVA 2.0** - Entretien diagnostique pour le TDAH chez l'adulte
7. **FAMILY_HISTORY** - Antécédents familiaux
8. **BIOLOGICAL_ASSESSMENT** - Bilan biologique
9. **ECG** - Fiche de recueil ECG
10. **TRAITEMENT_NON_PHARMACOLOGIQUE** - Traitements non-pharmacologiques
11. **ARRETS_DE_TRAVAIL** - Arrêts de travail
12. **SOMATIQUE_CONTRACEPTIF** - Somatique et contraceptif
13. **STATUT_PROFESSIONNEL** - Statut professionnel

Et plusieurs autres questionnaires DSM5 de suivi semestriel.

---

## Résumé et Conclusion

### Vue d'Ensemble des Questionnaires par Type

| **Type** | **Questionnaires** | **Nombre** | **Objectif** |
|----------|-------------------|----------|-------------|
| **Auto-évaluation Dépistage** | ASRM, QIDS-SR16, MDQ | 3 | Dépistage de symptômes, détection de cas |
| **Diagnostic DSM-5** | DSM5 Troubles Humeur, Psychotiques, Comorbides | 6+ | Évaluation diagnostique structurée |
| **Sévérité Clinique** | MADRS, YMRS, CGI, EGF, FAST, ETAT_PATIENT, ALDA, DIVA | 8 | Sévérité des symptômes, réponse au traitement, fonctionnement |
| **Évaluation Infirmière** | Tabac, Fagerström, Paramètres Physiques, PA/FC, Apnées Sommeil, Bilan Bio, ECG | 7 | Surveillance médicale, évaluation du risque |
| **Suivi** | Adhésion traitement, recours aux soins, traitements non-pharm, arrêts travail, somatique/contraceptif, statut pro | 6 | Suivi longitudinal |
| **Social** | Évaluation sociale | 1 | Déterminants sociaux |
| **QdV & Effets 2nd** | EQ-5D-5L, PRISE-M | 2 | Résultats rapportés par le patient |
| **Antécédents** | Antécédents familiaux | 1 | Évaluation du risque génétique |
| **Schizophrénie** | SZ_Diagnostic, SZ_Orientation, SZ_Dossier Inf | 3 | Parcours schizophrénie |

**Total de Questionnaires Uniques Analysés**: **37+**  
*(Note: Les sections DSM-5 contiennent plusieurs sous-questionnaires, chacun potentiellement autonome)*

---

### Perspective Clinique Senior en Psychiatrie

Cette batterie de questionnaires représente des soins de pointe pour le trouble bipolaire. L'inclusion de mesures à la fois cotées par le clinicien et rapportées par le patient assure la triangulation des données. L'accent mis sur les résultats fonctionnels, pas seulement les symptômes, reflète la psychiatrie moderne orientée vers la récupération. 

La surveillance médicale robuste aborde la question critique de la mortalité prématurée dans le trouble bipolaire due aux maladies cardiovasculaires et au syndrome métabolique. En évaluant systématiquement les comorbidités (TDAH, usage de substances, anxiété), la plateforme reconnaît la nature complexe et multiforme du trouble bipolaire et facilite la planification de traitement intégrée.

L'approche structurée permet:
- **Détection précoce** des épisodes via auto-surveillance (ASRM, QIDS)
- **Diagnostic précis** via évaluations DSM-5 structurées
- **Suivi objectif** via échelles cliniques validées (MADRS, YMRS)
- **Surveillance de sécurité** via évaluations médicales complètes
- **Soins holistiques** via évaluations sociales, familiales et de qualité de vie

---

**Fin du Document**

*Cette analyse a été compilée le 11 janvier 2026, basée sur les définitions de questionnaires du code source eFondaMental. Pour l'usage clinique, toujours se référer aux critères DSM-5-TR les plus récents et aux directives de pratique clinique actualisées.*
