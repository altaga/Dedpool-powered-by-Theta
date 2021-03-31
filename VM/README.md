# Theta Blockchain Ledger Protocol

Para poder instalar la ledger de Theta, tuvimos que realizar una maquina virtual x84.

Toda la instalacion se realizo mediante un contenedor de Docker, debido a su facilidad de exportabilidad e instalacion.

Para poder instalar el contenedor y correrlo adecuadamente tenemos que instalar Docker en la computadora que va a ser utilizada y una vez instalador correr los siguientes comandos.

    docker build -t Theta_Ledger .
    docker run Theta_Ledger

Todos los detalles de el contenedor estan en el Dockerfile