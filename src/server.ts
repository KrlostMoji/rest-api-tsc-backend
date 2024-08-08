import express from 'express';
import router from './router';
import db from './config/db';
import colors from 'colors';
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import SwaggerUi from 'swagger-ui-express';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';

//Conectar a base de datos
async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    //console.log(colors.magenta.bold('Conexión a la BD'));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold('Hubo un error al conectar a la base de datos.'));
  }
}

connectDB();

//Instanciamos express
const server = express();

//Permitir conexión cruzada
const corsOptions: CorsOptions = {
  origin: function(origin, callback){
    if(origin===process.env.FRONTEND_URL){
      //Permitimos la conexión
      callback(null, true) 
    }else{
      //Conexión negada
      callback(new Error('Error de CORS'))
      
    }
      
  }
}

//Usar cors en el servidor
server.use(cors(corsOptions))

//Leer datos de formularios
server.use(express.json());

server.use(morgan('dev'))

server.use('/api/products', router);

server.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerSpec, swaggerUiOptions));

server.get('/api', (req, res)=>{
  res.json({msg: 'Desde api'})
})

export default server;
