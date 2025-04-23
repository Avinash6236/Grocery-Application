class Config(object):
    DEBUG = False
    TESTING = False
    CACHE_TYPE = "RedisCache"
    CAHCE_DEFAULT_TIMEOUT = 300


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'
    SECRET_KEY = "thisissecter"
    SECURITY_PASSWORD_SALT = "thisissaltt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token' '''name of the header in which authentication token will come'''
    SECURITY_REGISTRABLE = True
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_REDIS_DB = 3