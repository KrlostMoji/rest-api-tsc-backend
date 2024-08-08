import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {

  it('Should display validation errors', async()=>{
    const response = await request(server).post('/api/products').send()

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(3)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(4)

  })

  it('Should validate price are greater than 0', async()=>{
    const response = await request(server).post('/api/products').send({
      name: 'Monitor Plano de 23 pulgadas',
      price: 0
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toHaveLength(1)

    expect(response.status).not.toBe(404)
    expect(response.body.errors).not.toHaveLength(2)

  })

  it('Should validate price to be a number', async()=>{
    const response = await request(server).post('/api/products').send({
      name: 'Monitor Plano de 23 pulgadas',
      price: 'Hola'
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')  
    expect(response.body.errors[0].msg).toBe('Se esperaba un valor numérico mayor a 0')

    expect(response.status).not.toBe(200)
    expect(response.body.errors).not.toHaveLength(2)

  })

  it('Should create a new product', async()=>{
    const response = await request(server).post('/api/products').send({
      name: 'Mouse Scroll - Testing',
      price: 350
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('error')

  })
})

describe('GET /api/products', ()=> {
  it('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products')
    expect(response.status).not.toBe(404)
  })
  
  it('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveLength(1)

    
    expect(response.body).not.toHaveProperty('errors')
  })
})

describe('GET /api/products/:id', ()=> {
  it('Should return a 404 response for a non-existent product', async()=>{
    const productId = 100
    const response = await request(server).get(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe(`El id:${productId} no generó ninguna respuesta`)

  })

  it('Should check a valid ID in the URL', async()=>{
    const response = await request(server).get('/api/products/not-valid-url')

    expect(response.status).toBe(404)
    expect(response.body).toHaveProperty('error')
    expect(response.body.error).toBe('URL No válido')
  })

  it('get a JSON response for a single product', async()=>{
    const response = await request(server).get('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
  })

})

describe('PUT /api/products/:id', ()=>{
  it('Should display validation error messages when updating a product', async()=>{
    const response = await request(server).put('/api/products/1').send({})

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(4)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')

  })

  it('Should return a 400 response for a non-existent product', async()=>{
    const productId = 500
    const response = await request(server).put(`/api/products/${productId}`).send({
      name: "Monitor Curvo 42 pulgadas",
      price: 300,
      available: true
    })

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(`El id:${productId} no generó ninguna respuesta`)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')

  })

  it('Should update an existing product with a valid data', async()=>{
    const response = await request(server).put('/api/products/1').send({
      name: "Monitor Curvo 42 pulgadas",
      price: 300,
      available: true
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')

    expect(response.status).not.toBe(404)
    expect(response.body).not.toHaveProperty('errors')

  })


  it('Should validate the URL', async()=>{
    const response = await request(server).put('/api/products/not-valid-url').send({
      name: "Monitor Curvo 42 pulgadas",
      price: 200,
      available: true
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Id no válido')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')

  })

  it('Should validate that the price is greater than 0', async()=>{
    const response = await request(server).put('/api/products/1').send({
      name: "Monitor Curvo 42 pulgadas",
      price: 0,
      available: true
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors).toBeTruthy()
    expect(response.body.errors).toHaveLength(1)
    expect(response.body.errors[0].msg).toBe('Se esperaba un valor numérico mayor a 0')

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')

  })

})

describe('PATCH /api/products/:id', ()=>{
  it('should return a 404 response for a non-existing product', async()=>{
    const productId = 5000
    const response = await request(server).patch(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(`El id:${productId} no generó ninguna respuesta`)

    expect(response.status).not.toBe(200)
    expect(response.body).not.toHaveProperty('data')

  })

  it('should update the product availability', async()=>{
    const response = await request(server).patch('/api/products/1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data.available).toBe(false)

    expect(response.status).not.toBe(404)
    expect(response.status).not.toBe(400)
    expect(response.body).not.toHaveProperty('error')
  })

})

describe('DELETE /api/products/:id', () => {
  it('should check a valid ID', async()=>{
    const response = await request(server).delete('/api/products/not-valid-url')

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    expect(response.body.errors[0].msg).toBe('Id no válido')
  })
  it('should return a 404 response for a non-existent product', async()=>{
    const productId = 5000
    const response = await request(server).delete(`/api/products/${productId}`)

    expect(response.status).toBe(404)
    expect(response.body.error).toBe(`El id:${productId} no generó ninguna respuesta`)

    expect(response.status).not.toBe(200)

  })
  
  it('should delete a product', async()=>{
    const response = await request(server).delete('/api/products/1')
    expect(response.status).toBe(200)
    expect(response.body).toBe('El producto id: 1 se eliminó correctamente')

    expect(response.status).not.toBe(400)
    expect(response.status).not.toBe(404)
  })

})

