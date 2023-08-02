import pandas as pd
df = pd.read_csv('adult.csv', names =['age', 'workclass', 'fnlwgt', 'education', 'education-num', 'marital-status',
                    'occupation', 'relationship', 'race', 'sex', 'capital-gain', 'capital-loss', 'hours-per-week', 'native-country', '50k'],
                    index_col=False)
df.to_csv('adult_census.csv')