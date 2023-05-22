//inicialização do server
const express = require('express')
const { google } = require('googleapis')
const server = express()
server.use(express.json())

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

// GET SpreadSheets = pegando planilha
server.get("/metadata", async (req, res) => {

    const { googleSheets, auth, spreadsheetId } = await getAuthGoogleSheets()
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })
    res.send(metadata.data)

})

// Get Rows 
server.get("/getRows", async(req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthGoogleSheets()
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range:'registros-de-materiais-labquim!A2:D1000',
        valueRenderOption: "UNFORMATTED_VALUE",
        dateTimeRenderOption: "FORMATTED_STRING"
    })
    res.send(getRows.data)
})

//TODO Adicionar colunas  
// Post Row
server.post("/addRow", async(req,res)=>{
    
    const { googleSheets, auth, spreadsheetId } = await getAuthGoogleSheets()
    
    const {values} = req.body

    const addRow = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'registros-de-materiais-labquim',
        valueInputOption:'USER_ENTERED',
        resource:{
            values: values,
        },
        
    })
    res.send(addRow.data)
})

// Update Row
//TODO Fazer o update pela linha e coluna {id}

server.post("/updateValue", async (req,res)=>{
    const { googleSheets, auth, spreadsheetId } = await getAuthGoogleSheets()

    const { values } = req.body
    const updateValue = await googleSheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'registros-de-materiais-labquim!A2:D1000',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: values,
        },
    })
    res.send(updateValue.data)
})
//criando porta do servidor

server.listen(3001, () => {
    console.log('Server is running... 3001')
})

//TODO Adicionar method Delete
//TODO Fazer tratamento dos status do server (erros).