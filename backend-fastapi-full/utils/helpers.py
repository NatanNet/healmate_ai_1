"""Helper functions untuk HealMate API"""

from typing import Optional, Dict, Any
from datetime import datetime, timezone
from bson import ObjectId


def format_response(
    status: str = "success",
    message: Optional[str] = None,
    data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Format standard API response"""
    response = {
        "status": status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    if message:
        response["message"] = message
    
    if data:
        response.update(data)
    
    return response


def format_error_response(
    status: str = "error",
    message: str = "An error occurred",
    detail: Optional[str] = None
) -> Dict[str, Any]:
    """Format error response"""
    response = {
        "status": status,
        "message": message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    
    if detail:
        response["detail"] = detail
    
    return response


def convert_objectid(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB ObjectId ke string"""
    if not doc:
        return doc
    
    doc_copy = doc.copy()
    if "_id" in doc_copy:
        doc_copy["_id"] = str(doc_copy["_id"])
        doc_copy["id"] = doc_copy.pop("_id")
    
    if "userId" in doc_copy and isinstance(doc_copy["userId"], ObjectId):
        doc_copy["userId"] = str(doc_copy["userId"])
    
    return doc_copy


def convert_objectid_list(docs: list) -> list:
    """Convert list of MongoDB documents ke string IDs"""
    return [convert_objectid(doc) for doc in docs]


def get_pagination_params(
    page: int = 1,
    limit: int = 50,
    max_limit: int = 100
) -> tuple:
    """Get pagination skip dan limit"""
    limit = min(limit, max_limit)
    skip = (page - 1) * limit
    return skip, limit


def calculate_pagination_info(
    total: int,
    limit: int,
    page: int
) -> Dict[str, Any]:
    """Calculate pagination info"""
    pages = (total + limit - 1) // limit
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": pages,
        "hasNext": page < pages,
        "hasPrev": page > 1
    }
