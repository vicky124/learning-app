export const machineLearningSection = {
  id: 'machine-learning',
  label: 'Machine Learning',
  icon: '🤖',
  groups: [
    {
      id: 'machine-learning-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-machine-learning',
          title: 'What Machine Learning Actually Is',
          summary:
            'Machine learning replaces hand-written rules with a program that learns its own rules from data — you supply examples and a way to measure error, and the algorithm searches for parameters that minimize it.',
          keyPoints: [
            'Traditional programming: a human writes explicit rules (if/else logic), and the computer applies those rules to data to produce output.',
            'Machine learning: you supply data plus the desired output, and the algorithm searches for the rules (a function\'s parameters) that map one to the other.',
            'This shift matters most when the true rules are too complex, too numerous, or too poorly understood to hand-write — spam detection, image recognition, fraud detection, recommendation.',
            'A trained model is, mechanically, just a function with learned parameters (weights) — nothing more mystical than that: input in, learned transformation applied, output out.',
            'ML is not free lunch: it needs enough representative data, a way to measure error (a loss function), and a hypothesis space rich enough to capture the true pattern — otherwise it fails quietly rather than loudly.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every piece of software maps inputs to outputs. The question machine learning answers differently than traditional engineering is: **where do the rules for that mapping come from?** In traditional programming, a developer reasons about the problem and writes the logic explicitly. In machine learning, the developer instead writes an algorithm that can *discover* the logic itself, by being shown many examples of input paired with correct output, and adjusting internal parameters until its own predictions match those examples closely enough.',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Traditional["Traditional Programming"]
        direction LR
        Rules1["Rules (hand-written)"] --> Prog1[Program]
        Data1[Data] --> Prog1
        Prog1 --> Out1[Output]
    end
    subgraph ML["Machine Learning"]
        direction LR
        Data2[Data] --> Prog2["Learning Algorithm"]
        Out2["Desired Output (labels)"] --> Prog2
        Prog2 --> Rules2["Learned Model (rules)"]
    end`,
            },
            {
              type: 'list',
              items: [
                '**Where ML wins**: the mapping is too complex to enumerate by hand (recognizing a cat in a photo has no clean set of if/else rules), the rules drift over time and should adapt from new data (fraud patterns, spam techniques), or personalization requires a different function per user at a scale no one could hand-write.',
                '**Where ML is the wrong tool**: the rules are simple, fully known, and rarely change (computing tax owed from a known formula) — a hand-written function is more accurate, more debuggable, and has zero training cost.',
                'A model does not "understand" anything — it has found a function, fit to the data it was shown, that happens to generalize (or not) to new data. Every failure mode in this guide (overfitting, bias, drift) follows from taking that sentence seriously.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When an interviewer asks "what is machine learning?", the strongest one-line answer is precise, not poetic: **a system that improves its performance on a task by learning parameters from data, guided by a measurable objective, rather than from explicitly programmed rules.**',
            },
          ],
        },
        {
          id: 'types-of-learning',
          title: 'Supervised, Unsupervised, and Reinforcement Learning',
          summary:
            'The three major learning paradigms differ in exactly one thing: what feedback the algorithm gets — labeled correct answers, no labels at all, or a delayed reward signal from acting in an environment.',
          keyPoints: [
            '**Supervised learning**: the training data is (input, correct output) pairs — the model learns to predict the output for new, unseen inputs. Examples: spam classification, house price prediction, image labeling.',
            '**Unsupervised learning**: the training data has no labels — the model finds structure (clusters, compressed representations, density) in the data itself. Examples: customer segmentation, anomaly detection, dimensionality reduction.',
            '**Reinforcement learning**: an agent takes actions in an environment and receives (often delayed) rewards — it learns a policy that maximizes cumulative reward through trial and error, not from a fixed labeled dataset. Examples: game-playing agents, robotics control, ad-bidding strategies.',
            '**Semi-supervised** and **self-supervised** learning sit between these: a small amount of labeled data plus a large amount of unlabeled data, or labels manufactured automatically from the data itself (e.g., predicting a masked word) — the dominant recipe behind modern large pretrained models.',
            'The paradigm is a property of the *problem setup* (what feedback is available), not the algorithm family — the same neural network architecture can be trained in a supervised, unsupervised, or self-supervised way depending on what objective it is given.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    ML[Machine Learning] --> Sup[Supervised Learning]
    ML --> Unsup[Unsupervised Learning]
    ML --> RL[Reinforcement Learning]
    Sup --> SupC["Classification: spam or not, image label"]
    Sup --> SupR["Regression: house price, demand forecast"]
    Unsup --> UnsupCl["Clustering: customer segments"]
    Unsup --> UnsupDr["Dimensionality reduction: PCA, visualization"]
    Unsup --> UnsupAn["Anomaly detection: fraud, defects"]
    RL --> RLAgent["Agent acts in an environment, learns from delayed reward"]`,
            },
            {
              type: 'table',
              headers: ['Paradigm', 'Feedback signal', 'Goal', 'Concrete example'],
              rows: [
                ['Supervised', 'Labeled (input, correct output) pairs', 'Predict the label for new inputs', 'Predict house price from square footage, location, age'],
                ['Unsupervised', 'No labels', 'Discover structure in the data', 'Group customers into behavioral segments'],
                ['Reinforcement', 'Reward signal from an environment, often delayed', 'Learn a policy maximizing cumulative reward', 'A game-playing agent learning which moves win, from wins/losses alone'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Reinforcement learning is fundamentally different from the other two because the data is not fixed in advance — the agent\'s own actions determine what data (states, rewards) it sees next. This creates the exploration-vs-exploitation problem (try something new vs. use what already works) that has no analog in supervised or unsupervised learning.',
            },
          ],
        },
        {
          id: 'bias-variance-tradeoff',
          title: 'The Bias-Variance Tradeoff, Precisely',
          summary:
            'A model\'s total prediction error decomposes into bias (systematic error from an overly simple model), variance (sensitivity to the specific training set), and irreducible noise — and bias and variance trade off against each other as model complexity changes.',
          keyPoints: [
            '**Bias** is error from wrong assumptions in the learning algorithm — a model too simple to capture the true pattern, systematically missing it in the same way regardless of which training set it saw (underfitting).',
            '**Variance** is error from sensitivity to the specific training set — a model complex enough to fit noise in the training data, so it changes drastically if trained on a different sample (overfitting).',
            'Formally, for squared error: expected test error = Bias² + Variance + Irreducible Error. You cannot make bias and variance both zero simultaneously for a fixed amount of data — reducing one past a point increases the other.',
            'Increasing model complexity (more features, deeper trees, more neural-net layers) typically **decreases bias** but **increases variance**; simplifying a model (regularization, fewer parameters, more aggressive pruning) does the reverse.',
            'The practical goal is not eliminating bias or variance individually — it is finding the complexity level that minimizes their *sum*, which is exactly what validation-set performance is used to locate.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Imagine training the same type of model on many different random training sets drawn from the same distribution, then averaging the predictions. **Bias** is how far that average prediction is from the true value — a systematic, repeatable error baked into the model\'s assumptions (e.g., fitting a straight line to a curved relationship will always miss it the same way). **Variance** is how much the predictions swing between the different training sets — a model with high variance produces a very different fit depending on which particular sample of data it happened to see, even if the underlying data-generating process never changed.',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph LowVariance["Low Variance (tight clustering)"]
        LB_LV["Low Bias: tightly clustered ON the target - ideal"]
        HB_LV["High Bias: tightly clustered OFF the target - consistently wrong"]
    end
    subgraph HighVariance["High Variance (scattered)"]
        LB_HV["Low Bias: scattered but centered ON the target - noisy"]
        HB_HV["High Bias: scattered and OFF the target - worst case"]
    end`,
            },
            {
              type: 'table',
              headers: ['', 'Low Variance', 'High Variance'],
              rows: [
                ['Low Bias', 'Ideal — accurate and consistent', 'Overfitting — accurate on average, but unstable'],
                ['High Bias', 'Underfitting — consistently, systematically wrong', 'Worst case — both wrong and unstable (rare in practice, usually a broken setup)'],
              ],
            },
            {
              type: 'list',
              items: [
                '**High-bias symptoms**: training error is high, and validation/test error is about the same as training error (the model is too simple to even fit the training data well) — fix by increasing model complexity, adding features, reducing regularization.',
                '**High-variance symptoms**: training error is low, but validation/test error is much higher (the model memorized the training set\'s noise) — fix by getting more training data, reducing model complexity, or increasing regularization.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The single fastest diagnostic in practice: plot training error and validation error together. A large **gap** between them (train low, validation high) says high variance; both being high and close together says high bias. This one comparison drives most of the "what do I change next" decisions in model development.',
            },
            {
              type: 'heading',
              text: 'Where the decomposition comes from',
            },
            {
              type: 'p',
              text: 'Assume the data is generated as `y = f(x) + ε` with noise `ε` of mean 0 and variance `σ²`, and let `f_hat_D` be the model trained on a random dataset `D`. At a fixed point `x`, add and subtract the average model `E_D[f_hat_D(x)]` inside `E[(y - f_hat_D(x))²]`; all cross terms vanish because the noise is independent of `D` and has mean zero. What remains is exactly three non-negative terms: `(f(x) - E_D[f_hat_D(x)])²` (bias squared), `E_D[(f_hat_D(x) - E_D[f_hat_D(x)])²]` (variance) and `σ²` (irreducible noise). The derivation is specific to squared error; for 0-1 loss and cross-entropy there are analogous but messier decompositions, which is why the "bias + variance + noise" picture should be treated as a guiding intuition for classifiers rather than an exact identity.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'estimating bias and variance empirically by resampling',
              code: `import numpy as np
from sklearn.tree import DecisionTreeRegressor

rng = np.random.default_rng(0)
f = lambda x: np.sin(2 * np.pi * x)            # the true function
x_test = np.linspace(0, 1, 200)[:, None]

def bias_variance(make_model, n_datasets=200, n=50, noise=0.3):
    preds = []
    for _ in range(n_datasets):                   # many independent training sets
        x = rng.uniform(0, 1, (n, 1))
        y = f(x).ravel() + rng.normal(0, noise, n)
        preds.append(make_model().fit(x, y).predict(x_test))
    preds = np.array(preds)                       # (n_datasets, 200)
    avg = preds.mean(axis=0)
    bias_sq = np.mean((avg - f(x_test).ravel()) ** 2)
    variance = np.mean(preds.var(axis=0))
    return bias_sq, variance

for depth in [1, 3, 6, None]:
    b, v = bias_variance(lambda: DecisionTreeRegressor(max_depth=depth))
    print(f"max_depth={depth}: bias^2={b:.3f}  variance={v:.3f}")
# shallow trees: high bias, low variance; unlimited depth: near-zero bias, high variance`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: '**Double descent.** The classic U-shaped test-error curve is not the whole story for heavily over-parameterized models. As capacity grows past the *interpolation threshold* (the point where the model can fit the training set exactly), test error can peak and then **fall again** — observed for wide neural networks, random-feature models and even boosted ensembles. The usual explanation is implicit regularization: among the many parameter settings that interpolate the data, gradient descent tends to find low-norm, "smooth" ones. This does not repeal the bias-variance tradeoff; it means that for deep learning, "more parameters" is not automatically "more variance", and the effective complexity also depends on the optimizer, data size and regularization.',
            },
          ],
        },
        {
          id: 'train-validation-test-split',
          title: 'Train / Validation / Test Splits, and Why a Model Can Cheat',
          summary:
            'A model evaluated on the data it was trained on will always look better than it actually is — a proper held-out test set, touched exactly once, is the only way to get an honest estimate of real-world performance.',
          keyPoints: [
            'The **training set** is what the model directly learns its parameters from.',
            'The **validation set** is used to tune hyperparameters and make model-selection decisions during development — it is not directly trained on, but it is used repeatedly, so it leaks a little information into the choices you make.',
            'The **test set** is touched exactly once, at the very end, to report final, honest performance — if you tune anything based on test-set results, it stops being a valid test set (it has effectively become a second validation set).',
            'A typical split is 60/20/20 or 70/15/15 for small-to-medium datasets; with very large datasets, even a small percentage (e.g., 1%) can be a statistically sufficient validation/test set in absolute terms.',
            '**k-fold cross-validation** rotates which fold is held out for validation across k rounds, averaging the results — squeezing more reliable signal out of limited data than one fixed validation split, at the cost of k times the training compute.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A model can trivially achieve near-zero error on the exact data it was trained on by simply memorizing it — that number tells you almost nothing about how the model will behave on data it has never seen, which is the only scenario that matters in production. The held-out test set exists to simulate "data the model has never seen" as faithfully as possible, which only works if it is genuinely never used to make any decision about the model (not architecture, not hyperparameters, not even "let\'s just peek once more").',
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    All["Full Dataset"] --> Train["Training Set ~60-70%<br/>fit model parameters"]
    All --> Val["Validation Set ~15-20%<br/>tune hyperparameters, pick model"]
    All --> Test["Test Set ~15-20%<br/>touched ONCE, final honest score"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'a correct train/val/test workflow',
              code: `from sklearn.model_selection import train_test_split

# split off test set first, and never touch it again until the very end
# stratify keeps class proportions identical across splits (important for imbalanced labels)
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.15, stratify=y, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.15 / 0.85, stratify=y_temp, random_state=42)
# 0.15 / 0.85 of the remaining 85% == 15% of the original data

best_model, best_score = None, -float('inf')
for candidate in candidate_models:
    candidate.fit(X_train, y_train)
    score = candidate.score(X_val, y_val)   # model selection uses validation, not test
    if score > best_score:
        best_model, best_score = candidate, score

final_score = best_model.score(X_test, y_test)  # reported exactly once`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Data leakage** is the sneaky version of this mistake: fitting a scaler, imputer, or feature-selection step on the *entire* dataset before splitting lets statistics from the test set (its mean, its distribution) leak into preprocessing the training set sees — inflating validation/test scores in a way that will not hold up in production. Always fit preprocessing only on the training fold, then apply (transform, not fit) it to validation/test.',
            },
            {
              type: 'heading',
              text: 'A random split is not always an honest split',
            },
            {
              type: 'p',
              text: 'A random split silently assumes that rows are **independent and identically distributed** and that production data will look like a random sample of your historical data. Both assumptions break constantly. The rule that replaces "split randomly" is: **split the data the same way the model will meet new data in production.**',
            },
            {
              type: 'table',
              headers: ['Situation', 'Wrong split', 'Honest split', 'Why'],
              rows: [
                ['Data with a time dimension (sales, fraud, churn)', 'Random shuffle', 'Train on the past, validate/test on a later period', 'In production you always predict the future; a random split lets the model peek at future patterns'],
                ['Several rows per entity (patients, users, devices)', 'Random rows', 'Group split: every row of an entity lands in exactly one split', 'Otherwise the model recognizes the entity rather than learning the pattern'],
                ['Near-duplicates (crawled text, augmented images)', 'Random rows', 'De-duplicate first, or split by source/cluster', 'Copies on both sides of the split inflate scores'],
                ['Rare classes', 'Plain random', 'Stratified split', 'A small test set may otherwise contain almost no positives'],
                ['Model will serve a new region/customer', 'Random rows', 'Hold out whole regions/customers', 'Measures generalization to the population you actually care about'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Statistical noise in the test score matters too. With 1,000 test examples and 90% accuracy, the standard error is roughly `sqrt(0.9 * 0.1 / 1000)`, about 0.95 percentage points, so a 95% interval spans roughly plus or minus 1.9 points. A "0.5 point improvement" on that test set is indistinguishable from noise. Report confidence intervals (bootstrap the test set) before claiming one model beats another.',
            },
          ],
        },
        {
          id: 'cross-validation-hyperparameter-tuning',
          title: 'Cross-Validation and Hyperparameter Tuning',
          summary:
            'Cross-validation turns one noisy validation score into an average over several folds, and hyperparameter search uses those scores to pick a configuration — done carelessly, both quietly overfit the validation data and report optimistic numbers.',
          keyPoints: [
            '**k-fold CV** splits the training data into k folds, trains k models (each holding out a different fold) and averages the k validation scores; the spread across folds is as informative as the mean.',
            'Pick the CV splitter to match the data: `StratifiedKFold` for classification, `GroupKFold` / `StratifiedGroupKFold` when rows share an entity, `TimeSeriesSplit` (expanding window) for temporal data.',
            '**Hyperparameters** (tree depth, learning rate, regularization strength) are not learned by `fit`; they are chosen by comparing CV scores. Random search beats grid search for the same budget when only a few hyperparameters really matter; Bayesian/TPE optimizers (e.g. Optuna) are better still for expensive models.',
            'The best CV score after searching hundreds of configurations is **optimistically biased** — you selected the maximum of many noisy estimates. Use **nested CV** or an untouched test set to estimate the performance of the whole "tune then train" procedure.',
            'Every data-dependent preprocessing step (scaling, imputation, encoding, feature selection, resampling) must live **inside** the CV loop, which in scikit-learn means inside a `Pipeline`.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Data["Training data (test set already locked away)"] --> F1["Fold 1: train on folds 2-5, score fold 1"]
    Data --> F2["Fold 2: train on folds 1,3-5, score fold 2"]
    Data --> F3["..."]
    Data --> F5["Fold 5: train on folds 1-4, score fold 5"]
    F1 --> Avg["Mean and std of the 5 scores"]
    F2 --> Avg
    F3 --> Avg
    F5 --> Avg
    Avg --> Pick["Compare configurations, pick the best"]
    Pick --> Refit["Refit best config on ALL training data"]
    Refit --> Test["Score once on the locked test set"]`,
            },
            {
              type: 'table',
              headers: ['Splitter', 'Use when', 'Guarantee'],
              rows: [
                ['KFold(shuffle=True)', 'Regression on i.i.d. rows', 'Every row is validated exactly once'],
                ['StratifiedKFold', 'Classification, especially imbalanced', 'Each fold keeps the overall class ratio'],
                ['GroupKFold / StratifiedGroupKFold', 'Multiple rows per user/patient/session', 'No group appears in both train and validation'],
                ['TimeSeriesSplit', 'Forecasting, any time-ordered data', 'Validation always comes after training in time (optionally with a gap)'],
                ['RepeatedStratifiedKFold', 'Small datasets where fold assignment noise is large', 'Averages over several random fold assignments'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'leakage-safe tuning: Pipeline + randomized search + nested CV',
              code: `import numpy as np
from scipy.stats import loguniform
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import (StratifiedKFold, RandomizedSearchCV,
                                     cross_val_score)

pipe = Pipeline([
    ("scale", StandardScaler()),                    # re-fit inside every fold
    ("clf", LogisticRegression(max_iter=2000)),
])

param_dist = {"clf__C": loguniform(1e-3, 1e2)}      # sample on a log scale

inner = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
search = RandomizedSearchCV(pipe, param_dist, n_iter=40, cv=inner,
                            scoring="average_precision", n_jobs=-1, random_state=0)

# nested CV: the OUTER loop estimates how good "tune + fit" is as a procedure
outer = StratifiedKFold(n_splits=5, shuffle=True, random_state=1)
scores = cross_val_score(search, X_train, y_train, cv=outer, scoring="average_precision")
print(f"nested CV PR-AUC: {scores.mean():.3f} +/- {scores.std():.3f}")

search.fit(X_train, y_train)           # final tuning on all training data
print(search.best_params_)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'Bayesian-style search with Optuna and early pruning',
              code: `import optuna
import lightgbm as lgb
from sklearn.model_selection import StratifiedKFold, cross_val_score

def objective(trial):
    params = {
        "n_estimators": 2000,
        "learning_rate": trial.suggest_float("learning_rate", 1e-3, 0.2, log=True),
        "num_leaves": trial.suggest_int("num_leaves", 8, 256, log=True),
        "min_child_samples": trial.suggest_int("min_child_samples", 5, 200, log=True),
        "subsample": trial.suggest_float("subsample", 0.5, 1.0),
        "subsample_freq": 1,
        "colsample_bytree": trial.suggest_float("colsample_bytree", 0.4, 1.0),
        "reg_lambda": trial.suggest_float("reg_lambda", 1e-3, 10, log=True),
        "verbose": -1,
    }
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
    return cross_val_score(lgb.LGBMClassifier(**params), X_train, y_train,
                           cv=cv, scoring="roc_auc").mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=100)
print(study.best_params, study.best_value)`,
            },
            {
              type: 'list',
              items: [
                '**Search on the right scale**: learning rates and regularization strengths span orders of magnitude, so sample them log-uniformly; sampling `C` uniformly in [0.001, 100] wastes almost every trial above 1.',
                '**Prefer random to grid**: with 9 grid points over 2 hyperparameters you only try 3 distinct values of each; 9 random points try 9 distinct values of each, which matters when one of them dominates (Bergstra and Bengio, 2012).',
                '**Budget-aware methods** such as successive halving / Hyperband (`HalvingRandomSearchCV`, Optuna pruners) kill bad configurations early, after a few epochs or a fraction of the data, and spend compute on promising ones.',
                '**Pick the simplest model within noise**: if several configurations are within one standard error of the best mean score, prefer the most regularized one (the "one-standard-error rule"); it usually generalizes and maintains better.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Reporting `search.best_score_` as "the model accuracy" is a classic optimistic bias: it is the maximum over many noisy estimates computed on the same folds. The more configurations you try, the larger the bias. Quote a nested-CV estimate or the score on a test set that played no part in the search.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Plain k-fold on time-ordered data trains on the future and validates on the past. Use forward-chaining splits (`TimeSeriesSplit`), and add a `gap` between training and validation when features use trailing windows or labels take time to mature (e.g. a chargeback known 60 days later), otherwise information still bleeds across the boundary.',
            },
          ],
        },
        {
          id: 'data-leakage',
          title: 'Data Leakage: Why Models Look Great Offline and Fail in Production',
          summary:
            'Leakage is any path by which information that will not be available at prediction time reaches the model during training or evaluation — it is the most common reason for spectacular offline metrics that collapse after deployment.',
          keyPoints: [
            '**Target leakage**: a feature is a consequence or proxy of the label (e.g. "account_closed_date" in a churn model, "treatment_given" in a diagnosis model) — it is perfectly predictive offline and absent or meaningless at prediction time.',
            '**Train-test contamination**: statistics from evaluation data leak into training through preprocessing fitted on the full dataset, resampling before splitting, de-duplication not done, or the same entity appearing on both sides.',
            '**Temporal leakage**: features computed with data from after the prediction moment (a "30-day average" window that extends past the prediction timestamp, a customer attribute overwritten with its latest value).',
            '**Selection leakage**: using the test set for decisions (feature selection on all data, early stopping on the test set, repeated "one last look").',
            'The defence is **point-in-time correctness** plus **pipelines**: each training row must be built only from data that existed at its prediction timestamp, and every fitted transformation must be learned inside the training fold.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A useful mental test for every feature: **"At the exact moment the model is called in production, would this value exist, and would it have exactly this value?"** If the answer is "no" or "it would be computed differently", the feature leaks. Suspiciously high scores are themselves a signal — an AUC of 0.99 on a problem where domain experts struggle is far more often a bug than a breakthrough.',
            },
            {
              type: 'table',
              headers: ['Leak', 'Real-world example', 'How to detect', 'Fix'],
              rows: [
                ['Target proxy feature', '"num_collection_calls" in a loan-default model', 'One feature dominates importance; ablating it collapses the score', 'Drop it, or rebuild it as of the prediction time'],
                ['Preprocessing on all data', 'Scaler/imputer/PCA/feature selection fitted before splitting', 'Code review: any `fit` before the split', 'Put every step in a `Pipeline`'],
                ['Future data in features', 'Rolling average computed with a centered window', 'Score drops sharply on a strictly out-of-time test set', 'Point-in-time joins, as-of feature store queries'],
                ['Entity overlap', 'Same patient\'s X-rays in train and test', 'Check group IDs across splits', 'Group-aware splitting'],
                ['Duplicates', 'Same product description scraped twice', 'Hash or near-duplicate search across splits', 'De-duplicate before splitting'],
                ['Label definition drift', 'Label rewritten by a later process (e.g. fraud confirmed months later)', 'Label distribution differs by snapshot date', 'Freeze labels with an observation window'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a leakage-proof tabular pipeline with ColumnTransformer',
              code: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold

numeric = ["age", "income", "tenure_days"]
categorical = ["country", "plan", "device"]

preprocess = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median", add_indicator=True)),
        ("scale", StandardScaler()),
    ]), numeric),
    ("cat", OneHotEncoder(handle_unknown="infrequent_if_exist", min_frequency=20), categorical),
])

model = Pipeline([
    ("prep", preprocess),
    ("clf", HistGradientBoostingClassifier(max_iter=500, early_stopping=True)),
])

# every fold re-fits imputer, scaler and encoder on that fold's training part only
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)
print(cross_val_score(model, X_train, y_train, cv=cv, scoring="roc_auc").mean())`,
            },
            {
              type: 'code',
              language: 'sql',
              title: 'point-in-time feature join: only use events BEFORE the prediction moment',
              code: `-- one row per (customer, prediction_time); features may only look backwards
SELECT
  p.customer_id,
  p.prediction_time,
  COUNT(o.order_id)                       AS orders_last_90d,
  COALESCE(SUM(o.amount), 0)              AS spend_last_90d,
  p.label_churned_next_30d
FROM prediction_points p
LEFT JOIN orders o
  ON  o.customer_id = p.customer_id
  AND o.created_at <  p.prediction_time                      -- strictly before
  AND o.created_at >= p.prediction_time - INTERVAL '90 days'
GROUP BY p.customer_id, p.prediction_time, p.label_churned_next_30d;`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Run an **adversarial validation** check: label training rows 0 and test (or recent production) rows 1, train a classifier to tell them apart and inspect its AUC. Near 0.5 means the splits look alike; well above 0.5 means distribution shift or leakage, and the top features of that classifier tell you exactly where to look.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Leakage survives code review when preprocessing is done "once, up front" in a notebook for convenience. Any `fit`, `fit_transform`, `get_dummies` on the full frame, `dropna` based on label availability, or feature selection that looks at `y` before the split is a candidate leak. Make "the only thing that touches raw data is the Pipeline" a team rule.',
            },
          ],
        },
        {
          id: 'overfitting-underfitting',
          title: 'Overfitting vs Underfitting',
          summary:
            'Overfitting is a model that has learned the training set\'s noise as if it were signal; underfitting is a model too simple to learn the signal at all — the classic training-vs-test error curves against model complexity make both visible at a glance.',
          keyPoints: [
            'An **underfit** model has high error on both training and test data — it has not captured the underlying pattern, usually because it is too simple or was trained too little.',
            'An **overfit** model has very low training error but much higher test error — it has fit noise and idiosyncrasies specific to the training set rather than the general pattern.',
            'As model complexity increases, training error monotonically decreases (a more flexible model can always fit the training data better), while test error decreases and then eventually increases — the classic U-shaped curve.',
            'Fixes for underfitting: increase model complexity/capacity, add more/better features, train longer, reduce regularization.',
            'Fixes for overfitting: get more training data, simplify the model, add regularization, use early stopping, use dropout (for neural nets), or use ensembling.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    U["Underfitting<br/>model too simple<br/>HIGH train error, HIGH test error"] --> S["Sweet Spot<br/>balanced complexity<br/>LOW train error, LOW test error"] --> O["Overfitting<br/>model too complex<br/>VERY LOW train error, HIGH test error"]`,
            },
            {
              type: 'table',
              headers: ['Signal', 'Underfitting', 'Good fit', 'Overfitting'],
              rows: [
                ['Training error', 'High', 'Low', 'Very low (near zero)'],
                ['Test error', 'High (close to training error)', 'Low (close to training error)', 'High (much higher than training error)'],
                ['Gap between train and test error', 'Small', 'Small', 'Large'],
              ],
            },
            {
              type: 'p',
              text: 'A concrete picture: fitting a straight line to data generated by a curved relationship underfits — no straight line captures the curve, so both train and test error stay high. Fitting a degree-15 polynomial to 20 noisy points overfits — the curve wiggles through every single training point exactly, achieving near-zero training error, but those wiggles are noise-fitting, not signal, so it predicts wildly on new points.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Learning curves (error vs. training-set size, at fixed model complexity) diagnose a different question than the complexity curve above: if train and validation error are both high and close together even as more data is added, the model is underfitting and needs more capacity, not more data. If there is a persistent gap between train and validation error that narrows as data grows, more data is genuinely helping — that is high variance responding correctly to its remedy.',
            },
          ],
        },
        {
          id: 'linear-regression',
          title: 'Linear Regression: The Normal Equation vs Gradient Descent',
          summary:
            'Linear regression fits the line (or hyperplane) that minimizes squared error between predictions and true values — solvable exactly in one step via the normal equation for small data, or iteratively via gradient descent for data too large for that to be practical.',
          keyPoints: [
            'The model: `y_hat = w · x + b`, a weighted sum of the input features plus a bias term — the simplest possible parametric model, and the baseline every more complex model is judged against.',
            'The objective is **mean squared error (MSE)**: minimize the average of `(y_true - y_pred)^2` over the training set — squaring penalizes large errors disproportionately and makes the objective differentiable everywhere.',
            'The **normal equation**, `w = (X^T X)^-1 X^T y`, solves for the optimal weights in one closed-form step by setting the gradient of MSE to zero — exact, but requires inverting a (features × features) matrix, which is O(d³) and becomes impractical as the number of features grows large.',
            '**Gradient descent** instead iteratively nudges the weights in the direction that reduces the loss, using only the gradient at each step — scales to millions of features and to data that does not fit in memory, at the cost of needing to tune a learning rate and run multiple iterations.',
            'Linear regression assumes a linear relationship between features and target, and its coefficients are directly interpretable ("a one-unit increase in this feature is associated with a `w` change in the prediction, holding others fixed") — a major reason it stays in use even though more accurate models exist.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Init["Initialize weights (e.g. zeros)"] --> Pred["Compute predictions: y_hat = w.x + b"]
    Pred --> Loss["Compute loss: MSE(y, y_hat)"]
    Loss --> Grad["Compute gradient of loss w.r.t. weights"]
    Grad --> Update["Update: w = w - learning_rate * gradient"]
    Update --> Pred`,
            },
            {
              type: 'table',
              headers: ['', 'Normal Equation', 'Gradient Descent'],
              rows: [
                ['Type of solution', 'Exact, closed-form, one step', 'Approximate, iterative'],
                ['Complexity', 'O(d³) to invert a d x d matrix (d = number of features)', 'O(n·d) per iteration (n = number of examples)'],
                ['Scales to many features?', 'Poorly — matrix inversion is expensive past a few thousand features', 'Well — no matrix inversion required'],
                ['Scales to huge datasets?', 'Needs the full data in memory to form X^T X', 'Well — mini-batch/stochastic variants stream through data'],
                ['Hyperparameters to tune', 'None', 'Learning rate, number of iterations, batch size'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'both approaches, from first principles',
              code: `import numpy as np

def normal_equation(X, y):
    X_b = np.c_[np.ones((X.shape[0], 1)), X]   # add bias column
    # textbook form: np.linalg.inv(X_b.T @ X_b) @ X_b.T @ y
    # never invert explicitly in practice: X^T X squares the condition number and
    # fails outright when features are collinear. lstsq uses an SVD/QR solver instead.
    w, *_ = np.linalg.lstsq(X_b, y, rcond=None)
    return w

def gradient_descent(X, y, lr=0.01, n_iters=1000):
    n, d = X.shape
    X_b = np.c_[np.ones((n, 1)), X]
    w = np.zeros(d + 1)
    for _ in range(n_iters):
        y_pred = X_b @ w
        error = y_pred - y
        grad = (2 / n) * (X_b.T @ error)   # gradient of MSE w.r.t. w
        w -= lr * grad
    return w`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A learning rate that is too large causes gradient descent to overshoot the minimum and diverge (loss oscillates or explodes); too small makes convergence painfully slow. Feature scaling (standardizing inputs) matters a great deal here too — on unscaled features with very different ranges, the loss surface becomes a long narrow valley and gradient descent zig-zags inefficiently instead of heading straight for the minimum.',
            },
            {
              type: 'heading',
              text: 'Assumptions, and what breaks when they fail',
            },
            {
              type: 'p',
              text: 'For *prediction*, linear regression only needs the relationship to be roughly linear in the features you give it (you can add `x²`, logs, splines or interactions — the model stays linear in its *weights*). For *inference* — trusting coefficients, p-values and confidence intervals — the classical assumptions matter much more, and violating them is common in real data.',
            },
            {
              type: 'table',
              headers: ['Assumption', 'Symptom when violated', 'Consequence', 'Typical remedy'],
              rows: [
                ['Linearity (in parameters)', 'Curved pattern in residuals vs fitted plot', 'Biased predictions', 'Feature transforms, splines, or a non-linear model'],
                ['Independent errors', 'Autocorrelated residuals (time series, clustered data)', 'Standard errors too small, overconfident inference', 'Time-series models, clustered/robust standard errors'],
                ['Constant error variance (homoscedasticity)', 'Residual spread fans out with fitted value', 'Inefficient estimates, wrong intervals', 'Log-transform target, weighted least squares, robust SEs'],
                ['No perfect multicollinearity', 'Huge, unstable coefficients with flipping signs', '`X^T X` near-singular; coefficients uninterpretable', 'Drop/merge features, Ridge regression'],
                ['Normal errors (for small-sample inference only)', 'Heavy-tailed residual Q-Q plot', 'Unreliable p-values in small samples', 'Bootstrap intervals, robust loss (Huber)'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Coefficients describe association conditional on the other features, not causation. With correlated features, "a one-unit increase in X holding the others fixed" may describe a situation that never occurs in the data, and the coefficient can even change sign when another feature is added. Use causal-inference methods (experiments, instruments, matching) when the question is "what happens if we change X?".',
            },
          ],
        },
        {
          id: 'logistic-regression',
          title: 'Logistic Regression: Classification, Despite the Name',
          summary:
            'Logistic regression predicts the *probability* of a class by squashing a linear combination of features through the sigmoid function — it is a classification algorithm, and the "regression" refers to the fact that it fits a linear model of the *log-odds* `log(p / (1 - p))`, not the final class label.',
          keyPoints: [
            'The model computes a linear score `z = w · x + b` exactly like linear regression, then passes it through the **sigmoid function** `σ(z) = 1 / (1 + e^-z)` to squash it into a probability between 0 and 1.',
            'It is trained by minimizing **binary cross-entropy (log loss)**, not MSE — log loss penalizes confident-and-wrong predictions much more heavily than MSE would, which is the correct behavior for a probability output.',
            'The **decision boundary** is linear in the original feature space: `w · x + b = 0` separates the two predicted classes, which is why logistic regression struggles on data that is not linearly (or near-linearly) separable, same as linear regression struggles on non-linear relationships.',
            'For more than two classes, **softmax regression** (multinomial logistic regression) generalizes it — the softmax function turns a vector of scores into a probability distribution over all classes that sums to 1.',
            'Despite being one of the oldest and simplest classifiers, it remains a strong, fast, interpretable baseline — coefficients have a direct interpretation as log-odds, and it is the workhorse of use cases like credit scoring and medical risk models where interpretability is a hard requirement.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    X["Input features x"] --> Lin["Linear combination: z = w.x + b"]
    Lin --> Sig["Sigmoid squash: p = 1 / (1 + e^(-z))"]
    Sig --> Thresh["Threshold, typically at 0.5: p >= 0.5 -> class 1, else class 0"]`,
            },
            {
              type: 'p',
              text: 'Why cross-entropy instead of MSE? MSE, applied to a sigmoid output, produces a loss surface that is not convex in the weights and whose gradient vanishes when the model is confidently wrong (sigmoid saturates near 0 or 1, so its derivative there is nearly zero) — training stalls exactly when it should be correcting hardest. Cross-entropy\'s gradient with respect to `z` simplifies to exactly `(p - y)`, meaning the correction signal is directly proportional to how wrong the prediction is, with no vanishing-gradient trap — one of the cleanest derivations in classical ML.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'logistic regression with sklearn',
              code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    StandardScaler(),               # scaling helps the optimizer converge AND makes
                                    # the L2 penalty treat all features equally
    LogisticRegression(C=1.0, max_iter=1000),   # C = 1 / regularization strength;
                                                # L2-regularized by DEFAULT
)
model.fit(X_train, y_train)
probabilities = model.predict_proba(X_test)[:, 1]   # P(class = 1)
predictions = model.predict(X_test)                 # thresholded at 0.5 by default

# interpret: exp(coef) = multiplicative change in the ODDS per +1 std of the feature
coefs = model[-1].coef_.ravel()
odds_ratios = np.exp(coefs)`,
            },
            {
              type: 'heading',
              text: 'The math in four lines',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Model: `p = σ(z)` with `z = w · x + b`. Inverting the sigmoid gives `log(p / (1 - p)) = w · x + b`: the log-odds are linear in the features, so each coefficient is "change in log-odds per unit of that feature".',
                'Likelihood of one example: `p^y * (1 - p)^(1 - y)`. Maximizing the product over the data is the same as minimizing the negative log: `L = -[y log p + (1 - y) log(1 - p)]` — binary cross-entropy is *maximum likelihood* for a Bernoulli label.',
                'Using `dσ/dz = σ(1 - σ)`, the derivative collapses to `dL/dz = p - y`, so `dL/dw = (p - y) x`. The loss is convex in `w`, so gradient methods find the global optimum.',
                'If the classes are perfectly separable, the unregularized optimum is at infinity (weights grow forever to push probabilities to exactly 0 and 1). This is one reason libraries regularize by default.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'scikit-learn\'s `LogisticRegression` applies L2 regularization by default (`C=1.0`), which surprises people who expect a plain maximum-likelihood fit like statsmodels gives. In recent scikit-learn releases (1.8+), choosing the penalty type through the `penalty` argument is deprecated in favour of `l1_ratio` (0 for L2, 1 for L1, in between for elastic net) together with `C`; check the docs for the version you pin. For unpenalized inference with p-values, statsmodels remains the more natural tool.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The 0.5 threshold is a default, not a law — shift it based on the cost of false positives vs. false negatives. A fraud model might use a lower threshold (flag more aggressively, accept more false alarms) if missing real fraud is far costlier than an extra manual review.',
            },
          ],
        },
        {
          id: 'regularized-linear-models',
          title: 'Regularized Linear Models: Ridge, Lasso, and Elastic Net',
          summary:
            'Adding a penalty on coefficient size to least squares (or log loss) trades a little bias for a large drop in variance — Ridge shrinks everything smoothly, Lasso zeroes out features, and Elastic Net combines both for correlated, high-dimensional data.',
          keyPoints: [
            '**Ridge (L2)**: minimize `||y - Xw||² + α·||w||²`. Closed form `w = (X^T X + αI)^-1 X^T y` — adding `αI` makes the matrix invertible even with collinear or more-features-than-rows data.',
            '**Lasso (L1)**: minimize `(1/2n)·||y - Xw||² + α·||w||_1`. The corners of the L1 ball make exact zeros likely, so Lasso performs feature selection; no closed form, solved by coordinate descent.',
            '**Elastic Net**: mixes both (`l1_ratio`). With groups of correlated features, Lasso arbitrarily keeps one and drops the rest; Elastic Net tends to keep or drop them together and is more stable.',
            'Bayesian view: Ridge = maximum a posteriori estimate with a Gaussian prior on weights; Lasso = MAP with a Laplace prior. Regularization strength is the inverse of prior variance.',
            'Penalties are scale-dependent: **always standardize features** before regularized linear models, and never penalize the intercept. Choose `α` by cross-validation (`RidgeCV`, `LassoCV`, `ElasticNetCV`).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Why does shrinking weights help? An unregularized least-squares fit is unbiased, but when features are many or correlated its coefficients have enormous variance — tiny changes in the data swing them wildly, and some combinations of large positive and large negative weights cancel on the training set but blow up on new data. Penalizing `||w||` pulls the solution toward zero. In the eigenbasis of `X^T X`, Ridge scales each component of the least-squares solution by `λ_i / (λ_i + α)`: directions with large variance (large eigenvalue `λ_i`, well determined by the data) are barely touched, while directions with tiny variance (poorly determined, mostly noise) are shrunk hard. That is the bias-variance tradeoff made explicit and tunable by a single knob.',
            },
            {
              type: 'table',
              headers: ['', 'Ridge (L2)', 'Lasso (L1)', 'Elastic Net'],
              rows: [
                ['Penalty', 'α·sum(w²)', 'α·sum(|w|)', 'α·[r·sum(|w|) + (1-r)/2·sum(w²)]'],
                ['Exact zeros?', 'No — shrinks toward zero', 'Yes — sparse solutions', 'Yes, fewer and more stable'],
                ['Correlated features', 'Spreads weight across the group', 'Picks one somewhat arbitrarily', 'Keeps/drops the group together'],
                ['p > n (more features than rows)', 'Works fine', 'Selects at most n features', 'Works, can select more than n'],
                ['Solver', 'Closed form / Cholesky / SVD', 'Coordinate descent', 'Coordinate descent'],
                ['Use when', 'Many small effects, prediction focus', 'Believe few features matter, want interpretability', 'High-dimensional, correlated features (genomics, text)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'choosing alpha by cross-validation and reading the sparsity',
              code: `import numpy as np
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import RidgeCV, LassoCV, ElasticNetCV

alphas = np.logspace(-4, 3, 50)

ridge = make_pipeline(StandardScaler(), RidgeCV(alphas=alphas)).fit(X_train, y_train)
lasso = make_pipeline(StandardScaler(), LassoCV(alphas=alphas, cv=5, max_iter=20_000)).fit(X_train, y_train)
enet = make_pipeline(StandardScaler(),
                     ElasticNetCV(l1_ratio=[0.1, 0.5, 0.9, 0.99], cv=5, max_iter=20_000)
                     ).fit(X_train, y_train)

print("ridge alpha:", ridge[-1].alpha_)
print("lasso alpha:", lasso[-1].alpha_,
      "non-zero coefs:", np.sum(lasso[-1].coef_ != 0), "of", X_train.shape[1])
print("enet l1_ratio:", enet[-1].l1_ratio_)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Lasso-selected features are not a reliable list of "the true causes". With correlated predictors the selected set changes from one bootstrap sample to the next. If you need a stable selection, look at selection frequency across bootstrap resamples (stability selection) or use Elastic Net, and never run the selection on the full dataset before cross-validating the downstream model.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Naming varies across libraries and it bites people: scikit-learn regressors use `alpha` (bigger = stronger penalty), while `LogisticRegression` and `SVC` use `C` (bigger = *weaker* penalty, roughly `1/alpha`). XGBoost/LightGBM call their L2/L1 terms `reg_lambda`/`reg_alpha`.',
            },
          ],
        },
        {
          id: 'decision-trees',
          title: 'Decision Trees: Splitting Criteria and a Worked Example',
          summary:
            'A decision tree recursively splits the data on the feature and threshold that best separates the classes, using an impurity measure like Gini or entropy — producing a fully interpretable, human-readable set of if/else rules.',
          keyPoints: [
            'At each node, the tree evaluates every possible feature/threshold split and picks the one that most reduces **impurity** in the resulting child nodes.',
            '**Gini impurity**: `1 - sum(p_i^2)` over class probabilities `p_i` in a node — measures how often a randomly chosen element would be misclassified if labeled randomly according to the node\'s class distribution; 0 means perfectly pure.',
            '**Entropy**: `-sum(p_i * log2(p_i))` — an information-theoretic impurity measure; **information gain** is the reduction in entropy from splitting. Gini and entropy usually pick similar splits in practice; Gini is slightly cheaper to compute (no logarithm).',
            'Trees can grow until every leaf is pure, which massively overfits — in practice, they are constrained with `max_depth`, `min_samples_split`, `min_samples_leaf`, or grown fully and then **pruned** back.',
            'A single decision tree is highly interpretable (you can read off the exact if/else path to any prediction) but has high variance — small changes in the training data can produce a very different tree structure, which is exactly the weakness that random forests and boosting address.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Root["All 10 samples<br/>6 Yes / 4 No"] -->|"Age < 30"| Left["7 samples<br/>5 Yes / 2 No"]
    Root -->|"Age >= 30"| Right["3 samples<br/>1 Yes / 2 No"]
    Left -->|"Income > 50k"| LL["4 samples: 4 Yes / 0 No (pure leaf)"]
    Left -->|"Income <= 50k"| LR["3 samples: 1 Yes / 2 No"]
    Right --> RLeaf["3 samples: 1 Yes / 2 No (leaf)"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'computing Gini impurity for a worked split',
              code: `def gini(labels):
    n = len(labels)
    if n == 0:
        return 0
    counts = {}
    for label in labels:
        counts[label] = counts.get(label, 0) + 1
    return 1 - sum((count / n) ** 2 for count in counts.values())

# Root node: 6 Yes, 4 No
root = ['Yes'] * 6 + ['No'] * 4
print(gini(root))  # 1 - (0.6^2 + 0.4^2) = 1 - 0.52 = 0.48

# After splitting on Age < 30: left has 5 Yes/2 No, right has 1 Yes/2 No
left = ['Yes'] * 5 + ['No'] * 2
right = ['Yes'] * 1 + ['No'] * 2
weighted_gini = (7 / 10) * gini(left) + (3 / 10) * gini(right)
# gini(left) = 20/49 ~= 0.408, gini(right) = 4/9 ~= 0.444
# weighted ~= 0.7 * 0.408 + 0.3 * 0.444 ~= 0.419
gain = gini(root) - weighted_gini   # ~= 0.061; the tree picks the split maximizing this gain`,
            },
            {
              type: 'list',
              items: [
                '**Regression trees** use the same greedy recipe with variance (squared error) as the impurity: each leaf predicts the mean of its training targets, and a split is chosen to maximize the reduction in within-node squared error. The result is a piecewise-constant function — trees cannot extrapolate beyond the range of targets seen in training.',
                '**Greedy, not optimal**: finding the globally optimal tree is NP-hard, so CART picks the best split at each node in isolation. A split that looks useless now (like the first split of XOR) may enable great splits later — one reason ensembles of trees outperform single trees.',
                '**Axis-aligned boundaries**: each split tests one feature, so a diagonal boundary like `x1 > x2` needs a staircase of many splits. Adding the engineered feature `x1 - x2` can replace dozens of nodes.',
                '**Cost-complexity pruning** (`ccp_alpha`): grow a large tree, then remove subtrees whose impurity reduction does not justify their leaf count, minimizing `impurity + α·(number of leaves)`. Choose `α` by cross-validation.',
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'pruning a tree with cost-complexity and cross-validation',
              code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import cross_val_score

path = DecisionTreeClassifier(random_state=0).cost_complexity_pruning_path(X_train, y_train)
alphas = path.ccp_alphas[:-1]            # last alpha prunes everything down to the root

scores = [cross_val_score(DecisionTreeClassifier(ccp_alpha=a, random_state=0),
                          X_train, y_train, cv=5).mean() for a in alphas]
best_alpha = alphas[int(np.argmax(scores))]

tree = DecisionTreeClassifier(ccp_alpha=best_alpha, random_state=0).fit(X_train, y_train)
print(tree.get_depth(), tree.get_n_leaves())
print(export_text(tree, feature_names=list(X_train.columns)))   # human-readable rules`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'An unconstrained tree grown to full depth achieves 0% training error on almost any dataset by carving out a leaf for every quirk, including individual noisy points — this is a textbook high-variance overfit, not evidence of a good model. Always constrain depth/leaf size or prune, and evaluate on a held-out set, not training accuracy.',
            },
          ],
        },
        {
          id: 'bagging-random-forests',
          title: 'Bagging and Random Forests',
          summary:
            'Bagging trains many models on different bootstrap-resampled versions of the training data and averages their predictions to reduce variance — random forests add random feature subsetting to further decorrelate the trees.',
          keyPoints: [
            '**Bootstrap aggregating (bagging)**: draw many random samples *with replacement* from the training set (each the same size as the original), train one model per sample, and average (regression) or majority-vote (classification) their predictions.',
            'Averaging many high-variance, low-bias models (like unpruned decision trees) cancels out their individual noise while keeping their low bias — this is precisely why bagging targets **variance reduction**, not bias reduction.',
            'A **random forest** is bagged decision trees with one extra twist: at each split, only a random subset of features is considered (not all of them) — this decorrelates the trees further, since without it, a few dominant features would cause most trees to make very similar splits near the root.',
            'Each tree is trained on ~63% of the unique training examples on average (a property of sampling with replacement); the roughly 37% left out per tree — the **out-of-bag (OOB)** samples — can be used as a free, built-in validation set without needing a separate holdout.',
            'Random forests are a strong, low-effort default for tabular data: robust to feature scaling, handle non-linear relationships and interactions automatically, and are far less prone to overfitting than a single deep tree — at the cost of interpretability (no single readable rule set) and larger model size/slower inference than one tree.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Data["Original training data"] --> B1["Bootstrap sample 1"]
    Data --> B2["Bootstrap sample 2"]
    Data --> B3["Bootstrap sample 3"]
    B1 --> T1["Tree 1 (random feature subset per split)"]
    B2 --> T2["Tree 2 (random feature subset per split)"]
    B3 --> T3["Tree 3 (random feature subset per split)"]
    T1 --> Agg["Aggregate: majority vote or average"]
    T2 --> Agg
    T3 --> Agg
    Agg --> Final["Final prediction"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'random forest with sklearn',
              code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=300,       # number of trees
    max_features='sqrt',    # random feature subset size per split
    max_depth=None,         # let trees grow deep; bagging controls variance instead
    oob_score=True,         # free validation estimate from left-out samples
    n_jobs=-1,               # trees train independently -> trivially parallel
)
model.fit(X_train, y_train)
print(model.oob_score_)              # near-unbiased accuracy estimate, no held-out set needed
importances = model.feature_importances_   # average impurity reduction per feature, across trees`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Bagging is trivially parallelizable — every tree is trained completely independently of every other, unlike boosting (next topic), where each model depends on the errors of the ones before it and must be trained sequentially.',
            },
            {
              type: 'p',
              text: 'Why does decorrelation matter so much? The variance of an average of `B` identically distributed predictors, each with variance `σ²` and pairwise correlation `ρ`, is `ρσ² + (1 - ρ)σ²/B`. Adding more trees only kills the second term; the first term, `ρσ²`, is a floor that more trees can never get below. Bootstrap sampling alone leaves trees highly correlated (they all split on the same strong features first), so random forests attack `ρ` directly by restricting each split to a random subset of features (`max_features`). Smaller `max_features` lowers correlation but raises each tree\'s individual bias — another tunable bias-variance knob.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'impurity importance vs permutation importance',
              code: `from sklearn.inspection import permutation_importance

# impurity-based importance: computed on TRAINING data, biased toward
# high-cardinality / continuous features (more possible split points)
impurity_imp = model.feature_importances_

# permutation importance: shuffle one column on HELD-OUT data and measure the score drop
result = permutation_importance(model, X_val, y_val, n_repeats=10,
                                scoring="roc_auc", random_state=0, n_jobs=-1)
for idx in result.importances_mean.argsort()[::-1][:10]:
    print(X_val.columns[idx], round(result.importances_mean[idx], 4),
          "+/-", round(result.importances_std[idx], 4))`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Impurity-based `feature_importances_` can rank a random ID column or a high-cardinality noise feature as important, because it is measured on the data the trees memorized. Prefer permutation importance on a validation set — but remember that with strongly correlated features, permuting one barely hurts (its twin covers for it), so both features look unimportant even when the pair is critical. Drop or group correlated features before interpreting.',
            },
          ],
        },
        {
          id: 'gradient-boosting',
          title: 'Gradient Boosting: How Boosting Differs From Bagging',
          summary:
            'Boosting trains models sequentially, each one focused on correcting the errors (residuals) of the ensemble so far, rather than averaging independent models — trading bagging\'s parallelism and variance-reduction focus for boosting\'s sequential bias-reduction focus.',
          keyPoints: [
            'Bagging trains models **independently and in parallel** on resampled data, then averages — it reduces **variance**. Boosting trains models **sequentially**, each new model targeting the previous ensemble\'s mistakes — it reduces **bias** (and, done carefully, variance too).',
            'In gradient boosting specifically, each new tree is fit to the **negative gradient of the loss** with respect to the current ensemble\'s predictions — for squared-error regression this is literally the residuals (`y_true - y_pred_so_far`); for other losses it generalizes gradient descent into "function space."',
            'Each tree\'s contribution is scaled down by a **learning rate** (shrinkage) before being added to the ensemble — smaller steps combined with more trees generalize better than a few large, aggressive steps.',
            '**XGBoost, LightGBM, and CatBoost** are the dominant production implementations — they add regularization terms, second-order (Newton) gradient information, efficient handling of missing values and categoricals, and highly optimized histogram-based split-finding for speed at scale.',
            'Because each tree depends on the ensemble built before it, boosting is inherently **sequential** (harder to parallelize across trees, though split-finding within a tree is parallelized) and more prone to overfitting if run for too many rounds without early stopping or the learning rate is too high.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Y["True target y"] --> R0["Initial prediction (e.g. mean of y)"]
    R0 --> Res1["Residual 1 = y - prediction so far"]
    Res1 --> T1["Tree 1 fits Residual 1"]
    T1 --> Upd1["Prediction += learning_rate * Tree 1 output"]
    Upd1 --> Res2["Residual 2 = y - updated prediction"]
    Res2 --> T2["Tree 2 fits Residual 2"]
    T2 --> Upd2["Prediction += learning_rate * Tree 2 output"]
    Upd2 --> More["... repeat for N trees"]`,
            },
            {
              type: 'table',
              headers: ['', 'Bagging / Random Forest', 'Gradient Boosting'],
              rows: [
                ['Training', 'Parallel — trees are independent', 'Sequential — each tree depends on prior trees\' errors'],
                ['Primary effect', 'Reduces variance', 'Reduces bias (and can reduce variance with proper tuning)'],
                ['Base learner strength', 'Deep, low-bias, high-variance trees', 'Shallow, high-bias, low-variance "weak learners"'],
                ['Overfitting risk', 'Lower — more trees rarely hurts much', 'Higher — too many rounds/too high a learning rate overfits'],
                ['Sensitivity to outliers', 'Lower', 'Higher — boosting keeps trying to fit hard, noisy residuals'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'gradient boosting with XGBoost, with early stopping',
              code: `import xgboost as xgb

model = xgb.XGBClassifier(
    n_estimators=5000,           # upper bound; early stopping picks the real number
    learning_rate=0.05,
    max_depth=4,                 # shallow trees -- weak learners, by design
    min_child_weight=5,          # min hessian sum per leaf: blocks tiny, noisy leaves
    subsample=0.8,               # row subsampling per tree, adds regularization
    colsample_bytree=0.8,        # column subsampling per tree, adds regularization
    reg_lambda=1.0,              # L2 on leaf weights
    tree_method="hist",          # histogram split finding (the default in modern XGBoost)
    eval_metric="logloss",
    early_stopping_rounds=50,    # constructor argument in current XGBoost, not a fit() argument
    # device="cuda",             # train on GPU if available
)
model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],   # early stopping watches the LAST eval set
    verbose=False,
)
print(model.best_iteration)   # boosting stopped here -- prevents overfitting`,
            },
            {
              type: 'heading',
              text: 'What modern boosting libraries actually optimize',
            },
            {
              type: 'p',
              text: 'XGBoost-style boosting takes a second-order Taylor expansion of the loss around the current prediction. For each example you compute the gradient `g_i` and the hessian `h_i` of the loss with respect to the current prediction (for log loss, `g = p - y` and `h = p(1 - p)`). With L2 penalty `λ` on leaf values, the optimal value of a leaf containing examples `I` is `w* = -sum(g_i) / (sum(h_i) + λ)`, and the gain of a split is `1/2 · [G_L²/(H_L + λ) + G_R²/(H_R + λ) - (G_L + G_R)²/(H_L + H_R + λ)] - γ`, where `G` and `H` are summed gradients and hessians on each side and `γ` is a per-leaf complexity penalty. That formula is why `reg_lambda`, `gamma` (`min_split_loss`) and `min_child_weight` (a lower bound on `H` per leaf) are the core regularization knobs.',
            },
            {
              type: 'table',
              headers: ['', 'XGBoost', 'LightGBM', 'CatBoost', 'sklearn HistGradientBoosting'],
              rows: [
                ['Tree growth', 'Depth-wise (lossguide optional)', 'Leaf-wise (best-first): faster, overfits more on small data', 'Symmetric (oblivious) trees: very fast inference, strong regularization', 'Depth/leaf limited, leaf-wise style'],
                ['Categoricals', 'Native support (enable_categorical)', 'Native support (categorical_feature)', 'Best-in-class: ordered target statistics', 'Native support (categorical_features)'],
                ['Missing values', 'Learns a default direction per split', 'Learns a default direction', 'Handled natively', 'Learns which side NaNs go'],
                ['Main knobs', 'max_depth, eta, min_child_weight, subsample', 'num_leaves, min_child_samples, learning_rate', 'depth, learning_rate, l2_leaf_reg', 'max_leaf_nodes, learning_rate, l2_regularization'],
                ['Sweet spot', 'Mature, GPU, distributed, ubiquitous in production', 'Large data, speed', 'Many high-cardinality categoricals, little tuning', 'No extra dependency, solid defaults'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Tuning order that works**: fix a moderate learning rate (0.05-0.1) with early stopping; tune tree complexity (`max_depth`/`num_leaves`, `min_child_weight`/`min_child_samples`); then subsampling; then L1/L2; finally lower the learning rate and raise the tree cap for the last few tenths of a point.',
                '**Monotonic constraints** (`monotone_constraints`) force the prediction to only increase (or decrease) with a feature, e.g. risk must not fall as debt rises. They regularize, improve trust and are often required in credit models.',
                '**Custom objectives**: any twice-differentiable loss works if you can supply the gradient and hessian; quantile, Tweedie, Poisson, ranking (LambdaMART) and survival objectives ship built in.',
                '**Early stopping set**: early-stopping on the same set you report is a small leak; with plenty of data use a separate slice, or use the CV-averaged best iteration and refit on all training data.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For structured/tabular data, gradient-boosted trees (XGBoost/LightGBM/CatBoost) remain the strongest default in practice — they usually match or beat deep learning on medium-sized tabular problems, which lack the spatial/sequential structure (images, text) that gives neural networks their edge, and they need far less tuning and compute. Tabular deep learning and pretrained tabular foundation models (e.g. TabPFN-style in-context learners for small datasets) are an active research area and occasionally win, so benchmark them when the stakes justify it rather than assuming either way.',
            },
          ],
        },
        {
          id: 'support-vector-machines',
          title: 'Support Vector Machines and the Kernel Trick',
          summary:
            'An SVM finds the decision boundary that maximizes the margin — the distance to the nearest training points of each class — and the kernel trick lets it draw non-linear boundaries by implicitly operating in a higher-dimensional space, without ever computing the transformation explicitly.',
          keyPoints: [
            'Among all boundaries that separate two classes, the SVM picks the one with the **maximum margin** — the widest possible "street" between the classes, which tends to generalize better than a boundary that barely squeezes between the points.',
            '**Support vectors** are the training points closest to the boundary — they alone determine where the boundary sits; every other point could be moved (or removed) without changing the solution at all.',
            'A **soft margin** (controlled by the `C` hyperparameter) allows some points to violate the margin or even be misclassified, trading a wider, more generalizable margin against fewer training errors — essential for real, non-perfectly-separable data.',
            'The **kernel trick**: many non-linear problems become linearly separable in a higher-dimensional feature space; kernels (RBF, polynomial) compute the *dot product as if* that transformation had happened, without ever materializing the high-dimensional vectors — turning an intractable transformation into a cheap kernel-function evaluation.',
            'SVMs work well on high-dimensional data with a clear margin and moderate dataset size, but scale poorly to very large datasets (training is roughly O(n²) to O(n³)) — which is why gradient-boosted trees or neural networks are more common choices at large scale today.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Margin["Maximum-margin boundary"]
        direction TB
        SV1["support vector (class A)"] -.margin.-> Boundary["decision boundary"]
        Boundary -.margin.-> SV2["support vector (class B)"]
        Other["other points: farther from boundary, do not affect it"]
    end`,
            },
            {
              type: 'p',
              text: 'The kernel trick is the part that most needs precise phrasing in an interview: an RBF kernel effectively lets the SVM behave *as if* it mapped each point into an infinite-dimensional space where the classes become linearly separable — but the algorithm never actually computes coordinates in that space. It only ever needs the **pairwise similarity** (dot product) between points, and a kernel function computes that similarity directly and cheaply in the original space, exploiting the fact that SVM training and prediction only ever use dot products, never the raw high-dimensional vectors themselves.',
            },
            {
              type: 'table',
              headers: ['Kernel', 'Effect', 'When to use'],
              rows: [
                ['Linear', 'No transformation — the standard maximum-margin hyperplane', 'Data is already roughly linearly separable; also the best choice for very high-dimensional sparse data (e.g. text/TF-IDF)'],
                ['Polynomial', 'Captures interactions up to a chosen degree', 'When you have prior reason to expect polynomial-shaped interactions'],
                ['RBF (Gaussian)', 'Infinite-dimensional implicit mapping, similarity decays with distance', 'General-purpose default for non-linear boundaries when you don\'t know the right shape in advance'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'SVM with an RBF kernel',
              code: `from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    StandardScaler(),                      # SVMs are distance-based -- scaling is essential
    SVC(kernel='rbf', C=1.0, gamma='scale'),
)
model.fit(X_train, y_train)`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'SVMs are distance-based, so feature scaling is not optional — an unscaled feature with a much larger numeric range will dominate the distance calculation and effectively drown out every other feature, regardless of its actual predictive value.',
            },
          ],
        },
        {
          id: 'k-nearest-neighbors',
          title: 'k-Nearest Neighbors',
          summary:
            'k-NN makes no explicit training pass at all — it stores the training data and, at prediction time, looks up the k closest stored points and lets them vote (classification) or average (regression), making it the simplest possible "let the data speak for itself" algorithm.',
          keyPoints: [
            'k-NN is a **lazy / instance-based** learner: "training" is just storing the data; all the computation happens at prediction time, by finding the k nearest neighbors of the query point under some distance metric (usually Euclidean).',
            'For classification, the predicted class is the majority vote among the k neighbors; for regression, it is their average (optionally weighted by inverse distance, so closer neighbors count more).',
            'Choice of **k** controls the bias-variance tradeoff directly: small k (e.g., k=1) is low bias/high variance (very sensitive to individual noisy points, jagged decision boundary); large k is high bias/low variance (smoother boundary, can wash out real local structure).',
            'Prediction is expensive — a naive search is O(n) per query against the entire training set — which is why production systems use spatial index structures (KD-trees, ball trees, or approximate nearest neighbor methods like HNSW) to speed this up.',
            'Like SVMs, k-NN is fundamentally distance-based, so feature scaling is essential, and it suffers badly from the **curse of dimensionality**: in very high dimensions, distances between points become less meaningful (nearly everything ends up "far" from everything else), degrading k-NN\'s effectiveness.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Query["Query point ?"] -.-> N1["neighbor A (class red), distance 1.2"]
    Query -.-> N2["neighbor B (class red), distance 1.5"]
    Query -.-> N3["neighbor C (class blue), distance 1.8"]
    N1 --> Vote["k=3 vote: 2 red, 1 blue -> predict RED"]
    N2 --> Vote
    N3 --> Vote`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'k-NN classification',
              code: `from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    StandardScaler(),
    KNeighborsClassifier(n_neighbors=5, weights='distance'),
)
model.fit(X_train, y_train)   # essentially just stores X_train, y_train
predictions = model.predict(X_test)  # all the real work happens here`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'k-NN is a genuinely useful baseline and is still used in production for low-latency-tolerant, small-to-medium datasets and for recommendation-style "find similar items" lookups (often backed by an approximate nearest-neighbor index) — but rarely chosen as a from-scratch primary classifier at large scale, because of both the curse of dimensionality and per-query cost.',
            },
          ],
        },
        {
          id: 'k-means-clustering',
          title: 'k-Means Clustering',
          summary:
            'k-means partitions data into k clusters by alternating between assigning each point to its nearest centroid and recomputing centroids as the mean of their assigned points, repeating until the assignments stop changing.',
          keyPoints: [
            'The algorithm: (1) pick k initial centroids, (2) assign every point to its nearest centroid, (3) recompute each centroid as the mean of the points assigned to it, (4) repeat steps 2-3 until assignments stop changing (convergence).',
            'k-means minimizes **within-cluster sum of squares (WCSS / inertia)** — it always converges (the objective never increases), but only to a **local** optimum, which depends heavily on the initial centroid placement.',
            '**k-means++ initialization** spreads initial centroids apart deliberately (probabilistically favoring points far from already-chosen centroids) instead of picking them fully at random — this alone substantially improves both convergence speed and final cluster quality.',
            'k must be chosen in advance — common approaches are the **elbow method** (plot WCSS vs. k, look for where the marginal improvement drops off) and the **silhouette score** (how well-separated and internally cohesive the clusters are, for a given k).',
            'k-means assumes clusters are roughly spherical, similarly sized, and separable by (implicitly) Euclidean distance — it performs poorly on elongated, differently-sized, or non-convex clusters, where density-based methods (DBSCAN) or Gaussian mixture models are a better fit.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Init["1. Initialize k centroids (e.g. k-means++)"] --> Assign["2. Assign each point to its nearest centroid"]
    Assign --> Update["3. Recompute each centroid as the mean of its assigned points"]
    Update --> Check{"Did assignments change?"}
    Check -->|Yes| Assign
    Check -->|No| Done["Converged: final clusters"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'k-means with sklearn, plus choosing k via the elbow method',
              code: `from sklearn.cluster import KMeans
import numpy as np

inertias = []
k_range = range(1, 11)
for k in k_range:
    model = KMeans(n_clusters=k, init='k-means++', n_init=10, random_state=42)
    model.fit(X)
    inertias.append(model.inertia_)   # WCSS -- look for the "elbow" where this flattens out

best_model = KMeans(n_clusters=4, init='k-means++', n_init=10, random_state=42).fit(X)
labels = best_model.labels_
centroids = best_model.cluster_centers_`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'k-means always converges to *some* result — even on data with no real cluster structure at all, it will still confidently output k clusters. Convergence is not evidence of a meaningful clustering; always validate with a metric like silhouette score and, ideally, domain judgment about whether the resulting groups make sense.',
            },
          ],
        },
        {
          id: 'dimensionality-reduction-pca',
          title: 'Dimensionality Reduction: PCA, t-SNE, and UMAP',
          summary:
            'PCA finds the directions of maximum variance in the data and projects onto them, compressing many correlated features into fewer, uncorrelated components — while t-SNE and UMAP instead aim purely to preserve local neighborhood structure for human-readable 2D/3D visualization.',
          keyPoints: [
            '**PCA (Principal Component Analysis)** finds an orthogonal set of directions (principal components), ordered by how much of the data\'s variance they explain, and projects the data onto the top few — a linear technique.',
            'The first principal component is the direction along which the data varies the most; the second is the direction of next-most variance, constrained to be orthogonal to the first, and so on — each component is uncorrelated with all the others.',
            'PCA is used for **compression/speedup** (fewer features to feed a downstream model, faster training, less overfitting risk), **noise reduction** (low-variance directions are often mostly noise), and **visualization** (project to 2-3 dimensions).',
            '**t-SNE** and **UMAP** are non-linear techniques built specifically for **visualization** — they try to preserve local neighborhood structure (points close in high dimensions stay close in the 2D/3D projection) rather than global variance, so distances *between* distant clusters in a t-SNE/UMAP plot are not meaningful, only which points cluster near each other.',
            'PCA components are directly usable as input features to another model (they are just a linear transformation); t-SNE/UMAP outputs generally are not — they are for looking at, not for feeding into a downstream classifier, and re-running them can produce a differently oriented (though similarly structured) plot each time.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Original["Original 2D data (correlated features)"]
        direction TB
        Cloud["Elongated cloud of points"]
    end
    Cloud -->|"project onto PC1 (direction of max variance)"| PC1["1D projection along PC1 -- keeps most of the spread"]
    Cloud -.->|"PC2 (orthogonal, captures remaining variance)"| PC2["direction of least variance -- often discarded"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'PCA for compression, and choosing how many components to keep',
              code: `from sklearn.decomposition import PCA

pca = PCA(n_components=0.95)   # keep enough components to explain 95% of variance
X_reduced = pca.fit_transform(X_train_scaled)   # always scale features before PCA
print(pca.n_components_)                 # how many components that took
print(pca.explained_variance_ratio_)      # variance explained by each component`,
            },
            {
              type: 'table',
              headers: ['', 'PCA', 't-SNE / UMAP'],
              rows: [
                ['Linear or non-linear', 'Linear', 'Non-linear'],
                ['Preserves', 'Global variance structure', 'Local neighborhood structure'],
                ['Typical use', 'Compression, noise reduction, preprocessing for another model', 'Human visualization of clusters, exploratory analysis'],
                ['Output usable as model input?', 'Yes', 'Generally no — for viewing, not for feeding downstream'],
                ['Deterministic?', 'Yes', 'No (t-SNE/UMAP have randomness; re-runs vary)'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Always standardize features before PCA. Since PCA chases directions of maximum variance, a feature measured in larger raw units (e.g., income in dollars vs. age in years) would dominate the components purely due to scale, not because it is actually more informative.',
            },
          ],
        },
        {
          id: 'feature-scaling',
          title: 'Feature Scaling and Normalization',
          summary:
            'Feature scaling rescales numeric features onto comparable ranges — essential for distance-based and gradient-based algorithms, but irrelevant to tree-based models, which only ever compare a feature against a threshold within itself.',
          keyPoints: [
            '**Standardization (z-score)**: `(x - mean) / std` — centers data at 0 with unit variance; the standard default, robust to differing units, does not bound values to a fixed range.',
            '**Min-max normalization**: `(x - min) / (max - min)` — rescales to a fixed range (usually [0, 1]); sensitive to outliers, since a single extreme value stretches the whole range.',
            'Algorithms that **need** scaling: anything distance-based (k-NN, k-means, SVMs) or gradient-based (linear/logistic regression, neural networks) — unscaled features distort distances or slow/destabilize convergence.',
            'Algorithms that **do not need** scaling: tree-based models (decision trees, random forests, gradient boosting) — a split like "feature > threshold" is invariant to any monotonic rescaling of that feature.',
            'Scalers must be **fit only on the training set**, then applied (`.transform`, not `.fit_transform`) to validation/test data — fitting on the full dataset leaks test-set statistics into training, inflating apparent performance (see the train/val/test topic).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A concrete illustration of why this matters: suppose two features are "age" (range roughly 18-80) and "income" (range roughly 20,000-200,000). The raw Euclidean distance between two people who differ by 10 years in age and $5,000 in income is dominated almost entirely by the income term, simply because its numbers are thousands of times larger — not because income is thousands of times more predictive. After standardizing both features to zero mean and unit variance, a 10-year age gap and a $5,000 income gap can finally be compared on the same footing, each contributing to the distance in proportion to how unusual that gap actually is, not how large its raw units happen to be.',
            },
            {
              type: 'table',
              headers: ['Algorithm family', 'Needs scaling?', 'Why'],
              rows: [
                ['Linear/logistic regression', 'Yes', 'Gradient descent converges much faster and more stably on comparably-scaled features'],
                ['k-NN, k-means, SVM', 'Yes', 'Distance calculations are dominated by whichever feature has the largest numeric range'],
                ['Neural networks', 'Yes', 'Large-magnitude inputs cause unstable gradients and slow/unstable training'],
                ['Decision trees, random forests, gradient boosting', 'No', 'Splits compare a feature to a threshold within itself, unaffected by monotonic rescaling'],
                ['Naive Bayes', 'No (for typical implementations)', 'Based on per-feature probability distributions, not distances or gradients'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'fit scaling only on the training set',
              code: `from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # learns mean/std from TRAIN only
X_val_scaled = scaler.transform(X_val)            # applies those same stats
X_test_scaled = scaler.transform(X_test)          # applies those same stats -- never re-fit`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Calling `fit_transform` separately on train, validation, and test sets is a common, subtle bug — each call computes a *different* mean/std from that subset, so the same feature value ends up scaled differently depending on which split it happened to land in. Fit once, on the training data, and reuse that fitted scaler everywhere else.',
            },
          ],
        },
        {
          id: 'encoding-categorical-variables',
          title: 'Encoding Categorical Variables',
          summary:
            'Most ML algorithms only accept numbers, so categorical (non-numeric) features must be converted — the right encoding depends on whether the categories have a natural order, how many distinct values there are, and which model family will consume them.',
          keyPoints: [
            '**One-hot encoding**: creates one binary column per category (1 if present, 0 otherwise) — makes no assumption of order, but blows up dimensionality for high-cardinality features (a "zip code" column with 40,000 unique values becomes 40,000 columns).',
            '**Ordinal encoding**: maps each category to an integer (e.g., Low=0, Medium=1, High=2) — appropriate only when the categories have a genuine, meaningful order; applying it to an unordered category (e.g., colors) falsely implies a numeric relationship that does not exist.',
            '**Target encoding (mean encoding)**: replaces each category with the mean of the target variable for that category — compact and powerful for high-cardinality features, but prone to leakage/overfitting unless done carefully (with cross-validation folds or additive smoothing so a category is never encoded using its own label).',
            'Tree-based models can often use ordinal-style integer codes for even unordered categories reasonably well (since a tree can carve out arbitrary threshold-based subsets across splits), while linear models and neural networks generally need one-hot or embeddings to avoid implying a false numeric relationship.',
            'For very high-cardinality categoricals in neural networks, a learned **embedding** (a small dense vector per category, trained jointly with the rest of the model) is the modern default — it captures similarity between categories in a way one-hot encoding cannot.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Encoding', 'Assumes order?', 'Dimensionality', 'Best for'],
              rows: [
                ['One-hot', 'No', 'One column per category', 'Low-cardinality, unordered categories, linear models'],
                ['Ordinal', 'Yes (must be genuinely ordered)', 'One column', 'Naturally ordered categories (education level, size: S/M/L)'],
                ['Target/mean encoding', 'No', 'One column', 'High-cardinality categoricals, tree-based models — with leakage-safe implementation'],
                ['Embeddings', 'No (learned similarity)', 'k dense dimensions (tunable)', 'Very high-cardinality categoricals in neural networks'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'one-hot vs ordinal, and leakage-safe target encoding',
              code: `import pandas as pd
from sklearn.preprocessing import OrdinalEncoder
from sklearn.model_selection import KFold

# one-hot: no implied order
one_hot = pd.get_dummies(df[['city']], columns=['city'])

# ordinal: only valid because these categories have a real order
size_order = [['S', 'M', 'L', 'XL']]
ordinal = OrdinalEncoder(categories=size_order).fit_transform(df[['size']])

# leakage-safe target encoding via out-of-fold means
def target_encode_oof(df, col, target, n_splits=5):
    encoded = pd.Series(index=df.index, dtype=float)
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    for train_idx, val_idx in kf.split(df):
        means = df.iloc[train_idx].groupby(col)[target].mean()
        encoded.iloc[val_idx] = df.iloc[val_idx][col].map(means)
    return encoded.fillna(df[target].mean())  # smooth unseen categories with the global mean`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'production-grade encoders: OneHotEncoder and TargetEncoder inside a pipeline',
              code: `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, TargetEncoder
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression

# pd.get_dummies is fine for exploration, but it is NOT a fitted transformer:
# a category unseen in training creates a new column (or drops one) at inference time.
encode = ColumnTransformer([
    ("low_card", OneHotEncoder(handle_unknown="ignore"), ["plan", "device"]),
    # TargetEncoder (scikit-learn 1.3+) shrinks each category mean toward the global
    # mean and uses internal cross-fitting in fit_transform, so training rows are
    # never encoded with their own label.
    ("high_card", TargetEncoder(target_type="binary"), ["merchant_id", "zip_code"]),
], remainder="passthrough")

model = make_pipeline(encode, LogisticRegression(max_iter=2000))
model.fit(X_train, y_train)`,
            },
            {
              type: 'p',
              text: 'Smoothing is what makes target encoding safe for rare categories. A common form is `enc(c) = (n_c · mean_c + m · global_mean) / (n_c + m)`: a category seen 3 times is pulled strongly toward the global mean, while one seen 30,000 times keeps essentially its own mean. Without it, a merchant seen once with a fraudulent transaction gets an encoding of 1.0 — pure memorization. Hashing (`FeatureHasher`) is another option for huge, open-ended vocabularies: fixed memory, no vocabulary to maintain, at the cost of occasional collisions and no inverse mapping.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Naive target encoding — computing each category\'s mean target value using the *entire* training set including the row being encoded — leaks the label into the feature itself, producing a feature that looks almost perfectly predictive during training and then fails badly on new data. Always compute target encodings out-of-fold (or with an equivalent leave-one-out scheme).',
            },
          ],
        },
        {
          id: 'missing-data-feature-selection',
          title: 'Handling Missing Data and Feature Selection',
          summary:
            'Missing data must be understood before it is fixed — why a value is missing determines whether dropping it, imputing it, or modeling its absence is safe — and feature selection prunes irrelevant or redundant features to fight overfitting and improve interpretability.',
          keyPoints: [
            '**MCAR (Missing Completely At Random)**: missingness is unrelated to any variable — safe to drop or simply impute, since there is no hidden pattern to distort.',
            '**MAR (Missing At Random)**: missingness depends on other *observed* variables (e.g., income is more often missing for younger respondents) — imputation conditioned on those other variables works well; naive dropping can bias the remaining data.',
            '**MNAR (Missing Not At Random)**: missingness depends on the *unobserved value itself* (e.g., people with very high income are less likely to report it) — the most dangerous case; imputation can be actively misleading, and sometimes "is this value missing?" is itself a useful feature.',
            '**Imputation strategies**: mean/median/mode for simple cases, model-based imputation (predict the missing value from other features, e.g. k-NN or regression imputation) for more structure, and always consider adding a binary "was_missing" indicator column alongside the imputed value.',
            '**Feature selection** (filter methods like correlation/mutual information, wrapper methods like recursive feature elimination, or embedded methods like L1 regularization\'s automatic zeroing-out) reduces overfitting risk, speeds up training/inference, and improves interpretability by discarding irrelevant or redundant features.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Missing["Missing values found"] --> Why{"Why are they missing?"}
    Why -->|"Unrelated to any variable (MCAR)"| Simple["Drop rows, or simple mean/median impute"]
    Why -->|"Depends on other observed features (MAR)"| Conditional["Impute conditioned on other features (model-based, k-NN, group-wise)"]
    Why -->|"Depends on the missing value itself (MNAR)"| Careful["Add a 'was_missing' indicator; be skeptical of naive imputation; consider domain-specific handling"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'imputation with a missingness indicator',
              code: `from sklearn.impute import SimpleImputer
import numpy as np

X = df[['age', 'income']].copy()
X['income_was_missing'] = X['income'].isna().astype(int)   # preserve the missingness signal

imputer = SimpleImputer(strategy='median')
X[['age', 'income']] = imputer.fit_transform(X[['age', 'income']])   # fit on TRAIN only

# equivalent, pipeline-friendly form: SimpleImputer(strategy='median', add_indicator=True)
# model-based: IterativeImputer (experimental API) or KNNImputer for MAR structure`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Gradient-boosted tree libraries (XGBoost, LightGBM, CatBoost, scikit-learn\'s `HistGradientBoosting*`) handle `NaN` natively by learning, at every split, which branch missing values should go to. Feeding them raw `NaN` is often better than imputing, because "missing" itself carries signal. Imputation is mainly needed for linear models, SVMs, k-NN and neural networks.',
            },
            {
              type: 'list',
              items: [
                '**Filter methods**: rank features by a statistic computed independently of any model (correlation with the target, chi-squared test, mutual information) — fast, model-agnostic, but ignores feature interactions.',
                '**Wrapper methods**: repeatedly train a model on different feature subsets and keep whichever subset scores best (e.g., recursive feature elimination) — accounts for interactions, but computationally expensive.',
                '**Embedded methods**: feature selection happens as a side effect of training itself — L1 (Lasso) regularization drives irrelevant coefficients to exactly zero; tree-based feature importances rank features by how much they reduced impurity.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Dropping rows with missing values is only safe under MCAR. Under MAR or MNAR, dropping systematically removes a non-random slice of the population (e.g., disproportionately removing younger or lower-income respondents), silently biasing every statistic and model trained on what remains.',
            },
          ],
        },
        {
          id: 'classification-metrics',
          title: 'Classification Metrics: Precision, Recall, F1, and ROC-AUC',
          summary:
            'Accuracy alone is misleading whenever classes are imbalanced or the costs of different error types differ — precision, recall, F1, and ROC-AUC each answer a different question about a classifier\'s errors, derived from the confusion matrix.',
          keyPoints: [
            'The **confusion matrix** breaks predictions into four buckets: true positives (TP), false positives (FP), true negatives (TN), false negatives (FN) — every other classification metric is computed from these four numbers.',
            '**Precision** = TP / (TP + FP): "of everything I predicted positive, how much was actually positive?" — high precision means few false alarms; optimize for it when false positives are costly (e.g., flagging a legitimate transaction as fraud and blocking a real customer).',
            '**Recall (sensitivity)** = TP / (TP + FN): "of everything actually positive, how much did I catch?" — high recall means few missed cases; optimize for it when false negatives are costly (e.g., missing an actual cancer diagnosis).',
            '**F1 score** = harmonic mean of precision and recall — a single number balancing both, useful when you need one metric but there is no domain reason to favor one over the other; the harmonic mean (vs. arithmetic mean) punishes a large imbalance between precision and recall more heavily.',
            '**ROC-AUC** measures how well the model ranks positives above negatives across *all* possible thresholds (area under the true-positive-rate vs. false-positive-rate curve) — threshold-independent, but can be overly optimistic on heavily imbalanced data, where **PR-AUC** (precision-recall curve) is often more informative.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Predicted Positive', 'Predicted Negative'],
              rows: [
                ['Actual Positive', 'True Positive (TP)', 'False Negative (FN)'],
                ['Actual Negative', 'False Positive (FP)', 'True Negative (TN)'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    CM["Confusion Matrix: TP, FP, TN, FN"] --> P["Precision = TP / (TP + FP)<br/>'of what I flagged, how much was right?'"]
    CM --> R["Recall = TP / (TP + FN)<br/>'of what was truly positive, how much did I catch?'"]
    P --> F1["F1 = 2 * P * R / (P + R)<br/>harmonic mean, balances both"]
    R --> F1`,
            },
            {
              type: 'p',
              text: 'A concrete precision/recall tradeoff: an email spam filter that optimizes purely for recall will catch nearly every spam email, but at the cost of also flagging a fair number of legitimate emails as spam (low precision) — annoying, and potentially costly if an important email is buried in the spam folder. A cancer-screening model that optimizes purely for precision will rarely raise a false alarm, but at the cost of missing some actual cancer cases (low recall) — which can be the more dangerous failure mode. Which one to prioritize is a business/domain decision the metric alone cannot make; it dictates where you set the classification threshold.',
            },
            {
              type: 'heading',
              text: 'A worked example with real numbers',
            },
            {
              type: 'p',
              text: 'Say a spam filter is tested on 100 emails, 20 of which are truly spam. It flags 20 emails as spam, and 18 of those 20 are correctly spam (2 flagged emails were actually legitimate — false positives), while it missed 2 real spam emails (they landed in the inbox — false negatives). That gives TP = 18, FP = 2, FN = 2, TN = 78. Precision = 18 / (18 + 2) = 0.90 (90% of what it flagged really was spam). Recall = 18 / (18 + 2) = 0.90 (it caught 90% of the real spam). F1 = 2 × (0.90 × 0.90) / (0.90 + 0.90) = 0.90. In this particular case precision and recall happen to be equal, but they move independently — a filter that flags everything as spam would push recall toward 1.0 while precision collapses toward 0.20 (the true spam rate), which is exactly the tradeoff the threshold controls.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'computing classification metrics',
              code: `from sklearn.metrics import classification_report, roc_auc_score, average_precision_score

print(classification_report(y_test, y_pred))   # precision, recall, F1 per class

y_probs = model.predict_proba(X_test)[:, 1]
print('ROC-AUC:', roc_auc_score(y_test, y_probs))
print('PR-AUC:', average_precision_score(y_test, y_probs))  # more informative under class imbalance`,
            },
            {
              type: 'heading',
              text: 'ROC-AUC vs PR-AUC, and multi-class averaging',
            },
            {
              type: 'p',
              text: 'ROC-AUC has a clean probabilistic meaning: it is the probability that a randomly chosen positive is scored higher than a randomly chosen negative. Its x-axis, the false-positive rate `FP / (FP + TN)`, divides by the (huge) number of negatives, so with 1 positive per 1,000 negatives a model can produce thousands of false alarms while FPR still looks tiny and ROC-AUC still looks excellent. Precision divides by what you flagged, so it exposes those false alarms directly. Rule of thumb: ROC-AUC for comparing rankers when classes are reasonably balanced or both error types matter symmetrically; PR-AUC (average precision) when positives are rare and the user acts on the flagged list. Note that the PR-AUC of a random model equals the positive rate, not 0.5, so always quote the baseline.',
            },
            {
              type: 'table',
              headers: ['Metric', 'What it summarizes', 'Use it when', 'Watch out'],
              rows: [
                ['Accuracy', 'Fraction correct at one threshold', 'Balanced classes, equal error costs', 'Useless under imbalance'],
                ['Precision / Recall / F1', 'Errors at one threshold', 'You know roughly where the threshold will be', 'F1 ignores true negatives and assumes equal weight on P and R; F-beta changes that'],
                ['ROC-AUC', 'Ranking quality across all thresholds', 'Ranking/screening, moderate imbalance', 'Optimistic with extreme imbalance; insensitive to calibration'],
                ['PR-AUC (average precision)', 'Precision-recall trade-off across thresholds', 'Rare positives (fraud, defects, retrieval)', 'Baseline equals prevalence; not comparable across datasets with different prevalence'],
                ['MCC', 'Correlation between prediction and truth using all four cells', 'A single balanced number at a fixed threshold', 'Less familiar to stakeholders'],
                ['Log loss / Brier score', 'Quality of predicted probabilities', 'Probabilities feed decisions (pricing, risk)', 'Punishes overconfidence; see the calibration topic'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Macro average**: compute the metric per class, then average equally — every class matters the same, so rare classes count fully.',
                '**Weighted average**: per-class metrics weighted by class support — dominated by frequent classes.',
                '**Micro average**: pool all TP/FP/FN across classes first — for single-label multi-class problems micro precision = micro recall = accuracy.',
                'Choose the averaging that matches the business question, and report the per-class table too — an aggregate can hide a class the model never gets right.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'On a dataset that is 99% negative, a model that always predicts "negative" achieves 99% accuracy while catching zero positives — accuracy is actively misleading here. This is the single most common reason classification metrics beyond accuracy get asked about in interviews.',
            },
          ],
        },
        {
          id: 'regression-metrics',
          title: 'Regression Metrics: MAE, MSE, RMSE, and R²',
          summary:
            'Regression metrics differ mainly in how they weight large errors — MAE treats all errors proportionally, MSE/RMSE penalize large errors disproportionately, and R² reframes error as the fraction of variance explained relative to a naive baseline.',
          keyPoints: [
            '**MAE (Mean Absolute Error)** = average of `|y_true - y_pred|` — in the same units as the target, robust to outliers (a single huge error contributes linearly, not quadratically).',
            '**MSE (Mean Squared Error)** = average of `(y_true - y_pred)^2` — penalizes large errors disproportionately (squaring), which is desirable when large errors are especially costly, but also makes it sensitive to outliers.',
            '**RMSE** = square root of MSE — brings the units back to match the target (unlike raw MSE, whose units are squared), while keeping MSE\'s emphasis on large errors; the most commonly reported regression metric in practice.',
            '**R² (coefficient of determination)** = 1 - (sum of squared residuals / total sum of squares) — the fraction of the target\'s variance explained by the model, relative to a naive baseline that always predicts the mean; R² = 1 is a perfect fit, R² = 0 means "no better than predicting the mean," and R² can go negative for a model worse than that baseline.',
            'Choose MAE when outliers should not dominate the metric (e.g., typical delivery-time error); choose MSE/RMSE when large errors are disproportionately costly and should be penalized harder (e.g., a large error in a structural load estimate).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Metric', 'Formula', 'Sensitive to outliers?', 'Units'],
              rows: [
                ['MAE', 'mean(|y - y_hat|)', 'Less sensitive', 'Same as target'],
                ['MSE', 'mean((y - y_hat)^2)', 'Very sensitive', 'Target units squared'],
                ['RMSE', 'sqrt(MSE)', 'Very sensitive', 'Same as target'],
                ['R²', '1 - SS_res / SS_tot', 'Sensitive (built on squared error)', 'Unitless (0-1 typically, can be negative)'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'regression metrics',
              code: `from sklearn.metrics import (mean_absolute_error, mean_squared_error,
                             root_mean_squared_error, r2_score,
                             mean_absolute_percentage_error)
from sklearn.dummy import DummyRegressor

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
rmse = root_mean_squared_error(y_test, y_pred)   # scikit-learn 1.4+; replaces squared=False
r2 = r2_score(y_test, y_pred)
print(f'MAE={mae:.2f}  RMSE={rmse:.2f}  R2={r2:.3f}')

# always compare with a trivial baseline fitted on the training data
baseline = DummyRegressor(strategy="median").fit(X_train, y_train)
print('baseline MAE:', mean_absolute_error(y_test, baseline.predict(X_test)))`,
            },
            {
              type: 'heading',
              text: 'Which loss you train with decides what you predict',
            },
            {
              type: 'p',
              text: 'Minimizing squared error makes the model predict the **conditional mean** of `y`; minimizing absolute error makes it predict the **conditional median**; minimizing the pinball (quantile) loss at level `q` makes it predict the `q`-th quantile. This is not a reporting detail: for skewed targets such as order value or insurance claims, the mean and median can differ by a factor of several. Decide what the business needs (expected revenue is a mean; "a delivery promise we hit 90% of the time" is a 0.9 quantile), train with the matching loss, and evaluate with the matching metric.',
            },
            {
              type: 'table',
              headers: ['Metric', 'Good for', 'Pitfall'],
              rows: [
                ['MAPE', 'Communicating relative error to business users', 'Undefined at y = 0, explodes near zero, penalizes over-prediction more than under-prediction'],
                ['sMAPE / WAPE', 'Forecasting across items of different scale', 'WAPE (sum of absolute errors / sum of actuals) is more stable than MAPE'],
                ['RMSLE', 'Targets spanning orders of magnitude, relative errors matter', 'Requires y > -1; under-prediction penalized more than over-prediction'],
                ['Pinball / quantile loss', 'Prediction intervals, service-level targets', 'Need one model (or output) per quantile, and check coverage'],
                ['Adjusted R²', 'Comparing linear models with different feature counts', 'Still not a substitute for held-out error'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'RMSE will always be greater than or equal to MAE for the same set of errors, and the gap between them grows when errors are unevenly sized (a few very large errors mixed with many small ones) — comparing MAE and RMSE side by side is itself a quick diagnostic for whether your model has a handful of badly-missed predictions.',
            },
          ],
        },
        {
          id: 'class-imbalance',
          title: 'Class Imbalance',
          summary:
            'When one class vastly outnumbers another, standard training and standard metrics both mislead — resampling, class weighting, and imbalance-aware metrics are the three main levers to fix it.',
          keyPoints: [
            'A model trained naively on imbalanced data (e.g., 1% fraud, 99% legitimate) is implicitly optimizing for the majority class, since misclassifying it contributes far more to the loss simply due to volume — it can reach high accuracy by nearly ignoring the minority class entirely.',
            '**Oversampling** the minority class (duplicating examples, or synthesizing new ones with **SMOTE**, which interpolates between existing minority points) and **undersampling** the majority class (dropping some majority examples) both rebalance the class ratio seen during training.',
            '**Class weighting** (`class_weight="balanced"` in most sklearn models) achieves a similar effect without literally changing the dataset — it scales up the loss contribution of minority-class errors during training.',
            'Always apply resampling **only to the training set**, never to validation/test — the evaluation data must reflect the real-world class distribution the model will actually face in production, or the reported metrics will not be trustworthy.',
            'Accuracy is close to useless under strong imbalance (see the classification-metrics topic); prefer precision/recall/F1, PR-AUC, or a cost-weighted metric that reflects the actual business cost of each error type.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Imbalanced["Imbalanced training data: 99% majority, 1% minority"] --> Over["Oversample minority (duplicate, or SMOTE synthesize)"]
    Imbalanced --> Under["Undersample majority (drop some majority examples)"]
    Imbalanced --> Weight["Class weighting: increase minority error's contribution to the loss"]
    Over --> Balanced["Rebalanced TRAINING data / loss"]
    Under --> Balanced
    Weight --> Balanced
    Balanced --> Eval["Evaluate on the ORIGINAL, untouched, realistic test distribution"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'class weighting and SMOTE',
              code: `from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE

# Option 1: class weighting -- no change to the data itself
model = LogisticRegression(class_weight='balanced')
model.fit(X_train, y_train)

# Option 2: SMOTE -- synthesize new minority-class examples, TRAIN SET ONLY
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
model.fit(X_train_resampled, y_train_resampled)
# X_test / y_test remain untouched -- reflects the real class distribution

# Inside cross-validation, use imblearn's Pipeline (sklearn's Pipeline cannot hold
# samplers): resampling then happens only on each fold's training part.
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

pipe = ImbPipeline([("scale", StandardScaler()),
                    ("smote", SMOTE(random_state=42)),
                    ("clf", LogisticRegression(max_iter=2000))])
print(cross_val_score(pipe, X_train, y_train, cv=5, scoring="average_precision").mean())`,
            },
            {
              type: 'heading',
              text: 'What resampling really changes',
            },
            {
              type: 'p',
              text: 'For a model that outputs probabilities, class weighting and resampling do not make the model "see the minority class better" in some deep sense — they mainly shift the decision boundary, which is mathematically close to just moving the threshold. The side effect is that predicted probabilities become **miscalibrated**: a model trained on a 50/50 resampled set predicts positives far more often than the true 1% base rate. With strong learners such as gradient boosting, the often-better recipe is: train on the natural distribution, optimize a ranking metric (PR-AUC), then **pick the threshold** from the cost of each error type, and calibrate if downstream consumers need real probabilities. Many careful benchmarks find SMOTE adds little on top of that for strong models; it tends to help most for weak learners and small datasets.',
            },
            {
              type: 'table',
              headers: ['Lever', 'Changes the data?', 'Effect on probabilities', 'Best when'],
              rows: [
                ['Threshold tuning', 'No', 'None (probabilities untouched)', 'Default first move with any probabilistic model'],
                ['Class weights', 'No', 'Inflates minority probabilities', 'Linear models, neural nets, quick fix'],
                ['Random undersampling', 'Yes (drops majority rows)', 'Inflates minority probabilities; correctable analytically', 'Huge datasets where training cost matters'],
                ['SMOTE / variants', 'Yes (synthetic minority rows)', 'Inflates minority probabilities', 'Weak learners, small data; risky with high-dimensional or categorical features'],
                ['Focal loss', 'No', 'Down-weights easy examples', 'Deep learning detection/segmentation with extreme imbalance'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Applying SMOTE (or any resampling) before splitting into train/test — or worse, before cross-validation folds are created — leaks synthetic points derived from test-set neighbors into training, and can even place near-duplicate synthetic/original pairs on opposite sides of the split. Always split first, then resample only the training fold.',
            },
          ],
        },
        {
          id: 'probability-calibration-thresholds',
          title: 'Probability Calibration and Decision Thresholds',
          summary:
            'A model can rank examples well and still output probabilities that are badly wrong — calibration makes "0.8" really mean 80%, and threshold selection turns those probabilities into decisions that minimize real business cost.',
          keyPoints: [
            'A classifier is **calibrated** if, among all examples it scores at 0.7, about 70% are actually positive. Ranking metrics like ROC-AUC are blind to calibration: any monotonic distortion of the scores leaves AUC unchanged.',
            'Common sources of miscalibration: resampling/class weights, boosting (pushes scores toward the extremes), naive Bayes (overconfident), max-margin models like SVMs (no probabilities at all), and modern deep networks (often overconfident).',
            'Measure with a **reliability diagram** plus **Brier score** or **log loss**; expected calibration error (ECE) is a popular summary but depends on binning choices.',
            'Fix with a post-hoc mapping fitted on held-out data: **Platt scaling** (sigmoid, few parameters, good for small data), **isotonic regression** (non-parametric, needs more data), or **temperature scaling** for neural networks.',
            'The optimal threshold depends on costs, not on 0.5: with calibrated `p`, flag when `p · cost_FN > (1 - p) · cost_FP`, i.e. `p > cost_FP / (cost_FP + cost_FN)`.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Calibration matters whenever the probability itself is used, not just the ordering: expected-loss pricing (`p(default) × exposure`), ranking ads by `p(click) × bid`, combining several models, triggering an alert when risk exceeds 30%, or reporting a risk to a clinician. If the scores feed only a top-k list, calibration is irrelevant and you can skip it.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'diagnose and fix calibration, then pick a cost-based threshold',
              code: `import numpy as np
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import brier_score_loss, log_loss
from sklearn.ensemble import HistGradientBoostingClassifier

base = HistGradientBoostingClassifier(max_iter=300)

# cross-fitted calibration: each calibrator is fitted on data its model did not train on
calibrated = CalibratedClassifierCV(base, method="isotonic", cv=5).fit(X_train, y_train)

p = calibrated.predict_proba(X_test)[:, 1]
print("Brier:", brier_score_loss(y_test, p), "log loss:", log_loss(y_test, p))

frac_pos, mean_pred = calibration_curve(y_test, p, n_bins=10, strategy="quantile")
# plot mean_pred (x) against frac_pos (y): a perfectly calibrated model lies on y = x

# cost-based threshold: missing a fraud costs 200, a false alarm (manual review) costs 5
cost_fp, cost_fn = 5, 200
threshold = cost_fp / (cost_fp + cost_fn)      # ~= 0.024 -- nowhere near 0.5
decisions = p >= threshold`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'let cross-validation choose the threshold (scikit-learn 1.5+)',
              code: `from sklearn.model_selection import TunedThresholdClassifierCV
from sklearn.metrics import make_scorer, fbeta_score

# optimize the threshold for F2 (recall weighted twice as much as precision)
tuned = TunedThresholdClassifierCV(
    base, scoring=make_scorer(fbeta_score, beta=2), cv=5
).fit(X_train, y_train)
print("chosen threshold:", tuned.best_threshold_)
y_pred = tuned.predict(X_test)`,
            },
            {
              type: 'table',
              headers: ['Method', 'How it works', 'Data needed', 'Notes'],
              rows: [
                ['Platt / sigmoid', 'Fit logistic regression on the model\'s scores', 'Small (hundreds of points)', 'Assumes a sigmoid-shaped distortion'],
                ['Isotonic regression', 'Fit a monotonic step function', 'Larger (thousands+)', 'Flexible, can overfit small calibration sets'],
                ['Temperature scaling', 'Divide logits by one learned scalar T before softmax', 'Small', 'Standard for neural nets; does not change argmax predictions'],
                ['Prior shift correction', 'Re-weight odds by (true prior / training prior)', 'Only the class ratios', 'Undo the effect of resampling analytically'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Fitting the calibrator on the same data the model was trained on learns nothing — the model is already overconfident on its own training rows. Use a separate calibration split or cross-fitting (`CalibratedClassifierCV` with `cv`), and re-check calibration in production: drift in the base rate (e.g. fraud doubling during a holiday season) silently miscalibrates even a perfectly calibrated model.',
            },
          ],
        },
        {
          id: 'time-series-forecasting-ml',
          title: 'Time Series and Forecasting with ML',
          summary:
            'Time-ordered data breaks the i.i.d. assumption behind most of classical ML — forecasting needs lag features built without peeking ahead, forward-chaining validation, strong naive baselines, and an explicit plan for horizon, seasonality and uncertainty.',
          keyPoints: [
            'Frame the problem precisely: **forecast horizon** (1 day? 13 weeks?), **granularity**, **what is known in advance** (calendar, promotions, prices) versus only historically (sales, weather actuals).',
            'Tree models and linear models become forecasters through **feature engineering**: lags (`y_{t-7}`), rolling statistics computed only on past values, calendar features, and known future covariates.',
            '**Always beat a naive baseline**: last value, seasonal naive (same day last week/year), or a moving average. Many "ML forecasts" lose to seasonal naive once evaluated honestly.',
            'Validate with **rolling-origin (backtest) evaluation** over several cut-off dates, never random k-fold; the gap between cut-off and target must equal the real deployment horizon.',
            'Multi-step strategies: **recursive** (feed predictions back as lags — errors compound), **direct** (one model per horizon), or multi-output models. Global models trained across many related series usually beat one model per series.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph B1["Backtest 1"]
        T1["Train: Jan-Jun"] --> V1["Validate: Jul"]
    end
    subgraph B2["Backtest 2"]
        T2["Train: Jan-Jul"] --> V2["Validate: Aug"]
    end
    subgraph B3["Backtest 3"]
        T3["Train: Jan-Aug"] --> V3["Validate: Sep"]
    end
    V1 --> Avg["Average error across cut-offs"]
    V2 --> Avg
    V3 --> Avg`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'leak-free lag features for a global gradient-boosting forecaster',
              code: `import pandas as pd

df = df.sort_values(["store_id", "date"])
g = df.groupby("store_id")["sales"]

HORIZON = 7   # we forecast 7 days ahead, so the newest usable value is sales at t-7
for lag in [HORIZON, HORIZON + 7, HORIZON + 21, 364]:
    df[f"lag_{lag}"] = g.shift(lag)

# rolling stats must be shifted FIRST so the window ends at t - HORIZON, not at t
df["roll_mean_28"] = g.transform(lambda s: s.shift(HORIZON).rolling(28).mean())
df["dow"] = df["date"].dt.dayofweek
df["is_promo"] = df["promo_planned"]        # known in advance -> legitimate future covariate

# time-based split: everything before the cut-off trains, the following weeks validate
cutoff = pd.Timestamp("2026-06-01")
train = df[df["date"] < cutoff]
valid = df[(df["date"] >= cutoff) & (df["date"] < cutoff + pd.Timedelta(days=28))]`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Strengths', 'Weaknesses'],
              rows: [
                ['Seasonal naive / ETS / ARIMA', 'Strong baselines, interpretable, work on short single series', 'One series at a time; awkward with many covariates'],
                ['Gradient boosting on lag features', 'Handles covariates, many series, non-linearity; usually the strongest practical choice', 'Cannot extrapolate trends beyond seen range; feature engineering is on you'],
                ['Deep sequence models (N-BEATS/TFT-style)', 'Learn across thousands of series, multi-horizon outputs', 'Data hungry, heavier to train and serve'],
                ['Pretrained time-series foundation models', 'Zero-shot forecasts with no training', 'Quality varies by domain; benchmark against seasonal naive and boosting before adopting'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Forecasts drive inventory and staffing decisions, which care about ranges, not points. Produce prediction intervals (quantile losses, conformal prediction on backtest residuals) and check their coverage in backtests: an "80% interval" that contains the truth only 55% of the time is a planning hazard.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Tree-based models predict within the range of targets they have seen. If sales are trending upward, a boosted model will flatten out at the historical maximum. Model the trend separately (e.g. predict differences, ratios to a rolling level, or detrended values) and let the trees model the residual structure.',
            },
          ],
        },
        {
          id: 'perceptron-and-why-networks',
          title: 'The Perceptron, and Why a Single One Cannot Solve XOR',
          summary:
            'A perceptron is the simplest possible neural unit — a weighted sum plus a step activation — and it can only learn linearly separable functions, which is exactly why XOR, a function no single straight line can separate, motivated the move to multi-layer networks.',
          keyPoints: [
            'A perceptron computes `z = w · x + b`, then applies a step (or sign) activation: output 1 if `z > 0`, else 0 — geometrically, it defines a single linear decision boundary, exactly like logistic regression\'s boundary but with a hard threshold instead of a smooth probability.',
            'The **perceptron learning rule** adjusts weights toward correctly classifying misclassified points, and is guaranteed to converge *if and only if* the data is linearly separable.',
            'XOR (output 1 if exactly one of two binary inputs is 1) is **not linearly separable** — no single straight line in the 2D input space can separate the (0,0)/(1,1) outputs-of-0 from the (0,1)/(1,0) outputs-of-1; this was the concrete example (from Minsky & Papert\'s 1969 critique) that stalled neural network research for over a decade.',
            'Stacking perceptrons into **layers** (a multi-layer perceptron, MLP) with a non-linear activation between layers solves this: each layer can carve out its own linear boundary, and composing several non-linear transformations lets the network represent boundaries of arbitrary shape — this is precisely why "multi-layer" and "non-linear activation" are both essential, not just one or the other.',
            'A network of only linear layers, no matter how many, still collapses mathematically into a single linear transformation (composing linear functions yields a linear function) — the non-linearity between layers is what actually grants a multi-layer network more representational power than a single perceptron.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Single["Single perceptron: ONE straight line"]
        L1["can separate AND, OR"]
        L2["CANNOT separate XOR -- no single line works"]
    end
    subgraph Multi["Multi-layer perceptron: composed non-linear boundaries"]
        M1["Hidden layer 1: learns intermediate features"]
        M2["Non-linear activation between layers"]
        M3["Output layer: combines them -- CAN separate XOR"]
        M1 --> M2 --> M3
    end`,
            },
            {
              type: 'table',
              headers: ['Input A', 'Input B', 'XOR output', 'Note'],
              rows: [
                ['0', '0', '0', 'Same class as (1,1)'],
                ['0', '1', '1', 'Same class as (1,0)'],
                ['1', '0', '1', ''],
                ['1', '1', '0', 'No single straight line separates {(0,0),(1,1)} from {(0,1),(1,0)}'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'a minimal 2-layer network that DOES solve XOR',
              code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# hand-picked weights illustrating the SHAPE of a solution (not learned here)
def xor_network(x1, x2):
    h1 = sigmoid(20 * x1 + 20 * x2 - 10)   # roughly an OR-like hidden unit
    h2 = sigmoid(20 * x1 + 20 * x2 - 30)   # roughly an AND-like hidden unit
    out = sigmoid(20 * h1 - 20 * h2 - 10)  # combines them: OR-and-not-AND = XOR
    return out

for a, b in [(0, 0), (0, 1), (1, 0), (1, 1)]:
    print(a, b, '->', round(xor_network(a, b)))`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This single limitation is the entire historical motivation for "deep" learning: depth (multiple non-linear layers) is what grants a network the ability to represent functions that no shallow, linear model ever could — everything from CNNs to Transformers builds on stacking non-linear layers for exactly this reason.',
            },
          ],
        },
        {
          id: 'backpropagation',
          title: 'Forward Propagation and Backpropagation',
          summary:
            'Forward propagation computes a network\'s output layer by layer; backpropagation computes how much each weight contributed to the final error by applying the chain rule backward through the same layers — the algorithm that makes training deep networks computationally tractable.',
          keyPoints: [
            '**Forward propagation**: input flows through the network layer by layer, each layer computing `z = W·a_prev + b` then `a = activation(z)`, until the final layer produces a prediction, which is compared to the true label via a loss function.',
            '**Backpropagation** computes the gradient of the loss with respect to *every* weight in the network by applying the **chain rule** repeatedly, propagating the error signal backward from the output layer to the input layer, one layer at a time.',
            'The key efficiency insight: each layer only needs the gradient flowing in *from the layer after it*, combined with its own local derivative — this lets backprop compute all gradients in a single backward pass, reusing shared computation, instead of recomputing each weight\'s gradient from scratch (which would be exponentially more expensive).',
            'Once every weight\'s gradient is known, an optimizer (plain gradient descent, or more commonly SGD/Adam — see the optimizers topic) uses those gradients to update the weights, nudging the network toward lower loss.',
            'Backprop is "just" repeated application of the chain rule from calculus — the reason it gets a special name and is treated as a landmark algorithm is that doing it *efficiently* (rather than naively, symbolically re-differentiating for each weight) is what made training networks with millions of parameters computationally feasible.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Forward["Forward pass"]
        X["Input x"] --> H1["Hidden layer: z1 = W1.x + b1, a1 = f(z1)"]
        H1 --> H2["Output layer: z2 = W2.a1 + b2, y_hat = f(z2)"]
        H2 --> Loss["Loss(y_hat, y_true)"]
    end
    subgraph Backward["Backward pass (chain rule)"]
        GLoss["dLoss/dy_hat"] --> G2["dLoss/dW2 = dLoss/dy_hat * dy_hat/dz2 * dz2/dW2"]
        G2 --> GA1["dLoss/da1, propagated backward through W2"]
        GA1 --> G1["dLoss/dW1 = dLoss/da1 * da1/dz1 * dz1/dW1"]
    end
    Loss -.->|"backprop starts here"| GLoss`,
            },
            {
              type: 'p',
              text: 'Concretely, for a weight `w` deep inside the network, the chain rule says its effect on the final loss is the product of: how much the loss changes with respect to the network\'s output, times how much that output changes with respect to the next layer\'s activation, times ... times how much the immediate next quantity changes with respect to `w` itself — a chain of local derivatives multiplied together. Backprop computes this efficiently by first computing the gradient at the output, then reusing it (multiplying by each layer\'s local derivative in turn) as it steps backward, rather than expanding and computing that full product independently for every single weight.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'backprop for a tiny 1-hidden-layer network, from first principles',
              code: `import numpy as np

def sigmoid(z): return 1 / (1 + np.exp(-z))
def sigmoid_deriv(a): return a * (1 - a)   # derivative in terms of the activation output

# forward pass
z1 = X @ W1 + b1
a1 = sigmoid(z1)
z2 = a1 @ W2 + b2
y_hat = sigmoid(z2)
loss = np.mean((y_hat - y_true) ** 2)

# backward pass -- chain rule, one layer at a time
d_loss_d_yhat = 2 * (y_hat - y_true) / y_true.shape[0]
d_yhat_d_z2 = sigmoid_deriv(y_hat)
d_z2 = d_loss_d_yhat * d_yhat_d_z2          # gradient at the output pre-activation

d_W2 = a1.T @ d_z2                            # gradient w.r.t. W2
d_a1 = d_z2 @ W2.T                            # propagate the gradient backward into layer 1
d_z1 = d_a1 * sigmoid_deriv(a1)
d_W1 = X.T @ d_z1                             # gradient w.r.t. W1

W2 -= learning_rate * d_W2
W1 -= learning_rate * d_W1`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In an interview, precisely stating **why** backprop is efficient (it reuses the backward-flowing gradient rather than recomputing each weight\'s full derivative chain independently — turning what would be exponential work into work linear in the number of layers) is what separates "I can name backpropagation" from "I understand backpropagation."',
            },
            {
              type: 'p',
              text: 'Modern frameworks never make you write the backward pass by hand. PyTorch records the operations of the forward pass in a computation graph and runs **reverse-mode automatic differentiation**: one backward pass yields the gradient of a scalar loss with respect to every parameter, at a cost of only a small constant multiple of the forward pass. The price is memory: every intermediate activation needed by the backward pass must be stored until it is used, which is why activation memory, not parameter memory, often limits batch size — and why techniques like gradient (activation) checkpointing trade recomputation for memory.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'the same network with autograd, and a numerical gradient check',
              code: `import torch

torch.manual_seed(0)
X = torch.randn(64, 10)
y = torch.randint(0, 2, (64, 1)).float()
W1 = torch.randn(10, 16, requires_grad=True)
W2 = torch.randn(16, 1, requires_grad=True)

def loss_fn():
    h = torch.relu(X @ W1)
    logits = h @ W2
    return torch.nn.functional.binary_cross_entropy_with_logits(logits, y)

loss = loss_fn()
loss.backward()                  # reverse-mode autodiff fills W1.grad and W2.grad

# finite-difference check on one weight: (L(w + eps) - L(w - eps)) / (2 * eps)
eps = 1e-3
with torch.no_grad():
    W1[0, 0] += eps; up = loss_fn()
    W1[0, 0] -= 2 * eps; down = loss_fn()
    W1[0, 0] += eps
print(W1.grad[0, 0].item(), ((up - down) / (2 * eps)).item())   # should agree closely`,
            },
          ],
        },
        {
          id: 'activation-functions',
          title: 'Activation Functions: Sigmoid, Tanh, ReLU, and Vanishing Gradients',
          summary:
            'Activation functions inject the non-linearity that gives deep networks their expressive power — the choice among sigmoid, tanh, and ReLU matters enormously in practice because of how each one behaves in the regions where its gradient shrinks toward zero.',
          keyPoints: [
            '**Sigmoid** squashes to (0, 1) — useful for output layers producing a probability, but saturates (flattens) for large positive or negative inputs, where its gradient approaches zero, causing the **vanishing gradient problem** in deep networks.',
            '**Tanh** squashes to (-1, 1), zero-centered (unlike sigmoid) — usually trains better than sigmoid in hidden layers for that reason, but still saturates at its extremes and suffers the same vanishing-gradient issue.',
            '**ReLU** (`max(0, z)`) does not saturate for positive inputs (constant gradient of 1), is cheap to compute, and empirically trains much faster/deeper than sigmoid or tanh — the default choice for hidden layers in most modern architectures.',
            'ReLU has its own failure mode, the **"dying ReLU" problem**: if a neuron\'s weights update such that its input is always negative, its gradient is permanently zero and it stops learning entirely. **Leaky ReLU** (a small non-zero slope for negative inputs) and its variants address this.',
            'Vanishing gradients compound across layers: in a deep network, backprop multiplies many layers\' local derivatives together, and if each is less than 1 (as sigmoid/tanh often are outside their linear region), the product shrinks toward zero exponentially with depth — early layers effectively stop receiving any learning signal.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Activation', 'Range', 'Zero-centered?', 'Saturates / vanishing gradient?', 'Typical use'],
              rows: [
                ['Sigmoid', '(0, 1)', 'No', 'Yes, badly, at both extremes', 'Binary classification output layer'],
                ['Tanh', '(-1, 1)', 'Yes', 'Yes, at both extremes', 'Occasionally in RNNs; rarely in modern deep hidden layers'],
                ['ReLU', '[0, infinity)', 'No', 'No for positive inputs; "dies" for negative', 'Default for hidden layers in most modern networks'],
                ['Leaky ReLU / ELU', '(-infinity, infinity) roughly', 'Closer to zero-centered', 'Mitigated', 'When dying ReLU is observed to be a real problem'],
                ['GELU', 'about (-0.17, infinity)', 'Roughly', 'No; smooth, small negative region', 'Default in BERT/GPT-style Transformers'],
                ['SiLU / Swish (x · sigmoid(x)), and SwiGLU gating', '(-0.28, infinity) for SiLU', 'Roughly', 'No; smooth', 'Modern LLM feed-forward blocks (SwiGLU), EfficientNet-style CNNs'],
                ['Softmax', '(0, 1), sums to 1', 'N/A', 'N/A (used only at output)', 'Multi-class classification output layer'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Deep["Deep network, many layers"] --> Chain["Backprop multiplies each layer's local gradient together"]
    Chain --> Sig["With sigmoid/tanh: each factor < 1 in saturated regions"]
    Sig --> Vanish["Product shrinks toward 0 exponentially with depth -- early layers barely update"]
    Chain --> Relu["With ReLU: gradient is exactly 1 for active units"]
    Relu --> Flow["Gradient flows through active units largely undiminished"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'activation functions and their derivatives',
              code: `import numpy as np

def sigmoid(z): return 1 / (1 + np.exp(-z))
def relu(z): return np.maximum(0, z)
def leaky_relu(z, alpha=0.01): return np.where(z > 0, z, alpha * z)

# derivatives, evaluated at the activation's INPUT z
def relu_deriv(z): return (z > 0).astype(float)          # exactly 1 or 0 -- no shrinkage
def sigmoid_deriv(z):
    s = sigmoid(z)
    return s * (1 - s)                                     # max value 0.25, at z=0 -- shrinks fast`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'ReLU\'s constant gradient of 1 (for positive inputs) is precisely why it enabled much deeper networks to train successfully than sigmoid/tanh ever could — it does not multiplicatively shrink the backpropagated gradient at every layer, so signal can reach far earlier layers largely intact.',
            },
          ],
        },
        {
          id: 'optimizers-gradient-descent',
          title: 'Gradient Descent Variants: Batch, SGD, Momentum, and Adam',
          summary:
            'All neural network training is some flavor of gradient descent — the differences between batch, mini-batch, and stochastic gradient descent are about how much data informs each update, while momentum and Adam add memory of past gradients to move through the loss landscape faster and more reliably.',
          keyPoints: [
            '**Batch gradient descent**: computes the gradient using the *entire* training set before each update — stable, accurate gradient direction, but extremely slow per update and often infeasible for large datasets.',
            '**Stochastic gradient descent (SGD)**: computes the gradient using just *one* example per update — very fast per step, but noisy, causing the loss to fluctuate rather than descend smoothly.',
            '**Mini-batch gradient descent**: computes the gradient over a small batch (typically 32-512 examples) — the practical default, balancing update speed against gradient-estimate stability, and the shape virtually all deep learning training actually uses.',
            '**Momentum** accumulates a running average of past gradients and moves in that direction, which accelerates progress in consistent directions and dampens oscillation across steep, narrow valleys in the loss landscape — like a ball rolling downhill that builds up speed instead of a rigid step-by-step walker.',
            '**Adam** (Adaptive Moment Estimation) combines momentum with a per-parameter adaptive learning rate (based on a running average of recent squared gradients) — converges quickly with relatively little tuning, making it the default optimizer for most deep learning today, though plain SGD with momentum can still generalize slightly better on some tasks with careful tuning.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Start["Starting point on the loss landscape"] --> Plain["Plain GD: straight steps, can zig-zag through narrow valleys"]
    Start --> Mom["Momentum: accumulates velocity, smooths out zig-zag, accelerates in consistent directions"]
    Start --> Adam["Adam: momentum + per-parameter adaptive step size, fast and low-maintenance convergence"]
    Plain --> Min["(local) minimum"]
    Mom --> Min
    Adam --> Min`,
            },
            {
              type: 'table',
              headers: ['Variant', 'Gradient computed over', 'Update noise', 'Typical use'],
              rows: [
                ['Batch GD', 'Entire dataset', 'Lowest', 'Small datasets, convex problems'],
                ['SGD (pure)', '1 example', 'Highest', 'Rarely used pure; theoretical baseline'],
                ['Mini-batch GD', 'Small batch (32-512)', 'Moderate — usually the sweet spot', 'Standard deep learning training'],
                ['SGD + Momentum', 'Mini-batch, with velocity term', 'Reduced oscillation', 'Vision models, when tuned carefully'],
                ['Adam', 'Mini-batch, with adaptive per-parameter rates', 'Reduced, fast convergence', 'Default choice for most deep learning tasks'],
              ],
            },
            {
              type: 'heading',
              text: 'One gradient descent step, by hand',
            },
            {
              type: 'p',
              text: 'Say a model has a single weight `w = 4.0`, and at that value the gradient of the loss with respect to `w` works out to `6.0` (the loss increases steeply as `w` increases, so the gradient points strongly in the positive direction). With a learning rate of `0.1`, plain gradient descent updates `w = w - learning_rate * gradient = 4.0 - 0.1 * 6.0 = 3.4`. The weight moved *against* the gradient, toward lower loss, by an amount proportional to both the learning rate and how steep the slope was at that point. Momentum changes only what gets multiplied by the learning rate: instead of using `6.0` directly, it blends in the previous step\'s velocity (say the running velocity was `2.0`, with `beta = 0.9`) into `velocity = 0.9 * 2.0 + 0.1 * 6.0 = 2.4`, then updates `w = 4.0 - 0.1 * 2.4 = 3.76` — a smaller, smoothed move than plain gradient descent would have taken on this one noisy gradient.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'SGD with momentum vs Adam update rules',
              code: `# SGD with momentum
velocity = beta * velocity + (1 - beta) * gradient   # exponential moving average of gradients
weights -= learning_rate * velocity

# (PyTorch's SGD uses the undamped form: velocity = momentum * velocity + gradient)

# Adam, step t = 1, 2, 3, ...
m = beta1 * m + (1 - beta1) * gradient                 # 1st moment: mean of gradients
v = beta2 * v + (1 - beta2) * (gradient ** 2)           # 2nd moment: mean of squared gradients
m_hat = m / (1 - beta1 ** t)                            # bias correction: m and v start at 0,
v_hat = v / (1 - beta2 ** t)                            # so early estimates are too small
weights -= learning_rate * m_hat / (np.sqrt(v_hat) + epsilon)

# AdamW: weight decay applied directly to the weights, NOT added to the gradient
weights -= learning_rate * weight_decay * weights`,
            },
            {
              type: 'heading',
              text: 'AdamW and learning-rate schedules: the modern default',
            },
            {
              type: 'p',
              text: 'Adding an L2 term to the loss and using Adam does **not** behave like weight decay: the L2 gradient gets divided by `sqrt(v_hat)` along with everything else, so parameters with large historical gradients are barely regularized. **AdamW** (Loshchilov and Hutter) decouples the two by shrinking weights directly at each step. In PyTorch, `torch.optim.Adam(..., weight_decay=...)` is the coupled L2 version and `torch.optim.AdamW` is the decoupled one; for Transformers and most modern networks, AdamW is the standard choice. Exclude biases and normalization parameters from weight decay.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'AdamW with linear warmup + cosine decay',
              code: `import math
import torch

decay, no_decay = [], []
for name, p in model.named_parameters():
    (no_decay if p.ndim < 2 else decay).append(p)    # biases and norm weights: no decay

optimizer = torch.optim.AdamW(
    [{"params": decay, "weight_decay": 0.05},
     {"params": no_decay, "weight_decay": 0.0}],
    lr=3e-4, betas=(0.9, 0.95),
)

warmup, total = 1_000, 50_000
def lr_lambda(step):
    if step < warmup:
        return (step + 1) / warmup                         # linear warmup
    progress = (step - warmup) / max(1, total - warmup)
    return 0.5 * (1 + math.cos(math.pi * progress))       # cosine decay to 0

scheduler = torch.optim.lr_scheduler.LambdaLR(optimizer, lr_lambda)
# per training step: loss.backward(); optimizer.step(); scheduler.step(); optimizer.zero_grad()`,
            },
            {
              type: 'list',
              items: [
                '**Warmup** prevents Adam\'s noisy early second-moment estimates (and large initial gradients) from producing huge, destabilizing updates in the first few hundred steps.',
                '**Decay** (cosine, linear, or step) lets training take big exploratory steps early and fine, precise steps late; most of the final-loss gains of a schedule come from the low-learning-rate phase at the end.',
                '**Learning rate is the hyperparameter to tune first.** A learning-rate range test (increase the LR exponentially over a few hundred steps and watch where the loss starts rising) gives a sensible upper bound in minutes.',
                '**Batch size and LR interact**: larger batches give less noisy gradients and usually tolerate a larger learning rate (roughly linear scaling for SGD, closer to square-root scaling for Adam), up to a critical batch size beyond which extra batch size buys little.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A useful mental model for the loss landscape: batch size trades gradient-estimate noise for update speed, while momentum/Adam trade a bit of extra memory and computation per step for far fewer total steps to converge, especially through the long, narrow, curved valleys that real loss landscapes actually have (rather than the clean bowl shape used in textbook illustrations).',
            },
          ],
        },
        {
          id: 'regularization-dropout-early-stopping',
          title: 'Regularization for Neural Networks: L1/L2, Dropout, and Early Stopping',
          summary:
            'Regularization fights overfitting by constraining a model\'s effective capacity — L1/L2 penalize large weights directly, dropout randomly disables neurons during training to prevent over-reliance on any one path, and early stopping simply halts training before the model starts memorizing noise.',
          keyPoints: [
            '**L2 regularization (weight decay)** adds `λ * sum(w²)` to the loss — penalizes large weights, encouraging the model to spread influence across many features/paths rather than relying heavily on a few; the most common regularizer for neural nets.',
            '**L1 regularization** adds `λ * sum(|w|)` — tends to push many weights to *exactly* zero, producing sparse models (useful for implicit feature selection), unlike L2, which shrinks weights but rarely zeroes them out entirely.',
            '**Dropout**: during training, each neuron is randomly "dropped" (set to zero) with some probability p on every forward pass — forces the network to not rely on any single neuron or fixed co-adapted group of neurons, since any of them might vanish; at inference time, all neurons are used. Modern frameworks implement **inverted dropout**: surviving activations are scaled up by `1 / (1 - p)` during training, so that inference needs no rescaling at all.',
            '**Early stopping**: monitor validation loss during training and stop (or restore the best checkpoint) once it stops improving, even if training loss is still decreasing — directly targets the exact point where the model starts fitting noise rather than signal.',
            'These techniques compose freely and are commonly used together (e.g., L2 + dropout + early stopping in the same training run) — each attacks overfitting through a different mechanism, so combining them is usually additive rather than redundant.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    subgraph Full["Full network (no dropout)"]
        direction LR
        I1((i1)) --> H1((h1)) --> O1((out))
        I1 --> H2((h2)) --> O1
        I2((i2)) --> H1
        I2 --> H2
    end
    subgraph Dropped["Same forward pass, WITH dropout (h2 randomly dropped)"]
        direction LR
        DI1((i1)) --> DH1((h1)) --> DO1((out))
        DI2((i2)) --> DH1
        DH2["h2 -- DROPPED, output forced to 0"]
    end`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'dropout and L2 weight decay in a PyTorch model',
              code: `import torch
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 256),
    nn.ReLU(),
    nn.Dropout(p=0.3),      # 30% of activations zeroed during training only (model.train())
    nn.Linear(256, 10),
)

# AdamW = decoupled weight decay; Adam(weight_decay=...) would add a coupled L2 term instead
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)

# early stopping, monitoring validation loss
best_val_loss, patience, patience_counter = float('inf'), 5, 0
for epoch in range(max_epochs):
    train_one_epoch(model, train_loader, optimizer)
    val_loss = evaluate(model, val_loader)
    if val_loss < best_val_loss:
        best_val_loss, patience_counter = val_loss, 0
        save_checkpoint(model)
    else:
        patience_counter += 1
        if patience_counter >= patience:
            break   # stop before overfitting gets worse`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Dropout can be understood as training an exponential ensemble of smaller sub-networks (one per random dropout mask) that share weights, and then approximately averaging their predictions at inference time (with all neurons active) — which is why it produces a regularization effect somewhat analogous to bagging, but within a single network.',
            },
          ],
        },
        {
          id: 'batch-normalization',
          title: 'Batch Normalization',
          summary:
            'Batch normalization re-standardizes each layer\'s activations (per mini-batch) to have zero mean and unit variance before a learned rescale — stabilizing and accelerating training by preventing the distribution of each layer\'s inputs from shifting wildly as earlier layers\' weights update.',
          keyPoints: [
            'For each mini-batch, batch norm normalizes each activation to zero mean/unit variance (using that batch\'s statistics), then applies a learned scale (`γ`) and shift (`β`) — so the network can still represent any distribution it needs, but starts from a well-behaved, standardized baseline at every layer.',
            'It was originally motivated by **internal covariate shift** (later layers chasing the shifting input distribution produced by earlier layers). Later work (Santurkar et al., 2018) showed that reducing that shift is not the main reason it works: batch norm chiefly makes the loss landscape **smoother** (better-conditioned gradients), which is what permits larger learning rates. Know both explanations; interviewers increasingly expect the second.',
            'In practice, batch norm allows meaningfully higher learning rates, speeds up convergence, and acts as a mild regularizer (since each batch\'s statistics add a small amount of noise, similar in spirit to dropout) — often reducing (though not eliminating) the need for other regularization.',
            'At inference time, there usually is no "batch" (predictions can be made one example at a time), so batch norm uses a running average of mean/variance accumulated *during training*, not the statistics of whatever batch happens to be at inference — a common source of subtle train/eval-mode bugs if forgotten.',
            'Batch norm is sensitive to small batch sizes (batch statistics become noisy/unreliable) — alternatives like **layer normalization** (normalizes across features for a single example, not across the batch) are preferred in settings like Transformers and small-batch/sequential training; **RMSNorm** (layer norm without mean-centering, cheaper) is the common choice in recent LLMs, and **group normalization** is common in detection/segmentation models trained with tiny per-GPU batches.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Layer["Previous layer's raw activations (shifting distribution over training)"] --> Norm["Normalize: subtract batch mean, divide by batch std"]
    Norm --> Scale["Learned rescale: gamma * normalized + beta"]
    Scale --> Next["Stable, consistent input distribution to the next layer"]`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'batch norm in a PyTorch model, and train/eval mode',
              code: `import torch.nn as nn

model = nn.Sequential(
    nn.Linear(784, 256),
    nn.BatchNorm1d(256),   # normalizes each of the 256 activations across the batch
    nn.ReLU(),
    nn.Linear(256, 10),
)

model.train()   # uses CURRENT batch statistics, updates running averages
# ... training loop ...

model.eval()    # uses the ACCUMULATED running mean/variance from training, not the current batch
# ... inference ...`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting to call `model.eval()` before inference is one of the most common real-world PyTorch bugs involving batch norm (and dropout) — the model silently keeps using per-batch statistics (or keeps applying dropout) at inference time, producing inconsistent, batch-size-dependent, and often visibly worse predictions than the same model correctly switched to evaluation mode.',
            },
          ],
        },
        {
          id: 'training-deep-networks-in-practice',
          title: 'Training Deep Networks in Practice: Init, Residuals, Precision, and Debugging',
          summary:
            'Getting a deep network to train reliably depends on a handful of engineering ideas — careful initialization, residual connections, normalization, gradient clipping, mixed precision and a disciplined debugging routine — more than on exotic architectures.',
          keyPoints: [
            '**Initialization** keeps activation and gradient variance roughly constant across layers: Xavier/Glorot (`Var(w) = 2 / (fan_in + fan_out)`) for tanh/sigmoid, He/Kaiming (`Var(w) = 2 / fan_in`) for ReLU. Bad init alone can make a deep network untrainable.',
            '**Residual connections** (`x + F(x)`) give gradients an identity path through the network, which is what made 100+ layer networks trainable (ResNet) and is a core ingredient of every Transformer.',
            '**Gradient clipping** (rescale the global gradient norm to at most a threshold, often 1.0) prevents a single bad batch from blowing up training — standard for RNNs and Transformers.',
            '**Mixed precision** (bf16 or fp16 compute with fp32 master weights) roughly halves memory and speeds up training substantially on modern GPUs; bf16 has fp32\'s exponent range and usually needs no loss scaling, fp16 does.',
            'Debug systematically: overfit a single batch first, check the initial loss against its theoretical value (`ln(num_classes)` for balanced softmax), visualize inputs after augmentation, and track gradient norms per layer.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    X["x"] --> F["F(x): conv/linear, norm, activation"]
    X --> Add(("+"))
    F --> Add
    Add --> Out["x + F(x)"]`,
            },
            {
              type: 'p',
              text: 'Why residuals work: the gradient of `y = x + F(x)` with respect to `x` is `I + dF/dx`. Even if `dF/dx` is small, the identity term carries the gradient straight back to earlier layers, so stacking blocks no longer multiplies gradients by many small factors. It also changes what each block must learn: instead of a full mapping, a block learns a *correction* to its input, and "do nothing" (F = 0) is easy to represent — so adding layers rarely makes the network worse, which was not true of plain deep stacks.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a modern PyTorch training loop: bf16 autocast, clipping, compile, eval mode',
              code: `import torch
import torch.nn as nn

device = "cuda" if torch.cuda.is_available() else "cpu"
model = MyNet().to(device)
model = torch.compile(model)                 # graph capture + kernel fusion (PyTorch 2.x)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.05)
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)

for epoch in range(num_epochs):
    model.train()
    for xb, yb in train_loader:
        xb, yb = xb.to(device, non_blocking=True), yb.to(device, non_blocking=True)
        with torch.autocast(device_type=device, dtype=torch.bfloat16):
            loss = loss_fn(model(xb), yb)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        grad_norm = torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()

    model.eval()                              # dropout off, batch norm uses running stats
    with torch.inference_mode():              # no autograd bookkeeping
        val_loss = sum(loss_fn(model(xb.to(device)), yb.to(device)).item()
                       for xb, yb in val_loader) / len(val_loader)`,
            },
            {
              type: 'table',
              headers: ['Symptom', 'Likely cause', 'First thing to try'],
              rows: [
                ['Loss is NaN/inf after some steps', 'LR too high, fp16 overflow, log(0), division by zero', 'Lower LR, add warmup, clip gradients, use bf16 or loss scaling, check for log of zero'],
                ['Loss stuck at ln(num_classes)', 'Labels misaligned, bug in data pipeline, LR far too small, dead ReLUs', 'Overfit one batch; inspect a few (input, label) pairs by eye'],
                ['Train loss falls, val loss rises early', 'Overfitting, or train/val preprocessing mismatch', 'More augmentation/regularization; diff the two pipelines'],
                ['Training loss very noisy', 'Batch too small, LR too high, unshuffled data', 'Larger batch or lower LR; confirm shuffling'],
                ['Great validation, poor production', 'Leakage, eval-mode not set, train/serve skew', 'Check model.eval(), identical preprocessing, out-of-time test'],
                ['GPU utilization low', 'Data loading bottleneck', 'More DataLoader workers, pinned memory, pre-processed shards'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Data augmentation** is often the strongest regularizer for vision and audio: random crops, flips, color jitter, mixup/cutmix. Augment only training data and only in ways that preserve the label (do not horizontally flip text or digits like 6/9).',
                '**Label smoothing** replaces the one-hot target with `1 - ε` on the true class and `ε / (K - 1)` on the others, discouraging overconfident logits and often improving calibration and accuracy.',
                '**Reproducibility**: seed Python, NumPy and PyTorch, log library versions and data snapshot IDs, and know that full determinism on GPUs requires deterministic algorithms (`torch.use_deterministic_algorithms(True)`) at some speed cost.',
                '**Checkpoint** model, optimizer, scheduler and RNG state together so a run can resume exactly, and keep the best checkpoint by validation metric, not the last one.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The single most valuable debugging habit: before any long run, train on one small batch (e.g. 32 examples) and confirm the loss goes to nearly zero. If a model cannot memorize 32 examples, there is a bug in the model, loss, labels or optimizer — no amount of tuning on the full dataset will fix it.',
            },
          ],
        },
        {
          id: 'convolutional-neural-networks',
          title: 'Convolutional Neural Networks',
          summary:
            'CNNs exploit the spatial structure of images by sliding small learned filters across the input to detect local patterns, then pooling to summarize and shrink the representation — dramatically fewer parameters than a fully-connected network on the same input, with a strong inductive bias suited to images.',
          keyPoints: [
            'A **convolution** slides a small filter (kernel, e.g. 3×3) across the input, computing a weighted sum at each position — the same filter (same weights) is reused across the entire image, which is what makes CNNs **parameter-efficient** and gives them **translation invariance** (a detected pattern is recognized regardless of where in the image it appears).',
            'Each filter learns to detect one specific local pattern (an edge, a color gradient, a texture); a convolutional layer typically has many filters in parallel, each producing its own **feature map**; stacking layers lets early layers detect simple features (edges) and later layers combine them into increasingly complex ones (shapes, object parts, whole objects).',
            '**Pooling** (typically max pooling: take the maximum value in each small region) downsamples the feature maps — reducing spatial size and computation, and adding a degree of local translation/distortion invariance (a feature detected slightly off-position still triggers the same pooled output).',
            'Compare to a fully-connected layer on the same image: a fully-connected layer would need a separate weight for every pixel-to-neuron connection (parameters scale with image size squared, roughly), while a convolutional filter\'s parameter count is fixed regardless of image size — this is precisely why CNNs scale to large images where fully-connected networks would not.',
            'A typical CNN architecture stacks (convolution → activation → pooling) blocks several times to progressively build up more abstract features while shrinking spatial resolution, then flattens and feeds into one or more fully-connected layers for the final classification/regression.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Input["Input image (e.g. 28x28x1)"] --> Conv1["Convolution: slide 3x3 filters -> feature maps (edges, gradients)"]
    Conv1 --> Act1["Activation (ReLU)"]
    Act1 --> Pool1["Max pooling: downsample, keep strongest activations"]
    Pool1 --> Conv2["Convolution: more filters -> combine into shapes/textures"]
    Conv2 --> Act2["Activation (ReLU)"]
    Act2 --> Pool2["Max pooling"]
    Pool2 --> Flat["Flatten"]
    Flat --> FC["Fully-connected layer(s)"]
    FC --> Out["Output: class probabilities"]`,
            },
            {
              type: 'p',
              text: 'A concrete picture of the convolution operation itself: a 3x3 filter slides over the image one position at a time; at each position, it multiplies its 9 weights element-wise against the 9 pixels underneath it and sums the result into a single output value, which becomes one pixel of the output feature map. The same 9 weights are reused at every position across the whole image — the filter is not re-learned per location, it is one shared pattern-detector applied everywhere.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a small CNN in PyTorch',
              code: `import torch.nn as nn

model = nn.Sequential(
    nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2),        # 28x28 -> 14x14

    nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(kernel_size=2),        # 14x14 -> 7x7

    nn.Flatten(),
    nn.Linear(64 * 7 * 7, 128),
    nn.ReLU(),
    nn.Linear(128, 10),                 # 10-class output
)`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Two properties explain why CNNs suit images specifically: **locality** (a pixel is most related to its nearby pixels, so a small local filter is a sensible inductive bias, unlike, say, tabular data where "nearby columns" usually has no meaning) and **translation invariance** (a cat in the top-left of an image is still a cat if it appears in the bottom-right — weight sharing across positions bakes exactly that assumption into the architecture).',
            },
          ],
        },
        {
          id: 'recurrent-networks-lstm',
          title: 'Recurrent Networks and LSTMs',
          summary:
            'RNNs process sequences by maintaining a hidden state that updates at each time step, but plain RNNs suffer a vanishing-gradient problem over long sequences — LSTMs fix this with gated units that let information (and gradient) flow across many time steps largely unimpeded.',
          keyPoints: [
            'A vanilla **RNN** updates a hidden state at each time step: `h_t = activation(W_h · h_(t-1) + W_x · x_t + b)` — the same weights are reused at every step, letting the network handle sequences of any length, and the hidden state acts as a compressed summary of everything seen so far.',
            'Training an RNN uses **backpropagation through time (BPTT)**: the network is "unrolled" across time steps and gradients flow backward through every step — mechanically the same chain rule as standard backprop, just applied across the time dimension instead of (or in addition to) the layer dimension.',
            'Because the same weight matrix is multiplied repeatedly across many time steps during BPTT, gradients tend to either **vanish** (shrink toward zero, if the repeated multiplication factor is < 1) or **explode** (grow unboundedly, if > 1) — vanishing gradients mean the network effectively cannot learn dependencies spanning many time steps, "forgetting" early context by the time it reaches later steps.',
            'An **LSTM (Long Short-Term Memory)** cell adds a separate **cell state** that flows across time steps with only minor, gated modifications (roughly additive rather than repeatedly multiplicative), plus three gates — **forget** (what to discard from the cell state), **input** (what new information to add), and **output** (what to expose as the hidden state) — that are themselves small learned networks controlling that flow.',
            'The (largely additive) cell-state highway is precisely what lets gradients propagate across many time steps without vanishing the way a vanilla RNN\'s repeatedly-multiplied hidden state does — this is the core mechanism, not just "LSTMs have more parameters."',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    X1["x1"] --> H1["h1"]
    X2["x2"] --> H2["h2"]
    X3["x3"] --> H3["h3"]
    H0["h0 (initial)"] --> H1
    H1 --> H2
    H2 --> H3
    H1 -.->|"gradient flows backward through time (BPTT)"| H0`,
            },
            {
              type: 'mermaid',
              code: `flowchart LR
    Prev["Cell state C(t-1)"] --> Forget["Forget gate: decide what to discard"]
    Forget --> Combine["Combine with new candidate values"]
    Input["Input gate: decide what new info to add"] --> Combine
    Combine --> New["New cell state C(t) -- flows forward mostly unchanged"]
    New --> Output["Output gate: decide what to expose as hidden state h(t)"]`,
            },
            {
              type: 'table',
              headers: ['', 'Vanilla RNN', 'LSTM'],
              rows: [
                ['Long-range dependencies', 'Struggles — gradients vanish over long sequences', 'Handles well — gated cell state preserves gradient flow'],
                ['Gates', 'None', 'Forget, input, output gates'],
                ['Parameters per cell', 'Fewer', 'More (roughly 4x, one set of weights per gate + candidate)'],
                ['Typical modern replacement', '—', 'GRU (a simplified, cheaper LSTM variant); Transformers (see next topic) for most large-scale sequence tasks today'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Transformers (next topic) have replaced RNNs/LSTMs as the default for most large-scale sequence tasks (translation, language modeling) because self-attention accesses any position in the sequence directly, rather than having to propagate information step-by-step through a chain of hidden states — but RNNs/LSTMs remain relevant for streaming/online settings, smaller-scale sequence problems, and understanding the history that motivated attention in the first place.',
            },
          ],
        },
        {
          id: 'transformer-self-attention',
          title: 'The Transformer Architecture and Self-Attention',
          summary:
            'Self-attention lets every position in a sequence directly weigh and combine information from every other position in a single step, computed via learned Query/Key/Value projections — replacing the step-by-step information bottleneck of recurrence with direct, parallelizable, all-pairs interaction.',
          keyPoints: [
            'For each token, self-attention produces three vectors via learned linear projections: a **Query** (what this token is looking for), a **Key** (what this token offers, to be matched against others\' queries), and a **Value** (the actual content to be passed along if attended to).',
            'Attention scores are computed as the dot product of a token\'s Query with every token\'s Key (including its own), scaled by `sqrt(d_k)` (the key dimension, to keep gradients well-behaved as dimensionality grows) — these scores are then passed through **softmax** to produce a probability distribution (attention weights) over all positions.',
            'The output for each token is the **weighted sum of all tokens\' Values**, weighted by that attention distribution — so each token\'s new representation is a learned, content-based blend of every other token\'s information, not just its immediate neighbors.',
            '**Multi-head attention** runs several independent attention computations (heads) in parallel, each with its own learned Q/K/V projections, then concatenates and linearly combines their outputs — different heads can learn to attend to different kinds of relationships (e.g., one head tracking syntactic dependency, another tracking coreference) simultaneously.',
            'Because self-attention has no inherent notion of sequence order (unlike an RNN\'s step-by-step structure), Transformers inject order information — originally fixed sinusoidal or learned **positional embeddings** added to the inputs, and in most current LLMs **rotary position embeddings (RoPE)**, which rotate queries and keys so that attention scores depend on relative distance; and because there is no sequential dependency between steps, attention over an entire sequence is computed in parallel, which is a major reason Transformers train so much faster than RNNs at scale on modern hardware.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart TB
    Tok["Input tokens + positional encoding"] --> QKV["Linear projections: each token produces Query, Key, Value"]
    QKV --> Scores["Compute attention scores: Query . Key(all tokens), scaled by sqrt(d_k)"]
    Scores --> Softmax["Softmax over scores -> attention weights (sum to 1 per token)"]
    Softmax --> Weighted["Weighted sum of ALL tokens' Values, using those attention weights"]
    Weighted --> NewRep["New representation per token: a learned blend of the whole sequence"]`,
            },
            {
              type: 'p',
              text: 'Concretely, when the model processes the word "it" in a sentence like "The cat sat on the mat because it was tired," self-attention lets "it" directly compute a high attention weight toward "cat" (and low weight toward "mat") by learning that its Query vector aligns well with "cat"\'s Key vector in that context — resolving what "it" refers to in a single computation, rather than requiring the information to survive being carried step-by-step across several intervening words the way a plain RNN\'s hidden state would have to.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'scaled dot-product attention, from first principles',
              code: `import numpy as np

def softmax(x, axis=-1):
    x = x - np.max(x, axis=axis, keepdims=True)   # numerical stability
    e = np.exp(x)
    return e / np.sum(e, axis=axis, keepdims=True)

def self_attention(X, W_q, W_k, W_v, causal=False):
    # X: (seq_len, d_model)
    Q = X @ W_q     # (seq_len, d_k)
    K = X @ W_k     # (seq_len, d_k)
    V = X @ W_v     # (seq_len, d_v)

    d_k = Q.shape[-1]
    scores = (Q @ K.T) / np.sqrt(d_k)     # (seq_len, seq_len) -- every token vs every token
    if causal:                             # decoder/LLM: token i may not look at tokens > i
        n = scores.shape[0]
        future = np.triu(np.ones((n, n), dtype=bool), k=1)
        scores = np.where(future, -np.inf, scores)
    weights = softmax(scores, axis=-1)     # each row sums to 1
    output = weights @ V                    # (seq_len, d_v) -- weighted blend of all Values
    return output, weights`,
            },
            {
              type: 'table',
              headers: ['', 'RNN / LSTM', 'Transformer (self-attention)'],
              rows: [
                ['How info reaches a distant token', 'Step-by-step through intervening hidden states', 'Directly, in one attention computation'],
                ['Parallelizable across sequence positions?', 'No — inherently sequential', 'Yes — all positions computed together (given the full sequence)'],
                ['Needs explicit position info?', 'No — order is implicit in the recurrence', 'Yes — positional encodings must be added'],
                ['Compute cost vs. sequence length', 'Linear in sequence length', 'Quadratic in sequence length (all-pairs attention)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The scaling factor `sqrt(d_k)` is not cosmetic: if query and key components are roughly independent with unit variance, their dot product has variance `d_k`, so raw scores grow with dimensionality and push softmax into a saturated regime with near-zero gradients almost everywhere except one dominant position — dividing by `sqrt(d_k)` restores unit variance and keeps training stable.',
            },
            {
              type: 'heading',
              text: 'The full block, and what changed since 2017',
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    In["Token embeddings"] --> N1["RMSNorm / LayerNorm"]
    N1 --> MHA["Multi-head self-attention (causal mask in decoders)"]
    MHA --> R1(("+"))
    In --> R1
    R1 --> N2["RMSNorm / LayerNorm"]
    N2 --> FFN["Feed-forward MLP, e.g. SwiGLU, about 4x wider"]
    FFN --> R2(("+"))
    R1 --> R2
    R2 --> Next["Next block (repeat N times)"]`,
            },
            {
              type: 'table',
              headers: ['Component', 'Original Transformer (2017)', 'Typical modern LLM practice', 'Why'],
              rows: [
                ['Architecture', 'Encoder-decoder', 'Decoder-only (GPT-style) for generation; encoder-only (BERT-style) for embeddings/classification', 'Decoder-only scales simply with next-token prediction'],
                ['Norm placement', 'Post-norm (after residual add)', 'Pre-norm (before each sub-layer)', 'Much more stable training at depth'],
                ['Normalization', 'LayerNorm', 'RMSNorm', 'Cheaper, works as well'],
                ['Positions', 'Sinusoidal, added to inputs', 'RoPE applied to queries/keys', 'Relative positions, better length handling'],
                ['Feed-forward activation', 'ReLU', 'GELU or SwiGLU', 'Better quality per parameter'],
                ['Attention heads', 'Full multi-head', 'Grouped-query attention (shared K/V heads)', 'Smaller KV cache, faster inference'],
                ['Attention kernel', 'Naive softmax(QK^T)V', 'Fused, memory-efficient kernels (FlashAttention-style)', 'Avoids materializing the n x n matrix in GPU memory'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Self-attention costs O(n²·d) time and, naively, O(n²) memory in sequence length n. Fused kernels remove the memory blow-up but not the quadratic compute, which is why long-context work explores sparse/sliding-window attention, state-space and linear-attention models. At inference, decoder models cache past keys and values (the **KV cache**) so each new token costs O(n) instead of recomputing the whole sequence — and that cache, not the weights, is often what limits batch size and context length in serving.',
            },
          ],
        },
        {
          id: 'transfer-learning-embeddings',
          title: 'Transfer Learning, Fine-Tuning, and Embeddings',
          summary:
            'Most deep learning in practice starts from a pretrained model rather than random weights — you reuse representations learned on huge datasets, either as frozen feature extractors (embeddings) or by fine-tuning some or all weights on your smaller labeled dataset.',
          keyPoints: [
            '**Self-supervised pretraining** (next-token prediction, masked tokens, contrastive image-text objectives) learns general representations from unlabeled data; the expensive part happens once, and everyone else adapts the result.',
            'Adaptation ladder, cheapest first: **zero-/few-shot prompting** of a foundation model, **frozen embeddings + a simple classifier**, **parameter-efficient fine-tuning** (LoRA and similar adapters), then **full fine-tuning**.',
            'An **embedding** maps an input (sentence, image, product, user) to a dense vector where geometric closeness reflects semantic similarity — enabling search, clustering, deduplication, recommendation, and strong tabular features.',
            '**LoRA** freezes the pretrained weight matrix `W` and learns a low-rank update `W + B·A` (rank r much smaller than the matrix dimensions), training a tiny fraction of the parameters with quality often close to full fine-tuning.',
            'Fine-tuning failure modes: **catastrophic forgetting** of general abilities, overfitting a small dataset, and evaluation contamination when the pretraining data already contained your test set.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Pre["Pretrained model<br/>(huge unlabeled corpus)"] --> Z["Prompting<br/>no training"]
    Pre --> E["Frozen embeddings<br/>+ logistic regression / GBM"]
    Pre --> L["LoRA / adapters<br/>train under 1-5% of params"]
    Pre --> F["Full fine-tuning<br/>train all params"]
    Z --> Cost["Increasing data, compute and risk"]
    E --> Cost
    L --> Cost
    F --> Cost`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Labeled data needed', 'Compute', 'Pick it when'],
              rows: [
                ['Prompting / in-context examples', 'None to a handful', 'Inference only', 'Prototype, task close to what the model already does'],
                ['Frozen embeddings + linear/GBM head', 'Hundreds to thousands', 'Tiny (CPU is fine for the head)', 'Classification, retrieval, clustering on text/images; strong, cheap baseline'],
                ['LoRA / adapters', 'Thousands', 'Moderate; one base model can serve many adapters', 'Need behavior or domain style the base model lacks'],
                ['Full fine-tuning', 'Many thousands+', 'High; one full copy per task', 'Large domain shift, maximum quality, small enough model'],
                ['Train from scratch', 'Very large', 'Highest', 'Truly novel modality/domain with abundant data'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'vision transfer learning: freeze the backbone, then unfreeze with a lower LR',
              code: `import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights

weights = ResNet50_Weights.DEFAULT                 # current recommended ImageNet weights
model = resnet50(weights=weights)
preprocess = weights.transforms()                  # use the SAME preprocessing as pretraining

for p in model.parameters():                       # stage 1: frozen feature extractor
    p.requires_grad = False
model.fc = nn.Linear(model.fc.in_features, num_classes)   # new head, trainable

optimizer = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)
# ... train a few epochs ...

for p in model.layer4.parameters():                # stage 2: unfreeze the last block
    p.requires_grad = True
optimizer = torch.optim.AdamW([
    {"params": model.layer4.parameters(), "lr": 1e-5},   # pretrained layers: small LR
    {"params": model.fc.parameters(), "lr": 1e-4},
], weight_decay=0.01)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'text embeddings as features for a classical model',
              code: `from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

encoder = SentenceTransformer("all-MiniLM-L6-v2")      # small, fast general-purpose encoder
X_emb = encoder.encode(texts, batch_size=64, normalize_embeddings=True)

clf = LogisticRegression(max_iter=2000, C=1.0)
print(cross_val_score(clf, X_emb, labels, cv=5, scoring="f1_macro").mean())
# With normalized embeddings, cosine similarity == dot product:
# similar = X_emb @ X_emb[query_idx]`,
            },
            {
              type: 'list',
              items: [
                '**Why lower learning rates for pretrained layers**: early layers hold general features (edges, syntax) that are already good; large updates destroy them. Discriminative (layer-wise) learning rates and gradual unfreezing protect them.',
                '**Domain gap decides how much to unfreeze**: natural photos to other natural photos, a frozen backbone may be enough; natural photos to X-rays or satellite imagery, fine-tune deeper.',
                '**Embedding model choice**: evaluate on *your* data with a small labeled retrieval/classification set; public leaderboards are a starting point, not a decision. Keep the embedding model version pinned — vectors from different models (or versions) are not comparable, so changing it means re-embedding everything.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Mismatched preprocessing is the classic transfer-learning bug: a backbone pretrained with specific resizing and normalization (or a specific tokenizer) silently degrades when fed differently preprocessed inputs. Always load the transforms/tokenizer that ship with the weights.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Large language models, retrieval-augmented generation and agents build directly on these ideas; they are covered in depth in the Generative AI section. From a classical-ML point of view, the key shift is that the *representation* is now usually bought (pretrained), while your leverage lies in data quality, evaluation and the adaptation method.',
            },
          ],
        },
        {
          id: 'ml-lifecycle-mlops',
          title: 'The ML Lifecycle, End to End',
          summary:
            'A production ML system is not "train a model once" — it is a continuous loop of collecting data, training, evaluating, deploying, and monitoring, feeding back into the next iteration as the real world (and the data describing it) keeps changing.',
          keyPoints: [
            '**Data collection & preparation**: sourcing, cleaning, labeling, and splitting data — often the single most time-consuming stage in practice, and the stage where most real-world quality problems originate.',
            '**Training & experimentation**: iterating on features, model architecture, and hyperparameters, tracked systematically (experiment tracking tools log metrics, parameters, and artifacts per run) so results are reproducible and comparable.',
            '**Evaluation**: rigorous held-out testing (see train/val/test) against metrics that reflect the actual business objective, plus slice-based evaluation (does the model perform consistently well across important subgroups, not just in aggregate).',
            '**Deployment**: packaging the model (often containerized) and serving it — batch or online (see the deployment-patterns topic) — behind versioning and rollback capability, ideally validated with a staged rollout (canary or A/B test) before full traffic.',
            '**Monitoring & feedback**: tracking live prediction quality, input distribution, and business metrics after deployment — feeding detected problems (drift, degraded accuracy, new edge cases) back into the next round of data collection and retraining, closing the loop.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Data["Data Collection & Preparation"] --> Train["Training & Experimentation"]
    Train --> Eval["Evaluation"]
    Eval -->|"not good enough"| Train
    Eval -->|"meets bar"| Deploy["Deployment (staged rollout)"]
    Deploy --> Monitor["Monitoring: drift, quality, business metrics"]
    Monitor -->|"problems detected"| Data
    Monitor -->|"periodic retraining"| Train`,
            },
            {
              type: 'list',
              items: [
                '**Reproducibility** requires versioning not just code, but data, features, and trained model artifacts together — "which exact data and code produced the model currently serving traffic?" needs to be answerable at any time, especially when debugging a regression.',
                '**Experiment tracking** (e.g., MLflow, Weights & Biases) logs hyperparameters, metrics, and artifacts per training run, making it possible to compare dozens or hundreds of runs systematically instead of relying on memory or scattered notebooks.',
                '**Feature stores** centralize feature computation so the exact same feature-engineering logic is used consistently at both training time and serving time — a major real-world source of bugs is subtly different feature logic between training and inference (training/serving skew).',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**Training/serving skew** — when the feature computation used at training time differs even slightly from what runs at inference time (different code paths, different data freshness, a bug in one but not the other) — is one of the most common causes of a model that looked great in offline evaluation but performs poorly in production. A shared feature pipeline/feature store used by both training and serving is the standard fix.',
            },
            {
              type: 'code',
              language: 'python',
              title: 'experiment tracking and model registration with MLflow',
              code: `import mlflow
import mlflow.sklearn
from sklearn.metrics import roc_auc_score

mlflow.set_experiment("churn-model")

with mlflow.start_run(run_name="hgb-v3"):
    mlflow.log_params(params)
    mlflow.set_tags({"git_sha": GIT_SHA, "data_snapshot": "2026-09-30"})

    model.fit(X_train, y_train)
    auc = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    mlflow.log_metric("val_roc_auc", auc)

    # log the whole Pipeline (preprocessing + model) with an input example,
    # so the serving signature is recorded alongside the artifact
    mlflow.sklearn.log_model(model, name="model", input_example=X_val.iloc[:5],
                             registered_model_name="churn-model")`,
            },
            {
              type: 'table',
              headers: ['Version this', 'Why', 'Typical tool'],
              rows: [
                ['Code (training + serving)', 'Reproduce behavior, audit changes', 'Git'],
                ['Data snapshot / query + timestamp', 'Same code on different data is a different model', 'Data versioning (lakehouse time travel, DVC)'],
                ['Feature definitions', 'Avoid training/serving skew', 'Feature store or shared feature library'],
                ['Hyperparameters, seeds, library versions', 'Reproduce the exact run', 'Experiment tracker, lockfiles, container images'],
                ['Model artifact + signature + metrics', 'Promote, roll back, compare', 'Model registry with stages/aliases'],
                ['Evaluation dataset and thresholds', 'Comparable gates across versions', 'Versioned eval sets, CI checks'],
              ],
            },
            {
              type: 'list',
              items: [
                '**CI/CD for ML** adds gates that ordinary software lacks: data validation (schema, ranges, null rates), training reproducibility checks, minimum-metric gates on a fixed evaluation set, slice-level regression checks, and fairness/latency budgets before a model can be promoted.',
                '**Continuous training** pipelines retrain on a schedule or on a drift trigger — but automatic retraining without automatic evaluation gates just automates shipping regressions.',
                '**Model cards / documentation** record intended use, training data, evaluation slices, known limitations and owners; increasingly expected by regulators and internal risk teams.',
              ],
            },
          ],
        },
        {
          id: 'deployment-patterns-drift-monitoring',
          title: 'Model Deployment: Batch vs Online Inference, and Drift Detection',
          summary:
            'How a model serves predictions (all at once on a schedule, or one request at a time in real time) is an architectural decision independent of the model itself — and once deployed, both the input data and the relationship it models can silently shift over time, which monitoring must catch.',
          keyPoints: [
            '**Batch inference**: the model scores a large set of inputs on a schedule (nightly, hourly), writing predictions to storage for later use — simpler infrastructure, no strict latency requirement, but predictions can be stale by the time they are used (e.g., a recommendation computed overnight doesn\'t reflect a purchase made an hour ago).',
            '**Online (real-time) inference**: the model serves individual prediction requests as they arrive, typically behind an API — always fresh, but requires low-latency serving infrastructure, careful scaling, and much tighter engineering discipline (the model must respond within a strict time budget under production load).',
            '**Data drift (covariate shift)**: the distribution of the model\'s *input* features changes over time (e.g., user demographics shift, a new product category is added) even though the true relationship between inputs and outputs has not changed — detectable by comparing feature distributions over time (e.g., population stability index, KL divergence, or simple summary-statistic monitoring).',
            '**Concept drift**: the actual relationship between inputs and the target changes (e.g., what counts as "spam" evolves as spammers adapt, or customer preferences shift after a major world event) — the model\'s assumptions become stale even if the input distribution looks unchanged; typically detected by watching live prediction accuracy/business metrics decay over time, since it requires ground truth (eventually) to notice directly.',
            'The fix for both is essentially the same operational response — alert, investigate, and retrain (or redesign features/labels) on more current data — but distinguishing which kind of drift occurred determines whether you need new labels, new features, or a fundamentally different model.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    subgraph Batch["Batch inference"]
        B1["Scheduled job scores a large batch"] --> B2["Predictions written to storage"] --> B3["Consumed later, possibly stale"]
    end
    subgraph Online["Online inference"]
        O1["Request arrives"] --> O2["Model scores it in real time"] --> O3["Response returned within a latency budget"]
    end`,
            },
            {
              type: 'table',
              headers: ['', 'Batch Inference', 'Online Inference'],
              rows: [
                ['Latency requirement', 'None / relaxed (minutes to hours)', 'Strict (typically milliseconds)'],
                ['Freshness', 'Can be stale between runs', 'Always current'],
                ['Infrastructure complexity', 'Lower — just a scheduled job', 'Higher — always-on, scaled, monitored service'],
                ['Typical use', 'Nightly churn scoring, bulk recommendation refresh', 'Fraud detection at transaction time, live search ranking'],
              ],
            },
            {
              type: 'mermaid',
              code: `flowchart TB
    Deployed["Model deployed to production"] --> Monitor["Continuously compare LIVE input distribution to TRAINING distribution"]
    Monitor -->|"input distribution shifted, relationship unchanged"| DataDrift["Data drift (covariate shift)"]
    Deployed --> Perf["Continuously track live accuracy / business metric, as ground truth arrives"]
    Perf -->|"accuracy decaying, inputs look normal"| ConceptDrift["Concept drift"]
    DataDrift --> Retrain["Retrain / update features on recent data"]
    ConceptDrift --> Retrain`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A/B testing a new model safely means routing a small, randomized slice of live traffic to the new (challenger) model while the majority continues on the current (control) model, comparing business/quality metrics with statistical rigor before a full rollout — combined with the ability to instantly roll back if the challenger underperforms. This is strictly safer than a full "big bang" cutover, which offers no fallback if the new model turns out worse in ways offline evaluation missed.',
            },
            {
              type: 'heading',
              text: 'Measuring drift, and what to monitor',
            },
            {
              type: 'code',
              language: 'python',
              title: 'population stability index (PSI) for one numeric feature',
              code: `import numpy as np

def psi(expected, actual, bins=10, eps=1e-6):
    """PSI = sum((a - e) * ln(a / e)) over bins defined on the TRAINING (expected) data."""
    edges = np.quantile(expected, np.linspace(0, 1, bins + 1))
    edges[0], edges[-1] = -np.inf, np.inf
    e = np.histogram(expected, edges)[0] / len(expected)
    a = np.histogram(actual, edges)[0] / len(actual)
    e, a = np.clip(e, eps, None), np.clip(a, eps, None)
    return float(np.sum((a - e) * np.log(a / e)))

score = psi(train_df["income"], last_week_df["income"])
# common rule of thumb: < 0.1 stable, 0.1-0.25 moderate shift, > 0.25 investigate`,
            },
            {
              type: 'table',
              headers: ['Layer', 'What to monitor', 'Needs labels?'],
              rows: [
                ['Data quality', 'Schema, null rate, out-of-range values, category cardinality, upstream freshness', 'No'],
                ['Input drift', 'PSI / KS test / Jensen-Shannon per feature, embedding drift for text/images', 'No'],
                ['Prediction drift', 'Distribution of scores and of predicted classes, share above threshold', 'No'],
                ['Model quality', 'AUC, precision/recall, calibration once labels arrive (often delayed)', 'Yes'],
                ['Business outcome', 'Conversion, losses prevented, complaints, override rate by humans', 'Indirectly'],
                ['Operational', 'Latency p50/p99, error rate, throughput, cost per 1k predictions', 'No'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Shadow deployment**: the new model receives a copy of live traffic and logs predictions without affecting users — perfect for catching skew, latency and crash bugs before any user-facing test.',
                '**Canary release**: a small percentage of real traffic is served by the new model with automatic rollback on guardrail breaches; an A/B test adds a proper statistical comparison of business metrics.',
                '**Feedback loops**: the model\'s decisions change the data you later train on (a fraud model blocks transactions, so you never learn whether they were fraud; a recommender only gets clicks on what it showed). Keep a small randomized exploration/holdout slice to get unbiased labels.',
                '**Alert on what is actionable**: dozens of per-feature drift alerts with no owner train people to ignore alerts. Prioritize features by importance and tie alerts to a runbook.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Statistical drift tests become "significant" for trivially small shifts once you have millions of rows. Judge drift by effect size (PSI, distance metrics) and by its impact on prediction distribution and performance, not by p-values alone.',
            },
          ],
        },
        {
          id: 'interpretability-and-fairness',
          title: 'Model Interpretability and Fairness',
          summary:
            'Interpretability tools explain *why* a model made a specific prediction, which matters more in some domains than others; fairness failures happen when a model learns and amplifies biased patterns already present in historical data, sometimes with serious real-world consequences.',
          keyPoints: [
            '**SHAP (SHapley Additive exPlanations)**: attributes each feature\'s contribution to a specific prediction using a game-theoretic approach (rooted in Shapley values from cooperative game theory) — for a given prediction, it answers "how much did each feature push the output up or down relative to a baseline," with contributions that provably sum to the total prediction.',
            '**LIME (Local Interpretable Model-agnostic Explanations)**: explains one prediction by fitting a simple, interpretable model (e.g., linear regression) *locally*, on perturbed samples around that one input — approximates the complex model\'s behavior in a small neighborhood, rather than globally.',
            'Interpretability matters most in **high-stakes, regulated, or trust-critical domains** — credit decisions (legally required to give a reason for denial), medical diagnosis (a clinician needs to sanity-check the reasoning), criminal justice risk scoring — and matters comparatively less for, say, a low-stakes product recommendation, where wrong predictions carry minimal cost.',
            '**Bias in ML** typically originates from biased or non-representative training data (historical hiring data reflecting past discriminatory hiring, policing data reflecting over-policing of certain neighborhoods) — the model learns and can even amplify these patterns, presenting them as neutral, data-driven conclusions.',
            'Concrete documented failure modes: a resume-screening model trained on historical hiring data that penalized resumes mentioning women\'s colleges or clubs; a healthcare risk-prediction algorithm that used healthcare *cost* as a proxy for health *need*, systematically underestimating the needs of Black patients because less money was historically spent on their care for the same level of need; facial recognition systems with substantially higher error rates on darker-skinned faces due to underrepresentation in training data.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: `flowchart LR
    Pred["A specific model prediction"] --> SHAP["SHAP: decompose into per-feature contributions that sum to the prediction"]
    Pred --> LIME["LIME: fit a simple local model on perturbed samples near this input"]
    SHAP --> Explain["'Feature X pushed the prediction up by 0.3, feature Y pushed it down by 0.1'"]
    LIME --> Explain`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'SHAP values for a single prediction',
              code: `import shap

# shap.Explainer picks a fast algorithm automatically (TreeExplainer for tree ensembles)
explainer = shap.Explainer(model, X_train.sample(500, random_state=0))  # background data
sv = explainer(X_test)                      # an Explanation object: values, base_values, data

shap.plots.waterfall(sv[0])                 # one prediction: how each feature moved it
shap.plots.beeswarm(sv)                     # global view: importance AND direction of effect
# base_value + sum(sv[0].values) == the model output for X_test[0] (in log-odds for classifiers)`,
            },
            {
              type: 'list',
              items: [
                '**Global vs local**: permutation importance and mean |SHAP| describe the model overall; SHAP/LIME values for one row explain one decision. Partial dependence and ICE plots show *how* the prediction changes as one feature varies.',
                '**Explanations describe the model, not the world**: a large SHAP value for "zip code" says the model relies on it, not that zip code causes the outcome.',
                '**Correlated features** are hard for every attribution method: credit is split between correlated features somewhat arbitrarily, and perturbation methods (LIME, KernelSHAP, permutation) may evaluate the model on unrealistic feature combinations.',
                '**LIME instability**: re-running LIME with a different random seed or neighborhood width can produce a different explanation; check stability before showing explanations to users.',
                '**Interpretable-by-design** models (sparse linear models, small trees, monotonic GBMs, generalized additive models such as EBMs) are often a better answer than post-hoc explanations in regulated settings.',
              ],
            },
            {
              type: 'list',
              items: [
                '**Fairness metrics** formalize different (often mutually incompatible) notions of "fair": **demographic parity** (positive prediction rate is equal across groups), **equalized odds** (true/false positive rates are equal across groups), and **individual fairness** (similar individuals receive similar predictions) — a model can satisfy one of these and violate another simultaneously, so "which fairness definition matters here?" is itself a domain-specific, often ethical, decision, not a purely technical one.',
                '**Mitigations**: audit training data for representation gaps and historical bias before training (not just after), remove or transform proxy variables that encode protected attributes indirectly (like using zip code as a proxy for race), evaluate model performance sliced by subgroup rather than only in aggregate, and, where feasible, apply fairness-aware training constraints or post-processing adjustments — paired with ongoing monitoring, since fairness can drift in production the same way accuracy can.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A model can be biased even with protected attributes (race, gender) explicitly removed from the training data — other features can act as **proxies** (zip code correlating strongly with race, given historical residential segregation) that let the model reconstruct and rely on the excluded signal indirectly. Simply dropping a sensitive column is rarely sufficient on its own.',
            },
          ],
        },
      ],
    },
    {
      id: 'machine-learning-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Common machine learning interview questions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'Explain the bias-variance tradeoff, precisely — not just the names, but what each term actually means.',
              answer:
                'If you trained the same type of model on many different random training sets and averaged the predictions, bias measures how far that average is from the true value — a systematic error baked into the model\'s assumptions, present regardless of which specific training set it saw. Variance measures how much the predictions swing between those different training sets — how sensitive the model is to the particular sample of data it happened to be trained on. Total expected error decomposes as bias squared plus variance plus irreducible noise, and the two trade off: increasing model complexity typically reduces bias but increases variance, and vice versa. The practical signature is the gap between training and validation error — high bias shows up as both being high and close together; high variance shows up as training error being low but validation error much higher.',
            },
            {
              question: 'Why do we need a separate test set in addition to a validation set?',
              answer:
                'The validation set is used repeatedly during development to make model-selection and hyperparameter decisions, which means information from it leaks into those choices over many iterations — a model tuned to maximize validation score is, to some degree, fit to that specific validation set, not just the general pattern. The test set is touched exactly once, at the very end, specifically to avoid that leakage, giving an honest estimate of how the model will perform on truly unseen data. The moment you use test-set results to make any decision — architecture, hyperparameters, even "let\'s try one more thing" — it stops functioning as a valid test set and effectively becomes a second validation set.',
            },
            {
              question: 'What is the difference between L1 and L2 regularization, and when would you prefer one over the other?',
              answer:
                'L2 regularization adds the sum of squared weights to the loss, penalizing large weights and encouraging the model to spread influence across many features rather than relying heavily on a few — it shrinks weights toward zero but rarely to exactly zero. L1 regularization adds the sum of absolute weights instead, and its geometry (a diamond-shaped constraint region versus L2\'s circular one) tends to push many weights to exactly zero, producing a sparse model. Prefer L1 when you want implicit feature selection or suspect many features are irrelevant; prefer L2 as the general default, especially in neural networks (as weight decay), where sparsity is less often the goal than simply constraining overall weight magnitude.',
            },
            {
              question: 'Why does gradient boosting typically outperform a single decision tree, and how does it differ mechanically from random forests?',
              answer:
                'A single decision tree, especially a deep one, has low bias but high variance — it fits the training data very closely, including its noise. Gradient boosting instead combines many shallow, high-bias, low-variance trees ("weak learners") trained sequentially, where each new tree fits the residual errors of the ensemble built so far, gradually reducing bias with each addition. This is mechanically different from random forests, which train many independent, typically deep trees in parallel on bootstrap-resampled data and average them, primarily reducing variance rather than bias. Boosting is sequential and bias-reducing; bagging/random forests are parallel and variance-reducing.',
            },
            {
              question: 'A single perceptron cannot learn XOR. Why not, and what fixes it?',
              answer:
                'A perceptron computes a weighted sum of its inputs and applies a threshold, which geometrically defines a single straight decision boundary — it can only correctly classify data that is linearly separable. XOR outputs 1 for exactly one input being 1, and no single straight line in the two-dimensional input space separates the (0,0)/(1,1) points from the (0,1)/(1,0) points — they are arranged so any line that captures one pair misses the other. The fix is stacking perceptrons into multiple layers with a non-linear activation between them: each layer can carve out its own linear boundary, and composing several non-linear transformations lets the network represent boundaries of essentially arbitrary shape. Critically, stacking only linear layers with no non-linearity would not help — composed linear functions are still just a single linear function — so both depth and non-linearity are required.',
            },
            {
              question: 'Walk through backpropagation: what exactly is being computed, and why is it efficient?',
              answer:
                'Backpropagation computes the gradient of the loss with respect to every weight in the network by applying the chain rule, propagating the error signal backward from the output layer to the input layer one layer at a time. The efficiency comes from reuse: each layer\'s gradient computation only needs the gradient flowing in from the layer immediately after it, combined with its own local derivative — so the algorithm computes all gradients in a single backward pass, reusing shared intermediate results, rather than independently re-deriving each weight\'s full chain-rule expression from scratch, which would be exponentially more expensive as the network gets deeper. This efficient reuse is precisely what made training networks with millions of parameters computationally tractable.',
            },
            {
              question: 'Why did ReLU largely replace sigmoid and tanh as the default hidden-layer activation in deep networks?',
              answer:
                'Sigmoid and tanh both saturate — flatten out — for large positive or negative inputs, and in that saturated regime their gradient is close to zero. Backpropagation multiplies the local derivatives of each layer together as it propagates backward, so in a deep network with sigmoid/tanh activations, many small (less than 1) factors multiply together and the gradient shrinks toward zero exponentially with depth — the vanishing gradient problem, which effectively stops earlier layers from learning. ReLU\'s gradient is exactly 1 for any positive input, so it does not shrink the backpropagated gradient the same way, letting much deeper networks train successfully. The tradeoff is the "dying ReLU" problem, where a neuron whose input becomes permanently negative stops learning entirely, which variants like Leaky ReLU address.',
            },
            {
              question: 'What is the vanishing gradient problem in RNNs specifically, and how do LSTMs address it?',
              answer:
                'A vanilla RNN updates its hidden state at every time step using the same weight matrix, and training via backpropagation through time multiplies that weight matrix\'s local derivative repeatedly, once per time step, as the gradient flows backward across the sequence. If that repeated multiplication factor is less than 1, the gradient shrinks toward zero exponentially with sequence length, meaning the network effectively cannot learn dependencies that span many time steps — it "forgets" early context. LSTMs address this by adding a separate cell state that flows across time steps with mostly additive, gated modifications rather than being repeatedly transformed and multiplied — the forget, input, and output gates control what is added to or removed from that cell state, and because the cell-state path is largely additive, gradients can propagate across many time steps without vanishing the way the hidden state\'s repeated multiplication does.',
            },
            {
              question: 'Explain self-attention in a Transformer as if walking a candidate through it step by step.',
              answer:
                'Every token is projected, via three separate learned linear transformations, into a Query vector (what this token is looking for), a Key vector (what this token offers to be matched against), and a Value vector (the actual content to pass along). To compute a new representation for a given token, you take the dot product of its Query against every token\'s Key (including its own), scale by the square root of the key dimension to keep the values in a well-behaved range, and pass the result through softmax to get a set of attention weights that sum to one. The token\'s new representation is then the weighted sum of every token\'s Value vector, using those attention weights — so each token\'s output is a learned, content-based blend of the entire sequence, computed directly rather than requiring information to be relayed step by step through intervening hidden states the way an RNN would. Multi-head attention just runs several of these computations in parallel with independently learned projections, letting different heads specialize in different kinds of relationships.',
            },
            {
              question: 'Why does a Transformer need positional encodings, when an RNN does not?',
              answer:
                'An RNN processes tokens one at a time in order, and its hidden state is updated sequentially, so the order of the input is implicitly baked into how information accumulates in the hidden state — there is no way to "shuffle" the sequence without changing the computation. Self-attention, by contrast, computes attention scores as an unordered set of pairwise dot products between all tokens\' Queries and Keys — mathematically, if you permuted the input tokens, the set of pairwise interactions (and thus the attention output, up to reordering) would be identical, meaning self-attention alone has no inherent notion of sequence order. Positional encodings are added to the token embeddings specifically to inject that missing order information back in, so the model can distinguish "the dog bit the man" from "the man bit the dog."',
            },
            {
              question: 'What is data drift, what is concept drift, and how do you tell them apart in production?',
              answer:
                'Data drift (covariate shift) is a change in the distribution of the model\'s input features over time, while the true underlying relationship between inputs and outputs stays the same — for example, a shift in user demographics using a product. Concept drift is a change in the actual relationship between inputs and the target itself — the same inputs now genuinely map to a different correct output, for example as spam techniques evolve or customer preferences shift after a major event. You detect data drift by directly comparing the live input feature distributions against the training distribution (using metrics like population stability index or KL divergence), which does not require waiting for ground-truth labels. Concept drift is harder to detect early because it typically requires comparing live model accuracy or a business metric against ground truth as it arrives, since the inputs alone can look perfectly normal while the model\'s learned mapping has quietly gone stale.',
            },
            {
              question: 'When would you choose precision over recall, or recall over precision, and why can\'t accuracy alone answer that question?',
              answer:
                'Accuracy weighs every error equally and collapses under class imbalance — on a dataset that is 99% negative, always predicting negative achieves 99% accuracy while catching zero positives, so it says nothing about how well the model finds the class you actually care about. Precision (of everything predicted positive, how much was actually positive) matters more when false positives are costly — for example, a fraud model that blocks too many legitimate transactions frustrates real customers, so you would raise the classification threshold to favor precision. Recall (of everything actually positive, how much was caught) matters more when false negatives are costly — for example, missing an actual cancer diagnosis is far worse than a false alarm that leads to further testing, so you would lower the threshold to favor recall. The right choice is a business/domain judgment about the relative cost of each error type; the metric alone cannot make that call for you.',
            },
            {
              question: 'Why is feature scaling required for some algorithms but not others?',
              answer:
                'Algorithms that are fundamentally distance-based (k-NN, k-means, SVMs) or gradient-based (linear/logistic regression, neural networks) are sensitive to the raw numeric scale of features: an unscaled feature with a much larger numeric range dominates distance calculations regardless of its actual predictive value, and on unscaled features, gradient descent\'s loss surface becomes a long, narrow, poorly-conditioned valley that is slow and unstable to descend. Tree-based models (decision trees, random forests, gradient boosting) are invariant to this, because every split is just a threshold comparison on a single feature at a time — "is this feature greater than X" gives the identical split regardless of any monotonic rescaling of that feature, so scaling changes nothing about which splits the tree chooses.',
            },
            {
              question: 'What is the kernel trick in SVMs, stated precisely?',
              answer:
                'Many datasets that are not linearly separable in their original feature space become linearly separable after being mapped into a higher-dimensional space. Explicitly computing that mapping can be extremely expensive or even infeasible for very high (or infinite) dimensional target spaces. SVM training and prediction, however, only ever need the dot product (a similarity measure) between pairs of data points, never the raw coordinates themselves — so a kernel function can compute what that dot product *would have been* in the higher-dimensional space directly from the original, lower-dimensional inputs, without ever materializing the transformed vectors. This lets an SVM behave as if it were operating in a much richer feature space, at only the computational cost of evaluating the kernel function in the original space.',
            },
            {
              question: 'How does k-means clustering work, and what are its main limitations?',
              answer:
                'K-means alternates between two steps until convergence: assign every point to its nearest centroid, then recompute each centroid as the mean of the points currently assigned to it. It minimizes within-cluster sum of squared distances, and this objective never increases across iterations, so it always converges — but only to a local optimum, meaning the result depends on the initial centroid placement (which is why k-means++ initialization, which spreads initial centroids apart deliberately, is used in practice rather than pure random initialization). Its main limitations: k must be chosen in advance (via the elbow method or silhouette score); it assumes clusters are roughly spherical, similarly sized, and separable by Euclidean distance, so it performs poorly on elongated, unevenly sized, or non-convex clusters; and it always outputs *some* k clusters even on data with no real cluster structure at all, so convergence alone is not evidence of a meaningful clustering.',
            },
            {
              question: 'Explain PCA: what is it actually optimizing, and why must you scale features first?',
              answer:
                'PCA finds an ordered set of orthogonal directions in the data — principal components — such that the first captures the most variance possible, the second captures the most remaining variance subject to being orthogonal to the first, and so on; projecting the data onto the top few components compresses it while retaining as much of the original variance as possible. Because PCA is explicitly chasing directions of maximum variance, a feature measured on a larger raw numeric scale (income in dollars versus age in years) would dominate the components purely as an artifact of its units, not because it is actually more informative — so features must be standardized before PCA, or the resulting components will mostly reflect which features happened to have the largest raw scale rather than genuine variance structure in the data.',
            },
            {
              question: 'What is the difference between bagging and boosting, in terms of what each is actually trying to fix?',
              answer:
                'Bagging trains many models independently and in parallel on different bootstrap-resampled versions of the training data, then averages or votes their predictions — this cancels out each individual model\'s idiosyncratic noise while preserving their (already low) bias, so it primarily reduces variance. It works best on low-bias, high-variance base learners, like deep decision trees. Boosting trains models sequentially, where each new model is explicitly fit to correct the errors (residuals, or more generally the negative gradient of the loss) made by the ensemble built so far, gradually reducing bias with each addition. It uses shallow, high-bias, low-variance base learners precisely because the sequential correction process is what does the heavy lifting. The two are complementary answers to the two different halves of the bias-variance decomposition.',
            },
            {
              question: 'What does "the model is overfitting" actually mean, and how would you confirm it rather than just assert it?',
              answer:
                'Overfitting means the model has fit patterns specific to the training set — including its noise — rather than the general underlying relationship, so it performs much better on training data than on new, unseen data. You confirm it, rather than assert it, by comparing training error against validation/test error: a large gap, where training error is very low but validation error is meaningfully higher, is the concrete signature of overfitting (as opposed to underfitting, where both are high and close together). Learning curves — plotting error against training-set size — add a second confirmation: a persistent, narrowing gap between training and validation error as more data is added is consistent with high variance responding correctly to more data, which further supports the overfitting diagnosis and its natural remedy.',
            },
            {
              question: 'Why is cross-entropy loss used for classification instead of mean squared error?',
              answer:
                'Applying MSE to a sigmoid or softmax output produces a loss surface that is not convex in the weights, and its gradient with respect to the model\'s raw score vanishes when the model is confidently wrong, because the sigmoid saturates near 0 or 1 and its derivative there is close to zero — so training stalls exactly in the situation where it should be correcting hardest. Cross-entropy\'s gradient with respect to the pre-activation score simplifies to a term directly proportional to the difference between the predicted probability and the true label, with no such vanishing-gradient trap, so the correction signal scales naturally with how wrong the prediction is. Cross-entropy is also the theoretically correct loss for a probabilistic classification objective — it is the negative log-likelihood of the true label under the model\'s predicted distribution, directly tying the loss to "how surprised should the model be by the true answer."',
            },
            {
              question: 'How would you handle a dataset where 99% of examples belong to one class?',
              answer:
                'First, recognize that accuracy is nearly useless here and switch to precision, recall, F1, or PR-AUC, which actually reflect performance on the minority class. Then address the imbalance itself with one or more of: class weighting (scale up the minority class\'s contribution to the loss, without touching the data), oversampling the minority class (including synthetic oversampling like SMOTE, which interpolates between existing minority points), or undersampling the majority class. Any resampling must be applied only to the training set — never to validation or test data — because the evaluation data needs to reflect the real-world class distribution the model will actually face in production, and applying it before splitting risks leaking near-duplicate synthetic points across the train/test boundary.',
            },
            {
              question: 'What is the difference between model interpretability approaches like SHAP and simply looking at feature importance from a random forest?',
              answer:
                'A random forest\'s built-in feature importance (typically mean impurity decrease, averaged across trees) is a *global* measure — it tells you which features mattered most across the whole model and dataset on average, but says nothing about why any single specific prediction came out the way it did. SHAP produces a *local*, per-prediction explanation: for one specific input, it decomposes the prediction into additive contributions from each feature, using a game-theoretic (Shapley value) approach, such that the contributions sum exactly to the difference between that prediction and a baseline. SHAP values can also be aggregated across many predictions to recover a global picture, but the reverse is not true — global feature importance alone cannot tell you what drove one particular customer\'s prediction, which is exactly the question interpretability is usually asked to answer in regulated or high-stakes settings.',
            },
            {
              question: 'Describe a concrete example of a real-world ML fairness failure, and what actually caused it.',
              answer:
                'A well-documented example is a healthcare risk-prediction algorithm that used historical healthcare *cost* as a proxy for healthcare *need*, on the reasoning that people with greater medical needs typically incur greater costs. In practice, because of systemic disparities in access to care, less money had historically been spent on Black patients than on white patients with the same underlying level of health need — so the model, trained on cost as its proxy label, systematically underestimated the health needs of Black patients and under-flagged them for extra care. The root cause was not an explicit protected attribute driving the model directly; it was a proxy label (cost) that itself encoded historical inequity, which the model then faithfully learned and reproduced as if it were a neutral, data-driven signal. This is why simply removing a protected attribute from a dataset does not guarantee a fair model — a correlated proxy can carry nearly the same signal.',
            },
            {
              question: 'What is the difference between batch normalization and layer normalization, and why do Transformers typically use layer norm instead of batch norm?',
              answer:
                'Batch normalization normalizes each activation using statistics (mean and variance) computed across the examples in the current mini-batch, for that one activation/feature — its statistics are noisy and unreliable when batch sizes are small, and it also requires maintaining running statistics collected during training to use at inference time, since there usually is no meaningful "batch" of one at inference. Layer normalization instead normalizes across the features of a single example, independent of batch size or other examples in the batch — so it works identically at training and inference time, and is unaffected by small or variable batch sizes. Transformers process variable-length sequences, often with batch composition and sizes that vary, and generating one token at a time at inference means there effectively is no meaningful batch statistic to rely on — layer normalization sidesteps both problems, which is why it is the standard choice in Transformer architectures.',
            },
            {
              question: 'Why can\'t you just always add more trees/layers/parameters to make a model better?',
              answer:
                'Beyond a certain point, added capacity stops reducing bias meaningfully and instead increases variance — the model has enough flexibility to start fitting noise specific to the training set, which shows up as training error continuing to fall while validation error stops improving or starts getting worse (the overfitting side of the bias-variance tradeoff and the complexity-vs-error curve). There are also practical costs entirely separate from statistical performance: more parameters mean more compute and memory for both training and inference, longer training time, and (for gradient-boosted trees specifically) more rounds without early stopping directly increases overfitting risk rather than just adding harmless extra capacity. The right amount of capacity is whatever minimizes validation error, not whatever the largest feasible model happens to be.',
            },
            {
              question: 'What is early stopping, and why is it considered a form of regularization even though it doesn\'t change the loss function?',
              answer:
                'Early stopping monitors validation loss during training and halts training (or restores the best-performing checkpoint) once validation loss stops improving, even if training loss is still decreasing. It counts as regularization because it directly limits the *effective* capacity the model gets to use: a model stopped early has not had the chance to fully fit the fine-grained noise in the training set the way a fully-converged model eventually would, so its effective complexity is lower than the same architecture trained to convergence — achieving a similar practical effect to explicit regularization (like L2 or dropout) without modifying the loss function or architecture at all, purely by controlling how long optimization is allowed to run.',
            },
            {
              question: 'How would you decide between batch and online (real-time) inference for a new ML feature?',
              answer:
                'The deciding factor is how quickly a prediction needs to reflect current information versus how tolerable staleness is. If predictions can be computed on a schedule and consumed later without losing much value — nightly churn scores, a weekly content-recommendation refresh — batch inference is simpler to build and operate, with no strict latency requirement and lower infrastructure complexity. If a prediction must reflect the state of the world at the exact moment of the request — fraud detection at the moment of a transaction, live search ranking — online inference is required, which brings a much higher engineering bar: the serving path must meet a strict latency budget under production load, scale elastically, and be monitored as a live service rather than a scheduled job. In practice, many systems use both: a batch job precomputes and caches predictions for the common case, with an online path reserved for the subset of requests that genuinely need up-to-the-moment freshness.',
            },
            {
              question: 'What is the normal equation for linear regression, and why isn\'t it always used instead of gradient descent?',
              answer:
                'The normal equation, w = (X^T X)^-1 X^T y, solves for the exact optimal weights in one closed-form step by directly setting the gradient of the mean squared error loss to zero and solving algebraically — no iteration, no learning rate to tune, no risk of not converging. The problem is that computing (X^T X)^-1 requires inverting a matrix whose size is the number of features squared, which costs on the order of the cube of the feature count — this becomes impractically slow once you have more than roughly a few thousand features, and it also requires the full design matrix to be available in memory at once. Gradient descent scales to far more features and to datasets too large to fit in memory (via mini-batch/stochastic variants that stream through the data), at the cost of needing to choose a learning rate and run multiple iterations to converge to an approximate, rather than exact, solution.',
            },
            {
              question: 'Explain why dropout works as a regularizer, mechanistically.',
              answer:
                'During training, dropout randomly zeroes out each neuron\'s output with some fixed probability on every forward pass, independently each time — this means the network can never rely on any single neuron, or any fixed co-adapted group of neurons, being reliably present, since any of them might be dropped on a given pass. This forces the network to learn more redundant, distributed representations rather than concentrating critical information in a few fragile pathways. Mechanistically, dropout can be understood as training an exponential number of smaller sub-networks that share weights (one implicit sub-network per random dropout mask), and at inference time, using the full network with all neurons active approximates averaging the predictions of that whole ensemble — producing a regularization effect conceptually similar to bagging, but achieved within a single network rather than by training separate models.',
            },
            {
              question: 'What is the curse of dimensionality, and which algorithms are most affected by it?',
              answer:
                'As the number of dimensions (features) grows, the volume of the space grows exponentially, and data points that were meaningfully "close" or "far" in low dimensions become increasingly equidistant from each other in high dimensions — the useful contrast in pairwise distances that distance-based reasoning relies on progressively degrades. This most directly affects distance-based algorithms: k-nearest neighbors, whose entire prediction mechanism is finding the nearest points, and k-means clustering, whose entire objective is minimizing distances to centroids, both become less effective as dimensionality grows, because "nearest" starts to lose its discriminative meaning. It is also why dimensionality reduction (PCA, feature selection) is a common preprocessing step before applying distance-based methods to high-dimensional data, and part of why tree-based and boosting methods, which do not rely on a global distance metric, tend to hold up better in high dimensions.',
            },
            {
              question: 'What is A/B testing a model in production, and why is it safer than a full rollout based on offline evaluation alone?',
              answer:
                'A/B testing a new (challenger) model means routing a small, randomized slice of live production traffic to it while the majority of traffic continues to be served by the current (control) model, then comparing business and quality metrics between the two groups with statistical rigor before deciding whether to roll the challenger out further. This is safer than trusting offline evaluation alone because offline metrics, however carefully computed on a held-out test set, can still miss real-world effects that only show up under live conditions — subtly different production data distributions, latency or infrastructure interactions, or downstream user behavior changes that no static test set could capture. Because only a limited slice of traffic is exposed to the challenger, and the rollout can be halted or rolled back the moment metrics look wrong, the blast radius of a bad model is contained, unlike a full "big bang" cutover with no live comparison and no easy way to detect a regression before it affects everyone.',
            },
            {
              question: 'Your model scores 0.97 AUC offline but performs poorly in production. Walk me through how you would investigate.',
              answer:
                'I would treat the offline number as a hypothesis to be falsified and check, in order of likelihood: (1) Leakage — is any feature a consequence of the label or computed with information from after the prediction time; was preprocessing, resampling or feature selection fitted before the split; do entities or near-duplicates appear on both sides of the split? An AUC that high on a hard problem is itself a red flag, and ablating the top feature or running an out-of-time evaluation usually exposes it. (2) Training/serving skew — diff the feature values the model saw offline against what the serving path logs for the same entities, since different code paths, null handling or data freshness are common. (3) Distribution shift — adversarial validation between training data and recent production data shows whether they are distinguishable and which features differ. (4) Label and metric mismatch — the offline label may be a proxy of what production cares about, or the threshold and calibration may be wrong even though ranking is good. (5) Operational issues such as eval-mode bugs, stale models or silent fallbacks. Only after ruling those out would I conclude the model genuinely does not generalize and revisit data and modeling.',
            },
            {
              question: 'How do you do hyperparameter tuning without fooling yourself about the final performance?',
              answer:
                'The score of the best configuration found by a search is the maximum of many noisy estimates, so it is optimistically biased, and the bias grows with the number of configurations tried. I keep a test set completely out of the loop and put every fitted preprocessing step inside a Pipeline so each CV fold re-fits it. For the search itself I use random or Bayesian search with log-scaled ranges for rates and regularization strengths, plus early stopping or successive halving to save compute. To estimate the quality of the whole procedure, I use nested cross-validation, where an outer loop evaluates a model that itself tunes in an inner loop, or I report the single score on the untouched test set. I also prefer the simplest configuration within one standard error of the best, since differences below the CV noise level are not real, and I match the splitter to the data: grouped for repeated entities, forward-chaining for time.',
            },
            {
              question: 'Explain Ridge, Lasso and Elastic Net. Why does Lasso give sparse solutions, and when does it fail?',
              answer:
                'All three add a penalty on coefficient size to the loss. Ridge penalizes the sum of squares, which shrinks every coefficient smoothly and, in the eigenbasis of the covariance, shrinks the poorly determined low-variance directions the most; it also makes X^T X invertible, so it handles collinearity and more features than rows. Lasso penalizes the sum of absolute values. The L1 constraint region has corners on the axes, and the loss contours tend to touch the region at a corner, which sets some coefficients exactly to zero; equivalently the L1 penalty has a constant gradient pulling small weights to zero, while the L2 gradient vanishes as the weight shrinks. Elastic Net blends both. Lasso struggles with groups of correlated features, where it arbitrarily keeps one and the selected set is unstable across resamples, and it can select at most n features when p exceeds n. Elastic Net is the usual fix. In all cases features must be standardized first, and the penalty strength chosen by cross-validation. Probabilistically, Ridge is a Gaussian prior and Lasso a Laplace prior on the weights.',
            },
            {
              question: 'ROC-AUC or PR-AUC for a fraud model with 0.1% positives, and how do you pick the operating threshold?',
              answer:
                'PR-AUC (average precision) is the more informative ranking metric here. ROC-AUC uses the false-positive rate, which divides by the enormous number of negatives, so a model can generate thousands of false alarms while its FPR and AUC still look excellent. Precision divides by the number flagged, so it reflects the experience of the analysts reviewing alerts. I would quote the PR-AUC baseline, which equals the prevalence of 0.1%. The threshold is a separate decision from the ranking metric: with calibrated probabilities, flag a case when p times the cost of a missed fraud exceeds (1 minus p) times the cost of a false alarm, which gives p greater than cost_FP over cost_FP plus cost_FN. In practice the threshold is often set by capacity, such as the number of cases the review team can handle per day, or by a precision floor, and it is tuned on a validation set or with cross-validation, then monitored because the base rate shifts over time.',
            },
            {
              question: 'What is probability calibration, why does it matter, and how do you fix a miscalibrated model?',
              answer:
                'A model is calibrated when among the cases it scores at 0.7, about 70 percent are truly positive. Ranking metrics such as AUC are unchanged by any monotonic transformation of the scores, so a model can have a perfect AUC and useless probabilities. Calibration matters whenever the probability itself is used: expected-loss calculations, combining model outputs, ranking by probability times value, or showing a risk to a person. Boosted trees, naive Bayes, SVMs, resampled or class-weighted training and large neural networks are all commonly miscalibrated. I diagnose with a reliability diagram and Brier score or log loss, then fit a monotonic mapping on held-out data that the base model was not trained on: Platt scaling for small calibration sets, isotonic regression when there is plenty of data, temperature scaling for neural networks. Fitting the calibrator on the training data learns nothing, and calibration should be rechecked in production because a shift in the base rate miscalibrates even a good model.',
            },
            {
              question: 'Why is Adam with L2 regularization different from AdamW, and what does a good LR schedule look like for a Transformer?',
              answer:
                'With Adam, an L2 penalty added to the loss becomes part of the gradient and is then divided by the running root-mean-square of gradients, so weights with large historical gradients are barely regularized and the effective decay is entangled with the adaptive scaling. AdamW decouples weight decay: it shrinks the weights directly at each step, independent of the gradient statistics, which makes the decay hyperparameter behave predictably and generalizes better in practice. Typically biases and normalization parameters are excluded from decay. For Transformers the standard schedule is a linear warmup over the first few hundred to few thousand steps, which protects against noisy early second-moment estimates and large initial updates, followed by cosine or linear decay to a small fraction of the peak rate, combined with gradient clipping at a norm of about 1. The peak learning rate is the most important hyperparameter, and an LR range test finds a sensible value cheaply.',
            },
            {
              question: 'Why do residual connections make deep networks trainable?',
              answer:
                'A residual block computes y = x + F(x). Its Jacobian with respect to x is the identity plus dF/dx, so the gradient has a direct path back to earlier layers that does not get multiplied by many small factors as depth grows, which counters vanishing gradients. It also changes the optimization problem: each block only has to learn a correction to its input, and the identity function (F equals zero) is easy to represent, so adding layers rarely makes the network worse than a shallower one, which was the degradation seen in plain deep stacks before ResNets. Residuals also give the network an ensemble-like set of paths of different effective depths. Every Transformer layer wraps both attention and the feed-forward network in residual connections, and modern ones normalize before each sub-layer (pre-norm) because it keeps the residual stream clean and training stable at depth.',
            },
            {
              question: 'How would you tune a gradient-boosted model, and what are the main regularization levers?',
              answer:
                'I start with a moderately low learning rate such as 0.05, set a large tree cap, and use early stopping on a validation set so the number of trees is chosen automatically. Then I tune tree complexity, which is the biggest lever for bias versus variance: max_depth or num_leaves and min_child_weight or min_child_samples, which stop leaves from fitting a handful of noisy rows. Next row and column subsampling, which decorrelate trees and regularize, then L2 and L1 on leaf values and the split-gain threshold gamma. At the end I lower the learning rate and raise the tree cap for small final gains. Underlying this, XGBoost-style libraries fit trees to gradients and hessians of the loss, with the optimal leaf value equal to minus the summed gradient over the summed hessian plus lambda, so lambda and the minimum hessian per leaf directly limit how confidently a leaf can move the prediction. I would also consider monotonic constraints where domain knowledge supports them and watch for leaf-wise growth overfitting on small data in LightGBM.',
            },
            {
              question: 'When would you fine-tune a pretrained model versus use its embeddings versus just prompt it?',
              answer:
                'I go up the ladder only as far as evaluation forces me. Prompting or few-shot examples need no training and are the right prototype when the task is close to what the model already does. If I have a few hundred to a few thousand labels and a classification, retrieval or clustering task, frozen embeddings with a logistic regression or gradient-boosted head are a cheap, strong, easily debugged baseline. Parameter-efficient fine-tuning such as LoRA, which learns a low-rank update to frozen weights, is the next step when I need behavior, format or domain language the base model lacks, since it trains a tiny fraction of the parameters and lets one base model serve many adapters. Full fine-tuning is for large domain shifts with enough data and a clear quality gap. Throughout I use a held-out set from my real distribution, watch for catastrophic forgetting and contamination of the test set by pretraining data, keep the original preprocessing or tokenizer, and pin the embedding model version because vectors from different models are not comparable.',
            },
            {
              question: 'What are the main causes of data leakage, and how do you design a workflow that prevents them structurally?',
              answer:
                'The main causes are target leakage (a feature that is a consequence or proxy of the label, such as an account-closed flag in a churn model), preprocessing leakage (scalers, imputers, encoders, PCA or feature selection fitted before splitting, or resampling before cross-validation), temporal leakage (features computed with data after the prediction time, or a random split of time-ordered data), and entity or duplicate leakage (the same patient, user or near-duplicate item on both sides of a split). Structurally, I prevent them by defining each training example by an entity and a prediction timestamp and building features strictly from earlier data using point-in-time joins; by splitting the way production will encounter data (by time, group or both) before any fitting; by keeping all fitted transformations inside a Pipeline that cross-validation re-fits per fold; by locking a final out-of-time test set; and by sanity checks such as ablating the top feature, adversarial validation between splits, and being suspicious of results that look too good.',
            },
            {
              question: 'Why can tree-based models fail at forecasting, and how would you build a robust ML forecaster?',
              answer:
                'Trees predict averages of targets seen in training leaves, so they cannot extrapolate: if demand is trending beyond its historical range, the forecast flattens at the old maximum. Also, a random train-test split on time series lets the model learn from the future. A robust setup starts with a naive and seasonal-naive baseline that the model must beat, then frames the task for a fixed horizon with lag and rolling features shifted so that the newest value used is the one actually available at forecast time, plus calendar features and covariates that are known in advance such as planned promotions. To handle trend I model differences, ratios to a rolling level, or a detrended series. I train a global model across related series, validate with rolling-origin backtests at several cut-off dates, never random k-fold, report errors by horizon and series segment with a scale-free metric such as WAPE or MASE, and produce calibrated prediction intervals whose coverage I verify in backtests.',
            },
            {
              question: 'What does mixed-precision training do, and what can go wrong?',
              answer:
                'Mixed precision runs most of the forward and backward computation in a 16-bit format (bf16 or fp16) while keeping master weights and sensitive reductions in fp32. That roughly halves activation memory and uses fast tensor-core hardware, giving large speedups with little accuracy loss. fp16 has a small exponent range, so small gradients underflow to zero and large values overflow; it needs dynamic loss scaling to avoid this. bf16 keeps fp32\'s exponent range with fewer mantissa bits, so it generally trains without loss scaling but has lower precision, which can matter for accumulations and some losses. Typical failures are NaN/inf losses from overflow or log of zero, silent loss of small updates when accumulating in low precision, and instability in operations like softmax, layer norm and large reductions, which frameworks keep in fp32 under autocast. I check for NaNs, track gradient norms, and compare against an fp32 run on a small setup when something looks off.',
            },
          ],
        },
      ],
    },
  ],
}
