
import os
import sys

print("pineapple")

os.system('python3 -m pip install pandas')
os.system('python3 -m pip install numpy')
os.system('python3 -m pip install langdetect')


def read_input(): 

    print('berry')
    path = sys.argv[1]
    print(str(path))
    return path


def is_english(text):

    try:
        return langdetect.detect(text) == 'en'
    except:
        return False



def analyze(path, media_path):

    files = [file for file in os.listdir(path) if os.path.isfile(os.path.join(path, file))]

    print('Input files are: ' + str(files))


    df = pandas.DataFrame()

    for file in files:

        if file.split('.')[-1] == 'csv':
            temp = pandas.read_csv(join(path, file))
            temp['Topic'] = file.replace('.csv', '')

        if file.split('.')[-1] == 'xlsx':
            xl = pandas.ExcelFile(join(path, file))
            temp = xl.parse(xl.sheet_names[0])
            temp['Topic'] = file.replace('.xlsx', '')

        df = df.append(temp, ignore_index=True)

    df['Competitors'] = df['Competitors'].apply(lambda string: string.split('\n'))

    df.columns = ['Database', 'Keyword', 'Seed', 'Tags', 'Volume', 'Difficulty', 'CPC', 
                  'Comp Density', 'Results', 'Features', 'Trend', 'Click Pot', 'Pages', 'Topic']

    sheet1 = df[['Topic', 'Keyword', 'Seed', 'Database', 'Tags', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 
            'Results', 'Features', 'Trend', 'Click Pot', 'Pages']]

    print('Sheet1 aggregated from input files with total number of rows = ' + str(len(sheet1.index)))


    data = pandas.DataFrame()

    for index, row in df.iterrows():
        for idx, item in enumerate(row['Pages']):

            temp = row
            temp['Pages'] = item
            temp['Position'] = idx + 1

            if (item != '') & (item != None):

                var = item.split('"')

                if len(var) == 5:
                    if (var[1] != '') & (var[3] != ''):

                        if is_english(var[1]):

                            temp['Title'] = var[1]
                            temp['URL'] = var[3]
                            temp['Source'] = var[3].replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]

                            data = data.append(temp, ignore_index=True)

    sheet2 = data[['Topic', 'Keyword', 'Seed', 'Database', 'Tags', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 
                   'Results', 'Features', 'Trend', 'Click Pot', 'Position', 'Source', 'Title', 'URL']]

    print('Sheet2 decomposed from Sheet1 with total number of rows = ' + str(len(sheet2.index)))


    domain_count = data.groupby('Source').count()['Position']
    mean_position = data.groupby('Source').mean()['Position'].apply(lambda num: round(num, 2))

    pivot = pandas.concat([domain_count, mean_position], axis=1).reset_index()
    pivot.columns = ['Source', 'Total SERP URLs', 'Avg Position']

    media_list = pandas.read_csv(media_path)
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
        'uk': 'Non-US',
        'fr': 'Non-US',
        'de': 'Non-US',
        'es': 'Non-US',
        'nz': 'Non-US',
        'za': 'Non-US'
    }

    for key in categories:
        pivot.loc[pandas.isnull(pivot['Domain Category']) & pivot['Source'].apply(lambda source: source.split('.')[-1] == key), 'Domain Category'] = categories[key]

    pivot.sort_values(by=['Total SERP URLs','Avg Position'], inplace=True, ascending=False)

    pivot = pivot[['Source', 'Domain Category', 'Total SERP URLs', 'Avg Position']]
    sheet3 = pivot

    print('Sheet3 created from pivoting Sheet2 with total number of rows = ' + str(len(sheet3.index)) 
         + ', out of which ' + str(sum(pandas.isnull(pivot['Domain Category']))) + '/' + str(len(pivot.index)) 
         + ' received domain categories')


    data = data.merge(pivot, how ='left')
    data['Domain'] = numpy.nan
    data['UVMs'] = numpy.nan
    data['Visits'] = numpy.nan
    data['Pages / Visit'] = numpy.nan
    data['Avg Duration'] = numpy.nan
    data['Bounce Rate'] = numpy.nan

    sheet4 = data[['Topic', 'Keyword', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 'Results', 'Trend', 'Click Pot', 
                   'Position', 'Source', 'Domain Category', 'Total SERP URLs', 'Avg Position', 'Title', 'URL']]

    sheet5 = data[['Topic', 'Keyword', 'Volume', 'Difficulty', 'CPC', 'Comp Density', 'Results', 'Trend', 
                   'Click Pot', 'Position', 'Source', 'Domain', 'Domain Category', 'Total SERP URLs', 'Avg Position', 
                   'UVMs', 'Visits', 'Pages / Visit', 'Avg Duration', 'Bounce Rate', 'Title', 'URL']]

    print('Sheet4 and Sheet5 have been created by merging Sheet2 and Sheet3')


    writer = pandas.ExcelWriter(path + '/Output.xlsx', engine='xlsxwriter')

    sheet5.to_excel(writer, sheet_name='Sheet5', index=False)
    sheet4.to_excel(writer, sheet_name='Sheet4', index=False)
    sheet3.to_excel(writer, sheet_name='Sheet3', index=False)
    sheet2.to_excel(writer, sheet_name='Sheet2', index=False)
    sheet1.to_excel(writer, sheet_name='Sheet1', index=False)

    writer.save()

    print('Excel file output (containing all sheets) has been created')



if __name__ == '__main__':
    
    print('mango')
    path = read_input()
    media_path = '/Users/ejoby/Desktop/proto/seo_beast/api/databases/SERP Media Domain Categories.csv'
    analyze(path, media_path)

