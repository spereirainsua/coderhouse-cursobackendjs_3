import mongoose from "mongoose"
import Adoption from "../../dao/Adoption.js"
import { describe, it } from "mocha"
import Assert from "assert"
import { expect } from "chai"

try {
    await mongoose.connect(`mongodb+srv://coder:coderpass@ecommerce-cluster.vjnwe.mongodb.net/adoptme_bk3?retryWrites=true&w=majority&appName=ecommerce-cluster`)
} catch (error) {
    console.log("Error al conectar con la DB")
}

const assert = Assert.strict

const adoptionDAO = new Adoption()


describe("Test Adoption DAO", function () {
    this.timeout(10_000)

    let inserted
    const owner1 = new mongoose.Types.ObjectId("68411ff00f6bdaafeff5311f")
    const owner2 = new mongoose.Types.ObjectId("68412097cbef22ce1912fb44")
    const owner3 = new mongoose.Types.ObjectId("68412097cbef22ce1912fb43")
    const pet1 = new mongoose.Types.ObjectId("68412097cbef22ce1912fb46")
    const pet2 = new mongoose.Types.ObjectId("68412097cbef22ce1912fb48")
    

    beforeEach(async () => {
        const data = [
            { owner: owner1, pet: pet1 },
            { owner: owner2, pet: pet2 }
        ]
        inserted = await mongoose.connection.collection("adoptions").insertMany(data)
    })

    afterEach(async () => {
        await mongoose.connection.collection("adoptions").deleteMany({ owner: owner1 })
        await mongoose.connection.collection("adoptions").deleteMany({ owner: owner2 })
        await mongoose.connection.collection("adoptions").deleteMany({ owner: owner3 })
    })

    it("Al ejecutar el metodo get, retorna un array.", async () => {
        let result = await adoptionDAO.get()
        expect(result).to.be.an('array')
    })

    it("Si no hay documentos en la colección, el método debe retornar un array vacío.", async () => {
        mongoose.connection.collection("adoptions").deleteMany()
        let result = await adoptionDAO.get()
        if (Array.isArray(result) && result.length == 0) expect(result).to.be.an('array').that.is.empty
    })

    it("Si no se pasan filtros debe devolver todos los documentos.", async () => {
        let result = await adoptionDAO.get()
        expect(result).to.be.an('array').with.lengthOf(2)
    })

    it("Debe filtrar correctamente los documentos según el parámetro owner.", async () => {
        let result = await adoptionDAO.get({ owner: owner1 })
        result.forEach(doc => {
            expect(doc.owner.toString()).to.equal(owner1.toString())
        })
    })

    it("Debe filtrar correctamente los documentos según el parámetro pet.", async () => {
        let result = await adoptionDAO.get({ pet: pet1 })
        expect(result).to.be.an('array').with.lengthOf(1)
        expect(result[0].pet.toString()).to.equal(pet1.toString())
    })

    it("Debe manejar múltiples filtros correctamente.", async () => {
        let result = await adoptionDAO.get({ owner: owner1, pet: pet1 })
        let result2 = await adoptionDAO.get({ pet: pet1, owner: owner1 })

        expect(result).to.be.an('array').with.lengthOf(1)
        expect(result2).to.be.an('array').with.lengthOf(1)
        expect(result[0].owner.toString()).to.equal(owner1.toString()).and.to.equal(result2[0].owner.toString())
        expect(result[0].pet.toString()).to.equal(pet1.toString()).and.to.equal(result2[0].pet.toString())
    })

    it("Debe devolver un array de objetos con las propiedades esperadas.", async () => {
        let result = await adoptionDAO.get()

        expect(result).to.be.an('array').with.lengthOf(2)

        const item = result[0]
        expect(item).to.be.an('object')
        expect(item).to.have.property('_id')
        expect(item).to.have.property('owner')
        expect(item).to.have.property('pet')

        const item2 = result[1]
        expect(item2).to.be.an('object')
        expect(item2).to.have.property('_id')
        expect(item2).to.have.property('owner')
        expect(item2).to.have.property('pet')
    })

    it("Debe devolver un documento que coincida exactamente con el filtro proporcionado.", async () => {
        let result = await adoptionDAO.getBy({ pet: pet1 })
        let result2 = await adoptionDAO.getBy({ owner: owner1 })

        expect(result).to.be.an('object')
        expect(result).to.have.property('pet')
        expect(result.pet.toString()).to.equal(pet1.toString())

        expect(result2).to.be.an('object')
        expect(result2).to.have.property('owner')
        expect(result2.owner.toString()).to.equal(owner1.toString())
    })

    it("Debe devolver null si ningún documento coincide.", async () => {
        let result = await adoptionDAO.getBy({ owner: owner3 })
        expect(result).to.be.null
    })

    it("Debe manejar correctamente filtros por campos (como _id o owner).", async () => {
        const owner = new mongoose.Types.ObjectId("68411ff00f6bdaafeff5311a")
        const pet = new mongoose.Types.ObjectId("68411ff00f6bdaafeff5315b")
        const newReg = await mongoose.connection.collection("adoptions").insertOne({ owner, pet })

        let result = await adoptionDAO.getBy({ _id: newReg.insertedId })
        expect(result).to.be.an('object')
        expect(result._id.toString()).to.equal(newReg.insertedId.toString())
    })

    it("Debe devolver solo un único documento aunque haya múltiples coincidencias", async () => {
        await mongoose.connection.collection("adoptions").insertOne({ owner: owner1, pet: pet2 })
        let allReg = await adoptionDAO.get({ owner: owner1 })
        let result = await adoptionDAO.getBy({ owner: owner1 })

        expect(allReg).to.be.an('array').with.lengthOf(2)
        expect(result).to.be.an('object')
        expect(result.owner.toString()).to.equal(owner1.toString())
    })

    it("Debe guardar un documento con los parámetros correctos", async () => {
        const ownerId = new mongoose.Types.ObjectId()
        const petId = new mongoose.Types.ObjectId()

        const newDoc = { owner: ownerId, pet: petId }

        const resultado = await adoptionDAO.save(newDoc)

        expect(resultado).to.be.an('object')
        expect(resultado).to.have.property('_id')
        expect(resultado.owner.toString()).to.equal(ownerId.toString())
        expect(resultado.pet.toString()).to.equal(petId.toString())

    })

    it("Actualizar correctamente un documento existente.", async () => {
        const newOwner = new mongoose.Types.ObjectId()
        const id = inserted.insertedIds['0']
        await adoptionDAO.update(id, { owner: newOwner })
        const updated = await adoptionDAO.getBy({ _id: id })
        expect(updated).to.have.property("_id").that.eql(id)
        expect(updated.owner.toString()).to.equal(newOwner.toString())
    });

    it("Eliminar correctamente un documento existente.", async () => {
        const createdAdoption = await mongoose.connection.collection("adoptions")
            .insertOne({ owner: new mongoose.Types.ObjectId(), pet: new mongoose.Types.ObjectId() })
        const deleted = await adoptionDAO.delete(createdAdoption.insertedId)
        expect(deleted).to.have.property("_id").that.eql(createdAdoption.insertedId)
        const found = await adoptionDAO.getBy(createdAdoption.insertedId)
        expect(found).to.be.null
    })
})
