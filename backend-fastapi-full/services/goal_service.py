from database.mongodb import get_db
from bson import ObjectId
from datetime import datetime

def create_goal(data, user_id):
    db = get_db()
    goal = {
        "userId": ObjectId(user_id),
        "title": data.title,
        "description": data.description,
        "dueDate": data.dueDate,
        "priority": data.priority or "medium",
        "status": "active", # Mengikuti Pydantic schema
        "progress": 0,
        "createdAt": datetime.utcnow()
    }
    result = db["goals"].insert_one(goal)
    
    # Ambil data yang baru dibuat untuk dikembalikan
    goal["id"] = str(result.inserted_id)
    goal["userId"] = str(goal["userId"])
    del goal["_id"]
    return goal

def list_goals(user_id):
    db = get_db()
    cursor = db["goals"].find({"userId": ObjectId(user_id)}).sort("createdAt", -1)
    goals = []
    for goal in cursor:
        goal["id"] = str(goal.pop("_id"))
        goal["userId"] = str(goal["userId"])
        goals.append(goal)
    return goals

def get_goal(goal_id, user_id):
    db = get_db()
    goal = db["goals"].find_one({"_id": ObjectId(goal_id), "userId": ObjectId(user_id)})
    if goal:
        goal["id"] = str(goal.pop("_id"))
        goal["userId"] = str(goal["userId"])
    return goal

def update_goal(goal_id, data_dict, user_id):
    db = get_db()
    # Buang nilai None agar tidak menimpa data yang sudah ada dengan Null
    update_data = {k: v for k, v in data_dict.items() if v is not None}
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        db["goals"].update_one(
            {"_id": ObjectId(goal_id), "userId": ObjectId(user_id)},
            {"$set": update_data}
        )
    
    return get_goal(goal_id, user_id)

def delete_goal(goal_id, user_id):
    db = get_db()
    result = db["goals"].delete_one({"_id": ObjectId(goal_id), "userId": ObjectId(user_id)})
    return result.deleted_count > 0