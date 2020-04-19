import pymongo

def create_nba_db():
    conn = "mongodb://localhost:27017"
    client = pymongo.MongoClient(conn)
    dblist = client.list_database_names()
    
    if not "nba_db" in dblist:
        print("The database is not existing.")
        db = client["nba_db"]
        players_col = db["players"]
        players_col.insert_one({"name":"Kyle Lowry"})
    print(f"Database: {dblist}")
    print("The nba_db database has been created in your MongoDB!")
