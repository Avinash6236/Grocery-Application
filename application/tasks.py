from celery import shared_task
from .models import db, Purchased
import flask_excel as excel
from .mail_service import send_message, send_monthly_report
from application.sec import datastore
from datetime import datetime, timedelta
from .models import RequestFromManager,Cart,Product,Categories,User,Purchased, db

@shared_task(ignore_result = False)
def generate_csv():
    record = Purchased.query.with_entities(Purchased.email, Purchased.product_name, Purchased.quantity_added).all()
    csv_output = excel.make_response_from_query_sets(record,["email", "product_name", "quantity_added"],"csv")
    fileName = "test1.csv"
    with open(fileName, 'wb') as f:
        f.write(csv_output.data)

    return fileName    

@shared_task(ignore_result = False)
def daily_reminder(to,subject):
    users = User.query.filter(User.is_login == False).all()
    print(users)
    for user in users:
        current_time = datetime.utcnow()
        time_difference = current_time - user.logout_time
        if time_difference > timedelta(minutes=5): 
            print("------------------yes you timedelta is working-------------------")     
            send_message(user.email,subject,"Hello user, you have not logged in for sometime, login and purchase items")
    return "OK"

@shared_task(ignore_result = False)
def monthly_report(to,subject):
    send_monthly_report(to,subject,"Monthly report")
    return "OK"