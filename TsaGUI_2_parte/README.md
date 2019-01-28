# TsaGUI + Remix

### Descripción
TsaGUI es una interfaz gráfica que permite interactuar con un smart contract (incluido en la carpeta lib/ProofOfExistence.sol) deployado preferentemente en el IDE REMIX.
Se recomienda utilizar Metamask para aprobar las transacciones.
    
### Utilización
- Stamp
    - En la pantalla principal hay un textarea que permite arrastrar un archivo, el cual es convertido a un hash sha256 y luego enviado al smart contract
    - Respuesta:
        -  Debajo del textarea para arrastrar el archivo, aparecerá un recuadro que mostrará un texto con los datos del hash y el recibo temporal digital enviado por el smart contract
        
    - Ejemplo de la respuesta:
		Nombre del archivo: Comprobante_Baja_Producto60686242.pdf

		Hash del archivo: 65193341f21aec7ef11cc79b712fa4187c56e1ff4df37d7ae50eb7c726800f38

		OTS Temporal: debc965bbf365e00f69c05295737efd91a5caade4e7838cbdbb4031a789819ed
- Verify
    - Debajo del recuadro del stamp, hay un textarea que permite verificar el archivo previamente impactado en el smart contact, indicando el texto devuelo en el stamp y luego haciendo click en el botón "Verify"
    - Ejemplo de la respuesta:
        -   El archivo original y su comprobante temporal son válidos y existen en la blockchain !
    
### Inicialización

- Se debe deployar el contrato en el IDE REMIX
- Reemplazar la dirección y el ABI del contrato en el archivo index.js