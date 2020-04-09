from bs4 import BeautifulSoup
import requests
from splinter import Browser
import pandas as pd
# import pymongo
import time

sleep_time = 3

# def init_browser():
#     #for mac
#     #executable_path = {"executable_path":"/usr/local/bin/chromedriver"}

#     #for windows
#     executable_path = {"executable_path":"chromedriver.exe"}
    
#     return Browser("chrome",**executable_path, headless=False)

def scrape_info():
    # browser = init_browser()

    players_columns = ['player','Age','G','GS','MP','FG','FGA','FG%','3P','3PA','3P%','2P','2PA','2P%',
           'eFG%','FT','FTA','FT%','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS','place','team']
    team_columns = ['team','G','MP','FG','FGA','FG%','3P','3PA','3P%','2P','2PA','2P%',
           'FT','FTA','FT%','ORB','DRB','TRB','AST','STL','BLK','TOV','PF','PTS','wins','losses','place','lat','lon','city']
    
    team_info = pd.read_csv('teams.csv')

    teams = team_info["abbreviation"].tolist()

    #for mac
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    
    #for windows
    # executable_path = {'executable_path': 'chromedriver.exe'}

    browser = Browser('chrome', **executable_path, headless=False)

    players_ds = []
    teams_ds = []

    for team in teams:

        url = "https://www.basketball-reference.com/teams/"+team+"/2020.html"
        browser.visit(url)
        time.sleep(sleep_time)
        
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        #scrape players data
        players_table = soup.find('table', id="totals")
        players_tbody = players_table.find("tbody")
        players_trows = players_tbody.find_all("tr")

        row = {}

        for tr in players_trows:
            i = 0
            td = tr.find_all("td")
            for column in players_columns:
                if column == 'place':
                    row[column] = team_info.loc[team_info['abbreviation'] == team, 'place'].values[0]
                elif column == 'team':
                    row[column] = team_info.loc[team_info['abbreviation'] == team, 'team'].values[0]
                else:
                    row[column] = td[i].text
                    i += 1
            players_ds.append(dict(row))
        
        #scrape teams data
        team_table = soup.find('table', id='team_and_opponent')
        team_tbody = team_table.find('tbody')
        team_trow = team_tbody.find('tr')
        team_td = team_trow.find_all("td")
        team_misc = soup.find('table', id='team_misc').find('tbody').find('tr').find_all('td')

        row = {}
        i = 0

        for column in team_columns:
            if column == 'place':
                row[column] = team_info.loc[team_info['abbreviation'] == team, 'place'].values[0]
            elif column == 'team':
                row[column] = team_info.loc[team_info['abbreviation'] == team, 'team'].values[0]
            elif column == 'lat':
                row[column] = team_info.loc[team_info['abbreviation'] == team, 'lat'].values[0]
            elif column == 'lon':
                row[column] = team_info.loc[team_info['abbreviation'] == team, 'lon'].values[0]
            elif column == 'city':
                row[column] = team_info.loc[team_info['abbreviation'] == team, 'city'].values[0]
            elif column == 'wins':
                row[column] = team_misc[0].text
            elif column == 'losses':
                row[column] = team_misc[1].text
            else:
                # print(i)
                row[column] = team_td[i].text
                i += 1

        teams_ds.append(row)
    browser.quit()   

    datasets = {}
    datasets['players']= players_ds
    datasets['teams'] = teams_ds

    return datasets

