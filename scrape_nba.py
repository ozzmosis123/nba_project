from bs4 import BeautifulSoup
import requests
from splinter import Browser
import csv
import pandas as pd
import time

sleep_time = 3


def scrape_info():

    players_columns = ['player','Age','G','GS','MP','FG','FGA','FG%','3P','3PA','3P%','2P','2PA','2P%',
           'eFG%','FT','FTA','FT%','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS','place','team','team_abbr']
    team_columns = ['team','G','MP','FG','FGA','FG%','3P','3PA','3P%','2P','2PA','2P%',
           'FT','FTA','FT%','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS','wins','losses','place','lat','lon','city','team_abbr']
    
    #for mac
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    
    #for windows
    # executable_path = {'executable_path': 'chromedriver.exe'}

    browser = Browser('chrome', **executable_path, headless=False)

    players_ds = []
    teams_ds = []

    with open('teams.csv', mode='r') as csv_file:
        csv_data = csv.DictReader(csv_file)
        # get the team info from the teams.csv
        # and create the url using the abbreviations of teams from csv file
        # and scrape data of teams and players from the url webpage
        for team in csv_data:
            #create the url for web scraping
            url = "https://www.basketball-reference.com/teams/" + team['abbreviation'] + "/2020.html"
            browser.visit(url)
            time.sleep(sleep_time)
            
            html = browser.html
            soup = BeautifulSoup(html, 'html.parser')
            #scrape players data
            players_table = soup.find('table', id="totals")
            players_tbody = players_table.find("tbody")
            players_trows = players_tbody.find_all("tr")

            row = {}
            #combine the player data with the team data of teams.csv
            #save the player data in row dictionary
            #add the row dictionary into players_ds list
            for tr in players_trows:
                i = 0
                td = tr.find_all("td")
                for column in players_columns:
                    if column == 'place':
                        row[column] = team['place']
                    elif column == 'team':
                        row[column] = team['team']
                    elif column == 'team_abbr':
                        row[column] = team['abbreviation']
                    else:
                        row[column] = td[i].text
                        i += 1
                #save the player data into players_ds list
                players_ds.append(dict(row))
            
            #scrape teams data
            team_table = soup.find('table', id='team_and_opponent')
            team_tbody = team_table.find('tbody')
            team_trow = team_tbody.find('tr')
            team_td = team_trow.find_all("td")
            team_misc = soup.find('table', id='team_misc').find('tbody').find('tr').find_all('td')

            row = {}
            i = 0
            #combine the team data with the team data of teams.csv
            #save the team data in row dictionary
            #add the row dictionary into teams_ds list
            for column in team_columns:
                if column == 'place':
                    row[column] = team['place']
                elif column == 'team':
                    row[column] = team['team']
                elif column == 'lat':
                    row[column] = team['lat']
                elif column == 'lon':
                    row[column] = team['lon']
                elif column == 'city':
                    row[column] =team['city']
                elif column == 'wins':
                    row[column] = team_misc[0].text
                elif column == 'losses':
                    row[column] = team_misc[1].text
                elif column == 'team_abbr':
                    row[column] = team['abbreviation']
                else:
                    row[column] = team_td[i].text
                    i += 1

            teams_ds.append(row)
        browser.quit()   

    datasets = {}

    players_df = pd.DataFrame(players_ds)
    teams_df = pd.DataFrame(teams_ds)

    # rename columns
    players_df = players_df.rename(columns={'2P':'Two_P','2P%':'Two_PP','2PA':'Two_PA','3P':'Three_P','3P%':'Three_PP','3PA':'Three_PA','FG%':'FGP','eFG%':'eFGP','FT%':'FTP'})
    teams_df = teams_df.rename(columns={'2P':'Two_P','2P%':'Two_PP','2PA':'Two_PA','3P':'Three_P','3P%':'Three_PP','3PA':'Three_PA','FG%':'FGP','eFG%':'eFGP','FT%':'FTP'})

    #convert statuses of teams from strings to numbers
    teams_df = teams_df.astype({'AST':int, 'BLK':int, 'DRB':int, 'FG':int, 'FGA':int, 'FGP':float, 'FT':int, 'FTA':int, 'FTP':float, 
                            'G':int, 'MP':int,'ORB':int, 'PF':int, 'PTS':int, 'STL':int, 'TOV':int, 'TRB':int, 'Three_P':int, 
                            'Three_PA':int,'Three_PP':float, 'Two_P':int, 'Two_PA':int, 'Two_PP':float,'losses':int,'wins':int})
    #create new columns for rankings data
    teams_df['rk_PTS'] = teams_df['PTS'].rank(method='min',ascending=False)
    teams_df['rk_AST'] = teams_df['AST'].rank(method='min',ascending=False)
    teams_df['rk_STL'] = teams_df['STL'].rank(method='min',ascending=False)
    teams_df['rk_BLK'] = teams_df['BLK'].rank(method='min',ascending=False)
    teams_df['rk_TRB'] = teams_df['TRB'].rank(method='min',ascending=False)
    teams_df['rk_TOV'] = teams_df['TOV'].rank(method='min',ascending=True)
    teams_df['rk_Two_PP'] = teams_df['Two_PP'].rank(method='min',ascending=False)
    teams_df['rk_Three_PP'] = teams_df['Three_PP'].rank(method='min',ascending=False)
    teams_df['rk_FGP'] = teams_df['FGP'].rank(method='min',ascending=False)
    

    #replace empty player records with 0
    players_df.replace('', 0, inplace=True)
    #convert statuses of teams from strings to numbers
    players_df = players_df.astype({'AST':int, 'BLK':int, 'DRB':int, 'FG':int, 'FGA':int, 'FGP':float, 'FT':int, 'FTA':int, 'FTP':float, 
                                'G':int, 'GS': int, 'MP':int,'ORB':int, 'PF':int, 'PTS':int, 'STL':int, 'TOV':int, 'TRB':int, 'Three_P':int, 
                                'Three_PA':int,'Three_PP':float, 'Two_P':int, 'Two_PA':int, 'Two_PP':float, 'eFGP':float,'Age': int})

    players_ds = players_df.to_dict('records')
    teams_ds = teams_df.to_dict('records')

    #save players_ds and teams_ds in datasets dictionary
    datasets['players']= players_ds
    datasets['teams'] = teams_ds
    #return the datasets dictionary
    return datasets

