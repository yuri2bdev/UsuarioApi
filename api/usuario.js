const bcrypt = require('bcrypt')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validator
    const get = async (req, res) => {
        try {
            const users = await app.db("user").select("*")
            res.status(200).send([...users])
        }
        /* istanbul ignore catch */
        catch (err) {
            
            res.status(500).send({ msg: "Não foi possível recuperar os dados!", error: true })
        }
    }

    const getById = async (req, res) => {
        const userId = req.params.id
        try {
            const user = await app.db('user').where({ user_id: userId }).first()
            existsOrError(user, "O usuário não foi encontrado!")
            res.status(200).send(user)
        }
        catch (err) {
            res.status(400).send({ msg: err, error: true })
        }
    }

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const post = async (req, res) => {
        let { name, email, password, confirmPassword } = req.body
        try {
            existsOrError(name, 'Nome não informado')
            existsOrError(email, 'Email não informado')
            existsOrError(password, 'Senha não informada')
            equalsOrError(password, confirmPassword, 'As senhas não conferem')

            const userDB = await app.db("user")
                .where({ email })
                .first()

            notExistsOrError(userDB, 'Email já cadastrado')

            password = encryptPassword(password)

            const savedUser = await app.db('user').insert({ name, email, password, created_at: new Date().toISOString().replace('Z', '').replace('T', ' ') })

            res.status(201).json({ msg: "Criado com sucesso!", savedUser: savedUser })

        }
        catch (err) {
            res.status(400).json({ msg: err, error: true })
        }


    }

    const put = async (req, res) => {
        const user = req.body
        const user_id = req.params.id
        let validInfo = false
        try {
            existsOrError(user_id, "usuário não existe")
            existsOrError(user.name, "nome indefinido")
            existsOrError(user.email, "email indefinido")
            validInfo = true
            const updatedUser = await app.db('user')
                .update({ name: user.name, email: user.email, updated_at: new Date().toISOString().replace('Z', '').replace('T', ' ') })
                .where({ user_id })
            existsOrError(updatedUser, "Usuário não encontrado")
            res.status(200).json({ msg: "Atualização bem sucedida", updatedUser: user_id })
        }
        catch (err) {
            res.status(400).json({ msg: err, error: true })
        }
    }

    const remove = async (req, res) => {
        const user_id = req.params.id

        try {
            existsOrError(user_id, "Usuário não informado")
            const removedUser = await app.db('user')
                .update({ deleted_at: new Date().toISOString().replace('Z', '').replace('T', ' ') })
                .where({ user_id })
            existsOrError(removedUser, 'Usuário não encontrado!')

            res.status(204).send()
        }
        catch (err) {
            res.status(400).json({ msg: err, error: true })
        }
    }

    return { get, getById, post, put, remove }
}