# External evaluation

Source: `examples\real_samples_template.csv`. Model: run `28f7a3ba127643d4bc2ec91964097ee1`, threshold 0.4849.

- Rows: 3, scored: 3, rejected by validation: 0
- Flag rate: 33.3%; bands: {'accept': 2, 'reject': 1}

## Stage 1: pure vs adulterated (95% bootstrap CI)

| View | Recall | Precision | PR-AUC | TP | FP | FN | TN |
|---|---|---|---|---|---|---|---|
| all | 1.000 (1.00–1.00) | 1.000 (1.00–1.00) | 1.000 | 1 | 0 | 0 | 2 |
| detectable | 1.000 (1.00–1.00) | 1.000 (1.00–1.00) | 1.000 | 1 | 0 | 0 | 2 |

## Stage 2: which adulterant (all adulterated rows)

Macro-F1 over classes present (water): **1.000**

| Class | F1 |
|---|---|
| water | 1.00 |
