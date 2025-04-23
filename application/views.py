from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required,current_user
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
from application.sec import datastore
from .models import RequestFromManager,Cart,Product,Categories,User,Purchased, db
from .sec import datastore
import flask_excel as excel
from .tasks import generate_csv
from celery.result import AsyncResult
from datetime import datetime

from .cache_instance import cache

@app.get('/')
def home():
    return render_template("index.html")


'''@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"'''

@auth_required("token")
@app.get("/admin_dashboard/<string:user_email>")
def admin_dashboard(user_email):
    user = datastore.find_user(email=user_email)
    if user.active:
        category_records = Categories.query.all()
        if len(category_records) == 0:
            return jsonify({"message":"No category found"})
        else:
            cat = dict()
            for each_cat_instance in category_records:
                cat[each_cat_instance.category_id]=each_cat_instance.category_name
            print(cat)    
            return jsonify(cat)
    else:
        return jsonify({'message2':'user is not active yet'})    

@app.get('/inactive_manager')
def inactive_manager():
    manager = User.query.filter(User.active == 0).all()

    manager_dict = dict()
    for i in range(len(manager)):
        manager_dict[i] = manager[i].email

    return jsonify(manager_dict), 200    


@auth_required("token")
@roles_required("admin")
@app.post('/activate/manager/<string:email>')
def activate_instructor(email):
    print(email,"im inside activate_instructor")
    manager = User.query.filter(User.email == email).all()
    print(manager)
    if not manager[0] or "manager" not in manager[0].roles:
        return jsonify({"message": "manager not found"}), 404
    else:
        manager[0].active = True
        db.session.commit()
        return jsonify({"message": "manager Activated"}), 200


@auth_required("token")
@roles_required("admin") 
@app.get('/admin_products/<int:category_id>')
def show_products(category_id):
    category_records = Categories.query.filter(Categories.category_id == category_id).all()
    category_name = category_records[0].category_name
    product_records = Product.query.filter(Product.category_id == category_id).all()
    if len(product_records) == 0:
        return jsonify({"message":"No product found"})
    else:
        prod = dict()
        for prod_ in product_records:
            new_prod = dict()
            new_prod["product_id"] = prod_.product_id
            new_prod["product_name"] = prod_.product_name
            new_prod["manufacture_date"] = prod_.manufacture_date
            new_prod["expiry_date"] = prod_.expiry_date
            new_prod["rate"] = prod_.rate
            new_prod["unit"] = prod_.unit
            new_prod["quantity"] = prod_.quantity
            prod[prod_.product_id] = new_prod

        return jsonify(prod)

@app.route('/give_category_from_id/<int:category_id>',methods=['GET'])
def give_category_from_id(category_id):
    category_records = Categories.query.filter(Categories.category_id == category_id).all()
    cat_dict = dict()
    for elm in category_records:
        cat_dict['category_name'] = elm.category_name
    return jsonify(cat_dict), 200

@auth_required("token")
@roles_required("manager")
@app.route('/product/<int:product_id>/delete',methods = ['DELETE'])
def delete_product(product_id):
    #I need to delete this product of given product id note that as of now im only deleting product from product table database, later i might require to delete it from some other table also.
    product_ = Product.query.filter(Product.product_id == product_id).all()
    prodcut_from_carts = Cart.query.filter(Cart.product_id == product_id).all()
    category_id = Product.query.filter(Product.product_id == product_id).with_entities(Product.category_id).first()
    category_id_ = -1
    if category_id:
        category_id_ = category_id[0]

    for each in product_:
        db.session.delete(each)
        db.session.commit()

    for each in prodcut_from_carts:
        db.session.delete(each)
        db.session.commit()    
    return jsonify({"message": "Product deleted successfully"})

@auth_required("token")
@roles_required("admin")
@app.route('/category/<int:category_id>/delete/<string:email>',methods = ['POST'])
def delete_category_request(category_id,email):
    email_ = email
    type_of_ = 'delete'
    actionID = category_id
    actionInput = ''
    request_made_check = RequestFromManager.query.filter(RequestFromManager.email == email_, RequestFromManager.type_of == type_of_, RequestFromManager.actionID == actionID).all()
    if len(request_made_check) != 0:
        return jsonify({'message':'request has been already made'}), 200
    else:
        request_made = RequestFromManager(email = email_, type_of = type_of_, actionID = actionID, actionInput=actionInput)
        db.session.add(request_made)
        db.session.commit()
        return jsonify({'message':'Request sent to Admin'}), 200


@auth_required("token")
@roles_required("admin")
@app.route('/category/<int:category_id>/delete',methods = ['POST'])
def approved_delete_action(category_id):
    product_ = Product.query.filter(Product.category_id == category_id ).all()
    for each in product_:
        db.session.delete(each)
        db.session.commit()
    category = Categories.query.filter(Categories.category_id == category_id).all()
    for each in category:
        db.session.delete(each)
        db.session.commit()
    category_from_carts = Cart.query.filter(Cart.category_id == category_id).all()
    for each in category_from_carts:
        db.session.delete(each)
        db.session.commit()    
    InRequestTable = RequestFromManager.query.filter(RequestFromManager.actionID == category_id).all()    
    for each in InRequestTable:
        db.session.delete(each)
        db.session.commit()
    return jsonify({'message':'deleted'}), 200
   

@auth_required("token")
@roles_required("manager")
@app.route('/Request_create_category/<string:userEmail>',methods=['POST'])
def make_create_category_request(userEmail):
    data = request.get_json()
    cat_name = data.get('category_name')
    category_records = Categories.query.all()
    for category in category_records:
        if category.category_name == cat_name:
            return jsonify({"message":"Name already exists, try different name"}), 400
    email_ = userEmail
    type_of_ = 'add'
    actionID = None
    actionInput = cat_name
    request_made_check = RequestFromManager.query.filter(RequestFromManager.email == email_, RequestFromManager.type_of == type_of_, RequestFromManager.actionID == actionID,RequestFromManager.actionInput==actionInput).all()
    if len(request_made_check) != 0:
        return jsonify({'message':'request has been already made'}), 200
    else:
        request_made = RequestFromManager(email = email_, type_of = type_of_, actionID = actionID, actionInput=actionInput)
        db.session.add(request_made)
        db.session.commit()
        return jsonify({'message':'Request sent to Admin'}), 200

@auth_required("token")
@roles_required("admin")
@app.route('/create_category_approve', methods=['POST'])
def approve_add_category():
    data = request.get_json()
    new_cat_name = data.get('category_name')
    category_records = Categories.query.all()
    for category in category_records:
        if category.category_name == new_cat_name:
            return jsonify({"message":"Name already exists, try different name"}), 400
        
    cat_record = Categories(category_name = new_cat_name)
    db.session.add(cat_record)
    db.session.commit()

    InRequestTable = RequestFromManager.query.filter(RequestFromManager.actionInput == new_cat_name).all()    
    for each in InRequestTable:
        db.session.delete(each)
        db.session.commit()

    return jsonify({"message":"category created successfully"})

@auth_required("token")
@roles_required("admin")
@app.route('/create_category', methods = ['POST'])
def create_category():
    data = request.get_json()
    cat_name = data.get('category_name')
    category_records = Categories.query.all()
    for category in category_records:
        if category.category_name == cat_name:
            return jsonify({"message":"Name already exists, try different name"}), 400
        
    cat_record = Categories(category_name = cat_name)
    db.session.add(cat_record)
    db.session.commit()
    category_records = Categories.query.all()
    return jsonify({"message":"category created successfully"})

@auth_required("token")
@roles_required("manager")
@app.route('/add_product/<int:category_id>', methods = ['POST'])
def add_products(category_id):
    category_id_ = category_id
    category_records = Categories.query.filter(Categories.category_id == category_id_).all()
    category_name = category_records[0].category_name
    data = request.get_json()
    product_name = data.get("product_name")
    man_date = data.get("manufacture_date")
    exp_date = data.get("expiry_date")
    unit = data.get("unit")
    rate = data.get('rate')
    quantity = data.get("quantity")
    product_records = Product.query.filter(Product.category_id == category_id_).all()
    for products in product_records:
        if products.product_name == product_name:
            return jsonify({"message":"Name already exists, try different name"}), 400
    product_record = Product(product_name = product_name,manufacture_date = man_date,expiry_date = exp_date,unit = unit,rate = rate ,category_id = category_id_, quantity = quantity)
    db.session.add(product_record)
    db.session.commit()
    product_records_ = Product.query.filter(Product.category_id == category_id_).all()
    return jsonify({"message":"category created successfully"})


@app.get('/fetch_product_record/<int:product_id>')
def giving_product_record(product_id):
    product_records = Product.query.filter(Product.product_id == product_id).all()
    if len(product_records) == 0:
        return jsonify({"message":"No product found"})
    else:
        prod = dict()
        prod['product_id'] = product_records[0].product_id,
        prod['product_name'] = product_records[0].product_name,
        prod['manufacture_date'] = product_records[0].manufacture_date,
        prod['expiry_date'] = product_records[0].expiry_date,
        prod['unit'] = product_records[0].unit,
        prod['rate'] = product_records[0].rate,
        prod['category_id'] = product_records[0].category_id,
        prod['quantity'] = product_records[0].quantity
        return jsonify(prod)

@auth_required("token")
@roles_required("manager")
@app.route('/edit_product/<int:product_id>', methods = ['POST'])
def edit_product(product_id):
        product_info = Product.query.filter(Product.product_id == product_id).one()
        category_id = product_info.category_id
        data = request.get_json()
        if data.get('product_name') != None:
            product_info.product_name = data.get("product_name")
        if data.get('manufacture_date') != None:
            product_info.manufacture_date = data.get('manufacture_date')
        if data.get('expiry_date') != None:
            product_info.expiry_date = data.get('expiry_date')
        if data.get('unit') != None:
            product_info.unit = data.get('unit')
        if data.get('rate') != None:   
            product_info.rate = data.get('rate')
        if data.get('quantity') != None:
            product_info.quantity = data.get('quantity')
        db.session.commit()     
        return jsonify({'message':'updated successfully'})

@auth_required("token")
@roles_required("manager")
@app.route('/request_edit_category/<int:category_id>/<string:user_mail>',methods=['POST'])
def request_edit_category(category_id,user_mail):
    data = request.get_json()
    actionInput = data.get('category_name')
    email = user_mail
    actionID = category_id
    type_of = 'edit'
    request_made_check = RequestFromManager.query.filter(RequestFromManager.email == email, RequestFromManager.type_of == type_of, RequestFromManager.actionID == actionID,RequestFromManager.actionInput==actionInput).all()
    if len(request_made_check) == 0:
        requested_record = RequestFromManager(email = email, type_of = type_of, actionID = actionID, actionInput = actionInput)
        db.session.add(requested_record)
        db.session.commit()
        return jsonify({'message':'request to edit category added perfectly'}), 200
    else:
        return jsonify({'message':'edit request is already there'}), 200

   

   

@auth_required("token")
@roles_required("admin")
@app.route('/edit_category_approve/<int:category_id>',methods=['POST'])
def Edit_Category_Approve(category_id):
    data = request.get_json()
    type_of = 'edit'
    actionInput = data.get('category_name')
    RequestFromManager_record = RequestFromManager.query.filter(RequestFromManager.actionID == category_id, RequestFromManager.type_of == type_of, RequestFromManager.actionInput==actionInput).one()
    category_name = RequestFromManager_record.actionInput
    category_record = Categories.query.filter(Categories.category_id == category_id).one()
    category_record.category_name = category_name
    db.session.commit()

    record = RequestFromManager.query.filter(RequestFromManager.type_of == 'edit', RequestFromManager.actionID == category_id, RequestFromManager.actionInput == actionInput ).all()
    for each in record:
        db.session.delete(each)
        db.session.commit()

    return jsonify({'message':'Category updated successfully'}), 200

@auth_required("token")
@roles_required("admin")
@app.route('/edit_category_from_admin/<int:category_id>', methods = ["POST"])
def edit_category_from_admin(category_id):
    data = request.get_json()
    category_name = data.get('category_name')
    category_record = Categories.query.filter(Categories.category_id == category_id).one()
    category_record.category_name = category_name
    db.session.commit()
    return jsonify({'message':'Category updated successfully'}), 200


@app.get('/get_email')
def get_email():
    return jsonify({'email':current_user.email})

@auth_required("token")
@roles_required("user")
@cache.cached(timeout=10)
@app.route('/dashboard/<string:userEmail>')
def dashboard(userEmail):
    category_records = Categories.query.all()
    if len(category_records) == 0:
        return jsonify({"message":"No category found"})
    else:
        cat = dict()
        for each_cat_instance in category_records:
            cat[each_cat_instance.category_id]=each_cat_instance.category_name
        print(cat)    
        return jsonify(cat)

@auth_required("token")
@roles_required("user")
@app.route('/add_to_cart/<string:user_email>/<int:product_id>', methods = ['POST'])
def add_cart(user_email,product_id):
    print(user_email)
    prod_to_add = Product.query.filter(Product.product_id == product_id).all()
    user_cart = Cart.query.filter(Cart.product_id == product_id , Cart.email == user_email).all()
    print(user_cart)
    if len(user_cart) == 0 and prod_to_add[0].quantity >= 1:
        category_id = prod_to_add[0].category_id
        cart_item = Cart(email = user_email, product_id = product_id, category_id = prod_to_add[0].category_id, quantity_added = 1,product_name = prod_to_add[0].product_name)
        db.session.add(cart_item)
        db.session.commit()
        return jsonify({"message":"added successfully"}), 200
    else:
        category_id = prod_to_add[0].category_id
        return jsonify({"message":"No need to add, it's ok"}), 200

@auth_required("token")
@roles_required("user")
@cache.cached(timeout=10)
@app.route('/see_cart/<string:user_email>')
def see_cart(user_email):
    user_cart = Cart.query.filter(Cart.email == user_email).all()
    if user_cart:
        cart_data = dict()
        for item in user_cart:
            one_cart_item = dict()
            one_cart_item["email"] = item.email
            one_cart_item["product_id"] = item.product_id
            one_cart_item["category_id"] = item.category_id
            one_cart_item["quantity"] = item.quantity_added
            one_cart_item["product_name"] = item.product_name
            cart_data[item.product_id] = one_cart_item
        print(cart_data)    
        return jsonify(cart_data)           
    else:
        return jsonify({"message":"No item in the cart"}), 200

@auth_required("token")
@roles_required("user")
@cache.cached(timeout=10)
@app.route('/see_cart_product/<string:user_email>')
def cart_product(user_email):
    user_cart = Cart.query.filter(Cart.email == user_email).all()
    products = Product.query.all()
    if user_cart:
        product_data = dict()
        for item in user_cart:
            prod_rec = dict()
            for prod in products:
                if item.product_id == prod.product_id:
                    prod_rec["product_id"] = prod.product_id
                    prod_rec["product_name"] = prod.product_name
                    prod_rec["manufacture_date"] = prod.manufacture_date
                    prod_rec["expiry_date"] = prod.expiry_date
                    prod_rec["rate"] = prod.rate
                    prod_rec["unit"] = prod.unit                    
            product_data[item.product_id] = prod_rec
        return jsonify(product_data), 200
    else:
        return jsonify({"message":"No item in the cart"})        


@auth_required("token")
@roles_required("user")
@app.route('/remove_product_from_cart/<string:user_email>/<int:product_id>', methods=['POST'])
def remove_cart_product(user_email,product_id):
    cart_prod = Cart.query.filter(Cart.product_id == product_id, Cart.email == user_email).all()
    if (cart_prod):
        db.session.delete(cart_prod[0])
        db.session.commit()
        return jsonify({'message':'deleted successfully'}), 200     
    return jsonify({'message':'already deleted'}), 200


@auth_required("token")
@roles_required("user")
@app.route('/edit_product_from_cart/<string:user_email>/<int:product_id>', methods=['POST'])
def edit_product_from_cart(user_email,product_id):
    data = request.get_json()
    qnt = data.get('quantity')
    if qnt == 0:
        cart_prod = Cart.query.filter(Cart.product_id == product_id, Cart.email == user_email).first()
        db.session.delete(cart_prod)
        db.session.commit()
        return jsonify({'message':'deleted product from cart because quantity added is zero'}), 200
    else:
        cart_prod = Cart.query.filter(Cart.product_id == product_id, Cart.email == user_email).first()
        cart_prod.quantity_added = qnt
        db.session.commit()
    return jsonify({'message':'quantity updated successfully'}), 200

@auth_required("token")
@roles_required("user")
@app.route('/make_purchase/<string:usermail>',methods = ['GET'])
def making_purchase(usermail):
    cart_items = Cart.query.filter(Cart.email == usermail).all()
    cart_data_dict=dict()

    if len(cart_items) == 0:
        return jsonify({'message':'No Cart item to purchase'})
    else:
        final_dict = dict()
        prod_list = []
        total_amount = 0
        for each in cart_items:
            prod_id = each.product_id
            prod_quant = each.quantity_added
            product_info = Product.query.filter(Product.product_id == prod_id).first()
            if product_info.quantity >= prod_quant:
                prod_rate = product_info.rate
                total_amount += prod_quant*prod_rate
                prod_dict = dict()
                prod_dict['product_name'] = product_info.product_name
                prod_dict['rate'] = product_info.rate
                prod_dict['unit'] = product_info.unit
                prod_dict['quantity']=prod_quant
                prod_dict['subTotal'] = product_info.rate*prod_quant
                prod_list.append(product_info)
                final_dict[product_info.product_name] = prod_dict
            else:
                prod_list.append(product_info)
                prod_rate = product_info.rate
                total_amount += product_info.quantity*prod_rate   
                prod_dict = dict()
                prod_dict['product_name'] = product_info.product_name
                prod_dict['rate'] = product_info.rate
                prod_dict['unit'] = product_info.unit
                prod_dict['quantity']=prod_quant
                prod_dict['subTotal'] = product_info.quantity*prod_quant
                prod_list.append(product_info)
                final_dict[product_info.product_name] = prod_dict
        final_dict['grandTotal'] = total_amount   
        print(final_dict)                      
        return jsonify(final_dict) ,200   

@auth_required("token")
@roles_required("user")
@app.route('/payment/<string:username>',methods = ['GET'])
def final_payment(username):
    cart_items = Cart.query.filter(Cart.email == username).all()
    prod_list = []
    for each in cart_items:
            prod_id = each.product_id
            cat_id = each.category_id
            prod_quant = each.quantity_added
            prod_name = each.product_name
            product_info = Product.query.filter(Product.product_id == prod_id).first()
            if product_info.quantity - prod_quant >= 0:
                product_info.quantity = product_info.quantity - prod_quant
                db.session.commit()
                purchased_item = Purchased.query.filter(Purchased.product_id == prod_id, Purchased.email == username).all()
                if len(purchased_item) != 0:
                    purchased_item[0].quantity_added += prod_quant
                    db.session.commit()
                else:
                    add_purchased_item = Purchased(email = username, product_id = prod_id,category_id = cat_id,quantity_added = prod_quant,product_name = prod_name)
                    db.session.add(add_purchased_item)    
                    db.session.commit()
                db.session.delete(each)
                db.session.commit()
                full_cart = Cart.query.filter(Cart.product_id == prod_id).all()
                for row in full_cart:
                    product_ = Product.query.filter(Product.product_id == prod_id).first()
                    if row.quantity_added > product_.quantity:
                        row.quantity_added = product_.quantity
                        db.session.commit()
                    else:
                        continue    
            else:
                product_info.quantity = 0
                db.session.commit()
                purchased_item = Purchased.query.filter(Purchased.product_id == prod_id, Purchased.email == username).all()
                if len(purchased_item) != 0:
                    purchased_item[0].quantity_added += prod_quant
                    db.session.commit()
                else:
                    add_purchased_item = Purchased(email = username, product_id = prod_id,category_id = cat_id,quantity_added = product_info.quantity,product_name = prod_name)
                    db.session.add(add_purchased_item)    
                    db.session.commit()
                db.session.delete(each)
                db.session.commit()
    return jsonify({'message':'Payment successfull'}), 200    


@app.get('/all_requests')
def give_all_requests():
    final_req_dict = dict()
    reqs = RequestFromManager.query.all()
    for req in reqs:
        req_dict = dict()
        req_dict["email"] = req.email
        req_dict['type_of'] = req.type_of
        req_dict['actionID'] = req.actionID
        req_dict['actionInput'] = req.actionInput
        final_req_dict[req.id] = req_dict
    return jsonify(final_req_dict), 200
    

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        user.is_login = True
        db.session.commit()
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400

user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}

@app.post('/logout_')
def logout_():

    data = request.get_json()
    email = data.get('email')
    user = datastore.find_user(email=email)

    user.is_login = False
    user.logout_time = datetime.utcnow()
    db.session.commit()
    return jsonify({"message":"logged out successfully"}), 200



from werkzeug.security import generate_password_hash

@app.post('/do_registration')
def registration():
  
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400
    
    user = datastore.find_user(email=email)

    if user:
        return jsonify({"message": "User Already Found, Please try login"}), 404

    else:
        role = data.get('role_')
        print(role)
        if role == 'manager':
            datastore.create_user(email=email, password=generate_password_hash(data.get('password')), roles=["manager"], active=False, logout_time = datetime.utcnow(), is_login = True)
            db.session.commit()
        elif role == 'user':
            datastore.create_user(email=email, password=generate_password_hash(data.get('password')), roles=["user"],logout_time = datetime.utcnow(), is_login = False)
            db.session.commit()

    return jsonify({'message':"registered successfully"}), 200


@auth_required("token")
@roles_required("user")
@app.get('/search')
def search():
    q = request.args.get("term",'')
    if q:
        results = Product.query.join(Categories).filter(Product.product_name.icontains(q) | Product.rate.icontains(q) | Product.manufacture_date.icontains(q) | Product.expiry_date.icontains(q) | Categories.category_name.icontains(q)).limit(100).all()
        ress = dict()
        for result in results:
            prod_dict = dict()
            prod_dict['product_name'] = result.product_name
            prod_dict['manufacture_date'] = result.manufacture_date
            prod_dict['expiry_date'] = result.expiry_date
            prod_dict['rate'] = result.rate
            prod_dict['unit'] = result.unit
            prod_dict['quantity']=result.quantity

            ress[result.product_id] = prod_dict
        return jsonify(ress)    
    else:
        results = []
        return jsonify({'message':"Nothing is matched"})



@app.get('/download-csv')
def download_csv():
    task = generate_csv.delay()
    return jsonify({"task-id":task.id})
    

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({'message':'task pending'}), 404

