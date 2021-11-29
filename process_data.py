import pandas as pd
import numpy as np
import json

with open('states.json') as f:
  data = json.load(f)

# with open('us-state-centroids.json') as f:
#   data_1 = json.load(f)
data_d = pd.read_csv('covid_deaths_usafacts_processed_T.csv')
data_c = pd.read_csv('covid_confirmed_usafacts_time_processed_T.csv')

for i in range(len(data['objects']['usStates']['geometries'])):
  c = data_c[data['objects']['usStates']['geometries']['properties']['STATE_ABBR']].values.tolist()
  d = data_d[data['objects']['usStates']['geometries']['properties']['STATE_ABBR']].values.tolist()
  data['objects']['usStates']['geometries']['properties']['cases'] = c
  data['objects']['usStates']['geometries']['properties']['deaths'] = d

with open('states_process.json', 'w') as json_file:
  json.dump(data, json_file)
print(1)
'''
data_d = pd.read_csv('covid_deaths_usafacts.csv')
All_state = data_d['State'].drop_duplicates().values.tolist()

data_d_sate = data_d.groupby('State')
data_d_sate_dict = {}

for i in range(len(All_state)):
    data_d_one_state = data_d.loc[data_d['State']==All_state[i]]
    data_d_one_state_sum = data_d_one_state.apply(lambda x: x.sum())
    data_d_sate_dict[All_state[i]] = data_d_one_state_sum.iloc[4:]


d_df = pd.DataFrame.from_dict(data_d_sate_dict, orient='index')
d_df_T = d_df.T

# d_df_T.to_csv('covid_deaths_usafacts_processed.csv')
d_df.to_csv('covid_deaths_usafacts_processed_T.csv')



data_c = pd.read_csv('covid_confirmed_usafacts.csv')
All_state = data_c['State'].drop_duplicates().values.tolist()

data_c_sate = data_c.groupby('State')
data_c_sate_dict = {}

for i in range(len(All_state)):
    data_c_one_state = data_c.loc[data_c['State']==All_state[i]]
    data_c_one_state_sum = data_c_one_state.apply(lambda x: x.sum())
    data_c_sate_dict[All_state[i]] = data_c_one_state_sum.iloc[4:]


c_df = pd.DataFrame.from_dict(data_c_sate_dict, orient='index')
c_df_T = c_df.T

# c_df_T.to_csv('covid_confirmed_usafacts_time_processed.csv')
c_df.to_csv('covid_confirmed_usafacts_time_processed_T.csv')

'''