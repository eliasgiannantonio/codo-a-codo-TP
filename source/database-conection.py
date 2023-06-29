import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS                 # flask_CORS fue instalado directamente en pythonanywhere


DATABASE = "inventario.db"
# Configurar la conexión a la base de datos SQLite
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

#CREAR la tabla 'productos' si no existe
def create_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            style TEXT NOT NULL,
            price REAL NOT NULL,
            itemsLeft INTEGER NOT NULL,
            img TEXT NOT NULL,
            description TEXT
        )''')
    conn.commit()
    cursor.close()
    conn.close()

# verificar si la base de datos existe, si no, crearla y crear la tabla
def create_database():
    conn = sqlite3.connect(DATABASE)
    create_table()
    conn.close()

#CREAMOS BASE DE DATOS Y LA TABLA SI NO EXISTEN
create_database()
######################## Creacion de clases Producto, Inventario y Carrito

#---------------------------------------------------------------------
#------              Productos
#--------------------------------------------------------

class Producto:
    # Definimos el const e inicializamos los atrib de instancia
    def __init__(self, id, name, brand, style, price, itemsLeft, img, description):
        self.id = id
        self.name = name
        self.brand = brand           
        self.style = style
        self.price = price
        self.itemsLeft = itemsLeft
        self.img = img
        self.description = description
    
    def modificar(self, new_name, new_brand, new_style, new_price, new_itemsLeft, new_img, new_description):
        self.name = new_name    
        self.brand = new_brand         
        self.price = new_price    
        self.style = new_style    
        self.itemsLeft = new_itemsLeft    
        self.img = new_img    
        self.description = new_description    

#===============================================================================
##          Inventario // Clase
#=======================================================================

class Inventario:
    def __init__(self):
        self.conexion = get_db_connection()
        self.cursor = self.conexion.cursor()
    
    #Corroborar si no crashea con la adicion del __del__ que es para cerrar automáticamente
    # el cursor y la conexión a la base de datos, para asegurarse de que se liberan los recursos adecuadamente.
    def __del__(self):
        self.cursor.close()
        self.conexion.close()

    def agregar_producto(self, id, name, brand, style, price, itemsLeft, img, description):
            producto_existente = self.consultar_producto(id)
            if producto_existente:
                return jsonify({'message': 'Ya existe un producto con ese codigo.'}), 400
            nuevo_producto = Producto(id, name, brand, style, price, itemsLeft, img, description)
            sql = f'INSERT INTO productos VALUES ({id}, "{name}", "{brand}", "{style}", {price}, {itemsLeft}, "{img}", "{description}");'
            self.cursor.execute(sql)
            self.conexion.commit()
            return jsonify({'message': 'Producto agregado correctamente'}), 200

    def consultar_producto(self, id):
        sql = f'SELECT * FROM productos WHERE id = {id};'
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            id, name, brand, style, price, itemsLeft, img, description = row
            return Producto(id, name, brand, style, price, itemsLeft, img, description)
        return None
    # TODO: evitar la creación innecesaria de múltiples instancias 'Producto' con los mismos datos.
    # ya que Cada instancia de Producto es un objeto en la memoria de Python aunque no afecta directamente los datos almacenados en la base de datos.

    def modificar_producto(self, id, new_name, new_brand, new_style, new_price, new_itemsLeft, new_img, new_description):
        producto = self.consultar_producto(id)
        if producto:
            producto.modificar(new_name, new_brand, new_style, new_price, new_itemsLeft, new_img, new_description)
            sql = f'UPDATE productos SET name = "{new_name}", brand = "{new_brand}", style = "{new_style}", price = {new_price}, itemsLeft = {new_itemsLeft}, img = "{new_img}", description = "{new_description}" WHERE id = {id};'
            self.cursor.execute(sql)
            self.conexion.commit()
            return jsonify({'message': 'Producto modificado correctamente.'}), 200
        return jsonify({'message': 'Producto no encontrado.'}), 404

    def eliminar_producto(self, id):
        sql = f'DELETE FROM productos WHERE id = {id};'
        self.cursor.execute(sql)
        if self.cursor.rowcount > 0:
            self.conexion.commit()
            return jsonify({'message': ' Producto eliminado correctamente.'}), 200
        return jsonify({'message': 'Producto no encontrado.'}), 404
        

    def listar_productos(self):
        self.cursor.execute("SELECT * FROM productos")
        rows = self.cursor.fetchall()
        productos = []                  #crea diccionario producto con valores extraidos y los agrega a la lista productos
        for row in rows:
            id, name, brand, style, price, itemsLeft, img, description = row
            producto = {'id': id, 'name': name,'brand': brand, 'style': style, 'price': price, 'itemsLeft': itemsLeft, 'img': img, 'description': description}
            productos.append(producto)
        return jsonify(productos), 200            

#===============================================================================
##          Carrito // clase
#=======================================================================

class Carrito:
    def __init__(self):
        self.conexion = sqlite3.connect(DATABASE)
        self.cursor = self.conexion.cursor()
        self.items = []
    
    def agregar(self, id, itemsLeft, inventario):
        producto = inventario.consultar_producto(id)
        if producto is None:
           return jsonify({'message': 'El producto no existe.'}), 404
        if producto.itemsLeft < itemsLeft:
           return jsonify({'message': 'Cantidad en stock insuficiente.'}), 400
        
        for item in self.items:
            if item.id == id:
                item.itemsLeft += itemsLeft
                sql = f'UPDATE productos SET itemsLeft = itemsLeft - {itemsLeft} WHERE id = {id};'
                self.cursor.execute(sql)
                self.conexion.commit()
                return jsonify({'message': 'Producto agregado al carrito correctamente.'}), 200
                
            
        nuevo_item = Producto(id, producto.name, producto.brand, producto.style, producto.price, itemsLeft, producto.img,  producto.description)
        self.items.append(nuevo_item)
        sql = f'UPDATE productos SET itemsLeft = itemsLeft - {itemsLeft} WHERE id = {id}'
        self.cursor.execute(sql)
        self.conexion.commit()
        return jsonify({'message': 'Producto agregado al carrito correctamente.'}), 200
    
    #ORIGINALMENTE ESTABA el parametro 'inventario' que luego fue eliminado
    def quitar(self, id, itemsLeft, inventario):
        for item in self.items:
            if item.id == id:
                if itemsLeft > item.itemsLeft:
                    return jsonify({'message': 'La cantidad a quitar es mayor a la cantidad en el carrito.'}), 400
                item.itemsLeft -= itemsLeft
                if item.itemsLeft == 0:
                    self.items.remove(item)
                sql = f'UPDATE productos SET itemsLeft = itemsLeft + {itemsLeft} WHERE id = {id};'
                self.cursor.execute(sql)
                self.conexion.commit()
                return jsonify({'message': 'Producto eliminado del carrito correctamente.'}), 200
            return jsonify({'message': 'El producto no se encuentra en el carrito.'}), 404

    def mostrar(self):
        productos_carrito = []
        for item in self.items:
            producto = {'id': item.id, 'name': item.name, 'brand': item.brand, 'style': item.style, 'price': item.price, 'itemsLeft': item.itemsLeft, 'img': item.img, 'description': item.description}
            productos_carrito.append(producto)
        return jsonify(productos_carrito), 200

#------------------------------------------------------------------------
#------            CREACION APP flask // decoradores //  y crear objetos carrito e inventario
#----------------------------------------------------------------

app = Flask(__name__)
CORS(app)


carrito = Carrito() # Instanciamos un carrito
inventario = Inventario() # Instanciamos un inventario


#Ruta para obtener los datos de un producto segun su codigo
@app.route('/productos/<int:id>', methods=['GET'])
def obtener_producto(id):
    producto = inventario.consultar_producto(id)
    if producto:
        return jsonify({
            'id': producto.id,
            'name': producto.name,
            'brand': producto.brand,
            'style': producto.style,
            'price': producto.price,
            'itemsLeft': producto.itemsLeft,
            'img': producto.img,
            'description': producto.description
        }), 200
    return jsonify({'message': 'Producto no encontrado.'}), 404

#Ruta para mostrar el index de la pagina principal de la API
@app.route('/')
def index():
    return 'Api del Inventario'

#Ruta para obtener la lista de productos del inventario
@app.route('/productos', methods=['GET'])
def obtener_productos():
    return inventario.listar_productos()

#Ruta para agregar un producto al inventario
@app.route('/productos', methods=['POST'])
def agregar_producto():
    id = request.json.get('id')
    name = request.json.get('name')
    brand = request.json.get('brand')
    style = request.json.get('style')
    price = request.json.get('price')
    itemsLeft = request.json.get('itemsLeft')
    img = request.json.get('img')
    description = request.json.get('description')
    return inventario.agregar_producto(id, name, brand, style, price, itemsLeft, img, description)

#Ruta para modificar el producto del inventario
@app.route('/productos/<int:id>', methods=['PUT'])
def modificar_producto(id):
    new_name   = request.json.get('name')           #obtiene el valor del campo name
    new_brand = request.json.get('brand')
    new_style = request.json.get('style')
    new_price = request.json.get('price')
    new_itemsLeft = request.json.get('itemsLeft')
    new_img = request.json.get('img')
    new_description = request.json.get('description')
    return inventario.modificar_producto(id, new_name, new_brand, new_style, new_price, new_itemsLeft, new_img, new_description)

#Ruta para eliminar un procducto del inventario
@app.route('/productos/<int:id>', methods=['DELETE'])
def eliminar_producto(id):
    return inventario.eliminar_producto(id)

#Ruta para agregar un producto al CARRITO
@app.route('/carrito', methods=['POST'])
def agregar_carrito():
    id = request.json.get('id')
    itemsLeft = request.json.get('itemsLeft')
    inventario = Inventario()
    return carrito.agregar(id, itemsLeft, inventario)

# Ruta para quitar un producto del carrito
@app.route('/carrito', methods=['DELETE'])
def quitar_carrito():
    id = request.json.get('id')
    itemsLeft = request.json.get('itemsLeft')
    inventario = Inventario()
    return carrito.quitar(id, itemsLeft, inventario)

#Ruta para obtener el contenido del carrito
@app.route('/carrito', methods=['GET'])
def obtener_carrito():
    return carrito.mostrar()

#=======================================================
#       Iniciando el servidor de Flask
#========================================================   
# Finalmente, si estamos ejecutando este archivo, lanzamos app.
if __name__ == '__main__':      # asegura que el servidor solo se ejecute si el archivo se ejecuta directamente (no cuando se importa como módulo)
    app.run()

