const authSecret = process.env.AUTH_SECRET
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

module.exports = app => {

    const signIn = async (req, res) => {
        const auth = req.body

        if(!auth.email || !auth.password) {
            return res.status(400).send({msg: "Favor inserir login e senha!", error: true})
        }
        try {
            const user = await app.db('user').where({email: auth.email}).first()

            if(!user) return res.status(400).send({msg: "Usuário não encontrado"})
            
            const isMatch = bcrypt.compareSync(auth.password, user.password)
            if(!isMatch) return res.status(401).send({msg: "Email ou senha inválido", error: true})
            
            const now = Date.now()

            const payload = {
                id: user.id,
                email: user.email,
                name: user.name,
                iat: now,
                exp: now + (1000 * 60 * 60 * 24)
            }
            
            console.log(payload)
            
            res.json({
                ...payload,
                token: jwt.encode(payload, authSecret)
            })
        }
        catch (err) {
            return res.status(500).send({msg: "erro no servidor!", error: true})
        }
    }

    const validateToken = (req, res) => {
        const userData = req.body || null
        
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp) > new Date()) {
                    return res.status(200).send(true)
                }
            }
        }
        catch(err) {
            return res.send(false)
        }
    } 

    return {signIn, validateToken}
}