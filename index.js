import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/connectdb.js'
import userRoutes from './routes/userRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'

dotenv.config()
const app=express()

const port=process.env.PORT || 8000
const DATABASE_URL=process.env.DATABASE_URL

app.use(cors())

//DATABASE CONNECTION
connectDB(DATABASE_URL)

//JSON
app.use(express.json())
app.listen(port,()=>{
    console.log(`server live on port: ${port}`)
})

app.use("/api/user",userRoutes)
app.use("/api/property",propertyRoutes)