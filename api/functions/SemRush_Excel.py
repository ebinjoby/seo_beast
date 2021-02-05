
# Importing Libraries
import pandas as pd
import langdetect as ld
import numpy as np
import sys
from os import listdir
from os.path import isfile, join
import multiprocessing as mp
import time
import warnings


def read_input():
    
    path = sys.argv[1]
    return path

# Cleaning functions
def file_filter(file):
    
    if (file.split('.')[-1] == 'csv') | (file.split('.')[-1] == 'xlsx'):
        return True
    else:
        return False

def convert(file):
    
    if file.split('.')[-1] == 'csv':
        temp = pd.read_csv(join(path, file))
        temp['Topic'] = file.replace('.csv', '')
        
    if file.split('.')[-1] == 'xlsx':
        xl = pd.ExcelFile(join(path, file))
        temp = xl.parse(xl.sheet_names[0])
        temp['Topic'] = file.replace('.xlsx', '')
    
    return temp

def is_english(text):
    
    try:
        return ld.detect(text) == 'en'
    except:
        return False

    
# Decomposition rules for the data
def decompose(row):
    
    return_list = list()
    for idx, item in enumerate(row[1]):
        
        temp = dict()
        temp['index'] = row[0]
        temp['Raw_data'] = row[1]
        temp['Pages'] = item
        temp['Position'] = idx + 1
        
        if (item != '') & (item != None):
            
            var = item.split('"')

            if len(var) == 5:
                if (var[1] != '') & (var[3] != ''):

                    if is_english(var[1]):

                        temp['Title'] = var[1]
                        temp['URL'] = var[3]
                        temp['Source'] = var[3]\
                                                .replace('https://', '')\
                                                .replace('http://', '')\
                                                .replace('www.', '')\
                                                .split('/')[0]
                        return_list.append(temp)
    return(return_list)


def decompose_multiple(x):
    '''
     applies decompose function on a list of rows
    '''
    result = list()
    for row in x:

        if row[0]%100 == 0:
            print('*')

        result.extend(decompose(row))
    
    return(result)


def analyze(path, media_path):

    start = time.time()
    
    warnings.simplefilter("ignore")
    
    files = [file for file in listdir(path) if isfile(join(path, file))]
    files = list(filter(file_filter, files))
    print('\n\nInput files are: ' + str(files) + '\n\n')
    
    
    files = list(map(convert, files))
    
    df = pd.concat(files)

    df['Competitors'] = df['Competitors'].apply(lambda string: string.split('\n'))

    df.columns = ['Database', 'Keyword', 'Seed', 'Tags', 'Volume', 'Difficulty', 'CPC', 
                  'Comp Density', 'Results', 'Features', 'Trend', 'Click Pot', 'Pages', 'Topic']

    sheet1 = df[['Topic', 'Keyword', 'Seed', 'Database', 'Tags', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 
            'Results', 'Features', 'Trend', 'Click Pot', 'Pages']]
    
    print('Sheet1 aggregated from input files with total number of rows = ' + str(len(sheet1.index)) + '\n\n')


    
    # Converting OGdata pages column into a list for faster opereations
    OGdata = df.reset_index(drop=True)
    
    ## resetting index for OGData as we would be using this to join original data back
    OGdata.reset_index(drop=False, inplace=True)
    
    Pages_list = list(OGdata['Pages'])
    Index_list = list(OGdata['index'])
    Input_list = list()
    
    for i,j in zip(Index_list,Pages_list):
        Input_list.append([i,j])

    # Single processor code
    # pool_results = decompose_multiple(lst)


    # Multiproccessing part

    n_jobs = mp.cpu_count()
    print('Splitting the process among ' + str(n_jobs) + ' CPU threads. Processing:\n\n')

    pool = mp.Pool(n_jobs)
    pool_results = pool.map(decompose_multiple, np.array_split(Input_list,n_jobs) )
    pool.close()
    pool.join()
    
    results = list()
    
    for result in pool_results:
        results.extend(result)
        
    result_df = pd.DataFrame(results)
    
    # merging the results back to the orignal data on index
    data = pd.merge(OGdata, result_df, on = 'index')
    
    # data is the df with new data that was proccessed
    
    sheet2 = data[['Topic', 'Keyword', 'Seed', 'Database', 'Tags', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 
               'Results', 'Features', 'Trend', 'Click Pot', 'Position', 'Source', 'Title', 'URL']]

    print('\n\nSheet2 decomposed from Sheet1 with total number of rows = ' + str(len(sheet2.index)) + '\n\n')
    


    domain_count = data.groupby('Source').count()['Position']
    mean_position = data.groupby('Source').mean()['Position'].apply(lambda num: round(num, 2))

    pivot = pd.concat([domain_count, mean_position], axis=1).reset_index()
    pivot.columns = ['Source', 'Total SERP URLs', 'Avg Position']

    media_list = pd.read_csv(media_path)
    media_list.columns = ['Source', 'Domain Category']

    pivot = pivot.merge(media_list, how ='left')

    categories = {
        'gov': 'Gov',
        'edu': 'Edu',
        'org': 'Org',
        'uk': 'Non-US',
        'ie': 'Non-US',
        'scot': 'Non-US',
        'ca': 'Non-US',
        'au': 'Non-US',
        'in': 'Non-US',
        'fr': 'Non-US',
        'de': 'Non-US',
        'es': 'Non-US',
        'nz': 'Non-US',
        'za': 'Non-US'
    }

    for key in categories:
        pivot.loc[pd.isnull(pivot['Domain Category']) & pivot['Source'].apply(lambda source: source.split('.')[-1] == key), 'Domain Category'] = categories[key]

    pivot.sort_values(by=['Total SERP URLs','Avg Position'], inplace=True, ascending=False)

    pivot = pivot[['Source', 'Domain Category', 'Total SERP URLs', 'Avg Position']]
    sheet3 = pivot

    print('Sheet3 created from pivoting Sheet2 with total number of rows = ' + str(len(sheet3.index)) 
         + ', out of which ' + str(sum(pd.isnull(pivot['Domain Category']))) + '/' + str(len(pivot.index)) 
         + ' received domain categories' + '\n\n')



    data = data.merge(pivot, how ='left')
    data['Domain'] = np.nan
    data['UVMs'] = np.nan
    data['Visits'] = np.nan
    data['Pages / Visit'] = np.nan
    data['Avg Duration'] = np.nan
    data['Bounce Rate'] = np.nan

    sheet4 = data[['Topic', 'Keyword', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 'Results', 'Trend', 'Click Pot', 
                   'Position', 'Source', 'Domain Category', 'Total SERP URLs', 'Avg Position', 'Title', 'URL']]

    sheet5 = data[['Topic', 'Keyword', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 'Results', 'Trend', 
                   'Click Pot', 'Position', 'Source', 'Domain', 'Domain Category', 'Total SERP URLs', 'Avg Position', 
                   'UVMs', 'Visits', 'Pages / Visit', 'Avg Duration', 'Bounce Rate', 'Title', 'URL']]

    print('Sheet4 and Sheet5 have been created by merging Sheet2 and Sheet3\n\n')
    


    writer = pd.ExcelWriter(path + '/output.xlsx', engine='xlsxwriter') #pylint: disable=abstract-class-instantiated

    sheet5.to_excel(writer, sheet_name='Sheet5', index=False)
    sheet4.to_excel(writer, sheet_name='Sheet4', index=False)
    sheet3.to_excel(writer, sheet_name='Sheet3', index=False)
    sheet2.to_excel(writer, sheet_name='Sheet2', index=False)
    sheet1.to_excel(writer, sheet_name='Sheet1', index=False)

    writer.save()

    print('Excel file output (containing all sheets) has been created\n\n')

    print('Output Location: ' + path.split('/')[-1] + '\n\n')
    
    end = time.time()
    
    print("Time Taken: " +  str(round(end-start, 2)) + ' seconds\n\n')
    
    
    
if __name__ == '__main__':
    
    path = read_input()
    media_path = '/Users/ejoby/Desktop/proto/seo_beast/api/databases/SERP Media Domain Categories.csv'
    analyze(path, media_path)
    
    
    
    