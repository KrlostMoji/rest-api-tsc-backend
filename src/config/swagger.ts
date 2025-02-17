import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
  swaggerDefinition:{
    openapi: '3.0.2',
    tags: [{
      name: 'Products',
      description: 'API Operations related to products'
    }],
    info: {
      title: 'Rest API Node.js / Express / TypeScript',
      version: '1.0.0',
      description: 'API Docs for products'
    }
  },
  apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions : SwaggerUiOptions = {
  customCss : `
    .topbar-wrapper .link{
      content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
      height: 120px;
      weight: auto;
    }
    .swagger-ui .topbar{
      background-color: #2b3b45;
    }
  `,
  customSiteTitle: 'Documentación REST API Express/Typescript'
}

export default swaggerSpec
export {
  swaggerUiOptions
}