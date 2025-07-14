import { describe, it } from "mocha"
import chai from 'chai'
import supertest from 'supertest'
import mongoose, { mongo } from "mongoose"

const expect = chai.expect
const requester = supertest('http://localhost:8080')

try {
    await mongoose.connect(`mongodb+srv://coder:coderpass@ecommerce-cluster.vjnwe.mongodb.net/adoptme_bk3?retryWrites=true&w=majority&appName=ecommerce-cluster`)
} catch (error) {
    console.log("Error al conectar con la DB")
}

describe("Testing funcional de Adoptme", function () {
    this.timeout(10_000)
    let user, pet
    before(async () => {
        const result = await requester.post('/api/mocks/generateData?users=1&pets=1')
        user = result._body[0]
        pet = result._body[1]
        user._id = new mongoose.Types.ObjectId(user._id)
        pet._id = new mongoose.Types.ObjectId(pet._id)
    })

    this.afterAll(async () => {
        await mongoose.connection.collection('users').deleteOne({ _id: user._id })
        await mongoose.connection.collection('pets').deleteOne({ _id: pet._id })
        await mongoose.connection.collection('adoptions').deleteOne({ owner: user._id, pet: pet._id })
    })

    it('Debería responder con un array de adopciones.', async () => {
        const res = await requester.get('/api/adoptions')
        expect(res.status).to.equal(200)
        expect(res._body).to.have.property('status', 'success')
        expect(res._body).to.have.property('payload').that.is.an('array')
    })

    it('Debería crear una nueva adopción.', async () => {
        const res = await requester.post(`/api/adoptions/${user._id}/${pet._id}`)
        expect(res.status).to.equal(200)
        expect(res._body).to.have.property('status', 'success')
        expect(res._body).to.have.property('message', 'Pet adopted')
    })


    it('Debería obtener una adopción por ID.', async () => {
        const adopt = await mongoose.connection.collection("adoptions")
            .findOne({ owner: user._id, pet: pet._id })
        const result = await requester.get(`/api/adoptions/${adopt._id}`)

        const aid = result._body.payload._id
        expect(result.status).to.equal(200)
        expect(result._body.payload).to.have.property('_id', aid)
    })


    it('Debería responder 404 si la adopción no existe.', async () => {
        const fakeId = new mongoose.Types.ObjectId()
        const res = await requester.get(`/api/adoptions/${fakeId}`)
        expect(res.status).to.equal(404)
        expect(res._body).to.have.property('status', 'error')
        expect(res._body).to.have.property('error', 'Adoption not found')
    })

    it('Debería responder 404 si el usuario no existe al crear adopción.', async () => {
        const fakeUserId = new mongoose.Types.ObjectId()
        const res = await requester.post(`/api/adoptions/${fakeUserId}/${pet._id}`)
        expect(res.status).to.equal(404)
        expect(res._body).to.have.property('status', 'error')
        expect(res._body).to.have.property('error', 'user Not found')
    })

    it('Debería responder 404 si la mascota no existe al crear adopción.', async () => {
        const fakePetId = new mongoose.Types.ObjectId()
        const res = await requester.post(`/api/adoptions/${user._id}/${fakePetId}`)
        expect(res.status).to.equal(404)
        expect(res.body).to.have.property('status', 'error')
        expect(res.body).to.have.property('error', 'Pet not found')
    })

    it('Debería responder 400 si la mascota ya está adoptada.', async () => {
        const res = await requester.post(`/api/adoptions/${user._id}/${pet._id}`)
        expect(res.status).to.equal(400)
        expect(res._body).to.have.property('status', 'error')
        expect(res._body).to.have.property('error', 'Pet is already adopted')
    })
})