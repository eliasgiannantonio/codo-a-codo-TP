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
            codigo INTERGER PRIMARY KEY,
            descripcion TEXT NOT NULL,
            cantidad INTERGER NOT NULL,
            precio REAL NOT NULL
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
"""
#---------------------------------------------------------------------
#------              Productos
#--------------------------------------------------------

class Producto:
    # Definimos el const e inicializamos los atrib de instancia
    def __init__(self, codigo, descripcion, cantidad, precio):
        self.codigo = codigo
        self.descripcion = descripcion
        self.cantidad = cantidad            # cant disp en stock
        self.precio = precio
    
    def modificar(self, nueva_descripcion, nueva_cantidad, nuevo_precio):
        self.description = nueva_descripcion    #modif descripcion
        self.cantidad = nueva_cantidad          #modif cantidad
        self.precio = nuevo_precio    #modif precio

## Inventario // Clase
class Inventario:
    def __init__(self):
        self.conexion = get_db_connection()
        self.cursor = self.conexion.cursor()
    
    #Corroborar si no crashea con la adicion del __del__ que es para cerrar automáticamente
    # el cursor y la conexión a la base de datos, para asegurarse de que se liberan los recursos adecuadamente.
    def __del__(self):
        self.cursor.close()
        self.conexion.close()
        print("Conexion closed.")

    def agregar_producto(self, codigo, descripcion, cantidad, precio):
            producto_existente = self.consultar_producto(codigo)
            if producto_existente:
                return jsonify({'message': 'Ya existe un producto con ese codigo.'}), 400
            nuevo_producto = Producto(codigo, descripcion, cantidad, precio)
            sql = f'INSERT INTO productos VALUES ({codigo}, "{descripcion}", {cantidad}, {precio});'
            self.cursor.execute(sql)
            self.conexion.commit()
            return jsonify({'message': 'Producto agregado correctamente'}), 200

    def consultar_producto(self, codigo):
        sql = f'SELECT * FROM productos WHERE codigo = {codigo};'
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            codigo, descripcion, cantidad, precio = row
            return Producto(codigo, descripcion, cantidad, precio)
        return None
    # TODO: evitar la creación innecesaria de múltiples instancias 'Producto' con los mismos datos.
    # ya que Cada instancia de Producto es un objeto en la memoria de Python aunque no afecta directamente los datos almacenados en la base de datos.

    def modificar_producto(self, codigo, nueva_descripcion, nueva_cantidad, nuevo_precio):
        producto = self.consultar_producto(codigo)
        if producto:
            producto.modificar(nueva_descripcion, nueva_cantidad, nuevo_precio)
            sql = f'UPDATE productos SET descripcion = "{nueva_descripcion}", cantidad = {nueva_cantidad}, precio = {nuevo_precio} WHERE codigo = {codigo};'
            self.cursor.execute(sql)
            self.conexion.commit()
            return jsonify({'message': 'Producto modificado correctamente.'}), 200
        return jsonify({'message': 'Producto no encontrado.'}), 404

    def eliminar_producto(self, codigo):
        sql = f'DELETE FROM productos WHERE codigo = {codigo};'
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
            codigo, descripcion, cantidad, precio = row
            producto = {'codigo': codigo, 'descripcion': descripcion, 'cantidad': cantidad, 'precio': precio}
            productos.append(producto)
        return jsonify(productos), 200            


# Carrito // clase
class Carrito:
    def __init__(self):
        self.conexion = sqlite3.connect(DATABASE)
        self.cursor = self.conexion.cursor()
        self.items = []
    
    def agregar(self, codigo, cantidad, inventario):
        producto = inventario.consultar_producto(codigo)
        if producto is None:
           return jsonify({'message': 'El producto no existe.'}), 404
        if producto.cantidad < cantidad:
           return jsonify({'message': 'Cantidad en stock insuficiente.'}), 400
        
        for item in self.items:
            if item.codigo == codigo:
                item.cantidad += cantidad
                sql = f'UPDATE productos SET cantidad = cantidad - {cantidad} WHERE codigo = {codigo};'
                self.cursor.execute(sql)
                self.conexion.commit()
                return jsonify({'message': 'Producto agregado al carrito correctamente.'}), 200
                
            
        nuevo_item = Producto(codigo, producto.descripcion, cantidad, producto.precio)
        self.items.append(nuevo_item)
        sql = f'UPDATE productos SET cantidad = cantidad - {cantidad} WHERE codigo = {codigo}'
        self.cursor.execute(sql)
        self.conexion.commit()
        return jsonify({'message': 'Producto agregado al carrito correctamente.'}), 200
    
    #ORIGINALMENTE ESTABA el parametro 'inventario' que luego fue eliminado
    def quitar(self, codigo, cantidad, inventario):
        for item in self.items:
            if item.codigo == codigo:
                if cantidad > item.cantidad:
                    return jsonify({'message': 'La cantidad a quitar es mayor a la cantidad en el carrito.'}), 400
                item.cantidad -= cantidad
                if item.cantidad == 0:
                    self.items.remove(item)
                sql = f'UPDATE productos SET cantidad = cantidad + {cantidad} WHERE codigo = {codigo};'
                self.cursor.execute(sql)
                self.conexion.commit()
                return jsonify({'message': 'Producto eliminado del carrito correctamente.'}), 200
            return jsonify({'message': 'El producto no se encuentra en el carrito.'}), 404

    def mostrar(self):
        productos_carrito = []
        for item in self.items:
            producto = {'codigo': item.codigo, 'descripcion': item.descripcion, 'cantidad': item.cantidad, 'precio': item.precio}
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
@app.route('/productos/<int:codigo>', methods=['GET'])
def obtener_producto(codigo):
    producto = inventario.consultar_producto(codigo)
    if producto:
        return jsonify({
            'codigo': producto.codigo,
            'descripcion': producto.descripcion,
            'cantidad': producto.cantidad,
            'precio': producto.precio
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
    codigo = request.json.get('codigo')
    descripcion = request.json.get('descripcion')
    cantidad = request.json.get('cantidad')
    precio = request.json.get('precio')
    return inventario.agregar_producto(codigo, descripcion, cantidad, precio)

#Ruta para modificar el producto del inventario
@app.route('/productos/<int:codigo>', methods=['PUT'])
def modificar_producto(codigo):
    nueva_descripcion = request.json.get('descripcion')
    nueva_cantidad = request.json.get('cantidad')
    nuevo_precio = request.json.get('precio')
    return inventario.modificar_producto(codigo, nueva_descripcion, nueva_cantidad, nuevo_precio)

#Ruta para eliminar un procducto del inventario
@app.route('/productos/<int:codigo>', methods=['DELETE'])
def eliminar_producto(codigo):
    return inventario.eliminar_producto(codigo)

#Ruta para agregar un producto al CARRITO
@app.route('/carrito', methods=['POST'])
def agregar_carrito():
    codigo = request.json.get('codigo')
    cantidad = request.json.get('cantidad')
    inventario = Inventario()
    return carrito.agregar(codigo, cantidad, inventario)

# Ruta para quitar un producto del carrito
@app.route('/carrito', methods=['DELETE'])
def quitar_carrito():
    codigo = request.json.get('codigo')
    cantidad = request.json.get('cantidad')
    inventario = Inventario()
    return carrito.quitar(codigo, cantidad, inventario)

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
