module.exports = app => {
    app.route("/usuario")
        .get(app.api.usuario.get)
        .post(app.api.usuario.post)

    app.post("/login", app.api.auth.signIn)    
}