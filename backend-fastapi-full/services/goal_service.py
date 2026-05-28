from database.mongodb import get_db

def create_goal(data,user_id):

    db=get_db()

    goals=db["goals"]

    goal={

        "userId":user_id,
        "title":data.title,
        "description":data.description,
        "completed":False
    }

    return goals.insert_one(goal)