# Questionnaires Trouble Bipolaire - Document de Validation Clinique

Ce document recense l'ensemble des questionnaires implementes pour l'evaluation du trouble bipolaire dans la plateforme eFondaMental. Les textes sont reproduits exactement tels qu'implementes dans l'application.

---

## Table des Matieres

1. [Visite de Screening](#visite-de-screening)
   - [Autoquestionnaires Patient](#autoquestionnaires-patient-screening)
   - [Partie Medicale](#partie-medicale-screening)
2. [Visite d'Evaluation Initiale](#visite-devaluation-initiale)
   - [Module 1: Infirmier](#module-1-infirmier)
   - [Module 2: Etat Thymique et Fonctionnement](#module-2-etat-thymique-et-fonctionnement)
   - [Module 3: Evaluation Medicale](#module-3-evaluation-medicale)
   - [Module 4: Evaluation Neuropsychologique](#module-4-evaluation-neuropsychologique)
   - [Module 5: Autoquestionnaires ETAT](#module-5-autoquestionnaires-etat)
   - [Module 6: Social](#module-6-social)
   - [Module 7: Autoquestionnaires TRAITS](#module-7-autoquestionnaires-traits)

---

# VISITE DE SCREENING

---

## Autoquestionnaires Patient (Screening)

---

### ASRM - Auto-Questionnaire Altman

**Code:** `ASRM_FR`  
**Description:** Echelle d'Auto-Evaluation de la Manie - Periode de reference: 7 derniers jours  
**Nombre d'items:** 5  
**Score total:** 0-20 points

#### Questions et Reponses

| ID | Question | Reponses possibles | Score |
|----|----------|-------------------|-------|
| q1 | Question 1: Humeur (Bonheur/Joie) | Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d'habitude. | 0 |
| | | Je me sens parfois plus heureux(se) ou plus joyeux(se) que d'habitude. | 1 |
| | | Je me sens souvent plus heureux(se) ou plus joyeux(se) que d'habitude. | 2 |
| | | Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude la plupart du temps. | 3 |
| | | Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude tout le temps. | 4 |
| q2 | Question 2: Confiance en soi | Je ne me sens pas plus sur(e) de moi que d'habitude. | 0 |
| | | Je me sens parfois plus sur(e) de moi que d'habitude. | 1 |
| | | Je me sens souvent plus sur(e) de moi que d'habitude. | 2 |
| | | Je me sens plus sur(e) de moi que d'habitude la plupart du temps. | 3 |
| | | Je me sens extremement sur(e) de moi tout le temps. | 4 |
| q3 | Question 3: Besoin de sommeil | Je n'ai pas besoin de moins de sommeil que d'habitude. | 0 |
| | | J'ai parfois besoin de moins de sommeil que d'habitude. | 1 |
| | | J'ai souvent besoin de moins de sommeil que d'habitude. | 2 |
| | | J'ai frequemment besoin de moins de sommeil que d'habitude. | 3 |
| | | Je peux passer toute la journee et toute la nuit sans dormir et ne pas etre fatigue(e). | 4 |
| q4 | Question 4: Discours (Loquacite) | Je ne parle pas plus que d'habitude. | 0 |
| | | Je parle parfois plus que d'habitude. | 1 |
| | | Je parle souvent plus que d'habitude. | 2 |
| | | Je parle frequemment plus que d'habitude. | 3 |
| | | Je parle sans arret et je ne peux etre interrompu(e). | 4 |
| q5 | Question 5: Niveau d'activite | Je n'ai pas ete plus actif(ve) que d'habitude (socialement, sexuellement, au travail, a la maison ou a l'ecole). | 0 |
| | | J'ai parfois ete plus actif(ve) que d'habitude. | 1 |
| | | J'ai souvent ete plus actif(ve) que d'habitude. | 2 |
| | | J'ai frequemment ete plus actif(ve) que d'habitude. | 3 |
| | | Je suis constamment actif(ve), ou en mouvement tout le temps. | 4 |

#### Calcul du Score
**Formule:** Score total = q1 + q2 + q3 + q4 + q5

#### Interpretation
| Plage de Score | Interpretation |
|----------------|----------------|
| 0-5 | Etat normal |
| 6-20 | Symptomes maniaques/hypomaniaques |

---

### QIDS-SR16 - Inventaire de Depression

**Code:** `QIDS_SR16_FR`  
**Description:** Auto-questionnaire court sur les symptomes de la depression - Periode de reference: 7 derniers jours  
**Nombre d'items:** 16  
**Score total:** 0-27 points

#### Questions et Reponses

| ID | Question | Reponses possibles | Score |
|----|----------|-------------------|-------|
| q1 | Endormissement | Je ne mets jamais plus de 30 minutes a m'endormir. | 0 |
| | | Moins d'une fois sur deux, je mets au moins 30 minutes a m'endormir. | 1 |
| | | Plus d'une fois sur deux, je mets au moins 30 minutes a m'endormir. | 2 |
| | | Plus d'une fois sur deux, je mets plus d'une heure a m'endormir. | 3 |
| q2 | Sommeil pendant la nuit | Je ne me reveille pas la nuit. | 0 |
| | | J'ai un sommeil agite, leger et quelques reveils brefs chaque nuit. | 1 |
| | | Je me reveille au moins une fois par nuit, mais je me rendors facilement. | 2 |
| | | Plus d'une fois sur deux, je me reveille plus d'une fois par nuit et reste eveille(e) 20 minutes ou plus. | 3 |
| q3 | Reveil avant l'heure prevue | La plupart du temps, je me reveille 30 minutes ou moins avant le moment ou je dois me lever. | 0 |
| | | Plus d'une fois sur deux, je me reveille plus de 30 minutes avant le moment ou je dois me lever. | 1 |
| | | Je me reveille presque toujours une heure ou plus avant le moment ou je dois me lever, mais je finis par me rendormir. | 2 |
| | | Je me reveille au moins une heure avant le moment ou je dois me lever et je n'arrive pas a me rendormir. | 3 |
| q4 | Sommeil excessif | Je ne dors pas plus de 7 a 8 heures par nuit, et je ne fais pas de sieste dans la journee. | 0 |
| | | Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises. | 1 |
| | | Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises. | 2 |
| | | Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises. | 3 |
| q5 | Tristesse | Je ne me sens pas triste. | 0 |
| | | Je me sens triste moins de la moitie du temps. | 1 |
| | | Je me sens triste plus de la moitie du temps. | 2 |
| | | Je me sens triste presque tout le temps. | 3 |
| q6 | Diminution de l'appetit | J'ai le meme appetit que d'habitude. | 0 |
| | | Je mange un peu moins souvent ou en plus petite quantite que d'habitude. | 1 |
| | | Je mange beaucoup moins que d'habitude et seulement en me forcant. | 2 |
| | | Je mange rarement sur un jour entier de 24 heures et seulement en me forcant enormement ou quand on me persuade de manger. | 3 |
| q7 | Augmentation de l'appetit | J'ai le meme appetit que d'habitude. | 0 |
| | | J'eprouve le besoin de manger plus souvent que d'habitude. | 1 |
| | | Je mange regulierement plus souvent et/ou en plus grosse quantite que d'habitude. | 2 |
| | | J'eprouve un grand besoin de manger plus que d'habitude pendant et entre les repas. | 3 |
| q8 | Perte de poids (au cours des 15 derniers jours) | Mon poids n'a pas change. | 0 |
| | | J'ai l'impression d'avoir perdu un peu de poids. | 1 |
| | | J'ai perdu 1 kg ou plus. | 2 |
| | | J'ai perdu plus de 2 kg. | 3 |
| q9 | Prise de poids (au cours des 15 derniers jours) | Mon poids n'a pas change. | 0 |
| | | J'ai l'impression d'avoir pris un peu de poids. | 1 |
| | | J'ai pris 1 kg ou plus. | 2 |
| | | J'ai pris plus de 2 kg. | 3 |
| q10 | Concentration/Prise de decisions | Il n'y a aucun changement dans ma capacite habituelle a me concentrer ou a prendre des decisions. | 0 |
| | | Je me sens parfois indecis(e) ou je trouve parfois que ma concentration est limitee. | 1 |
| | | La plupart du temps, j'ai du mal a me concentrer ou a prendre des decisions. | 2 |
| | | Je n'arrive pas me concentrer assez pour lire ou je n'arrive pas a prendre des decisions meme si elles sont insignifiantes. | 3 |
| q11 | Opinion de moi-meme | Je considere que j'ai autant de valeur que les autres et que je suis aussi meritant(e) que les autres. | 0 |
| | | Je me critique plus que d'habitude. | 1 |
| | | Je crois fortement que je cause des problemes aux autres. | 2 |
| | | Je pense presque tout le temps a mes petits et mes gros defauts. | 3 |
| q12 | Idees de mort ou de suicide | Je ne pense pas au suicide ni a la mort. | 0 |
| | | Je pense que la vie est sans interet ou je me demande si elle vaut la peine d'etre vecue. | 1 |
| | | Je pense au suicide ou a la mort plusieurs fois par semaine pendant plusieurs minutes. | 2 |
| | | Je pense au suicide ou a la mort plusieurs fois par jours en detail, j'ai envisage le suicide de maniere precise ou j'ai reellement tente de mettre fin a mes jours. | 3 |
| q13 | Enthousiasme general | Il n'y pas de changement par rapport a d'habitude dans la maniere dont je m'interesse aux gens ou a mes activites. | 0 |
| | | Je me rends compte que je m'interesse moins aux gens et a mes activites. | 1 |
| | | Je me rends compte que je n'ai d'interet que pour une ou deux des activites que j'avais auparavant. | 2 |
| | | Je n'ai pratiquement plus d'interet pour les activites que j'avais auparavant. | 3 |
| q14 | Energie | J'ai autant d'energie que d'habitude. | 0 |
| | | Je me fatigue plus facilement que d'habitude. | 1 |
| | | Je dois faire un gros effort pour commencer ou terminer mes activites quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail). | 2 |
| | | Je ne peux vraiment pas faire mes activites quotidiennes parce que je n'ai simplement plus d'energie. | 3 |
| q15 | Impression de ralentissement | Je pense, je parle et je bouge aussi vite que d'habitude. | 0 |
| | | Je trouve que je reflechis plus lentement ou que ma voix est etouffee ou monocorde. | 1 |
| | | Il me faut plusieurs secondes pour repondre a la plupart des questions et je suis sur(e) que je reflechis plus lentement. | 2 |
| | | Je suis souvent incapable de repondre aux questions si je ne fais pas de gros efforts. | 3 |
| q16 | Impression d'agitation | Je ne me sens pas agite(e). | 0 |
| | | Je suis souvent agite(e), je me tords les mains ou j'ai besoin de changer de position quand je suis assis(e). | 1 |
| | | J'eprouve le besoin soudain de bouger et je suis plutot agite(e). | 2 |
| | | Par moments, je suis incapable de rester assis(e) et j'ai besoin de faire les cent pas. | 3 |

#### Calcul du Score
**Formule speciale:**
- Score Sommeil = MAX(q1, q2, q3)
- Score Appetit = MAX(q6, q7)
- Score Poids = MAX(q8, q9)
- Score Psychomoteur = MAX(q15, q16)
- **Score Total** = Score Sommeil + q4 + q5 + Score Appetit + Score Poids + q10 + q11 + q12 + q13 + q14 + Score Psychomoteur

#### Interpretation
| Plage de Score | Interpretation |
|----------------|----------------|
| 0-5 | Pas de depression |
| 6-10 | Depression legere |
| 11-15 | Depression moderee |
| 16-20 | Depression severe |
| 21-27 | Depression tres severe |

---

### MDQ - Questionnaire des Troubles de l'Humeur

**Code:** `MDQ_FR`  
**Description:** Outil de depistage du trouble bipolaire - Periode de reference: au cours de votre vie  
**Nombre d'items:** 13 + 2 questions de synthese

#### Questions et Reponses

**Section 1: Y a-t-il jamais eu une periode de temps ou vous n'etiez pas comme d'habitude et ou...**

| ID | Question | Reponses | Score |
|----|----------|----------|-------|
| q1_1 | ... vous vous sentiez si bien et si remonte que d'autres pensaient que vous n'etiez pas comme d'habitude ou que vous alliez vous attirer des ennuis | Oui / Non | 1 / 0 |
| q1_2 | ... vous etiez si irritable que vous criiez apres les gens ou provoquiez des bagarres ou des disputes | Oui / Non | 1 / 0 |
| q1_3 | ... vous vous sentiez beaucoup plus sur(e) de vous que d'habitude | Oui / Non | 1 / 0 |
| q1_4 | ... vous dormiez beaucoup moins que d'habitude et cela ne vous manquait pas vraiment | Oui / Non | 1 / 0 |
| q1_5 | ... vous etiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d'habitude | Oui / Non | 1 / 0 |
| q1_6 | ... des pensees traversaient rapidement votre tete et vous ne pouviez pas les ralentir | Oui / Non | 1 / 0 |
| q1_7 | ... vous etiez si facilement distrait(e) que vous aviez des difficultes a vous concentrer ou a poursuivre la meme idee | Oui / Non | 1 / 0 |
| q1_8 | ... vous aviez beaucoup plus d'energie que d'habitude | Oui / Non | 1 / 0 |
| q1_9 | ... vous etiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d'habitude | Oui / Non | 1 / 0 |
| q1_10 | ... vous etiez beaucoup plus sociable ou extraverti(e), par ex. vous telephoniez a vos amis la nuit | Oui / Non | 1 / 0 |
| q1_11 | ... vous etiez beaucoup plus interesse(e) par le sexe que d'habitude | Oui / Non | 1 / 0 |
| q1_12 | ... vous faisiez des choses inhabituelles ou jugees excessives, imprudentes ou risquees | Oui / Non | 1 / 0 |
| q1_13 | ... vous depensiez de l'argent d'une maniere si inadaptee que cela vous attirait des ennuis pour vous ou votre famille | Oui / Non | 1 / 0 |

**Section 2: Questions de synthese**

| ID | Question | Reponses | Score |
|----|----------|----------|-------|
| q2 | Si >=2 reponses "oui" a la Q1, ces reponses sont-elles apparues durant la meme periode ? | Oui / Non | 1 / 0 |
| q3 | A quel point ces problemes ont-ils eu un impact sur votre fonctionnement ? | Pas de probleme / Probleme mineur / Probleme moyen / Probleme serieux | 0 / 1 / 2 / 3 |

#### Calcul du Score et Interpretation
**Formule:**
- Score Q1 = Somme des reponses "Oui" aux questions q1_1 a q1_13

**Criteres de positivite:**
- Score Q1 >= 7 **ET**
- Q2 = Oui **ET**
- Q3 >= 2 (Probleme moyen ou serieux)

| Resultat | Interpretation |
|----------|----------------|
| Positif | Depistage positif pour trouble bipolaire |
| Negatif | Depistage negatif pour trouble bipolaire |

---

## Partie Medicale (Screening)

---

### DIAGNOSTIC - Evaluation diagnostique

**Code:** `EBIP_SCR_DIAG`  
**Description:** Evaluation diagnostique et orientation

#### Questions

| ID | Question | Reponses possibles |
|----|----------|-------------------|
| date_recueil | Date de recueil des informations | Date |
| diag_prealable | Diagnostic de trouble bipolaire pose prealablement | Oui / Non / Je ne sais pas |
| diag_evoque | Diagnostic de trouble bipolaire evoque au terme du screening | Oui / Non / Differe |
| bilan_programme | Bilan programme (si diag_evoque = oui) | Oui / Non |
| bilan_programme_precision | Si non, preciser | Diagnostic refuse / Etat clinique non compatible lors de la visite de screening / Consultation specialisee de screening suffisante pour donner un avis / Patient non disponible / Refus du patient / Autre |
| diag_recuse_precision | Si diagnostic recuse lors du screening, preciser le diagnostic le plus probable | EDM / Unipolaire / Schizo-affectif / Schizophrene / Borderline / Autres troubles de la personnalite / Addiction / Autres / Ne sais pas |
| lettre_information | Lettre d'information remise au patient | Oui / Non |

---

### ORIENTATION - Orientation Centre Expert

**Code:** `EBIP_SCR_ORIENT`  
**Description:** Criteres d'orientation vers un centre expert pour trouble bipolaire

#### Questions

| ID | Question | Reponses possibles |
|----|----------|-------------------|
| trouble_bipolaire_ou_suspicion | Patient souffrant d'un trouble bipolaire ou suspicion de trouble bipolaire | Oui / Non |
| etat_thymique_compatible | Etat thymique compatible avec l'evaluation | Oui / Non |
| prise_en_charge_100_ou_accord | Prise en charge a 100% ou accord du patient pour assumer les frais | Oui / Non |
| accord_evaluation_centre_expert | Accord du patient pour une evaluation dans le cadre du centre expert | Oui / Non |
| accord_transmission_cr | Accord du patient pour une transmission du CR a son psychiatre referent | Oui / Non |

---

# VISITE D'EVALUATION INITIALE

---

## Module 1: Infirmier

---

### TOBACCO - Evaluation du Tabagisme

**Code:** `TOBACCO`  
**Description:** Evaluation du statut tabagique et de la consommation

#### Questions

| ID | Question | Reponses possibles |
|----|----------|-------------------|
| smoking_status | Tabac | Non fumeur / Fumeur actuel / Ex-fumeur / Statut inconnu |
| pack_years | Nombre de paquet annee | Numerique |
| smoking_start_age | Age de debut du tabagisme | Liste d'ages (5 a 89+) |
| smoking_end_age | Age de fin du tabac (ex-fumeur) | Liste d'ages |
| has_substitution | Substitution | Oui / Non |
| substitution_methods | Methodes de substitution utilisees | Cigarette electronique / Champix / Patch / Nicorette |

---

### FAGERSTROM - Echelle de dependance tabagique

**Code:** `FAGERSTROM`  
**Description:** Test de dependance a la nicotine. 6 items, score total 0-10.

#### Questions et Reponses

| ID | Question | Reponses possibles | Score |
|----|----------|-------------------|-------|
| q1 | 1. Combien de temps apres votre reveil fumez-vous votre premiere cigarette ? | Dans les 5 minutes | 3 |
| | | De 6 a 30 minutes | 2 |
| | | De 31 a 60 minutes | 1 |
| | | Apres 60 minutes | 0 |
| q2 | 2. Trouvez-vous difficile de vous abstenir de fumer dans les endroits ou c'est interdit ? | Oui | 1 |
| | | Non | 0 |
| q3 | 3. A quelle cigarette de la journee vous serait-il le plus difficile de renoncer ? | La premiere | 1 |
| | | N'importe quelle autre | 0 |
| q4 | 4. Combien de cigarettes fumez-vous par jour ? | 10 ou moins | 0 |
| | | 11-20 | 1 |
| | | 21-30 | 2 |
| | | 31 ou plus | 3 |
| q5 | 5. Fumez-vous a un rythme plus soutenu le matin que l'apres-midi ? | Oui | 1 |
| | | Non | 0 |
| q6 | 6. Fumez-vous lorsque vous etes si malade que vous devez rester au lit presque toute la journee ? | Oui | 1 |
| | | Non | 0 |

#### Interpretation
| Plage de Score | Interpretation |
|----------------|----------------|
| 0-2 | Dependance faible |
| 3-4 | Dependance moyenne |
| 5-6 | Dependance forte |
| 7-10 | Dependance tres forte |

---

### PHYSICAL_PARAMS - Parametres Physiques

**Code:** `PHYSICAL_PARAMS`  
**Description:** Mesures physiques: taille, poids, perimetre abdominal. IMC calcule automatiquement.

#### Questions

| ID | Question | Unite |
|----|----------|-------|
| height_cm | Taille | cm |
| weight_kg | Poids | kg |
| bmi | IMC (Indice de Masse Corporelle) | kg/m² (calcule automatiquement) |
| abdominal_circumference_cm | Perimetre abdominal | cm |

---

### BLOOD_PRESSURE - Pression arterielle et Frequence cardiaque

**Code:** `BLOOD_PRESSURE`  
**Description:** Mesures de la pression arterielle et de la frequence cardiaque (couche et debout)

#### Questions

| Section | ID | Question | Unite |
|---------|-----|----------|-------|
| Couche | bp_lying_systolic | Pression Systolique | mmHg |
| | bp_lying_diastolic | Pression Diastolique | mmHg |
| | heart_rate_lying | Frequence cardiaque couche | bpm |
| Debout | bp_standing_systolic | Pression Systolique | mmHg |
| | bp_standing_diastolic | Pression Diastolique | mmHg |
| | heart_rate_standing | Frequence cardiaque debout | bpm |

---

### SLEEP_APNEA - Apnees du sommeil (STOP-BANG)

**Code:** `SLEEP_APNEA`  
**Description:** Depistage des apnees du sommeil avec score STOP-Bang

#### Questions STOP-Bang

| ID | Question | Reponses |
|----|----------|----------|
| diagnosed_sleep_apnea | Avez-vous ete diagnostique comme souffrant d'apnees du sommeil ? | Oui / Non / NSP |
| has_cpap_device | Etes-vous appareille ? (si diagnostic positif) | Oui / Non |
| snoring | Ronflez-vous fort (suffisamment fort pour qu'on vous entende a travers une porte fermee) ? | Oui / Non |
| tiredness | Vous sentez-vous souvent fatigue(e), epuise(e) ou somnolent(e) pendant la journee ? | Oui / Non |
| observed_apnea | Quelqu'un a-t-il observe que vous arretiez de respirer pendant votre sommeil ? | Oui / Non |
| hypertension | Etes-vous atteint(e) d'hypertension arterielle ou etes-vous traite(e) pour ce probleme ? | Oui / Non |
| bmi_over_35 | Indice de Masse Corporelle superieur a 35 kg/m² ? | Oui / Non |
| age_over_50 | Age superieur a 50 ans ? | Oui / Non |
| large_neck | Tour de cou important ? (Hommes >= 43 cm, Femmes >= 41 cm) | Oui / Non |
| male_gender | Sexe = Masculin ? | Oui / Non |

#### Interpretation STOP-Bang
| Score | Interpretation |
|-------|----------------|
| 0-2 | Risque faible |
| 3-4 | Risque intermediaire |
| 5-8 | Risque eleve |

---

### BIOLOGICAL_ASSESSMENT - Bilan biologique

**Code:** `BIOLOGICAL_ASSESSMENT`  
**Description:** Evaluation biologique complete

#### Sections et Parametres

**BIOCHIMIE:**
- Sodium (mmol/L)
- Potassium (mmol/L)
- Chlore (mmol/L)
- Bicarbonates (mmol/L)
- Proteidemie (g/L)
- Albumine (g/L)
- Uree (mmol/L)
- Acide urique (umol/L)
- Creatinine (umol/L)
- Clairance de la creatinine (ml/min)
- Phosphore (mmol/L)
- Fer (umol/L)
- Ferritine (ug/L)
- Calcemie (mmol/L)
- CRP (mg/L) - range: 0-50
- Glycemie a jeun (mmol/L or g/L) - range: 0-50, unit selector appears when value is entered
- Hemoglobine glyquee (%) - range: 0-50 (conditional: shown when Glycemie a jeun > 7 mmol/L or > 1.26 g/L)

**BILAN LIPIDIQUE:**
- HDL (mmol/L ou g/L)
- LDL (mmol/L ou g/L)
- Cholesterol total (mmol/L)
- Triglycerides (mmol/L)
- Rapport Total / HDL (computed automatically: Cholesterol total / HDL)

**BILAN HEPATIQUE:**
- PAL (UI/L)
- ASAT / TGO (UI/L)
- ALAT / TGP (UI/L)
- Gamma-GT (UI/L)
- Bilirubine totale (µmol/L, mmol/L, or mg/L)

**BILAN THYROIDIEN:**
- TSH ultrasensible
- T3 libre (pmol/L)
- T4 libre (pmol/L)

**NFS:**
- Leucocytes (G/L)
- Hematies (T/L)
- Hemoglobine
- Hematocrite
- Neutrophiles (G/L)
- Basophiles (G/L)
- Eosinophiles (G/L)
- Lymphocytes (G/L)
- Monocytes (G/L)
- VGM (fL)
- TCMH
- CCMH
- Plaquettes (G/L)

**DOSAGES PSYCHOTROPES:**
- Clozapine (mmol/L)
- Lithium plasmatique (mmol/L)
- Lithium intra-erythrocytaire (mmol/L)
- Acide valproique (mg/L)
- Carbamazepine (mg/L)
- Oxcarbazepine (ug/ml)
- Lamotrigine

---

### ECG - Electrocardiogramme

**Code:** `ECG`  
**Description:** Formulaire de saisie des parametres electrocardiographiques avec calcul du QTc

#### Questions

| ID | Question | Unite |
|----|----------|-------|
| ecg_performed | Electrocardiogramme effectue | Oui / Non |
| heart_rate | Frequence cardiaque | bpm |
| qt_measured | Mesure du QT en seconde | s (ex: 0.400) |
| rr_measured | Mesure du RR en seconde | s (ex: 0.850) |
| qtc_calculated | QT calcule (QTc) | s (calcule automatiquement) |

#### Calcul du QTc
**Formule de Bazett:** QTc = QTm / sqrt(RR)

#### Interpretation du QTc
| QTc | Interpretation |
|-----|----------------|
| < 0.35s | Hypercalcemie/Impregnation digitalique |
| 0.35-0.43 (H) / 0.35-0.48 (F) | Normal |
| > 0.43 (H) / > 0.48 (F) | Long |
| > 0.468 (H) / > 0.528 (F) | Menacant |

---

## Module 2: Etat Thymique et Fonctionnement

---

### MADRS - Echelle de Depression de Montgomery-Asberg

**Code:** `MADRS`  
**Description:** Echelle clinique pour evaluer la severite des symptomes depressifs. 10 items cotes 0-6.  
**Score total:** 0-60 points

#### Questions et Reponses

| ID | Question | Aide a la cotation | Options |
|----|----------|-------------------|---------|
| q1 | 1 - Tristesse apparente | Correspond au decouragement, a la depression et au desespoir (plus qu'un simple cafard passager) refletes par la parole, la mimique et la posture. Coter selon la profondeur et l'incapacite a se derider. | 0 - Pas de tristesse |
| | | | 1 |
| | | | 2 - Semble decourage mais peut se derider sans difficulte |
| | | | 3 |
| | | | 4 - Parait triste et malheureux la plupart du temps |
| | | | 5 |
| | | | 6 - Semble malheureux tout le temps. Extremement decourage |
| q2 | 2 - Tristesse exprimee | Correspond a l'expression d'une humeur depressive, que celle-ci soit apparente ou non. Inclut le cafard, le decouragement ou le sentiment de detresse sans espoir. | 0 - Tristesse occasionnelle en rapport avec les circonstances |
| | | | 2 - Triste ou cafardeux, mais se deride sans difficulte |
| | | | 4 - Sentiment envahissant de tristesse ou de depression |
| | | | 6 - Tristesse, desespoir ou decouragement permanents ou sans fluctuations |
| q3 | 3 - Tension interieure | Correspond aux sentiments de malaise mal defini, d'irritabilite, d'agitation interieure, de tension nerveuse allant jusqu'a la panique, l'effroi ou l'angoisse. | 0 - Calme. Tension interieure seulement passagere |
| | | | 2 - Sentiments occasionnels d'irritabilite et de malaise mal defini |
| | | | 4 - Sentiments continuels de tension interieure ou panique intermittente |
| | | | 6 - Effroi ou angoisse sans relache. Panique envahissante |
| q4 | 4 - Reduction du sommeil | Correspond a une reduction de la duree ou de la profondeur du sommeil par comparaison avec le sommeil du patient lorsqu'il n'est pas malade. | 0 - Dort comme d'habitude |
| | | | 2 - Legere difficulte a s'endormir ou sommeil legerement reduit, leger ou agite |
| | | | 4 - Sommeil reduit ou interrompu au moins deux heures |
| | | | 6 - Moins de deux ou trois heures de sommeil |
| q5 | 5 - Reduction de l'appetit | Correspond au sentiment d'une perte de l'appetit compare a l'appetit habituel. Coter l'absence de desir de nourriture ou le besoin de se forcer pour manger. | 0 - Appetit normal ou augmente |
| | | | 2 - Appetit legerement reduit |
| | | | 4 - Pas d'appetit. Nourriture sans gout |
| | | | 6 - Ne mange que si on le persuade |
| q6 | 6 - Difficultes de concentration | Correspond aux difficultes a rassembler ses pensees allant jusqu'a l'incapacite a se concentrer. | 0 - Pas de difficultes de concentration |
| | | | 2 - Difficultes occasionnelles a rassembler ses pensees |
| | | | 4 - Difficultes a se concentrer et a maintenir son attention |
| | | | 6 - Incapable de lire ou de converser sans grande difficulte |
| q7 | 7 - Lassitude | Correspond a une difficulte a se mettre en train ou une lenteur a commencer et a accomplir les activites quotidiennes. | 0 - Guere de difficultes a se mettre en route. Pas de lenteur |
| | | | 2 - Difficultes a commencer des activites |
| | | | 4 - Difficultes a commencer des activites routinieres qui sont poursuivies avec effort |
| | | | 6 - Grande lassitude. Incapable de faire quoi que ce soit sans aide |
| q8 | 8 - Incapacite a ressentir | Correspond a l'experience subjective d'une reduction d'interet pour le monde environnant, ou les activites qui donnent normalement du plaisir. | 0 - Interet normal pour le monde environnant et pour les gens |
| | | | 2 - Capacite reduite a prendre du plaisir a ses interets habituels |
| | | | 4 - Perte d'interet pour le monde environnant. Perte de sentiment pour les amis |
| | | | 6 - Sentiment d'etre paralyse emotionnellement, incapacite a ressentir |
| q9 | 9 - Pensees pessimistes | Correspond aux idees de culpabilite, d'inferiorite, d'auto-accusation, de peche, de remords ou de ruine. | 0 - Pas de pensee pessimiste |
| | | | 2 - Idees intermittentes d'echec, d'auto-accusation ou d'autodepreciation |
| | | | 4 - Auto-accusations persistantes ou idees de culpabilite. Pessimisme croissant |
| | | | 6 - Idees delirantes de ruine, de remords ou peche inexpiable |
| q10 | 10 - Idees de suicide | Correspond au sentiment que la vie ne vaut pas le peine d'etre vecue, qu'une mort naturelle serait la bienvenue, idees de suicide et preparatifs au suicide. | 0 - Jouit de la vie ou la prend comme elle vient |
| | | | 2 - Fatigue de la vie, idees de suicide seulement passageres |
| | | | 4 - Il vaudrait mieux etre mort. Les idees de suicide sont courantes |
| | | | 6 - Projets explicites de suicide si l'occasion se presente. Preparatifs de suicide |

#### Calcul du Score
**Formule:** Score total = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10

#### Interpretation
| Plage de Score | Interpretation |
|----------------|----------------|
| 0-6 | Euthymie |
| 7-19 | Depression legere |
| 20-34 | Depression moderee |
| 35-60 | Depression severe |

---

### YMRS - Young Mania Rating Scale

**Code:** `YMRS`  
**Description:** Echelle d'evaluation de la manie hetero-administree comportant 11 items. Version francaise (Favre, Aubry, McQuillan, Bertschy, 2003).  
**Score total:** 0-60 points

#### Questions et Reponses

| ID | Question | Options | Score |
|----|----------|---------|-------|
| q1 | 1. Elevation de l'humeur | Absente | 0 |
| | | Legerement ou possiblement elevee lorsqu'on l'interroge | 1 |
| | | Elevation subjective nette; optimiste, plein d'assurance; gai; contenu approprie | 2 |
| | | Elevee, au contenu approprie, plaisantin | 3 |
| | | Euphorique; rires inappropries; chante | 4 |
| q2 | 2. Activite motrice et energie augmentees | Absentes | 0 |
| | | Subjectivement elevees | 1 |
| | | Anime; expression gestuelle plus elevee | 2 |
| | | Energie excessive; parfois hyperactif; agite (peut etre calme) | 3 |
| | | Excitation motrice; hyperactivite continuelle (ne peut etre calme) | 4 |
| q3 | 3. Interet sexuel | Normal, non augmente | 0 |
| | | Augmentation legere ou possible | 1 |
| | | Clairement augmente lorsqu'on l'interroge | 2 |
| | | Parle spontanement de la sexualite; elabore sur des themes sexuels | 3 |
| | | Agissements sexuels manifestes | 4 |
| q4 | 4. Sommeil | Ne rapporte pas de diminution de sommeil | 0 |
| | | Dort jusqu'a une heure de moins que d'habitude | 1 |
| | | Sommeil reduit de plus d'une heure par rapport a d'habitude | 2 |
| | | Rapporte un moins grand besoin de sommeil | 3 |
| | | Nie le besoin de sommeil | 4 |
| q5 | 5. Irritabilite | Absente | 0 |
| | | Subjectivement augmentee | 2 |
| | | Irritable par moment durant l'entretien; episodes recents d'enervement | 4 |
| | | Frequemment irritable durant l'entretien; brusque; abrupt | 6 |
| | | Hostile, non cooperatif; evaluation impossible | 8 |
| q6 | 6. Discours (debit et quantite) | Pas augmente | 0 |
| | | Se sent bavard | 2 |
| | | Augmentation du debit et de la quantite par moment; prolixe par moment | 4 |
| | | Soutenu; augmentation consistante du debit; difficile a interrompre | 6 |
| | | Sous pression; impossible a interrompre; discours continu | 8 |
| q7 | 7. Langage - troubles de la pensee | Absent | 0 |
| | | Circonstanciel; legere distractivite; pensees rapides | 1 |
| | | Distractivite; perd le fil de ses idees; change frequemment de sujet | 2 |
| | | Fuite des idees; reponses hors sujet; difficile a suivre; fait des rimes | 3 |
| | | Incoherent; communication impossible | 4 |
| q8 | 8. Contenu | Normal | 0 |
| | | Projets discutables; interets nouveaux | 2 |
| | | Projet(s) particulier(s); hyper religieux | 4 |
| | | Idees de grandeur ou de persecution; idees de reference | 6 |
| | | Delires; hallucinations | 8 |
| q9 | 9. Comportement agressif et perturbateur | Absent, cooperatif | 0 |
| | | Sarcastique; parle fort par moment, sur la defensive | 2 |
| | | Exigeant; fait des menaces dans le service | 4 |
| | | Menace l'evaluateur; crie; evaluation difficile | 6 |
| | | Agressif physiquement; destructeur; evaluation impossible | 8 |
| q10 | 10. Apparence | Soignee et habillement adequat | 0 |
| | | Legerement neglige | 1 |
| | | Peu soigne; moderement debraille; trop habille | 2 |
| | | Debraille; a moitie nu; maquillage criard | 3 |
| | | Completement neglige; orne; accoutrement bizarre | 4 |
| q11 | 11. Introspection | Presente; admet etre malade; reconnait le besoin de traitement | 0 |
| | | Eventuellement malade | 1 |
| | | Admet des changements de comportement, mais nie la maladie | 2 |
| | | Admet de possibles changements de comportement, mais nie la maladie | 3 |
| | | Nie tout changement de comportement | 4 |

#### Calcul du Score
**Formule:** Score total = Somme de tous les items (q1 a q11)

#### Interpretation
| Plage de Score | Interpretation |
|----------------|----------------|
| 0-11 | Pas d'hypomanie |
| 12-20 | Hypomanie |
| 21-60 | Manie |

---

### CGI - Impressions Cliniques Globales

**Code:** `CGI`  
**Description:** Echelle breve pour evaluer la gravite, l'amelioration et l'efficacite therapeutique.

#### Questions

| ID | Question | Options | Score |
|----|----------|---------|-------|
| visit_type | Type de visite | Visite initiale (baseline) / Visite de suivi | - |
| cgi_s | CGI-S : Gravite de la maladie | 0 - Non evalue | 0 |
| | | 1 - Pas malade | 1 |
| | | 2 - Etat limite | 2 |
| | | 3 - Legerement malade | 3 |
| | | 4 - Moderement malade | 4 |
| | | 5 - Manifestement malade | 5 |
| | | 6 - Gravement malade | 6 |
| | | 7 - Parmi les patients les plus malades | 7 |
| cgi_i | CGI-I : Amelioration globale (suivi uniquement) | 0 - Non evalue | 0 |
| | | 1 - Tres fortement ameliore | 1 |
| | | 2 - Fortement ameliore | 2 |
| | | 3 - Legerement ameliore | 3 |
| | | 4 - Pas de changement | 4 |
| | | 5 - Legerement aggrave | 5 |
| | | 6 - Fortement aggrave | 6 |
| | | 7 - Tres fortement aggrave | 7 |
| therapeutic_effect | Index therapeutique - Effet therapeutique | 0 - Non evalue | 0 |
| | | 1 - Important | 1 |
| | | 2 - Modere | 2 |
| | | 3 - Minime | 3 |
| | | 4 - Nul ou aggravation | 4 |
| side_effects | Index therapeutique - Effets secondaires | 0 - Non evalue | 0 |
| | | 1 - Aucun | 1 |
| | | 2 - N'interferent pas significativement avec le fonctionnement du patient | 2 |
| | | 3 - Interferent significativement avec le fonctionnement du patient | 3 |
| | | 4 - Depassent l'effet therapeutique | 4 |

#### Calcul de l'Index Therapeutique (Visite de suivi uniquement)

**Matrice:**

|  | Aucun effet secondaire | Effet leger | Effet significatif | Depasse benefice |
|--|----------------------|-------------|-------------------|------------------|
| Effet Important | 1 | 2 | 3 | 4 |
| Effet Modere | 5 | 6 | 7 | 8 |
| Effet Minime | 9 | 10 | 11 | 12 |
| Effet Nul | 13 | 14 | 15 | 16 |

#### Interpretation Index Therapeutique
| Index | Interpretation |
|-------|----------------|
| 1-4 | Tres bon rapport benefice/risque |
| 5-8 | Bon rapport benefice/risque |
| 9-12 | Rapport benefice/risque modere |
| 13-16 | Mauvais rapport benefice/risque |

---

### EGF - Echelle Globale de Fonctionnement

**Code:** `EGF`  
**Description:** Evaluation du fonctionnement psychologique, social et professionnel sur un continuum hypothetique allant de la sante mentale a la maladie.

#### Question

| ID | Question | Plage |
|----|----------|-------|
| egf_score | Score a l'echelle EGF | 1-100 |

#### Guide de Cotation

| Plage | Description |
|-------|-------------|
| 100-91 | Niveau superieur de fonctionnement dans une grande variete d'activite. N'etes jamais deborde par les problemes rencontres. Etes recherche par autrui en raison de ses nombreuses qualites. Absence de symptomes. |
| 90-81 | Symptomes absents ou minimes (p. ex. anxiete legere avant un examen), fonctionnement satisfaisant dans tous les domaines, interesse et implique dans une grande variete d'activites, socialement efficace, en general satisfait de la vie. |
| 80-71 | Si des symptomes sont presents, ils sont transitoires et il s'agit de reactions previsibles a des facteurs de stress; pas plus qu'un handicap leger du fonctionnement social, professionnel ou scolaire. |
| 70-61 | Quelques symptomes legers (p. ex. humeur depressive et insomnie legere) ou une certaine difficulte dans le fonctionnement social, professionnel ou scolaire mais fonctionne assez bien de facon generale. |
| 60-51 | Symptomes d'intensite moyenne (p. ex. emoussement affectif, prolixite circonlocutoire, attaques de panique episodiques) ou difficultes d'intensite moyenne dans le fonctionnement. |
| 50-41 | Symptomes importants (p. ex. ideation suicidaire, rituels obsessionnels severes) ou handicap important dans le fonctionnement social, professionnel ou scolaire. |
| 40-31 | Existence d'une certaine alteration du sens de la realite ou de la communication ou handicap majeur dans plusieurs domaines. |
| 30-21 | Le comportement est notablement influence par des idees delirantes ou des hallucinations ou trouble grave de la communication ou incapable de fonctionner dans tous les domaines. |
| 20-11 | Existence d'un certain danger d'auto ou d'hetero-agression ou incapacite temporaire a maintenir une hygiene corporelle minimum ou alteration massive de la communication. |
| 10-1 | Danger persistant d'hetero-agression grave ou incapacite durable a maintenir une hygiene corporelle minimum ou geste suicidaire avec attente precise de la mort. |

---

### ALDA - Echelle de reponse au Lithium

**Code:** `ALDA`  
**Description:** Echelle d'evaluation retrospective de la reponse prophylactique au lithium.

#### Questions

**Depistage:**

| ID | Question | Options |
|----|----------|---------|
| q0 | Le patient est-il actuellement traite par lithium ? | Oui / Non |

**Critere A (si traite par lithium):**

| ID | Question | Options | Score |
|----|----------|---------|-------|
| qa | Veuillez coter le degre d'amelioration clinique globale observee sous traitement. | 0 - Aucun changement, ni pejoration | 0 |
| | | 1 - Amelioration minime. Reduction de l'activite de maladie de 0-10% | 1 |
| | | 2 - Amelioration legere. Reduction de 10-20% | 2 |
| | | 3 - Amelioration legere. Reduction de 20-35% | 3 |
| | | 4 - Amelioration moderee. Reduction de 35-50% | 4 |
| | | 5 - Bonne moderee. Reduction de 50-56% | 5 |
| | | 6 - Bonne reponse. Reduction de 65-80% | 6 |
| | | 7 - Bonne reponse. Reduction de 80-90% | 7 |
| | | 8 - Tres bonne reponse. Reduction de plus de 90% | 8 |
| | | 9 - Tres bonnes reponse, aucune recurrence mais symptomes residuels minimes | 9 |
| | | 10 - Reponse complete, aucune recurrence et recuperation fonctionnelle totale | 10 |

**Critere B - Facteurs de confusion:**

| ID | Question | Options | Score |
|----|----------|---------|-------|
| qb1 | B1: nombre d'episodes avant le traitement | 4 episodes ou plus | 0 |
| | | 2 ou 3 episodes | 1 |
| | | 1 episode | 2 |
| qb2 | B2: Frequence des episodes avant le traitement | Moyenne a elevee, incluant les cycles rapides | 0 |
| | | Faible, remissions spontanees de 3 ans ou plus en moyenne | 1 |
| | | 1 seul episode, risque de recurrence ne peut etre etabli | 2 |
| qb3 | B3: Duree du traitement | 2 ans ou plus | 0 |
| | | 1-2 ans | 1 |
| | | moins d'un an | 2 |
| qb4 | B4: Compliance durant la/les periode(s) de stabilite | Excellente, documentee par des taux dans les limites therapeutiques | 0 |
| | | Bonne, plus de 80% des taux dans les limites therapeutiques | 1 |
| | | Pauvre, moins de 80% des taux dans les limites therapeutiques | 2 |
| qb5 | B5: Usage de medication additionnelle durant la phase de stabilite | Aucun hormis de rares somniferes; pas d'autres stabilisateurs | 0 |
| | | Antidepresseurs ou antipsychotiques a faible dose comme securite | 1 |
| | | Usage prolonge ou systematique d'un antidepresseur ou antipsychotique | 2 |

#### Calcul du Score

**Formule:**
1. Score B Total = qb1 + qb2 + qb3 + qb4 + qb5
2. Si Score A < 7 : Score Total ALDA = 0
3. Sinon : Score Total ALDA = MAX(0, Score A - Score B)

#### Interpretation
| Score ALDA | Interpretation |
|------------|----------------|
| 7-10 | Bon repondeur (Reponse certaine) |
| 4-6 | Repondeur partiel / Reponse possible |
| 0-3 | Non-repondeur / Reponse improbable |

---

### ETAT_PATIENT - Symptomes DSM-IV

**Code:** `ETAT_PATIENT`  
**Description:** Liste de controle des symptomes depressifs et maniaques selon le DSM-IV, a remplir quel que soit l'etat thymique du patient.

#### Section: Symptomes Depressifs Actuels

| ID | Question | Reponses |
|----|----------|----------|
| q1 | Humeur depressive la majeure partie de la journee | Oui / Non / Ne sais pas |
| q1a | Impression subjective d'hyper-reactivite emotionnelle (si q1=Oui) | Oui / Non / Ne sais pas |
| q1b | Impression subjective d'hypo-reactivite ou d'anesthesie (si q1=Oui) | Oui / Non / Ne sais pas |
| q2 | Diminution marquee d'interet ou de plaisir dans toutes ou presque les activites habituelles | Oui / Non / Ne sais pas |
| q3 | Perte ou gain de poids significatif, ou diminution ou augmentation de l'appetit | Oui / Non / Ne sais pas |
| q4 | Insomnie ou hypersomnie | Oui / Non / Ne sais pas |
| q5 | Agitation ou ralentissement psychomoteur | Oui / Non / Ne sais pas |
| q6 | Fatigue ou perte d'energie | Oui / Non / Ne sais pas |
| q7 | Sentiment de devalorisation ou de culpabilite excessive ou inappropriee | Oui / Non / Ne sais pas |
| q8 | Diminution de l'aptitude a penser ou se concentrer ou indecision chaque jour | Oui / Non / Ne sais pas |
| q9 | Pensees recurrentes de mort, ideation suicidaire recurrente sans plan specifique, ou tentative de suicide ou plan precis | Oui / Non / Ne sais pas |

#### Section: Symptomes Maniaques Actuels

| ID | Question | Reponses |
|----|----------|----------|
| q10 | Humeur elevee, expansive | Oui / Non / Ne sais pas |
| q11 | Humeur irritable | Oui / Non / Ne sais pas |
| q12 | Augmentation de l'estime de soi ou idees de grandeur | Oui / Non / Ne sais pas |
| q13 | Reduction du besoin de sommeil | Oui / Non / Ne sais pas |
| q14 | Plus grande communicabilite que d'habitude ou desir de parler constamment | Oui / Non / Ne sais pas |
| q15 | Fuite des idees ou sensation subjective que les pensees defilent | Oui / Non / Ne sais pas |
| q16 | Distractibilite : l'attention du sujet etant trop facilement attiree par des stimuli exterieurs sans pertinence | Oui / Non / Ne sais pas |
| q17 | Activite dirigee vers un but : augmentation de l'activite ou agitation psychomotrice | Oui / Non / Ne sais pas |
| q18 | Engagement excessif dans des activites agreables mais a potentiel eleve de consequences dommageables | Oui / Non / Ne sais pas |

#### Calcul des Scores
**Formule:**
- Nombre de symptomes depressifs = Compte des "Oui" dans q1-q9
- Nombre de symptomes maniaques = Compte des "Oui" dans q10-q18

#### Interpretation
| Resultat | Interpretation |
|----------|----------------|
| Depressifs > 0 et Maniaques > 0 | Symptomes mixtes |
| Depressifs > 0 | Symptomes depressifs |
| Maniaques > 0 | Symptomes maniaques |
| Tous = 0 | Pas de symptomes depressifs ou maniaques significatifs |

---

### FAST - Echelle Breve d'evaluation du Fonctionnement

**Code:** `FAST`  
**Description:** Questionnaire evaluant le degre de difficulte rencontre par le patient dans differents aspects de son fonctionnement.  
**Nombre d'items:** 24  
**Score total:** 0-72 points

#### Options de reponse (pour tous les items)
| Code | Label | Score |
|------|-------|-------|
| 0 | Aucune difficulte | 0 |
| 1 | Difficulte legere | 1 |
| 2 | Difficulte moderee | 2 |
| 3 | Difficulte severe | 3 |

#### Sections et Questions

**AUTONOMIE:**
| ID | Question |
|----|----------|
| q1 | Prendre des responsabilites au sein de la maison |
| q2 | Vivre seul(e) |
| q3 | Faire les courses |
| q4 | Prendre soin de soi (aspect physique, hygiene...) |

**ACTIVITE PROFESSIONNELLE:**
| ID | Question |
|----|----------|
| q5 | Avoir un emploi remunere |
| q6 | Terminer les taches le plus rapidement possible |
| q7 | Travailler dans le champ correspondant a votre formation |
| q8 | Recevoir le salaire que vous meritez |
| q9 | Gerer correctement la somme de travail |

**FONCTIONNEMENT COGNITIF:**
| ID | Question |
|----|----------|
| q10 | Capacite a se concentrer devant un film, un livre.. |
| q11 | Capacite au calcul mental |
| q12 | Capacite a resoudre des problemes correctement |
| q13 | Capacite a se souvenir des noms recemment appris |
| q14 | Capacite a apprendre de nouvelles informations |

**FINANCES:**
| ID | Question |
|----|----------|
| q15 | Gerer votre propre argent |
| q16 | Depenser facon equilibree |

**RELATIONS INTERPERSONNELLES:**
| ID | Question |
|----|----------|
| q17 | Conserver des amities |
| q18 | Participer a des activites sociales |
| q19 | Avoir de bonnes relations avec vos proches |
| q20 | Habiter avec votre famille |
| q21 | Avoir des relations sexuelles satisfaisantes |
| q22 | Etre capable de defendre vos interets |

**LOISIRS:**
| ID | Question |
|----|----------|
| q23 | Faire de l'exercice ou pratiquer un sport |
| q24 | Avoir des loisirs |

#### Calcul du Score
**Formule:** Score total = Somme de tous les items (q1 a q24)

#### Interpretation
| Score | Interpretation |
|-------|----------------|
| 0-11 | Pas de difficulte de fonctionnement |
| 12-20 | Difficulte legere |
| 21-40 | Difficulte moderee |
| 41-72 | Difficulte severe |

---

## Module 5: Autoquestionnaires ETAT

---

### EQ-5D-5L - Qualite de vie

**Code:** `EQ5D5L`  
**Description:** Instrument standardise de mesure de l'etat de sante comprenant 5 dimensions et une echelle visuelle analogique (EVA).

#### Dimensions et Reponses

| ID | Dimension | Options | Score |
|----|-----------|---------|-------|
| mobility | Mobilite | Je n'ai aucun probleme pour me deplacer a pied | 1 |
| | | J'ai des problemes legers pour me deplacer a pied | 2 |
| | | J'ai des problemes moderes pour me deplacer a pied | 3 |
| | | J'ai des problemes severes pour me deplacer a pied | 4 |
| | | Je suis incapable de me deplacer a pied | 5 |
| self_care | Autonomie de la personne | Je n'ai aucun probleme pour me laver ou m'habiller tout seul | 1 |
| | | J'ai des problemes legers pour me laver ou m'habiller tout seul | 2 |
| | | J'ai des problemes moderes pour me laver ou m'habiller tout seul | 3 |
| | | J'ai des problemes severes pour me laver ou m'habiller tout seul | 4 |
| | | Je suis incapable de me laver ou de m'habiller tout(e) seul(e) | 5 |
| usual_activities | Activites courantes | Je n'ai aucun probleme pour accomplir mes activites courantes | 1 |
| | | J'ai des problemes legers pour accomplir mes activites courantes | 2 |
| | | J'ai des problemes moderes pour accomplir mes activites courantes | 3 |
| | | J'ai des problemes severes pour accomplir mes activites courantes | 4 |
| | | Je suis incapable d'accomplir mes activites courantes | 5 |
| pain_discomfort | Douleurs, gene | Je n'ai ni douleur, ni gene | 1 |
| | | J'ai des douleurs ou une gene legere(s) | 2 |
| | | J'ai des douleurs ou une gene moderee(s) | 3 |
| | | J'ai des douleurs ou une gene severe(s) | 4 |
| | | J'ai des douleurs ou une gene extreme(s) | 5 |
| anxiety_depression | Anxiete, depression | Je ne suis ni anxieux(se), ni deprime(e) | 1 |
| | | Je suis legerement anxieux(se) ou deprime(e) | 2 |
| | | Je suis moderement anxieux(se) ou deprime(e) | 3 |
| | | Je suis severement anxieux(se) ou deprime(e) | 4 |
| | | Je suis extremement anxieux(se) ou deprime(e) | 5 |
| vas_score | Echelle Visuelle Analogique | 0-100 (0 = pire sante imaginable, 100 = meilleure sante imaginable) | - |

#### Calcul du Score
- Profil de sante: Code a 5 chiffres (ex: 11111 = parfaite sante)
- Index d'utilite: Calcule via la table France Crosswalk (valeurs de -0.530 a 1.000)

---

### STAI-YA - Inventaire d'Anxiete Etat

**Code:** `STAI_YA`  
**Description:** Inventaire d'Anxiete Etat (Forme Y-A)  
**Nombre d'items:** 20  
**Score total:** 20-80 points

#### Questions et Reponses

| ID | Question | Options |
|----|----------|---------|
| q1 | Je me sens calme. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q2 | Je me sens en securite, sans inquietude, en surete. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q3 | Je suis tendu(e), crispe(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q4 | Je me sens surmene(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q5 | Je me sens tranquille, bien dans ma peau. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q6 | Je me sens emu(e), bouleverse(e), contrarie(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q7 | L'idee de malheurs eventuels me tracasse en ce moment. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q8 | Je me sens content(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q9 | Je me sens effraye(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q10 | Je me sens a mon aise. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q11 | Je sens que j'ai confiance en moi. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q12 | Je me sens nerveux (nerveuse), irritable. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q13 | J'ai la frousse, la trouille (j'ai peur). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q14 | Je me sens indecis(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q15 | Je suis decontracte(e), detendu(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q16 | Je suis satisfait(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q17 | Je suis inquiet, soucieux (inquiete, soucieuse). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q18 | Je ne sais plus ou j'en suis, je me sens deconcerte(e), deroute(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q19 | Je me sens solide, pose(e), pondere(e), reflechi(e). | non (1) / plutot non (2) / plutot oui (3) / oui (4) |
| q20 | Je me sens de bonne humeur, aimable. | non (1) / plutot non (2) / plutot oui (3) / oui (4) |

#### Calcul du Score
**Items inverses:** q1, q2, q5, q8, q10, q11, q15, q16, q19, q20
**Formule:** Score total = Somme des items (avec inversion pour les items positifs: 5 - score)

#### Interpretation
| Score | Interpretation |
|-------|----------------|
| 20-35 | Anxiete tres faible |
| 36-45 | Anxiete faible |
| 46-55 | Anxiete moderee |
| 56-65 | Anxiete elevee |
| 66-80 | Anxiete tres elevee |

---

### MARS - Medication Adherence Rating Scale

**Code:** `MARS`  
**Description:** Medication Adherence Rating Scale  
**Nombre d'items:** 10

#### Questions et Reponses

| ID | Question | Reponses |
|----|----------|----------|
| q1 | Vous est-il parfois arrive d'oublier de prendre vos medicaments ? | Non (0) / Oui (1) |
| q2 | Negligez-vous parfois l'heure de prise d'un de vos medicaments ? | Non (0) / Oui (1) |
| q3 | Lorsque vous vous sentez mieux, interrompez-vous parfois votre traitement ? | Non (0) / Oui (1) |
| q4 | Vous est-il arrive d'arreter le traitement parce que vous vous sentiez moins bien en le prenant ? | Non (0) / Oui (1) |
| q5 | Je ne prends les medicaments que lorsque je me sens malade. | Non (0) / Oui (1) |
| q6 | Ce n'est pas naturel pour mon corps et mon esprit d'etre equilibre par des medicaments. | Non (0) / Oui (1) |
| q7 | Mes idees sont plus claires avec les medicaments. | Non (0) / Oui (1) |
| q8 | En continuant a prendre les medicaments, je peux eviter de tomber a nouveau malade. | Non (0) / Oui (1) |
| q9 | Avec les medicaments, je me sens bizarre, comme un "zombie". | Non (0) / Oui (1) |
| q10 | Les medicaments me rendent lourd(e) et fatigue(e). | Non (0) / Oui (1) |

#### Calcul du Score
**Items positifs (0=mauvaise adherence):** q7, q8
**Items negatifs (1=mauvaise adherence):** q1, q2, q3, q4, q5, q6, q9, q10
**Score:** Plus le score est bas, meilleure est l'adherence

---

### MAThyS - Evaluation Multidimensionnelle des etats thymiques

**Code:** `MATHYS`  
**Description:** Evaluation Multidimensionnelle des etats thymiques  
**Nombre d'items:** 20  
**Type:** Echelle visuelle 0-10

#### Questions (Echelle bipolaire 0-10)

| ID | Question (pole bas - pole haut) |
|----|--------------------------------|
| q1 | Je suis moins sensible que d'habitude aux couleurs / Je suis plus sensible que d'habitude aux couleurs |
| q2 | Je manque de tonus / J'ai une tension interne importante |
| q3 | J'ai l'impression d'etre anesthesie(e) sur le plan des emotions / J'ai parfois le sentiment de perdre le controle de mes emotions |
| q4 | Je suis replie(e) sur moi / J'ai l'impression d'etre ouvert(e) au monde |
| q5 | Mes pensees vont lentement / Mes pensees vont vite |
| q6 | Mes mouvements sont lents / Mes mouvements sont rapides |
| q7 | Je me sens ralenti(e) / Je me sens accelere(e) |
| q8 | J'ai des difficultes a penser / Je pense avec facilite |
| q9 | Je n'ai envie de rien / J'ai envie de plein de choses |
| q10 | Je n'ai pas d'interet pour ce qui m'entoure / Je suis tres interesse(e) par ce qui m'entoure |
| q11 | Mes sens me semblent emousses / Mes sens me semblent aiguises |
| q12 | Je n'ai pas d'energie / J'ai beaucoup d'energie |
| q13 | Je me sens triste / Je me sens gai(e) |
| q14 | Je me sens calme / Je me sens agite(e) |
| q15 | J'ai peu d'idees / J'ai plein d'idees |
| q16 | Je suis peu reactif(ve) a ce qui m'entoure / Je suis tres reactif(ve) a ce qui m'entoure |
| q17 | Je ne prends aucune initiative / Je prends beaucoup d'initiatives |
| q18 | Je ne me lance dans aucune activite / Je me lance dans plein d'activites |
| q19 | J'ai l'impression de vivre au ralenti / J'ai l'impression de vivre intensement |
| q20 | Je me sens fatigue(e) / Je me sens en pleine forme |

---

### EPWORTH - Echelle de Somnolence

**Code:** `EPWORTH`  
**Description:** Echelle de Somnolence d'Epworth  
**Nombre d'items:** 8  
**Score total:** 0-24 points

#### Questions et Reponses

| ID | Situation | Options | Score |
|----|-----------|---------|-------|
| q1 | Assis en train de lire | ne somnolerait jamais | 0 |
| | | faible chance de s'endormir | 1 |
| | | chance moyenne de s'endormir | 2 |
| | | forte chance de s'endormir | 3 |
| q2 | En train de regarder la television | memes options | 0-3 |
| q3 | Assis, inactif, dans un endroit public (au theatre, en reunion) | memes options | 0-3 |
| q4 | Comme passager dans une voiture roulant sans arret pendant une heure | memes options | 0-3 |
| q5 | Allonge l'apres-midi pour se reposer quand les circonstances le permettent | memes options | 0-3 |
| q6 | Assis en train de parler a quelqu'un | memes options | 0-3 |
| q7 | Assis calmement apres un repas sans alcool | memes options | 0-3 |
| q8 | Dans une auto immobilisee quelques minutes dans un encombrement | memes options | 0-3 |

#### Calcul du Score
**Formule:** Score total = q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8

#### Interpretation
| Score | Interpretation |
|-------|----------------|
| 0-5 | Somnolence diurne normale |
| 6-10 | Somnolence diurne moderee |
| 11-12 | Somnolence diurne importante |
| 13-24 | Somnolence diurne severe |

---

## Module 7: Autoquestionnaires TRAITS

---

### ASRS v1.1 - Echelle d'autoevaluation du TDAH

**Code:** `ASRS`  
**Description:** Echelle d'autoevaluation du TDAH chez l'adulte  
**Nombre d'items:** 18 (Part A: 6 items de depistage, Part B: 12 items supplementaires)

#### Options de reponse (pour tous les items)
| Code | Label | Score |
|------|-------|-------|
| 0 | Jamais | 0 |
| 1 | Rarement | 1 |
| 2 | Parfois | 2 |
| 3 | Souvent | 3 |
| 4 | Tres souvent | 4 |

#### Part A - Items de depistage

| ID | Question |
|----|----------|
| a1 | A quelle frequence vous arrive-t-il d'avoir des difficultes a finaliser les details d'un projet une fois que les parties les plus stimulantes ont ete faites ? |
| a2 | A quelle frequence vous arrive-t-il d'avoir des difficultes a mettre de l'ordre dans les choses ou dans votre vie quand vous devez faire quelque chose qui demande de l'organisation ? |
| a3 | A quelle frequence avez-vous des difficultes a vous rappeler d'honorer des rendez-vous ou des obligations ? |
| a4 | Quand vous avez une tache qui requiert beaucoup de reflexion, a quelle frequence remettez-vous les choses a plus tard ? |
| a5 | A quelle frequence vous arrive-t-il de remuer ou de vous tortiller avec les mains ou les pieds lorsque vous devez rester assis(e) pendant une longue periode ? |
| a6 | A quelle frequence vous sentez-vous trop actif(ve), oblige(e) d'agir comme si vous etiez "drive(e) par un moteur" ? |

#### Part B - Items supplementaires

| ID | Question |
|----|----------|
| b7 | A quelle frequence vous arrive-t-il de faire des fautes d'etourderie lorsque vous travaillez sur un projet ou une tache qui demande de l'attention ? |
| b8 | A quelle frequence vous arrive-t-il d'avoir des difficultes a vous concentrer lorsque vous faites un travail ennuyeux ou repetitif ? |
| b9 | A quelle frequence vous arrive-t-il d'avoir des difficultes a vous concentrer sur les propos de votre interlocuteur, meme s'il s'adresse directement a vous ? |
| b10 | A la maison ou au travail, a quelle frequence vous arrive-t-il d'egarer des choses ou d'avoir des difficultes a les retrouver ? |
| b11 | A quelle frequence vous arrive-t-il d'etre distrait(e) par l'activite ou par le bruit autour de vous ? |
| b12 | A quelle frequence vous arrive-t-il de quitter votre siege pendant des reunions ou d'autres situations ou vous devez rester assis(e) ? |
| b13 | A quelle frequence vous arrive-t-il d'avoir des difficultes a attendre votre tour ? |
| b14 | A quelle frequence vous arrive-t-il d'interrompre les gens ou d'empieter sur les activites des autres ? |
| b15 | A quelle frequence vous arrive-t-il d'avoir des difficultes a vous detendre et a vous reposer ? |
| b16 | A quelle frequence vous arrive-t-il d'achever la plupart des taches que vous commencez ? |
| b17 | A quelle frequence vous arrive-t-il d'eviter ou d'avoir du mal a commencer des taches qui demandent un effort mental soutenu ? |
| b18 | A quelle frequence vous arrive-t-il de parler trop, plus que les autres ? |

#### Depistage (Part A)
**Seuils de positivite:**
- a1, a2, a3: >= 2 (Parfois)
- a4, a5, a6: >= 3 (Souvent)

**Resultat:** 4 items ou plus au-dessus du seuil = Depistage positif pour TDAH

---

### CTQ - Childhood Trauma Questionnaire

**Code:** `CTQ`  
**Description:** Childhood Trauma Questionnaire  
**Nombre d'items:** 28

#### Options de reponse
| Code | Label | Score |
|------|-------|-------|
| 1 | Jamais vrai | 1 |
| 2 | Rarement vrai | 2 |
| 3 | Quelquefois vrai | 3 |
| 4 | Souvent vrai | 4 |
| 5 | Tres souvent vrai | 5 |

#### Sous-echelles et Items

**Abus emotionnel (q3, q8, q14, q18, q25):**
- Des membres de ma famille me disaient que j'etais "stupide" ou "paresseux" ou "laid".
- Je pensais que mes parents n'avaient pas souhaite ma naissance.
- Des membres de ma famille me disaient des choses blessantes ou insultantes.
- J'ai senti que quelqu'un dans ma famille me haissait.
- Je crois que j'ai ete emotionnellement maltraite(e).

**Abus physique (q9, q11, q12, q15, q17):**
- J'ai ete frappe(e) si fort par un membre de ma famille que j'ai du consulter un docteur ou aller a l'hopital.
- Des membres de ma famille me frappaient si fort que j'avais des bleus ou des marques.
- J'etais puni(e) avec une ceinture, une planche, une corde ou d'autres objets durs.
- Je crois que j'ai ete physiquement maltraite(e).
- J'ai ete frappe(e) ou battu(e) si fort que quelqu'un l'a remarque.

**Abus sexuel (q20, q21, q23, q24, q27):**
- Quelqu'un a essaye de me toucher sexuellement ou de me faire toucher.
- Quelqu'un m'a menace(e) de me blesser ou de mentir sur mon compte si je ne faisais pas quelque chose de sexuel avec lui/elle.
- Quelqu'un a essaye de me faire faire ou regarder des choses sexuelles.
- Quelqu'un m'a moleste(e).
- Je crois que j'ai ete abuse(e) sexuellement.

**Negligence emotionnelle (q5, q7, q13, q19, q28) - items inverses:**
- Il y avait quelqu'un dans ma famille qui m'aidait a sentir que j'etais important ou particulier.
- Je me sentais aime(e).
- Les membres de ma famille prenaient soin les uns des autres.
- Les membres de ma famille se sentaient proches les uns des autres.
- Ma famille etait une source de force et de soutien.

**Negligence physique (q1, q2, q4, q6, q26):**
- Il m'est arrive de ne pas avoir assez a manger.
- Je savais qu'il y avait quelqu'un pour prendre soin de moi et me proteger. (inverse)
- Mes parents etaient trop saouls ou "petes" pour s'occuper de la famille.
- Je devais porter des vetements sales.
- Il y avait quelqu'un pour m'amener chez le docteur si j'en avais besoin. (inverse)

---

### BIS-10 - Barratt Impulsiveness Scale

**Code:** `BIS10`  
**Description:** Barratt Impulsiveness Scale - Version courte  
**Nombre d'items:** 12

#### Questions et Reponses

| ID | Question | Options |
|----|----------|---------|
| q1 | Je prepare soigneusement les taches a accomplir. | Rarement/Jamais (1) / Occasionnellement (2) / Souvent (3) / Presque toujours/Toujours (4) |
| q2 | Je fais les choses sans reflechir. | memes options |
| q3 | Je decide rapidement. | memes options |
| q4 | Je suis insouciant(e). | memes options |
| q5 | Je ne fais pas attention. | memes options |
| q6 | Je suis quelqu'un qui reflechit. | memes options |
| q7 | Je m'organise bien pour mes loisirs. | memes options |
| q8 | Je me controle facilement. | memes options |
| q9 | Je me concentre facilement. | memes options |
| q10 | J'agis de facon impulsive. | memes options |
| q11 | Je dis les choses sans reflechir. | memes options |
| q12 | J'agis sur un coup de tete. | memes options |

#### Items inverses: q1, q6, q7, q8, q9

---

### WURS-25 - Wender Utah Rating Scale

**Code:** `WURS25`  
**Description:** Wender Utah Rating Scale  
**Nombre d'items:** 25

#### Options de reponse
| Code | Label | Score |
|------|-------|-------|
| 0 | Pas du tout ou tres peu | 0 |
| 1 | Un peu | 1 |
| 2 | Moyennement | 2 |
| 3 | Passablement | 3 |
| 4 | Beaucoup | 4 |

#### Questions (Enfant, j'etais...)

| ID | Question |
|----|----------|
| q1 | Des problemes de concentration, facilement distrait(e) |
| q2 | Anxieux(se), se faisant du souci |
| q3 | Nerveux, ne tenant pas en place |
| q4 | Inattentif(ve), reveur(se) |
| q5 | Facilement en colere, "soupe au lait" |
| q6 | Des eclats d'humeur, des acces de colere |
| q7 | Des difficultes a me tenir aux choses, a mener mes projets jusqu'a la fin |
| q8 | Tetu(e), obstine(e) |
| q9 | Triste ou cafardeux(se), deprime(e), malheureux(se) |
| q10 | Desobeissant(e) a mes parents, rebelle, effronte(e) |
| q11 | Une faible opinion de moi-meme |
| q12 | Irritable |
| q13 | Colerique, ayant mauvais caractere |
| q14 | Agir sans reflechir, impulsif(ve) |
| q15 | Tendance a etre immature |
| q16 | Un sentiment de culpabilite, de regret |
| q17 | Perdre le controle de moi-meme |
| q18 | Tendance a etre ou a agir de facon irrationnelle |
| q19 | Impopulaire avec les autres enfants, je n'avais pas d'amis proches |
| q20 | Problemes avec les autorites a l'ecole, visites chez le directeur |
| q21 | Mauvais resultats scolaires, n'etais pas bon(ne) a l'ecole |
| q22 | Des difficultes a s'arreter et a reflechir |
| q23 | Problemes avec la police, activites illegales |
| q24 | Nerveux(se), agite(e) |
| q25 | Tendance a rever eveille(e) |

#### Interpretation
| Score | Interpretation |
|-------|----------------|
| < 36 | Probable absence de TDAH dans l'enfance |
| 36-46 | Zone intermediaire |
| > 46 | Probable TDAH dans l'enfance |

---

## Informations sur les Tests Neuropsychologiques

Les tests neuropsychologiques (WAIS-III, WAIS-IV, TMT, Stroop, Fluences Verbales, CVLT, COBRA, CPT-III, SCIP, Test des Commissions) sont implementes avec des fiches de recueil specifiques adaptees a chaque test. Les scores bruts sont convertis en scores standardises (notes standard, percentiles) selon les normes de chaque test.

Pour les details complets de ces tests, se referer aux fichiers source:
- `lib/constants/questionnaires-hetero.ts` (definitions WAIS-III, WAIS-IV)
- `lib/services/questionnaire-hetero.service.ts` (calculs de scores)

---

*Document genere automatiquement a partir du code source de la plateforme eFondaMental.*
*Version: 2024-12*
