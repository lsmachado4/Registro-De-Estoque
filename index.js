//inicialização do server
const express = require('express')
const { google } = require('googleapis')
const server = express()

// Autenticação do cliente = Auth client
async function getAuthGoogleSheets() {
    //autenticação 
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    // Client
    const client = await auth.getClient()
    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    })
    // ID da planilha = SpreadSheet
    const spreadsheetId = "14azOmdayHLKdND64jzl4FUMoyaaNXKYO_w9YuEk0bk0"
    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
}

// GET
server.get("/metadata", async (req, res) => {

    const { googleSheets, auth, spreadsheetId } = await getAuthGoogleSheets()
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })
    res.send(metadata.data)

})

//criando porta do servidor

server.listen(3001, () => {
    console.log('Server is running... 3001')
})

//TODO Fazer tratamento dos status do server (erros).