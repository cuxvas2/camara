let camara_boton = document.querySelector("#iniciar-camara");
let video = document.querySelector("#video");
let clic_boton = document.querySelector("#clic-foto");
let canvas = document.querySelector("#canvas");
let dataurl_container = document.querySelector("#dataurl-container");
let dataurl = document.querySelector("#dataurl");
let azure_boton = document.querySelector("#clic-azure");
let img_azure = document.querySelector("#imgazure");
let img_azureurl = document.querySelector("#imgazure_url");

camara_boton.addEventListener('click', async function (){
    let strem = null;

    try{
        strem = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    }
    catch (error){
        alert(error.message);
        return;
    }

    video.srcObject = strem;

    video.style.display = 'block';
    camara_boton.style.display = 'none';
    clic_boton.style.display = 'block';
});

clic_boton.addEventListener('click', function (){
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let image_data_url = canvas.toDataURL('image/jpeg');

    dataurl.value = image_data_url;
    dataurl_container.style.display = 'block';
});

azure_boton.addEventListener('click', function () {
    //Convertimos a binario
    canvas.toBlob(uploadFile, 'image/jpeg');
});

//funcion async para la operacion de subida
async function uploadFile(blob){
    //Lo vamos a guardar como JPRG
    let file = null;
    let fileName = `azure${Date.now()}.jpg`; //Se puede cambiar el nombre al gusto
    //URL de la WebAPI
    const urlAzure = 'https://victorwebapifoto.azurewebsites.net';
    const urlFotoAzure = urlAzure + '/api/foto/'

    file = new File([blob], fileName, { type: 'image/jpeg' });

    //Los nombres justo como los pide el WebAPI
    let data = new FormData();
    data.append('nombre', fileName);
    data.append('archivo', file);

    //Llamamos al servicio web con POST
    let response = await fetch(urlFotoAzure, {
        method: 'POST',
        body: data
    });

    if(response.status == 201){
        const datos = await response.json(); //Obtenemos la respuesta del servidor Azure
        img_azure.setAttribute("src", datos.url);
        img_azure.setAttribute("width", 320);
        img_azure.setAttribute("height", 240);
        img_azureurl.innerHTML = datos.url;
    }else{
        alert('Ocurrió un error al intentar subir la imagen: ' + response.statusText);
    }
}