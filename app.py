from flask import Flask, render_template, redirect, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
import scrape_nba

#create am instance of Flask
app = Flask(__name__)
CORS(app, support_credentials=True)
#use PyMongo to establish Mongo connection
nba = PyMongo(app, uri="mongodb://localhost:27017/nba_db")

# players_col = db.players
# teams_col = db.teams

#route to render index.html template using data from Mongo
@app.route("/")
def home():
    return(
        f"Availabe Routes:<br/>"
        f"players json: /json/players<br/>"
        f"teams json: /json/teams<br/>"
        f"scrape nba data: /scrape<br/>"
        f"read json demo: /read_json<br/>"
    )

@app.route("/json/players")
def players():
    players_json = []
    results = nba.db.players.find()
    print(results)
    for result in results:
        del result["_id"]
        players_json.append(result)
    
    return jsonify(players_json)

@app.route("/json/teams")
def teams():
    teams_json = []
    results = nba.db.teams.find()
    for result in results:
        del result["_id"]
        teams_json.append(dict(result))
    
    return jsonify(teams_json) 

@app.route("/read_json")
def read_json():
    return render_template("demo.html")

#route the will trigger the scrape function
@app.route("/scrape")
def scrape():
    # players_col = db.players
    # teams_col = db.teams

    #run the scrape function
    nba_data = scrape_nba.scrape_info()

    #update the Mongo database using update and upsert=True
    nba.db.players.remove({})
    nba.db.teams.remove({})
    nba.db.players.insert_many(nba_data['players'])
    nba.db.teams.insert_many(nba_data['teams'])


    #redirect back to home page
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)