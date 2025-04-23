from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    logout_time = db.Column(db.DateTime())
    is_login = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False) 
    '''this fs_uniquifier will generate authentication token'''
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))
    study_resource = db.relationship('StudyResource', backref='creator')

class Purchased(db.Model):
    __tablename__ = 'purchased'
    email = db.Column(db.String, db.ForeignKey("user.email"), primary_key = True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.product_id"), nullable=False, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=False, primary_key=True)
    quantity_added = db.Column(db.Integer)
    product_name = db.Column(db.String, db.ForeignKey("product.product_name"),nullable = False)



class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class Categories(db.Model):
    __tablename__ = "categories"
    category_id = db.Column(db.Integer,autoincrement = True,primary_key = True)
    category_name = db.Column(db.String, nullable = False,unique = True)
   
    
class Product(db.Model):
    __tablename__ = "product"
    product_id = db.Column(db.Integer,autoincrement =True, primary_key = True)
    product_name= db.Column(db.String, nullable = False,unique = True)
    manufacture_date = db.Column(db.String)
    expiry_date = db.Column(db.String)
    rate = db.Column(db.Integer,nullable = False)
    unit = db.Column(db.String,nullable = False)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id") ,nullable = False)
    quantity = db.Column(db.Integer,nullable = False)

class Cart(db.Model):
    __tablename__ = "cart"
    email = db.Column(db.String, db.ForeignKey("user.email"), nullable = False, primary_key = True)
    product_id = db.Column(db.Integer, db.ForeignKey("product.product_id"), nullable=False, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey("categories.category_id"), nullable=False, primary_key=True)
    quantity_added = db.Column(db.Integer)
    product_name = db.Column(db.String, db.ForeignKey("product.product_name"),nullable = False)

class RequestFromManager(db.Model):
    __tablename__ = "requestFromManager"
    email = db.Column(db.String, nullable = False)
    type_of = db.Column(db.String,nullable = False)
    actionID = db.Column(db.Integer)
    actionInput = db.Column(db.String)
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)