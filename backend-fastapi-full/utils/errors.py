"""Custom exceptions for HealMate API"""

from fastapi import HTTPException


class AppException(Exception):
    """Base exception untuk HealMate API"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class ValidationError(AppException):
    """Exception untuk validation error"""
    def __init__(self, message: str):
        super().__init__(message, status_code=422)


class AuthenticationError(AppException):
    """Exception untuk authentication error"""
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class NotFoundError(AppException):
    """Exception untuk resource not found"""
    def __init__(self, resource: str):
        message = f"{resource} not found"
        super().__init__(message, status_code=404)


class ConflictError(AppException):
    """Exception untuk conflict (duplicate data)"""
    def __init__(self, message: str):
        super().__init__(message, status_code=409)


def exception_to_http(exc: AppException) -> HTTPException:
    """Convert AppException ke HTTPException"""
    return HTTPException(
        status_code=exc.status_code,
        detail=exc.message
    )
