from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.sec import datastore
from application.workers import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import *
from datetime import datetime, timedelta
from application.cache_instance import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views

    return app, datastore

app, datastore = create_app()

celery_app = celery_init_app(app)
@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    
    sender.add_periodic_task(
        crontab(minute=35, hour=12),
        daily_reminder.s('sentToMe@gmail.com','Subject to be written here'),
    )
if __name__ == '__main__':
    app.run(debug=True)