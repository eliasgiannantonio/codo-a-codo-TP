12/4
	HEADER: Se soluciono el problema del NAVBAR que movia el resto de los elementos cuando se aplicaba el :hover sobre otro elemento de la lista.
		-se oculto la navbar para @mediaquery (max-width: 600px) con el objetivo de hacer un menu responsible para mobile.
		-queda pendiente terminar de hacer responsive la navbar.
	
	MAIN: Se soluciono el problema del main--section--container: se creo un nuevo grid-template-area y se puso estilos nuevamente (quedan pulir detalles)
		se corrigio el problema para pantallas mobile cambiandolo a display: flex y ahora es responsive}
		se ajustaron elementos del main--section--container para que quedaran bien en version de menos de 600px.
		quedan pulir detalles


---------------------------------------
11/4
NOTAS: 
	LOS COLORES DE LAS FUENTES Y BACKGROUND ESTAN PUESTOS COMO "VARIABLES" EN EL ROOT 
	estan comentadas todas las secciones trabajadas y separadas por clases.
	algunas cosas a modificar o que dan error estan comentadas tmb

header
	-El logo no es el definitivo, por lo que no estan bien posicionado y tampoco me preocupe mucho. 
		Si se consigue un logo mejor, cambiarlo y posicionarlo.

	//-En el NAVBAR los items cuando aplicas el efecto :hover con el raton, cambian de posicion y deberian estar estaticos.
	
	SOLUCIONADO: se soluciono agregandole un width especifico a cada elemento:  .nav__btn  // 

	-El header / navbar / login-shopping cart : no son responsive.

main  
	
	- el grid de main--section no es responsive y tuve problemas alineando los elementos de   top--main--section    y    botton--main--section

	- el div carousel--main--section    tiene 3 imagenes superpuestas. La idea es terminar de hacer un carousel con animacion tipo slide pero 
	que ademas tenga botones de IZQ y DER para pasar imagenes.

	-me falta terminar de agregar una 4ta seccion donde haya un grid con items/zapatillas con sus precios y links al shop.

	// - hay un problema con los @mediaquery cuando intente aplicar border-radius a los elementos del div del formulario para que tuvieran borde redondeado
	y no se aplica el efecto.   SOLUCIONADO //

	